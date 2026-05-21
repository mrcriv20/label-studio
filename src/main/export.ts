/**
 * Export engine — single-label PDF, 8-up sheet PDF (Avery 5821), SVG.
 *
 * Label template: portrait 181 × 289 pt.
 * Sheet slots: landscape 288 × 180 pt (4" × 2.5"), 2 cols × 4 rows.
 *
 * Rotation approach for sheet: each portrait label is rendered into its own
 * mini-PDF, embedded as a PDFEmbeddedPage, then placed with drawPage() using
 * rotate(90°) CCW. This maps the portrait's visual top (branding) to the
 * LEFT of each landscape slot, and the white content area to the RIGHT —
 * matching the Avery 5821 reference layout.
 *
 * drawPage rotation math (CCW 90° around bottom-left pivot):
 *   After rotation, a w×h rect at (x, y) occupies x:[x−h, x], y:[y, y+w].
 *   To fill slot (slotX, slotY)→(slotX+288, slotY+180):
 *     x = slotX + 288,  y = slotY,  width = 180,  height = 288
 */

import { PDFDocument, rgb, StandardFonts, degrees, PDFPage } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'
import bwipjs from 'bwip-js'
import type { Product } from './types'
import { getTemplatePNGPath } from './fileManager'

// ── Geometry ──────────────────────────────────────────────────────────────────

const LW = 181   // label portrait width  pt
const LH = 289   // label portrait height pt

const AVERY = {
  pageW: 612, pageH: 792,        // US Letter portrait
  slotW: 288, slotH: 180,        // 4" × 2.5" landscape slots
  marginLeft: 18, marginTop: 36, // 0.25" / 0.5"
  cols: 2, rows: 4,
}

/**
 * Field positions — portrait label, PDF y=0 at bottom-left (289pt tall).
 *
 * White content box: y ≈ 6 → 167 from bottom (lower 58% of label).
 * After 90° CCW rotation this becomes the RIGHT portion of the landscape slot.
 *
 * IMPORTANT — after CCW rotation axes swap:
 *   portrait x-axis  →  landscape y-axis  (controls slot height position)
 *   portrait y-axis  →  landscape x-axis  (controls slot width,  measured from right)
 *
 * So barcode.w (portrait width)  becomes landscape HEIGHT — keep it ≤ ~80pt.
 *    barcode.h (portrait height) becomes landscape WIDTH  — fine at 50–60pt.
 *
 * For text, cap-height ≈ 0.72 × fontSize.  Top of first line:
 *   nameY0 + 0.72*size must stay below y=167 (white box top).
 *   With size=22 → 0.72*22=15.8; so nameY0 must be ≤ 151.
 *
 *   y=151  ← name first-line baseline (cap tops at ~167, just inside white box)
 *   y=78   ← price baseline
 *   y=10   ← barcode bottom
 */
/**
 * After CCW rotation: portrait y-axis → landscape x-axis (measured from right).
 * Landscape x = slotW − sx·(portrait y).  Content area: landscape x = 121–288 (167 pt).
 *
 * Target landscape distribution (left=near branding, right=far right):
 *   Name    landscape x ≈ 130–180  →  portrait y ≈ 108–158
 *   Price   landscape x ≈ 194–220  →  portrait y ≈  68– 94
 *   Barcode landscape x ≈ 228–278  →  portrait y ≈  10– 60
 *
 * mask.topFrac = 0.42 keeps the white rectangle exactly at the white-box boundary
 * (portrait y ≈ 167) so the decorative arcs above are never covered.
 */
const F = {
  name:    { yBase: 128, lineH: 28, maxW: 155 },
  price:   { yBase: 75,             maxW: 155 },
  barcode: { x: 57, y: 10, w: 68, h: 50 },
  mask:    { topFrac: 0.42, leftFrac: 0.03, rightFrac: 0.03, bottomFrac: 0.02 },
}

// ── Font helpers ──────────────────────────────────────────────────────────────

type EmbeddedFont = Awaited<ReturnType<PDFDocument['embedFont']>>

function readFontBytes(...paths: string[]): Buffer | null {
  for (const p of paths) {
    if (existsSync(p)) { try { return readFileSync(p) } catch { /* next */ } }
  }
  return null
}

const home = homedir()
const USER_FONTS = join(home, 'Library', 'Fonts')
const SYS_FONTS  = '/Library/Fonts'
const APPLE_SYS_FONTS = '/System/Library/Fonts'

function scoreFontFile(fileName: string): number {
  const n = fileName.toLowerCase()
  let score = 0
  if (n.includes('bold')) score += 100
  if (n.includes('variable')) score += 70
  if (n.includes('regular')) score += 40
  if (n.includes('italic')) score -= 20
  return score
}

