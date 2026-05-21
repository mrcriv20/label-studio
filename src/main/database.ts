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
  _db.products.push(p)
  saveDB()
}

export function updateProduct(updated: Product): void {
  const idx = _db.products.findIndex((p) => p.id === updated.id)
  if (idx !== -1) {
    _db.products[idx] = updated
  } else {
    _db.products.push(updated)
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
