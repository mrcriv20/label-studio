"use strict";
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const fs = require("fs");
const nanoid = require("nanoid");
const pdfLib = require("pdf-lib");
const fontkit = require("@pdf-lib/fontkit");
const os = require("os");
const bwipjs = require("bwip-js");
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
    pricePrefix: "$"
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
  _db.products.push(p);
  saveDB();
}
function updateProduct(updated) {
  const idx = _db.products.findIndex((p) => p.id === updated.id);
  if (idx !== -1) {
    _db.products[idx] = updated;
  } else {
    _db.products.push(updated);
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
const ASSETS_DIR = path.join(electron.app.getPath("userData"), "assets");
const BARCODE_DIR = path.join(electron.app.getPath("userData"), "barcodes");
const TEMPLATE_PNG = path.join(ASSETS_DIR, "label-template-300dpi.png");
const TEMPLATE_EPS = path.join(ASSETS_DIR, "label-template.eps");
function initFileManager() {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
  fs.mkdirSync(BARCODE_DIR, { recursive: true });
  copyBundledAssets();
}
function copyBundledAssets() {
  const isDev = !electron.app.isPackaged;
  const sourceDir = isDev ? path.join(__dirname, "../../assets") : path.join(process.resourcesPath, "assets");
  const sourceEps = path.join(sourceDir, "label-template.eps");
  const sourcePng = path.join(sourceDir, "label-template-300dpi.png");
  if (!fs.existsSync(TEMPLATE_EPS) && fs.existsSync(sourceEps)) {
    fs.copyFileSync(sourceEps, TEMPLATE_EPS);
  }
  if (!fs.existsSync(TEMPLATE_PNG) && fs.existsSync(sourcePng)) {
    fs.copyFileSync(sourcePng, TEMPLATE_PNG);
  }
}
function getTemplatePNGPath() {
  return TEMPLATE_PNG;
}
function readTemplatePNGBase64() {
  if (!fs.existsSync(TEMPLATE_PNG)) return "";
  const buf = fs.readFileSync(TEMPLATE_PNG);
  return `data:image/png;base64,${buf.toString("base64")}`;
}
function saveBarcodeImage(sourcePath, productId) {
  const ext = path.extname(sourcePath) || ".png";
  const destName = `barcode-${productId}${ext}`;
  const destPath = path.join(BARCODE_DIR, destName);
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
const LW = 181;
const LH = 289;
const AVERY = {
  pageW: 612,
  pageH: 792,
  // US Letter portrait
  slotW: 288,
  slotH: 180,
  // 4" × 2.5" landscape slots
  marginLeft: 18,
  marginTop: 36,
  // 0.25" / 0.5"
  cols: 2
};
const F = {
  name: { yBase: 128, lineH: 28, maxW: 155 },
  price: { yBase: 75 },
  barcode: { x: 57, y: 10, w: 68, h: 50 },
  mask: { topFrac: 0.42, leftFrac: 0.03, rightFrac: 0.03, bottomFrac: 0.02 }
};
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
const LORA_BYTES = readFontBytes(path.join(USER_FONTS, "Lora-Bold.ttf"), path.join(SYS_FONTS, "Lora-Bold.ttf"));
const GENTY_BYTES = readFontBytes(path.join(USER_FONTS, "GentyDemo-Regular.ttf"), path.join(SYS_FONTS, "GentyDemo-Regular.ttf"));
async function embedFonts(pdfDoc) {
  const fallback = await pdfDoc.embedFont(pdfLib.StandardFonts.HelveticaBold);
  const nameFnt = LORA_BYTES ? await pdfDoc.embedFont(LORA_BYTES) : fallback;
  const priceFnt = GENTY_BYTES ? await pdfDoc.embedFont(GENTY_BYTES) : fallback;
  return { name: nameFnt, price: priceFnt };
}
function loadTemplateBytesOnce() {
  const p = getTemplatePNGPath();
  if (!fs.existsSync(p)) return null;
  try {
    return new Uint8Array(fs.readFileSync(p));
  } catch {
    return null;
  }
}
async function renderBarcodePNG(value) {
  return bwipjs.toBuffer({
    bcid: "code128",
    text: value,
    scale: 3,
    height: 12,
    includetext: true,
    textxalign: "center",
    backgroundcolor: "ffffff",
    barcolor: "1a2332",
    textcolor: "1a2332"
  });
}
async function getBarcodePNG(product) {
  try {
    if (product.barcodeImagePath && fs.existsSync(product.barcodeImagePath))
      return fs.readFileSync(product.barcodeImagePath);
    return await renderBarcodePNG(product.barcodeValue);
  } catch {
    return null;
  }
}
async function drawLabel(page, product, ox, oy, templateImg, barcodeImg, fonts) {
  if (templateImg) {
    page.drawImage(templateImg, { x: ox, y: oy, width: LW, height: LH });
  } else {
    page.drawRectangle({ x: ox, y: oy, width: LW, height: LH, color: pdfLib.rgb(0.97, 0.96, 0.93) });
  }
  const BG = pdfLib.rgb(0.965, 0.949, 0.875);
  const B = 4;
  page.drawRectangle({ x: ox, y: oy, width: LW, height: B, color: BG, borderWidth: 0 });
  page.drawRectangle({ x: ox, y: oy + LH - B, width: LW, height: B, color: BG, borderWidth: 0 });
  page.drawRectangle({ x: ox, y: oy, width: B, height: LH, color: BG, borderWidth: 0 });
  page.drawRectangle({ x: ox + LW - B, y: oy, width: B, height: LH, color: BG, borderWidth: 0 });
  page.drawRectangle({
    x: ox + LW * F.mask.leftFrac,
    y: oy + LH * F.mask.bottomFrac,
    width: LW * (1 - F.mask.leftFrac - F.mask.rightFrac),
    height: LH * (1 - F.mask.topFrac - F.mask.bottomFrac),
    color: pdfLib.rgb(1, 1, 1),
    borderWidth: 0
  });
  const nameSize = product.name.length > 18 ? 16 : product.name.length > 12 ? 19 : 22;
  const nameLines = wrapText(product.name, fonts.name, nameSize, F.name.maxW);
  const blockH = (nameLines.length - 1) * F.name.lineH;
  const nameY0 = oy + F.name.yBase + blockH / 2;
  nameLines.forEach((line, i) => {
    const lw = fonts.name.widthOfTextAtSize(line, nameSize);
    page.drawText(line, {
      x: ox + LW / 2 - lw / 2,
      y: nameY0 - i * F.name.lineH,
      size: nameSize,
      font: fonts.name,
      color: pdfLib.rgb(0.1, 0.14, 0.19)
    });
  });
  const priceSize = product.price.length > 10 ? 20 : 26;
  const priceW = fonts.price.widthOfTextAtSize(product.price, priceSize);
  page.drawText(product.price, {
    x: ox + LW / 2 - priceW / 2,
    y: oy + F.price.yBase,
    size: priceSize,
    font: fonts.price,
    color: pdfLib.rgb(0.1, 0.14, 0.19)
  });
  if (barcodeImg) {
    page.drawImage(barcodeImg, {
      x: ox + F.barcode.x,
      y: oy + F.barcode.y,
      width: F.barcode.w,
      height: F.barcode.h
    });
  }
}
async function buildLabelPDF(product, templateBytes, barcodePNG) {
  const doc = await pdfLib.PDFDocument.create();
  doc.registerFontkit(fontkit);
  const fonts = await embedFonts(doc);
  const templateImg = templateBytes ? await doc.embedPng(templateBytes) : null;
  const barcodeImg = barcodePNG ? await doc.embedPng(barcodePNG).catch(() => null) : null;
  const page = doc.addPage([LW, LH]);
  await drawLabel(page, product, 0, 0, templateImg, barcodeImg, fonts);
  return doc.save();
}
async function exportSingleLabelPDF(product, outputPath) {
  const templateBytes = loadTemplateBytesOnce();
  const barcodePNG = await getBarcodePNG(product);
  const bytes = await buildLabelPDF(product, templateBytes, barcodePNG);
  fs.writeFileSync(outputPath, bytes);
  return outputPath;
}
async function exportSheetPDF(products, startSlot, outputPath) {
  const templateBytes = loadTemplateBytesOnce();
  const barcodeCache = /* @__PURE__ */ new Map();
  for (const p of products) {
    if (!barcodeCache.has(p.id)) barcodeCache.set(p.id, await getBarcodePNG(p));
  }
  const sheetDoc = await pdfLib.PDFDocument.create();
  const sheetPage = sheetDoc.addPage([AVERY.pageW, AVERY.pageH]);
  sheetPage.drawRectangle({
    x: 0,
    y: 0,
    width: AVERY.pageW,
    height: AVERY.pageH,
    color: pdfLib.rgb(0.965, 0.949, 0.875),
    borderWidth: 0
  });
  for (let slot = 1; slot <= 8; slot++) {
    const pIdx = slot - startSlot;
    if (pIdx < 0 || pIdx >= products.length) continue;
    const product = products[pIdx];
    if (!product) continue;
    const col = (slot - 1) % AVERY.cols;
    const row = Math.floor((slot - 1) / AVERY.cols);
    const slotX = AVERY.marginLeft + col * AVERY.slotW;
    const slotY = AVERY.pageH - AVERY.marginTop - (row + 1) * AVERY.slotH;
    const labelBytes = await buildLabelPDF(product, templateBytes, barcodeCache.get(product.id) ?? null);
    const [embeddedLabel] = await sheetDoc.embedPdf(labelBytes);
    sheetPage.drawPage(embeddedLabel, {
      x: slotX + AVERY.slotW,
      y: slotY,
      width: AVERY.slotH,
      height: AVERY.slotW,
      rotate: pdfLib.degrees(90),
      borderWidth: 0
    });
  }
  fs.writeFileSync(outputPath, await sheetDoc.save());
  return outputPath;
}
async function exportSingleLabelSVG(product) {
  const w = LW;
  const h = LH;
  const tPath = getTemplatePNGPath();
  const templateUri = fs.existsSync(tPath) ? `data:image/png;base64,${fs.readFileSync(tPath).toString("base64")}` : "";
  let barcodeUri = "";
  try {
    const png = await getBarcodePNG(product);
    if (png) barcodeUri = `data:image/png;base64,${png.toString("base64")}`;
  } catch {
  }
  const nameSize = product.name.length > 18 ? 20 : product.name.length > 12 ? 24 : 28;
  const nameLines = splitLines(product.name, 20);
  const nameY0 = h - 90;
  const priceSize = product.price.length > 10 ? 26 : 32;
  const nameEls = nameLines.map(
    (line, i) => `<text x="${w / 2}" y="${nameY0 + i * nameSize * 1.25}" text-anchor="middle" font-family="Lora,Georgia,serif" font-weight="700" font-size="${nameSize}" fill="#1a2332">${xml(line)}</text>`
  ).join("\n  ");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     viewBox="0 0 ${w} ${h}" width="${w}pt" height="${h}pt" version="1.1">
  ${templateUri ? `<image x="0" y="0" width="${w}" height="${h}" xlink:href="${templateUri}" preserveAspectRatio="none"/>` : `<rect x="0" y="0" width="${w}" height="${h}" fill="#f7f5ee"/>`}
  <rect x="${w * 0.035}" y="${h * 0.42}" width="${w * 0.93}" height="${h * 0.555}" fill="white"/>
  ${nameEls}
  <text x="${w / 2}" y="${h - 118}" text-anchor="middle" font-family="'Genty Demo',Georgia,serif" font-size="${priceSize}" fill="#1a2332">${xml(product.price)}</text>
  ${barcodeUri ? `<image x="${F.barcode.x}" y="${h - F.barcode.y - F.barcode.h}" width="${F.barcode.w}" height="${F.barcode.h}" xlink:href="${barcodeUri}"/>` : ""}
</svg>`;
}
function wrapText(text, font, size, maxW) {
  const words = text.split(" ");
  const lines = [];
  let cur = "";
  for (const w of words) {
    const trial = cur ? `${cur} ${w}` : w;
    if (font.widthOfTextAtSize(trial, size) <= maxW) cur = trial;
    else {
      if (cur) lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [text];
}
function splitLines(text, maxChars) {
  const words = text.split(" ");
  const lines = [];
  let cur = "";
  for (const w of words) {
    const trial = (cur + " " + w).trim();
    if (trial.length <= maxChars) cur = trial;
    else {
      if (cur) lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [text];
}
function xml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
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
  electron.ipcMain.handle("file:readImageAsBase64", (_e, filePath) => {
    try {
      return ok(readImageAsBase64(filePath));
    } catch (e) {
      return fail(String(e));
    }
  });
  electron.ipcMain.handle("file:getTemplatePNG", () => {
    try {
      return ok(readTemplatePNGBase64());
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
function sanitizeFilename(name) {
  return name.replace(/[^a-z0-9_\-. ]/gi, "_").trim().slice(0, 60);
}
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
