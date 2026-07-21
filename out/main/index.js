"use strict";
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const fs = require("fs");
const url = require("url");
const nanoid = require("nanoid");
const XLSX = require("xlsx");
const pdfLib = require("pdf-lib");
const fontkit = require("@pdf-lib/fontkit");
const os = require("os");
const bwipjs = require("bwip-js");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const XLSX__namespace = /* @__PURE__ */ _interopNamespaceDefault(XLSX);
const DATA_DIR = () => electron.app.getPath("userData");
function dbPath() {
  return path.join(DATA_DIR(), "products.json");
}
function settingsPath() {
  return path.join(DATA_DIR(), "settings.json");
}
let _db = { products: [] };
let _settings = null;
function initDatabase() {
  const p = dbPath();
  if (fs.existsSync(p)) {
    try {
      _db = JSON.parse(fs.readFileSync(p, "utf8"));
    } catch {
      _db = { products: [] };
    }
  }
  loadSettings();
  const normalised = _db.products.map((product) => normalizeProduct(product));
  const changed = JSON.stringify(normalised) !== JSON.stringify(_db.products);
  _db = { products: normalised };
  if (changed) saveDB();
}
function saveDB() {
  fs.writeFileSync(dbPath(), JSON.stringify(_db, null, 2), "utf8");
}
function loadSettings() {
  const p = settingsPath();
  const defaults = {
    currency: "USD",
    barcodeType: "CODE128",
    exportFolder: electron.app.getPath("desktop"),
    templateId: "avery5821",
    pricePrefix: "$",
    sheetOffsetXIn: "0",
    sheetOffsetYIn: "0"
  };
  if (fs.existsSync(p)) {
    try {
      _settings = { ...defaults, ...JSON.parse(fs.readFileSync(p, "utf8")) };
    } catch {
      _settings = defaults;
    }
  } else {
    _settings = defaults;
    fs.writeFileSync(p, JSON.stringify(defaults, null, 2), "utf8");
  }
}
function saveSettings() {
  fs.writeFileSync(settingsPath(), JSON.stringify(_settings, null, 2), "utf8");
}
function listProducts() {
  return [..._db.products].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}
function getProduct(id) {
  return _db.products.find((p) => p.id === id) ?? null;
}
function createProduct(p) {
  _db.products.push(normalizeProduct(p));
  saveDB();
}
function updateProduct(updated) {
  const idx = _db.products.findIndex((p) => p.id === updated.id);
  if (idx !== -1) {
    _db.products[idx] = normalizeProduct(updated);
  } else {
    _db.products.push(normalizeProduct(updated));
  }
  saveDB();
}
function deleteProduct(id) {
  _db.products = _db.products.filter((p) => p.id !== id);
  saveDB();
}
function getSettings() {
  return _settings;
}
function setSetting(key, value) {
  _settings = { ..._settings, [key]: value };
  saveSettings();
}
function normalizeProduct(product) {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  return {
    id: product.id,
    name: product.name ?? "",
    price: product.price ?? "",
    category: product.category ?? "",
    servingInfo: product.servingInfo ?? "",
    nutritionInfo: product.nutritionInfo ?? "",
    cookingInstructions: product.cookingInstructions ?? "",
    ingredients: product.ingredients ?? "",
    allergenStatement: product.allergenStatement ?? "",
    barcodeValue: product.barcodeValue ?? "",
    barcodeType: "CODE128",
    barcodeImagePath: product.barcodeImagePath ?? null,
    logoImagePath: product.logoImagePath ?? null,
    templateId: product.templateId || _settings?.templateId || "avery5821",
    showPrice: product.showPrice ?? true,
    showBarcode: product.showBarcode ?? true,
    showCookingInstructions: product.showCookingInstructions ?? true,
    createdAt: product.createdAt ?? now,
    updatedAt: product.updatedAt ?? now
  };
}
const LABEL_WIDTH = 181;
const LABEL_HEIGHT = 289;
const INFO_LABEL_WIDTH = 289;
const INFO_LABEL_HEIGHT = 181;
const LABEL_ZONES = {
  topImage: { x: 10, y: 169, w: 161, h: 104 },
  contentPanel: { x: 10, y: 10, w: 161, h: 145 },
  name: { x: 20, y: 92, w: 141, h: 42 },
  price: { x: 26, y: 54, w: 129 },
  barcode: { x: 30, y: 14, w: 121, h: 30 }
};
const INFO_LABEL_ZONES = {
  topImage: { x: 12, y: 84, w: 132, h: 85 },
  leftName: { x: 16, y: 48, w: 124, h: 26 },
  leftPrice: { x: 26, y: 18, w: 104 },
  infoPanel: { x: 150, y: 10, w: 126, h: 161 },
  infoText: { x: 156, y: 36, w: 114, h: 126 },
  barcode: { x: 184, y: 12, w: 58, h: 28 }
};
const VERTICAL_INFO_LABEL_ZONES = {
  topImage: { x: 10, y: 166, w: 161, h: 108 },
  contentPanel: { x: 10, y: 10, w: 161, h: 150 },
  title: { x: 20, y: 95, w: 141, h: 44 },
  cookingTitle: { x: 20, y: 66, w: 141 },
  cookingBody: { x: 18, y: 28, w: 145, h: 34 }
};
const LOGO_ONLY_LABEL_ZONES = {
  topImage: { x: 18, y: 86, w: 145, h: 120 }
};
const BUILT_IN_TEMPLATES = [
  {
    id: "avery5821",
    name: "Base Label",
    layout: "front",
    width: LABEL_WIDTH,
    height: LABEL_HEIGHT,
    shellColor: "#f5efdc",
    borderColor: "#efe6c8",
    panelColor: "#ffffff",
    topImageColor: "#ffffff",
    textColor: "#1b2733"
  },
  {
    id: "soft-sage",
    name: "Soft Sage",
    layout: "front",
    width: LABEL_WIDTH,
    height: LABEL_HEIGHT,
    shellColor: "#edf1e7",
    borderColor: "#d9e2d0",
    panelColor: "#ffffff",
    topImageColor: "#ffffff",
    textColor: "#223127"
  },
  {
    id: "info-card",
    name: "Info Label",
    layout: "info",
    width: INFO_LABEL_WIDTH,
    height: INFO_LABEL_HEIGHT,
    shellColor: "#f6f2df",
    borderColor: "#1b2733",
    panelColor: "#f6f2df",
    topImageColor: "#ffffff",
    textColor: "#1b2733",
    infoPanelColor: "#ffffff"
  },
  {
    id: "vertical-instructions",
    name: "Vertical Instructions",
    layout: "vertical-info",
    width: LABEL_WIDTH,
    height: LABEL_HEIGHT,
    shellColor: "#f6f2df",
    borderColor: "#efe6c8",
    panelColor: "#ffffff",
    topImageColor: "#ffffff",
    textColor: "#1b2733"
  },
  {
    id: "logo-only",
    name: "Logo Only",
    layout: "logo-only",
    width: LABEL_WIDTH,
    height: LABEL_HEIGHT,
    shellColor: "#ffffff",
    borderColor: "#ffffff",
    panelColor: "#ffffff",
    topImageColor: "#ffffff",
    textColor: "#1b2733"
  }
];
function getLabelTemplates() {
  return BUILT_IN_TEMPLATES.map(({ id, name }) => ({ id, name }));
}
function getLabelTemplate(templateId) {
  return BUILT_IN_TEMPLATES.find((template) => template.id === templateId) ?? BUILT_IN_TEMPLATES[0];
}
function svgYFromBottom(y, height = 0, canvasHeight = LABEL_HEIGHT) {
  return canvasHeight - y - height;
}
const ASSETS_DIR = path.join(electron.app.getPath("userData"), "assets");
const BARCODE_DIR = path.join(electron.app.getPath("userData"), "barcodes");
const LOGO_DIR = path.join(electron.app.getPath("userData"), "logos");
const TEMPLATE_DIR = path.join(ASSETS_DIR, "templates");
const TEMPLATE_PNG = path.join(ASSETS_DIR, "label-template-300dpi.png");
const TEMPLATE_EPS = path.join(ASSETS_DIR, "label-template.eps");
const DEFAULT_TEMPLATE_ID = "avery5821";
function initFileManager() {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
  fs.mkdirSync(BARCODE_DIR, { recursive: true });
  fs.mkdirSync(LOGO_DIR, { recursive: true });
  fs.mkdirSync(TEMPLATE_DIR, { recursive: true });
  copyBundledAssets();
}
function copyBundledAssets() {
  const sourceDir = getBundledAssetsDir();
  const sourceEps = path.join(sourceDir, "label-template.eps");
  const sourcePng = path.join(sourceDir, "label-template-300dpi.png");
  const sourceTemplateDir = path.join(sourceDir, "templates");
  if (!fs.existsSync(TEMPLATE_EPS) && fs.existsSync(sourceEps)) {
    fs.copyFileSync(sourceEps, TEMPLATE_EPS);
  }
  if (!fs.existsSync(TEMPLATE_PNG) && fs.existsSync(sourcePng)) {
    fs.copyFileSync(sourcePng, TEMPLATE_PNG);
  }
  if (fs.existsSync(sourceTemplateDir)) {
    for (const fileName of fs.readdirSync(sourceTemplateDir)) {
      if (!fileName.toLowerCase().endsWith(".png")) continue;
      const sourcePath = path.join(sourceTemplateDir, fileName);
      const destPath = path.join(TEMPLATE_DIR, fileName);
      if (!fs.existsSync(destPath)) fs.copyFileSync(sourcePath, destPath);
    }
  }
}
function listTemplates() {
  return getLabelTemplates();
}
function getTemplatePNGPath(templateId = DEFAULT_TEMPLATE_ID) {
  if (templateId === DEFAULT_TEMPLATE_ID) return TEMPLATE_PNG;
  return path.join(TEMPLATE_DIR, `${templateId}.png`);
}
function getDefaultTopLogoPath() {
  return path.join(getBundledAssetsDir(), "default-label-logo.png");
}
function getAvenirNextCondensedFontPath() {
  return path.join(getBundledAssetsDir(), "AvenirNextCondensed-Regular.otf");
}
function readTemplatePNGBase64(templateId = DEFAULT_TEMPLATE_ID) {
  const templatePath = getTemplatePNGPath(templateId);
  if (!fs.existsSync(templatePath)) return "";
  const buf = fs.readFileSync(templatePath);
  return `data:image/png;base64,${buf.toString("base64")}`;
}
function saveTemplateImage(sourcePath) {
  const id = slugify(path.basename(sourcePath, path.extname(sourcePath))) || `template-${Date.now()}`;
  const destPath = path.join(TEMPLATE_DIR, `${id}.png`);
  fs.copyFileSync(sourcePath, destPath);
  return { id, name: prettifyTemplateName(id) };
}
function saveBarcodeImage(sourcePath, productId) {
  const ext = path.extname(sourcePath) || ".png";
  const destName = `barcode-${productId}${ext}`;
  const destPath = path.join(BARCODE_DIR, destName);
  fs.copyFileSync(sourcePath, destPath);
  return destPath;
}
function saveLogoImage(sourcePath, productId) {
  const ext = path.extname(sourcePath) || ".png";
  const destName = `logo-${productId}${ext}`;
  const destPath = path.join(LOGO_DIR, destName);
  fs.copyFileSync(sourcePath, destPath);
  return destPath;
}
function readImageAsBase64(filePath) {
  if (!fs.existsSync(filePath)) return "";
  const buf = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase().slice(1);
  const mime = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : ext === "svg" ? "image/svg+xml" : "image/png";
  return `data:${mime};base64,${buf.toString("base64")}`;
}
function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
}
function prettifyTemplateName(id) {
  return id.split(/[-_]+/).filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}
