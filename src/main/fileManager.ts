import { app, BrowserWindow, nativeImage } from 'electron'
import { join, extname, basename, resolve, sep } from 'path'
import { existsSync, mkdirSync, copyFileSync, readFileSync, readdirSync, unlinkSync } from 'fs'
import { writeFileSync } from 'fs'
import { execFileSync } from 'child_process'
import type { LabelTemplate } from './types'
import { getLabelTemplates } from '../shared/labelTemplates'

const ASSETS_DIR = join(app.getPath('userData'), 'assets')
const BARCODE_DIR = join(app.getPath('userData'), 'barcodes')
const LOGO_DIR = join(app.getPath('userData'), 'logos')
const DESIGN_SLOT_DIR = join(app.getPath('userData'), 'design-images')
const TEMPLATE_DIR = join(ASSETS_DIR, 'templates')
const TEMPLATE_PNG = join(ASSETS_DIR, 'label-template-300dpi.png')
const TEMPLATE_EPS = join(ASSETS_DIR, 'label-template.eps')
const DEFAULT_TEMPLATE_ID = 'avery5821'
const DEFAULT_TEMPLATE_NAME = "Grazia's Italian Market"
const TEMPLATE_CATALOG = join(TEMPLATE_DIR, 'catalog.json')
// Ids of deleted bundled templates, so copyBundledAssets doesn't resurrect them.
const TEMPLATE_TOMBSTONES = join(TEMPLATE_DIR, 'deleted.json')

interface CustomTemplateRecord extends LabelTemplate {
  sourcePath: string
  previewPath: string
  /** Label size in PDF points. Absent for older records; those fall back to the default label size. */
  width?: number
  height?: number
}

export function initFileManager(): void {
  mkdirSync(ASSETS_DIR, { recursive: true })
  mkdirSync(BARCODE_DIR, { recursive: true })
  mkdirSync(LOGO_DIR, { recursive: true })
  mkdirSync(DESIGN_SLOT_DIR, { recursive: true })
  mkdirSync(TEMPLATE_DIR, { recursive: true })
  copyBundledAssets()
}

const MANAGED_IMAGE_DIRS = [BARCODE_DIR, LOGO_DIR, DESIGN_SLOT_DIR]

function isManagedImagePath(filePath: string): boolean {
  const candidate = resolve(filePath)
  return MANAGED_IMAGE_DIRS.some((directory) => candidate.startsWith(`${resolve(directory)}${sep}`))
}

/** Delete only renderer-managed product images; arbitrary filesystem paths are refused. */
export function deleteManagedImage(filePath: string): boolean {
  if (!filePath || !isManagedImagePath(filePath)) return false
  if (existsSync(filePath)) unlinkSync(filePath)
  return true
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
      if (!/\.(png|svg)$/i.test(fileName)) continue
      const sourcePath = join(sourceTemplateDir, fileName)
      const destPath = join(TEMPLATE_DIR, fileName)
      if (!existsSync(destPath)) copyFileSync(sourcePath, destPath)
    }
    registerBundledArtworkTemplates(sourceTemplateDir)
  }
}

/**
 * Register bundled full-artwork templates (an SVG design plus its rendered PNG
 * in assets/templates) in the custom-template catalog so they show up in the
 * template picker and render through the same artwork pipeline as imports.
 */
