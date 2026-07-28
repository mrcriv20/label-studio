"use strict";
const electron = require("electron");
const api = {
  // Products
  product: {
    list: () => electron.ipcRenderer.invoke("product:list"),
    get: (id) => electron.ipcRenderer.invoke("product:get", id),
    create: (data) => electron.ipcRenderer.invoke("product:create", data),
    update: (product) => electron.ipcRenderer.invoke("product:update", product),
    delete: (id) => electron.ipcRenderer.invoke("product:delete", id),
    duplicate: (id) => electron.ipcRenderer.invoke("product:duplicate", id),
    importSpreadsheet: () => electron.ipcRenderer.invoke("product:importSpreadsheet")
  },
  // Settings
  settings: {
    get: () => electron.ipcRenderer.invoke("settings:get"),
    set: (key, value) => electron.ipcRenderer.invoke("settings:set", key, value)
  },
  // File operations
  file: {
    pickBarcodeImage: () => electron.ipcRenderer.invoke("file:pickBarcodeImage"),
    saveBarcodeImage: (sourcePath, productId) => electron.ipcRenderer.invoke("file:saveBarcodeImage", sourcePath, productId),
    pickLogoImage: () => electron.ipcRenderer.invoke("file:pickLogoImage"),
    saveLogoImage: (sourcePath, productId) => electron.ipcRenderer.invoke("file:saveLogoImage", sourcePath, productId),
    readImageAsBase64: (filePath) => electron.ipcRenderer.invoke("file:readImageAsBase64", filePath),
    getTemplatePNG: (templateId) => electron.ipcRenderer.invoke("file:getTemplatePNG", templateId),
    listTemplates: () => electron.ipcRenderer.invoke("file:listTemplates"),
    pickTemplateImage: () => electron.ipcRenderer.invoke("file:pickTemplateImage"),
    saveTemplateImage: (sourcePath) => electron.ipcRenderer.invoke("file:saveTemplateImage", sourcePath),
    deleteTemplate: (templateId) => electron.ipcRenderer.invoke("file:deleteTemplate", templateId),
    pickExportFolder: () => electron.ipcRenderer.invoke("file:pickExportFolder")
  },
  font: {
    list: () => electron.ipcRenderer.invoke("font:list"),
    importLocal: () => electron.ipcRenderer.invoke("font:importLocal"),
    upload: () => electron.ipcRenderer.invoke("font:upload"),
    addGoogle: (family) => electron.ipcRenderer.invoke("font:addGoogle", family)
  },
  // Design templates
  design: {
    list: () => electron.ipcRenderer.invoke("design:list"),
    get: (id) => electron.ipcRenderer.invoke("design:get", id),
    save: (design) => electron.ipcRenderer.invoke("design:save", design),
    delete: (id) => electron.ipcRenderer.invoke("design:delete", id),
    duplicate: (id) => electron.ipcRenderer.invoke("design:duplicate", id),
    importImage: () => electron.ipcRenderer.invoke("design:importImage"),
    assetDataUri: (assetName) => electron.ipcRenderer.invoke("design:assetDataUri", assetName),
    pickSlotImage: (productId, elementId) => electron.ipcRenderer.invoke("design:pickSlotImage", productId, elementId)
  },
  // Export
  export: {
    singlePDF: (product) => electron.ipcRenderer.invoke("export:singlePDF", product),
    singleSVG: (product) => electron.ipcRenderer.invoke("export:singleSVG", product),
    sheetPDF: (products, startSlot) => electron.ipcRenderer.invoke("export:sheetPDF", products, startSlot)
  },
  // Print
  print: {
    sheet: (products, startSlot) => electron.ipcRenderer.invoke("print:sheet", products, startSlot),
    listPrinters: () => electron.ipcRenderer.invoke("print:listPrinters"),
    rollLabel: (product, opts) => electron.ipcRenderer.invoke("print:rollLabel", product, opts)
  },
  // Tillie POS sync
  tillie: {
    getConfig: () => electron.ipcRenderer.invoke("tillie:getConfig"),
    setConfig: (patch) => electron.ipcRenderer.invoke("tillie:setConfig", patch),
    login: (pin) => electron.ipcRenderer.invoke("tillie:login", pin),
    disconnect: () => electron.ipcRenderer.invoke("tillie:disconnect"),
    getCategories: () => electron.ipcRenderer.invoke("tillie:getCategories"),
    listProducts: () => electron.ipcRenderer.invoke("tillie:listProducts"),
    sync: () => electron.ipcRenderer.invoke("tillie:sync")
  }
};
electron.contextBridge.exposeInMainWorld("api", api);
