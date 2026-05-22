import { app } from 'electron'
import { join, extname, basename } from 'path'
import { existsSync, mkdirSync, copyFileSync, readFileSync, readdirSync } from 'fs'
import type { LabelTemplate } from './types'
import { getLabelTemplates } from '../shared/labelTemplates'

const ASSETS_DIR = join(app.getPath('userData'), 'assets')
const BARCODE_DIR = join(app.getPath('userData'), 'barcodes')
const LOGO_DIR = join(app.getPath('userData'), 'logos')
const TEMPLATE_DIR = join(ASSETS_DIR, 'templates')
const TEMPLATE_PNG = join(ASSETS_DIR, 'label-template-300dpi.png')
const TEMPLATE_EPS = join(ASSETS_DIR, 'label-template.eps')
const DEFAULT_TEMPLATE_ID = 'avery5821'
const DEFAULT_TEMPLATE_NAME = "Grazia's Italian Market"

export function initFileManager(): void {
  mkdirSync(ASSETS_DIR, { recursive: true })
  mkdirSync(BARCODE_DIR, { recursive: true })
  mkdirSync(LOGO_DIR, { recursive: true })
  mkdirSync(TEMPLATE_DIR, { recursive: true })
  copyBundledAssets()
}

/** Copy the template files bundled with the app into userData on first launch. */
function copyBundledAssets(): void {
  // In development, assets live in <project>/assets/
  // In production, they're in process.resourcesPath/assets/
  const sourceDir = getBundledAssetsDir()

  const sourceEps = join(sourceDir, 'label-template.eps')
  const sourcePng = join(sourceDir, 'label-template-300dpi.png')
  const sourceTemplateDir = join(sourceDir, 'templates')

  if (!existsSync(TEMPLATE_EPS) && existsSync(sourceEps)) {
    copyFileSync(sourceEps, TEMPLATE_EPS)
  }
  if (!existsSync(TEMPLATE_PNG) && existsSync(sourcePng)) {
    copyFileSync(sourcePng, TEMPLATE_PNG)
  }

  if (existsSync(sourceTemplateDir)) {
    for (const fileName of readdirSync(sourceTemplateDir)) {
      if (!fileName.toLowerCase().endsWith('.png')) continue
      const sourcePath = join(sourceTemplateDir, fileName)
      const destPath = join(TEMPLATE_DIR, fileName)
      if (!existsSync(destPath)) copyFileSync(sourcePath, destPath)
    }
  }
}

export function listTemplates(): LabelTemplate[] {
  return getLabelTemplates()
}

export function getTemplatePNGPath(templateId = DEFAULT_TEMPLATE_ID): string {
  if (templateId === DEFAULT_TEMPLATE_ID) return TEMPLATE_PNG
  return join(TEMPLATE_DIR, `${templateId}.png`)
}

export function getTemplateEPSPath(): string {
  return TEMPLATE_EPS
}

export function getDefaultTopLogoPath(): string {
  return join(getBundledAssetsDir(), 'default-label-logo.png')
}

export function getAvenirNextCondensedFontPath(): string {
  return join(getBundledAssetsDir(), 'AvenirNextCondensed-Regular.otf')
}

export function templateExists(): boolean {
  return existsSync(TEMPLATE_PNG)
}

export function readTemplatePNGBase64(templateId = DEFAULT_TEMPLATE_ID): string {
  const templatePath = getTemplatePNGPath(templateId)
  if (!existsSync(templatePath)) return ''
  const buf = readFileSync(templatePath)
  return `data:image/png;base64,${buf.toString('base64')}`
}

export function saveTemplateImage(sourcePath: string): LabelTemplate {
  const id = slugify(basename(sourcePath, extname(sourcePath))) || `template-${Date.now()}`
  const destPath = join(TEMPLATE_DIR, `${id}.png`)
  copyFileSync(sourcePath, destPath)
  return { id, name: prettifyTemplateName(id) }
}

/** Save an uploaded barcode image into the managed barcodes folder. Returns the stored path. */
export function saveBarcodeImage(sourcePath: string, productId: string): string {
  const ext = extname(sourcePath) || '.png'
  const destName = `barcode-${productId}${ext}`
  const destPath = join(BARCODE_DIR, destName)
  copyFileSync(sourcePath, destPath)
  return destPath
}

export function saveLogoImage(sourcePath: string, productId: string): string {
  const ext = extname(sourcePath) || '.png'
  const destName = `logo-${productId}${ext}`
  const destPath = join(LOGO_DIR, destName)
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

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
}

function prettifyTemplateName(id: string): string {
  return id
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function getBundledAssetsDir(): string {
  return !app.isPackaged
    ? join(__dirname, '../../assets')
    : join(process.resourcesPath, 'assets')
}
