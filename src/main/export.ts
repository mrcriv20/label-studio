import { PDFDocument, rgb, StandardFonts, degrees, PDFPage } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs'
import { join, extname } from 'path'
import { homedir } from 'os'
import bwipjs from 'bwip-js'
import type { Product } from './types'
import { getSettings } from './database'
import {
  getAvenirNextCondensedFontPath,
  getDefaultTopLogoPath,
  getGentyRegularFontPath,
  getLoraBoldFontPath,
  readImageAsBase64,
} from './fileManager'
import {
  getLabelTemplate,
  LOGO_ONLY_LABEL_ZONES,
  INFO_LABEL_ZONES,
  LABEL_ZONES,
  VERTICAL_INFO_LABEL_ZONES,
  svgYFromBottom,
} from '../shared/labelTemplates'
import {
  getSheetLayoutPoints,
  toInches,
} from '../shared/sheetLayout'

type EmbeddedFont = Awaited<ReturnType<PDFDocument['embedFont']>>
type EmbeddedImage =
  | Awaited<ReturnType<PDFDocument['embedPng']>>
  | Awaited<ReturnType<PDFDocument['embedJpg']>>

function readFontBytes(...paths: string[]): Buffer | null {
  for (const p of paths) {
    if (existsSync(p)) {
      try { return readFileSync(p) } catch { /* next */ }
    }
  }
  return null
}

const home = homedir()
const USER_FONTS = join(home, 'Library', 'Fonts')
const SYS_FONTS = '/Library/Fonts'
const APPLE_SYS_FONTS = '/System/Library/Fonts'
const WINDOWS_USER_FONTS = process.env.LOCALAPPDATA ? join(process.env.LOCALAPPDATA, 'Microsoft', 'Windows', 'Fonts') : ''
const WINDOWS_SYS_FONTS = process.env.WINDIR ? join(process.env.WINDIR, 'Fonts') : ''
const LINUX_USER_FONTS = join(home, '.local', 'share', 'fonts')

type FontWeight = 'regular' | 'bold'

function scoreFontFile(fileName: string, weight: FontWeight): number {
  const lower = fileName.toLowerCase()
  let score = 0
  const isBold = lower.includes('bold') || lower.includes('semibold') || lower.includes('demibold')
  const isRegular = lower.includes('regular') || lower.includes('book')
  if (weight === 'bold') {
    if (lower.includes('bold') && !lower.includes('semibold')) score += 200
    else if (isBold) score += 150
    if (isRegular) score -= 100
  } else {
    if (isRegular) score += 200
    if (isBold) score -= 150
  }
  // A static face is more predictable in pdf-lib than a variable collection.
  if (lower.includes('variable')) score -= 25
  if (lower.includes('italic') || lower.includes('oblique')) score -= 200
  return score
}

function listFontFiles(dir: string, depth = 0): string[] {
  if (!dir || !existsSync(dir) || depth > 2) return []
  try {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const path = join(dir, entry.name)
      if (entry.isDirectory()) return listFontFiles(path, depth + 1)
      return /\.(ttf|otf)$/i.test(entry.name) ? [path] : []
    })
  } catch {
    return []
  }
}

function findFamilyFontBytes(family: string, exactCandidates: string[], weight: FontWeight): Buffer | null {
  const dirs = [
    USER_FONTS,
    SYS_FONTS,
    APPLE_SYS_FONTS,
    WINDOWS_USER_FONTS,
    WINDOWS_SYS_FONTS,
    LINUX_USER_FONTS,
    '/usr/local/share/fonts',
    '/usr/share/fonts',
  ]
  const exactPaths: string[] = []
  for (const dir of dirs) {
    for (const fileName of exactCandidates) exactPaths.push(join(dir, fileName))
  }
  const exact = readFontBytes(...exactPaths)
  if (exact) return exact

  const discovered: string[] = []
  const familyNeedle = family.toLowerCase().replace(/[^a-z0-9]/g, '')
  for (const dir of dirs) {
    for (const fontPath of listFontFiles(dir)) {
      const normalizedName = fontPath.split(/[\\/]/).pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') ?? ''
      if (normalizedName.includes(familyNeedle)) discovered.push(fontPath)
    }
  }

  const matchingWeight = discovered
    .filter((fontPath) => scoreFontFile(fontPath, weight) > 0)
    .sort((a, b) => scoreFontFile(b, weight) - scoreFontFile(a, weight))
  return readFontBytes(...matchingWeight)
}

const LORA_BYTES = readFontBytes(getLoraBoldFontPath()) ?? findFamilyFontBytes('lora', [
  'Lora-Bold.ttf',
  'Lora-SemiBold.ttf',
], 'bold')

const GENTY_BYTES = readFontBytes(getGentyRegularFontPath()) ?? findFamilyFontBytes('genty', [
  'GentyDemo-Regular.ttf',
  'Genty Demo Regular.ttf',
], 'regular')

const ARIAL_REGULAR_BYTES = readFontBytes(
  '/System/Library/Fonts/Supplemental/Arial.ttf',
  '/Library/Fonts/Arial.ttf',
  join(USER_FONTS, 'Arial.ttf')
)

