// The single source of layout truth: turns a DesignTemplate + product data
// into positioned primitives. Painters (SVG in the renderer, pdf-lib in main)
// draw the output verbatim and never make layout decisions of their own.
import type {
  BarcodeElement,
  DesignElement,
  DesignProductData,
  DesignTemplate,
  ImageElement,
  ResolvedDesign,
  ResolvedPrimitive,
  ResolvedText,
  ResolvedTextLine,
  TextCase,
  TextElement,
} from './types'
import { DEFAULT_DESIGN_FONT_ID } from './types'
import type { TextMeasurer } from './metrics'

const MIN_AUTO_FIT_SIZE = 4

export interface DesignTextFitIssue {
  elementId: string
  field: string
  status: 'tight' | 'clipped'
  message: string
}

export function resolveLayout(
  design: DesignTemplate,
  product: DesignProductData,
  measurer: TextMeasurer,
): ResolvedDesign {
  const primitives: ResolvedPrimitive[] = []
  for (const element of design.elements) {
    if (!isVisible(element, product)) continue
    const opacity = clamp(element.opacity ?? 1, 0, 1)
    switch (element.type) {
      case 'box':
        primitives.push({
          kind: 'rect',
          x: element.x,
          y: element.y,
          w: element.w,
          h: element.h,
          fill: element.fill,
          stroke: element.stroke,
          strokeWidth: element.strokeWidth,
          radius: element.cornerRadius,
          opacity,
        })
        break
      case 'text': {
        const resolved = resolveText(element, product, measurer, opacity)
        if (resolved) primitives.push(resolved)
        break
      }
      case 'barcode': {
        const resolved = resolveBarcode(element, product, opacity)
        if (resolved) primitives.push(resolved)
        break
      }
      case 'image':
        primitives.push(resolveImage(element, product, opacity))
        break
    }
  }
  return {
    width: design.canvas.width,
    height: design.canvas.height,
    background: design.canvas.background,
    primitives,
  }
}

function isVisible(element: DesignElement, product: DesignProductData): boolean {
  switch (element.visibleIf) {
    case 'showPrice':
      return product.showPrice !== false
    case 'showBarcode':
      return product.showBarcode !== false
    case 'showCookingInstructions':
      return product.showCookingInstructions !== false
    case 'showProductName':
      return product.showProductName !== false
    default:
      return true
  }
}

export function substituteTokens(content: string, product: DesignProductData): string {
  return content.replace(/\{([a-zA-Z]+)\}/g, (_match, field: string) => {
    const value = (product as Record<string, unknown>)[field]
    return typeof value === 'string' ? value : ''
  })
}

/** Uses the same measurer, wrapping, auto-fit floor, and line caps as rendering. */
export function assessDesignTextFit(
  design: DesignTemplate,
  product: DesignProductData,
  measurer: TextMeasurer,
): DesignTextFitIssue[] {
  const issues: DesignTextFitIssue[] = []
  for (const element of design.elements) {
    if (element.type !== 'text' || !isVisible(element, product)) continue
    const text = applyTextCase(substituteTokens(element.content, product).trim(), element.textCase)
    if (!text) continue
    const fontId = element.fontId || DEFAULT_DESIGN_FONT_ID
    const fitAt = (size: number): string[][] => text.split(/\n/).map((paragraph) => wrapLine(paragraph, fontId, size, element.w, measurer))
    let size = element.size
    let paragraphs = fitAt(size)
    if (element.autoFit) {
      while (size > MIN_AUTO_FIT_SIZE && !fits(paragraphs, element, fontId, size, measurer)) {
        size = Math.max(MIN_AUTO_FIT_SIZE, size - 0.5)
        paragraphs = fitAt(size)
      }
    }
    const lines = paragraphs.flat()
    const lineStep = size * element.lineHeight
    const maxByHeight = Math.max(1, Math.floor((element.h + lineStep - size) / lineStep))
    const maxLines = Math.min(element.maxLines ?? Infinity, maxByHeight)
    const clipped = lines.length > maxLines || !fits(paragraphs, element, fontId, size, measurer)
    const field = element.content.match(/\{([a-zA-Z]+)\}/)?.[1] ?? element.label ?? 'Text'
    if (clipped) {
      issues.push({ elementId: element.id, field, status: 'clipped', message: `${field} does not fit the “${element.label || 'text'}” template area.` })
    } else if (element.autoFit && size <= Math.max(MIN_AUTO_FIT_SIZE + 1, element.size * 0.65)) {
      issues.push({ elementId: element.id, field, status: 'tight', message: `${field} fits only at ${size.toFixed(1)} pt in “${element.label || 'text'}”.` })
    }
  }
  return issues
}

