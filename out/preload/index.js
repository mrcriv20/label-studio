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
    readImageAsBase64: (filePath) => electron.ipcRenderer.invoke("file:readImageAsBase64", filePath),
    getTemplatePNG: () => electron.ipcRenderer.invoke("file:getTemplatePNG"),
    pickExportFolder: () => electron.ipcRenderer.invoke("file:pickExportFolder")
  },
  // Export
  export: {
    singlePDF: (product) => electron.ipcRenderer.invoke("export:singlePDF", product),
    singleSVG: (product) => electron.ipcRenderer.invoke("export:singleSVG", product),
    sheetPDF: (products, startSlot) => electron.ipcRenderer.invoke("export:sheetPDF", products, startSlot)
  },
  // Print
  print: {
    sheet: (products, startSlot) => electron.ipcRenderer.invoke("print:sheet", products, startSlot)
  }
};
electron.contextBridge.exposeInMainWorld("api", api);
