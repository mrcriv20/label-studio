/**
 * Tillie POS integration — pulls categories and products from a locally
 * running Tillie register app so linked labels stay in sync with the
 * store's live inventory (price/name/category).
 *
 * Tillie is the source of truth for shared fields on linked labels.
 * Label-only fields (ingredients, template, fonts, etc.) are never touched.
 */
import { app } from 'electron'
import { join } from 'path'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { nanoid } from 'nanoid'
import { MongoClient } from 'mongodb'
import type {
  Product,
  TillieCategory,
  TillieConfig,
  TillieProductSummary,
  TillieSyncSummary,
} from './types'
import { listProducts, createProduct, updateProduct, getSettings } from './database'

// Tillie session tokens live for 12h; refresh a little early.
const TOKEN_TTL_MS = 11.5 * 60 * 60 * 1000
const FETCH_TIMEOUT_MS = 6000

interface StoredConfig extends TillieConfig {
  token: string | null
  tokenExpiresAt: number | null // epoch ms
}

const DEFAULTS: StoredConfig = {
  baseUrl: 'http://127.0.0.1:3000',
  mongoUri: '',
  mongoDb: 'pos',
  subscribedCategories: [],
  includedProductIds: [],
  excludedProductIds: [],
  autoSyncOnLaunch: true,
  lastSyncAt: null,
  connectedUserName: null,
  token: null,
  tokenExpiresAt: null,
}

let _config: StoredConfig | null = null

function configPath(): string {
  return join(app.getPath('userData'), 'tillie.json')
}

function loadConfig(): StoredConfig {
  if (_config) return _config
  if (existsSync(configPath())) {
    try {
      _config = { ...DEFAULTS, ...JSON.parse(readFileSync(configPath(), 'utf8')) }
    } catch {
      _config = { ...DEFAULTS }
    }
  } else {
    _config = { ...DEFAULTS }
  }
  return _config!
}

function saveConfig(): void {
  writeFileSync(configPath(), JSON.stringify(_config, null, 2), 'utf8')
}

// The renderer never sees the session token.
function publicConfig(): TillieConfig {
  const { token: _t, tokenExpiresAt: _e, ...rest } = loadConfig()
  return rest
}

export function getTillieConfig(): TillieConfig {
  return publicConfig()
}

export function setTillieConfig(patch: Partial<TillieConfig>): TillieConfig {
  const cfg = loadConfig()
  const allowed: Array<keyof TillieConfig> = [
    'baseUrl',
    'mongoUri',
    'mongoDb',
    'subscribedCategories',
    'includedProductIds',
    'excludedProductIds',
    'autoSyncOnLaunch',
  ]
  for (const key of allowed) {
    if (key in patch) (cfg as unknown as Record<string, unknown>)[key] = patch[key]
  }
  cfg.baseUrl = cfg.baseUrl.trim().replace(/\/+$/, '') || DEFAULTS.baseUrl
  cfg.mongoUri = cfg.mongoUri.trim()
  cfg.mongoDb = cfg.mongoDb.trim() || DEFAULTS.mongoDb
  saveConfig()
  return publicConfig()
}

/** Called when a linked label is deleted so the next sync doesn't recreate it. */
export function excludeTillieProduct(tillieProductId: string): void {
  const cfg = loadConfig()
  if (!cfg.excludedProductIds.includes(tillieProductId)) {
    cfg.excludedProductIds.push(tillieProductId)
  }
  cfg.includedProductIds = cfg.includedProductIds.filter((id) => id !== tillieProductId)
  saveConfig()
}

// ── HTTP ─────────────────────────────────────────────────────────────────────

interface TillieResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

async function fetchTillie<T>(path: string, init: RequestInit = {}, auth = false): Promise<T> {
  const cfg = loadConfig()
  if (auth) {
    if (!cfg.token || !cfg.tokenExpiresAt || Date.now() > cfg.tokenExpiresAt) {
      throw new Error('Not connected to Tillie. Enter your Tillie PIN in Settings to connect.')
    }
    init.headers = { ...init.headers, Authorization: `Bearer ${cfg.token}` }
  }
  if (init.body) {
    init.headers = { 'Content-Type': 'application/json', ...init.headers }
  }

  let res: Response
  try {
    res = await fetch(`${cfg.baseUrl}${path}`, {
      ...init,
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    })
  } catch {
    throw new Error(`Tillie isn't reachable at ${cfg.baseUrl}. Is the register app running?`)
  }

  if (res.status === 401 || res.status === 403) {
    cfg.token = null
    cfg.tokenExpiresAt = null
    cfg.connectedUserName = null
    saveConfig()
    throw new Error('Tillie session expired. Reconnect with your PIN in Settings.')
  }

  let body: TillieResponse<T>
  try {
    body = (await res.json()) as TillieResponse<T>
  } catch {
    throw new Error(`Tillie returned an unexpected response (HTTP ${res.status}).`)
  }
  if (!res.ok || body.success === false) {
    throw new Error(body.error || body.message || `Tillie request failed (HTTP ${res.status}).`)
  }
  return (body.data ?? body) as T
}