const ARIAL_BOLD_BYTES = readFontBytes(
  '/System/Library/Fonts/Supplemental/Arial Bold.ttf',
  '/Library/Fonts/Arial Bold.ttf',
  join(USER_FONTS, 'Arial Bold.ttf')
)

const ARIAL_ITALIC_BYTES = readFontBytes(
  '/System/Library/Fonts/Supplemental/Arial Italic.ttf',
  '/Library/Fonts/Arial Italic.ttf',
  join(USER_FONTS, 'Arial Italic.ttf')
)

async function embedFonts(pdfDoc: PDFDocument): Promise<{
  name: EmbeddedFont
  price: EmbeddedFont
  body: EmbeddedFont
  bodyBold: EmbeddedFont
  bodyItalic: EmbeddedFont
  ingredients: EmbeddedFont
}> {
  const body = ARIAL_REGULAR_BYTES
    ? await pdfDoc.embedFont(ARIAL_REGULAR_BYTES)
    : await pdfDoc.embedFont(StandardFonts.Helvetica)
  const bodyBold = ARIAL_BOLD_BYTES
    ? await pdfDoc.embedFont(ARIAL_BOLD_BYTES)
    : await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const bodyItalic = ARIAL_ITALIC_BYTES
    ? await pdfDoc.embedFont(ARIAL_ITALIC_BYTES)
    : await pdfDoc.embedFont(StandardFonts.HelveticaOblique)
  const ingredientsBytes = readFontBytes(getAvenirNextCondensedFontPath())
  const ingredients = ingredientsBytes
    ? await pdfDoc.embedFont(ingredientsBytes)
    : body
  // Keep the requested weight even when the optional Lora face is unavailable.
  // Falling back to `body` here made print output regular although the preview
  // explicitly renders product names at weight 700.
  const name = LORA_BYTES ? await pdfDoc.embedFont(LORA_BYTES) : bodyBold
  const price = GENTY_BYTES ? await pdfDoc.embedFont(GENTY_BYTES) : body
  return { name, price, body, bodyBold, bodyItalic, ingredients }
}

async function renderBarcodePNG(value: string, colorHex: string): Promise<Buffer> {
  return bwipjs.toBuffer({
    bcid: 'code128',
    text: value,
    scale: 3,
    height: 10,
    includetext: true,
    textxalign: 'center',
    backgroundcolor: 'ffffff',
    barcolor: colorHex.replace('#', ''),
    textcolor: colorHex.replace('#', ''),
  })
}

async function getBarcodePNG(product: Product): Promise<Buffer | null> {
  try {
    if (product.barcodeImagePath && existsSync(product.barcodeImagePath)) {
      return readFileSync(product.barcodeImagePath)
    }
    return await renderBarcodePNG(product.barcodeValue, getLabelTemplate(product.templateId).textColor)
  } catch {
    return null
  }
}

function getTopImageBytes(product: Product): Buffer | null {
  try {
    const sourcePath = product.logoImagePath && existsSync(product.logoImagePath)
      ? product.logoImagePath
      : getDefaultTopLogoPath()
    return existsSync(sourcePath) ? readFileSync(sourcePath) : null
  } catch {
    return null
  }
}

async function embedImageAsset(
  doc: PDFDocument,
  imageBytes: Uint8Array,
  filePath?: string | null,
): Promise<EmbeddedImage | null> {
  const ext = extname(filePath ?? '').toLowerCase()
  try {
    if (ext === '.jpg' || ext === '.jpeg') return await doc.embedJpg(imageBytes)
    return await doc.embedPng(imageBytes)
  } catch {
    return null
  }
}

function drawHeightFittedImage(
  page: PDFPage,
  image: EmbeddedImage,
  x: number,
  y: number,
  width: number,
  height: number,
): void {
  const scale = height / image.height
  const drawWidth = image.width * scale
  const drawHeight = image.height * scale
  page.drawImage(image, {
    x: x + (width - drawWidth) / 2,
    y: y + (height - drawHeight) / 2,
    width: drawWidth,
    height: drawHeight,
  })
}

function drawRoundRect(page: PDFPage, x: number, y: number, w: number, h: number, color: ReturnType<typeof rgb>, radius = 10): void {
  page.drawRectangle({ x, y, width: w, height: h, color, borderWidth: 0, borderRadius: radius })
}

function drawCenteredText(
  page: PDFPage,
  text: string,
  centerX: number,
  y: number,
  size: number,
  font: EmbeddedFont,
  color: ReturnType<typeof rgb>,
): void {
  const width = font.widthOfTextAtSize(text, size)
  page.drawText(text, {
    x: centerX - width / 2,
    y,
    size,
    font,
    color,
  })
}

function wrapText(
  text: string,
  font: { widthOfTextAtSize(value: string, size: number): number },
  size: number,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const trial = current ? `${current} ${word}` : word
    if (font.widthOfTextAtSize(trial, size) <= maxWidth) current = trial
    else {
      if (current) lines.push(current)
      current = word
    }
  }
  if (current) lines.push(current)
  return lines.length ? lines : [text]
}

function splitLines(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.trim().split(/\s+/)
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const trial = `${current} ${word}`.trim()
    if (trial.length <= maxChars) current = trial
    else {
      if (current) lines.push(current)
      current = word
    }
  }
  if (current) lines.push(current)
  return lines.slice(0, maxLines)
}