function findFamilyFontBytes(family: string, exactCandidates: string[]): Buffer | null {
  const dirs = [USER_FONTS, SYS_FONTS, APPLE_SYS_FONTS]

  // Fast path for known filenames.
  const exactPaths: string[] = []
  for (const dir of dirs) {
    for (const fileName of exactCandidates) exactPaths.push(join(dir, fileName))
  }
  const exact = readFontBytes(...exactPaths)
  if (exact) return exact

  // Fallback: scan for matching family files and pick best candidate.
  const familyNeedle = family.toLowerCase()
  const discovered: string[] = []
  for (const dir of dirs) {
    if (!existsSync(dir)) continue
    try {
      for (const fileName of readdirSync(dir)) {
        const lower = fileName.toLowerCase()
        if (!lower.includes(familyNeedle)) continue
        if (!/\.(ttf|otf)$/.test(lower)) continue
        discovered.push(join(dir, fileName))
      }
    } catch {
      // Skip unreadable font directories.
    }
  }

  discovered.sort((a, b) => scoreFontFile(b) - scoreFontFile(a))
  return readFontBytes(...discovered)
}

const LORA_BYTES = findFamilyFontBytes('lora', [
  'Lora-Bold.ttf',
  'Lora-SemiBold.ttf',
  'Lora-VariableFont_wght.ttf',
  'Lora-Regular.ttf',
])

const GENTY_BYTES = findFamilyFontBytes('genty', [
  'GentyDemo-Regular.ttf',
  'Genty Demo Regular.ttf',
])

async function embedFonts(pdfDoc: PDFDocument): Promise<{ name: EmbeddedFont; price: EmbeddedFont }> {
  const fallback = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const nameFnt  = LORA_BYTES  ? await pdfDoc.embedFont(LORA_BYTES)  : fallback
  const priceFnt = GENTY_BYTES ? await pdfDoc.embedFont(GENTY_BYTES) : fallback
  return { name: nameFnt, price: priceFnt }
}

// ── Template & barcode ────────────────────────────────────────────────────────

function loadTemplateBytesOnce(): Uint8Array | null {
  const p = getTemplatePNGPath()
  if (!existsSync(p)) return null
  try { return new Uint8Array(readFileSync(p)) } catch { return null }
}

async function renderBarcodePNG(value: string): Promise<Buffer> {
  return bwipjs.toBuffer({
    bcid: 'code128', text: value, scale: 3, height: 12,
    includetext: true, textxalign: 'center',
    backgroundcolor: 'ffffff', barcolor: '1a2332', textcolor: '1a2332',
  })
}

async function getBarcodePNG(product: Product): Promise<Buffer | null> {
  try {
    if (product.barcodeImagePath && existsSync(product.barcodeImagePath))
      return readFileSync(product.barcodeImagePath)
    return await renderBarcodePNG(product.barcodeValue)
  } catch { return null }
}

// ── Core portrait label drawing ───────────────────────────────────────────────

/**
 * Draw one label in portrait space at (ox, oy).
 * All positions are in portrait coordinates (PDF: y=0 at bottom-left).
 */
