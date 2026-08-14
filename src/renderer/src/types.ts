// Mirror of src/main/types.ts — kept in sync manually.
// The preload bridge serialises these over the IPC boundary.

export interface Product {
  id: string
  name: string
  price: string
  category: string
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
  tillieProductId: string | null
  createdAt: string
  updatedAt: string
}

export interface TillieCategory {
  id: string
  name: string
  color: string
  sortOrder: number
}

export interface TillieConfig {
  baseUrl: string
  mongoUri: string
  mongoDb: string
  subscribedCategories: Array<{ id: string; name: string }>
  includedProductIds: string[]
  excludedProductIds: string[]
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
  linked: boolean
  inScope: boolean
}

export interface TillieSyncSummary {
  created: number
  updated: number
  unchanged: number
  pushed: number
  pushSkipped: string[]
  duplicateBarcodes: string[]
}

export interface AppSettings {
  currency: string
  barcodeType: 'CODE128'
  exportFolder: string
  templateId: string
  pricePrefix: string
  sheetOffsetXIn: string
  sheetOffsetYIn: string
  pageBackgroundColor: string
  labelBackgroundColor: string
  titleFontId: string
  priceFontId: string
  bodyFontId: string
  rollPrinterName: string
  rollLabelWidthIn: string
  rollLabelHeightIn: string
}

export interface PrinterInfo {
  name: string
  displayName: string
  isDefault: boolean
}

export interface FontAsset {
  id: string
  family: string
  source: 'bundled' | 'local' | 'upload' | 'google'
  dataUri: string
}

export interface LabelTemplate {
  id: string
  name: string
}

export type IpcResult<T> = { ok: true; data: T } | { ok: false; error: string }

import type { DesignTemplate } from '../../shared/design/types'
export type { DesignTemplate }

// Declared globally so TypeScript knows about window.api
declare global {
  interface Window {
    api: {
      design: {
        list(): Promise<IpcResult<DesignTemplate[]>>
        get(id: string): Promise<IpcResult<DesignTemplate>>
        save(design: DesignTemplate): Promise<IpcResult<DesignTemplate>>
        delete(id: string): Promise<IpcResult<boolean>>
        duplicate(id: string): Promise<IpcResult<DesignTemplate>>
        importImage(): Promise<IpcResult<{ assetName: string; dataUri: string } | null>>
        assetDataUri(assetName: string): Promise<IpcResult<string>>
        pickSlotImage(productId: string, elementId: string): Promise<IpcResult<string | null>>
        exportFile(design: DesignTemplate): Promise<IpcResult<string | null>>
        importFile(): Promise<IpcResult<DesignTemplate | null>>
      }
      product: {
        list(): Promise<IpcResult<Product[]>>
        get(id: string): Promise<IpcResult<Product>>
        create(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<IpcResult<Product>>
        update(product: Product): Promise<IpcResult<Product>>
        delete(id: string): Promise<IpcResult<boolean>>
        duplicate(id: string): Promise<IpcResult<Product>>
        importSpreadsheet(): Promise<IpcResult<{ imported: number; skipped: string[] } | null>>
      }
      settings: {
        get(): Promise<IpcResult<AppSettings>>
        set(key: string, value: string): Promise<IpcResult<boolean>>
        setMany(patch: Partial<Record<keyof AppSettings, string>>): Promise<IpcResult<boolean>>
      }
      file: {
        pickBarcodeImage(): Promise<IpcResult<string | null>>
        saveBarcodeImage(sourcePath: string, productId: string): Promise<IpcResult<string>>
        pickLogoImage(): Promise<IpcResult<string | null>>
        saveLogoImage(sourcePath: string, productId: string): Promise<IpcResult<string>>
        readImageAsBase64(filePath: string): Promise<IpcResult<string>>
        deleteManagedImage(filePath: string): Promise<IpcResult<boolean>>
        getTemplatePNG(templateId?: string | null): Promise<IpcResult<string>>
        listTemplates(): Promise<IpcResult<LabelTemplate[]>>
        pickTemplateImage(): Promise<IpcResult<string | null>>
        saveTemplateImage(sourcePath: string): Promise<IpcResult<LabelTemplate>>
        deleteTemplate(templateId: string): Promise<IpcResult<boolean>>
        pickExportFolder(): Promise<IpcResult<string | null>>
      }
      font: {
        list(): Promise<IpcResult<FontAsset[]>>
        importLocal(): Promise<IpcResult<FontAsset | null>>
        upload(): Promise<IpcResult<FontAsset | null>>
        addGoogle(family: string): Promise<IpcResult<FontAsset>>
      }
      export: {
        singlePDF(product: Product): Promise<IpcResult<string | null>>
        singleSVG(product: Product): Promise<IpcResult<string | null>>
        sheetPDF(slots: Array<Product | null>): Promise<IpcResult<string | null>>
      }
      output: {
        preflight(entries: Array<{ product: Product; slot?: number }>): Promise<IpcResult<Array<{
          field: keyof Product
          label: string
          status: 'tight' | 'clipped'
          message: string
          productId?: string
          productName: string
          slot?: number
        }>>>
      }
      print: {
        sheet(slots: Array<Product | null>): Promise<IpcResult<boolean>>
        calibrationSheet(): Promise<IpcResult<boolean>>
        listPrinters(): Promise<IpcResult<PrinterInfo[]>>
        rollLabel(
          product: Product,
          opts: { printerName: string; widthIn: number; heightIn: number; copies: number }
        ): Promise<IpcResult<boolean>>
      }
      tillie: {
        getConfig(): Promise<IpcResult<TillieConfig>>
        setConfig(patch: Partial<TillieConfig>): Promise<IpcResult<TillieConfig>>
        login(pin: string): Promise<IpcResult<TillieConfig>>
        disconnect(): Promise<IpcResult<TillieConfig>>
        getCategories(): Promise<IpcResult<TillieCategory[]>>
        listProducts(): Promise<IpcResult<TillieProductSummary[]>>
        sync(): Promise<IpcResult<TillieSyncSummary>>
      }
    }
  }
}