async function drawLabel(
  page: PDFPage,
  product: Product,
  topImage: EmbeddedImage | null,
  barcodeImage: EmbeddedImage | null,
  fonts: { name: EmbeddedFont; price: EmbeddedFont; body: EmbeddedFont; bodyBold: EmbeddedFont; bodyItalic: EmbeddedFont; ingredients: EmbeddedFont },
): Promise<void> {
  const template = getLabelTemplate(product.templateId)
  const shell = hexToRgb(template.shellColor)
  const border = hexToRgb(template.borderColor)
  const panel = hexToRgb(template.panelColor)
  const text = hexToRgb(template.textColor)
  const borderWidth = template.layout === 'info' || template.layout === 'logo-only' ? 0 : 1

  page.drawRectangle({
    x: 0,
    y: 0,
    width: template.width,
    height: template.height,
    color: shell,
    borderColor: border,
    borderWidth,
    borderRadius: 12,
  })

  if (template.layout === 'info') {
    drawInfoLabel(page, product, topImage, barcodeImage, fonts, template.textColor)
    return
  }

  if (template.layout === 'vertical-info') {
    drawVerticalInfoLabel(page, product, topImage, fonts, panel, text)
    return
  }

  if (template.layout === 'logo-only') {
    if (topImage) {
      drawHeightFittedImage(
        page,
        topImage,
        LOGO_ONLY_LABEL_ZONES.topImage.x,
        LOGO_ONLY_LABEL_ZONES.topImage.y,
        LOGO_ONLY_LABEL_ZONES.topImage.w,
        LOGO_ONLY_LABEL_ZONES.topImage.h
      )
    }
    return
  }

  if (topImage) {
    drawHeightFittedImage(
      page,
      topImage,
      LABEL_ZONES.topImage.x,
      LABEL_ZONES.topImage.y,
      LABEL_ZONES.topImage.w,
      LABEL_ZONES.topImage.h
    )
  }

  drawRoundRect(page, LABEL_ZONES.contentPanel.x, LABEL_ZONES.contentPanel.y, LABEL_ZONES.contentPanel.w, LABEL_ZONES.contentPanel.h, panel, 10)

  const name = product.name || 'Product Name'
  const nameSize = name.length > 30 ? 15 : name.length > 18 ? 18 : 22
  const nameLines = wrapText(name, fonts.name, nameSize, LABEL_ZONES.name.w)
  const lineHeight = nameSize * 1.08
  const startY = LABEL_ZONES.name.y + LABEL_ZONES.name.h - nameSize

  nameLines.slice(0, 3).forEach((line, index) => {
    drawCenteredText(page, line, LABEL_ZONES.name.x + LABEL_ZONES.name.w / 2, startY - index * lineHeight, nameSize, fonts.name, text)
  })

  if (product.showPrice) {
    const price = product.price || '$13.99'
    const priceSize = price.length > 10 ? 22 : 28
    drawCenteredText(page, price, LABEL_ZONES.price.x + LABEL_ZONES.price.w / 2, LABEL_ZONES.price.y, priceSize, fonts.price, text)
  }

  if (product.showBarcode && barcodeImage) {
    page.drawImage(barcodeImage, {
      x: LABEL_ZONES.barcode.x,
      y: LABEL_ZONES.barcode.y,
      width: LABEL_ZONES.barcode.w,
      height: LABEL_ZONES.barcode.h,
    })
  }
}

function drawInfoLabel(
  page: PDFPage,
  product: Product,
  topImage: EmbeddedImage | null,
  barcodeImage: EmbeddedImage | null,
  fonts: { name: EmbeddedFont; price: EmbeddedFont; body: EmbeddedFont; bodyBold: EmbeddedFont; bodyItalic: EmbeddedFont; ingredients: EmbeddedFont },
  textColor: string,
): void {
  const text = hexToRgb(textColor)

  if (topImage) {
    drawHeightFittedImage(
      page,
      topImage,
      INFO_LABEL_ZONES.topImage.x,
      INFO_LABEL_ZONES.topImage.y,
      INFO_LABEL_ZONES.topImage.w,
      INFO_LABEL_ZONES.topImage.h
    )
  }

  drawRoundRect(
    page,
    INFO_LABEL_ZONES.infoPanel.x,
    INFO_LABEL_ZONES.infoPanel.y,
    INFO_LABEL_ZONES.infoPanel.w,
    INFO_LABEL_ZONES.infoPanel.h,
    hexToRgb('#ffffff'),
    10
  )

  const name = product.name || 'Product Name'
  const nameSize = 12
  const nameLines = wrapText(name, fonts.name, nameSize, INFO_LABEL_ZONES.leftName.w)
  const startY = INFO_LABEL_ZONES.leftName.y + INFO_LABEL_ZONES.leftName.h - nameSize
  const lineHeight = nameSize * 1.08
  nameLines.slice(0, 2).forEach((line, index) => {
    drawCenteredText(
      page,
      line,
      INFO_LABEL_ZONES.leftName.x + INFO_LABEL_ZONES.leftName.w / 2,
      startY - index * lineHeight,
      nameSize,
      fonts.name,
      text
    )
  })

  if (product.showPrice) {
    const price = product.price || '$8.99'
    drawCenteredText(
      page,
      price,
      INFO_LABEL_ZONES.leftPrice.x + INFO_LABEL_ZONES.leftPrice.w / 2,
      INFO_LABEL_ZONES.leftPrice.y,
      12,
      fonts.price,
      text
    )
  }

  drawInfoText(page, product, fonts, text)

  if (product.showBarcode && barcodeImage) {
    page.drawImage(barcodeImage, {
      x: INFO_LABEL_ZONES.barcode.x,
      y: INFO_LABEL_ZONES.barcode.y,
      width: INFO_LABEL_ZONES.barcode.w,
      height: INFO_LABEL_ZONES.barcode.h,
    })
  }
}

