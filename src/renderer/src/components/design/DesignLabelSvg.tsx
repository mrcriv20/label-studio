// Renderer-side painter for design templates. Resolves the layout with the
// exact same shared code the PDF exporter uses, then paints it as SVG.
import { useEffect, useMemo, useState } from 'react'
import { toCanvas } from 'bwip-js/browser'
import type { Product, DesignTemplate } from '../../types'
import type { ResolvedBarcode, ResolvedImage } from '../../../../shared/design/types'
import type { TextMeasurer } from '../../../../shared/design/metrics'
import { createTextMeasurer } from '../../../../shared/design/metrics'
import { resolveLayout } from '../../../../shared/design/resolve'
import { designBarcodeOptions } from '../../../../shared/design/barcode'
import { paintSVG } from '../../../../shared/design/svg'
import { fontFamilyFor } from '../../lib/fonts'

const DEFAULT_TOP_LOGO_SRC = new URL('../../../../../assets/default-label-logo.png', import.meta.url).href

// ── Shared caches (fonts rarely change within a session) ─────────────────────

let measurerPromise: Promise<TextMeasurer> | null = null

async function loadMeasurer(): Promise<TextMeasurer> {
  if (!measurerPromise) {
    measurerPromise = (async () => {
      const result = await window.api.font.list()
      const bytes: Record<string, Uint8Array> = {}
      if (result.ok) {
        for (const font of result.data) {
          const decoded = dataUriToBytes(font.dataUri)
          if (decoded) bytes[font.id] = decoded
        }
      }
      return createTextMeasurer(bytes)
    })()
  }
  return measurerPromise
}

/** Drop the cached measurer (call after fonts are added/removed). */
export function invalidateDesignFonts(): void {
  measurerPromise = null
}

function dataUriToBytes(dataUri: string): Uint8Array | null {
  const base64 = dataUri.split(',')[1]
  if (!base64) return null
  try {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    return bytes
  } catch {
    return null
  }
}

const barcodeUriCache = new Map<string, string>()

function barcodeDataUri(barcode: ResolvedBarcode): string | null {
  const key = `${barcode.value}|${barcode.showText}|${barcode.color}`
  const cached = barcodeUriCache.get(key)
  if (cached) return cached
  try {
    const canvas = document.createElement('canvas')
    toCanvas(canvas, designBarcodeOptions(barcode.value, barcode.showText, barcode.color))
    const uri = canvas.toDataURL('image/png')
    barcodeUriCache.set(key, uri)
    return uri
  } catch {
    return null
  }
}

/** Hook so the Designer screen can reuse the loaded measurer directly. */
export function useTextMeasurer(): TextMeasurer | null {
  const [measurer, setMeasurer] = useState<TextMeasurer | null>(null)
  useEffect(() => {
    let alive = true
    loadMeasurer().then((m) => {
      if (alive) setMeasurer(m)
    })
    return () => {
      alive = false
    }
  }, [])
  return measurer
}

interface ImageInfo {
  uri: string
  w: number
  h: number
}

/** Loads asset/logo/override images referenced by a design and reports natural sizes. */
export function useDesignImages(
  design: DesignTemplate | null,
  logoDataUri?: string,
  overrides?: Record<string, string> | null,
): Record<string, ImageInfo> {
  const [images, setImages] = useState<Record<string, ImageInfo>>({})
  const overridesKey = useMemo(() => JSON.stringify(overrides ?? {}), [overrides])
  const assetNames = useMemo(
    () =>
      (design?.elements ?? [])
        .filter((el) => el.type === 'image' && el.source === 'asset' && el.assetName)
        .map((el) => (el.type === 'image' && el.assetName) || '')
        .filter(Boolean)
        .sort()
        .join('\n'),
    [design],
  )
  const usesLogo = useMemo(
    () => (design?.elements ?? []).some((el) => el.type === 'image' && el.source === 'productLogo'),
    [design],
  )

  useEffect(() => {
    let alive = true
    const next: Record<string, ImageInfo> = {}
    const tasks: Array<Promise<void>> = []

    const loadInto = (key: string, uri: string): Promise<void> =>
      new Promise((resolve) => {
        if (!uri) return resolve()
        const image = new Image()
        image.onload = () => {
          next[key] = { uri, w: image.naturalWidth, h: image.naturalHeight }
          resolve()
        }
        image.onerror = () => resolve()
        image.src = uri
      })

    for (const assetName of assetNames.split('\n').filter(Boolean)) {
      tasks.push(
        window.api.design.assetDataUri(assetName).then((result) => {
          if (result.ok && result.data) return loadInto(`asset:${assetName}`, result.data)
          return undefined
        }),
      )
    }
    if (usesLogo) tasks.push(loadInto('logo', logoDataUri || DEFAULT_TOP_LOGO_SRC))

    const parsedOverrides = JSON.parse(overridesKey) as Record<string, string>
    for (const [elementId, path] of Object.entries(parsedOverrides)) {
      if (!path) continue
      tasks.push(
        window.api.file.readImageAsBase64(path).then((result) => {
          if (result.ok && result.data) return loadInto(`override:${elementId}`, result.data)
          return undefined
        }),
      )
    }

    Promise.all(tasks).then(() => {
      if (alive) setImages(next)
    })
    return () => {
      alive = false
    }
  }, [assetNames, usesLogo, logoDataUri, overridesKey])

  return images
}

/** Lookup order: per-label override first, then the design's own source. */
export function imageKeysFor(image: ResolvedImage): string[] {
  const baseKey = image.source === 'asset' ? `asset:${image.assetName ?? ''}` : 'logo'
  return image.overridePath ? [`override:${image.elementId}`, baseKey] : [baseKey]
}

function lookupImage(images: Record<string, ImageInfo>, image: ResolvedImage): ImageInfo | null {
  for (const key of imageKeysFor(image)) {
    const info = images[key]
    if (info) return info
  }
  return null
}

/** Paint a resolved design to an SVG string using renderer-side resources. */
export function paintDesignSVG(
  design: DesignTemplate,
  product: Partial<Product>,
  measurer: TextMeasurer,
  images: Record<string, ImageInfo>,
): string {
  const resolved = resolveLayout(design, product, measurer)
  return paintSVG(resolved, {
    fontFamily: (fontId) => fontFamilyFor(fontId),
    imageHref: (image) => lookupImage(images, image)?.uri ?? null,
    imageSize: (image) => {
      const info = lookupImage(images, image)
      return info ? { w: info.w, h: info.h } : null
    },
    barcodeHref: (barcode) => barcodeDataUri(barcode),
  })
}

interface Props {
  design: DesignTemplate
  product: Partial<Product>
  logoDataUri?: string
  scale?: number
  /** Extra chrome (shadow/rounding) for the product-preview context. */
  framed?: boolean
}

export default function DesignLabelSvg({
  design,
  product,
  logoDataUri,
  scale = 1,
  framed = true,
}: Props): JSX.Element {
  const measurer = useTextMeasurer()
  const images = useDesignImages(design, logoDataUri, product.designImageOverrides)

  const svg = useMemo(() => {
    if (!measurer) return ''
    return paintDesignSVG(design, product, measurer, images)
  }, [design, product, measurer, images])

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: `${design.canvas.width} / ${design.canvas.height}`,
        overflow: 'hidden',
        borderRadius: framed ? 12 : 0,
        boxShadow: framed ? '0 4px 24px rgba(0,0,0,0.16)' : 'none',
        background: design.canvas.background || '#ffffff',
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        flexShrink: 0,
      }}
      className="design-label-svg"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
