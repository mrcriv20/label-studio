/**
 * Pure-JS persistence layer using electron-store (JSON file backend).
 * No native compilation required — works with any Electron/Node version.
 */
import { app } from 'electron'
import { join } from 'path'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import type { Product, AppSettings } from './types'

// We use a manual JSON file instead of electron-store's CJS/ESM quirks.
// electron-store uses ESM in v9+; we write JSON directly for simplicity.

const DATA_DIR = () => app.getPath('userData')

function dbPath(): string {
  return join(DATA_DIR(), 'products.json')
}

function settingsPath(): string {
  return join(DATA_DIR(), 'settings.json')
}

interface DB {
  products: Product[]
}

let _db: DB = { products: [] }
let _settings: AppSettings | null = null

export function initDatabase(): void {
  const p = dbPath()
  if (existsSync(p)) {
    try {
      _db = JSON.parse(readFileSync(p, 'utf8'))
    } catch {
      _db = { products: [] }
    }
  }
  loadSettings()
  const normalised = _db.products.map((product) => normalizeProduct(product))
  const changed = JSON.stringify(normalised) !== JSON.stringify(_db.products)
  _db = { products: normalised }
  if (changed) saveDB()
}

function saveDB(): void {
  writeFileSync(dbPath(), JSON.stringify(_db, null, 2), 'utf8')
}

function loadSettings(): void {
  const p = settingsPath()
  const defaults: AppSettings = {
    currency: 'USD',
    barcodeType: 'CODE128',
    exportFolder: app.getPath('desktop'),
    templateId: 'avery5821',
    pricePrefix: '$',
    sheetOffsetXIn: '0',
    sheetOffsetYIn: '0',
    pageBackgroundColor: '#f4f5f7',
    labelBackgroundColor: '',
    titleFontId: 'bundled:lora',
    priceFontId: 'bundled:genty',
    bodyFontId: 'bundled:avenir',
  }
  if (existsSync(p)) {
    try {
      _settings = { ...defaults, ...JSON.parse(readFileSync(p, 'utf8')) }
    } catch {
      _settings = defaults
    }
  } else {
    _settings = defaults
    writeFileSync(p, JSON.stringify(defaults, null, 2), 'utf8')
  }
}

function saveSettings(): void {
  writeFileSync(settingsPath(), JSON.stringify(_settings, null, 2), 'utf8')
}

// ── Products ─────────────────────────────────────────────────────────────────

export function listProducts(): Product[] {
  return [..._db.products].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
}

export function getProduct(id: string): Product | null {
  return _db.products.find((p) => p.id === id) ?? null
}

export function createProduct(p: Product): void {
  _db.products.push(normalizeProduct(p))
  saveDB()
}

export function updateProduct(updated: Product): void {
  const idx = _db.products.findIndex((p) => p.id === updated.id)
  if (idx !== -1) {
    _db.products[idx] = normalizeProduct(updated)
  } else {
    _db.products.push(normalizeProduct(updated))
  }
  saveDB()
}

export function deleteProduct(id: string): void {
  _db.products = _db.products.filter((p) => p.id !== id)
  saveDB()
}

// ── Settings ──────────────────────────────────────────────────────────────────

export function getSettings(): AppSettings {
  return _settings!
}

export function setSetting(key: string, value: string): void {
  _settings = { ..._settings!, [key]: value } as AppSettings
  saveSettings()
}

function normalizeProduct(product: Product): Product {
  const now = new Date().toISOString()
  return {
    id: product.id,
    name: product.name ?? '',
    price: product.price ?? '',
    category: product.category ?? '',
    servingInfo: product.servingInfo ?? '',
    nutritionInfo: product.nutritionInfo ?? '',
    cookingInstructions: product.cookingInstructions ?? '',
    customerName: product.customerName ?? '',
    labelBackgroundColor: product.labelBackgroundColor ?? '',
    ingredients: product.ingredients ?? '',
    allergenStatement: product.allergenStatement ?? '',
    barcodeValue: product.barcodeValue ?? '',
    barcodeType: 'CODE128',
    barcodeImagePath: product.barcodeImagePath ?? null,
    logoImagePath: product.logoImagePath ?? null,
    templateId: product.templateId || _settings?.templateId || 'avery5821',
    showPrice: product.showPrice ?? true,
    showBarcode: product.showBarcode ?? true,
    showCookingInstructions: product.showCookingInstructions ?? true,
    createdAt: product.createdAt ?? now,
    updatedAt: product.updatedAt ?? now,
  }
}
