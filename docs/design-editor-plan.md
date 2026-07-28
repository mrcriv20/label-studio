# Label Designer Plan

> **Status (2026-07-28):** Phases 1–3 implemented. Shared core lives in
> `src/shared/design/`, storage in `src/main/designs.ts`, pdf painter in
> `src/main/designExport.ts`, SVG painter in
> `src/renderer/src/components/design/DesignLabelSvg.tsx`, editor in
> `src/renderer/src/screens/Designer.tsx`. Phase 4 (recreating the four
> built-in layouts as designs and deleting the legacy zone renderers) is
> intentionally deferred until the designer has seen real use.

Goal: evolve Tillie Print from fixed layouts + imported artwork into a light design
program — pick a canvas size, then compose labels from boxes, text (static or bound
to product data), barcodes, and images. Products keep working exactly as today:
pick a template, fill in data, print.

## Where we are

- **Templates today are code**: `src/shared/labelTemplates.ts` hardcodes four layouts
  as zone constants; `LabelPreview.tsx` (React/DOM) and `export.ts` (pdf-lib) each
  re-implement the same coordinate math. Custom artwork templates are a single
  background PNG with fixed overlays.
- **Two barcode engines**: JsBarcode in the renderer, bwip-js in main.
- **The print pipeline is already shape-agnostic**: `buildRollLabelPDF` and
  `buildSheetPDF` consume a single-label PDF of any size (landscape support added
  with the Hot Honey Marinara work). Only the *label* rendering needs to change.

## Core architecture decision: one render core, two thin painters

The root problem to avoid repeating is preview/print divergence. Everything hinges on
a **shared, pure "layout resolver"** in `src/shared/` that both sides consume:

```
DesignTemplate + Product  ──▶  resolveLayout()  ──▶  ResolvedPrimitive[]
                                                        │
                                       ┌────────────────┴───────────────┐
                                  SVG painter                     pdf-lib painter
                              (editor + preview)                (roll/sheet export)
```

- `resolveLayout` does all binding substitution, text wrapping, auto-fit sizing, and
  positioning, using **fontkit metrics from the app's bundled fonts** so line breaks
  are identical on screen and in PDF. Output is dumb primitives: positioned rects,
  laid-out text lines, image placements, barcode rasters.
- Painters never make layout decisions. The SVG painter renders in React (editor
  canvas and product preview are literally the same component); the pdf-lib painter
  slots into `buildLabelPDF` beside the legacy path.
- Barcodes unify on **bwip-js** (it has a browser build), one implementation feeding
  both painters; JsBarcode is retired.

## Document model

New `DesignTemplate` stored as JSON (userData `designs/` + bundled seeds in
`assets/designs/`), versioned for future migration:

```ts
interface DesignTemplate {
  schemaVersion: 1
  id: string; name: string
  canvas: { widthIn: number; heightIn: number; background: string } // pt = in * 72
  elements: DesignElement[]  // z-order = array order
}

type DesignElement = Base & (Box | Text | Barcode | Image)
interface Base { id: string; x: number; y: number; w: number; h: number
                 rotation?: number; opacity?: number; locked?: boolean
                 visibleIf?: 'always' | 'showPrice' | 'showBarcode' | ... }
// Box:     fill, stroke, strokeWidth, cornerRadius
// Text:    content with {name} {price} {ingredients} … tokens, fontId, size | autoFit,
//          color, align, lineHeight, maxLines
// Barcode: bound to barcodeValue, format CODE128, showText, color
// Image:   source: 'asset' | 'productLogo', assetId?, fit: contain|cover
```

Data binding reuses the existing Product fields; `visibleIf` maps onto the existing
Display Options toggles so per-product show/hide keeps working. Template IDs get a
`design-` prefix so they coexist with `avery5821`-style layouts and `custom-` artwork
in the same picker (`listTemplates()` merges all three).

## Phases

### Phase 1 — Foundations (no UI)
- `src/shared/design/`: schema + zod-style validation, `resolveLayout()`, text
  measurement via fontkit, bwip-js barcode module usable in both processes.
- SVG painter component + pdf-lib painter; `buildLabelPDF` and `LabelPreview` route
  `design-` templates through them.
- Storage: `designs/` dir in userData, IPC for list/get/save/delete; bundled seeds
  copied on launch (same pattern as `assets/templates`).
- Prove parity with one hand-written JSON design (golden-file test: resolver output
  snapshot + rendered PDF page).

### Phase 2 — MVP editor screen
New `Designer.tsx` screen reachable from the template picker ("New design…" / "Edit"):
- Canvas setup: size presets (2.5×4 roll, 5×3, Avery slot) + custom inches.
- Insert toolbar: box, text, barcode, image; click-to-place.
- Select / drag / resize with handles on the SVG canvas (hand-rolled pointer events —
  the element count is small; add `react-moveable` only if this drags out).
- Properties inspector: numeric x/y/w/h, colors, font + size, alignment, binding
  picker (dropdown of product fields inserts `{token}`), image upload.
- Live sample-data preview using a chosen product (or placeholder data).
- Save to catalog; template immediately usable in Editor/SheetBuilder/roll print.

### Phase 3 — Editor ergonomics
- Undo/redo (immutable template snapshots — documents are tiny).
- Snapping to edges/centers/other elements, arrow-key nudge, alt-drag duplicate.
- Layers panel (reorder, lock, hide), multi-select, align/distribute.
- Zoom/pan, rulers in inches.

### Phase 4 — Convergence & extras
- Recreate the four built-in layouts as bundled design templates; keep legacy
  renderers until parity is verified, then delete the duplicated zone code in
  `LabelPreview.tsx` and `export.ts` (~700 lines).
- "Convert to design" for imported artwork: background image element + editable
  overlays (this replaces the special-cased `custom-` pipeline long-term).
- Duplicate template, rename, template thumbnails in the picker (render via the
  SVG painter — no hidden BrowserWindow needed anymore).

## Risks / notes
- **Text metric parity** is the one hard problem; solving it once in the shared
  resolver (fontkit) is why the architecture looks the way it does. Custom fonts
  already ship in `assets/`, and `fonts.ts` manages IDs — reuse that registry.
- Keep `cqw`-style responsive sizing out of the new path; all units are points,
  scaled uniformly on screen.
- Non-goals for v1: rotation UI (schema supports it, editor can wait), gradients,
  multi-page, grouping.