function getBundledAssetsDir() {
  return !electron.app.isPackaged ? path.join(__dirname, "../../assets") : path.join(process.resourcesPath, "assets");
}
const PLS_780 = {
  pageWidthIn: 8.5,
  pageHeightIn: 11,
  labelWidthIn: 2.5,
  // portrait label width / landscape slot height
  labelHeightIn: 4,
  columns: 2,
  rows: 4,
  marginTopIn: 0.5,
  marginLeftIn: 0.15625,
  horizontalGapIn: 0.1875,
  verticalGapIn: 0
};
const POINTS_PER_INCH = 72;
const PLS_780_SLOT_WIDTH_IN = PLS_780.labelHeightIn;
const PLS_780_SLOT_HEIGHT_IN = PLS_780.labelWidthIn;
function toInches(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const parsed = Number.parseFloat(String(value ?? "").trim());
  return Number.isFinite(parsed) ? parsed : 0;
}
function getSheetLayoutPoints(offsetXIn = 0, offsetYIn = 0) {
  return {
    pageW: PLS_780.pageWidthIn * POINTS_PER_INCH,
    pageH: PLS_780.pageHeightIn * POINTS_PER_INCH,
    slotW: PLS_780_SLOT_WIDTH_IN * POINTS_PER_INCH,
    slotH: PLS_780_SLOT_HEIGHT_IN * POINTS_PER_INCH,
    marginLeft: PLS_780.marginLeftIn * POINTS_PER_INCH,
    marginTop: PLS_780.marginTopIn * POINTS_PER_INCH,
    gapX: PLS_780.horizontalGapIn * POINTS_PER_INCH,
    gapY: PLS_780.verticalGapIn * POINTS_PER_INCH,
    offsetX: offsetXIn * POINTS_PER_INCH,
    offsetY: offsetYIn * POINTS_PER_INCH,
    cols: PLS_780.columns,
    rows: PLS_780.rows
  };
}
function readFontBytes(...paths) {
  for (const p of paths) {
    if (fs.existsSync(p)) {
      try {
        return fs.readFileSync(p);
      } catch {
      }
    }
  }
  return null;
}
const home = os.homedir();
const USER_FONTS = path.join(home, "Library", "Fonts");
const SYS_FONTS = "/Library/Fonts";
const APPLE_SYS_FONTS = "/System/Library/Fonts";
const WINDOWS_USER_FONTS = process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, "Microsoft", "Windows", "Fonts") : "";
const WINDOWS_SYS_FONTS = process.env.WINDIR ? path.join(process.env.WINDIR, "Fonts") : "";
const LINUX_USER_FONTS = path.join(home, ".local", "share", "fonts");
function scoreFontFile(fileName, weight) {
  const lower = fileName.toLowerCase();
  let score = 0;
  const isBold = lower.includes("bold") || lower.includes("semibold") || lower.includes("demibold");
  const isRegular = lower.includes("regular") || lower.includes("book");
  if (weight === "bold") {
    if (lower.includes("bold") && !lower.includes("semibold")) score += 200;
    else if (isBold) score += 150;
    if (isRegular) score -= 100;
  } else {
    if (isRegular) score += 200;
    if (isBold) score -= 150;
  }
  if (lower.includes("variable")) score -= 25;
  if (lower.includes("italic") || lower.includes("oblique")) score -= 200;
  return score;
}
function listFontFiles(dir, depth = 0) {
  if (!dir || !fs.existsSync(dir) || depth > 2) return [];
  try {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const path$1 = path.join(dir, entry.name);
      if (entry.isDirectory()) return listFontFiles(path$1, depth + 1);
      return /\.(ttf|otf)$/i.test(entry.name) ? [path$1] : [];
    });
  } catch {
    return [];
  }
}
function findFamilyFontBytes(family, exactCandidates, weight) {
  const dirs = [
    USER_FONTS,
    SYS_FONTS,
    APPLE_SYS_FONTS,
    WINDOWS_USER_FONTS,
    WINDOWS_SYS_FONTS,
    LINUX_USER_FONTS,
    "/usr/local/share/fonts",
    "/usr/share/fonts"
  ];
  const exactPaths = [];
  for (const dir of dirs) {
    for (const fileName of exactCandidates) exactPaths.push(path.join(dir, fileName));
  }
  const exact = readFontBytes(...exactPaths);
  if (exact) return exact;
  const discovered = [];
  const familyNeedle = family.toLowerCase().replace(/[^a-z0-9]/g, "");
  for (const dir of dirs) {
    for (const fontPath of listFontFiles(dir)) {
      const normalizedName = fontPath.split(/[\\/]/).pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ?? "";
      if (normalizedName.includes(familyNeedle)) discovered.push(fontPath);
    }
  }
  const matchingWeight = discovered.filter((fontPath) => scoreFontFile(fontPath, weight) > 0).sort((a, b) => scoreFontFile(b, weight) - scoreFontFile(a, weight));
  return readFontBytes(...matchingWeight);
}
const LORA_BYTES = findFamilyFontBytes("lora", [
  "Lora-Bold.ttf",
  "Lora-SemiBold.ttf"
], "bold");
const GENTY_BYTES = findFamilyFontBytes("genty", [
  "GentyDemo-Regular.ttf",
  "Genty Demo Regular.ttf"
], "regular");
const ARIAL_REGULAR_BYTES = readFontBytes(
  "/System/Library/Fonts/Supplemental/Arial.ttf",
  "/Library/Fonts/Arial.ttf",
  path.join(USER_FONTS, "Arial.ttf")
);
const ARIAL_BOLD_BYTES = readFontBytes(
  "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
  "/Library/Fonts/Arial Bold.ttf",
  path.join(USER_FONTS, "Arial Bold.ttf")
);
const ARIAL_ITALIC_BYTES = readFontBytes(
  "/System/Library/Fonts/Supplemental/Arial Italic.ttf",
  "/Library/Fonts/Arial Italic.ttf",
  path.join(USER_FONTS, "Arial Italic.ttf")
);
async function embedFonts(pdfDoc) {
  const body = ARIAL_REGULAR_BYTES ? await pdfDoc.embedFont(ARIAL_REGULAR_BYTES) : await pdfDoc.embedFont(pdfLib.StandardFonts.Helvetica);
  const bodyBold = ARIAL_BOLD_BYTES ? await pdfDoc.embedFont(ARIAL_BOLD_BYTES) : await pdfDoc.embedFont(pdfLib.StandardFonts.HelveticaBold);
  const bodyItalic = ARIAL_ITALIC_BYTES ? await pdfDoc.embedFont(ARIAL_ITALIC_BYTES) : await pdfDoc.embedFont(pdfLib.StandardFonts.HelveticaOblique);
  const ingredientsBytes = readFontBytes(getAvenirNextCondensedFontPath());
  const ingredients = ingredientsBytes ? await pdfDoc.embedFont(ingredientsBytes) : body;
  const name = LORA_BYTES ? await pdfDoc.embedFont(LORA_BYTES) : bodyBold;
  const price = GENTY_BYTES ? await pdfDoc.embedFont(GENTY_BYTES) : body;
  return { name, price, body, bodyBold, bodyItalic, ingredients };
}
async function renderBarcodePNG(value, colorHex) {
  return bwipjs.toBuffer({
    bcid: "code128",
    text: value,
    scale: 3,
    height: 10,
    includetext: true,
    textxalign: "center",
    backgroundcolor: "ffffff",
    barcolor: colorHex.replace("#", ""),
    textcolor: colorHex.replace("#", "")
  });
}
async function getBarcodePNG(product) {
  try {
    if (product.barcodeImagePath && fs.existsSync(product.barcodeImagePath)) {
      return fs.readFileSync(product.barcodeImagePath);
    }
    return await renderBarcodePNG(product.barcodeValue, getLabelTemplate(product.templateId).textColor);
  } catch {
    return null;
  }
}
function getTopImageBytes(product) {
  try {
    const sourcePath = product.logoImagePath && fs.existsSync(product.logoImagePath) ? product.logoImagePath : getDefaultTopLogoPath();
    return fs.existsSync(sourcePath) ? fs.readFileSync(sourcePath) : null;
  } catch {
    return null;
  }
}
async function embedImageAsset(doc, imageBytes, filePath) {
  const ext = path.extname(filePath ?? "").toLowerCase();
  try {
    if (ext === ".jpg" || ext === ".jpeg") return await doc.embedJpg(imageBytes);
    return await doc.embedPng(imageBytes);
  } catch {
    return null;
  }
}
function drawHeightFittedImage(page, image, x, y, width, height) {
  const scale = height / image.height;
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  page.drawImage(image, {
    x: x + (width - drawWidth) / 2,
    y: y + (height - drawHeight) / 2,
    width: drawWidth,
    height: drawHeight
  });
}
function drawRoundRect(page, x, y, w, h, color, radius = 10) {
  page.drawRectangle({ x, y, width: w, height: h, color, borderWidth: 0, borderRadius: radius });
}
function drawCenteredText(page, text, centerX, y, size, font, color) {
  const width = font.widthOfTextAtSize(text, size);
  page.drawText(text, {
    x: centerX - width / 2,
    y,
    size,
    font,
    color
  });
}
function wrapText(text, font, size, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let current = "";
  for (const word of words) {
    const trial = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(trial, size) <= maxWidth) current = trial;
    else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [text];
}
function splitLines(text, maxChars, maxLines) {
  const words = text.trim().split(/\s+/);
  const lines = [];
  let current = "";
  for (const word of words) {
    const trial = `${current} ${word}`.trim();
    if (trial.length <= maxChars) current = trial;
    else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, maxLines);
}
async function drawLabel(page, product, topImage, barcodeImage, fonts) {
  const template = getLabelTemplate(product.templateId);
  const shell = hexToRgb(template.shellColor);
  const border = hexToRgb(template.borderColor);
  const panel = hexToRgb(template.panelColor);
  const text = hexToRgb(template.textColor);
  const borderWidth = template.layout === "info" || template.layout === "logo-only" ? 0 : 1;
  page.drawRectangle({
    x: 0,
    y: 0,
    width: template.width,
    height: template.height,
    color: shell,
    borderColor: border,
    borderWidth,
    borderRadius: 12
  });
  if (template.layout === "info") {
    drawInfoLabel(page, product, topImage, barcodeImage, fonts, template.textColor);
    return;
  }
  if (template.layout === "vertical-info") {
    drawVerticalInfoLabel(page, product, topImage, fonts, panel, text);
    return;
  }
  if (template.layout === "logo-only") {
    if (topImage) {
      drawHeightFittedImage(
        page,
        topImage,
        LOGO_ONLY_LABEL_ZONES.topImage.x,
        LOGO_ONLY_LABEL_ZONES.topImage.y,
        LOGO_ONLY_LABEL_ZONES.topImage.w,
        LOGO_ONLY_LABEL_ZONES.topImage.h
      );
    }
    return;
  }
  if (topImage) {
    drawHeightFittedImage(
      page,
      topImage,
      LABEL_ZONES.topImage.x,
      LABEL_ZONES.topImage.y,
      LABEL_ZONES.topImage.w,
      LABEL_ZONES.topImage.h
    );
  }
  drawRoundRect(page, LABEL_ZONES.contentPanel.x, LABEL_ZONES.contentPanel.y, LABEL_ZONES.contentPanel.w, LABEL_ZONES.contentPanel.h, panel, 10);
  const name = product.name || "Product Name";
  const nameSize = name.length > 30 ? 15 : name.length > 18 ? 18 : 22;
  const nameLines = wrapText(name, fonts.name, nameSize, LABEL_ZONES.name.w);
  const lineHeight = nameSize * 1.08;
  const startY = LABEL_ZONES.name.y + LABEL_ZONES.name.h - nameSize;
  nameLines.slice(0, 3).forEach((line, index) => {
    drawCenteredText(page, line, LABEL_ZONES.name.x + LABEL_ZONES.name.w / 2, startY - index * lineHeight, nameSize, fonts.name, text);
  });
  if (product.showPrice) {
    const price = product.price || "$13.99";
    const priceSize = price.length > 10 ? 22 : 28;
    drawCenteredText(page, price, LABEL_ZONES.price.x + LABEL_ZONES.price.w / 2, LABEL_ZONES.price.y, priceSize, fonts.price, text);
  }
  if (product.showBarcode && barcodeImage) {
    page.drawImage(barcodeImage, {
      x: LABEL_ZONES.barcode.x,
      y: LABEL_ZONES.barcode.y,
      width: LABEL_ZONES.barcode.w,
      height: LABEL_ZONES.barcode.h
    });
  }
}
function drawInfoLabel(page, product, topImage, barcodeImage, fonts, textColor) {
  const text = hexToRgb(textColor);
  if (topImage) {
    drawHeightFittedImage(
      page,
      topImage,
      INFO_LABEL_ZONES.topImage.x,
      INFO_LABEL_ZONES.topImage.y,
      INFO_LABEL_ZONES.topImage.w,
      INFO_LABEL_ZONES.topImage.h
    );
  }
  drawRoundRect(
    page,
    INFO_LABEL_ZONES.infoPanel.x,
    INFO_LABEL_ZONES.infoPanel.y,
    INFO_LABEL_ZONES.infoPanel.w,
    INFO_LABEL_ZONES.infoPanel.h,
    hexToRgb("#ffffff"),
    10
  );
  const name = product.name || "Product Name";
  const nameSize = 12;
  const nameLines = wrapText(name, fonts.name, nameSize, INFO_LABEL_ZONES.leftName.w);
  const startY = INFO_LABEL_ZONES.leftName.y + INFO_LABEL_ZONES.leftName.h - nameSize;
  const lineHeight = nameSize * 1.08;
  nameLines.slice(0, 2).forEach((line, index) => {
    drawCenteredText(
      page,
      line,
      INFO_LABEL_ZONES.leftName.x + INFO_LABEL_ZONES.leftName.w / 2,
      startY - index * lineHeight,
      nameSize,
      fonts.name,
      text
    );
  });
  if (product.showPrice) {
    const price = product.price || "$8.99";
    drawCenteredText(
      page,
      price,
      INFO_LABEL_ZONES.leftPrice.x + INFO_LABEL_ZONES.leftPrice.w / 2,
      INFO_LABEL_ZONES.leftPrice.y,
      12,
      fonts.price,
      text
    );
  }
  drawInfoText(page, product, fonts, text);
  if (product.showBarcode && barcodeImage) {
    page.drawImage(barcodeImage, {
      x: INFO_LABEL_ZONES.barcode.x,
      y: INFO_LABEL_ZONES.barcode.y,
      width: INFO_LABEL_ZONES.barcode.w,
      height: INFO_LABEL_ZONES.barcode.h
    });
  }
}
function drawVerticalInfoLabel(page, product, topImage, fonts, panel, text) {
  if (topImage) {
    drawHeightFittedImage(
      page,
      topImage,
      VERTICAL_INFO_LABEL_ZONES.topImage.x,
      VERTICAL_INFO_LABEL_ZONES.topImage.y,
      VERTICAL_INFO_LABEL_ZONES.topImage.w,
      VERTICAL_INFO_LABEL_ZONES.topImage.h
    );
  }
  drawRoundRect(
    page,
    VERTICAL_INFO_LABEL_ZONES.contentPanel.x,
    VERTICAL_INFO_LABEL_ZONES.contentPanel.y,
    VERTICAL_INFO_LABEL_ZONES.contentPanel.w,
    VERTICAL_INFO_LABEL_ZONES.contentPanel.h,
    panel,
    10
  );
  const name = product.name || "Product Title";
  const nameSize = name.length > 26 ? 17 : name.length > 16 ? 20 : 24;
  const nameLines = wrapText(name, fonts.name, nameSize, VERTICAL_INFO_LABEL_ZONES.title.w);
  const titleLineHeight = nameSize * 1.05;
  const titleStartY = VERTICAL_INFO_LABEL_ZONES.title.y + VERTICAL_INFO_LABEL_ZONES.title.h - nameSize;
  nameLines.slice(0, 3).forEach((line, index) => {
    drawCenteredText(
      page,
      line,
      VERTICAL_INFO_LABEL_ZONES.title.x + VERTICAL_INFO_LABEL_ZONES.title.w / 2,
      titleStartY - index * titleLineHeight,
      nameSize,
      fonts.name,
      text
    );
  });
  if (product.showCookingInstructions === false) return;
  const headingSize = 10;
  drawCenteredText(
    page,
    "Cooking Instructions",
    VERTICAL_INFO_LABEL_ZONES.cookingTitle.x + VERTICAL_INFO_LABEL_ZONES.cookingTitle.w / 2,
    VERTICAL_INFO_LABEL_ZONES.cookingTitle.y + 2,
    headingSize,
    fonts.bodyBold,
    text
  );
  const body = product.cookingInstructions || "Add cooking instructions";
  const bodySize = 8;
  const bodyLines = wrapText(body, fonts.ingredients, bodySize, VERTICAL_INFO_LABEL_ZONES.cookingBody.w);
  const bodyLineHeight = bodySize * 1.18;
  let y = VERTICAL_INFO_LABEL_ZONES.cookingBody.y + VERTICAL_INFO_LABEL_ZONES.cookingBody.h - bodySize;
  for (const line of bodyLines.slice(0, 4)) {
    drawCenteredText(
      page,
      line,
      VERTICAL_INFO_LABEL_ZONES.cookingBody.x + VERTICAL_INFO_LABEL_ZONES.cookingBody.w / 2,
      y,
      bodySize,
      fonts.ingredients,
      text
    );
    y -= bodyLineHeight;
  }
}
function drawInfoText(page, product, fonts, color) {
  const x = INFO_LABEL_ZONES.infoText.x;
  const width = INFO_LABEL_ZONES.infoText.w;
  const bottomY = INFO_LABEL_ZONES.infoText.y;
  let y = INFO_LABEL_ZONES.infoText.y + INFO_LABEL_ZONES.infoText.h - 6;
  const titleSize = 7.2;
  const sections = [
    { title: "Nutrition Facts:", body: joinInfo(product.servingInfo, product.nutritionInfo), bodySize: 8, font: fonts.ingredients },
    { title: "Cooking Instructions", body: product.showCookingInstructions ? product.cookingInstructions || "" : "", bodySize: 8, font: fonts.ingredients },
    { title: "Ingredients:", body: product.ingredients || "", bodySize: 8, font: fonts.ingredients }
  ];
  for (const section of sections) {
    if (!section.body) continue;
    if (y <= bottomY + titleSize) break;
    page.drawText(section.title, { x, y, size: titleSize, font: fonts.bodyBold, color });
    y -= titleSize * 1.45;
    const bodyFont = section.font ?? fonts.body;
    const lines = wrapText(section.body, bodyFont, section.bodySize, width);
    const lineHeight = section.bodySize * 1.2;
    for (const line of lines) {
      if (y <= bottomY + section.bodySize) break;
      page.drawText(line, { x, y, size: section.bodySize, font: bodyFont, color });
      y -= lineHeight;
    }
    y -= section.bodySize * 0.5;
  }
  if (product.allergenStatement) {
    const lines = wrapText(product.allergenStatement, fonts.ingredients, 8, width);
    for (const line of lines) {
      if (y <= bottomY + 8) break;
      page.drawText(line, { x, y, size: 8, font: fonts.ingredients, color: pdfLib.rgb(0.25, 0.25, 0.28) });
      y -= 8 * 1.2;
    }
  }
}
function joinInfo(servingInfo, nutritionInfo) {
  return [servingInfo, nutritionInfo].filter(Boolean).join(" | ");
}
async function buildLabelPDF(product, topImageBytes, barcodeBytes) {
  const template = getLabelTemplate(product.templateId);
  const doc = await pdfLib.PDFDocument.create();
  doc.registerFontkit(fontkit);
  const fonts = await embedFonts(doc);
  const topImage = topImageBytes ? await embedImageAsset(doc, topImageBytes, product.logoImagePath ?? getDefaultTopLogoPath()) : null;
  const barcodeImage = barcodeBytes ? await embedImageAsset(doc, barcodeBytes, product.barcodeImagePath) : null;
  const page = doc.addPage([template.width, template.height]);
  await drawLabel(page, product, topImage, barcodeImage, fonts);
  return doc.save();
}
async function exportSingleLabelPDF(product, outputPath) {
  const topImageBytes = getTopImageBytes(product);
  const barcodeBytes = await getBarcodePNG(product);
  const bytes = await buildLabelPDF(product, topImageBytes, barcodeBytes);
  fs.writeFileSync(outputPath, bytes);
  return outputPath;
}
async function buildSheetPDF(products, startSlot) {
  const barcodeCache = /* @__PURE__ */ new Map();
  const imageCache = /* @__PURE__ */ new Map();
  const settings = getSettings();
  const sheetLayout = getSheetLayoutPoints(
    toInches(settings.sheetOffsetXIn),
    toInches(settings.sheetOffsetYIn)
  );
  for (const product of products) {
    if (!barcodeCache.has(product.id)) barcodeCache.set(product.id, await getBarcodePNG(product));
    if (!imageCache.has(product.id)) imageCache.set(product.id, getTopImageBytes(product));
  }
  const sheetDoc = await pdfLib.PDFDocument.create();
  const sheetPage = sheetDoc.addPage([sheetLayout.pageW, sheetLayout.pageH]);
  sheetPage.drawRectangle({
    x: 0,
    y: 0,
    width: sheetLayout.pageW,
    height: sheetLayout.pageH,
    color: hexToRgb("#f6f2df"),
    borderWidth: 0
  });
  for (let slot = 1; slot <= sheetLayout.cols * sheetLayout.rows; slot++) {
    const productIndex = slot - startSlot;
    if (productIndex < 0 || productIndex >= products.length) continue;
    const product = products[productIndex];
    if (!product) continue;
    const template = getLabelTemplate(product.templateId);
    const col = (slot - 1) % sheetLayout.cols;
    const row = Math.floor((slot - 1) / sheetLayout.cols);
    const slotX = sheetLayout.marginLeft + sheetLayout.offsetX + col * (sheetLayout.slotW + sheetLayout.gapX);
    const slotY = sheetLayout.pageH - sheetLayout.marginTop - sheetLayout.offsetY - (row + 1) * sheetLayout.slotH - row * sheetLayout.gapY;
    const labelBytes = await buildLabelPDF(
      product,
      imageCache.get(product.id) ?? null,
      barcodeCache.get(product.id) ?? null
    );
    const [embeddedLabel] = await sheetDoc.embedPdf(labelBytes);
    if (template.layout === "info") {
      sheetPage.drawPage(embeddedLabel, {
        x: slotX,
        y: slotY,
        width: sheetLayout.slotW,
        height: sheetLayout.slotH,
        borderWidth: 0
      });
    } else {
      sheetPage.drawPage(embeddedLabel, {
        x: slotX + sheetLayout.slotW,
        y: slotY,
        width: sheetLayout.slotH,
        height: sheetLayout.slotW,
        rotate: pdfLib.degrees(90),
        borderWidth: 0
      });
    }
  }
  return sheetDoc.save();
}
async function exportSheetPDF(products, startSlot, outputPath) {
  const bytes = await buildSheetPDF(products, startSlot);
  fs.writeFileSync(outputPath, bytes);
  return outputPath;
}
async function exportSingleLabelSVG(product) {
  const template = getLabelTemplate(product.templateId);
  const topImageUri = product.logoImagePath ? readImageAsBase64(product.logoImagePath) : readImageAsBase64(getDefaultTopLogoPath());
  const avenirFontUri = readFontDataUri(getAvenirNextCondensedFontPath());
  let barcodeUri = "";
  try {
    const barcode = await getBarcodePNG(product);
    if (barcode) barcodeUri = `data:image/png;base64,${barcode.toString("base64")}`;
  } catch {
  }
  if (template.layout === "info") {
    return buildInfoSvg(product, template, topImageUri, barcodeUri, avenirFontUri);
  }
  if (template.layout === "vertical-info") {
    return buildVerticalInfoSvg(product, template, topImageUri, avenirFontUri);
  }
  if (template.layout === "logo-only") {
    return buildLogoOnlySvg(template, topImageUri);
  }
  return buildFrontSvg(product, template, topImageUri, barcodeUri);
}
function buildFrontSvg(product, template, topImageUri, barcodeUri) {
  const name = product.name || "Product Name";
  const price = product.price || "$13.99";
  const nameSize = name.length > 30 ? 15 : name.length > 18 ? 18 : 22;
  const nameLines = splitLines(name, nameSize >= 22 ? 14 : nameSize >= 18 ? 18 : 22, 3);
  const lineHeight = nameSize * 1.08;
  const nameStartY = svgYFromBottom(LABEL_ZONES.name.y + LABEL_ZONES.name.h - nameSize, 0, template.height);
  const priceY = svgYFromBottom(LABEL_ZONES.price.y, 0, template.height);
  const contentY = svgYFromBottom(LABEL_ZONES.contentPanel.y, LABEL_ZONES.contentPanel.h, template.height);
  const imageY = svgYFromBottom(LABEL_ZONES.topImage.y, LABEL_ZONES.topImage.h, template.height);
  const barcodeY = svgYFromBottom(LABEL_ZONES.barcode.y, LABEL_ZONES.barcode.h, template.height);
  const nameEls = nameLines.map(
    (line, index) => `<text x="${LABEL_ZONES.name.x + LABEL_ZONES.name.w / 2}" y="${nameStartY + index * lineHeight}" text-anchor="middle" font-family="Lora,Georgia,serif" font-weight="700" font-size="${nameSize}" fill="${template.textColor}">${xml(line)}</text>`
  ).join("\n  ");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     viewBox="0 0 ${template.width} ${template.height}" width="${template.width}pt" height="${template.height}pt" version="1.1">
  <rect x="0.5" y="0.5" width="${template.width - 1}" height="${template.height - 1}" rx="12" fill="${template.shellColor}" stroke="${template.borderColor}" stroke-width="1"/>
  <image x="${LABEL_ZONES.topImage.x}" y="${imageY}" width="${LABEL_ZONES.topImage.w}" height="${LABEL_ZONES.topImage.h}" xlink:href="${topImageUri}" preserveAspectRatio="xMidYMid meet"/>
  <rect x="${LABEL_ZONES.contentPanel.x}" y="${contentY}" width="${LABEL_ZONES.contentPanel.w}" height="${LABEL_ZONES.contentPanel.h}" rx="10" fill="${template.panelColor}"/>
  ${nameEls}
  ${product.showPrice ? `<text x="${LABEL_ZONES.price.x + LABEL_ZONES.price.w / 2}" y="${priceY}" text-anchor="middle" font-family="'Genty Demo',Georgia,serif" font-size="${price.length > 10 ? 22 : 28}" fill="${template.textColor}">${xml(price)}</text>` : ""}
  ${product.showBarcode && barcodeUri ? `<image x="${LABEL_ZONES.barcode.x}" y="${barcodeY}" width="${LABEL_ZONES.barcode.w}" height="${LABEL_ZONES.barcode.h}" xlink:href="${barcodeUri}"/>` : ""}
</svg>`;
}
function buildInfoSvg(product, template, topImageUri, barcodeUri, avenirFontUri) {
  const name = product.name || "Product Name";
  const price = product.price || "$8.99";
  const nameSize = 12;
  const nameLines = splitLines(name, 18, 2);
  const lineHeight = nameSize * 1.08;
  const nameStartY = svgYFromBottom(INFO_LABEL_ZONES.leftName.y + INFO_LABEL_ZONES.leftName.h - nameSize, 0, template.height);
  const priceY = svgYFromBottom(INFO_LABEL_ZONES.leftPrice.y, 0, template.height);
  const panelY = svgYFromBottom(INFO_LABEL_ZONES.infoPanel.y, INFO_LABEL_ZONES.infoPanel.h, template.height);
  const imageY = svgYFromBottom(INFO_LABEL_ZONES.topImage.y, INFO_LABEL_ZONES.topImage.h, template.height);
  const barcodeY = svgYFromBottom(INFO_LABEL_ZONES.barcode.y, INFO_LABEL_ZONES.barcode.h, template.height);
  const infoBlock = buildInfoHtml(product);
  const nameEls = nameLines.map(
    (line, index) => `<text x="${INFO_LABEL_ZONES.leftName.x + INFO_LABEL_ZONES.leftName.w / 2}" y="${nameStartY + index * lineHeight}" text-anchor="middle" font-family="Lora,Georgia,serif" font-weight="700" font-size="${nameSize}" fill="${template.textColor}">${xml(line)}</text>`
  ).join("\n  ");
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
  </style>` : ""}
  <rect x="0" y="0" width="${template.width}" height="${template.height}" rx="12" fill="${template.shellColor}" stroke="none"/>
  <image x="${INFO_LABEL_ZONES.topImage.x}" y="${imageY}" width="${INFO_LABEL_ZONES.topImage.w}" height="${INFO_LABEL_ZONES.topImage.h}" xlink:href="${topImageUri}" preserveAspectRatio="xMidYMid meet"/>
  <rect x="${INFO_LABEL_ZONES.infoPanel.x}" y="${panelY}" width="${INFO_LABEL_ZONES.infoPanel.w}" height="${INFO_LABEL_ZONES.infoPanel.h}" rx="10" fill="${template.infoPanelColor ?? "#ffffff"}"/>
  ${nameEls}
  ${product.showPrice ? `<text x="${INFO_LABEL_ZONES.leftPrice.x + INFO_LABEL_ZONES.leftPrice.w / 2}" y="${priceY}" text-anchor="middle" font-family="'Genty Demo',Georgia,serif" font-size="12" fill="${template.textColor}">${xml(price)}</text>` : ""}
  ${infoBlock}
  ${product.showBarcode && barcodeUri ? `<image x="${INFO_LABEL_ZONES.barcode.x}" y="${barcodeY}" width="${INFO_LABEL_ZONES.barcode.w}" height="${INFO_LABEL_ZONES.barcode.h}" xlink:href="${barcodeUri}"/>` : ""}