function resolveText(
  element: TextElement,
  product: DesignProductData,
  measurer: TextMeasurer,
  opacity: number,
): ResolvedText | null {
  const text = applyTextCase(substituteTokens(element.content, product).trim(), element.textCase)
  if (!text) return null
  const fontId = element.fontId || DEFAULT_DESIGN_FONT_ID

  const fit = (size: number): string[][] => {
    // Paragraphs (explicit newlines) wrap independently.
    return text.split(/\n/).map((paragraph) => wrapLine(paragraph, fontId, size, element.w, measurer))
  }

  let size = element.size
  let paragraphs = fit(size)
  if (element.autoFit) {
    while (size > MIN_AUTO_FIT_SIZE && !fits(paragraphs, element, fontId, size, measurer)) {
      size = Math.max(MIN_AUTO_FIT_SIZE, size - 0.5)
      paragraphs = fit(size)
    }
  }

  let lines = paragraphs.flat()
  const lineStep = size * element.lineHeight
  const maxByHeight = Math.max(1, Math.floor((element.h + lineStep - size) / lineStep))
  const maxLines = Math.min(element.maxLines ?? Infinity, maxByHeight)
  if (lines.length > maxLines) lines = lines.slice(0, maxLines)

  const ascent = measurer.ascent(fontId, size)
  const resolvedLines: ResolvedTextLine[] = lines.map((line, index) => {
    const lineWidth = measurer.widthOf(fontId, line, size)
    const x =
      element.align === 'center'
        ? element.x + (element.w - lineWidth) / 2
        : element.align === 'right'
          ? element.x + element.w - lineWidth
          : element.x
    return { text: line, x, baseline: element.y + ascent + index * lineStep }
  })

  return {
    kind: 'text',
    lines: resolvedLines,
    fontId,
    size,
    color: element.color,
    opacity,
  }
}

function fits(
  paragraphs: string[][],
  element: TextElement,
  fontId: string,
  size: number,
  measurer: TextMeasurer,
): boolean {
  const lines = paragraphs.flat()
  if (element.maxLines && lines.length > element.maxLines) return false
  const lineStep = size * element.lineHeight
  if (size + (lines.length - 1) * lineStep > element.h) return false
  return lines.every((line) => measurer.widthOf(fontId, line, size) <= element.w + 0.01)
}

export function applyTextCase(text: string, textCase?: TextCase): string {
  switch (textCase) {
    case 'upper':
      return text.toUpperCase()
    case 'lower':
      return text.toLowerCase()
    case 'title':
      // Capitalize the first letter of every word, lowercase the rest.
      return text.toLowerCase().replace(/(^|[\s\-–—/("'])(\p{L})/gu, (_m, lead: string, letter: string) => lead + letter.toUpperCase())
    case 'sentence':
      // Capitalize the first letter of each sentence, lowercase the rest.
      return text
        .toLowerCase()
        .replace(/(^|[.!?]\s+|\n\s*)(\p{L})/gu, (_m, lead: string, letter: string) => lead + letter.toUpperCase())
    default:
      return text
  }
}

function wrapLine(
  text: string,
  fontId: string,
  size: number,
  maxWidth: number,
  measurer: TextMeasurer,
): string[] {
  const words = text.split(/\s+/).filter(Boolean)
  if (!words.length) return []
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const trial = current ? `${current} ${word}` : word
    if (measurer.widthOf(fontId, trial, size) <= maxWidth || !current) current = trial
    else {
      lines.push(current)
      current = word
    }
  }
  if (current) lines.push(current)
  return lines
}

function resolveBarcode(
  element: BarcodeElement,
  product: DesignProductData,
  opacity: number,
): ResolvedPrimitive | null {
  const value = (product.barcodeValue ?? '').trim()
  if (!value) return null
  return {
    kind: 'barcode',
    x: element.x,
    y: element.y,
    w: element.w,
    h: element.h,
    value,
    showText: element.showText,
    color: element.color,
    opacity,
  }
}

function resolveImage(
  element: ImageElement,
  product: DesignProductData,
  opacity: number,
): ResolvedPrimitive {
  const overridePath = product.designImageOverrides?.[element.id]
  return {
    kind: 'image',
    x: element.x,
    y: element.y,
    w: element.w,
    h: element.h,
    elementId: element.id,
    source: element.source,
    assetName: element.assetName,
    ...(overridePath ? { overridePath } : {}),
    fit: element.fit,
    opacity,
  }
}

/**
 * Fit an image of natural size (imgW × imgH) into a frame. Shared by both
 * painters so cropping/letterboxing matches exactly. For 'cover' the result
 * overflows the frame and must be clipped to it.
 */
export function fitRect(
  frame: { x: number; y: number; w: number; h: number },
  imgW: number,
  imgH: number,
  fit: 'contain' | 'cover' | 'stretch',
): { x: number; y: number; w: number; h: number } {
  if (fit === 'stretch' || !imgW || !imgH) return { ...frame }
  const scale =
    fit === 'contain'
      ? Math.min(frame.w / imgW, frame.h / imgH)
      : Math.max(frame.w / imgW, frame.h / imgH)
  const w = imgW * scale
  const h = imgH * scale
  return { x: frame.x + (frame.w - w) / 2, y: frame.y + (frame.h - h) / 2, w, h }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
