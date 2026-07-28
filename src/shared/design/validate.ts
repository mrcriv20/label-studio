// Lightweight structural validation + normalisation for design documents
// loaded from disk. Unknown fields are dropped; missing optionals get
// defaults; a structurally broken file throws so the caller can surface it.
import type {
  BarcodeElement,
  BoxElement,
  DesignElement,
  DesignTemplate,
  ImageElement,
  TextCase,
  TextElement,
  VisibleIf,
} from './types'
import { DESIGN_ID_PREFIX } from './types'

const TEXT_CASES: TextCase[] = ['none', 'upper', 'lower', 'title', 'sentence']

const VISIBLE_IF: VisibleIf[] = ['always', 'showPrice', 'showBarcode', 'showCookingInstructions', 'showProductName']

export function validateDesignTemplate(raw: unknown): DesignTemplate {
  if (!raw || typeof raw !== 'object') throw new Error('Design file is not an object.')
  const doc = raw as Record<string, unknown>
  if (doc.schemaVersion !== 1) throw new Error(`Unsupported design schema version: ${String(doc.schemaVersion)}`)
  const id = str(doc.id)
  if (!id.startsWith(DESIGN_ID_PREFIX)) throw new Error('Design id must start with "design-".')
  const canvas = (doc.canvas ?? {}) as Record<string, unknown>
  const width = num(canvas.width, 0)
  const height = num(canvas.height, 0)
  if (!(width > 0) || !(height > 0)) throw new Error('Design canvas size is invalid.')
  const elements = Array.isArray(doc.elements) ? doc.elements.map(validateElement) : []
  return {
    schemaVersion: 1,
    id,
    name: str(doc.name) || 'Untitled Design',
    canvas: { width, height, background: str(canvas.background) || '#ffffff' },
    elements,
    createdAt: str(doc.createdAt) || new Date(0).toISOString(),
    updatedAt: str(doc.updatedAt) || new Date(0).toISOString(),
  }
}

function validateElement(raw: unknown, index: number): DesignElement {
  if (!raw || typeof raw !== 'object') throw new Error(`Element ${index} is not an object.`)
  const el = raw as Record<string, unknown>
  const base = {
    id: str(el.id) || `el-${index}`,
    x: num(el.x, 0),
    y: num(el.y, 0),
    w: Math.max(1, num(el.w, 10)),
    h: Math.max(1, num(el.h, 10)),
    ...(el.opacity !== undefined ? { opacity: clamp(num(el.opacity, 1), 0, 1) } : {}),
    ...(el.locked ? { locked: true } : {}),
    ...(VISIBLE_IF.includes(el.visibleIf as VisibleIf) && el.visibleIf !== 'always'
      ? { visibleIf: el.visibleIf as VisibleIf }
      : {}),
  }
  switch (el.type) {
    case 'box':
      return {
        ...base,
        type: 'box',
        fill: str(el.fill),
        stroke: str(el.stroke),
        strokeWidth: Math.max(0, num(el.strokeWidth, 1)),
        cornerRadius: Math.max(0, num(el.cornerRadius, 0)),
      } satisfies BoxElement
    case 'text':
      return {
        ...base,
        type: 'text',
        content: str(el.content),
        fontId: str(el.fontId),
        size: clamp(num(el.size, 12), 1, 400),
        autoFit: Boolean(el.autoFit),
        color: str(el.color) || '#1b2733',
        align: el.align === 'left' || el.align === 'right' ? el.align : 'center',
        lineHeight: clamp(num(el.lineHeight, 1.1), 0.5, 3),
        ...(el.maxLines !== undefined ? { maxLines: Math.max(1, Math.floor(num(el.maxLines, 1))) } : {}),
        ...(TEXT_CASES.includes(el.textCase as TextCase) && el.textCase !== 'none'
          ? { textCase: el.textCase as TextCase }
          : {}),
      } satisfies TextElement
    case 'barcode':
      return {
        ...base,
        type: 'barcode',
        showText: el.showText !== false,
        color: str(el.color) || '#000000',
      } satisfies BarcodeElement
    case 'image':
      return {
        ...base,
        type: 'image',
        source: el.source === 'asset' ? 'asset' : 'productLogo',
        ...(el.assetName ? { assetName: str(el.assetName) } : {}),
        fit: el.fit === 'cover' || el.fit === 'stretch' ? el.fit : 'contain',
        ...(el.label ? { label: str(el.label) } : {}),
      } satisfies ImageElement
    default:
      throw new Error(`Element ${index} has unknown type "${String(el.type)}".`)
  }
}

function str(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function num(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