async function drawLabel(
  page: PDFPage,
  product: Product,
  ox: number,
  oy: number,
  templateImg: Awaited<ReturnType<PDFDocument['embedPng']>> | null,
  barcodeImg:  Awaited<ReturnType<PDFDocument['embedPng']>> | null,
  fonts: { name: EmbeddedFont; price: EmbeddedFont },
): Promise<void> {
  // Background template
  if (templateImg) {
    page.drawImage(templateImg, { x: ox, y: oy, width: LW, height: LH })
  } else {
    page.drawRectangle({ x: ox, y: oy, width: LW, height: LH, color: rgb(0.97, 0.96, 0.93) })
  }

  // Cover the border stroke baked into the template PNG
  const BG = rgb(0.965, 0.949, 0.875)
  const B  = 4
  page.drawRectangle({ x: ox,           y: oy,            width: LW, height: B,  color: BG, borderWidth: 0 })
  page.drawRectangle({ x: ox,           y: oy + LH - B,   width: LW, height: B,  color: BG, borderWidth: 0 })
  page.drawRectangle({ x: ox,           y: oy,            width: B,  height: LH, color: BG, borderWidth: 0 })
  page.drawRectangle({ x: ox + LW - B,  y: oy,            width: B,  height: LH, color: BG, borderWidth: 0 })

  // White mask over baked-in sample content in the template PNG
  page.drawRectangle({
    x:      ox + LW * F.mask.leftFrac,
    y:      oy + LH * F.mask.bottomFrac,
    width:  LW * (1 - F.mask.leftFrac  - F.mask.rightFrac),
    height: LH * (1 - F.mask.topFrac   - F.mask.bottomFrac),
    color: rgb(1, 1, 1),
    borderWidth: 0,
  })

  // Product name — Lora Bold, centered, word-wrapped
  // Cap-height of first line must stay below y=167 (white box top).
  // With yBase=128 + lineH/2=14 → nameY0=142; cap tops at 142+0.72*22≈158 < 167 ✓
  const nameSize  = product.name.length > 18 ? 16 : product.name.length > 12 ? 19 : 22
  const nameLines = wrapText(product.name, fonts.name, nameSize, F.name.maxW)
  const blockH    = (nameLines.length - 1) * F.name.lineH
  const nameY0    = oy + F.name.yBase + blockH / 2

  nameLines.forEach((line, i) => {
    const lw = fonts.name.widthOfTextAtSize(line, nameSize)
    page.drawText(line, {
      x: ox + LW / 2 - lw / 2,
      y: nameY0 - i * F.name.lineH,
      size: nameSize, font: fonts.name,
      color: rgb(0.1, 0.14, 0.19),
    })
  })

  // Price — Genty Demo, centered
  const priceSize = product.price.length > 10 ? 20 : 26
  const priceW    = fonts.price.widthOfTextAtSize(product.price, priceSize)
  page.drawText(product.price, {
    x: ox + LW / 2 - priceW / 2,
    y: oy + F.price.yBase,
    size: priceSize, font: fonts.price,
    color: rgb(0.1, 0.14, 0.19),
  })

  // Barcode
  if (barcodeImg) {
    page.drawImage(barcodeImg, {
      x: ox + F.barcode.x, y: oy + F.barcode.y,
      width: F.barcode.w,  height: F.barcode.h,
    })
  }
}

// ── Build a standalone portrait-label PDF bytes ───────────────────────────────

async function buildLabelPDF(
  product: Product,
  templateBytes: Uint8Array | null,
  barcodePNG: Buffer | null,
): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  doc.registerFontkit(fontkit)

  const fonts       = await embedFonts(doc)
  const templateImg = templateBytes ? await doc.embedPng(templateBytes) : null
  const barcodeImg  = barcodePNG
    ? await doc.embedPng(barcodePNG).catch(() => null)
    : null

  const page = doc.addPage([LW, LH])
  await drawLabel(page, product, 0, 0, templateImg, barcodeImg, fonts)
  return doc.save()
}

// ── Public exports ────────────────────────────────────────────────────────────

export async function exportSingleLabelPDF(product: Product, outputPath: string): Promise<string> {
  const templateBytes = loadTemplateBytesOnce()
  const barcodePNG    = await getBarcodePNG(product)
  const bytes         = await buildLabelPDF(product, templateBytes, barcodePNG)
  writeFileSync(outputPath, bytes)
  return outputPath
}

export async function exportSheetPDF(
  products:  Product[],
  startSlot: number,
  outputPath: string,
): Promise<string> {
  const templateBytes = loadTemplateBytesOnce()

  // Pre-render barcodes (keyed by product id)
  const barcodeCache = new Map<string, Buffer | null>()
  for (const p of products) {
    if (!barcodeCache.has(p.id)) barcodeCache.set(p.id, await getBarcodePNG(p))
  }

  // Main sheet document (US Letter portrait)
  const sheetDoc  = await PDFDocument.create()
  const sheetPage = sheetDoc.addPage([AVERY.pageW, AVERY.pageH])

  sheetPage.drawRectangle({
    x: 0, y: 0, width: AVERY.pageW, height: AVERY.pageH,
    color: rgb(0.965, 0.949, 0.875),
    borderWidth: 0,
  })

  for (let slot = 1; slot <= 8; slot++) {
    const pIdx = slot - startSlot
    if (pIdx < 0 || pIdx >= products.length) continue
    const product = products[pIdx]
    if (!product) continue

    const col   = (slot - 1) % AVERY.cols
    const row   = Math.floor((slot - 1) / AVERY.cols)
    const slotX = AVERY.marginLeft + col * AVERY.slotW
    const slotY = AVERY.pageH - AVERY.marginTop - (row + 1) * AVERY.slotH

    // Build a portrait label PDF, embed it, then draw rotated into slot
    const labelBytes = await buildLabelPDF(product, templateBytes, barcodeCache.get(product.id) ?? null)
    const [embeddedLabel] = await sheetDoc.embedPdf(labelBytes)

    /**
     * drawPage with rotate(90°) CCW:
     *   After CCW rotation a w×h rect at (x,y) occupies x:[x-h, x], y:[y, y+w].
     *   To fill slot (slotX,slotY)→(slotX+288, slotY+180):
     *     x = slotX+288, y = slotY, width = 180, height = 288
     *   This places portrait branding (visual top = high PDF y) on the LEFT
     *   and the white content area on the RIGHT — matching the reference layout.
     */
    sheetPage.drawPage(embeddedLabel, {
      x:      slotX + AVERY.slotW,
      y:      slotY,
      width:  AVERY.slotH,
      height: AVERY.slotW,
      rotate: degrees(90),
      borderWidth: 0,
    })
  }

  writeFileSync(outputPath, await sheetDoc.save())
  return outputPath
}

