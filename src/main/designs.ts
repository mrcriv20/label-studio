// Storage for user-created design templates: one JSON document per design in
// userData/designs, plus an assets/ subfolder for images placed on designs.
// Bundled starter designs (assets/designs/*.json) are seeded on first launch.
import { app } from 'electron'
import { join, extname, basename } from 'path'
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'fs'
import type { DesignTemplate } from '../shared/design/types'
import { DESIGN_ID_PREFIX } from '../shared/design/types'
import { validateDesignTemplate } from '../shared/design/validate'
import { getBundledAssetsDir, readImageAsBase64 } from './fileManager'

const designDir = (): string => join(app.getPath('userData'), 'designs')
const designAssetDir = (): string => join(designDir(), 'assets')

export function initDesigns(): void {
  mkdirSync(designAssetDir(), { recursive: true })
  const seedDir = join(getBundledAssetsDir(), 'designs')
  if (!existsSync(seedDir)) return
  for (const fileName of readdirSync(seedDir)) {
    if (!fileName.toLowerCase().endsWith('.json')) continue
    try {
      // Store seeds under their design id so lookups by id find the file.
      const seed = validateDesignTemplate(JSON.parse(readFileSync(join(seedDir, fileName), 'utf8')))
      const dest = join(designDir(), `${sanitizeId(seed.id)}.json`)
      if (!existsSync(dest)) writeFileSync(dest, JSON.stringify(seed, null, 2), 'utf8')
    } catch {
      // Ignore malformed bundled seeds.
    }
  }
}

export function listDesigns(): DesignTemplate[] {
  if (!existsSync(designDir())) return []
  const designs: DesignTemplate[] = []
  for (const fileName of readdirSync(designDir())) {
    if (!fileName.toLowerCase().endsWith('.json')) continue
    try {
      designs.push(validateDesignTemplate(JSON.parse(readFileSync(join(designDir(), fileName), 'utf8'))))
    } catch {
      // Skip unreadable design files rather than breaking the whole list.
    }
  }
  return designs.sort((a, b) => a.name.localeCompare(b.name))
}

export function getDesign(id: string): DesignTemplate | null {
  const path = join(designDir(), `${sanitizeId(id)}.json`)
  if (!existsSync(path)) return null
  try {
    return validateDesignTemplate(JSON.parse(readFileSync(path, 'utf8')))
  } catch {
    return null
  }
}

export function saveDesign(raw: unknown): DesignTemplate {
  const design = validateDesignTemplate(raw)
  const now = new Date().toISOString()
  const stored: DesignTemplate = {
    ...design,
    createdAt: getDesign(design.id)?.createdAt ?? now,
    updatedAt: now,
  }
  mkdirSync(designDir(), { recursive: true })
  writeFileSync(join(designDir(), `${sanitizeId(stored.id)}.json`), JSON.stringify(stored, null, 2), 'utf8')
  return stored
}

export function deleteDesign(id: string): void {
  const path = join(designDir(), `${sanitizeId(id)}.json`)
  if (existsSync(path)) unlinkSync(path)
}

export function duplicateDesign(id: string): DesignTemplate | null {
  const source = getDesign(id)
  if (!source) return null
  return saveDesign({
    ...source,
    id: newDesignId(),
    name: `${source.name} (copy)`,
  })
}

export function newDesignId(): string {
  return `${DESIGN_ID_PREFIX}${Date.now()}`
}

/** Copy an image into the design assets folder; returns the stored file name. */
export function importDesignAsset(sourcePath: string): string {
  const extension = extname(sourcePath).toLowerCase()
  if (!['.png', '.jpg', '.jpeg'].includes(extension)) {
    throw new Error('Choose a PNG or JPEG image.')
  }
  const name = `${slug(basename(sourcePath, extension))}-${Date.now()}${extension}`
  mkdirSync(designAssetDir(), { recursive: true })
  copyFileSync(sourcePath, join(designAssetDir(), name))
  return name
}

