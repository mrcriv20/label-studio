"use strict";
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const fs = require("fs");
const child_process = require("child_process");
const nanoid = require("nanoid");
const XLSX = require("xlsx");
const pdfLib = require("pdf-lib");
const fontkit = require("@pdf-lib/fontkit");
const os = require("os");
const bwipjs = require("bwip-js");
const mongodb = require("mongodb");
function _interopNamespaceDefault(e) {
  const n2 = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n2, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n2.default = e;
  return Object.freeze(n2);
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
    sheetOffsetYIn: "0",
    pageBackgroundColor: "#f4f5f7",
    labelBackgroundColor: "",
    titleFontId: "bundled:lora",
    priceFontId: "bundled:genty",
    bodyFontId: "bundled:avenir",
    sheetPrinterName: "",
    rollPrinterName: "",
    rollLabelWidthIn: "4",
    rollLabelHeightIn: "2.5"
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
function setSettings(patch) {
  _settings = { ..._settings, ...patch };
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
    customerName: product.customerName ?? "",
    labelBackgroundColor: product.labelBackgroundColor ?? "",
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
    showProductName: product.showProductName ?? true,
    designImageOverrides: product.designImageOverrides && Object.keys(product.designImageOverrides).length ? product.designImageOverrides : null,
    tillieProductId: product.tillieProductId ?? null,
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
  cookingBody: { x: 18, y: 31, w: 145, h: 31 },
  customerName: { x: 18, y: 14, w: 145 }
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
const DESIGN_SLOT_DIR = path.join(electron.app.getPath("userData"), "design-images");
const TEMPLATE_DIR = path.join(ASSETS_DIR, "templates");
const TEMPLATE_PNG = path.join(ASSETS_DIR, "label-template-300dpi.png");
const TEMPLATE_EPS = path.join(ASSETS_DIR, "label-template.eps");
const DEFAULT_TEMPLATE_ID = "avery5821";
const TEMPLATE_CATALOG = path.join(TEMPLATE_DIR, "catalog.json");
const TEMPLATE_TOMBSTONES = path.join(TEMPLATE_DIR, "deleted.json");
function initFileManager() {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
  fs.mkdirSync(BARCODE_DIR, { recursive: true });
  fs.mkdirSync(LOGO_DIR, { recursive: true });
  fs.mkdirSync(DESIGN_SLOT_DIR, { recursive: true });
  fs.mkdirSync(TEMPLATE_DIR, { recursive: true });
  copyBundledAssets();
}
const MANAGED_IMAGE_DIRS = [BARCODE_DIR, LOGO_DIR, DESIGN_SLOT_DIR];
function isManagedImagePath(filePath) {
  const candidate = path.resolve(filePath);
  return MANAGED_IMAGE_DIRS.some((directory) => candidate.startsWith(`${path.resolve(directory)}${path.sep}`));
}
function deleteManagedImage(filePath) {
  if (!filePath || !isManagedImagePath(filePath)) return false;
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  return true;
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
      if (!/\.(png|svg)$/i.test(fileName)) continue;
      const sourcePath = path.join(sourceTemplateDir, fileName);
      const destPath = path.join(TEMPLATE_DIR, fileName);
      if (!fs.existsSync(destPath)) fs.copyFileSync(sourcePath, destPath);
    }
    registerBundledArtworkTemplates(sourceTemplateDir);
  }
}
function registerBundledArtworkTemplates(sourceTemplateDir) {
  const existing = readCustomTemplates();
  const tombstones = readTemplateTombstones();
  const added = [];
  for (const fileName of fs.readdirSync(sourceTemplateDir)) {
    if (!fileName.toLowerCase().endsWith(".svg")) continue;
    const baseName = path.basename(fileName, path.extname(fileName));
    const previewPath = path.join(TEMPLATE_DIR, `${baseName}.png`);
    if (!fs.existsSync(previewPath)) continue;
    const id = `custom-${slugify(baseName)}`;
    if (tombstones.includes(id)) continue;
    const name = prettifyTemplateName(baseName);
    if (existing.some((record) => record.id === id || record.name === name)) continue;
    const sourcePath = path.join(TEMPLATE_DIR, fileName);
    const dimensions = svgDimensions(fs.readFileSync(sourcePath, "utf8"));
    added.push({ id, name, sourcePath, previewPath, ...dimensions ?? {} });
  }
  if (added.length > 0) {
    fs.writeFileSync(TEMPLATE_CATALOG, JSON.stringify([...existing, ...added], null, 2), "utf8");
  }
}
function listTemplates() {
  return [...getLabelTemplates(), ...readCustomTemplates().map(({ id, name }) => ({ id, name }))];
}
function getTemplatePNGPath(templateId = DEFAULT_TEMPLATE_ID) {
  const custom = readCustomTemplates().find((template) => template.id === templateId);
  if (custom) return custom.previewPath;
  if (templateId === DEFAULT_TEMPLATE_ID) return TEMPLATE_PNG;
  return path.join(TEMPLATE_DIR, `${templateId}.png`);
}
function isCustomTemplate(templateId) {
  return Boolean(templateId && readCustomTemplates().some((template) => template.id === templateId));
}
function getCustomTemplateSize(templateId) {
  const custom = readCustomTemplates().find((template) => template.id === templateId);
  return custom?.width && custom?.height ? { width: custom.width, height: custom.height } : null;
}
function getDefaultTopLogoPath() {
  return path.join(getBundledAssetsDir(), "default-label-logo.png");
}
function getAvenirNextCondensedFontPath() {
  return path.join(getBundledAssetsDir(), "AvenirNextCondensed-Regular.otf");
}
function getLoraBoldFontPath() {
  return path.join(getBundledAssetsDir(), "Lora-Bold.ttf");
}
function getGentyRegularFontPath() {
  return path.join(getBundledAssetsDir(), "GentyDemo-Regular.ttf");
}
function readTemplatePNGBase64(templateId = DEFAULT_TEMPLATE_ID) {
  const templatePath = getTemplatePNGPath(templateId);
  if (!fs.existsSync(templatePath)) return "";
  const buf = fs.readFileSync(templatePath);
  return `data:image/png;base64,${buf.toString("base64")}`;
}
async function saveTemplateImage(sourcePath) {
  const extension = path.extname(sourcePath).toLowerCase();
  if (![".pdf", ".svg", ".png", ".jpg", ".jpeg", ".webp"].includes(extension)) {
    throw new Error("Choose a PDF, SVG, PNG, JPEG, or WebP label design.");
  }
  const baseId = slugify(path.basename(sourcePath, extension)) || "custom-label";
  const id = `custom-${baseId}-${Date.now()}`;
  const storedSource = path.join(TEMPLATE_DIR, `${id}${extension}`);
  const previewPath = path.join(TEMPLATE_DIR, `${id}.png`);
  fs.copyFileSync(sourcePath, storedSource);
  await createTemplatePreview(storedSource, previewPath, extension);
  const dimensions = extension === ".svg" ? svgDimensions(fs.readFileSync(storedSource, "utf8")) : null;
  const record = {
    id,
    name: prettifyTemplateName(baseId),
    sourcePath: storedSource,
    previewPath,
    ...dimensions ?? {}
  };
  fs.writeFileSync(TEMPLATE_CATALOG, JSON.stringify([...readCustomTemplates(), record], null, 2), "utf8");
  return { id: record.id, name: record.name };
}
function deleteCustomTemplate(templateId) {
  const records = readCustomTemplates();
  const record = records.find((template) => template.id === templateId);
  if (!record) return;
  for (const path2 of [record.sourcePath, record.previewPath]) {
    try {
      if (fs.existsSync(path2)) fs.unlinkSync(path2);
    } catch {
    }
  }
  fs.writeFileSync(
    TEMPLATE_CATALOG,
    JSON.stringify(records.filter((template) => template.id !== templateId), null, 2),
    "utf8"
  );
  const tombstones = readTemplateTombstones();
  if (!tombstones.includes(templateId)) {
    fs.writeFileSync(TEMPLATE_TOMBSTONES, JSON.stringify([...tombstones, templateId], null, 2), "utf8");
  }
}
function readTemplateTombstones() {
  try {
    const parsed = JSON.parse(fs.readFileSync(TEMPLATE_TOMBSTONES, "utf8"));
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}
function readCustomTemplates() {
  try {
    const records = JSON.parse(fs.readFileSync(TEMPLATE_CATALOG, "utf8"));
    return records.filter((record) => fs.existsSync(record.sourcePath) && fs.existsSync(record.previewPath));
  } catch {
    return [];
  }
}
async function createTemplatePreview(sourcePath, previewPath, extension) {
  if (extension === ".png") {
    fs.copyFileSync(sourcePath, previewPath);
    return;
  }
  if (extension === ".svg") {
    const svg = fs.readFileSync(sourcePath);
    const dimensions = svgDimensions(svg.toString("utf8")) ?? { width: 400, height: 640 };
    const width = 1500;
    const height = Math.max(1, Math.round(width * dimensions.height / dimensions.width));
    const renderWindow = new electron.BrowserWindow({
      show: false,
      width,
      height,
      useContentSize: true,
      webPreferences: { sandbox: true }
    });
    try {
      const svgUri = `data:image/svg+xml;base64,${svg.toString("base64")}`;
      const html = `<!doctype html><html><head><style>html,body{margin:0;overflow:hidden}img{display:block;width:${width}px;height:${height}px}</style></head><body><img src="${svgUri}"></body></html>`;
      await renderWindow.loadURL(`data:text/html;base64,${Buffer.from(html).toString("base64")}`);
      await renderWindow.webContents.executeJavaScript(
        'document.querySelector("img").decode().then(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))'
      );
      const image = await renderWindow.webContents.capturePage();
      if (!image.isEmpty()) {
        fs.writeFileSync(previewPath, image.toPNG());
        return;
      }
    } finally {
      if (!renderWindow.isDestroyed()) renderWindow.destroy();
    }
  }
  if ([".jpg", ".jpeg", ".webp"].includes(extension)) {
    const image = electron.nativeImage.createFromPath(sourcePath);
    if (!image.isEmpty()) {
      const size = image.getSize();
      const resized = size.width > 1200 ? image.resize({ width: 1200 }) : image;
      fs.writeFileSync(previewPath, resized.toPNG());
      return;
    }
  }
  if (process.platform === "darwin") {
    try {
      child_process.execFileSync("/usr/bin/sips", ["-s", "format", "png", "--resampleWidth", "1200", sourcePath, "--out", previewPath]);
      if (fs.existsSync(previewPath)) return;
    } catch {
    }
  }
  throw new Error("This file could not be converted into a label preview. Try exporting the design as PNG.");
}
function svgDimensions(svg) {
  const viewBox = svg.match(/\bviewBox\s*=\s*["']\s*[\d.-]+\s+[\d.-]+\s+([\d.]+)\s+([\d.]+)\s*["']/i);
  if (viewBox && Number(viewBox[1]) && Number(viewBox[2])) {
    return { width: Number(viewBox[1]), height: Number(viewBox[2]) };
  }
  const width = Number(svg.match(/\bwidth\s*=\s*["']([\d.]+)/i)?.[1]);
  const height = Number(svg.match(/\bheight\s*=\s*["']([\d.]+)/i)?.[1]);
  return width && height ? { width, height } : null;
}
function saveBarcodeImage(sourcePath, productId) {
  const ext = path.extname(sourcePath) || ".png";
  const destName = `barcode-${productId}-${Date.now()}${ext}`;
  const destPath = path.join(BARCODE_DIR, destName);
  fs.copyFileSync(sourcePath, destPath);
  return destPath;
}
function saveDesignSlotImage(sourcePath, productId, elementId) {
  const ext = path.extname(sourcePath).toLowerCase() || ".png";
  const clean = (value) => value.replace(/[^a-zA-Z0-9_-]/g, "");
  const destPath = path.join(DESIGN_SLOT_DIR, `${clean(productId)}-${clean(elementId)}-${Date.now()}${ext}`);
  fs.mkdirSync(DESIGN_SLOT_DIR, { recursive: true });
  fs.copyFileSync(sourcePath, destPath);
  return destPath;
}
function saveLogoImage(sourcePath, productId) {
  const ext = path.extname(sourcePath) || ".png";
  const destName = `logo-${productId}-${Date.now()}${ext}`;
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
const fontDir = () => path.join(electron.app.getPath("userData"), "fonts");
const catalogPath = () => path.join(fontDir(), "catalog.json");
function customFonts() {
  try {
    return JSON.parse(fs.readFileSync(catalogPath(), "utf8"));
  } catch {
    return [];
  }
}
function bundledFonts() {
  return [
    { id: "bundled:lora", family: "Lora", source: "bundled", path: getLoraBoldFontPath() },
    { id: "bundled:genty", family: "Genty Demo", source: "bundled", path: getGentyRegularFontPath() },
    { id: "bundled:avenir", family: "Avenir Next Condensed", source: "bundled", path: getAvenirNextCondensedFontPath() }
  ];
}
function initFonts() {
  fs.mkdirSync(fontDir(), { recursive: true });
}
function listFonts() {
  return [...bundledFonts(), ...customFonts()].filter((font) => fs.existsSync(font.path));
}
function getFont(id) {
  return listFonts().find((font) => font.id === id) ?? null;
}
function fontDataUri(id) {
  const font = getFont(id);
  if (!font) return "";
  const extension = path.extname(font.path).toLowerCase();
  const mime = extension === ".woff2" ? "font/woff2" : extension === ".woff" ? "font/woff" : extension === ".otf" ? "font/otf" : "font/ttf";
  return `data:${mime};base64,${fs.readFileSync(font.path).toString("base64")}`;
}
function importFont(sourcePath, source = "upload") {
  const extension = path.extname(sourcePath).toLowerCase();
  if (![".ttf", ".otf", ".woff", ".woff2"].includes(extension)) throw new Error("Choose a TTF, OTF, WOFF, or WOFF2 font file.");
  const family = path.basename(sourcePath, extension).replace(/[-_]+/g, " ").replace(/\b(regular|bold|medium|semibold|italic)\b/gi, "").trim();
  const id = `${source}:${Date.now()}`;
  const path$1 = path.join(fontDir(), `${id.replace(":", "-")}${extension}`);
  fs.copyFileSync(sourcePath, path$1);
  const asset = { id, family, source, path: path$1 };
  writeCatalog([...customFonts(), asset]);
  return asset;
}
async function addGoogleFont(family) {
  const cleanFamily = family.trim();
  if (!cleanFamily) throw new Error("Enter a Google Fonts family name.");
  const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(cleanFamily).replace(/%20/g, "+")}:wght@400;700`;
  const cssResponse = await fetch(cssUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!cssResponse.ok) throw new Error(`Google Fonts returned ${cssResponse.status}. Check the family name and internet connection.`);
  const css = await cssResponse.text();
  const urls = [...css.matchAll(/url\((https:\/\/[^)]+)\)/g)].map((match) => match[1]);
  if (!urls.length) throw new Error("Google Fonts did not return a usable font file.");
  const fontResponse = await fetch(urls[urls.length - 1]);
  if (!fontResponse.ok) throw new Error(`Could not download the Google font (${fontResponse.status}).`);
  const remoteExtension = path.extname(new URL(urls[urls.length - 1]).pathname).toLowerCase();
  const extension = [".ttf", ".otf", ".woff", ".woff2"].includes(remoteExtension) ? remoteExtension : ".woff2";
  const id = `google:${Date.now()}`;
  const path$1 = path.join(fontDir(), `${id.replace(":", "-")}${extension}`);
  fs.writeFileSync(path$1, Buffer.from(await fontResponse.arrayBuffer()));
  const asset = { id, family: cleanFamily, source: "google", path: path$1 };
  writeCatalog([...customFonts(), asset]);
  return asset;
}
function writeCatalog(fonts) {
  fs.writeFileSync(catalogPath(), JSON.stringify(fonts, null, 2), "utf8");
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
const DESIGN_ID_PREFIX = "design-";
const DEFAULT_DESIGN_FONT_ID = "bundled:lora";
function isDesignTemplateId(templateId) {
  return Boolean(templateId && templateId.startsWith(DESIGN_ID_PREFIX));
}
const TEXT_CASES = ["none", "upper", "lower", "title", "sentence"];
const VISIBLE_IF = ["always", "showPrice", "showBarcode", "showCookingInstructions", "showProductName"];
function validateDesignTemplate(raw) {
  if (!raw || typeof raw !== "object") throw new Error("Design file is not an object.");
  const doc = raw;
  if (doc.schemaVersion !== 1) throw new Error(`Unsupported design schema version: ${String(doc.schemaVersion)}`);
  const id = str(doc.id);
  if (!id.startsWith(DESIGN_ID_PREFIX)) throw new Error('Design id must start with "design-".');
  const canvas = doc.canvas ?? {};
  const width = num(canvas.width, 0);
  const height = num(canvas.height, 0);
  if (!(width > 0) || !(height > 0)) throw new Error("Design canvas size is invalid.");
  const elements = Array.isArray(doc.elements) ? doc.elements.map(validateElement) : [];
  return {
    schemaVersion: 1,
    id,
    name: str(doc.name) || "Untitled Design",
    canvas: { width, height, background: str(canvas.background) || "#ffffff" },
    elements,
    createdAt: str(doc.createdAt) || (/* @__PURE__ */ new Date(0)).toISOString(),
    updatedAt: str(doc.updatedAt) || (/* @__PURE__ */ new Date(0)).toISOString()
  };
}
function validateElement(raw, index) {
  if (!raw || typeof raw !== "object") throw new Error(`Element ${index} is not an object.`);
  const el = raw;
  const base = {
    id: str(el.id) || `el-${index}`,
    x: num(el.x, 0),
    y: num(el.y, 0),
    w: Math.max(1, num(el.w, 10)),
    h: Math.max(1, num(el.h, 10)),
    ...el.opacity !== void 0 ? { opacity: clamp$1(num(el.opacity, 1), 0, 1) } : {},
    ...el.locked ? { locked: true } : {},
    ...VISIBLE_IF.includes(el.visibleIf) && el.visibleIf !== "always" ? { visibleIf: el.visibleIf } : {}
  };
  switch (el.type) {
    case "box":
      return {
        ...base,
        type: "box",
        fill: str(el.fill),
        stroke: str(el.stroke),
        strokeWidth: Math.max(0, num(el.strokeWidth, 1)),
        cornerRadius: Math.max(0, num(el.cornerRadius, 0))
      };
    case "text":
      return {
        ...base,
        type: "text",
        content: str(el.content),
        fontId: str(el.fontId),
        size: clamp$1(num(el.size, 12), 1, 400),
        autoFit: Boolean(el.autoFit),
        color: str(el.color) || "#1b2733",
        align: el.align === "left" || el.align === "right" ? el.align : "center",
        lineHeight: clamp$1(num(el.lineHeight, 1.1), 0.5, 3),
        ...el.maxLines !== void 0 ? { maxLines: Math.max(1, Math.floor(num(el.maxLines, 1))) } : {},
        ...TEXT_CASES.includes(el.textCase) && el.textCase !== "none" ? { textCase: el.textCase } : {}
      };
    case "barcode":
      return {
        ...base,
        type: "barcode",
        showText: el.showText !== false,
        color: str(el.color) || "#000000"
      };
    case "image":
      return {
        ...base,
        type: "image",
        source: el.source === "asset" ? "asset" : "productLogo",
        ...el.assetName ? { assetName: str(el.assetName) } : {},
        fit: el.fit === "cover" || el.fit === "stretch" ? el.fit : "contain",
        ...el.label ? { label: str(el.label) } : {}
      };
    default:
      throw new Error(`Element ${index} has unknown type "${String(el.type)}".`);
  }
}
function str(value) {
  return typeof value === "string" ? value : "";
}
function num(value, fallback) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}
function clamp$1(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
const designDir = () => path.join(electron.app.getPath("userData"), "designs");
const designAssetDir = () => path.join(designDir(), "assets");
function initDesigns() {
  fs.mkdirSync(designAssetDir(), { recursive: true });
  const seedDir = path.join(getBundledAssetsDir(), "designs");
  if (!fs.existsSync(seedDir)) return;
  for (const fileName of fs.readdirSync(seedDir)) {
    if (!fileName.toLowerCase().endsWith(".json")) continue;
    try {
      const seed = validateDesignTemplate(JSON.parse(fs.readFileSync(path.join(seedDir, fileName), "utf8")));
      const dest = path.join(designDir(), `${sanitizeId(seed.id)}.json`);
      if (!fs.existsSync(dest)) fs.writeFileSync(dest, JSON.stringify(seed, null, 2), "utf8");
    } catch {
    }
  }
}
function listDesigns() {
  if (!fs.existsSync(designDir())) return [];
  const designs = [];
  for (const fileName of fs.readdirSync(designDir())) {
    if (!fileName.toLowerCase().endsWith(".json")) continue;
    try {
      designs.push(validateDesignTemplate(JSON.parse(fs.readFileSync(path.join(designDir(), fileName), "utf8"))));
    } catch {
    }
  }
  return designs.sort((a, b) => a.name.localeCompare(b.name));
}
function getDesign(id) {
  const path$1 = path.join(designDir(), `${sanitizeId(id)}.json`);
  if (!fs.existsSync(path$1)) return null;
  try {
    return validateDesignTemplate(JSON.parse(fs.readFileSync(path$1, "utf8")));
  } catch {
    return null;
  }
}
function saveDesign(raw) {
  const design = validateDesignTemplate(raw);
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const stored = {
    ...design,
    createdAt: getDesign(design.id)?.createdAt ?? now,
    updatedAt: now
  };
  fs.mkdirSync(designDir(), { recursive: true });
  fs.writeFileSync(path.join(designDir(), `${sanitizeId(stored.id)}.json`), JSON.stringify(stored, null, 2), "utf8");
  return stored;
}
function deleteDesign(id) {
  const path$1 = path.join(designDir(), `${sanitizeId(id)}.json`);
  if (fs.existsSync(path$1)) fs.unlinkSync(path$1);
}
function duplicateDesign(id) {
  const source = getDesign(id);
  if (!source) return null;
  return saveDesign({
    ...source,
    id: newDesignId(),
    name: `${source.name} (copy)`
  });
}
function newDesignId() {
  return `${DESIGN_ID_PREFIX}${Date.now()}`;
}
function importDesignAsset(sourcePath) {
  const extension = path.extname(sourcePath).toLowerCase();
  if (![".png", ".jpg", ".jpeg"].includes(extension)) {
    throw new Error("Choose a PNG or JPEG image.");
  }
  const name = `${slug(path.basename(sourcePath, extension))}-${Date.now()}${extension}`;
  fs.mkdirSync(designAssetDir(), { recursive: true });
  fs.copyFileSync(sourcePath, path.join(designAssetDir(), name));
  return name;
}
function designAssetPath(assetName) {
  return path.join(designAssetDir(), path.basename(assetName));
}
function designAssetDataUri(assetName) {
  return readImageAsBase64(designAssetPath(assetName));
}
const DESIGN_BUNDLE_FORMAT = "tillie-design";
function exportDesignToFile(raw, filePath) {
  const design = validateDesignTemplate(raw);
  const assets = {};
  for (const element of design.elements) {
    if (element.type === "image" && element.source === "asset" && element.assetName) {
      const dataUri = designAssetDataUri(element.assetName);
      if (dataUri) assets[element.assetName] = dataUri;
    }
  }
  const bundle = {
    format: DESIGN_BUNDLE_FORMAT,
    formatVersion: 1,
    design,
    assets
  };
  fs.writeFileSync(filePath, JSON.stringify(bundle, null, 2), "utf8");
}
function importDesignFromFile(filePath) {
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    throw new Error("That file is not a valid design export.");
  }
  const record = parsed;
  const isBundle = record?.format === DESIGN_BUNDLE_FORMAT;
  const rawDesign = isBundle ? record.design : parsed;
  const assets = isBundle && record.assets && typeof record.assets === "object" ? record.assets : {};
  let design;
  try {
    design = validateDesignTemplate(rawDesign);
  } catch (e) {
    throw new Error(`That file is not a valid design export. ${e instanceof Error ? e.message : ""}`.trim());
  }
  const renames = /* @__PURE__ */ new Map();
  for (const [assetName, dataUri] of Object.entries(assets)) {
    if (typeof dataUri !== "string") continue;
    const stored = storeDesignAssetFromDataUri(assetName, dataUri);
    if (stored && stored !== assetName) renames.set(assetName, stored);
  }
  if (renames.size) {
    design = {
      ...design,
      elements: design.elements.map(
        (element) => element.type === "image" && element.assetName && renames.has(element.assetName) ? { ...element, assetName: renames.get(element.assetName) } : element
      )
    };
  }
  if (getDesign(design.id)) {
    design = { ...design, id: newDesignId(), name: `${design.name} (imported)` };
  }
  return saveDesign(design);
}
function storeDesignAssetFromDataUri(assetName, dataUri) {
  const match = /^data:image\/(png|jpe?g);base64,(.+)$/.exec(dataUri);
  if (!match) return null;
  const buffer = Buffer.from(match[2], "base64");
  fs.mkdirSync(designAssetDir(), { recursive: true });
  const safeName = path.basename(assetName);
  const target = path.join(designAssetDir(), safeName);
  if (!fs.existsSync(target)) {
    fs.writeFileSync(target, buffer);
    return safeName;
  }
  if (fs.readFileSync(target).equals(buffer)) return safeName;
  const extension = path.extname(safeName);
  const renamed = `${slug(path.basename(safeName, extension))}-${Date.now()}${extension}`;
  fs.writeFileSync(path.join(designAssetDir(), renamed), buffer);
  return renamed;
}
function sanitizeId(id) {
  return path.basename(id).replace(/[^a-zA-Z0-9_-]/g, "");
}
function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "image";
}
function createTextMeasurer(fontBytesById) {
  const fonts = /* @__PURE__ */ new Map();
  const widthCache = /* @__PURE__ */ new Map();
  const load = (fontId) => {
    if (fonts.has(fontId)) return fonts.get(fontId) ?? null;
    let font = null;
    const bytes = fontBytesById[fontId];
    if (bytes) {
      try {
        font = fontkit.create(bytes);
      } catch {
        font = null;
      }
    }
    fonts.set(fontId, font);
    return font;
  };
  return {
    widthOf(fontId, text, size) {
      if (!text) return 0;
      const key = `${fontId}\0${size}\0${text}`;
      const cached = widthCache.get(key);
      if (cached !== void 0) return cached;
      const font = load(fontId);
      let width;
      if (!font) {
        width = text.length * size * 0.55;
      } else {
        const units = font.layout(text).glyphs.reduce((sum, glyph) => sum + glyph.advanceWidth, 0);
        width = units / font.unitsPerEm * size;
      }
      widthCache.set(key, width);
      return width;
    },
    ascent(fontId, size) {
      const font = load(fontId);
      return font ? font.ascent / font.unitsPerEm * size : size * 0.8;
    },
    descent(fontId, size) {
      const font = load(fontId);
      return font ? Math.abs(font.descent) / font.unitsPerEm * size : size * 0.2;
    }
  };
}
const MIN_AUTO_FIT_SIZE = 4;
function resolveLayout(design, product, measurer) {
  const primitives = [];
  for (const element of design.elements) {
    if (!isVisible(element, product)) continue;
    const opacity = clamp(element.opacity ?? 1, 0, 1);
    switch (element.type) {
      case "box":
        primitives.push({
          kind: "rect",
          x: element.x,
          y: element.y,
          w: element.w,
          h: element.h,
          fill: element.fill,
          stroke: element.stroke,
          strokeWidth: element.strokeWidth,
          radius: element.cornerRadius,
          opacity
        });
        break;
      case "text": {
        const resolved = resolveText(element, product, measurer, opacity);
        if (resolved) primitives.push(resolved);
        break;
      }
      case "barcode": {
        const resolved = resolveBarcode(element, product, opacity);
        if (resolved) primitives.push(resolved);
        break;
      }
      case "image":
        primitives.push(resolveImage(element, product, opacity));
        break;
    }
  }
  return {
    width: design.canvas.width,
    height: design.canvas.height,
    background: design.canvas.background,
    primitives
  };
}
function isVisible(element, product) {
  switch (element.visibleIf) {
    case "showPrice":
      return product.showPrice !== false;
    case "showBarcode":
      return product.showBarcode !== false;
    case "showCookingInstructions":
      return product.showCookingInstructions !== false;
    case "showProductName":
      return product.showProductName !== false;
    default:
      return true;
  }
}
function substituteTokens(content, product) {
  return content.replace(/\{([a-zA-Z]+)\}/g, (_match, field) => {
    const value = product[field];
    return typeof value === "string" ? value : "";
  });
}
function assessDesignTextFit(design, product, measurer) {
  const issues = [];
  for (const element of design.elements) {
    if (element.type !== "text" || !isVisible(element, product)) continue;
    const text = applyTextCase(substituteTokens(element.content, product).trim(), element.textCase);
    if (!text) continue;
    const fontId = element.fontId || DEFAULT_DESIGN_FONT_ID;
    const fitAt = (size2) => text.split(/\n/).map((paragraph) => wrapLine(paragraph, fontId, size2, element.w, measurer));
    let size = element.size;
    let paragraphs = fitAt(size);
    if (element.autoFit) {
      while (size > MIN_AUTO_FIT_SIZE && !fits(paragraphs, element, fontId, size, measurer)) {
        size = Math.max(MIN_AUTO_FIT_SIZE, size - 0.5);
        paragraphs = fitAt(size);
      }
    }
    const lines = paragraphs.flat();
    const lineStep = size * element.lineHeight;
    const maxByHeight = Math.max(1, Math.floor((element.h + lineStep - size) / lineStep));
    const maxLines = Math.min(element.maxLines ?? Infinity, maxByHeight);
    const clipped = lines.length > maxLines || !fits(paragraphs, element, fontId, size, measurer);
    const field = element.content.match(/\{([a-zA-Z]+)\}/)?.[1] ?? element.label ?? "Text";
    if (clipped) {
      issues.push({ elementId: element.id, field, status: "clipped", message: `${field} does not fit the “${element.label || "text"}” template area.` });
    } else if (element.autoFit && size <= Math.max(MIN_AUTO_FIT_SIZE + 1, element.size * 0.65)) {
      issues.push({ elementId: element.id, field, status: "tight", message: `${field} fits only at ${size.toFixed(1)} pt in “${element.label || "text"}”.` });
    }
  }
  return issues;
}
function resolveText(element, product, measurer, opacity) {
  const text = applyTextCase(substituteTokens(element.content, product).trim(), element.textCase);
  if (!text) return null;
  const fontId = element.fontId || DEFAULT_DESIGN_FONT_ID;
  const fit = (size2) => {
    return text.split(/\n/).map((paragraph) => wrapLine(paragraph, fontId, size2, element.w, measurer));
  };
  let size = element.size;
  let paragraphs = fit(size);
  if (element.autoFit) {
    while (size > MIN_AUTO_FIT_SIZE && !fits(paragraphs, element, fontId, size, measurer)) {
      size = Math.max(MIN_AUTO_FIT_SIZE, size - 0.5);
      paragraphs = fit(size);
    }
  }
  let lines = paragraphs.flat();
  const lineStep = size * element.lineHeight;
  const maxByHeight = Math.max(1, Math.floor((element.h + lineStep - size) / lineStep));
  const maxLines = Math.min(element.maxLines ?? Infinity, maxByHeight);
  if (lines.length > maxLines) lines = lines.slice(0, maxLines);
  const ascent = measurer.ascent(fontId, size);
  const resolvedLines = lines.map((line, index) => {
    const lineWidth = measurer.widthOf(fontId, line, size);
    const x = element.align === "center" ? element.x + (element.w - lineWidth) / 2 : element.align === "right" ? element.x + element.w - lineWidth : element.x;
    return { text: line, x, baseline: element.y + ascent + index * lineStep };
  });
  return {
    kind: "text",
    lines: resolvedLines,
    fontId,
    size,
    color: element.color,
    opacity
  };
}
function fits(paragraphs, element, fontId, size, measurer) {
  const lines = paragraphs.flat();
  if (element.maxLines && lines.length > element.maxLines) return false;
  const lineStep = size * element.lineHeight;
  if (size + (lines.length - 1) * lineStep > element.h) return false;
  return lines.every((line) => measurer.widthOf(fontId, line, size) <= element.w + 0.01);
}
function applyTextCase(text, textCase) {
  switch (textCase) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "title":
      return text.toLowerCase().replace(/(^|[\s\-–—/("'])(\p{L})/gu, (_m, lead, letter) => lead + letter.toUpperCase());
    case "sentence":
      return text.toLowerCase().replace(/(^|[.!?]\s+|\n\s*)(\p{L})/gu, (_m, lead, letter) => lead + letter.toUpperCase());
    default:
      return text;
  }
}
function wrapLine(text, fontId, size, maxWidth, measurer) {
  const words = text.split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const lines = [];
  let current = "";
  for (const word of words) {
    const trial = current ? `${current} ${word}` : word;
    if (measurer.widthOf(fontId, trial, size) <= maxWidth || !current) current = trial;
    else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}
function resolveBarcode(element, product, opacity) {
  const value = (product.barcodeValue ?? "").trim();
  if (!value) return null;
  return {
    kind: "barcode",
    x: element.x,
    y: element.y,
    w: element.w,
    h: element.h,
    value,
    showText: element.showText,
    color: element.color,
    opacity
  };
}
function resolveImage(element, product, opacity) {
  const overridePath = product.designImageOverrides?.[element.id];
  return {
    kind: "image",
    x: element.x,
    y: element.y,
    w: element.w,
    h: element.h,
    elementId: element.id,
    source: element.source,
    assetName: element.assetName,
    ...overridePath ? { overridePath } : {},
    fit: element.fit,
    opacity
  };
}
function fitRect(frame, imgW, imgH, fit) {
  if (fit === "stretch" || !imgW || !imgH) return { ...frame };
  const scale = fit === "contain" ? Math.min(frame.w / imgW, frame.h / imgH) : Math.max(frame.w / imgW, frame.h / imgH);
  const w = imgW * scale;
  const h = imgH * scale;
  return { x: frame.x + (frame.w - w) / 2, y: frame.y + (frame.h - h) / 2, w, h };
}
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
function designBarcodeOptions(value, showText, colorHex) {
  const color = colorHex.replace("#", "") || "000000";
  return {
    bcid: "code128",
    text: value,
    scale: 3,
    height: 10,
    includetext: showText,
    textxalign: "center",
    barcolor: color,
    textcolor: color
  };
}
function paintSVG(resolved, ctx) {
  const parts = [];
  let clipCounter = 0;
  parts.push(
    `<rect x="0" y="0" width="${resolved.width}" height="${resolved.height}" fill="${xml$1(resolved.background || "#ffffff")}"/>`
  );
  for (const primitive of resolved.primitives) {
    switch (primitive.kind) {
      case "rect": {
        if (!primitive.fill && !primitive.stroke) break;
        const inset = primitive.stroke ? primitive.strokeWidth / 2 : 0;
        parts.push(
          `<rect x="${n(primitive.x + inset)}" y="${n(primitive.y + inset)}" width="${n(Math.max(0, primitive.w - inset * 2))}" height="${n(Math.max(0, primitive.h - inset * 2))}" rx="${n(primitive.radius)}" fill="${primitive.fill ? xml$1(primitive.fill) : "none"}"` + (primitive.stroke ? ` stroke="${xml$1(primitive.stroke)}" stroke-width="${n(primitive.strokeWidth)}"` : "") + opacityAttr(primitive.opacity) + "/>"
        );
        break;
      }
      case "text": {
        const family = ctx.fontFamily(primitive.fontId);
        for (const line of primitive.lines) {
          parts.push(
            `<text x="${n(line.x)}" y="${n(line.baseline)}" font-family="${xml$1(family)}" font-size="${n(primitive.size)}" fill="${xml$1(primitive.color)}"${opacityAttr(primitive.opacity)} xml:space="preserve">${xml$1(line.text)}</text>`
          );
        }
        break;
      }
      case "barcode": {
        const href = ctx.barcodeHref(primitive);
        if (!href) break;
        parts.push(
          `<image x="${n(primitive.x)}" y="${n(primitive.y)}" width="${n(primitive.w)}" height="${n(primitive.h)}" preserveAspectRatio="none" href="${href}" xlink:href="${href}"${opacityAttr(primitive.opacity)}/>`
        );
        break;
      }
      case "image": {
        const href = ctx.imageHref(primitive);
        if (!href) break;
        const size = ctx.imageSize(primitive);
        const frame = { x: primitive.x, y: primitive.y, w: primitive.w, h: primitive.h };
        const rect = size ? fitRect(frame, size.w, size.h, primitive.fit) : frame;
        const needsClip = primitive.fit === "cover";
        let element = `<image x="${n(rect.x)}" y="${n(rect.y)}" width="${n(rect.w)}" height="${n(rect.h)}" preserveAspectRatio="none" href="${href}" xlink:href="${href}"${opacityAttr(primitive.opacity)}/>`;
        if (needsClip) {
          const clipId = `design-clip-${clipCounter++}`;
          element = `<clipPath id="${clipId}"><rect x="${n(frame.x)}" y="${n(frame.y)}" width="${n(frame.w)}" height="${n(frame.h)}"/></clipPath><g clip-path="url(#${clipId})">${element}</g>`;
        }
        parts.push(element);
        break;
      }
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${resolved.width} ${resolved.height}" width="${resolved.width}pt" height="${resolved.height}pt">` + (ctx.fontCss ? `<style>${ctx.fontCss}</style>` : "") + parts.join("") + "</svg>";
}
function opacityAttr(opacity) {
  return opacity < 1 ? ` opacity="${n(opacity)}"` : "";
}
function n(value) {
  return String(Math.round(value * 100) / 100);
}
function xml$1(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function collectFontBytes(design) {
  const ids = /* @__PURE__ */ new Set([DEFAULT_DESIGN_FONT_ID]);
  for (const element of design.elements) {
    if (element.type === "text") ids.add(element.fontId || DEFAULT_DESIGN_FONT_ID);
  }
  const bytes = {};
  for (const id of ids) {
    const font = getFont(id);
    if (font && fs.existsSync(font.path)) bytes[id] = new Uint8Array(fs.readFileSync(font.path));
  }
  return bytes;
}
function resolveDesign(design, product) {
  const measurer = createTextMeasurer(collectFontBytes(design));
  return resolveLayout(design, product, measurer);
}
function assessDesignFit(design, product) {
  return assessDesignTextFit(design, product, createTextMeasurer(collectFontBytes(design)));
}
function imageSourcePath(image, product) {
  if (image.overridePath && fs.existsSync(image.overridePath)) return image.overridePath;
  if (image.source === "asset") return image.assetName ? designAssetPath(image.assetName) : "";
  return product.logoImagePath && fs.existsSync(product.logoImagePath) ? product.logoImagePath : getDefaultTopLogoPath();
}
async function renderDesignBarcode(barcode) {
  try {
    return await bwipjs.toBuffer(designBarcodeOptions(barcode.value, barcode.showText, barcode.color));
  } catch {
    return null;
  }
}
async function drawDesignLabel(doc, page, design, product) {
  const resolved = resolveDesign(design, product);
  const H = resolved.height;
  const fontCache = /* @__PURE__ */ new Map();
  const fontBytes = collectFontBytes(design);
  const embedFontFor = async (fontId) => {
    const cached = fontCache.get(fontId);
    if (cached) return cached;
    let font;
    try {
      const bytes = fontBytes[fontId];
      font = bytes ? await doc.embedFont(bytes) : await doc.embedFont(pdfLib.StandardFonts.Helvetica);
    } catch {
      font = await doc.embedFont(pdfLib.StandardFonts.Helvetica);
    }
    fontCache.set(fontId, font);
    return font;
  };
  page.drawRectangle({
    x: 0,
    y: 0,
    width: resolved.width,
    height: H,
    color: hexToRgb$1(resolved.background || "#ffffff"),
    borderWidth: 0
  });
  for (const primitive of resolved.primitives) {
    switch (primitive.kind) {
      case "rect": {
        if (!primitive.fill && !primitive.stroke) break;
        page.drawRectangle({
          x: primitive.x,
          y: H - primitive.y - primitive.h,
          width: primitive.w,
          height: primitive.h,
          ...primitive.fill ? { color: hexToRgb$1(primitive.fill) } : {},
          ...primitive.stroke ? { borderColor: hexToRgb$1(primitive.stroke), borderWidth: primitive.strokeWidth } : { borderWidth: 0 },
          borderRadius: primitive.radius,
          opacity: primitive.opacity,
          borderOpacity: primitive.opacity
        });
        break;
      }
      case "text": {
        const font = await embedFontFor(primitive.fontId);
        const color = hexToRgb$1(primitive.color);
        for (const line of primitive.lines) {
          page.drawText(line.text, {
            x: line.x,
            y: H - line.baseline,
            size: primitive.size,
            font,
            color,
            opacity: primitive.opacity
          });
        }
        break;
      }
      case "barcode": {
        const png = await renderDesignBarcode(primitive);
        if (!png) break;
        try {
          const image = await doc.embedPng(png);
          page.drawImage(image, {
            x: primitive.x,
            y: H - primitive.y - primitive.h,
            width: primitive.w,
            height: primitive.h,
            opacity: primitive.opacity
          });
        } catch {
        }
        break;
      }
      case "image": {
        const sourcePath = imageSourcePath(primitive, product);
        if (!sourcePath || !fs.existsSync(sourcePath)) break;
        const image = await embedImage(doc, sourcePath);
        if (!image) break;
        const frame = { x: primitive.x, y: primitive.y, w: primitive.w, h: primitive.h };
        const rect = fitRect(frame, image.width, image.height, primitive.fit);
        const clipToFrame = primitive.fit === "cover";
        if (clipToFrame) {
          const fx = frame.x;
          const fy = H - frame.y - frame.h;
          page.pushOperators(
            pdfLib.pushGraphicsState(),
            pdfLib.moveTo(fx, fy),
            pdfLib.lineTo(fx + frame.w, fy),
            pdfLib.lineTo(fx + frame.w, fy + frame.h),
            pdfLib.lineTo(fx, fy + frame.h),
            pdfLib.closePath(),
            pdfLib.clip(),
            pdfLib.endPath()
          );
        }
        page.drawImage(image, {
          x: rect.x,
          y: H - rect.y - rect.h,
          width: rect.w,
          height: rect.h,
          opacity: primitive.opacity
        });
        if (clipToFrame) page.pushOperators(pdfLib.popGraphicsState());
        break;
      }
    }
  }
}
async function embedImage(doc, sourcePath) {
  const bytes = fs.readFileSync(sourcePath);
  const ext = path.extname(sourcePath).toLowerCase();
  try {
    if (ext === ".jpg" || ext === ".jpeg") return await doc.embedJpg(bytes);
    return await doc.embedPng(bytes);
  } catch {
    try {
      return await doc.embedJpg(bytes);
    } catch {
      return null;
    }
  }
}
async function designToSVG(design, product) {
  const resolved = resolveDesign(design, product);
  const barcodeUris = /* @__PURE__ */ new Map();
  for (const primitive of resolved.primitives) {
    if (primitive.kind !== "barcode") continue;
    const key = barcodeKey(primitive);
    if (barcodeUris.has(key)) continue;
    const png = await renderDesignBarcode(primitive);
    if (png) barcodeUris.set(key, `data:image/png;base64,${png.toString("base64")}`);
  }
  const usedFontIds = /* @__PURE__ */ new Set();
  for (const primitive of resolved.primitives) {
    if (primitive.kind === "text") usedFontIds.add(primitive.fontId);
  }
  const fontCss = [...usedFontIds].map((id) => {
    const uri = fontDataUri(id);
    return uri ? `@font-face{font-family:"${svgFontFamily(id)}";src:url("${uri}");}` : "";
  }).join("");
  return paintSVG(resolved, {
    fontFamily: (id) => svgFontFamily(id),
    fontCss,
    imageHref: (image) => {
      const path2 = imageSourcePath(image, product);
      return path2 && fs.existsSync(path2) ? readImageAsBase64(path2) : null;
    },
    imageSize: (image) => {
      const path2 = imageSourcePath(image, product);
      if (!path2 || !fs.existsSync(path2)) return null;
      const size = electron.nativeImage.createFromPath(path2).getSize();
      return size.width && size.height ? { w: size.width, h: size.height } : null;
    },
    barcodeHref: (barcode) => barcodeUris.get(barcodeKey(barcode)) ?? null
  });
}
function barcodeKey(barcode) {
  return `${barcode.value}|${barcode.showText}|${barcode.color}`;
}
function svgFontFamily(fontId) {
  return `LabelFont-${fontId.replace(/[^a-z0-9_-]/gi, "-")}`;
}
function hexToRgb$1(hex) {
  const normalized = hex.replace("#", "");
  const value = normalized.length === 3 ? normalized.split("").map((char) => char + char).join("") : normalized;
  const intValue = Number.parseInt(value, 16);
  if (Number.isNaN(intValue)) return pdfLib.rgb(0, 0, 0);
  return pdfLib.rgb((intValue >> 16 & 255) / 255, (intValue >> 8 & 255) / 255, (intValue & 255) / 255);
}
function resolveLabelBackground(product, templateColor) {
  const candidate = product.labelBackgroundColor || getSettings().labelBackgroundColor;
  return /^#[0-9a-f]{6}$/i.test(candidate) ? candidate : templateColor;
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
const LORA_BYTES = readFontBytes(getLoraBoldFontPath()) ?? findFamilyFontBytes("lora", [
  "Lora-Bold.ttf",
  "Lora-SemiBold.ttf"
], "bold");
const GENTY_BYTES = readFontBytes(getGentyRegularFontPath()) ?? findFamilyFontBytes("genty", [
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
  const settings = getSettings();
  const selectedBytes = (id) => {
    const font = getFont(id);
    return font ? readFontBytes(font.path) : null;
  };
  const selectedTitle = selectedBytes(settings.titleFontId);
  const selectedPrice = selectedBytes(settings.priceFontId);
  const selectedBody = selectedBytes(settings.bodyFontId);
  const embedOr = async (bytes, fallback) => {
    if (!bytes) return fallback;
    try {
      return await pdfDoc.embedFont(bytes);
    } catch {
      return fallback;
    }
  };
  const standardBody = ARIAL_REGULAR_BYTES ? await pdfDoc.embedFont(ARIAL_REGULAR_BYTES) : await pdfDoc.embedFont(pdfLib.StandardFonts.Helvetica);
  const body = await embedOr(selectedBody, standardBody);
  const bodyBold = selectedBody ? body : ARIAL_BOLD_BYTES ? await pdfDoc.embedFont(ARIAL_BOLD_BYTES) : await pdfDoc.embedFont(pdfLib.StandardFonts.HelveticaBold);
  const bodyItalic = selectedBody ? body : ARIAL_ITALIC_BYTES ? await pdfDoc.embedFont(ARIAL_ITALIC_BYTES) : await pdfDoc.embedFont(pdfLib.StandardFonts.HelveticaOblique);
  const ingredients = body;
  const defaultName = LORA_BYTES ? await pdfDoc.embedFont(LORA_BYTES) : bodyBold;
  const defaultPrice = GENTY_BYTES ? await pdfDoc.embedFont(GENTY_BYTES) : body;
  const name = await embedOr(selectedTitle, defaultName);
  const price = await embedOr(selectedPrice, defaultPrice);
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
async function assessRenderedContentFit(product) {
  const design = isDesignTemplateId(product.templateId) ? getDesign(product.templateId) : null;
  if (design) {
    const knownFields = /* @__PURE__ */ new Set(["name", "price", "category", "ingredients", "allergenStatement", "servingInfo", "nutritionInfo", "cookingInstructions", "customerName"]);
    return assessDesignFit(design, product).map((issue) => ({
      field: knownFields.has(issue.field) ? issue.field : "templateId",
      label: issue.field,
      status: issue.status,
      message: issue.message
    }));
  }
  const template = getLabelTemplate(product.templateId);
  if (template.layout === "logo-only") return [];
  const doc = await pdfLib.PDFDocument.create();
  doc.registerFontkit(fontkit);
  const fonts = await embedFonts(doc);
  const issues = [];
  const clipped = (field, label, message) => {
    issues.push({ field, label, status: "clipped", message });
  };
  if (template.layout === "front" || product.templateId.startsWith("custom-")) {
    const name = product.name || "Product Name";
    const nameSize = name.length > 30 ? 15 : name.length > 18 ? 18 : 22;
    if (wrapText(name, fonts.name, nameSize, LABEL_ZONES.name.w).length > 3) clipped("name", "Product name", "Product name exceeds the three printable lines.");
    if (product.showPrice && fonts.price.widthOfTextAtSize(product.price || "$13.99", (product.price || "").length > 10 ? 22 : 28) > LABEL_ZONES.price.w) clipped("price", "Price", "Price exceeds the printable price area.");
    return issues;
  }
  if (template.layout === "vertical-info") {
    const name = product.name || "Product Title";
    const nameSize = name.length > 26 ? 17 : name.length > 16 ? 20 : 24;
    if (wrapText(name, fonts.name, nameSize, VERTICAL_INFO_LABEL_ZONES.title.w).length > 3) clipped("name", "Product name", "Product name exceeds the three printable lines.");
    if (product.customerName.trim()) {
      const order = `Order: ${product.customerName.trim()}`;
      const size = order.length > 34 ? 7 : 8;
      if (fonts.bodyBold.widthOfTextAtSize(order, size) > VERTICAL_INFO_LABEL_ZONES.customerName.w) clipped("customerName", "Customer name", "Customer name exceeds the printable order line.");
    }
    if (product.showCookingInstructions !== false && wrapText(product.cookingInstructions || "Add cooking instructions", fonts.ingredients, 8, VERTICAL_INFO_LABEL_ZONES.cookingBody.w).length > 4) clipped("cookingInstructions", "Cooking instructions", "Cooking instructions exceed the four printable lines.");
    return issues;
  }
  const nameLines = wrapText(product.name || "Product Name", fonts.name, 12, INFO_LABEL_ZONES.leftName.w);
  if (nameLines.length > 2) clipped("name", "Product name", "Product name exceeds the two printable lines.");
  let y = INFO_LABEL_ZONES.infoText.y + INFO_LABEL_ZONES.infoText.h - 6;
  const bottomY = INFO_LABEL_ZONES.infoText.y;
  const sections = [
    { field: "nutritionInfo", label: "Serving and nutrition", body: joinInfo(product.servingInfo, product.nutritionInfo) },
    { field: "cookingInstructions", label: "Cooking instructions", body: product.showCookingInstructions ? product.cookingInstructions : "" },
    { field: "ingredients", label: "Ingredients", body: product.ingredients }
  ];
  for (const section of sections) {
    if (!section.body) continue;
    if (y <= bottomY + 7.2) {
      clipped(section.field, section.label, `${section.label} falls outside the printable information panel.`);
      break;
    }
    y -= 7.2 * 1.45;
    const lines = wrapText(section.body, fonts.ingredients, 8, INFO_LABEL_ZONES.infoText.w);
    let printed = 0;
    for (const _line of lines) {
      if (y <= bottomY + 8) break;
      y -= 8 * 1.2;
      printed += 1;
    }
    if (printed < lines.length) {
      clipped(section.field, section.label, `${section.label} is clipped in the printable information panel.`);
      break;
    }
    y -= 8 * 0.5;
  }
  if (!issues.length && product.allergenStatement) {
    const lines = wrapText(product.allergenStatement, fonts.ingredients, 8, INFO_LABEL_ZONES.infoText.w);
    const available = Math.max(0, Math.floor((y - bottomY - 8) / (8 * 1.2)) + 1);
    if (lines.length > available) clipped("allergenStatement", "Allergen statement", "Allergen statement is clipped in the printable information panel.");
  }
  return issues;
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
async function drawLabel(page, product, topImage, barcodeImage, customBackground, fonts) {
  const template = getLabelTemplate(product.templateId);
  const shell = hexToRgb(resolveLabelBackground(product, template.shellColor));
  const border = hexToRgb(template.borderColor);
  const panel = hexToRgb(template.panelColor);
  const text = hexToRgb(template.textColor);
  const borderWidth = template.layout === "info" || template.layout === "logo-only" ? 0 : 1;
  if (customBackground) {
    page.drawImage(customBackground, {
      x: 0,
      y: 0,
      width: page.getWidth(),
      height: page.getHeight()
    });
    drawCustomTemplateFields(page, product, barcodeImage, fonts, text);
    return;
  }
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
function drawCustomTemplateFields(page, product, barcodeImage, fonts, text) {
  if (product.showProductName !== false) {
    const name = product.name || "Product Name";
    const nameSize = name.length > 30 ? 15 : name.length > 18 ? 18 : 22;
    const nameLines = wrapText(name, fonts.name, nameSize, LABEL_ZONES.name.w);
    const startY = LABEL_ZONES.name.y + LABEL_ZONES.name.h - nameSize;
    nameLines.slice(0, 3).forEach((line, index) => {
      drawCenteredText(page, line, LABEL_ZONES.name.x + LABEL_ZONES.name.w / 2, startY - index * nameSize * 1.08, nameSize, fonts.name, text);
    });
  }
  if (product.showPrice) {
    const price = product.price || "$13.99";
    drawCenteredText(page, price, LABEL_ZONES.price.x + LABEL_ZONES.price.w / 2, LABEL_ZONES.price.y, price.length > 10 ? 22 : 28, fonts.price, text);
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
  const customerName = product.customerName.trim();
  if (customerName) {
    const orderText = `Order: ${customerName}`;
    const orderSize = orderText.length > 34 ? 7 : 8;
    drawCenteredText(
      page,
      orderText,
      VERTICAL_INFO_LABEL_ZONES.customerName.x + VERTICAL_INFO_LABEL_ZONES.customerName.w / 2,
      VERTICAL_INFO_LABEL_ZONES.customerName.y + 2,
      orderSize,
      fonts.bodyBold,
      text
    );
  }
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
  const design = isDesignTemplateId(product.templateId) ? getDesign(product.templateId) : null;
  if (design) {
    const designPage = doc.addPage([design.canvas.width, design.canvas.height]);
    await drawDesignLabel(doc, designPage, design, product);
    return doc.save();
  }
  const fonts = await embedFonts(doc);
  const topImage = topImageBytes ? await embedImageAsset(doc, topImageBytes, product.logoImagePath ?? getDefaultTopLogoPath()) : null;
  const barcodeImage = barcodeBytes ? await embedImageAsset(doc, barcodeBytes, product.barcodeImagePath) : null;
  const customPreviewPath = isCustomTemplate(product.templateId) ? getTemplatePNGPath(product.templateId) : null;
  const customBackground = customPreviewPath && fs.existsSync(customPreviewPath) ? await embedImageAsset(doc, fs.readFileSync(customPreviewPath), customPreviewPath) : null;
  const customSize = customBackground ? getCustomTemplateSize(product.templateId) : null;
  const page = doc.addPage([customSize?.width ?? template.width, customSize?.height ?? template.height]);
  await drawLabel(page, product, topImage, barcodeImage, customBackground, fonts);
  return doc.save();
}
async function buildRollLabelPDF(product, widthIn, heightIn) {
  const topImageBytes = getTopImageBytes(product);
  const barcodeBytes = await getBarcodePNG(product);
  const labelBytes = await buildLabelPDF(product, topImageBytes, barcodeBytes);
  const pageW = widthIn * 72;
  const pageH = heightIn * 72;
  const doc = await pdfLib.PDFDocument.create();
  const [label] = await doc.embedPdf(labelBytes);
  const rotate = label.width >= label.height !== pageW >= pageH;
  const effW = rotate ? label.height : label.width;
  const effH = rotate ? label.width : label.height;
  const scale = Math.min(pageW / effW, pageH / effH);
  const drawW = label.width * scale;
  const drawH = label.height * scale;
  const page = doc.addPage([pageW, pageH]);
  if (rotate) {
    page.drawPage(label, {
      x: (pageW + drawH) / 2,
      y: (pageH - drawW) / 2,
      xScale: scale,
      yScale: scale,
      rotate: pdfLib.degrees(90)
    });
  } else {
    page.drawPage(label, {
      x: (pageW - drawW) / 2,
      y: (pageH - drawH) / 2,
      xScale: scale,
      yScale: scale
    });
  }
  return doc.save();
}
async function exportSingleLabelPDF(product, outputPath) {
  const topImageBytes = getTopImageBytes(product);
  const barcodeBytes = await getBarcodePNG(product);
  const bytes = await buildLabelPDF(product, topImageBytes, barcodeBytes);
  fs.writeFileSync(outputPath, bytes);
  return outputPath;
}
async function buildSheetPDF(slots) {
  const barcodeCache = /* @__PURE__ */ new Map();
  const imageCache = /* @__PURE__ */ new Map();
  const settings = getSettings();
  const sheetLayout = getSheetLayoutPoints(
    toInches(settings.sheetOffsetXIn),
    toInches(settings.sheetOffsetYIn)
  );
  for (const product of slots) {
    if (!product) continue;
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
    const product = slots[slot - 1];
    if (!product) continue;
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
    if (embeddedLabel.width >= embeddedLabel.height) {
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
async function buildCalibrationSheetPDF() {
  const settings = getSettings();
  const layout = getSheetLayoutPoints(toInches(settings.sheetOffsetXIn), toInches(settings.sheetOffsetYIn));
  const doc = await pdfLib.PDFDocument.create();
  const page = doc.addPage([layout.pageW, layout.pageH]);
  const font = await doc.embedFont(pdfLib.StandardFonts.Helvetica);
  const bold = await doc.embedFont(pdfLib.StandardFonts.HelveticaBold);
  page.drawText("Tillie Print · PLS780 alignment test", { x: 18, y: layout.pageH - 22, size: 10, font: bold, color: pdfLib.rgb(0.1, 0.14, 0.2) });
  page.drawText("Print at 100% / Actual Size. Measure each outline against the physical label edge.", { x: 18, y: 8, size: 7, font, color: pdfLib.rgb(0.25, 0.3, 0.36) });
  for (let slot = 1; slot <= layout.cols * layout.rows; slot++) {
    const col = (slot - 1) % layout.cols;
    const row = Math.floor((slot - 1) / layout.cols);
    const x = layout.marginLeft + layout.offsetX + col * (layout.slotW + layout.gapX);
    const y = layout.pageH - layout.marginTop - layout.offsetY - (row + 1) * layout.slotH - row * layout.gapY;
    page.drawRectangle({ x, y, width: layout.slotW, height: layout.slotH, borderWidth: 0.75, borderColor: pdfLib.rgb(0.1, 0.14, 0.2) });
    page.drawLine({ start: { x: x - 5, y }, end: { x: x + 5, y }, thickness: 0.5, color: pdfLib.rgb(0.15, 0.45, 0.2) });
    page.drawLine({ start: { x, y: y - 5 }, end: { x, y: y + 5 }, thickness: 0.5, color: pdfLib.rgb(0.15, 0.45, 0.2) });
    page.drawText(String(slot), { x: x + 8, y: y + layout.slotH - 18, size: 12, font: bold, color: pdfLib.rgb(0.1, 0.14, 0.2) });
    page.drawText("TOP LEFT", { x: x + 8, y: y + layout.slotH - 29, size: 5, font, color: pdfLib.rgb(0.3, 0.35, 0.4) });
  }
  return doc.save();
}
async function exportSheetPDF(slots, outputPath) {
  const bytes = await buildSheetPDF(slots);
  fs.writeFileSync(outputPath, bytes);
  return outputPath;
}
async function exportSingleLabelSVG(product) {
  const design = isDesignTemplateId(product.templateId) ? getDesign(product.templateId) : null;
  if (design) return designToSVG(design, product);
  const template = getLabelTemplate(product.templateId);
  const topImageUri = product.logoImagePath ? readImageAsBase64(product.logoImagePath) : readImageAsBase64(getDefaultTopLogoPath());
  const avenirFontUri = readFontDataUri(getAvenirNextCondensedFontPath());
  const customBackgroundUri = isCustomTemplate(product.templateId) ? readImageAsBase64(getTemplatePNGPath(product.templateId)) : "";
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
    return buildLogoOnlySvg(template, topImageUri, resolveLabelBackground(product, template.shellColor));
  }
  return buildFrontSvg(product, template, topImageUri, barcodeUri, customBackgroundUri);
}
function buildFrontSvg(product, template, topImageUri, barcodeUri, customBackgroundUri = "") {
  const labelBackground = resolveLabelBackground(product, template.shellColor);
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
  ${customBackgroundUri ? `<image x="0" y="0" width="${template.width}" height="${template.height}" xlink:href="${customBackgroundUri}" preserveAspectRatio="xMidYMid slice"/>` : `<rect x="0.5" y="0.5" width="${template.width - 1}" height="${template.height - 1}" rx="12" fill="${labelBackground}" stroke="${template.borderColor}" stroke-width="1"/>
  <image x="${LABEL_ZONES.topImage.x}" y="${imageY}" width="${LABEL_ZONES.topImage.w}" height="${LABEL_ZONES.topImage.h}" xlink:href="${topImageUri}" preserveAspectRatio="xMidYMid meet"/>
  <rect x="${LABEL_ZONES.contentPanel.x}" y="${contentY}" width="${LABEL_ZONES.contentPanel.w}" height="${LABEL_ZONES.contentPanel.h}" rx="10" fill="${template.panelColor}"/>`}
  ${nameEls}
  ${product.showPrice ? `<text x="${LABEL_ZONES.price.x + LABEL_ZONES.price.w / 2}" y="${priceY}" text-anchor="middle" font-family="'Genty Demo',Georgia,serif" font-size="${price.length > 10 ? 22 : 28}" fill="${template.textColor}">${xml(price)}</text>` : ""}
  ${product.showBarcode && barcodeUri ? `<image x="${LABEL_ZONES.barcode.x}" y="${barcodeY}" width="${LABEL_ZONES.barcode.w}" height="${LABEL_ZONES.barcode.h}" xlink:href="${barcodeUri}"/>` : ""}
</svg>`;
}
function buildInfoSvg(product, template, topImageUri, barcodeUri, avenirFontUri) {
  const labelBackground = resolveLabelBackground(product, template.shellColor);
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
  <rect x="0" y="0" width="${template.width}" height="${template.height}" rx="12" fill="${labelBackground}" stroke="none"/>
  <image x="${INFO_LABEL_ZONES.topImage.x}" y="${imageY}" width="${INFO_LABEL_ZONES.topImage.w}" height="${INFO_LABEL_ZONES.topImage.h}" xlink:href="${topImageUri}" preserveAspectRatio="xMidYMid meet"/>
  <rect x="${INFO_LABEL_ZONES.infoPanel.x}" y="${panelY}" width="${INFO_LABEL_ZONES.infoPanel.w}" height="${INFO_LABEL_ZONES.infoPanel.h}" rx="10" fill="${template.infoPanelColor ?? "#ffffff"}"/>
  ${nameEls}
  ${product.showPrice ? `<text x="${INFO_LABEL_ZONES.leftPrice.x + INFO_LABEL_ZONES.leftPrice.w / 2}" y="${priceY}" text-anchor="middle" font-family="'Genty Demo',Georgia,serif" font-size="12" fill="${template.textColor}">${xml(price)}</text>` : ""}
  ${infoBlock}
  ${product.showBarcode && barcodeUri ? `<image x="${INFO_LABEL_ZONES.barcode.x}" y="${barcodeY}" width="${INFO_LABEL_ZONES.barcode.w}" height="${INFO_LABEL_ZONES.barcode.h}" xlink:href="${barcodeUri}"/>` : ""}
</svg>`;
}
function buildVerticalInfoSvg(product, template, topImageUri, avenirFontUri) {
  const labelBackground = resolveLabelBackground(product, template.shellColor);
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
  const customerName = product.customerName.trim();
  const orderText = customerName ? `Order: ${customerName}` : "";
  const orderSize = orderText.length > 34 ? 7 : 8;
  const orderY = svgYFromBottom(VERTICAL_INFO_LABEL_ZONES.customerName.y + 2, 0, template.height);
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
  <rect x="0.5" y="0.5" width="${template.width - 1}" height="${template.height - 1}" rx="12" fill="${labelBackground}" stroke="${template.borderColor}" stroke-width="1"/>
  <image x="${VERTICAL_INFO_LABEL_ZONES.topImage.x}" y="${imageY}" width="${VERTICAL_INFO_LABEL_ZONES.topImage.w}" height="${VERTICAL_INFO_LABEL_ZONES.topImage.h}" xlink:href="${topImageUri}" preserveAspectRatio="xMidYMid meet"/>
  <rect x="${VERTICAL_INFO_LABEL_ZONES.contentPanel.x}" y="${panelY}" width="${VERTICAL_INFO_LABEL_ZONES.contentPanel.w}" height="${VERTICAL_INFO_LABEL_ZONES.contentPanel.h}" rx="10" fill="${template.panelColor}"/>
  ${nameEls}
  ${product.showCookingInstructions === false ? "" : `<text x="${VERTICAL_INFO_LABEL_ZONES.cookingTitle.x + VERTICAL_INFO_LABEL_ZONES.cookingTitle.w / 2}" y="${headingY}" text-anchor="middle" font-family="'Helvetica Neue',Arial,sans-serif" font-weight="700" font-size="10" fill="${template.textColor}">Cooking Instructions</text>`}
  ${cookingEls}
  ${orderText ? `<text x="${VERTICAL_INFO_LABEL_ZONES.customerName.x + VERTICAL_INFO_LABEL_ZONES.customerName.w / 2}" y="${orderY}" text-anchor="middle" font-family="'Helvetica Neue',Arial,sans-serif" font-weight="700" font-size="${orderSize}" fill="${template.textColor}">${xml(orderText)}</text>` : ""}
</svg>`;
}
function buildLogoOnlySvg(template, topImageUri, labelBackground = template.shellColor) {
  const imageY = svgYFromBottom(LOGO_ONLY_LABEL_ZONES.topImage.y, LOGO_ONLY_LABEL_ZONES.topImage.h, template.height);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     viewBox="0 0 ${template.width} ${template.height}" width="${template.width}pt" height="${template.height}pt" version="1.1">
  <rect x="0" y="0" width="${template.width}" height="${template.height}" fill="${labelBackground}"/>
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
function formatOutputEligibilityIssues(issues, action) {
  if (!issues.length) return null;
  const shown = issues.slice(0, 3).map((issue) => {
    const location = issue.slot ? `slot ${issue.slot}, ${issue.productName}` : issue.productName;
    return `${location}: ${issue.label.toLowerCase()}`;
  });
  const remainder = issues.length > shown.length ? ` and ${issues.length - shown.length} more` : "";
  return `${action} is blocked because printable content will be clipped (${shown.join("; ")}${remainder}). Shorten the flagged content or choose another label template.`;
}
const TOKEN_TTL_MS = 11.5 * 60 * 60 * 1e3;
const FETCH_TIMEOUT_MS = 6e3;
const DEFAULTS = {
  baseUrl: "http://127.0.0.1:3000",
  mongoUri: "",
  mongoDb: "pos",
  subscribedCategories: [],
  includedProductIds: [],
  excludedProductIds: [],
  autoSyncOnLaunch: true,
  lastSyncAt: null,
  connectedUserName: null,
  token: null,
  tokenExpiresAt: null
};
let _config = null;
function configPath() {
  return path.join(electron.app.getPath("userData"), "tillie.json");
}
function loadConfig() {
  if (_config) return _config;
  if (fs.existsSync(configPath())) {
    try {
      _config = { ...DEFAULTS, ...JSON.parse(fs.readFileSync(configPath(), "utf8")) };
    } catch {
      _config = { ...DEFAULTS };
    }
  } else {
    _config = { ...DEFAULTS };
  }
  return _config;
}
function saveConfig() {
  fs.writeFileSync(configPath(), JSON.stringify(_config, null, 2), "utf8");
}
function publicConfig() {
  const { token: _t, tokenExpiresAt: _e, ...rest } = loadConfig();
  return rest;
}
function getTillieConfig() {
  return publicConfig();
}
function setTillieConfig(patch) {
  const cfg = loadConfig();
  const allowed = [
    "baseUrl",
    "mongoUri",
    "mongoDb",
    "subscribedCategories",
    "includedProductIds",
    "excludedProductIds",
    "autoSyncOnLaunch"
  ];
  for (const key of allowed) {
    if (key in patch) cfg[key] = patch[key];
  }
  cfg.baseUrl = cfg.baseUrl.trim().replace(/\/+$/, "") || DEFAULTS.baseUrl;
  cfg.mongoUri = cfg.mongoUri.trim();
  cfg.mongoDb = cfg.mongoDb.trim() || DEFAULTS.mongoDb;
  saveConfig();
  return publicConfig();
}
function excludeTillieProduct(tillieProductId) {
  const cfg = loadConfig();
  if (!cfg.excludedProductIds.includes(tillieProductId)) {
    cfg.excludedProductIds.push(tillieProductId);
  }
  cfg.includedProductIds = cfg.includedProductIds.filter((id) => id !== tillieProductId);
  saveConfig();
}
async function fetchTillie(path2, init = {}, auth = false) {
  const cfg = loadConfig();
  if (auth) {
    if (!cfg.token || !cfg.tokenExpiresAt || Date.now() > cfg.tokenExpiresAt) {
      throw new Error("Not connected to Tillie. Enter your Tillie PIN in Settings to connect.");
    }
    init.headers = { ...init.headers, Authorization: `Bearer ${cfg.token}` };
  }
  if (init.body) {
    init.headers = { "Content-Type": "application/json", ...init.headers };
  }
  let res;
  try {
    res = await fetch(`${cfg.baseUrl}${path2}`, {
      ...init,
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
    });
  } catch {
    throw new Error(`Tillie isn't reachable at ${cfg.baseUrl}. Is the register app running?`);
  }
  if (res.status === 401 || res.status === 403) {
    cfg.token = null;
    cfg.tokenExpiresAt = null;
    cfg.connectedUserName = null;
    saveConfig();
    throw new Error("Tillie session expired. Reconnect with your PIN in Settings.");
  }
  let body;
  try {
    body = await res.json();
  } catch {
    throw new Error(`Tillie returned an unexpected response (HTTP ${res.status}).`);
  }
  if (!res.ok || body.success === false) {
    throw new Error(body.error || body.message || `Tillie request failed (HTTP ${res.status}).`);
  }
  return body.data ?? body;
}
let _mongo = null;
let _mongoKey = "";
function usesDb() {
  return Boolean(loadConfig().mongoUri);
}
async function tillieDb() {
  const cfg = loadConfig();
  const key = `${cfg.mongoUri}|${cfg.mongoDb}`;
  if (_mongo && _mongoKey !== key) {
    await _mongo.close().catch(() => {
    });
    _mongo = null;
  }
  if (!_mongo) {
    try {
      const client = new mongodb.MongoClient(cfg.mongoUri, { serverSelectionTimeoutMS: 8e3 });
      await client.connect();
      _mongo = client;
      _mongoKey = key;
    } catch {
      throw new Error(
        "Couldn't connect to Tillie's database. Check the connection string, this computer's internet connection, and that its IP is allowed under Network Access in MongoDB Atlas."
      );
    }
    try {
      const listing = await _mongo.db().admin().listDatabases({ nameOnly: true });
      const names = listing.databases.map((d) => d.name).filter((n2) => !["admin", "local", "config"].includes(n2));
      const configured = cfg.mongoDb || "pos";
      if (!names.includes(configured) && names.length === 1) {
        cfg.mongoDb = names[0];
        saveConfig();
      }
    } catch {
    }
  }
  return _mongo.db(loadConfig().mongoDb || "pos");
}
function toApp(doc) {
  const { _id, ...rest } = doc;
  return { id: String(_id), ...rest };
}
async function tillieLogin(pin) {
  const cfg = loadConfig();
  let res;
  try {
    res = await fetch(`${cfg.baseUrl}/api/auth/pin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
    });
  } catch {
    throw new Error(`Tillie isn't reachable at ${cfg.baseUrl}. Is the register app running?`);
  }
  const body = await res.json().catch(() => null);
  if (!body || !body.success) {
    throw new Error(body?.error || "Tillie login failed.");
  }
  if (!body.token) {
    cfg.token = null;
    cfg.tokenExpiresAt = null;
  } else {
    cfg.token = body.token;
    cfg.tokenExpiresAt = Date.now() + TOKEN_TTL_MS;
  }
  cfg.connectedUserName = body.user?.name || "Tillie user";
  saveConfig();
  return publicConfig();
}
function tillieDisconnect() {
  const cfg = loadConfig();
  cfg.token = null;
  cfg.tokenExpiresAt = null;
  cfg.connectedUserName = null;
  saveConfig();
  return publicConfig();
}
async function tillieCategories() {
  let cats;
  if (usesDb()) {
    const db = await tillieDb();
    const docs = await db.collection("categories").find({}).toArray();
    cats = docs.map((d) => toApp(d));
  } else {
    cats = await fetchTillie("/api/categories");
  }
  return [...cats].sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
}
async function tillieProducts() {
  if (usesDb()) {
    const db = await tillieDb();
    const docs = await db.collection("products").find({}).toArray();
    return docs.map((d) => toApp(d));
  }
  const cfg = loadConfig();
  const needsAuth = Boolean(cfg.token);
  return fetchTillie("/api/products", {}, needsAuth);
}
async function createTillieProduct(doc) {
  if (usesDb()) {
    const db = await tillieDb();
    const result = await db.collection("products").insertOne({ ...doc });
    return String(result.insertedId);
  }
  const cfg = loadConfig();
  const created = await fetchTillie(
    "/api/products",
    { method: "POST", body: JSON.stringify(doc) },
    Boolean(cfg.token)
  );
  return created.id;
}
function formatPrice(price) {
  const prefix = getSettings().pricePrefix;
  return `${prefix}${price.toFixed(2)}`;
}
function parsePrice(price) {
  const match = price.match(/\d+(?:\.\d+)?/);
  if (!match) return null;
  const n2 = Number.parseFloat(match[0]);
  return Number.isFinite(n2) ? n2 : null;
}
function generateBarcode$1() {
  const num2 = Math.floor(Math.random() * 9e11) + 1e11;
  return String(num2);
}
function categoryName(p, scope) {
  return scope.categoryNameById.get(p.category) ?? p.category ?? "";
}
function buildScope(categories) {
  const cfg = loadConfig();
  const byId = new Map(categories.map((c) => [c.id, c]));
  let renamed = false;
  cfg.subscribedCategories = cfg.subscribedCategories.map((sub) => {
    const current = byId.get(sub.id);
    if (current && current.name !== sub.name) {
      renamed = true;
      return { id: sub.id, name: current.name };
    }
    return sub;
  });
  if (renamed) saveConfig();
  const locals = listProducts();
  const linkedByTillieId = /* @__PURE__ */ new Map();
  const localByBarcode = /* @__PURE__ */ new Map();
  for (const p of locals) {
    if (p.tillieProductId) linkedByTillieId.set(p.tillieProductId, p);
    if (p.barcodeValue && !localByBarcode.has(p.barcodeValue)) {
      localByBarcode.set(p.barcodeValue, p);
    }
  }
  return {
    subscribedKeys: new Set(
      cfg.subscribedCategories.flatMap((c) => [c.id, c.name])
    ),
    categoryNameById: new Map(categories.map((c) => [c.id, c.name])),
    included: new Set(cfg.includedProductIds),
    excluded: new Set(cfg.excludedProductIds),
    linkedByTillieId,
    localByBarcode
  };
}
function isInScope(p, scope) {
  if (p.isActive === false) return false;
  if (scope.excluded.has(p.id)) return false;
  return scope.subscribedKeys.has(p.category) || scope.included.has(p.id) || scope.linkedByTillieId.has(p.id);
}
async function tillieListProducts() {
  const [categories, remote] = await Promise.all([tillieCategories(), tillieProducts()]);
  const scope = buildScope(categories);
  return remote.filter((p) => p.isActive !== false).map((p) => ({
    id: p.id,
    name: p.name,
    price: Number(p.price) || 0,
    barcode: p.barcode || p.sku || "",
    category: categoryName(p, scope),
    linked: scope.linkedByTillieId.has(p.id),
    inScope: isInScope(p, scope)
  })).sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
}
async function tillieSync() {
  const [categories, remote] = await Promise.all([tillieCategories(), tillieProducts()]);
  const scope = buildScope(categories);
  const cfg = loadConfig();
  const settings = getSettings();
  const summary = {
    created: 0,
    updated: 0,
    unchanged: 0,
    pushed: 0,
    pushSkipped: [],
    duplicateBarcodes: []
  };
  const seenBarcodes = /* @__PURE__ */ new Set();
  for (const p of remote) {
    if (!isInScope(p, scope)) continue;
    if (p.barcode) {
      if (seenBarcodes.has(p.barcode)) {
        if (!summary.duplicateBarcodes.includes(p.barcode)) {
          summary.duplicateBarcodes.push(p.barcode);
        }
        continue;
      }
      seenBarcodes.add(p.barcode);
    }
    const price = formatPrice(Number(p.price) || 0);
    const barcode = p.barcode || p.sku || "";
    const catName = categoryName(p, scope);
    const local = scope.linkedByTillieId.get(p.id) ?? (barcode ? scope.localByBarcode.get(barcode) : void 0);
    if (local) {
      const needsLink = local.tillieProductId !== p.id;
      const changed = needsLink || local.name !== p.name || local.price !== price || local.category !== catName;
      if (!changed) {
        summary.unchanged++;
        continue;
      }
      updateProduct({
        ...local,
        name: p.name,
        price,
        category: catName,
        tillieProductId: p.id,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      });
      summary.updated++;
    } else {
      const now = (/* @__PURE__ */ new Date()).toISOString();
      createProduct({
        id: nanoid.nanoid(),
        name: p.name,
        price,
        category: catName,
        servingInfo: "",
        nutritionInfo: "",
        cookingInstructions: "",
        customerName: "",
        labelBackgroundColor: "",
        ingredients: "",
        allergenStatement: "",
        barcodeValue: barcode || generateBarcode$1(),
        barcodeImagePath: null,
        logoImagePath: null,
        templateId: settings.templateId,
        showPrice: true,
        showBarcode: true,
        showCookingInstructions: true,
        tillieProductId: p.id,
        createdAt: now,
        updatedAt: now
      });
      summary.created++;
    }
  }
  const remoteByBarcode = /* @__PURE__ */ new Map();
  for (const p of remote) {
    if (p.isActive === false) continue;
    const code = p.barcode || p.sku;
    if (code && !remoteByBarcode.has(code)) remoteByBarcode.set(code, p);
  }
  const categoryIdByName = new Map(categories.map((c) => [c.name, c.id]));
  for (const local of listProducts()) {
    if (local.tillieProductId) continue;
    if (!local.name.trim()) continue;
    const existing = local.barcodeValue ? remoteByBarcode.get(local.barcodeValue) : void 0;
    if (existing) {
      updateProduct({
        ...local,
        name: existing.name,
        price: formatPrice(Number(existing.price) || 0),
        category: categoryName(existing, scope),
        tillieProductId: existing.id,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      });
      summary.updated++;
      continue;
    }
    const price = parsePrice(local.price);
    if (price === null) {
      summary.pushSkipped.push(local.name);
      continue;
    }
    const createdId = await createTillieProduct({
      name: local.name,
      price,
      category: categoryIdByName.get(local.category) ?? local.category,
      barcode: local.barcodeValue,
      sku: local.barcodeValue,
      imageUrl: "",
      taxable: false,
      isActive: true,
      sortOrder: 0,
      stock: 0,
      allowAddWhenOutOfStock: true,
      lastModified: (/* @__PURE__ */ new Date()).toISOString()
    });
    updateProduct({ ...local, tillieProductId: createdId, updatedAt: (/* @__PURE__ */ new Date()).toISOString() });
    summary.pushed++;
  }
  cfg.lastSyncAt = (/* @__PURE__ */ new Date()).toISOString();
  saveConfig();
  return summary;
}
function ok(data) {
  return { ok: true, data };
}
function fail(error) {
  return { ok: false, error };
}
async function renderedEligibilityError(entries, action) {
  return formatOutputEligibilityIssues(await renderedEligibilityIssues(entries), action);
}
async function renderedEligibilityIssues(entries) {
  const issues = [];
  for (const { product, slot } of entries) {
    const fitIssues = await assessRenderedContentFit(product);
    issues.push(...fitIssues.filter((issue) => issue.status === "clipped").map((issue) => ({
      ...issue,
      productId: product.id,
      productName: product.name || (slot ? `Slot ${slot}` : "Untitled label"),
      slot
    })));
  }
  return issues;
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
      const product = getProduct(id);
      if (product?.tillieProductId) excludeTillieProduct(product.tillieProductId);
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
        tillieProductId: null,
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
          customerName: "",
          labelBackgroundColor: "",
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
          showProductName: true,
          tillieProductId: null,
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
  electron.ipcMain.handle("settings:setMany", (_e, patch) => {
    try {
      setSettings(patch);
      return ok(true);
    } catch (e) {
      return fail(String(e));
    }
  });
  electron.ipcMain.handle("font:list", () => {
    try {
      return ok(listFonts().map(({ id, family, source }) => ({ id, family, source, dataUri: fontDataUri(id) })));
    } catch (e) {
      return fail(String(e));
    }
  });
  async function chooseFont(source) {
    try {
      const result = await electron.dialog.showOpenDialog({
        title: source === "local" ? "Choose a Font Installed on This Computer" : "Upload a Font File",
        defaultPath: source === "local" && process.platform === "darwin" ? path.join(electron.app.getPath("home"), "Library", "Fonts") : void 0,
        filters: [{ name: "Fonts", extensions: ["ttf", "otf", "woff", "woff2"] }],
        properties: ["openFile"]
      });
      if (result.canceled || !result.filePaths.length) return ok(null);
      const font = importFont(result.filePaths[0], source);
      return ok({ ...font, path: void 0, dataUri: fontDataUri(font.id) });
    } catch (e) {
      return fail(String(e));
    }
  }
  electron.ipcMain.handle("font:importLocal", () => chooseFont("local"));
  electron.ipcMain.handle("font:upload", () => chooseFont("upload"));
  electron.ipcMain.handle("font:addGoogle", async (_e, family) => {
    try {
      const font = await addGoogleFont(family);
      return ok({ ...font, path: void 0, dataUri: fontDataUri(font.id) });
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
  electron.ipcMain.handle("file:deleteManagedImage", (_e, filePath) => {
    try {
      return ok(deleteManagedImage(filePath));
    } catch (e) {
      return fail(e instanceof Error ? e.message : String(e));
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
      return ok([
        ...listTemplates(),
        ...listDesigns().map(({ id, name }) => ({ id, name }))
      ]);
    } catch (e) {
      return fail(String(e));
    }
  });
  electron.ipcMain.handle("design:list", () => {
    try {
      return ok(listDesigns());
    } catch (e) {
      return fail(String(e));
    }
  });
  electron.ipcMain.handle("design:get", (_e, id) => {
    try {
      const design = getDesign(id);
      return design ? ok(design) : fail("Design not found");
    } catch (e) {
      return fail(String(e));
    }
  });
  electron.ipcMain.handle("design:save", (_e, design) => {
    try {
      return ok(saveDesign(design));
    } catch (e) {
      return fail(e instanceof Error ? e.message : String(e));
    }
  });
  electron.ipcMain.handle("design:delete", (_e, id) => {
    try {
      deleteDesign(id);
      return ok(true);
    } catch (e) {
      return fail(String(e));
    }
  });
  electron.ipcMain.handle("design:duplicate", (_e, id) => {
    try {
      const copy = duplicateDesign(id);
      return copy ? ok(copy) : fail("Design not found");
    } catch (e) {
      return fail(String(e));
    }
  });
  electron.ipcMain.handle("design:importImage", async () => {
    try {
      const result = await electron.dialog.showOpenDialog({
        title: "Choose an Image for the Design",
        filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg"] }],
        properties: ["openFile"]
      });
      if (result.canceled || !result.filePaths.length) return ok(null);
      const assetName = importDesignAsset(result.filePaths[0]);
      return ok({ assetName, dataUri: designAssetDataUri(assetName) });
    } catch (e) {
      return fail(e instanceof Error ? e.message : String(e));
    }
  });
  electron.ipcMain.handle("design:export", async (_e, design) => {
    try {
      const name = design?.name || "design";
      const fileName = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "design";
      const result = await electron.dialog.showSaveDialog({
        title: "Export Design",
        defaultPath: `${fileName}.tilliedesign`,
        filters: [{ name: "Tillie Print Design", extensions: ["tilliedesign"] }]
      });
      if (result.canceled || !result.filePath) return ok(null);
      exportDesignToFile(design, result.filePath);
      return ok(result.filePath);
    } catch (e) {
      return fail(e instanceof Error ? e.message : String(e));
    }
  });
  electron.ipcMain.handle("design:import", async () => {
    try {
      const result = await electron.dialog.showOpenDialog({
        title: "Import Design",
        filters: [{ name: "Tillie Print Design", extensions: ["tilliedesign", "json"] }],
        properties: ["openFile"]
      });
      if (result.canceled || !result.filePaths.length) return ok(null);
      return ok(importDesignFromFile(result.filePaths[0]));
    } catch (e) {
      return fail(e instanceof Error ? e.message : String(e));
    }
  });
  electron.ipcMain.handle("design:assetDataUri", (_e, assetName) => {
    try {
      return ok(designAssetDataUri(assetName));
    } catch (e) {
      return fail(String(e));
    }
  });
  electron.ipcMain.handle("design:pickSlotImage", async (_e, productId, elementId) => {
    try {
      const result = await electron.dialog.showOpenDialog({
        title: "Choose an Image for This Label",
        filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg"] }],
        properties: ["openFile"]
      });
      if (result.canceled || !result.filePaths.length) return ok(null);
      const storedPath = saveDesignSlotImage(result.filePaths[0], productId, elementId);
      return ok(storedPath);
    } catch (e) {
      return fail(e instanceof Error ? e.message : String(e));
    }
  });
  electron.ipcMain.handle("file:pickTemplateImage", async () => {
    try {
      const result = await electron.dialog.showOpenDialog({
        title: "Import Label Design",
        filters: [{ name: "Label Designs", extensions: ["pdf", "svg", "png", "jpg", "jpeg", "webp"] }],
        properties: ["openFile"]
      });
      if (result.canceled || !result.filePaths.length) return ok(null);
      return ok(result.filePaths[0]);
    } catch (e) {
      return fail(String(e));
    }
  });
  electron.ipcMain.handle("file:saveTemplateImage", async (_e, sourcePath) => {
    try {
      return ok(await saveTemplateImage(sourcePath));
    } catch (e) {
      return fail(String(e));
    }
  });
  electron.ipcMain.handle("file:deleteTemplate", (_e, templateId) => {
    try {
      if (templateId.startsWith("design-")) {
        deleteDesign(templateId);
        return ok(true);
      }
      if (isCustomTemplate(templateId)) {
        deleteCustomTemplate(templateId);
        return ok(true);
      }
      return fail("Built-in templates cannot be deleted.");
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
  electron.ipcMain.handle("output:preflight", async (_e, entries) => {
    try {
      return ok(await renderedEligibilityIssues(entries));
    } catch (e) {
      return fail(e instanceof Error ? e.message : String(e));
    }
  });
  electron.ipcMain.handle("export:singlePDF", async (_e, product) => {
    try {
      const eligibilityError = await renderedEligibilityError([{ product }], "PDF export");
      if (eligibilityError) return fail(eligibilityError);
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
      const eligibilityError = await renderedEligibilityError([{ product }], "SVG export");
      if (eligibilityError) return fail(eligibilityError);
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
    async (_e, slots) => {
      try {
        const eligibilityError = await renderedEligibilityError(slots.flatMap((product, index) => product ? [{ product, slot: index + 1 }] : []), "Sheet PDF export");
        if (eligibilityError) return fail(eligibilityError);
        const settings = getSettings();
        const result = await electron.dialog.showSaveDialog({
          title: "Save Sheet PDF",
          defaultPath: path.join(settings.exportFolder, "label-sheet.pdf"),
          filters: [{ name: "PDF", extensions: ["pdf"] }]
        });
        if (result.canceled || !result.filePath) return ok(null);
        const outPath = await exportSheetPDF(slots, result.filePath);
        electron.shell.openPath(outPath);
        return ok(outPath);
      } catch (e) {
        return fail(String(e));
      }
    }
  );
  electron.ipcMain.handle("print:sheet", async (_e, slots, opts) => {
    const tempPath = path.join(electron.app.getPath("temp"), `label-sheet-print-${Date.now()}-${nanoid.nanoid(8)}.pdf`);
    try {
      const eligibilityError = await renderedEligibilityError(slots.flatMap((product, index) => product ? [{ product, slot: index + 1 }] : []), "Sheet printing");
      if (eligibilityError) return fail(eligibilityError);
      const pdfBytes = await buildSheetPDF(slots);
      fs.writeFileSync(tempPath, pdfBytes);
      const printed = await printSheetPdf(tempPath, opts?.printerName);
      return ok(printed);
    } catch (e) {
      return fail(e instanceof Error ? e.message : String(e));
    } finally {
      scheduleTempFileCleanup(tempPath);
    }
  });
  electron.ipcMain.handle("print:calibrationSheet", async (_e, opts) => {
    const tempPath = path.join(electron.app.getPath("temp"), `label-calibration-${Date.now()}-${nanoid.nanoid(8)}.pdf`);
    try {
      fs.writeFileSync(tempPath, await buildCalibrationSheetPDF());
      return ok(await printSheetPdf(tempPath, opts?.printerName));
    } catch (e) {
      return fail(e instanceof Error ? e.message : String(e));
    } finally {
      scheduleTempFileCleanup(tempPath);
    }
  });
  electron.ipcMain.handle("print:getTemplatePNG", () => {
    try {
      return ok(readTemplatePNGBase64());
    } catch (e) {
      return fail(String(e));
    }
  });
  electron.ipcMain.handle("print:listPrinters", async () => {
    try {
      const win = electron.BrowserWindow.getAllWindows()[0];
      if (!win) return fail("No window available to query printers");
      const printers = await win.webContents.getPrintersAsync();
      return ok(printers.map((p) => ({
        name: p.name,
        displayName: p.displayName,
        // Not in Electron's current typings but still present at runtime on
        // platforms that report a default printer.
        isDefault: Boolean(p.isDefault)
      })));
    } catch (e) {
      return fail(String(e));
    }
  });
  electron.ipcMain.handle(
    "print:rollLabel",
    async (_e, product, opts) => {
      const tempPath = path.join(electron.app.getPath("temp"), `roll-label-print-${Date.now()}-${nanoid.nanoid(8)}.pdf`);
      try {
        if (!(opts.widthIn > 0) || !(opts.heightIn > 0)) return fail("Label size must be positive numbers.");
        const eligibilityError = await renderedEligibilityError([{ product }], "Roll printing");
        if (eligibilityError) return fail(eligibilityError);
        const pdfBytes = await buildRollLabelPDF(product, opts.widthIn, opts.heightIn);
        fs.writeFileSync(tempPath, pdfBytes);
        const printed = await printPdfToRoll(tempPath, opts);
        return ok(printed);
      } catch (e) {
        return fail(e instanceof Error ? e.message : String(e));
      } finally {
        scheduleTempFileCleanup(tempPath);
      }
    }
  );
  electron.ipcMain.handle("tillie:getConfig", () => {
    try {
      return ok(getTillieConfig());
    } catch (e) {
      return fail(String(e));
    }
  });
  electron.ipcMain.handle("tillie:setConfig", (_e, patch) => {
    try {
      return ok(setTillieConfig(patch));
    } catch (e) {
      return fail(String(e));
    }
  });
  electron.ipcMain.handle("tillie:login", async (_e, pin) => {
    try {
      return ok(await tillieLogin(pin));
    } catch (e) {
      return fail(e instanceof Error ? e.message : String(e));
    }
  });
  electron.ipcMain.handle("tillie:disconnect", () => {
    try {
      return ok(tillieDisconnect());
    } catch (e) {
      return fail(String(e));
    }
  });
  electron.ipcMain.handle("tillie:getCategories", async () => {
    try {
      return ok(await tillieCategories());
    } catch (e) {
      return fail(e instanceof Error ? e.message : String(e));
    }
  });
  electron.ipcMain.handle("tillie:listProducts", async () => {
    try {
      return ok(await tillieListProducts());
    } catch (e) {
      return fail(e instanceof Error ? e.message : String(e));
    }
  });
  electron.ipcMain.handle("tillie:sync", async () => {
    try {
      return ok(await tillieSync());
    } catch (e) {
      return fail(e instanceof Error ? e.message : String(e));
    }
  });
}
function generateBarcode() {
  const num2 = Math.floor(Math.random() * 9e11) + 1e11;
  return String(num2);
}
async function printPdfNative(pdfPath, opts) {
  const args = [];
  if (opts.printerName) args.push("-d", opts.printerName);
  const copies = Math.max(1, Math.floor(opts.copies ?? 1) || 1);
  if (copies > 1) args.push("-n", String(copies));
  args.push("-o", `media=${opts.media}`, "-o", "print-scaling=none", pdfPath);
  await new Promise((resolve, reject) => {
    child_process.execFile("lp", args, (error, _stdout, stderr) => {
      if (error) {
        const detail = (stderr || error.message).trim();
        reject(new Error(
          /no default destination/i.test(detail) ? "No default printer is set. Pick a printer in the print options." : `Printing failed: ${detail}`
        ));
      } else {
        resolve();
      }
    });
  });
  return true;
}
async function printPdfToRoll(pdfPath, opts) {
  return printPdfNative(pdfPath, {
    printerName: opts.printerName || void 0,
    copies: opts.copies,
    // Exact roll media size, in inches.
    media: `Custom.${opts.widthIn}x${opts.heightIn}in`
  });
}
async function printSheetPdf(pdfPath, printerName) {
  return printPdfNative(pdfPath, { printerName: printerName || void 0, media: "Letter" });
}
function scheduleTempFileCleanup(filePath) {
  const remove = (attempt) => setTimeout(() => {
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch {
      if (attempt < 3) remove(attempt + 1);
    }
  }, attempt === 1 ? 6e4 : 15e3 * attempt);
  remove(1);
}
function sanitizeFilename(name) {
  return name.replace(/[^a-z0-9_\-. ]/gi, "_").trim().slice(0, 60);
}
electron.app.disableHardwareAcceleration();
function createWindow() {
  const win = new electron.BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 720,
    minHeight: 560,
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
  win.webContents.setWindowOpenHandler(({ url }) => {
    electron.shell.openExternal(url);
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
    initFonts();
    initDesigns();
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