</svg>`;
}
function buildVerticalInfoSvg(product, template, topImageUri, avenirFontUri) {
  const name = product.name || "Product Title";
  const nameSize = name.length > 26 ? 17 : name.length > 16 ? 20 : 24;
  const nameLines = splitLines(name, nameSize >= 24 ? 13 : nameSize >= 20 ? 16 : 19, 3);
  const titleLineHeight = nameSize * 1.05;
  const titleStartY = svgYFromBottom(VERTICAL_INFO_LABEL_ZONES.title.y + VERTICAL_INFO_LABEL_ZONES.title.h - nameSize, 0, template.height);
  const panelY = svgYFromBottom(VERTICAL_INFO_LABEL_ZONES.contentPanel.y, VERTICAL_INFO_LABEL_ZONES.contentPanel.h, template.height);
  const imageY = svgYFromBottom(VERTICAL_INFO_LABEL_ZONES.topImage.y, VERTICAL_INFO_LABEL_ZONES.topImage.h, template.height);
  const headingY = svgYFromBottom(VERTICAL_INFO_LABEL_ZONES.cookingTitle.y + 2, 0, template.height);
  const bodyStartY = svgYFromBottom(VERTICAL_INFO_LABEL_ZONES.cookingBody.y + VERTICAL_INFO_LABEL_ZONES.cookingBody.h - 8, 0, template.height);
  const bodyLineHeight = 8 * 1.18;
  const nameEls = nameLines.map(
    (line, index) => `<text x="${VERTICAL_INFO_LABEL_ZONES.title.x + VERTICAL_INFO_LABEL_ZONES.title.w / 2}" y="${titleStartY + index * titleLineHeight}" text-anchor="middle" font-family="Lora,Georgia,serif" font-weight="700" font-size="${nameSize}" fill="${template.textColor}">${xml(line)}</text>`
  ).join("\n  ");
  const cookingLines = product.showCookingInstructions === false ? [] : splitLines(product.cookingInstructions || "Add cooking instructions", 28, 4);
  const cookingEls = cookingLines.map(
    (line, index) => `<text x="${VERTICAL_INFO_LABEL_ZONES.cookingBody.x + VERTICAL_INFO_LABEL_ZONES.cookingBody.w / 2}" y="${bodyStartY + index * bodyLineHeight}" text-anchor="middle" font-family="&quot;Avenir Next Condensed Asset&quot;,&quot;Avenir Next Condensed&quot;,&quot;Avenir Next&quot;,&quot;Arial Narrow&quot;,Arial,sans-serif" font-size="8" font-weight="400" fill="${template.textColor}">${xml(line)}</text>`
  ).join("\n  ");
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
  </style>` : ""}
  <rect x="0.5" y="0.5" width="${template.width - 1}" height="${template.height - 1}" rx="12" fill="${template.shellColor}" stroke="${template.borderColor}" stroke-width="1"/>
  <image x="${VERTICAL_INFO_LABEL_ZONES.topImage.x}" y="${imageY}" width="${VERTICAL_INFO_LABEL_ZONES.topImage.w}" height="${VERTICAL_INFO_LABEL_ZONES.topImage.h}" xlink:href="${topImageUri}" preserveAspectRatio="xMidYMid meet"/>
  <rect x="${VERTICAL_INFO_LABEL_ZONES.contentPanel.x}" y="${panelY}" width="${VERTICAL_INFO_LABEL_ZONES.contentPanel.w}" height="${VERTICAL_INFO_LABEL_ZONES.contentPanel.h}" rx="10" fill="${template.panelColor}"/>
  ${nameEls}
  ${product.showCookingInstructions === false ? "" : `<text x="${VERTICAL_INFO_LABEL_ZONES.cookingTitle.x + VERTICAL_INFO_LABEL_ZONES.cookingTitle.w / 2}" y="${headingY}" text-anchor="middle" font-family="'Helvetica Neue',Arial,sans-serif" font-weight="700" font-size="10" fill="${template.textColor}">Cooking Instructions</text>`}
  ${cookingEls}