function drawVerticalInfoLabel(
  page: PDFPage,
  product: Product,
  topImage: EmbeddedImage | null,
  fonts: { name: EmbeddedFont; price: EmbeddedFont; body: EmbeddedFont; bodyBold: EmbeddedFont; bodyItalic: EmbeddedFont; ingredients: EmbeddedFont },
  panel: ReturnType<typeof rgb>,
  text: ReturnType<typeof rgb>,
): void {
  if (topImage) {
    drawHeightFittedImage(
      page,
      topImage,
      VERTICAL_INFO_LABEL_ZONES.topImage.x,
      VERTICAL_INFO_LABEL_ZONES.topImage.y,
      VERTICAL_INFO_LABEL_ZONES.topImage.w,
      VERTICAL_INFO_LABEL_ZONES.topImage.h
    )
  }

  drawRoundRect(
    page,
    VERTICAL_INFO_LABEL_ZONES.contentPanel.x,
    VERTICAL_INFO_LABEL_ZONES.contentPanel.y,
    VERTICAL_INFO_LABEL_ZONES.contentPanel.w,
    VERTICAL_INFO_LABEL_ZONES.contentPanel.h,
    panel,
    10
  )

  const name = product.name || 'Product Title'
  const nameSize = name.length > 26 ? 17 : name.length > 16 ? 20 : 24
  const nameLines = wrapText(name, fonts.name, nameSize, VERTICAL_INFO_LABEL_ZONES.title.w)
  const titleLineHeight = nameSize * 1.05
  const titleStartY = VERTICAL_INFO_LABEL_ZONES.title.y + VERTICAL_INFO_LABEL_ZONES.title.h - nameSize

  nameLines.slice(0, 3).forEach((line, index) => {
    drawCenteredText(
      page,
      line,
      VERTICAL_INFO_LABEL_ZONES.title.x + VERTICAL_INFO_LABEL_ZONES.title.w / 2,
      titleStartY - index * titleLineHeight,
      nameSize,
      fonts.name,
      text
    )
  })

  if (product.showCookingInstructions === false) return

  const headingSize = 10
  drawCenteredText(
    page,
    'Cooking Instructions',
    VERTICAL_INFO_LABEL_ZONES.cookingTitle.x + VERTICAL_INFO_LABEL_ZONES.cookingTitle.w / 2,
    VERTICAL_INFO_LABEL_ZONES.cookingTitle.y + 2,
    headingSize,
    fonts.bodyBold,
    text
  )

  const body = product.cookingInstructions || 'Add cooking instructions'
  const bodySize = 8
  const bodyLines = wrapText(body, fonts.ingredients, bodySize, VERTICAL_INFO_LABEL_ZONES.cookingBody.w)
  const bodyLineHeight = bodySize * 1.18
  let y = VERTICAL_INFO_LABEL_ZONES.cookingBody.y + VERTICAL_INFO_LABEL_ZONES.cookingBody.h - bodySize

  for (const line of bodyLines.slice(0, 4)) {
    drawCenteredText(
      page,
      line,
      VERTICAL_INFO_LABEL_ZONES.cookingBody.x + VERTICAL_INFO_LABEL_ZONES.cookingBody.w / 2,
      y,
      bodySize,
      fonts.ingredients,
      text
    )
    y -= bodyLineHeight
  }
}

function drawInfoText(
  page: PDFPage,
  product: Product,
  fonts: { body: EmbeddedFont; bodyBold: EmbeddedFont; bodyItalic: EmbeddedFont; ingredients: EmbeddedFont },
  color: ReturnType<typeof rgb>,
): void {
  const x = INFO_LABEL_ZONES.infoText.x
  const width = INFO_LABEL_ZONES.infoText.w
  const bottomY = INFO_LABEL_ZONES.infoText.y
  let y = INFO_LABEL_ZONES.infoText.y + INFO_LABEL_ZONES.infoText.h - 6
  const titleSize = 7.2

  const sections = [
    { title: 'Nutrition Facts:', body: joinInfo(product.servingInfo, product.nutritionInfo), bodySize: 8, font: fonts.ingredients },
    { title: 'Cooking Instructions', body: product.showCookingInstructions ? (product.cookingInstructions || '') : '', bodySize: 8, font: fonts.ingredients },
    { title: 'Ingredients:', body: product.ingredients || '', bodySize: 8, font: fonts.ingredients },
  ]

  for (const section of sections) {
    if (!section.body) continue
    if (y <= bottomY + titleSize) break
    page.drawText(section.title, { x, y, size: titleSize, font: fonts.bodyBold, color })
    y -= titleSize * 1.45
    const bodyFont = section.font ?? fonts.body
    const lines = wrapText(section.body, bodyFont, section.bodySize, width)
    const lineHeight = section.bodySize * 1.2
    for (const line of lines) {
      if (y <= bottomY + section.bodySize) break
      page.drawText(line, { x, y, size: section.bodySize, font: bodyFont, color })
      y -= lineHeight
    }
    y -= section.bodySize * 0.5
  }

  if (product.allergenStatement) {
    const lines = wrapText(product.allergenStatement, fonts.ingredients, 8, width)
    for (const line of lines) {
      if (y <= bottomY + 8) break
      page.drawText(line, { x, y, size: 8, font: fonts.ingredients, color: rgb(0.25, 0.25, 0.28) })
      y -= 8 * 1.2
    }
  }
}