function registerBundledArtworkTemplates(sourceTemplateDir: string): void {
  const existing = readCustomTemplates()
  const tombstones = readTemplateTombstones()
  const added: CustomTemplateRecord[] = []
  for (const fileName of readdirSync(sourceTemplateDir)) {
    if (!fileName.toLowerCase().endsWith('.svg')) continue
    const baseName = basename(fileName, extname(fileName))
    const previewPath = join(TEMPLATE_DIR, `${baseName}.png`)
    if (!existsSync(previewPath)) continue
    const id = `custom-${slugify(baseName)}`
    if (tombstones.includes(id)) continue
    const name = prettifyTemplateName(baseName)
    if (existing.some((record) => record.id === id || record.name === name)) continue
    const sourcePath = join(TEMPLATE_DIR, fileName)
    const dimensions = svgDimensions(readFileSync(sourcePath, 'utf8'))
    added.push({ id, name, sourcePath, previewPath, ...(dimensions ?? {}) })
  }
  if (added.length > 0) {
    writeFileSync(TEMPLATE_CATALOG, JSON.stringify([...existing, ...added], null, 2), 'utf8')
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

/** Native size (in PDF points) of a custom artwork template, when known. */
export function getCustomTemplateSize(templateId?: string | null): { width: number; height: number } | null {
  const custom = readCustomTemplates().find((template) => template.id === templateId)
  return custom?.width && custom?.height ? { width: custom.width, height: custom.height } : null
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
  const dimensions = extension === '.svg' ? svgDimensions(readFileSync(storedSource, 'utf8')) : null
  const record: CustomTemplateRecord = {
    id,
    name: prettifyTemplateName(baseId),
    sourcePath: storedSource,
    previewPath,
    ...(dimensions ?? {}),
  }
  writeFileSync(TEMPLATE_CATALOG, JSON.stringify([...readCustomTemplates(), record], null, 2), 'utf8')
  return { id: record.id, name: record.name }
}

/** Remove a custom artwork template: its catalog entry plus stored files. */
export function deleteCustomTemplate(templateId: string): void {
  const records = readCustomTemplates()
  const record = records.find((template) => template.id === templateId)
  if (!record) return
  for (const path of [record.sourcePath, record.previewPath]) {
    try {
      if (existsSync(path)) unlinkSync(path)
    } catch {
      // Removing the catalog entry is what matters; stray files are harmless.
    }
  }
  writeFileSync(
    TEMPLATE_CATALOG,
    JSON.stringify(records.filter((template) => template.id !== templateId), null, 2),
    'utf8'
  )
  const tombstones = readTemplateTombstones()
  if (!tombstones.includes(templateId)) {
    writeFileSync(TEMPLATE_TOMBSTONES, JSON.stringify([...tombstones, templateId], null, 2), 'utf8')
  }
}

function readTemplateTombstones(): string[] {
  try {
    const parsed = JSON.parse(readFileSync(TEMPLATE_TOMBSTONES, 'utf8'))
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : []
  } catch {
    return []
  }
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
    const dimensions = svgDimensions(svg.toString('utf8')) ?? { width: 400, height: 640 }
    const width = 1500
    const height = Math.max(1, Math.round(width * dimensions.height / dimensions.width))
    const renderWindow = new BrowserWindow({
      show: false,
      width,
      height,
      useContentSize: true,
      webPreferences: { sandbox: true },
    })
    try {
      // Render through an <img> so we can wait for the SVG (including any
      // embedded raster images) to fully decode before capturing.
      const svgUri = `data:image/svg+xml;base64,${svg.toString('base64')}`
      const html = `<!doctype html><html><head><style>html,body{margin:0;overflow:hidden}img{display:block;width:${width}px;height:${height}px}</style></head><body><img src="${svgUri}"></body></html>`
      await renderWindow.loadURL(`data:text/html;base64,${Buffer.from(html).toString('base64')}`)
      await renderWindow.webContents.executeJavaScript(
        'document.querySelector("img").decode().then(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))'
      )
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

function svgDimensions(svg: string): { width: number; height: number } | null {
  const viewBox = svg.match(/\bviewBox\s*=\s*["']\s*[\d.-]+\s+[\d.-]+\s+([\d.]+)\s+([\d.]+)\s*["']/i)
  if (viewBox && Number(viewBox[1]) && Number(viewBox[2])) {
    return { width: Number(viewBox[1]), height: Number(viewBox[2]) }
  }
  const width = Number(svg.match(/\bwidth\s*=\s*["']([\d.]+)/i)?.[1])
  const height = Number(svg.match(/\bheight\s*=\s*["']([\d.]+)/i)?.[1])
  return width && height ? { width, height } : null
}

/** Save an uploaded barcode image into the managed barcodes folder. Returns the stored path. */
export function saveBarcodeImage(sourcePath: string, productId: string): string {
  const ext = extname(sourcePath) || '.png'
  const destName = `barcode-${productId}-${Date.now()}${ext}`
  const destPath = join(BARCODE_DIR, destName)
  copyFileSync(sourcePath, destPath)
  return destPath
}

/**
 * Save a per-label replacement for a design image element. The stored name is
 * timestamped so replacing an image yields a fresh path (no stale caches).
 */
export function saveDesignSlotImage(sourcePath: string, productId: string, elementId: string): string {
  const ext = extname(sourcePath).toLowerCase() || '.png'
  const clean = (value: string): string => value.replace(/[^a-zA-Z0-9_-]/g, '')
  const destPath = join(DESIGN_SLOT_DIR, `${clean(productId)}-${clean(elementId)}-${Date.now()}${ext}`)
  mkdirSync(DESIGN_SLOT_DIR, { recursive: true })
  copyFileSync(sourcePath, destPath)
  return destPath
}

export function saveLogoImage(sourcePath: string, productId: string): string {
  const ext = extname(sourcePath) || '.png'
  const destName = `logo-${productId}-${Date.now()}${ext}`
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

export function getBundledAssetsDir(): string {
  return !app.isPackaged
    ? join(__dirname, '../../assets')
    : join(process.resourcesPath, 'assets')
}