// ── Direct database mode ─────────────────────────────────────────────────────
// Tillie's data lives in MongoDB Atlas (cloud), so this app can read/write it
// directly over the internet without reaching the register machine. Active
// whenever a connection string is configured; otherwise HTTP mode is used.

let _mongo: MongoClient | null = null
let _mongoKey = ''

function usesDb(): boolean {
  return Boolean(loadConfig().mongoUri)
}

async function tillieDb() {
  const cfg = loadConfig()
  const key = `${cfg.mongoUri}|${cfg.mongoDb}`
  if (_mongo && _mongoKey !== key) {
    await _mongo.close().catch(() => {})
    _mongo = null
  }
  if (!_mongo) {
    try {
      const client = new MongoClient(cfg.mongoUri, { serverSelectionTimeoutMS: 8000 })
      await client.connect()
      _mongo = client
      _mongoKey = key
    } catch {
      throw new Error(
        "Couldn't connect to Tillie's database. Check the connection string, this computer's internet connection, and that its IP is allowed under Network Access in MongoDB Atlas."
      )
    }
    // The database name isn't in the connection string, and the Atlas user is
    // often scoped to a single database whose name we can't guess (e.g.
    // "pos-dev" rather than the default "pos"). If the configured name isn't
    // among the databases this user can see and there is exactly one
    // candidate, adopt it.
    try {
      const listing = await _mongo.db().admin().listDatabases({ nameOnly: true })
      const names = listing.databases
        .map((d) => d.name)
        .filter((n) => !['admin', 'local', 'config'].includes(n))
      const configured = cfg.mongoDb || 'pos'
      if (!names.includes(configured) && names.length === 1) {
        cfg.mongoDb = names[0]
        saveConfig()
      }
    } catch {
      // Listing may be denied; stick with the configured name.
    }
  }
  return _mongo.db(loadConfig().mongoDb || 'pos')
}

// Mirror of Tillie's db mapper: Mongo's _id becomes the app-level string id.
function toApp<T>(doc: Record<string, unknown>): T {
  const { _id, ...rest } = doc
  return { id: String(_id), ...rest } as T
}

// ── API calls ────────────────────────────────────────────────────────────────

interface TillieRemoteProduct {
  id: string
  name: string
  price: number
  category: string
  barcode?: string
  sku?: string
  isActive?: boolean
}