</svg>`;
}
function buildLogoOnlySvg(template, topImageUri) {
  const imageY = svgYFromBottom(LOGO_ONLY_LABEL_ZONES.topImage.y, LOGO_ONLY_LABEL_ZONES.topImage.h, template.height);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     viewBox="0 0 ${template.width} ${template.height}" width="${template.width}pt" height="${template.height}pt" version="1.1">
  <rect x="0" y="0" width="${template.width}" height="${template.height}" fill="${template.shellColor}"/>
  <image x="${LOGO_ONLY_LABEL_ZONES.topImage.x}" y="${imageY}" width="${LOGO_ONLY_LABEL_ZONES.topImage.w}" height="${LOGO_ONLY_LABEL_ZONES.topImage.h}" xlink:href="${topImageUri}" preserveAspectRatio="xMidYMid meet"/>
</svg>`;
}
function buildInfoHtml(product) {
  const x = INFO_LABEL_ZONES.infoText.x;
  const maxY = svgYFromBottom(INFO_LABEL_ZONES.infoText.y, 0, 181);
  let y = svgYFromBottom(INFO_LABEL_ZONES.infoText.y + INFO_LABEL_ZONES.infoText.h - 6, 0, 181);
  const out = [];
  const titleSize = 7.2;
  const sections = [
    { title: "Nutrition Facts:", body: joinInfo(product.servingInfo, product.nutritionInfo), bodySize: 8, maxChars: 34 },
    { title: "Cooking Instructions", body: product.showCookingInstructions ? product.cookingInstructions || "" : "", bodySize: 8, maxChars: 34 },
    { title: "Ingredients:", body: product.ingredients || "", bodySize: 8, maxChars: 34 }
  ];
  for (const section of sections) {
    if (!section.body) continue;
    if (y >= maxY - titleSize) break;
    out.push(`<text x="${x}" y="${y}" font-family="'Helvetica Neue',Arial,sans-serif" font-weight="700" font-size="${titleSize}" fill="#1b2733">${xml(section.title)}</text>`);
    y += titleSize * 1.45;
    const lines = splitLines(section.body, section.maxChars, 12);
    const lineHeight = section.bodySize * 1.2;
    for (const line of lines) {
      if (y >= maxY - section.bodySize) break;
      out.push(`<text x="${x}" y="${y}" font-family="&quot;Avenir Next Condensed Asset&quot;,&quot;Avenir Next Condensed&quot;,&quot;Avenir Next&quot;,&quot;Arial Narrow&quot;,Arial,sans-serif" font-size="${section.bodySize}" font-weight="400" fill="#1b2733">${xml(line)}</text>`);
      y += lineHeight;
    }
    y += section.bodySize * 0.5;
  }
  if (product.allergenStatement) {
    const lines = splitLines(product.allergenStatement, 34, 12);
    for (const line of lines) {
      if (y >= maxY - 8) break;
      out.push(`<text x="${x}" y="${y}" font-family="&quot;Avenir Next Condensed Asset&quot;,&quot;Avenir Next Condensed&quot;,&quot;Avenir Next&quot;,&quot;Arial Narrow&quot;,Arial,sans-serif" font-size="8" font-weight="400" fill="#3f3f46">${xml(line)}</text>`);
      y += 8 * 1.2;
    }
  }
  return out.join("\n  ");
}
function readFontDataUri(filePath) {
  if (!fs.existsSync(filePath)) return "";
  const bytes = fs.readFileSync(filePath);
  return `data:font/otf;base64,${bytes.toString("base64")}`;
}
function xml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  const value = normalized.length === 3 ? normalized.split("").map((char) => char + char).join("") : normalized;
  const intValue = Number.parseInt(value, 16);
  return pdfLib.rgb(
    (intValue >> 16 & 255) / 255,
    (intValue >> 8 & 255) / 255,
    (intValue & 255) / 255
  );
}
function ok(data) {
  return { ok: true, data };
}
function fail(error) {
  return { ok: false, error };
}
function registerIpcHandlers() {
  electron.ipcMain.handle("product:list", () => {
    try {
      return ok(listProducts());
    } catch (e) {
      return fail(String(e));
    }
  });
  electron.ipcMain.handle("product:get", (_e, id) => {
    try {
      const p = getProduct(id);
      return p ? ok(p) : fail("Product not found");
    } catch (e) {
      return fail(String(e));
    }
  });
  electron.ipcMain.handle("product:create", (_e, data) => {
    try {
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const product = { id: nanoid.nanoid(), createdAt: now, updatedAt: now, ...data };
      createProduct(product);
      return ok(product);
    } catch (e) {
      return fail(String(e));
    }
  });
  electron.ipcMain.handle("product:update", (_e, product) => {
    try {
      const updated = { ...product, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
      updateProduct(updated);
      return ok(updated);
    } catch (e) {
      return fail(String(e));
    }
  });
  electron.ipcMain.handle("product:delete", (_e, id) => {
    try {
      deleteProduct(id);
      return ok(true);
    } catch (e) {
      return fail(String(e));
    }
  });
  electron.ipcMain.handle("product:duplicate", (_e, id) => {
    try {
      const source = getProduct(id);
      if (!source) return fail("Product not found");
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const copy = {
        ...source,
        id: nanoid.nanoid(),
        name: `${source.name} (copy)`,
        barcodeValue: generateBarcode(),
        barcodeImagePath: null,
        createdAt: now,
        updatedAt: now
      };
      createProduct(copy);
      return ok(copy);
    } catch (e) {
      return fail(String(e));
    }
  });
  electron.ipcMain.handle("product:importSpreadsheet", async () => {
    try {
      let findCol = function(headers2, ...candidates) {
        return headers2.find((h) => candidates.includes(norm(h)));
      };
      const result = await electron.dialog.showOpenDialog({
        title: "Import Products from Spreadsheet",
        filters: [
          { name: "Spreadsheets", extensions: ["csv", "xlsx", "xls"] }
        ],
        properties: ["openFile"]
      });
      if (result.canceled || !result.filePaths.length) return ok(null);
      const filePath = result.filePaths[0];
      const wb = XLSX__namespace.readFile(filePath, { type: "file", raw: false });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX__namespace.utils.sheet_to_json(ws, {
        defval: "",
        raw: false
      });
      const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, "");
      if (rows.length === 0) return fail("Spreadsheet is empty or unreadable.");
      const headers = Object.keys(rows[0]);
      const nameCol = findCol(headers, "name", "productname", "product", "description", "item");
      const priceCol = findCol(headers, "price", "cost", "unitprice", "retailprice");
      const barcodeCol = findCol(headers, "barcode", "barcodevalue", "barcodenumber", "upc", "ean", "sku", "code");
      const categoryCol = findCol(headers, "category", "type", "section", "department", "group");
      if (!nameCol) return fail('Could not find a "name" column. Expected a column named: name, product, description.');
      if (!priceCol) return fail('Could not find a "price" column. Expected a column named: price, cost, unitprice.');
      if (!barcodeCol) return fail('Could not find a "barcode" column. Expected a column named: barcode, upc, ean, sku.');
      const settings = getSettings();
      let imported = 0;
      const skipped = [];
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const name = String(row[nameCol] ?? "").trim();
        const price = String(row[priceCol] ?? "").trim();
        const barcode = String(row[barcodeCol] ?? "").trim();
        const category = categoryCol ? String(row[categoryCol] ?? "").trim() : "";
        if (!name && !price && !barcode) continue;
        if (!name) {
          skipped.push(`Row ${i + 2}: missing name`);
          continue;
        }
        if (!barcode) {
          skipped.push(`Row ${i + 2}: missing barcode`);
          continue;
        }
        const normalPrice = price ? /^\d/.test(price) ? `${settings.pricePrefix}${price}` : price : "";
        const now = (/* @__PURE__ */ new Date()).toISOString();
        const product = {
          id: nanoid.nanoid(),
          name,
          price: normalPrice,
          category,
          servingInfo: "",
          nutritionInfo: "",
          cookingInstructions: "",
          ingredients: "",
          allergenStatement: "",
          barcodeValue: barcode,
          barcodeType: "CODE128",
          barcodeImagePath: null,
          logoImagePath: null,
          templateId: settings.templateId,
          showPrice: true,
          showBarcode: true,
          showCookingInstructions: true,
          createdAt: now,
          updatedAt: now
        };
        createProduct(product);
        imported++;
      }
      return ok({ imported, skipped });
    } catch (e) {
      return fail(String(e));
    }
  });
  electron.ipcMain.handle("settings:get", () => {
    try {
      return ok(getSettings());
    } catch (e) {
      return fail(String(e));
    }
  });
  electron.ipcMain.handle("settings:set", (_e, key, value) => {
    try {
      setSetting(key, value);
      return ok(true);
    } catch (e) {
      return fail(String(e));
    }
  });
  electron.ipcMain.handle("file:pickBarcodeImage", async () => {
    try {
      const result = await electron.dialog.showOpenDialog({
        title: "Select Barcode Image",
        filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg", "svg"] }],
        properties: ["openFile"]
      });
      if (result.canceled || !result.filePaths.length) return ok(null);
      return ok(result.filePaths[0]);
    } catch (e) {
      return fail(String(e));
    }
  });
  electron.ipcMain.handle("file:saveBarcodeImage", (_e, sourcePath, productId) => {
    try {
      const dest = saveBarcodeImage(sourcePath, productId);
      return ok(dest);
    } catch (e) {
      return fail(String(e));
    }
  });
  electron.ipcMain.handle("file:pickLogoImage", async () => {
    try {
      const result = await electron.dialog.showOpenDialog({
        title: "Select Logo Image",
        filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg"] }],
        properties: ["openFile"]
      });
      if (result.canceled || !result.filePaths.length) return ok(null);
      return ok(result.filePaths[0]);
    } catch (e) {
      return fail(String(e));
    }
  });
  electron.ipcMain.handle("file:saveLogoImage", (_e, sourcePath, productId) => {
    try {
      const dest = saveLogoImage(sourcePath, productId);
      return ok(dest);
    } catch (e) {
      return fail(String(e));
    }
  });
  electron.ipcMain.handle("file:readImageAsBase64", (_e, filePath) => {
    try {
      return ok(readImageAsBase64(filePath));
    } catch (e) {
      return fail(String(e));
    }
  });
  electron.ipcMain.handle("file:getTemplatePNG", (_e, templateId) => {
    try {
      return ok(readTemplatePNGBase64(templateId || void 0));
    } catch (e) {
      return fail(String(e));
    }
  });
  electron.ipcMain.handle("file:listTemplates", () => {
    try {
      return ok(listTemplates());
    } catch (e) {
      return fail(String(e));
    }
  });
  electron.ipcMain.handle("file:pickTemplateImage", async () => {
    try {
      const result = await electron.dialog.showOpenDialog({
        title: "Select Template Image",
        filters: [{ name: "PNG Images", extensions: ["png"] }],
        properties: ["openFile"]
      });
      if (result.canceled || !result.filePaths.length) return ok(null);
      return ok(result.filePaths[0]);
    } catch (e) {
      return fail(String(e));
    }
  });
  electron.ipcMain.handle("file:saveTemplateImage", (_e, sourcePath) => {
    try {
      return ok(saveTemplateImage(sourcePath));
    } catch (e) {
      return fail(String(e));
    }
  });
  electron.ipcMain.handle("file:pickExportFolder", async () => {
    try {
      const result = await electron.dialog.showOpenDialog({
        title: "Choose Export Folder",
        properties: ["openDirectory", "createDirectory"]
      });
      if (result.canceled || !result.filePaths.length) return ok(null);
      return ok(result.filePaths[0]);
    } catch (e) {
      return fail(String(e));
    }
  });
  electron.ipcMain.handle("export:singlePDF", async (_e, product) => {
    try {
      const settings = getSettings();
      const result = await electron.dialog.showSaveDialog({
        title: "Save Label PDF",
        defaultPath: path.join(settings.exportFolder, `${sanitizeFilename(product.name)}.pdf`),
        filters: [{ name: "PDF", extensions: ["pdf"] }]
      });
      if (result.canceled || !result.filePath) return ok(null);
      const outPath = await exportSingleLabelPDF(product, result.filePath);
      electron.shell.openPath(outPath);
      return ok(outPath);
    } catch (e) {
      return fail(String(e));
    }
  });
  electron.ipcMain.handle("export:singleSVG", async (_e, product) => {
    try {
      const settings = getSettings();
      const svgContent = await exportSingleLabelSVG(product);
      const outPath = path.join(settings.exportFolder, `${sanitizeFilename(product.name)}.svg`);
      fs.writeFileSync(outPath, svgContent, "utf8");
      electron.shell.openPath(outPath);
      return ok(outPath);
    } catch (e) {
      return fail(String(e));
    }
  });
  electron.ipcMain.handle(
    "export:sheetPDF",
    async (_e, products, startSlot) => {
      try {
        const settings = getSettings();
        const result = await electron.dialog.showSaveDialog({
          title: "Save Sheet PDF",
          defaultPath: path.join(settings.exportFolder, "label-sheet.pdf"),
          filters: [{ name: "PDF", extensions: ["pdf"] }]
        });
        if (result.canceled || !result.filePath) return ok(null);
        const outPath = await exportSheetPDF(products, startSlot, result.filePath);
        electron.shell.openPath(outPath);
        return ok(outPath);
      } catch (e) {
        return fail(String(e));
      }
    }
  );
  electron.ipcMain.handle("print:sheet", async (_e, products, startSlot) => {
    const tempPath = path.join(electron.app.getPath("temp"), `label-sheet-print-${Date.now()}-${nanoid.nanoid(8)}.pdf`);
    try {
      const pdfBytes = await buildSheetPDF(products, startSlot);
      fs.writeFileSync(tempPath, pdfBytes);
      const printed = await printPdfWithDialog(tempPath);
      scheduleTempFileCleanup(tempPath);
      return ok(printed);
    } catch (e) {
      return fail(String(e));
    }
  });
  electron.ipcMain.handle("print:getTemplatePNG", () => {
    try {
      return ok(readTemplatePNGBase64());
    } catch (e) {
      return fail(String(e));
    }
  });
}
function generateBarcode() {
  const num = Math.floor(Math.random() * 9e11) + 1e11;
  return String(num);
}
async function printPdfWithDialog(pdfPath) {
  return new Promise((resolve, reject) => {
    const printWin = new electron.BrowserWindow({
      width: 900,
      height: 700,
      show: true,
      autoHideMenuBar: true,
      webPreferences: { sandbox: false }
    });
    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      if (!printWin.isDestroyed()) printWin.close();
      resolve(result);
    };
    printWin.webContents.once("did-finish-load", () => {
      setTimeout(() => {
        if (settled || printWin.isDestroyed()) return;
        const options = {
          silent: false,
          printBackground: true,
          pageSize: "Letter",
          landscape: false,
          margins: { marginType: "none" }
        };
        printWin.webContents.print(options, (success) => finish(success));
      }, 400);
    });
    printWin.webContents.once("did-fail-load", (_event, _code, desc) => {
      if (!settled) {
        settled = true;
        if (!printWin.isDestroyed()) printWin.destroy();
        reject(new Error(`Failed to load printable PDF: ${desc}`));
      }
    });
    printWin.loadURL(url.pathToFileURL(pdfPath).toString()).catch((err) => {
      if (!settled) {
        settled = true;
        if (!printWin.isDestroyed()) printWin.destroy();
        reject(err);
      }
    });
  });
}
function scheduleTempFileCleanup(filePath) {
  setTimeout(() => {
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch {
    }
  }, 6e4);
}
function sanitizeFilename(name) {
  return name.replace(/[^a-z0-9_\-. ]/gi, "_").trim().slice(0, 60);
}
electron.app.disableHardwareAcceleration();
function createWindow() {
  const win = new electron.BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 960,
    minHeight: 660,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: "hiddenInset",
    backgroundColor: "#f8f6f1",
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false,
      contextIsolation: true
    }
  });
  win.on("ready-to-show", () => {
    win.show();
  });
  win.webContents.setWindowOpenHandler(({ url: url2 }) => {
    electron.shell.openExternal(url2);
    return { action: "deny" };
  });
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    win.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    win.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
  return win;
}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.grazias.labelstudio");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  try {
    initFileManager();
    initDatabase();
    registerIpcHandlers();
  } catch (err) {
    console.error("Startup error:", err);
  }
  createWindow();
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") electron.app.quit();
});
