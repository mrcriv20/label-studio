// pdf-lib painter for design templates, plus main-side SVG export. Both are
// thin: every layout decision already happened in the shared resolver.
import {
  PDFDocument,
  PDFPage,
  StandardFonts,
  rgb,
  pushGraphicsState,
  popGraphicsState,
  moveTo,
  lineTo,
  closePath,
  clip,
  endPath,
} from 'pdf-lib'
import { existsSync, readFileSync } from 'fs'
import { extname } from 'path'
import { nativeImage } from 'electron'
import bwipjs from 'bwip-js'
import type { Product } from './types'
import type {
  DesignTemplate,
  ResolvedBarcode,
  ResolvedDesign,
  ResolvedImage,
} from '../shared/design/types'
import { DEFAULT_DESIGN_FONT_ID } from '../shared/design/types'
import { createTextMeasurer } from '../shared/design/metrics'
import { assessDesignTextFit, resolveLayout, fitRect } from '../shared/design/resolve'
import { designBarcodeOptions } from '../shared/design/barcode'
import { paintSVG } from '../shared/design/svg'
import { getFont, fontDataUri } from './fonts'
import { designAssetPath } from './designs'
import { getDefaultTopLogoPath, readImageAsBase64 } from './fileManager'

type EmbeddedFont = Awaited<ReturnType<PDFDocument['embedFont']>>
type EmbeddedImage =
  | Awaited<ReturnType<PDFDocument['embedPng']>>
  | Awaited<ReturnType<PDFDocument['embedJpg']>>

function collectFontBytes(design: DesignTemplate): Record<string, Uint8Array> {
  const ids = new Set<string>([DEFAULT_DESIGN_FONT_ID])
  for (const element of design.elements) {
    if (element.type === 'text') ids.add(element.fontId || DEFAULT_DESIGN_FONT_ID)
  }
  const bytes: Record<string, Uint8Array> = {}
  for (const id of ids) {
    const font = getFont(id)
    if (font && existsSync(font.path)) bytes[id] = new Uint8Array(readFileSync(font.path))
  }
  return bytes
}

export function resolveDesign(design: DesignTemplate, product: Partial<Product>): ResolvedDesign {
  const measurer = createTextMeasurer(collectFontBytes(design))
  return resolveLayout(design, product, measurer)
}

export function assessDesignFit(design: DesignTemplate, product: Partial<Product>): ReturnType<typeof assessDesignTextFit> {
  return assessDesignTextFit(design, product, createTextMeasurer(collectFontBytes(design)))
}

function imageSourcePath(image: ResolvedImage, product: Partial<Product>): string {
  if (image.overridePath && existsSync(image.overridePath)) return image.overridePath
  if (image.source === 'asset') return image.assetName ? designAssetPath(image.assetName) : ''
  return product.logoImagePath && existsSync(product.logoImagePath)
    ? product.logoImagePath
    : getDefaultTopLogoPath()
}

async function renderDesignBarcode(barcode: ResolvedBarcode): Promise<Buffer | null> {
  try {
    return await bwipjs.toBuffer(designBarcodeOptions(barcode.value, barcode.showText, barcode.color))
  } catch {
    return null
  }
}