function joinInfo(servingInfo: string, nutritionInfo: string): string {
  return [servingInfo, nutritionInfo].filter(Boolean).join(' | ')
}

async function buildLabelPDF(product: Product, topImageBytes: Buffer | null, barcodeBytes: Buffer | null): Promise<Uint8Array> {
  const template = getLabelTemplate(product.templateId)
  const doc = await PDFDocument.create()
  doc.registerFontkit(fontkit)

  const fonts = await embedFonts(doc)
  const topImage = topImageBytes
    ? await embedImageAsset(doc, topImageBytes, product.logoImagePath ?? getDefaultTopLogoPath())
    : null
  const barcodeImage = barcodeBytes ? await embedImageAsset(doc, barcodeBytes, product.barcodeImagePath) : null

  const page = doc.addPage([template.width, template.height])
  await drawLabel(page, product, topImage, barcodeImage, fonts)
  return doc.save()
}

export async function exportSingleLabelPDF(product: Product, outputPath: string): Promise<string> {
  const topImageBytes = getTopImageBytes(product)
  const barcodeBytes = await getBarcodePNG(product)
  const bytes = await buildLabelPDF(product, topImageBytes, barcodeBytes)
  writeFileSync(outputPath, bytes)
  return outputPath
}

export async function buildSheetPDF(products: Product[], startSlot: number): Promise<Uint8Array> {
  const barcodeCache = new Map<string, Buffer | null>()
  const imageCache = new Map<string, Buffer | null>()
  const settings = getSettings()
  const sheetLayout = getSheetLayoutPoints(
    toInches(settings.sheetOffsetXIn),
    toInches(settings.sheetOffsetYIn)
  )

  for (const product of products) {
    if (!barcodeCache.has(product.id)) barcodeCache.set(product.id, await getBarcodePNG(product))
    if (!imageCache.has(product.id)) imageCache.set(product.id, getTopImageBytes(product))
  }

  const sheetDoc = await PDFDocument.create()
  const sheetPage = sheetDoc.addPage([sheetLayout.pageW, sheetLayout.pageH])
  sheetPage.drawRectangle({
    x: 0,
    y: 0,
    width: sheetLayout.pageW,
    height: sheetLayout.pageH,
    color: hexToRgb('#f6f2df'),
    borderWidth: 0,
  })

  for (let slot = 1; slot <= sheetLayout.cols * sheetLayout.rows; slot++) {
    const productIndex = slot - startSlot
    if (productIndex < 0 || productIndex >= products.length) continue
    const product = products[productIndex]
    if (!product) continue

    const template = getLabelTemplate(product.templateId)
    const col = (slot - 1) % sheetLayout.cols
    const row = Math.floor((slot - 1) / sheetLayout.cols)
    const slotX = sheetLayout.marginLeft + sheetLayout.offsetX + col * (sheetLayout.slotW + sheetLayout.gapX)
    const slotY =
      sheetLayout.pageH
      - sheetLayout.marginTop
      - sheetLayout.offsetY
      - (row + 1) * sheetLayout.slotH
      - row * sheetLayout.gapY

    const labelBytes = await buildLabelPDF(
      product,
      imageCache.get(product.id) ?? null,
      barcodeCache.get(product.id) ?? null
    )
    const [embeddedLabel] = await sheetDoc.embedPdf(labelBytes)

    if (template.layout === 'info') {
      sheetPage.drawPage(embeddedLabel, {
        x: slotX,
        y: slotY,
        width: sheetLayout.slotW,
        height: sheetLayout.slotH,
        borderWidth: 0,
      })
    } else {
      sheetPage.drawPage(embeddedLabel, {
        x: slotX + sheetLayout.slotW,
        y: slotY,
        width: sheetLayout.slotH,
        height: sheetLayout.slotW,
        rotate: degrees(90),
        borderWidth: 0,
      })
    }
  }

  return sheetDoc.save()
}

export async function exportSheetPDF(products: Product[], startSlot: number, outputPath: string): Promise<string> {
  const bytes = await buildSheetPDF(products, startSlot)
  writeFileSync(outputPath, bytes)
  return outputPath
}

