// Shared data types used across main and renderer processes

export interface Product {
  id: string
  name: string
  price: string
  category: string       // e.g. "Grab & Go", "Sauces", etc. Empty string = uncategorised.
  servingInfo: string
  nutritionInfo: string
  cookingInstructions: string
  customerName: string
  labelBackgroundColor: string
  ingredients: string
  allergenStatement: string
  barcodeValue: string
  barcodeType: 'CODE128'
  barcodeImagePath: string | null
  logoImagePath: string | null
  templateId: string
  showPrice: boolean
  showBarcode: boolean
  showCookingInstructions: boolean
  showProductName?: boolean // absent = shown; toggleable only on custom artwork templates
  designImageOverrides?: Record<string, string> | null // design image element id → per-label image path
  tillieProductId: string | null // linked Tillie POS product; Tillie owns name/price/category when set
  createdAt: string
  updatedAt: string
}

export interface AppSettings {
  currency: string           // e.g. "USD"
  barcodeType: 'CODE128'
  exportFolder: string       // absolute path
  templateId: string         // e.g. "avery5821"
  pricePrefix: string        // e.g. "$"
  sheetOffsetXIn: string     // printer calibration offset, inches
  sheetOffsetYIn: string     // printer calibration offset, inches
  pageBackgroundColor: string
  labelBackgroundColor: string
  titleFontId: string
  priceFontId: string
  bodyFontId: string
  rollPrinterName: string // '' = ask via system print dialog
  rollLabelWidthIn: string // roll media width, inches
  rollLabelHeightIn: string // roll media height, inches
}

export interface PrinterInfo {
  name: string
  displayName: string
  isDefault: boolean
}

export interface LabelTemplate {
  id: string
  name: string
}

export interface SheetSlot {
  slot: number               // 1-8
  productId: string | null
  copies: number
}

export interface ExportOptions {
  startSlot: number          // 1-8
  slots: Array<{ productId: string; copies: number }>
}

export type IpcResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string }

// ── Tillie POS sync ──────────────────────────────────────────────────────────

export interface TillieCategory {
  id: string
  name: string
  color: string
  sortOrder: number
}

export interface TillieConfig {
  baseUrl: string
  // When set, connect straight to Tillie's MongoDB Atlas database instead of
  // the register's HTTP API — works from any computer with internet access.
  mongoUri: string
  mongoDb: string
  // Stored as {id, name} pairs; names are re-resolved by id on each sync so
  // category renames in Tillie don't break the subscription.
  subscribedCategories: Array<{ id: string; name: string }>
  includedProductIds: string[] // cherry-picked products outside subscribed categories
  excludedProductIds: string[] // opted-out products inside subscribed categories
  autoSyncOnLaunch: boolean
  lastSyncAt: string | null
  connectedUserName: string | null
}

export interface TillieProductSummary {
  id: string
  name: string
  price: number
  barcode: string
  category: string
  linked: boolean // already linked to a local label
  inScope: boolean // would be pulled in by the next sync
}

export interface TillieSyncSummary {
  created: number
  updated: number
  unchanged: number
  pushed: number // labels created as new Tillie products
  pushSkipped: string[] // label names that couldn't be pushed (e.g. unparseable price)
  duplicateBarcodes: string[]
}