export async function drawDesignLabel(
  doc: PDFDocument,
  page: PDFPage,
  design: DesignTemplate,
  product: Product,
): Promise<void> {
  const resolved = resolveDesign(design, product)
  const H = resolved.height

  const fontCache = new Map<string, EmbeddedFont>()
  const fontBytes = collectFontBytes(design)
  const embedFontFor = async (fontId: string): Promise<EmbeddedFont> => {
    const cached = fontCache.get(fontId)
    if (cached) return cached
    let font: EmbeddedFont
    try {
      const bytes = fontBytes[fontId]
      font = bytes ? await doc.embedFont(bytes) : await doc.embedFont(StandardFonts.Helvetica)
    } catch {
      font = await doc.embedFont(StandardFonts.Helvetica)
    }
    fontCache.set(fontId, font)
    return font
  }

  page.drawRectangle({
    x: 0,
    y: 0,
    width: resolved.width,
    height: H,
    color: hexToRgb(resolved.background || '#ffffff'),
    borderWidth: 0,
  })

  for (const primitive of resolved.primitives) {
    switch (primitive.kind) {
      case 'rect': {
        if (!primitive.fill && !primitive.stroke) break
        page.drawRectangle({
          x: primitive.x,
          y: H - primitive.y - primitive.h,
          width: primitive.w,
          height: primitive.h,
          ...(primitive.fill ? { color: hexToRgb(primitive.fill) } : {}),
          ...(primitive.stroke
            ? { borderColor: hexToRgb(primitive.stroke), borderWidth: primitive.strokeWidth }
            : { borderWidth: 0 }),
          borderRadius: primitive.radius,
          opacity: primitive.opacity,
          borderOpacity: primitive.opacity,
        })
        break
      }
      case 'text': {
        const font = await embedFontFor(primitive.fontId)
        const color = hexToRgb(primitive.color)
        for (const line of primitive.lines) {
          page.drawText(line.text, {
            x: line.x,
            y: H - line.baseline,
            size: primitive.size,
            font,
            color,
            opacity: primitive.opacity,
          })
        }
        break
      }
      case 'barcode': {
        const png = await renderDesignBarcode(primitive)
        if (!png) break
        try {
          const image = await doc.embedPng(png)
          page.drawImage(image, {
            x: primitive.x,
            y: H - primitive.y - primitive.h,
            width: primitive.w,
            height: primitive.h,
            opacity: primitive.opacity,
          })
        } catch {
          // skip un-embeddable barcode
        }
        break
      }
      case 'image': {
        const sourcePath = imageSourcePath(primitive, product)
        if (!sourcePath || !existsSync(sourcePath)) break
        const image = await embedImage(doc, sourcePath)
        if (!image) break
        const frame = { x: primitive.x, y: primitive.y, w: primitive.w, h: primitive.h }
        const rect = fitRect(frame, image.width, image.height, primitive.fit)
        const clipToFrame = primitive.fit === 'cover'
        if (clipToFrame) {
          const fx = frame.x
          const fy = H - frame.y - frame.h
          page.pushOperators(
            pushGraphicsState(),
            moveTo(fx, fy),
            lineTo(fx + frame.w, fy),
            lineTo(fx + frame.w, fy + frame.h),
            lineTo(fx, fy + frame.h),
            closePath(),
            clip(),
            endPath(),
          )
        }
        page.drawImage(image, {
          x: rect.x,
          y: H - rect.y - rect.h,
          width: rect.w,
          height: rect.h,
          opacity: primitive.opacity,
        })
        if (clipToFrame) page.pushOperators(popGraphicsState())
        break
      }
    }
  }
}

async function embedImage(doc: PDFDocument, sourcePath: string): Promise<EmbeddedImage | null> {
  const bytes = readFileSync(sourcePath)
  const ext = extname(sourcePath).toLowerCase()
  try {
    if (ext === '.jpg' || ext === '.jpeg') return await doc.embedJpg(bytes)
    return await doc.embedPng(bytes)
  } catch {
    try {
      return await doc.embedJpg(bytes)
    } catch {
      return null
    }
  }
}

/** Standalone SVG export for a design-template product (parity via paintSVG). */
export async function designToSVG(design: DesignTemplate, product: Product): Promise<string> {
  const resolved = resolveDesign(design, product)

  const barcodeUris = new Map<string, string>()
  for (const primitive of resolved.primitives) {
    if (primitive.kind !== 'barcode') continue
    const key = barcodeKey(primitive)
    if (barcodeUris.has(key)) continue
    const png = await renderDesignBarcode(primitive)
    if (png) barcodeUris.set(key, `data:image/png;base64,${png.toString('base64')}`)
  }

  const usedFontIds = new Set<string>()
  for (const primitive of resolved.primitives) {
    if (primitive.kind === 'text') usedFontIds.add(primitive.fontId)
  }
  const fontCss = [...usedFontIds]
    .map((id) => {
      const uri = fontDataUri(id)
      return uri ? `@font-face{font-family:"${svgFontFamily(id)}";src:url("${uri}");}` : ''
    })
    .join('')

  return paintSVG(resolved, {
    fontFamily: (id) => svgFontFamily(id),
    fontCss,
    imageHref: (image) => {
      const path = imageSourcePath(image, product)
      return path && existsSync(path) ? readImageAsBase64(path) : null
    },
    imageSize: (image) => {
      const path = imageSourcePath(image, product)
      if (!path || !existsSync(path)) return null
      const size = nativeImage.createFromPath(path).getSize()
      return size.width && size.height ? { w: size.width, h: size.height } : null
    },
    barcodeHref: (barcode) => barcodeUris.get(barcodeKey(barcode)) ?? null,
  })
}

function barcodeKey(barcode: ResolvedBarcode): string {
  return `${barcode.value}|${barcode.showText}|${barcode.color}`
}

function svgFontFamily(fontId: string): string {
  return `LabelFont-${fontId.replace(/[^a-z0-9_-]/gi, '-')}`
}

function hexToRgb(hex: string): ReturnType<typeof rgb> {
  const normalized = hex.replace('#', '')
  const value = normalized.length === 3
    ? normalized.split('').map((char) => char + char).join('')
    : normalized
  const intValue = Number.parseInt(value, 16)
  if (Number.isNaN(intValue)) return rgb(0, 0, 0)
  return rgb(((intValue >> 16) & 255) / 255, ((intValue >> 8) & 255) / 255, (intValue & 255) / 255)
}