export async function tillieLogin(pin: string): Promise<TillieConfig> {
  const cfg = loadConfig()
  let res: Response
  try {
    res = await fetch(`${cfg.baseUrl}/api/auth/pin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    })
  } catch {
    throw new Error(`Tillie isn't reachable at ${cfg.baseUrl}. Is the register app running?`)
  }
  const body = (await res.json().catch(() => null)) as
    | { success: boolean; token?: string | null; user?: { name?: string }; error?: string }
    | null
  if (!body || !body.success) {
    throw new Error(body?.error || 'Tillie login failed.')
  }
  if (!body.token) {
    // Tillie signs tokens only when TILLIE_SESSION_SECRET is set; without it
    // the API is open and no token is needed.
    cfg.token = null
    cfg.tokenExpiresAt = null
  } else {
    cfg.token = body.token
    cfg.tokenExpiresAt = Date.now() + TOKEN_TTL_MS
  }
  cfg.connectedUserName = body.user?.name || 'Tillie user'
  saveConfig()
  return publicConfig()
}

export function tillieDisconnect(): TillieConfig {
  const cfg = loadConfig()
  cfg.token = null
  cfg.tokenExpiresAt = null
  cfg.connectedUserName = null
  saveConfig()
  return publicConfig()
}

export async function tillieCategories(): Promise<TillieCategory[]> {
  let cats: TillieCategory[]
  if (usesDb()) {
    const db = await tillieDb()
    const docs = await db.collection('categories').find({}).toArray()
    cats = docs.map((d) => toApp<TillieCategory>(d))
  } else {
    cats = await fetchTillie<TillieCategory[]>('/api/categories')
  }
  return [...cats].sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
}

async function tillieProducts(): Promise<TillieRemoteProduct[]> {
  if (usesDb()) {
    const db = await tillieDb()
    const docs = await db.collection('products').find({}).toArray()
    return docs.map((d) => toApp<TillieRemoteProduct>(d))
  }
  const cfg = loadConfig()
  const needsAuth = Boolean(cfg.token)
  return fetchTillie<TillieRemoteProduct[]>('/api/products', {}, needsAuth)
}

/** Create a product in Tillie; returns its new id. */
async function createTillieProduct(doc: Record<string, unknown>): Promise<string> {
  if (usesDb()) {
    const db = await tillieDb()
    const result = await db.collection('products').insertOne({ ...doc })
    return String(result.insertedId)
  }
  const cfg = loadConfig()
  const created = await fetchTillie<TillieRemoteProduct>(
    '/api/products',
    { method: 'POST', body: JSON.stringify(doc) },
    Boolean(cfg.token)
  )
  return created.id
}

// ── Scope + sync ─────────────────────────────────────────────────────────────

function formatPrice(price: number): string {
  const prefix = getSettings().pricePrefix
  return `${prefix}${price.toFixed(2)}`
}

/** "$4.99/lb" → 4.99; null if no number can be found. */
function parsePrice(price: string): number | null {
  const match = price.match(/\d+(?:\.\d+)?/)
  if (!match) return null
  const n = Number.parseFloat(match[0])
  return Number.isFinite(n) ? n : null
}

function generateBarcode(): string {
  const num = Math.floor(Math.random() * 900000000000) + 100000000000
  return String(num)
}

interface ScopeContext {
  // Tillie products store either the category id or its name in `category`
  // (the data has both forms), so subscriptions match on either.
  subscribedKeys: Set<string>
  categoryNameById: Map<string, string>
  included: Set<string>
  excluded: Set<string>
  linkedByTillieId: Map<string, Product>
  localByBarcode: Map<string, Product>
}

/** Resolve a remote product's category (id or name) to a display name. */
function categoryName(p: TillieRemoteProduct, scope: ScopeContext): string {
  return scope.categoryNameById.get(p.category) ?? p.category ?? ''
}

function buildScope(categories: TillieCategory[]): ScopeContext {
  const cfg = loadConfig()

  // Re-resolve subscribed category names by id (rename-proof).
  const byId = new Map(categories.map((c) => [c.id, c]))
  let renamed = false
  cfg.subscribedCategories = cfg.subscribedCategories.map((sub) => {
    const current = byId.get(sub.id)
    if (current && current.name !== sub.name) {
      renamed = true
      return { id: sub.id, name: current.name }
    }
    return sub
  })
  if (renamed) saveConfig()

  const locals = listProducts()
  const linkedByTillieId = new Map<string, Product>()
  const localByBarcode = new Map<string, Product>()
  for (const p of locals) {
    if (p.tillieProductId) linkedByTillieId.set(p.tillieProductId, p)
    if (p.barcodeValue && !localByBarcode.has(p.barcodeValue)) {
      localByBarcode.set(p.barcodeValue, p)
    }
  }

  return {
    subscribedKeys: new Set(
      cfg.subscribedCategories.flatMap((c) => [c.id, c.name])
    ),
    categoryNameById: new Map(categories.map((c) => [c.id, c.name])),
    included: new Set(cfg.includedProductIds),
    excluded: new Set(cfg.excludedProductIds),
    linkedByTillieId,
    localByBarcode,
  }
}

function isInScope(p: TillieRemoteProduct, scope: ScopeContext): boolean {
  if (p.isActive === false) return false
  if (scope.excluded.has(p.id)) return false
  return (
    scope.subscribedKeys.has(p.category) ||
    scope.included.has(p.id) ||
    scope.linkedByTillieId.has(p.id)
  )
}

/** All Tillie products with linkage/scope flags, for the picker UI. */
export async function tillieListProducts(): Promise<TillieProductSummary[]> {
  const [categories, remote] = await Promise.all([tillieCategories(), tillieProducts()])
  const scope = buildScope(categories)
  return remote
    .filter((p) => p.isActive !== false)
    .map((p) => ({
      id: p.id,
      name: p.name,
      price: Number(p.price) || 0,
      barcode: p.barcode || p.sku || '',
      category: categoryName(p, scope),
      linked: scope.linkedByTillieId.has(p.id),
      inScope: isInScope(p, scope),
    }))
    .sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))
}