export async function exportSingleLabelSVG(product: Product): Promise<string> {
  const template = getLabelTemplate(product.templateId)
  const topImageUri = product.logoImagePath
    ? readImageAsBase64(product.logoImagePath)
    : readImageAsBase64(getDefaultTopLogoPath())
  const avenirFontUri = readFontDataUri(getAvenirNextCondensedFontPath())

  let barcodeUri = ''
  try {
    const barcode = await getBarcodePNG(product)
    if (barcode) barcodeUri = `data:image/png;base64,${barcode.toString('base64')}`
  } catch {
    // ignore
  }

  if (template.layout === 'info') {
    return buildInfoSvg(product, template, topImageUri, barcodeUri, avenirFontUri)
  }
  if (template.layout === 'vertical-info') {
    return buildVerticalInfoSvg(product, template, topImageUri, avenirFontUri)
  }
  if (template.layout === 'logo-only') {
    return buildLogoOnlySvg(template, topImageUri)
  }
  return buildFrontSvg(product, template, topImageUri, barcodeUri)
}

function buildFrontSvg(
  product: Product,
  template: ReturnType<typeof getLabelTemplate>,
  topImageUri: string,
  barcodeUri: string,
): string {
  const name = product.name || 'Product Name'
  const price = product.price || '$13.99'
  const nameSize = name.length > 30 ? 15 : name.length > 18 ? 18 : 22
  const nameLines = splitLines(name, nameSize >= 22 ? 14 : nameSize >= 18 ? 18 : 22, 3)
  const lineHeight = nameSize * 1.08
  const nameStartY = svgYFromBottom(LABEL_ZONES.name.y + LABEL_ZONES.name.h - nameSize, 0, template.height)
  const priceY = svgYFromBottom(LABEL_ZONES.price.y, 0, template.height)
  const contentY = svgYFromBottom(LABEL_ZONES.contentPanel.y, LABEL_ZONES.contentPanel.h, template.height)
  const imageY = svgYFromBottom(LABEL_ZONES.topImage.y, LABEL_ZONES.topImage.h, template.height)
  const barcodeY = svgYFromBottom(LABEL_ZONES.barcode.y, LABEL_ZONES.barcode.h, template.height)
  const nameEls = nameLines.map((line, index) =>
    `<text x="${LABEL_ZONES.name.x + LABEL_ZONES.name.w / 2}" y="${nameStartY + index * lineHeight}" text-anchor="middle" font-family="Lora,Georgia,serif" font-weight="700" font-size="${nameSize}" fill="${template.textColor}">${xml(line)}</text>`
  ).join('\n  ')

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     viewBox="0 0 ${template.width} ${template.height}" width="${template.width}pt" height="${template.height}pt" version="1.1">
  <rect x="0.5" y="0.5" width="${template.width - 1}" height="${template.height - 1}" rx="12" fill="${template.shellColor}" stroke="${template.borderColor}" stroke-width="1"/>
  <image x="${LABEL_ZONES.topImage.x}" y="${imageY}" width="${LABEL_ZONES.topImage.w}" height="${LABEL_ZONES.topImage.h}" xlink:href="${topImageUri}" preserveAspectRatio="xMidYMid meet"/>
  <rect x="${LABEL_ZONES.contentPanel.x}" y="${contentY}" width="${LABEL_ZONES.contentPanel.w}" height="${LABEL_ZONES.contentPanel.h}" rx="10" fill="${template.panelColor}"/>
  ${nameEls}
  ${product.showPrice ? `<text x="${LABEL_ZONES.price.x + LABEL_ZONES.price.w / 2}" y="${priceY}" text-anchor="middle" font-family="'Genty Demo',Georgia,serif" font-size="${price.length > 10 ? 22 : 28}" fill="${template.textColor}">${xml(price)}</text>` : ''}
  ${product.showBarcode && barcodeUri ? `<image x="${LABEL_ZONES.barcode.x}" y="${barcodeY}" width="${LABEL_ZONES.barcode.w}" height="${LABEL_ZONES.barcode.h}" xlink:href="${barcodeUri}"/>` : ''}
</svg>`
}

function buildInfoSvg(
  product: Product,
  template: ReturnType<typeof getLabelTemplate>,
  topImageUri: string,
  barcodeUri: string,
  avenirFontUri: string,
): string {
  const name = product.name || 'Product Name'
  const price = product.price || '$8.99'
  const nameSize = 12
  const nameLines = splitLines(name, 18, 2)
  const lineHeight = nameSize * 1.08
  const nameStartY = svgYFromBottom(INFO_LABEL_ZONES.leftName.y + INFO_LABEL_ZONES.leftName.h - nameSize, 0, template.height)
  const priceY = svgYFromBottom(INFO_LABEL_ZONES.leftPrice.y, 0, template.height)
  const panelY = svgYFromBottom(INFO_LABEL_ZONES.infoPanel.y, INFO_LABEL_ZONES.infoPanel.h, template.height)
  const imageY = svgYFromBottom(INFO_LABEL_ZONES.topImage.y, INFO_LABEL_ZONES.topImage.h, template.height)
  const barcodeY = svgYFromBottom(INFO_LABEL_ZONES.barcode.y, INFO_LABEL_ZONES.barcode.h, template.height)
  const infoBlock = buildInfoHtml(product)
  const nameEls = nameLines.map((line, index) =>
    `<text x="${INFO_LABEL_ZONES.leftName.x + INFO_LABEL_ZONES.leftName.w / 2}" y="${nameStartY + index * lineHeight}" text-anchor="middle" font-family="Lora,Georgia,serif" font-weight="700" font-size="${nameSize}" fill="${template.textColor}">${xml(line)}</text>`
  ).join('\n  ')

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     viewBox="0 0 ${template.width} ${template.height}" width="${template.width}pt" height="${template.height}pt" version="1.1">
  ${avenirFontUri ? `<style>
    @font-face {
      font-family: 'Avenir Next Condensed Asset';
      src: url('${avenirFontUri}') format('opentype');
      font-weight: 400;
      font-style: normal;
    }
  </style>` : ''}
  <rect x="0" y="0" width="${template.width}" height="${template.height}" rx="12" fill="${template.shellColor}" stroke="none"/>
  <image x="${INFO_LABEL_ZONES.topImage.x}" y="${imageY}" width="${INFO_LABEL_ZONES.topImage.w}" height="${INFO_LABEL_ZONES.topImage.h}" xlink:href="${topImageUri}" preserveAspectRatio="xMidYMid meet"/>
  <rect x="${INFO_LABEL_ZONES.infoPanel.x}" y="${panelY}" width="${INFO_LABEL_ZONES.infoPanel.w}" height="${INFO_LABEL_ZONES.infoPanel.h}" rx="10" fill="${template.infoPanelColor ?? '#ffffff'}"/>
  ${nameEls}
  ${product.showPrice ? `<text x="${INFO_LABEL_ZONES.leftPrice.x + INFO_LABEL_ZONES.leftPrice.w / 2}" y="${priceY}" text-anchor="middle" font-family="'Genty Demo',Georgia,serif" font-size="12" fill="${template.textColor}">${xml(price)}</text>` : ''}
  ${infoBlock}
  ${product.showBarcode && barcodeUri ? `<image x="${INFO_LABEL_ZONES.barcode.x}" y="${barcodeY}" width="${INFO_LABEL_ZONES.barcode.w}" height="${INFO_LABEL_ZONES.barcode.h}" xlink:href="${barcodeUri}"/>` : ''}
</svg>`
}

