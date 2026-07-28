// SVG painter: serialises resolved primitives to an SVG string. Used by the
// renderer (editor canvas + product preview) and by main for SVG export, with
// each side supplying fonts/images through the paint context.
import type { ResolvedBarcode, ResolvedDesign, ResolvedImage } from './types'
import { fitRect } from './resolve'

export interface SvgPaintContext {
  /** CSS font-family to reference for a font id. */
  fontFamily(fontId: string): string
  /** Extra CSS injected into the SVG (e.g. @font-face rules). */
  fontCss?: string
  /** Data URI for an image primitive, or null to skip drawing it. */
  imageHref(image: ResolvedImage): string | null
  /** Natural pixel size of that image (for contain/cover math). */
  imageSize(image: ResolvedImage): { w: number; h: number } | null
  /** Data URI of the rendered barcode PNG, or null to skip. */
  barcodeHref(barcode: ResolvedBarcode): string | null
}

export function paintSVG(resolved: ResolvedDesign, ctx: SvgPaintContext): string {
  const parts: string[] = []
  let clipCounter = 0

  parts.push(
    `<rect x="0" y="0" width="${resolved.width}" height="${resolved.height}" fill="${xml(resolved.background || '#ffffff')}"/>`
  )

  for (const primitive of resolved.primitives) {
    switch (primitive.kind) {
      case 'rect': {
        if (!primitive.fill && !primitive.stroke) break
        const inset = primitive.stroke ? primitive.strokeWidth / 2 : 0
        parts.push(
          `<rect x="${n(primitive.x + inset)}" y="${n(primitive.y + inset)}" width="${n(Math.max(0, primitive.w - inset * 2))}" height="${n(Math.max(0, primitive.h - inset * 2))}" rx="${n(primitive.radius)}"` +
            ` fill="${primitive.fill ? xml(primitive.fill) : 'none'}"` +
            (primitive.stroke ? ` stroke="${xml(primitive.stroke)}" stroke-width="${n(primitive.strokeWidth)}"` : '') +
            opacityAttr(primitive.opacity) +
            '/>'
        )
        break
      }
      case 'text': {
        const family = ctx.fontFamily(primitive.fontId)
        for (const line of primitive.lines) {
          parts.push(
            `<text x="${n(line.x)}" y="${n(line.baseline)}" font-family="${xml(family)}" font-size="${n(primitive.size)}" fill="${xml(primitive.color)}"${opacityAttr(primitive.opacity)} xml:space="preserve">${xml(line.text)}</text>`
          )
        }
        break
      }
      case 'barcode': {
        const href = ctx.barcodeHref(primitive)
        if (!href) break
        parts.push(
          `<image x="${n(primitive.x)}" y="${n(primitive.y)}" width="${n(primitive.w)}" height="${n(primitive.h)}" preserveAspectRatio="none" href="${href}" xlink:href="${href}"${opacityAttr(primitive.opacity)}/>`
        )
        break
      }
      case 'image': {
        const href = ctx.imageHref(primitive)
        if (!href) break
        const size = ctx.imageSize(primitive)
        const frame = { x: primitive.x, y: primitive.y, w: primitive.w, h: primitive.h }
        const rect = size ? fitRect(frame, size.w, size.h, primitive.fit) : frame
        const needsClip = primitive.fit === 'cover'
        let element = `<image x="${n(rect.x)}" y="${n(rect.y)}" width="${n(rect.w)}" height="${n(rect.h)}" preserveAspectRatio="none" href="${href}" xlink:href="${href}"${opacityAttr(primitive.opacity)}/>`
        if (needsClip) {
          const clipId = `design-clip-${clipCounter++}`
          element =
            `<clipPath id="${clipId}"><rect x="${n(frame.x)}" y="${n(frame.y)}" width="${n(frame.w)}" height="${n(frame.h)}"/></clipPath>` +
            `<g clip-path="url(#${clipId})">${element}</g>`
        }
        parts.push(element)
        break
      }
    }
  }

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${resolved.width} ${resolved.height}" width="${resolved.width}pt" height="${resolved.height}pt">` +
    (ctx.fontCss ? `<style>${ctx.fontCss}</style>` : '') +
    parts.join('') +
    '</svg>'
  )
}

function opacityAttr(opacity: number): string {
  return opacity < 1 ? ` opacity="${n(opacity)}"` : ''
}

function n(value: number): string {
  return String(Math.round(value * 100) / 100)
}

function xml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
