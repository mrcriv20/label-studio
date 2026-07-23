import { app, ipcMain, dialog, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { writeFileSync, unlinkSync, existsSync, readFileSync } from 'fs'
import { pathToFileURL } from 'url'
import { nanoid } from 'nanoid'
import * as XLSX from 'xlsx'
import type { Product } from './types'
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getSettings,
  setSetting,
} from './database'
import {
  saveBarcodeImage,
  saveLogoImage,
  saveTemplateImage,
  readImageAsBase64,
  readTemplatePNGBase64,
  listTemplates,
} from './fileManager'
import { buildSheetPDF, exportSingleLabelPDF, exportSingleLabelSVG, exportSheetPDF } from './export'
import { getLabelTemplate } from '../shared/labelTemplates'

type IpcResult<T> = { ok: true; data: T } | { ok: false; error: string }

function ok<T>(data: T): IpcResult<T> {
  return { ok: true, data }
}
function fail(error: string): IpcResult<never> {
  return { ok: false, error }
}

export function registerIpcHandlers(): void {
  // ── Products ──────────────────────────────────────────────────────────────

  ipcMain.handle('product:list', () => {
    try { return ok(listProducts()) }
    catch (e) { return fail(String(e)) }
  })

  ipcMain.handle('product:get', (_e, id: string) => {
    try {
      const p = getProduct(id)
      return p ? ok(p) : fail('Product not found')
    } catch (e) { return fail(String(e)) }
  })

  ipcMain.handle('product:create', (_e, data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const now = new Date().toISOString()
      const product: Product = { id: nanoid(), createdAt: now, updatedAt: now, ...data }
      createProduct(product)
      return ok(product)
    } catch (e) { return fail(String(e)) }
  })

  ipcMain.handle('product:update', (_e, product: Product) => {
    try {
      const updated = { ...product, updatedAt: new Date().toISOString() }
      updateProduct(updated)
      return ok(updated)
    } catch (e) { return fail(String(e)) }
  })

  ipcMain.handle('product:delete', (_e, id: string) => {
    try { deleteProduct(id); return ok(true) }
    catch (e) { return fail(String(e)) }
  })

  ipcMain.handle('product:duplicate', (_e, id: string) => {
    try {
      const source = getProduct(id)
      if (!source) return fail('Product not found')
      const now = new Date().toISOString()
      const copy: Product = {
        ...source,
        id: nanoid(),
        name: `${source.name} (copy)`,
        barcodeValue: generateBarcode(),
        barcodeImagePath: null,
        createdAt: now,
        updatedAt: now,
      }
      createProduct(copy)
      return ok(copy)
    } catch (e) { return fail(String(e)) }
  })

  ipcMain.handle('product:importSpreadsheet', async () => {
    try {
      const result = await dialog.showOpenDialog({
        title: 'Import Products from Spreadsheet',
        filters: [
          { name: 'Spreadsheets', extensions: ['csv', 'xlsx', 'xls'] },
        ],
        properties: ['openFile'],
      })
      if (result.canceled || !result.filePaths.length) return ok(null)

      const filePath = result.filePaths[0]
      const wb = XLSX.readFile(filePath, { type: 'file', raw: false })
      const ws = wb.Sheets[wb.SheetNames[0]]
      const rows = XLSX.utils.sheet_to_json<Record<string, string>>(ws, {
        defval: '',
        raw: false,
      })

      // Normalise a header string to a lookup key
      const norm = (s: string): string => String(s).toLowerCase().replace(/[^a-z0-9]/g, '')

      // Find column matching any of the candidate names
      function findCol(headers: string[], ...candidates: string[]): string | undefined {
        return headers.find((h) => candidates.includes(norm(h)))
      }

      if (rows.length === 0) return fail('Spreadsheet is empty or unreadable.')

      const headers = Object.keys(rows[0])
      const nameCol    = findCol(headers, 'name', 'productname', 'product', 'description', 'item')
      const priceCol   = findCol(headers, 'price', 'cost', 'unitprice', 'retailprice')
      const barcodeCol = findCol(headers, 'barcode', 'barcodevalue', 'barcodenumber', 'upc', 'ean', 'sku', 'code')
      const categoryCol = findCol(headers, 'category', 'type', 'section', 'department', 'group')

      if (!nameCol)    return fail('Could not find a "name" column. Expected a column named: name, product, description.')
      if (!priceCol)   return fail('Could not find a "price" column. Expected a column named: price, cost, unitprice.')
      if (!barcodeCol) return fail('Could not find a "barcode" column. Expected a column named: barcode, upc, ean, sku.')

      const settings = getSettings()
      let imported = 0
      const skipped: string[] = []

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        const name    = String(row[nameCol] ?? '').trim()
        const price   = String(row[priceCol] ?? '').trim()
        const barcode = String(row[barcodeCol] ?? '').trim()
        const category = categoryCol ? String(row[categoryCol] ?? '').trim() : ''

        if (!name && !price && !barcode) continue // blank row
        if (!name)    { skipped.push(`Row ${i + 2}: missing name`);    continue }
        if (!barcode) { skipped.push(`Row ${i + 2}: missing barcode`); continue }

        // Normalise price — prepend prefix if it looks like a plain number
        const normalPrice = price
          ? /^\d/.test(price) ? `${settings.pricePrefix}${price}` : price
          : ''

        const now = new Date().toISOString()
        const product: Product = {
          id: nanoid(),
          name,
          price: normalPrice,
          category,
          servingInfo: '',
          nutritionInfo: '',
          cookingInstructions: '',
          customerName: '',
          labelBackgroundColor: '',
          ingredients: '',
          allergenStatement: '',
          barcodeValue: barcode,
          barcodeType: 'CODE128',
          barcodeImagePath: null,
          logoImagePath: null,
          templateId: settings.templateId,
          showPrice: true,
          showBarcode: true,
          showCookingInstructions: true,
          createdAt: now,
          updatedAt: now,
        }
        createProduct(product)
        imported++
      }

      return ok({ imported, skipped })
    } catch (e) { return fail(String(e)) }
  })

  // ── Settings ──────────────────────────────────────────────────────────────

  ipcMain.handle('settings:get', () => {
    try { return ok(getSettings()) }
    catch (e) { return fail(String(e)) }
  })

  ipcMain.handle('settings:set', (_e, key: string, value: string) => {
    try { setSetting(key, value); return ok(true) }
    catch (e) { return fail(String(e)) }
  })

  // ── File ──────────────────────────────────────────────────────────────────

  ipcMain.handle('file:pickBarcodeImage', async () => {
    try {
      const result = await dialog.showOpenDialog({
        title: 'Select Barcode Image',
        filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'svg'] }],
        properties: ['openFile'],
      })
      if (result.canceled || !result.filePaths.length) return ok(null)
      return ok(result.filePaths[0])
    } catch (e) { return fail(String(e)) }
  })

  ipcMain.handle('file:saveBarcodeImage', (_e, sourcePath: string, productId: string) => {
    try {
      const dest = saveBarcodeImage(sourcePath, productId)
      return ok(dest)
    } catch (e) { return fail(String(e)) }
  })

  ipcMain.handle('file:pickLogoImage', async () => {
    try {
      const result = await dialog.showOpenDialog({
        title: 'Select Logo Image',
        filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg'] }],
        properties: ['openFile'],
      })
      if (result.canceled || !result.filePaths.length) return ok(null)
      return ok(result.filePaths[0])
    } catch (e) { return fail(String(e)) }
  })

  ipcMain.handle('file:saveLogoImage', (_e, sourcePath: string, productId: string) => {
    try {
      const dest = saveLogoImage(sourcePath, productId)
      return ok(dest)
    } catch (e) { return fail(String(e)) }
  })

  ipcMain.handle('file:readImageAsBase64', (_e, filePath: string) => {
    try { return ok(readImageAsBase64(filePath)) }
    catch (e) { return fail(String(e)) }
  })

  ipcMain.handle('file:getTemplatePNG', (_e, templateId?: string | null) => {
    try { return ok(readTemplatePNGBase64(templateId || undefined)) }
    catch (e) { return fail(String(e)) }
  })

  ipcMain.handle('file:listTemplates', () => {
    try { return ok(listTemplates()) }
    catch (e) { return fail(String(e)) }
  })

  ipcMain.handle('file:pickTemplateImage', async () => {
    try {
      const result = await dialog.showOpenDialog({
        title: 'Select Template Image',
        filters: [{ name: 'PNG Images', extensions: ['png'] }],
        properties: ['openFile'],
      })
      if (result.canceled || !result.filePaths.length) return ok(null)
      return ok(result.filePaths[0])
    } catch (e) { return fail(String(e)) }
  })

  ipcMain.handle('file:saveTemplateImage', (_e, sourcePath: string) => {
    try { return ok(saveTemplateImage(sourcePath)) }
    catch (e) { return fail(String(e)) }
  })

  ipcMain.handle('file:pickExportFolder', async () => {
    try {
      const result = await dialog.showOpenDialog({
        title: 'Choose Export Folder',
        properties: ['openDirectory', 'createDirectory'],
      })
      if (result.canceled || !result.filePaths.length) return ok(null)
      return ok(result.filePaths[0])
    } catch (e) { return fail(String(e)) }
  })

  // ── Export ────────────────────────────────────────────────────────────────

  ipcMain.handle('export:singlePDF', async (_e, product: Product) => {
    try {
      const settings = getSettings()
      const result = await dialog.showSaveDialog({
        title: 'Save Label PDF',
        defaultPath: join(settings.exportFolder, `${sanitizeFilename(product.name)}.pdf`),
        filters: [{ name: 'PDF', extensions: ['pdf'] }],
      })
      if (result.canceled || !result.filePath) return ok(null)
      const outPath = await exportSingleLabelPDF(product, result.filePath)
      shell.openPath(outPath)
      return ok(outPath)
    } catch (e) { return fail(String(e)) }
  })

  ipcMain.handle('export:singleSVG', async (_e, product: Product) => {
    try {
      const settings = getSettings()
      const svgContent = await exportSingleLabelSVG(product)
      const outPath = join(settings.exportFolder, `${sanitizeFilename(product.name)}.svg`)
      writeFileSync(outPath, svgContent, 'utf8')
      shell.openPath(outPath)
      return ok(outPath)
    } catch (e) { return fail(String(e)) }
  })

  ipcMain.handle(
    'export:sheetPDF',
    async (_e, products: Product[], startSlot: number) => {
      try {
        const settings = getSettings()
        const result = await dialog.showSaveDialog({
          title: 'Save Sheet PDF',
          defaultPath: join(settings.exportFolder, 'label-sheet.pdf'),
          filters: [{ name: 'PDF', extensions: ['pdf'] }],
        })
        if (result.canceled || !result.filePath) return ok(null)
        const outPath = await exportSheetPDF(products, startSlot, result.filePath)
        shell.openPath(outPath)
        return ok(outPath)
      } catch (e) { return fail(String(e)) }
    }
  )

  ipcMain.handle('print:sheet', async (_e, products: Product[], startSlot: number) => {
    const tempPath = join(app.getPath('temp'), `label-sheet-print-${Date.now()}-${nanoid(8)}.pdf`)
    try {
      const pdfBytes = await buildSheetPDF(products, startSlot)
      writeFileSync(tempPath, pdfBytes)
      const printed = await printPdfWithDialog(tempPath)
      scheduleTempFileCleanup(tempPath)
      return ok(printed)
    } catch (e) {
      return fail(String(e))
    }
  })

  // ── Print ─────────────────────────────────────────────────────────────────

  ipcMain.handle('print:getTemplatePNG', () => {
    try { return ok(readTemplatePNGBase64()) }
    catch (e) { return fail(String(e)) }
  })
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function generateBarcode(): string {
  // 12-digit random barcode for internal use
  const num = Math.floor(Math.random() * 900000000000) + 100000000000
  return String(num)
}