/**
 * Pull in-scope Tillie products: update linked labels whose shared fields
 * changed, link unlinked labels by barcode, and create skeleton labels for
 * new products.
 */
export async function tillieSync(): Promise<TillieSyncSummary> {
  const [categories, remote] = await Promise.all([tillieCategories(), tillieProducts()])
  const scope = buildScope(categories)
  const cfg = loadConfig()
  const settings = getSettings()

  const summary: TillieSyncSummary = {
    created: 0,
    updated: 0,
    unchanged: 0,
    pushed: 0,
    pushSkipped: [],
    duplicateBarcodes: [],
  }

  // If Tillie has duplicate active products on one barcode, sync the first
  // and report the rest rather than guessing.
  const seenBarcodes = new Set<string>()

  for (const p of remote) {
    if (!isInScope(p, scope)) continue
    if (p.barcode) {
      if (seenBarcodes.has(p.barcode)) {
        if (!summary.duplicateBarcodes.includes(p.barcode)) {
          summary.duplicateBarcodes.push(p.barcode)
        }
        continue
      }
      seenBarcodes.add(p.barcode)
    }

    const price = formatPrice(Number(p.price) || 0)
    const barcode = p.barcode || p.sku || ''
    const catName = categoryName(p, scope)
    const local =
      scope.linkedByTillieId.get(p.id) ??
      (barcode ? scope.localByBarcode.get(barcode) : undefined)

    if (local) {
      const needsLink = local.tillieProductId !== p.id
      const changed =
        needsLink ||
        local.name !== p.name ||
        local.price !== price ||
        local.category !== catName
      if (!changed) {
        summary.unchanged++
        continue
      }
      updateProduct({
        ...local,
        name: p.name,
        price,
        category: catName,
        tillieProductId: p.id,
        updatedAt: new Date().toISOString(),
      })
      summary.updated++
    } else {
      const now = new Date().toISOString()
      createProduct({
        id: nanoid(),
        name: p.name,
        price,
        category: catName,
        servingInfo: '',
        nutritionInfo: '',
        cookingInstructions: '',
        customerName: '',
        labelBackgroundColor: '',
        ingredients: '',
        allergenStatement: '',
        barcodeValue: barcode || generateBarcode(),
        barcodeType: 'CODE128',
        barcodeImagePath: null,
        logoImagePath: null,
        templateId: settings.templateId,
        showPrice: true,
        showBarcode: true,
        showCookingInstructions: true,
        tillieProductId: p.id,
        createdAt: now,
        updatedAt: now,
      })
      summary.created++
    }
  }

  // ── Push: labels not yet in Tillie become new POS products ────────────────
  // Re-list after the pull phase so freshly linked labels aren't re-pushed.
  const remoteByBarcode = new Map<string, TillieRemoteProduct>()
  for (const p of remote) {
    if (p.isActive === false) continue
    const code = p.barcode || p.sku
    if (code && !remoteByBarcode.has(code)) remoteByBarcode.set(code, p)
  }
  const categoryIdByName = new Map(categories.map((c) => [c.name, c.id]))

  for (const local of listProducts()) {
    if (local.tillieProductId) continue
    if (!local.name.trim()) continue

    // Tillie already has this barcode — link instead of creating a duplicate.
    const existing = local.barcodeValue ? remoteByBarcode.get(local.barcodeValue) : undefined
    if (existing) {
      updateProduct({
        ...local,
        name: existing.name,
        price: formatPrice(Number(existing.price) || 0),
        category: categoryName(existing, scope),
        tillieProductId: existing.id,
        updatedAt: new Date().toISOString(),
      })
      summary.updated++
      continue
    }

    const price = parsePrice(local.price)
    if (price === null) {
      summary.pushSkipped.push(local.name)
      continue
    }

    // Tillie's product data references categories by id, so resolve the
    // label's category name to its id when one exists.
    const createdId = await createTillieProduct({
      name: local.name,
      price,
      category: categoryIdByName.get(local.category) ?? local.category,
      barcode: local.barcodeValue,
      sku: local.barcodeValue,
      imageUrl: '',
      taxable: false,
      isActive: true,
      sortOrder: 0,
      stock: 0,
      allowAddWhenOutOfStock: true,
      lastModified: new Date().toISOString(),
    })
    updateProduct({ ...local, tillieProductId: createdId, updatedAt: new Date().toISOString() })
    summary.pushed++
  }

  cfg.lastSyncAt = new Date().toISOString()
  saveConfig()
  return summary
}
