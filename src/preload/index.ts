import { contextBridge, ipcRenderer } from 'electron'
import type {
  Product,
  AppSettings,
  LabelTemplate,
  TillieCategory,
  TillieConfig,
  TillieProductSummary,
  TillieSyncSummary,
} from '../main/types'
import type { DesignTemplate } from '../shared/design/types'

type IpcResult<T> = { ok: true; data: T } | { ok: false; error: string }

const api = {
  // Products
  product: {
    list: (): Promise<IpcResult<Product[]>> => ipcRenderer.invoke('product:list'),
    get: (id: string): Promise<IpcResult<Product>> => ipcRenderer.invoke('product:get', id),
    create: (
      data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
    ): Promise<IpcResult<Product>> => ipcRenderer.invoke('product:create', data),
    update: (product: Product): Promise<IpcResult<Product>> =>
      ipcRenderer.invoke('product:update', product),
    delete: (id: string): Promise<IpcResult<boolean>> => ipcRenderer.invoke('product:delete', id),
    duplicate: (id: string): Promise<IpcResult<Product>> =>
      ipcRenderer.invoke('product:duplicate', id),
    importSpreadsheet: (): Promise<IpcResult<{ imported: number; skipped: string[] } | null>> =>
      ipcRenderer.invoke('product:importSpreadsheet'),
  },

  // Settings
  settings: {
    get: (): Promise<IpcResult<AppSettings>> => ipcRenderer.invoke('settings:get'),
    set: (key: string, value: string): Promise<IpcResult<boolean>> =>
      ipcRenderer.invoke('settings:set', key, value),
  },

  // File operations
  file: {
    pickBarcodeImage: (): Promise<IpcResult<string | null>> =>
      ipcRenderer.invoke('file:pickBarcodeImage'),
    saveBarcodeImage: (
      sourcePath: string,
      productId: string
    ): Promise<IpcResult<string>> => ipcRenderer.invoke('file:saveBarcodeImage', sourcePath, productId),
    pickLogoImage: (): Promise<IpcResult<string | null>> =>
      ipcRenderer.invoke('file:pickLogoImage'),
    saveLogoImage: (
      sourcePath: string,
      productId: string
    ): Promise<IpcResult<string>> => ipcRenderer.invoke('file:saveLogoImage', sourcePath, productId),
    readImageAsBase64: (filePath: string): Promise<IpcResult<string>> =>
      ipcRenderer.invoke('file:readImageAsBase64', filePath),
    getTemplatePNG: (templateId?: string | null): Promise<IpcResult<string>> =>
      ipcRenderer.invoke('file:getTemplatePNG', templateId),
    listTemplates: (): Promise<IpcResult<LabelTemplate[]>> =>
      ipcRenderer.invoke('file:listTemplates'),
    pickTemplateImage: (): Promise<IpcResult<string | null>> =>
      ipcRenderer.invoke('file:pickTemplateImage'),
    saveTemplateImage: (sourcePath: string): Promise<IpcResult<LabelTemplate>> =>
      ipcRenderer.invoke('file:saveTemplateImage', sourcePath),
    deleteTemplate: (templateId: string): Promise<IpcResult<boolean>> =>
      ipcRenderer.invoke('file:deleteTemplate', templateId),
    pickExportFolder: (): Promise<IpcResult<string | null>> =>
      ipcRenderer.invoke('file:pickExportFolder'),
  },
  font: {
    list: (): Promise<IpcResult<Array<{ id: string; family: string; source: string; dataUri: string }>>> =>
      ipcRenderer.invoke('font:list'),
    importLocal: (): Promise<IpcResult<unknown>> => ipcRenderer.invoke('font:importLocal'),
    upload: (): Promise<IpcResult<unknown>> => ipcRenderer.invoke('font:upload'),
    addGoogle: (family: string): Promise<IpcResult<unknown>> => ipcRenderer.invoke('font:addGoogle', family),
  },

  // Design templates
  design: {
    list: (): Promise<IpcResult<DesignTemplate[]>> => ipcRenderer.invoke('design:list'),
    get: (id: string): Promise<IpcResult<DesignTemplate>> => ipcRenderer.invoke('design:get', id),
    save: (design: DesignTemplate): Promise<IpcResult<DesignTemplate>> =>
      ipcRenderer.invoke('design:save', design),
    delete: (id: string): Promise<IpcResult<boolean>> => ipcRenderer.invoke('design:delete', id),
    duplicate: (id: string): Promise<IpcResult<DesignTemplate>> =>
      ipcRenderer.invoke('design:duplicate', id),
    importImage: (): Promise<IpcResult<{ assetName: string; dataUri: string } | null>> =>
      ipcRenderer.invoke('design:importImage'),
    assetDataUri: (assetName: string): Promise<IpcResult<string>> =>
      ipcRenderer.invoke('design:assetDataUri', assetName),
    pickSlotImage: (productId: string, elementId: string): Promise<IpcResult<string | null>> =>
      ipcRenderer.invoke('design:pickSlotImage', productId, elementId),
    exportFile: (design: DesignTemplate): Promise<IpcResult<string | null>> =>
      ipcRenderer.invoke('design:export', design),
    importFile: (): Promise<IpcResult<DesignTemplate | null>> =>
      ipcRenderer.invoke('design:import'),
  },

  // Export
  export: {
    singlePDF: (product: Product): Promise<IpcResult<string | null>> =>
      ipcRenderer.invoke('export:singlePDF', product),
    singleSVG: (product: Product): Promise<IpcResult<string | null>> =>
      ipcRenderer.invoke('export:singleSVG', product),
    sheetPDF: (products: Product[], startSlot: number): Promise<IpcResult<string | null>> =>
      ipcRenderer.invoke('export:sheetPDF', products, startSlot),
  },

  // Print
  print: {
    sheet: (products: Product[], startSlot: number): Promise<IpcResult<boolean>> =>
      ipcRenderer.invoke('print:sheet', products, startSlot),
    listPrinters: (): Promise<IpcResult<Array<{ name: string; displayName: string; isDefault: boolean }>>> =>
      ipcRenderer.invoke('print:listPrinters'),
    rollLabel: (
      product: Product,
      opts: { printerName: string; widthIn: number; heightIn: number; copies: number }
    ): Promise<IpcResult<boolean>> => ipcRenderer.invoke('print:rollLabel', product, opts),
  },

  // Tillie POS sync
  tillie: {
    getConfig: (): Promise<IpcResult<TillieConfig>> => ipcRenderer.invoke('tillie:getConfig'),
    setConfig: (patch: Partial<TillieConfig>): Promise<IpcResult<TillieConfig>> =>
      ipcRenderer.invoke('tillie:setConfig', patch),
    login: (pin: string): Promise<IpcResult<TillieConfig>> => ipcRenderer.invoke('tillie:login', pin),
    disconnect: (): Promise<IpcResult<TillieConfig>> => ipcRenderer.invoke('tillie:disconnect'),
    getCategories: (): Promise<IpcResult<TillieCategory[]>> =>
      ipcRenderer.invoke('tillie:getCategories'),
    listProducts: (): Promise<IpcResult<TillieProductSummary[]>> =>
      ipcRenderer.invoke('tillie:listProducts'),
    sync: (): Promise<IpcResult<TillieSyncSummary>> => ipcRenderer.invoke('tillie:sync'),
  },
}

contextBridge.exposeInMainWorld('api', api)

// Type declaration for the renderer
export type ElectronAPI = typeof api
