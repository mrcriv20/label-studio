// Shared data types used across main and renderer processes

export interface Product {
  id: string
  name: string
  price: string
  barcodeValue: string
  barcodeType: 'CODE128'
  barcodeImagePath: string | null
  templateId: string
  createdAt: string
  updatedAt: string
}

export interface AppSettings {
  currency: string           // e.g. "USD"
  barcodeType: 'CODE128'
  exportFolder: string       // absolute path
  templateId: string         // e.g. "avery5821"
  pricePrefix: string        // e.g. "$"
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
