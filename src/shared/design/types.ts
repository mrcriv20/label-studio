// Design-template document model shared by the editor (renderer) and the
// PDF exporter (main). All coordinates are PDF points with the origin at the
// TOP-LEFT of the canvas; painters convert to their native coordinate space.

export const DESIGN_ID_PREFIX = 'design-'

/** Font used when a text element has no explicit fontId. */
export const DEFAULT_DESIGN_FONT_ID = 'bundled:lora'

export type VisibleIf =
  | 'always'
  | 'showPrice'
  | 'showBarcode'
  | 'showCookingInstructions'
  | 'showProductName'

export type BindableField =
  | 'name'
  | 'price'
  | 'category'
  | 'ingredients'
  | 'allergenStatement'
  | 'servingInfo'
  | 'nutritionInfo'
  | 'cookingInstructions'
  | 'customerName'
  | 'barcodeValue'

export const BINDABLE_FIELDS: Array<{ field: BindableField; label: string }> = [
  { field: 'name', label: 'Product name' },
  { field: 'price', label: 'Price' },
  { field: 'category', label: 'Category' },
  { field: 'ingredients', label: 'Ingredients' },
  { field: 'allergenStatement', label: 'Allergen statement' },
  { field: 'servingInfo', label: 'Serving info' },
  { field: 'nutritionInfo', label: 'Nutrition info' },
  { field: 'cookingInstructions', label: 'Cooking instructions' },
  { field: 'customerName', label: 'Customer name' },
  { field: 'barcodeValue', label: 'Barcode number' },
]

export interface DesignElementBase {
  id: string
  x: number
  y: number
  w: number
  h: number
  opacity?: number // 0–1, absent = 1
  locked?: boolean
  visibleIf?: VisibleIf // absent = always
}

export interface BoxElement extends DesignElementBase {
  type: 'box'
  fill: string // '' = no fill
  stroke: string // '' = no stroke
  strokeWidth: number
  cornerRadius: number
}

export type TextAlign = 'left' | 'center' | 'right'

export type TextCase = 'none' | 'upper' | 'lower' | 'title' | 'sentence'

export const TEXT_CASE_OPTIONS: Array<{ value: TextCase; label: string }> = [
  { value: 'none', label: 'As typed' },
  { value: 'upper', label: 'UPPERCASE' },
  { value: 'lower', label: 'lowercase' },
  { value: 'title', label: 'Title Case' },
  { value: 'sentence', label: 'Sentence case' },
]

export interface TextElement extends DesignElementBase {
  type: 'text'
  /** Static text with optional {field} tokens, e.g. "Only {price}!" */
  content: string
  fontId: string // id from the app font registry ('' = default body font)
  size: number // pt; when autoFit is on this is the maximum size
  autoFit: boolean
  color: string
  align: TextAlign
  lineHeight: number // multiplier, e.g. 1.1
  maxLines?: number
  textCase?: TextCase // absent = 'none'; applied after token substitution
}

export interface BarcodeElement extends DesignElementBase {
  type: 'barcode'
  // Value always binds to product.barcodeValue (CODE128).
  showText: boolean
  color: string
}

export type ImageFit = 'contain' | 'cover' | 'stretch'

export interface ImageElement extends DesignElementBase {
  type: 'image'
  source: 'productLogo' | 'asset'
  /** File name inside the design-assets folder (source = 'asset'). */
  assetName?: string
  fit: ImageFit
  /** Name shown in the product editor when this image is replaced per label. */
  label?: string
}

export type DesignElement = BoxElement | TextElement | BarcodeElement | ImageElement

export interface DesignTemplate {
  schemaVersion: 1
  id: string // 'design-…'
  name: string
  canvas: {
    width: number // pt (1 in = 72 pt)
    height: number // pt
    background: string
  }
  elements: DesignElement[] // z-order = array order (first = back)
  createdAt: string
  updatedAt: string
}

// ── Resolved primitives (painter input) ──────────────────────────────────────

export interface ResolvedRect {
  kind: 'rect'
  x: number
  y: number
  w: number
  h: number
  fill: string
  stroke: string
  strokeWidth: number
  radius: number
  opacity: number
}

export interface ResolvedTextLine {
  text: string
  x: number // left edge of the line (alignment already applied)
  baseline: number // baseline y measured from the TOP of the canvas
}

export interface ResolvedText {
  kind: 'text'
  lines: ResolvedTextLine[]
  fontId: string
  size: number
  color: string
  opacity: number
}

export interface ResolvedBarcode {
  kind: 'barcode'
  x: number
  y: number
  w: number
  h: number
  value: string
  showText: boolean
  color: string
  opacity: number
}

export interface ResolvedImage {
  kind: 'image'
  x: number
  y: number
  w: number
  h: number
  elementId: string
  source: 'productLogo' | 'asset'
  assetName?: string
  /** Per-product replacement image (absolute path); wins over source when set. */
  overridePath?: string
  fit: ImageFit
  opacity: number
}

export type ResolvedPrimitive = ResolvedRect | ResolvedText | ResolvedBarcode | ResolvedImage

export interface ResolvedDesign {
  width: number
  height: number
  background: string
  primitives: ResolvedPrimitive[]
}

/** The subset of Product the resolver reads. */
export interface DesignProductData {
  name?: string
  price?: string
  category?: string
  ingredients?: string
  allergenStatement?: string
  servingInfo?: string
  nutritionInfo?: string
  cookingInstructions?: string
  customerName?: string
  barcodeValue?: string
  showPrice?: boolean
  showBarcode?: boolean
  showCookingInstructions?: boolean
  showProductName?: boolean
  /** Per-label image replacements: design image element id → stored image path. */
  designImageOverrides?: Record<string, string> | null
}

export function isDesignTemplateId(templateId?: string | null): boolean {
  return Boolean(templateId && templateId.startsWith(DESIGN_ID_PREFIX))
}
