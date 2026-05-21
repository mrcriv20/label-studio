# Label Studio — Grazia's Italian Market

A desktop Electron app for designing, managing, and printing retail product labels based on the Grazia's Italian Market EPS template.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Launch in development mode
npm run dev

# 3. (Optional) Seed a sample product after first launch
node scripts/seed.js
```

---

## Development Commands

| Command | Description |
|---|---|
| `npm run dev` | Start Electron app in hot-reload dev mode |
| `npm run build` | Build all three bundles (main, preload, renderer) |
| `npm run package` | Build + package as macOS .dmg |
| `npm run convert-template` | Re-convert EPS → PNG (requires Ghostscript) |

---

## Project Structure

```
label-studio/
├── assets/
│   ├── label-template.eps          # Original Illustrator EPS (master)
│   └── label-template-300dpi.png   # 300 DPI PNG for in-app preview
├── src/
│   ├── main/                       # Electron main process (Node.js)
│   │   ├── index.ts                # App entry, BrowserWindow setup
│   │   ├── database.ts             # JSON-file persistence (products + settings)
│   │   ├── ipc.ts                  # All IPC channel handlers
│   │   ├── export.ts               # PDF + SVG export engine
│   │   └── fileManager.ts          # Asset copy, barcode image management
│   ├── preload/
│   │   └── index.ts                # contextBridge API surface
│   └── renderer/src/               # React UI (TypeScript)
│       ├── App.tsx                 # Root router
│       ├── screens/
│       │   ├── Library.tsx         # Product list / dashboard
│       │   ├── Editor.tsx          # Label editor with live preview
│       │   ├── SheetBuilder.tsx    # 8-up Avery sheet layout + export
│       │   └── Settings.tsx        # App settings
│       ├── components/
│       │   ├── LabelPreview.tsx    # WYSIWYG label canvas
│       │   ├── BarcodeCanvas.tsx   # JsBarcode SVG component
│       │   └── Nav.tsx             # Top navigation bar
│       └── lib/
│           ├── avery5821.ts        # Avery 5821 layout constants
│           └── barcode.ts          # Barcode value generator
├── scripts/
│   ├── seed.js                     # Inject sample product into DB
│   └── convert-template.js         # EPS → PNG conversion script
└── electron.vite.config.ts         # Build configuration
```

---

## EPS Template Handling

### Source File
`assets/label-template.eps` — Adobe Illustrator 30.4 EPS, created for Grazia's Italian Market.

**Dimensions:** 181 × 289 PostScript points = **2.514" × 4.014"** (portrait)

### Conversion Approach
The EPS is converted once to a 300 DPI PNG using Ghostscript:

```bash
gs -dBATCH -dNOPAUSE -dSAFER -sDEVICE=png16m -r300 -dEPSCrop \
   -sOutputFile=assets/label-template-300dpi.png assets/label-template.eps
```

The converted PNG (`754 × 1204 px`) is used as:
- The background image in the in-app label preview
- The embedded background in exported PDFs
- The background in exported SVG files

The original EPS is preserved in the app's userData folder for reference.

### Why not edit EPS directly?
Adobe Illustrator EPS files contain binary-encoded PostScript (DOS EPS format with embedded TIFF preview). Editing EPS in a browser/Node.js context would require a full PostScript interpreter. The PNG-overlay approach is standard practice for label printing software and produces print-quality results.

### Tradeoff
- ✅ Simple, reliable, works everywhere
- ✅ Template PNG at 300 DPI is print-quality
- ✅ Exported PDFs open correctly in Adobe Illustrator
- ⚠️ Text is rasterized (not vector) in the template background
- ⚠️ Product name/price overlays are Helvetica Bold (standard PDF font)

For fully-vector output, the product name and price text in the exported PDF **are vector** (drawn by pdf-lib); only the template background is raster.

---

## Avery 5821 Sheet Layout

### Dimensions (verified from physical label constraints)

```typescript
const AVERY_5821 = {
  pageWidthIn:      8.5,    // US Letter
  pageHeightIn:     11,
  labelWidthIn:     2.5,    // portrait width
  labelHeightIn:    4.0,    // portrait height
  labelsPerSheet:   8,
  columns:          2,
  rows:             4,
  marginTopIn:      0.5,    // (11 - 4×2.5) / 2
  marginLeftIn:     0.25,   // (8.5 - 2×4) / 2
  horizontalGapIn:  0,
  verticalGapIn:    0,
}
```

### Layout explanation
The label template is **portrait** (2.5" wide × 4" tall). To fit 8 labels on a US Letter sheet (8.5" × 11"), labels are placed in **landscape** orientation (4" wide × 2.5" tall per slot):

```
 ┌──────────────────────────────┐  ← 8.5"
 │  ┌──────────┐┌──────────┐   │
 │  │  Slot 1  ││  Slot 2  │   │ ← 0.5" top margin
 │  ├──────────┤├──────────┤   │ ← 2.5" each
 │  │  Slot 3  ││  Slot 4  │   │
 │  ├──────────┤├──────────┤   │
 │  │  Slot 5  ││  Slot 6  │   │
 │  ├──────────┤├──────────┤   │
 │  │  Slot 7  ││  Slot 8  │   │
 │  └──────────┘└──────────┘   │ ← 0.5" bottom margin
 └──────────────────────────────┘
    0.25"      4"      0.25"
```

Each slot is 4" × 2.5". The label template image is stretched to fill each slot.

---

## Data Storage

Products and settings are stored as JSON files in the Electron `userData` directory:

| Platform | Path |
|---|---|
| macOS | `~/Library/Application Support/label-studio/` |
| Windows | `%APPDATA%\label-studio\` |

Files:
- `products.json` — all product records
- `settings.json` — app settings
- `assets/label-template.eps` — template copy
- `assets/label-template-300dpi.png` — rasterized preview
- `barcodes/` — uploaded barcode images

---

## Printing Instructions

⚠️ **Always print at 100% / Actual Size**

In macOS Print dialog:
- Scale: **100%**
- Paper: **US Letter**
- Do NOT select "Fit to Page" or "Scale to Fit"

The exported PDF is exactly sized for US Letter paper with Avery 5821 placement. Any scaling will misalign labels with the physical sheet.

---

## Stack

| Layer | Technology |
|---|---|
| Desktop shell | Electron 31 |
| Build system | electron-vite 2, Vite 5 |
| UI framework | React 18 + TypeScript 5 |
| Styling | Tailwind CSS 3 |
| Icons | Lucide React |
| Persistence | JSON files (via Node.js fs) |
| Barcode (UI) | JsBarcode (SVG) |
| Barcode (export) | bwip-js (pure JS, no native deps) |
| PDF export | pdf-lib |
| SVG export | Custom SVG template strings |

---

## Sample Product

After first launch, run:
```bash
node scripts/seed.js
```

This inserts:
- **Name:** Fresh Mozzarella
- **Price:** $9.99/lb
- **Barcode:** 112000000008 (Code 128)