async function printPdfWithDialog(pdfPath: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const printWin = new BrowserWindow({
      width: 900,
      height: 700,
      show: true,
      autoHideMenuBar: true,
      webPreferences: { sandbox: false },
    })

    let settled = false
    const finish = (result: boolean): void => {
      if (settled) return
      settled = true
      if (!printWin.isDestroyed()) printWin.close()
      resolve(result)
    }

    printWin.webContents.once('did-finish-load', () => {
      // Give Chromium's built-in PDF viewer time to fully initialise.
      setTimeout(() => {
        if (settled || printWin.isDestroyed()) return
        const options: Electron.WebContentsPrintOptions = {
          silent: false,
          printBackground: true,
          pageSize: 'Letter',
          landscape: false,
          margins: { marginType: 'none' },
        }

        printWin.webContents.print(options, (success) => finish(success))
      }, 400)
    })

    printWin.webContents.once('did-fail-load', (_event, _code, desc) => {
      if (!settled) {
        settled = true
        if (!printWin.isDestroyed()) printWin.destroy()
        reject(new Error(`Failed to load printable PDF: ${desc}`))
      }
    })

    printWin.loadURL(pathToFileURL(pdfPath).toString()).catch((err) => {
      if (!settled) {
        settled = true
        if (!printWin.isDestroyed()) printWin.destroy()
        reject(err)
      }
    })
  })
}

function scheduleTempFileCleanup(filePath: string): void {
  // Keep file around briefly so OS print spooler can reliably consume it.
  setTimeout(() => {
    try {
      if (existsSync(filePath)) unlinkSync(filePath)
    } catch {
      // best-effort cleanup
    }
  }, 60_000)
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-z0-9_\-. ]/gi, '_').trim().slice(0, 60)
}
