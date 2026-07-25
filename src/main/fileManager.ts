import { app, BrowserWindow, nativeImage } from 'electron'
import { join, extname, basename } from 'path'
import { existsSync, mkdirSync, copyFileSync, readFileSync, readdirSync } from 'fs'
import { writeFileSync } from 'fs'
import { execFileSync } from 'child_process'
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
const TEMPLATE_CATALOG = join(TEMPLATE_DIR, 'catalog.json')

interface CustomTemplateRecord extends LabelTemplate {
  sourcePath: string
  previewPath: string
}

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
  return [...getLabelTemplates(), ...readCustomTemplates().map(({ id, name }) => ({ id, name }))]
}

export function getTemplatePNGPath(templateId = DEFAULT_TEMPLATE_ID): string {
  const custom = readCustomTemplates().find((template) => template.id === templateId)
  if (custom) return custom.previewPath
  if (templateId === DEFAULT_TEMPLATE_ID) return TEMPLATE_PNG
  return join(TEMPLATE_DIR, `${templateId}.png`)
}

export function isCustomTemplate(templateId?: string | null): boolean {
  return Boolean(templateId && readCustomTemplates().some((template) => template.id === templateId))
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

export function getLoraBoldFontPath(): string {
  return join(getBundledAssetsDir(), 'Lora-Bold.ttf')
}

export function getGentyRegularFontPath(): string {
  return join(getBundledAssetsDir(), 'GentyDemo-Regular.ttf')
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

export async function saveTemplateImage(sourcePath: string): Promise<LabelTemplate> {
  const extension = extname(sourcePath).toLowerCase()
  if (!['.pdf', '.svg', '.png', '.jpg', '.jpeg', '.webp'].includes(extension)) {
    throw new Error('Choose a PDF, SVG, PNG, JPEG, or WebP label design.')
  }
  const baseId = slugify(basename(sourcePath, extension)) || 'custom-label'
  const id = `custom-${baseId}-${Date.now()}`
  const storedSource = join(TEMPLATE_DIR, `${id}${extension}`)
  const previewPath = join(TEMPLATE_DIR, `${id}.png`)
  copyFileSync(sourcePath, storedSource)
  await createTemplatePreview(storedSource, previewPath, extension)
  const record: CustomTemplateRecord = {
    id,
    name: prettifyTemplateName(baseId),
    sourcePath: storedSource,
    previewPath,
  }
  writeFileSync(TEMPLATE_CATALOG, JSON.stringify([...readCustomTemplates(), record], null, 2), 'utf8')
  return { id: record.id, name: record.name }
}

function readCustomTemplates(): CustomTemplateRecord[] {
  try {
    const records = JSON.parse(readFileSync(TEMPLATE_CATALOG, 'utf8')) as CustomTemplateRecord[]
    return records.filter((record) => existsSync(record.sourcePath) && existsSync(record.previewPath))
  } catch {
    return []
  }
}

async function createTemplatePreview(sourcePath: string, previewPath: string, extension: string): Promise<void> {
  if (extension === '.png') {
    copyFileSync(sourcePath, previewPath)
    return
  }
  if (extension === '.svg') {
    const svg = readFileSync(sourcePath)
    const dimensions = svgDimensions(svg.toString('utf8'))
    const width = 1200
    const height = Math.max(1, Math.round(width * dimensions.height / dimensions.width))
    const renderWindow = new BrowserWindow({
      show: false,
      width,
      height,
      useContentSize: true,
      webPreferences: { sandbox: true },
    })
    try {
      await renderWindow.loadURL(`data:image/svg+xml;base64,${svg.toString('base64')}`)
      const image = await renderWindow.webContents.capturePage()
      if (!image.isEmpty()) {
        writeFileSync(previewPath, image.toPNG())
        return
      }
    } finally {
      if (!renderWindow.isDestroyed()) renderWindow.destroy()
    }
  }
  if (['.jpg', '.jpeg', '.webp'].includes(extension)) {
    const image = nativeImage.createFromPath(sourcePath)
    if (!image.isEmpty()) {
      const size = image.getSize()
      const resized = size.width > 1200 ? image.resize({ width: 1200 }) : image
      writeFileSync(previewPath, resized.toPNG())
      return
    }
  }
  if (process.platform === 'darwin') {
    try {
      execFileSync('/usr/bin/sips', ['-s', 'format', 'png', '--resampleWidth', '1200', sourcePath, '--out', previewPath])
      if (existsSync(previewPath)) return
    } catch {
      // Fall through to Electron-readable formats or a useful error.
    }
  }
  throw new Error('This file could not be converted into a label preview. Try exporting the design as PNG.')
}

function svgDimensions(svg: string): { width: number; height: number } {
  const viewBox = svg.match(/\bviewBox\s*=\s*["']\s*[\d.-]+\s+[\d.-]+\s+([\d.]+)\s+([\d.]+)\s*["']/i)
  if (viewBox) return { width: Number(viewBox[1]) || 400, height: Number(viewBox[2]) || 640 }
  const width = Number(svg.match(/\bwidth\s*=\s*["']([\d.]+)/i)?.[1])
  const height = Number(svg.match(/\bheight\s*=\s*["']([\d.]+)/i)?.[1])
  return { width: width || 400, height: height || 640 }
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