export async function exportSingleLabelSVG(product: Product): Promise<string> {
  const w = LW
  const h = LH
  const tPath = getTemplatePNGPath()
  const templateUri = existsSync(tPath)
    ? `data:image/png;base64,${readFileSync(tPath).toString('base64')}`
    : ''

  let barcodeUri = ''
  try {
    const png = await getBarcodePNG(product)
    if (png) barcodeUri = `data:image/png;base64,${png.toString('base64')}`
  } catch { /* leave empty */ }

  const nameSize  = product.name.length > 28 ? 15 : product.name.length > 20 ? 17 : product.name.length > 14 ? 19 : 22
  const nameMaxChars = nameSize >= 19 ? 13 : nameSize >= 17 ? 15 : 18
  const nameLines = splitLines(product.name, nameMaxChars, 2)
  const nameLineH = nameSize * 1.16
  const nameY0 = nameLines.length > 1 ? 145 : 152
  const priceSize = product.price.length > 10 ? 24 : 28

  const nameLastBaseline = nameY0 + (nameLines.length - 1) * nameLineH
  const nameBottomY = nameLastBaseline + nameSize * 0.26
  const barcodeTopY = h - F.barcode.y - F.barcode.h
  const priceCenterY = (nameBottomY + barcodeTopY) / 2
  const priceBaselineY = priceCenterY + priceSize * 0.34

  const nameEls = nameLines.map((line, i) =>
    `<text x="${w/2}" y="${nameY0 + i * nameLineH}" text-anchor="middle" font-family="Lora,Georgia,serif" font-weight="700" font-size="${nameSize}" fill="#1a2332">${xml(line)}</text>`
  ).join('\n  ')

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     viewBox="0 0 ${w} ${h}" width="${w}pt" height="${h}pt" version="1.1">
  ${templateUri ? `<image x="0" y="0" width="${w}" height="${h}" xlink:href="${templateUri}" preserveAspectRatio="none"/>` : `<rect x="0" y="0" width="${w}" height="${h}" fill="#f7f5ee"/>`}
  <rect x="${w*0.035}" y="${h*0.42}" width="${w*0.93}" height="${h*0.555}" fill="white"/>
  ${nameEls}
  <text x="${w/2}" y="${priceBaselineY}" text-anchor="middle" font-family="'Genty Demo',Georgia,serif" font-size="${priceSize}" fill="#1a2332">${xml(product.price)}</text>
  ${barcodeUri ? `<image x="${F.barcode.x}" y="${h-F.barcode.y-F.barcode.h}" width="${F.barcode.w}" height="${F.barcode.h}" xlink:href="${barcodeUri}"/>` : ''}
</svg>`
}

// ── Utilities ─────────────────────────────────────────────────────────────────

function wrapText(
  text: string,
  font: { widthOfTextAtSize(t: string, s: number): number },
  size: number,
  maxW: number,
): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let cur = ''
  for (const w of words) {
    const trial = cur ? `${cur} ${w}` : w
    if (font.widthOfTextAtSize(trial, size) <= maxW) cur = trial
    else { if (cur) lines.push(cur); cur = w }
  }
  if (cur) lines.push(cur)
  return lines.length ? lines : [text]
}

function splitLines(text: string, maxChars: number, maxLines = Number.POSITIVE_INFINITY): string[] {
  const words = text.trim().split(/\s+/)
  const lines: string[] = []
  let cur = ''
  for (const w of words) {
    const trial = (cur + ' ' + w).trim()
    if (trial.length <= maxChars) cur = trial
    else { if (cur) lines.push(cur); cur = w }
  }
  if (cur) lines.push(cur)
  if (!lines.length) return [text]
  if (lines.length <= maxLines) return lines

  const clipped = lines.slice(0, maxLines)
  const lastIdx = clipped.length - 1
  const tail = clipped[lastIdx]
  clipped[lastIdx] = `${tail.slice(0, Math.max(1, maxChars - 1)).trimEnd()}…`
  return clipped
}

function xml(s: string): string {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&apos;')
}

// Re-export for other modules
export { AVERY as AVERY_5821 }
