import { app } from 'electron'
import { join, extname } from 'path'
import { existsSync, mkdirSync, copyFileSync, readFileSync } from 'fs'

const ASSETS_DIR = join(app.getPath('userData'), 'assets')
const BARCODE_DIR = join(app.getPath('userData'), 'barcodes')
const TEMPLATE_PNG = join(ASSETS_DIR, 'label-template-300dpi.png')
const TEMPLATE_EPS = join(ASSETS_DIR, 'label-template.eps')

export function initFileManager(): void {
  mkdirSync(ASSETS_DIR, { recursive: true })
  mkdirSync(BARCODE_DIR, { recursive: true })
  copyBundledAssets()
}

/** Copy the template files bundled with the app into userData on first launch. */
function copyBundledAssets(): void {
  // In development, assets live in <project>/assets/
  // In production, they're in process.resourcesPath/assets/
  const isDev = !app.isPackaged
  const sourceDir = isDev
    ? join(__dirname, '../../assets')
    : join(process.resourcesPath, 'assets')

  const sourceEps = join(sourceDir, 'label-template.eps')
  const sourcePng = join(sourceDir, 'label-template-300dpi.png')

  if (!existsSync(TEMPLATE_EPS) && existsSync(sourceEps)) {
    copyFileSync(sourceEps, TEMPLATE_EPS)
  }
  if (!existsSync(TEMPLATE_PNG) && existsSync(sourcePng)) {
    copyFileSync(sourcePng, TEMPLATE_PNG)
  }
}

export function getTemplatePNGPath(): string {
  return TEMPLATE_PNG
}

export function getTemplateEPSPath(): string {
  return TEMPLATE_EPS
}

export function templateExists(): boolean {
  return existsSync(TEMPLATE_PNG)
}

export function readTemplatePNGBase64(): string {
  if (!existsSync(TEMPLATE_PNG)) return ''
  const buf = readFileSync(TEMPLATE_PNG)
  return `data:image/png;base64,${buf.toString('base64')}`
}

/** Save an uploaded barcode image into the managed barcodes folder. Returns the stored path. */
export function saveBarcodeImage(sourcePath: string, productId: string): string {
  const ext = extname(sourcePath) || '.png'
  const destName = `barcode-${productId}${ext}`
  const destPath = join(BARCODE_DIR, destName)
  copyFileSync(sourcePath, destPath)
  return destPath
}

/** Read any stored image as a base64 data-URI. */
export function readImageAsBase64(filePath: string): string {
  if (!existsSync(filePath)) return ''
  const buf = readFileSync(filePath)
  const ext = extname(filePath).toLowerCase().slice(1)
  const mime =
    ext === 'jpg' || ext === 'jpeg'
      ? 'image/jpeg'
      : ext === 'svg'
        ? 'image/svg+xml'
        : 'image/png'
  return `data:${mime};base64,${buf.toString('base64')}`
}
