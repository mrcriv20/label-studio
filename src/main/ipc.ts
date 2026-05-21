import { app, ipcMain, dialog, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { writeFileSync, unlinkSync, existsSync } from 'fs'
import { pathToFileURL } from 'url'
import { nanoid } from 'nanoid'
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
import { saveBarcodeImage, readImageAsBase64, readTemplatePNGBase64 } from './fileManager'
import { exportSingleLabelPDF, exportSingleLabelSVG, exportSheetPDF } from './export'

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

  ipcMain.handle('file:readImageAsBase64', (_e, filePath: string) => {
    try { return ok(readImageAsBase64(filePath)) }
    catch (e) { return fail(String(e)) }
  })

  ipcMain.handle('file:getTemplatePNG', () => {
    try { return ok(readTemplatePNGBase64()) }
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
    const tempPath = join(app.getPath('temp'), `label-sheet-print-${Date.now()}-${nanoid(8)}.html`)
    try {
      const html = await buildSheetPrintHtml(products, startSlot)
      writeFileSync(tempPath, html, 'utf8')
      const printed = await printHtmlWithDialog(tempPath)
      scheduleTempPdfCleanup(tempPath)
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

async function printHtmlWithDialog(htmlPath: string): Promise<boolean> {
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
      // Give the document a brief moment to finish SVG/image decode.
      setTimeout(() => {
        if (settled || printWin.isDestroyed()) return
        printWin.webContents.print(
          { silent: false, printBackground: true },
          (success) => finish(success)
        )
      }, 150)
    })

    printWin.webContents.once('did-fail-load', (_event, _code, desc) => {
      if (!settled) {
        settled = true
        if (!printWin.isDestroyed()) printWin.destroy()
        reject(new Error(`Failed to load printable document: ${desc}`))
      }
    })

    printWin.loadURL(pathToFileURL(htmlPath).toString()).catch((err) => {
      if (!settled) {
        settled = true
        if (!printWin.isDestroyed()) printWin.destroy()
        reject(err)
      }
    })
  })
}

async function buildSheetPrintHtml(products: Product[], startSlot: number): Promise<string> {
  const slotHtml: string[] = []

  for (let slot = 1; slot <= 8; slot++) {
    const pIdx = slot - startSlot
    if (pIdx < 0 || pIdx >= products.length) continue
    const product = products[pIdx]
    if (!product) continue

    const col = (slot - 1) % 2
    const row = Math.floor((slot - 1) / 2)
    const leftIn = 0.25 + col * 4
    const topIn = 0.5 + row * 2.5

    const svg = await exportSingleLabelSVG(product)
    const svgDataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`

    slotHtml.push(`
      <div class="slot" style="left:${leftIn}in; top:${topIn}in;">
        <div class="label-rotated">
          <img src="${svgDataUri}" alt="${escapeHtml(product.name)}" />
        </div>
      </div>
    `)
  }

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Label Sheet Print</title>
    <style>
      @page { size: Letter portrait; margin: 0; }
      html, body {
        margin: 0;
        padding: 0;
        width: 8.5in;
        height: 11in;
        background: white;
      }
      * {
        box-sizing: border-box;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .sheet {
        position: relative;
        width: 8.5in;
        height: 11in;
        overflow: hidden;
        background: white;
      }
      .slot {
        position: absolute;
        width: 4in;
        height: 2.5in;
        overflow: hidden;
      }
      .label-rotated {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 2.5in;
        height: 4in;
        transform: translate(-50%, -50%) rotate(90deg);
        transform-origin: center;
      }
      .label-rotated img {
        width: 100%;
        height: 100%;
        object-fit: fill;
        display: block;
      }
    </style>
  </head>
  <body>
    <div class="sheet">
      ${slotHtml.join('\n')}
    </div>
  </body>
</html>`
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function scheduleTempPdfCleanup(filePath: string): void {
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