function buildVerticalInfoSvg(
  product: Product,
  template: ReturnType<typeof getLabelTemplate>,
  topImageUri: string,
  avenirFontUri: string,
): string {
  const name = product.name || 'Product Title'
  const nameSize = name.length > 26 ? 17 : name.length > 16 ? 20 : 24
  const nameLines = splitLines(name, nameSize >= 24 ? 13 : nameSize >= 20 ? 16 : 19, 3)
  const titleLineHeight = nameSize * 1.05
  const titleStartY = svgYFromBottom(VERTICAL_INFO_LABEL_ZONES.title.y + VERTICAL_INFO_LABEL_ZONES.title.h - nameSize, 0, template.height)
  const panelY = svgYFromBottom(VERTICAL_INFO_LABEL_ZONES.contentPanel.y, VERTICAL_INFO_LABEL_ZONES.contentPanel.h, template.height)
  const imageY = svgYFromBottom(VERTICAL_INFO_LABEL_ZONES.topImage.y, VERTICAL_INFO_LABEL_ZONES.topImage.h, template.height)
  const headingY = svgYFromBottom(VERTICAL_INFO_LABEL_ZONES.cookingTitle.y + 2, 0, template.height)
  const bodyStartY = svgYFromBottom(VERTICAL_INFO_LABEL_ZONES.cookingBody.y + VERTICAL_INFO_LABEL_ZONES.cookingBody.h - 8, 0, template.height)
  const bodyLineHeight = 8 * 1.18
  const nameEls = nameLines.map((line, index) =>
    `<text x="${VERTICAL_INFO_LABEL_ZONES.title.x + VERTICAL_INFO_LABEL_ZONES.title.w / 2}" y="${titleStartY + index * titleLineHeight}" text-anchor="middle" font-family="Lora,Georgia,serif" font-weight="700" font-size="${nameSize}" fill="${template.textColor}">${xml(line)}</text>`
  ).join('\n  ')
  const cookingLines = product.showCookingInstructions === false
    ? []
    : splitLines(product.cookingInstructions || 'Add cooking instructions', 28, 4)
  const cookingEls = cookingLines.map((line, index) =>
    `<text x="${VERTICAL_INFO_LABEL_ZONES.cookingBody.x + VERTICAL_INFO_LABEL_ZONES.cookingBody.w / 2}" y="${bodyStartY + index * bodyLineHeight}" text-anchor="middle" font-family="&quot;Avenir Next Condensed Asset&quot;,&quot;Avenir Next Condensed&quot;,&quot;Avenir Next&quot;,&quot;Arial Narrow&quot;,Arial,sans-serif" font-size="8" font-weight="400" fill="${template.textColor}">${xml(line)}</text>`
  ).join('\n  ')

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     viewBox="0 0 ${template.width} ${template.height}" width="${template.width}pt" height="${template.height}pt" version="1.1">
  ${avenirFontUri ? `<style>
    @font-face {
      font-family: 'Avenir Next Condensed Asset';
      src: url('${avenirFontUri}') format('opentype');
      font-weight: 400;
      font-style: normal;
    }
  </style>` : ''}
  <rect x="0.5" y="0.5" width="${template.width - 1}" height="${template.height - 1}" rx="12" fill="${template.shellColor}" stroke="${template.borderColor}" stroke-width="1"/>
  <image x="${VERTICAL_INFO_LABEL_ZONES.topImage.x}" y="${imageY}" width="${VERTICAL_INFO_LABEL_ZONES.topImage.w}" height="${VERTICAL_INFO_LABEL_ZONES.topImage.h}" xlink:href="${topImageUri}" preserveAspectRatio="xMidYMid meet"/>
  <rect x="${VERTICAL_INFO_LABEL_ZONES.contentPanel.x}" y="${panelY}" width="${VERTICAL_INFO_LABEL_ZONES.contentPanel.w}" height="${VERTICAL_INFO_LABEL_ZONES.contentPanel.h}" rx="10" fill="${template.panelColor}"/>
  ${nameEls}
  ${product.showCookingInstructions === false ? '' : `<text x="${VERTICAL_INFO_LABEL_ZONES.cookingTitle.x + VERTICAL_INFO_LABEL_ZONES.cookingTitle.w / 2}" y="${headingY}" text-anchor="middle" font-family="'Helvetica Neue',Arial,sans-serif" font-weight="700" font-size="10" fill="${template.textColor}">Cooking Instructions</text>`}
  ${cookingEls}
</svg>`
}

function buildLogoOnlySvg(
  template: ReturnType<typeof getLabelTemplate>,
  topImageUri: string,
): string {
  const imageY = svgYFromBottom(LOGO_ONLY_LABEL_ZONES.topImage.y, LOGO_ONLY_LABEL_ZONES.topImage.h, template.height)

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     viewBox="0 0 ${template.width} ${template.height}" width="${template.width}pt" height="${template.height}pt" version="1.1">
  <rect x="0" y="0" width="${template.width}" height="${template.height}" fill="${template.shellColor}"/>
  <image x="${LOGO_ONLY_LABEL_ZONES.topImage.x}" y="${imageY}" width="${LOGO_ONLY_LABEL_ZONES.topImage.w}" height="${LOGO_ONLY_LABEL_ZONES.topImage.h}" xlink:href="${topImageUri}" preserveAspectRatio="xMidYMid meet"/>
</svg>`
}

