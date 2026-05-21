import { contextBridge, ipcRenderer } from 'electron'
import type { Product, AppSettings } from '../main/types'

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
    readImageAsBase64: (filePath: string): Promise<IpcResult<string>> =>
      ipcRenderer.invoke('file:readImageAsBase64', filePath),
    getTemplatePNG: (): Promise<IpcResult<string>> =>
      ipcRenderer.invoke('file:getTemplatePNG'),
    pickExportFolder: (): Promise<IpcResult<string | null>> =>
      ipcRenderer.invoke('file:pickExportFolder'),
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
}

contextBridge.exposeInMainWorld('api', api)

// Type declaration for the renderer
export type ElectronAPI = typeof api
