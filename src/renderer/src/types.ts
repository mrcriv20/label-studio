// Mirror of src/main/types.ts — kept in sync manually.
// The preload bridge serialises these over the IPC boundary.

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
  currency: string
  barcodeType: 'CODE128'
  exportFolder: string
  templateId: string
  pricePrefix: string
}

export type IpcResult<T> = { ok: true; data: T } | { ok: false; error: string }

// Declared globally so TypeScript knows about window.api
declare global {
  interface Window {
    api: {
      product: {
        list(): Promise<IpcResult<Product[]>>
        get(id: string): Promise<IpcResult<Product>>
        create(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<IpcResult<Product>>
        update(product: Product): Promise<IpcResult<Product>>
        delete(id: string): Promise<IpcResult<boolean>>
        duplicate(id: string): Promise<IpcResult<Product>>
      }
      settings: {
        get(): Promise<IpcResult<AppSettings>>
        set(key: string, value: string): Promise<IpcResult<boolean>>
      }
      file: {
        pickBarcodeImage(): Promise<IpcResult<string | null>>
        saveBarcodeImage(sourcePath: string, productId: string): Promise<IpcResult<string>>
        readImageAsBase64(filePath: string): Promise<IpcResult<string>>
        getTemplatePNG(): Promise<IpcResult<string>>
        pickExportFolder(): Promise<IpcResult<string | null>>
      }
      export: {
        singlePDF(product: Product): Promise<IpcResult<string | null>>
        singleSVG(product: Product): Promise<IpcResult<string | null>>
        sheetPDF(products: Product[], startSlot: number): Promise<IpcResult<string | null>>
      }
      print: {
        sheet(products: Product[], startSlot: number): Promise<IpcResult<boolean>>
      }
    }
  }
}