function buildInfoHtml(product: Product): string {
  const x = INFO_LABEL_ZONES.infoText.x
  const maxY = svgYFromBottom(INFO_LABEL_ZONES.infoText.y, 0, 181)
  let y = svgYFromBottom(INFO_LABEL_ZONES.infoText.y + INFO_LABEL_ZONES.infoText.h - 6, 0, 181)
  const out: string[] = []
  const titleSize = 7.2
  const sections = [
    { title: 'Nutrition Facts:', body: joinInfo(product.servingInfo, product.nutritionInfo), bodySize: 8, maxChars: 34 },
    { title: 'Cooking Instructions', body: product.showCookingInstructions ? (product.cookingInstructions || '') : '', bodySize: 8, maxChars: 34 },
    { title: 'Ingredients:', body: product.ingredients || '', bodySize: 8, maxChars: 34 },
  ]

  for (const section of sections) {
    if (!section.body) continue
    if (y >= maxY - titleSize) break
    out.push(`<text x="${x}" y="${y}" font-family="'Helvetica Neue',Arial,sans-serif" font-weight="700" font-size="${titleSize}" fill="#1b2733">${xml(section.title)}</text>`)
    y += titleSize * 1.45
    const lines = splitLines(section.body, section.maxChars, 12)
    const lineHeight = section.bodySize * 1.2
    for (const line of lines) {
      if (y >= maxY - section.bodySize) break
      out.push(`<text x="${x}" y="${y}" font-family="&quot;Avenir Next Condensed Asset&quot;,&quot;Avenir Next Condensed&quot;,&quot;Avenir Next&quot;,&quot;Arial Narrow&quot;,Arial,sans-serif" font-size="${section.bodySize}" font-weight="400" fill="#1b2733">${xml(line)}</text>`)
      y += lineHeight
    }
    y += section.bodySize * 0.5
  }

  if (product.allergenStatement) {
    const lines = splitLines(product.allergenStatement, 34, 12)
    for (const line of lines) {
      if (y >= maxY - 8) break
      out.push(`<text x="${x}" y="${y}" font-family="&quot;Avenir Next Condensed Asset&quot;,&quot;Avenir Next Condensed&quot;,&quot;Avenir Next&quot;,&quot;Arial Narrow&quot;,Arial,sans-serif" font-size="8" font-weight="400" fill="#3f3f46">${xml(line)}</text>`)
      y += 8 * 1.2
    }
  }

  return out.join('\n  ')
}

function readFontDataUri(filePath: string): string {
  if (!existsSync(filePath)) return ''
  const bytes = readFileSync(filePath)
  return `data:font/otf;base64,${bytes.toString('base64')}`
}

function xml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function hexToRgb(hex: string): ReturnType<typeof rgb> {
  const normalized = hex.replace('#', '')
  const value = normalized.length === 3
    ? normalized.split('').map((char) => char + char).join('')
    : normalized
  const intValue = Number.parseInt(value, 16)
  return rgb(
    ((intValue >> 16) & 255) / 255,
    ((intValue >> 8) & 255) / 255,
    (intValue & 255) / 255
  )
}

export { getSheetLayoutPoints as getPLS780LayoutPoints }