export function designAssetPath(assetName: string): string {
  return join(designAssetDir(), basename(assetName))
}

export function designAssetDataUri(assetName: string): string {
  return readImageAsBase64(designAssetPath(assetName))
}

// ── Export / import bundles ──────────────────────────────────────────────────
// A portable design is a single JSON file carrying the design document plus
// any placed asset images (as data URIs) so it opens intact on another machine.

const DESIGN_BUNDLE_FORMAT = 'tillie-design'

interface DesignExportBundle {
  format: typeof DESIGN_BUNDLE_FORMAT
  formatVersion: 1
  design: DesignTemplate
  /** Asset file name → data URI for images placed on the design. */
  assets: Record<string, string>
}

export function exportDesignToFile(raw: unknown, filePath: string): void {
  const design = validateDesignTemplate(raw)
  const assets: Record<string, string> = {}
  for (const element of design.elements) {
    if (element.type === 'image' && element.source === 'asset' && element.assetName) {
      const dataUri = designAssetDataUri(element.assetName)
      if (dataUri) assets[element.assetName] = dataUri
    }
  }
  const bundle: DesignExportBundle = {
    format: DESIGN_BUNDLE_FORMAT,
    formatVersion: 1,
    design,
    assets,
  }
  writeFileSync(filePath, JSON.stringify(bundle, null, 2), 'utf8')
}

export function importDesignFromFile(filePath: string): DesignTemplate {
  let parsed: unknown
  try {
    parsed = JSON.parse(readFileSync(filePath, 'utf8'))
  } catch {
    throw new Error('That file is not a valid design export.')
  }

  // Accept a full bundle or a bare design document.
  const record = parsed as Partial<DesignExportBundle>
  const isBundle = record?.format === DESIGN_BUNDLE_FORMAT
  const rawDesign = isBundle ? record.design : parsed
  const assets = isBundle && record.assets && typeof record.assets === 'object' ? record.assets : {}

  let design: DesignTemplate
  try {
    design = validateDesignTemplate(rawDesign)
  } catch (e) {
    throw new Error(`That file is not a valid design export. ${e instanceof Error ? e.message : ''}`.trim())
  }

  // Unpack bundled images, renaming on content conflicts.
  const renames = new Map<string, string>()
  for (const [assetName, dataUri] of Object.entries(assets)) {
    if (typeof dataUri !== 'string') continue
    const stored = storeDesignAssetFromDataUri(assetName, dataUri)
    if (stored && stored !== assetName) renames.set(assetName, stored)
  }
  if (renames.size) {
    design = {
      ...design,
      elements: design.elements.map((element) =>
        element.type === 'image' && element.assetName && renames.has(element.assetName)
          ? { ...element, assetName: renames.get(element.assetName) }
          : element,
      ),
    }
  }

  // Keep the id when it's free (re-import updates in place across instances);
  // otherwise mint a fresh id so an existing design is never clobbered silently.
  if (getDesign(design.id)) {
    design = { ...design, id: newDesignId(), name: `${design.name} (imported)` }
  }
  return saveDesign(design)
}

/** Write a bundled image into the assets folder; returns the stored name or null. */
function storeDesignAssetFromDataUri(assetName: string, dataUri: string): string | null {
  const match = /^data:image\/(png|jpe?g);base64,(.+)$/.exec(dataUri)
  if (!match) return null
  const buffer = Buffer.from(match[2], 'base64')
  mkdirSync(designAssetDir(), { recursive: true })
  const safeName = basename(assetName)
  const target = join(designAssetDir(), safeName)
  if (!existsSync(target)) {
    writeFileSync(target, buffer)
    return safeName
  }
  if (readFileSync(target).equals(buffer)) return safeName
  const extension = extname(safeName)
  const renamed = `${slug(basename(safeName, extension))}-${Date.now()}${extension}`
  writeFileSync(join(designAssetDir(), renamed), buffer)
  return renamed
}

function sanitizeId(id: string): string {
  return basename(id).replace(/[^a-zA-Z0-9_-]/g, '')
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'image'
}
