import { o as createLucideIcon, v as reactExports, m as assessProductContentFit, r as getLabelTemplate, t as jsxRuntimeExports, b as CircleCheck, C as CircleAlert, e as Layers, E as Ellipsis, F as FileText, i as Sticker, g as RollPrintDialog, U as Upload, X, R as RefreshCw, u as outputEligibilityError, n as confirmUsingSavedTillieData } from "./index-BxS2c6tc.js";
import { J as JsBarcode, A as ArrowLeft, L as LabelPreview } from "./LabelPreview-CQjzg-BK.js";
import { S as Save } from "./save-B1zdch4d.js";
import "./DesignLabelSvg-zfcFaBcf.js";
/**
 * @license lucide-react v0.390.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileCode2 = createLucideIcon("FileCode2", [
  ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4", key: "1pf5j1" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "m5 12-3 3 3 3", key: "oke12k" }],
  ["path", { d: "m9 18 3-3-3-3", key: "112psh" }]
]);
function generateBarcodeValue() {
  const num = Math.floor(Math.random() * 9e11) + 1e11;
  return String(num);
}
const EMPTY_PRODUCT = () => ({
  name: "",
  price: "",
  category: "",
  servingInfo: "",
  nutritionInfo: "",
  cookingInstructions: "",
  customerName: "",
  labelBackgroundColor: "",
  ingredients: "",
  allergenStatement: "",
  barcodeValue: generateBarcodeValue(),
  barcodeType: "CODE128",
  barcodeImagePath: null,
  logoImagePath: null,
  templateId: "avery5821",
  showPrice: true,
  showBarcode: true,
  showCookingInstructions: true,
  designImageOverrides: null,
  tillieProductId: null
});
function Editor({ initialProduct, onBack, onOpenSheet, onOpenDesigner, onDirtyChange, repairField, onReturnToSheet }) {
  const isNew = !initialProduct;
  const [product, setProduct] = reactExports.useState(
    initialProduct ?? EMPTY_PRODUCT()
  );
  const [barcodeOverrideDataUri, setBarcodeOverrideDataUri] = reactExports.useState("");
  const [logoDataUri, setLogoDataUri] = reactExports.useState("");
  const [templates, setTemplates] = reactExports.useState([]);
  const [categories, setCategories] = reactExports.useState([]);
  const [globalLabelBackground, setGlobalLabelBackground] = reactExports.useState("");
  const [saveStatus, setSaveStatus] = reactExports.useState("idle");
  const [saveError, setSaveError] = reactExports.useState("");
  const [exporting, setExporting] = reactExports.useState(false);
  const [regenConfirm, setRegenConfirm] = reactExports.useState(false);
  const [rollProduct, setRollProduct] = reactExports.useState(null);
  const [designDoc, setDesignDoc] = reactExports.useState(null);
  const [outputNotice, setOutputNotice] = reactExports.useState("");
  const [outputError, setOutputError] = reactExports.useState("");
  const [settings, setSettings] = reactExports.useState(null);
  const [renderedFitIssues, setRenderedFitIssues] = reactExports.useState(null);
  const [preflightStatus, setPreflightStatus] = reactExports.useState("checking");
  const [preflightError, setPreflightError] = reactExports.useState("");
  const saveInFlight = reactExports.useRef(null);
  const savedProductRef = reactExports.useRef(JSON.stringify(product));
  const draftAssetIdRef = reactExports.useRef(`draft-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  const newAssetPathsRef = reactExports.useRef(/* @__PURE__ */ new Set());
  const replacedAssetPathsRef = reactExports.useRef(/* @__PURE__ */ new Set());
  const preflightRequestRef = reactExports.useRef(0);
  const dirty = reactExports.useMemo(() => JSON.stringify(product) !== savedProductRef.current, [product, saveStatus]);
  const estimatedFitIssues = reactExports.useMemo(() => assessProductContentFit(product), [product]);
  const contentFitIssues = renderedFitIssues ?? estimatedFitIssues;
  const clippedContent = contentFitIssues.filter((issue) => issue.status === "clipped");
  reactExports.useEffect(() => {
    onDirtyChange(dirty);
    return () => onDirtyChange(false);
  }, [dirty, onDirtyChange]);
  reactExports.useEffect(() => () => {
    for (const filePath of newAssetPathsRef.current) void window.api.file.deleteManagedImage(filePath);
  }, []);
  reactExports.useEffect(() => {
    if (!repairField) return;
    const ids = {
      name: "product-name",
      templateId: "product-template",
      price: "product-price",
      category: "product-category",
      customerName: "customer-name",
      servingInfo: "serving-info",
      nutritionInfo: "nutrition-info",
      cookingInstructions: "cooking-instructions",
      ingredients: "ingredients",
      allergenStatement: "allergen-note"
    };
    const id = ids[repairField];
    if (!id) return;
    const timer = window.setTimeout(() => {
      const field = document.getElementById(id);
      const disclosure = field?.closest("details");
      if (disclosure) disclosure.open = true;
      field?.classList.add("repair-field-focus");
      field?.scrollIntoView({ block: "center", behavior: "smooth" });
      field?.focus();
    }, 80);
    return () => window.clearTimeout(timer);
  }, [repairField]);
  async function runOutputPreflight() {
    const requestId = ++preflightRequestRef.current;
    setPreflightStatus("checking");
    setPreflightError("");
    setRenderedFitIssues(null);
    let result;
    try {
      result = await window.api.output.preflight([{ product }]);
    } catch {
      if (requestId !== preflightRequestRef.current) return;
      setPreflightStatus("unavailable");
      setPreflightError("Tillie Print could not reach the output verifier. Check the app connection and retry.");
      return;
    }
    if (requestId !== preflightRequestRef.current) return;
    if (!result.ok) {
      setPreflightStatus("unavailable");
      setPreflightError("Tillie Print could not verify the rendered label. Output stays blocked until the check succeeds.");
      return;
    }
    setRenderedFitIssues(result.data);
    setPreflightStatus("checked");
  }
  reactExports.useEffect(() => {
    const requestId = ++preflightRequestRef.current;
    let alive = true;
    setPreflightStatus("checking");
    setPreflightError("");
    setRenderedFitIssues(null);
    const timer = window.setTimeout(() => {
      window.api.output.preflight([{ product }]).then((result) => {
        if (!alive || requestId !== preflightRequestRef.current) return;
        if (!result.ok) {
          setPreflightStatus("unavailable");
          setPreflightError("Tillie Print could not verify the rendered label. Output stays blocked until the check succeeds.");
          return;
        }
        setRenderedFitIssues(result.data);
        setPreflightStatus("checked");
      }).catch(() => {
        if (!alive || requestId !== preflightRequestRef.current) return;
        setPreflightStatus("unavailable");
        setPreflightError("Tillie Print could not reach the output verifier. Check the app connection and retry.");
      });
    }, 180);
    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, [product]);
  function stageAssetReplacement(previousPath, nextPath) {
    if (previousPath && previousPath !== nextPath) {
      if (newAssetPathsRef.current.delete(previousPath)) void window.api.file.deleteManagedImage(previousPath);
      else replacedAssetPathsRef.current.add(previousPath);
    }
    newAssetPathsRef.current.add(nextPath);
  }
  function stageAssetRemoval(filePath) {
    if (!filePath) return;
    if (newAssetPathsRef.current.delete(filePath)) void window.api.file.deleteManagedImage(filePath);
    else replacedAssetPathsRef.current.add(filePath);
  }
  reactExports.useEffect(() => {
    window.api.file.listTemplates().then((r) => {
      if (r.ok) setTemplates(r.data);
    });
    window.api.product.list().then((r) => {
      if (!r.ok) return;
      const categoryByNormalizedName = /* @__PURE__ */ new Map();
      r.data.forEach(({ category }) => {
        const trimmedCategory = category?.trim();
        if (trimmedCategory) {
          categoryByNormalizedName.set(trimmedCategory.toLocaleLowerCase(), trimmedCategory);
        }
      });
      setCategories(
        Array.from(categoryByNormalizedName.values()).sort(
          (a, b) => a.localeCompare(b, void 0, { sensitivity: "base" })
        )
      );
    });
    window.api.settings.get().then((r) => {
      if (r.ok) {
        setGlobalLabelBackground(r.data.labelBackgroundColor);
        setSettings(r.data);
      }
    });
  }, []);
  reactExports.useEffect(() => {
    function handleShortcut(event) {
      if (!(event.metaKey || event.ctrlKey)) return;
      if (event.key.toLowerCase() === "s") {
        event.preventDefault();
        void handleSave();
      }
      if (event.key.toLowerCase() === "p") {
        event.preventDefault();
        void handlePrint();
      }
    }
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  });
  reactExports.useEffect(() => {
    if (!product.barcodeImagePath) {
      setBarcodeOverrideDataUri("");
      return;
    }
    window.api.file.readImageAsBase64(product.barcodeImagePath).then((r) => {
      if (r.ok && r.data) setBarcodeOverrideDataUri(r.data);
    });
  }, [product.barcodeImagePath]);
  reactExports.useEffect(() => {
    if (!product.logoImagePath) {
      setLogoDataUri("");
      return;
    }
    window.api.file.readImageAsBase64(product.logoImagePath).then((r) => {
      if (r.ok && r.data) setLogoDataUri(r.data);
    });
  }, [product.logoImagePath]);
  const barcodeValidity = reactExports.useMemo(() => {
    const value = (product.barcodeValue ?? "").trim();
    if (!value) return null;
    try {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      JsBarcode(svg, value, {
        format: "CODE128",
        displayValue: false
      });
      return true;
    } catch {
      return false;
    }
  }, [product.barcodeValue]);
  reactExports.useEffect(() => {
    if (!product.templateId?.startsWith("design-")) {
      setDesignDoc(null);
      return;
    }
    let alive = true;
    window.api.design.get(product.templateId).then((result) => {
      if (alive) setDesignDoc(result.ok ? result.data : null);
    });
    return () => {
      alive = false;
    };
  }, [product.templateId]);
  const designImageSlots = reactExports.useMemo(
    () => (designDoc?.elements ?? []).flatMap(
      (element, index) => element.type === "image" && element.source === "asset" ? [{ id: element.id, label: element.label || element.assetName || `Image ${index + 1}` }] : []
    ),
    [designDoc]
  );
  async function handlePickDesignImage(elementId) {
    const productId = product.id ?? draftAssetIdRef.current;
    const result = await window.api.design.pickSlotImage(productId, elementId);
    if (!result.ok) {
      setOutputError(`Design image could not be saved: ${result.error}`);
      return;
    }
    if (!result.data) return;
    const storedPath = result.data;
    stageAssetReplacement(product.designImageOverrides?.[elementId], storedPath);
    setProduct((prev) => ({
      ...prev,
      designImageOverrides: { ...prev.designImageOverrides ?? {}, [elementId]: storedPath }
    }));
    setSaveStatus("idle");
  }
  function handleClearDesignImage(elementId) {
    stageAssetRemoval(product.designImageOverrides?.[elementId]);
    setProduct((prev) => {
      const next = { ...prev.designImageOverrides ?? {} };
      delete next[elementId];
      return { ...prev, designImageOverrides: Object.keys(next).length ? next : null };
    });
    setSaveStatus("idle");
  }
  const activeTemplate = reactExports.useMemo(
    () => getLabelTemplate(product.templateId),
    [product.templateId]
  );
  const usesPrice = activeTemplate.layout === "front" || activeTemplate.layout === "info";
  const usesBarcode = activeTemplate.layout === "front" || activeTemplate.layout === "info";
  const usesCookingInstructions = activeTemplate.layout === "info" || activeTemplate.layout === "vertical-info";
  const isDesignTemplate = Boolean(product.templateId?.startsWith("design-"));
  const usesProductNameToggle = Boolean(product.templateId?.startsWith("custom-")) || isDesignTemplate;
  const requiresName = activeTemplate.layout !== "logo-only";
  const previewUsesSampleContent = isNew && (requiresName && !product.name?.trim() || usesPrice && product.showPrice !== false && !product.price?.trim());
  const templateNote = activeTemplate.layout === "front" ? "Classic vertical label with name, optional price, and optional barcode." : activeTemplate.layout === "info" ? "Landscape info label with nutrition, ingredients, and optional cooking instructions." : activeTemplate.layout === "vertical-info" ? "Vertical label with a title and cooking instructions below the logo." : "Minimal white label that renders only the logo.";
  function update(field, value) {
    setProduct((prev) => ({ ...prev, [field]: value }));
    if (saveStatus === "saved") setSaveStatus("idle");
  }
  function updateFlag(field, value) {
    setProduct((prev) => ({ ...prev, [field]: value }));
    if (saveStatus === "saved") setSaveStatus("idle");
  }
  function handleSave() {
    if (saveInFlight.current) return saveInFlight.current;
    const request = persistProduct();
    saveInFlight.current = request;
    request.then(
      () => {
        if (saveInFlight.current === request) saveInFlight.current = null;
      },
      () => {
        if (saveInFlight.current === request) saveInFlight.current = null;
      }
    );
    return request;
  }
  async function persistProduct() {
    if (product.labelBackgroundColor && !/^#[0-9a-f]{6}$/i.test(product.labelBackgroundColor)) {
      setSaveError("Label background must be a 6-digit hex color, such as #f5efdc.");
      setSaveStatus("error");
      return null;
    }
    if (requiresName && !product.name?.trim()) {
      setSaveError("Product name is required.");
      setSaveStatus("error");
      return null;
    }
    if (usesPrice && product.showPrice !== false && !product.price?.trim()) {
      setSaveError("Price is required.");
      setSaveStatus("error");
      return null;
    }
    if (usesBarcode && product.showBarcode !== false && !product.barcodeValue?.trim() && !product.barcodeImagePath) {
      setSaveError("Barcode value is required.");
      setSaveStatus("error");
      return null;
    }
    setSaveStatus("saving");
    setSaveError("");
    let result;
    if (!product.id) {
      result = await window.api.product.create({
        name: product.name,
        price: product.price ?? "",
        showPrice: product.showPrice ?? true,
        category: product.category ?? "",
        servingInfo: product.servingInfo ?? "",
        nutritionInfo: product.nutritionInfo ?? "",
        cookingInstructions: product.cookingInstructions ?? "",
        customerName: product.customerName ?? "",
        labelBackgroundColor: product.labelBackgroundColor ?? "",
        ingredients: product.ingredients ?? "",
        allergenStatement: product.allergenStatement ?? "",
        barcodeValue: (product.barcodeValue ?? "").trim(),
        showBarcode: product.showBarcode ?? true,
        barcodeType: "CODE128",
        barcodeImagePath: product.barcodeImagePath ?? null,
        logoImagePath: product.logoImagePath ?? null,
        templateId: product.templateId ?? "avery5821",
        showCookingInstructions: product.showCookingInstructions ?? true,
        showProductName: product.showProductName ?? true,
        designImageOverrides: product.designImageOverrides ?? null,
        tillieProductId: product.tillieProductId ?? null
      });
    } else {
      result = await window.api.product.update({
        ...product,
        barcodeValue: (product.barcodeValue ?? "").trim()
      });
    }
    if (result.ok) {
      newAssetPathsRef.current.clear();
      for (const filePath of replacedAssetPathsRef.current) void window.api.file.deleteManagedImage(filePath);
      replacedAssetPathsRef.current.clear();
      savedProductRef.current = JSON.stringify(result.data);
      setProduct(result.data);
      const savedCategory = result.data.category.trim();
      if (savedCategory) {
        setCategories((current) => {
          if (current.some((category) => category.localeCompare(savedCategory, void 0, { sensitivity: "base" }) === 0)) {
            return current;
          }
          return [...current, savedCategory].sort(
            (a, b) => a.localeCompare(b, void 0, { sensitivity: "base" })
          );
        });
      }
      setSaveStatus("saved");
      return result.data;
    } else {
      setSaveError(result.error);
      setSaveStatus("error");
      return null;
    }
  }
  async function handleExportPDF() {
    if (preflightStatus !== "checked") {
      setOutputError(preflightStatus === "checking" ? "Wait for rendered-output verification to finish." : "Retry rendered-output verification before exporting.");
      return;
    }
    const eligibilityError = outputEligibilityError([{ product }], "PDF export");
    if (eligibilityError) {
      setOutputError(eligibilityError);
      return;
    }
    if (!confirmUsingSavedTillieData([product])) return;
    const saved = await handleSave();
    if (!saved) return;
    setExporting(true);
    const result = await window.api.export.singlePDF(saved);
    if (!result.ok) setOutputError(`PDF export failed: ${result.error}. Check the export folder and try again.`);
    else if (result.data) setOutputNotice("Label PDF exported.");
    setExporting(false);
  }
  async function handleExportSVG() {
    if (preflightStatus !== "checked") {
      setOutputError(preflightStatus === "checking" ? "Wait for rendered-output verification to finish." : "Retry rendered-output verification before exporting.");
      return;
    }
    const eligibilityError = outputEligibilityError([{ product }], "SVG export");
    if (eligibilityError) {
      setOutputError(eligibilityError);
      return;
    }
    if (!confirmUsingSavedTillieData([product])) return;
    const saved = await handleSave();
    if (!saved) return;
    setExporting(true);
    const result = await window.api.export.singleSVG(saved);
    if (!result.ok) setOutputError(`SVG export failed: ${result.error}. Check the export folder and try again.`);
    else if (result.data) setOutputNotice("Label SVG exported.");
    setExporting(false);
  }
  async function handlePrint() {
    if (preflightStatus !== "checked") {
      setOutputError(preflightStatus === "checking" ? "Wait for rendered-output verification to finish." : "Retry rendered-output verification before opening Print Sheet.");
      return;
    }
    const eligibilityError = outputEligibilityError([{ product }], "Sheet printing");
    if (eligibilityError) {
      setOutputError(eligibilityError);
      return;
    }
    if (!confirmUsingSavedTillieData([product])) return;
    const saved = await handleSave();
    if (!saved) return;
    onOpenSheet(saved);
  }
  async function handleRollPrint() {
    if (preflightStatus !== "checked") {
      setOutputError(preflightStatus === "checking" ? "Wait for rendered-output verification to finish." : "Retry rendered-output verification before roll printing.");
      return;
    }
    const eligibilityError = outputEligibilityError([{ product }], "Roll printing");
    if (eligibilityError) {
      setOutputError(eligibilityError);
      return;
    }
    if (!confirmUsingSavedTillieData([product])) return;
    const saved = await handleSave();
    if (!saved) return;
    setRollProduct(saved);
  }
  async function handleUploadBarcode() {
    const pickedResult = await window.api.file.pickBarcodeImage();
    if (!pickedResult.ok || !pickedResult.data) return;
    const sourcePath = pickedResult.data;
    const productId = product.id ?? draftAssetIdRef.current;
    const saveResult = await window.api.file.saveBarcodeImage(sourcePath, productId);
    if (!saveResult.ok) {
      setOutputError(`Barcode image could not be saved: ${saveResult.error}`);
      return;
    }
    const storedPath = saveResult.data;
    stageAssetReplacement(product.barcodeImagePath, storedPath);
    setProduct((prev) => ({ ...prev, barcodeImagePath: storedPath }));
    const b64Result = await window.api.file.readImageAsBase64(storedPath);
    if (b64Result.ok && b64Result.data) setBarcodeOverrideDataUri(b64Result.data);
    setSaveStatus("idle");
  }
  async function handleUploadLogo() {
    const pickedResult = await window.api.file.pickLogoImage();
    if (!pickedResult.ok || !pickedResult.data) return;
    const sourcePath = pickedResult.data;
    const productId = product.id ?? draftAssetIdRef.current;
    const saveResult = await window.api.file.saveLogoImage(sourcePath, productId);
    if (!saveResult.ok) {
      setOutputError(`Top image could not be saved: ${saveResult.error}`);
      return;
    }
    stageAssetReplacement(product.logoImagePath, saveResult.data);
    setProduct((prev) => ({ ...prev, logoImagePath: saveResult.data }));
    setSaveStatus("idle");
  }
  function handleRemoveBarcodeImage() {
    stageAssetRemoval(product.barcodeImagePath);
    setProduct((prev) => ({ ...prev, barcodeImagePath: null }));
    setBarcodeOverrideDataUri("");
    setSaveStatus("idle");
  }
  function handleRemoveLogo() {
    stageAssetRemoval(product.logoImagePath);
    setProduct((prev) => ({ ...prev, logoImagePath: null }));
    setLogoDataUri("");
    setSaveStatus("idle");
  }
  function handleRegen() {
    if (!regenConfirm) {
      setRegenConfirm(true);
      return;
    }
    const newVal = generateBarcodeValue();
    setProduct((prev) => ({ ...prev, barcodeValue: newVal, barcodeImagePath: null }));
    setBarcodeOverrideDataUri("");
    setRegenConfirm(false);
    setSaveStatus("idle");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "workspace-toolbar editor-toolbar", style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "0 20px",
      height: 52,
      background: "var(--color-surface)",
      borderBottom: "1px solid var(--color-border-soft)",
      flexShrink: 0
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onBack, className: "btn-ghost btn-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 13 }),
        " ",
        onReturnToSheet ? "Draft Sheet" : "Products"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--color-border-strong)", fontSize: 13 }, children: "/" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontSize: 13, fontWeight: 600, color: "var(--color-workbench-navy)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }, children: isNew ? "New Label" : product.name || "Edit Label" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }, children: [
        saveStatus === "saved" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { role: "status", "aria-live": "polite", className: "status-message", style: { display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#1f7a1f", fontWeight: 500, marginRight: 4 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 13 }),
          " Saved"
        ] }),
        dirty && saveStatus !== "saving" && saveStatus !== "error" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { role: "status", className: "status-message", style: { fontSize: 12, color: "var(--color-text-secondary)", fontWeight: 500, marginRight: 4 }, children: "Unsaved changes" }),
        saveStatus === "error" && saveError && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { role: "alert", className: "status-message", style: { display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--color-danger-text)", fontWeight: 500, marginRight: 4 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 13 }),
          " ",
          saveError
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleSave, disabled: saveStatus === "saving", className: "btn-outline btn-sm", title: "Save label (⌘S)", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 12 }),
          " ",
          saveStatus === "saving" ? "Saving…" : "Save"
        ] }),
        onReturnToSheet && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: async () => {
          const saved = await handleSave();
          if (saved) onReturnToSheet();
        }, disabled: saveStatus === "saving", className: "btn-green btn-sm", children: "Return to Sheet" }),
        !onReturnToSheet && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handlePrint, className: "btn-green btn-sm", title: "Save and open print setup (⌘P)", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { size: 12 }),
          " Print Sheet"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "row-actions-menu", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("summary", { className: "btn btn-icon", "aria-label": "More label output actions", title: "More output actions", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ellipsis, { size: 14 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row-actions-popover", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleExportPDF, disabled: exporting, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 13 }),
              " Export label PDF"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleExportSVG, disabled: exporting, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileCode2, { size: 13 }),
              " Export label SVG"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleRollPrint, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sticker, { size: 13 }),
              " Print roll label"
            ] })
          ] })
        ] })
      ] })
    ] }),
    rollProduct && /* @__PURE__ */ jsxRuntimeExports.jsx(RollPrintDialog, { product: rollProduct, onClose: () => setRollProduct(null) }),
    outputNotice && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { role: "status", "aria-live": "polite", className: "status-message", style: { padding: "8px 20px", background: "var(--color-success-surface)", color: "var(--color-success-text)", fontSize: 12 }, children: outputNotice }),
    outputError && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { role: "alert", className: "status-message", style: { display: "flex", gap: 10, alignItems: "center", padding: "8px 20px", background: "var(--color-danger-surface)", color: "var(--color-danger-text)", fontSize: 12 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { flex: 1 }, children: outputError }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-ghost btn-sm", onClick: () => setOutputError(""), children: "Dismiss" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "editor-workspace", style: { display: "flex", flex: 1, overflow: "hidden" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "editor-preview-pane", style: {
        background: "var(--color-panel)",
        borderRight: "1px solid var(--color-border-soft)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "28px 24px",
        gap: 14,
        overflowY: "auto"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 11, fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }, children: "Preview" }),
        previewUsesSampleContent && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { role: "status", style: { fontSize: 12, color: "var(--color-warning)", background: "var(--color-warning-surface)", border: "1px solid var(--color-warning-border)", borderRadius: 8, padding: "7px 10px" }, children: "Sample preview — enter the required product details before saving or printing." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "80%", maxWidth: 480 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          LabelPreview,
          {
            product,
            barcodeOverrideDataUri,
            logoDataUri
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 11, color: "var(--color-text-muted)", textAlign: "center", lineHeight: 1.5, margin: 0 }, children: "Live label preview · verify physical placement in Print Sheet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card print-preflight", style: { width: "min(100%, 520px)", padding: 14 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preflight-item", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Label" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              activeTemplate.name,
              " · ",
              (activeTemplate.width / 72).toFixed(2),
              " × ",
              (activeTemplate.height / 72).toFixed(2),
              " in"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preflight-item", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Barcode" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: product.showBarcode === false || !usesBarcode ? "Not printed" : barcodeValidity ? "Ready" : "Needs attention" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preflight-item", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Content fit" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: preflightStatus === "unavailable" ? "fit-status clipped" : preflightStatus === "checking" ? "fit-status checking" : clippedContent.length ? "fit-status clipped" : contentFitIssues.length ? "fit-status tight" : "fit-status fits", children: preflightStatus === "checking" ? "Checking rendered output…" : preflightStatus === "unavailable" ? "Verification unavailable" : clippedContent.length ? `${clippedContent.length} field${clippedContent.length === 1 ? "" : "s"} clipped` : contentFitIssues.length ? "Tight — review text" : "Verified for output" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preflight-item", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Sheet stock" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "PLS780 · US Letter" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preflight-item", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Print setup" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Actual Size · offsets ",
              settings?.sheetOffsetXIn || "0.000",
              ", ",
              settings?.sheetOffsetYIn || "0.000",
              " in"
            ] })
          ] })
        ] }),
        contentFitIssues.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: clippedContent.length ? "content-fit-callout clipped" : "content-fit-callout tight", role: clippedContent.length ? "alert" : "status", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: clippedContent.length ? "Printed content will be clipped" : "Printed content is close to the limit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { children: contentFitIssues.map((issue) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: issue.message }, `${issue.field}-${issue.status}`)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: clippedContent.length ? "Shorten the field or choose another label before printing or exporting PDF." : "Check the preview carefully before output." })
        ] }),
        preflightStatus === "unavailable" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "content-fit-callout clipped", role: "alert", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Output verification did not finish" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: preflightError }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn-outline btn-sm", onClick: () => void runOutputPreflight(), children: "Retry verification" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editor-form-pane", style: { overflowY: "auto", background: "var(--color-surface)", padding: "28px 24px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 20 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "label-text", htmlFor: "product-name", children: [
            "Product Name ",
            requiresName ? "*" : "(optional)"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "product-name",
              className: "input",
              placeholder: "e.g. Fresh Mozzarella",
              value: product.name ?? "",
              onChange: (e) => update("name", e.target.value),
              maxLength: 80
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", htmlFor: "product-template", children: "Choose Label" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              id: "product-template",
              className: "input",
              value: product.templateId ?? "avery5821",
              onChange: (e) => update("templateId", e.target.value),
              children: templates.map((template) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: template.id, children: template.name }, template.id))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 11, color: "var(--color-text-muted)", margin: "5px 0 0" }, children: templateNote })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "editor-disclosure", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("summary", { children: "Customize this label only" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "editor-disclosure-body", children: [
            isDesignTemplate && designImageSlots.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", style: { padding: 16, display: "flex", flexDirection: "column", gap: 10 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-label", style: { marginBottom: 0 }, children: "Customize this label only" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 11, color: "var(--color-text-muted)", margin: "5px 0 0" }, children: "Image changes below affect only this product. The reusable template stays unchanged." })
              ] }),
              designImageSlots.map((slot) => {
                const overridden = Boolean(product.designImageOverrides?.[slot.id]);
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { flex: 1, fontSize: 12, color: "var(--color-text-strong-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: [
                    slot.label,
                    overridden && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--color-success-text)" }, children: " — custom" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "btn-outline btn-sm", onClick: () => handlePickDesignImage(slot.id), children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 12 }),
                    " ",
                    overridden ? "Replace…" : "Change…"
                  ] }),
                  overridden && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn-outline btn-sm", title: "Use the design's image", onClick: () => handleClearDesignImage(slot.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 12 }) })
                ] }, slot.id);
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 11, color: "var(--color-text-muted)", margin: 0 }, children: "Swap this design’s images for this label only. Other products using the template keep the design’s images." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", htmlFor: "label-background-hex", children: "Label Background" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "label-background-hex",
                    type: "color",
                    value: product.labelBackgroundColor || globalLabelBackground || activeTemplate.shellColor,
                    onChange: (e) => update("labelBackgroundColor", e.target.value),
                    "aria-label": "Label background color",
                    style: { width: 44, height: 36, padding: 2, border: "1px solid var(--color-border)", borderRadius: 6, background: "var(--color-surface)", cursor: "pointer" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    className: "input",
                    "aria-label": "Label background hex value",
                    value: product.labelBackgroundColor || "",
                    onChange: (e) => update("labelBackgroundColor", e.target.value),
                    placeholder: "Using global default",
                    pattern: "^#[0-9A-Fa-f]{6}$",
                    maxLength: 7
                  }
                ),
                product.labelBackgroundColor && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn-outline", onClick: () => update("labelBackgroundColor", ""), children: "Use Global" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 11, color: "var(--color-text-muted)", marginTop: 5 }, children: "Inheritance: reusable template → global color in Settings → this-label override. Leave blank to inherit the global color." }),
              onOpenDesigner && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn-ghost btn-sm", style: { marginTop: 8 }, onClick: () => onOpenDesigner(product.templateId), children: "Manage reusable templates in Designer" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "label-text", htmlFor: "product-price", children: [
            "Price ",
            usesPrice && product.showPrice !== false ? "*" : "(optional)"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "product-price",
              className: "input",
              placeholder: "e.g. $9.99/lb",
              value: product.price ?? "",
              onChange: (e) => update("price", e.target.value),
              maxLength: 30
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 11, color: "var(--color-text-muted)", marginTop: 5 }, children: "Include symbol and unit — e.g. $9.99/lb or $4.50 each" }),
          product.tillieProductId && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 11, color: "#b45309", marginTop: 5 }, children: "This label is linked to Tillie — name, price, and category are overwritten by the register on each sync. Change the price in Tillie to keep them in step." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", htmlFor: "product-category", children: "Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "product-category",
              className: "input",
              placeholder: "e.g. Grab & Go, Sauces, Cheese…",
              value: product.category ?? "",
              onChange: (e) => update("category", e.target.value),
              list: "product-categories",
              maxLength: 60
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("datalist", { id: "product-categories", children: categories.map((category) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: category }, category)) })
        ] }),
        activeTemplate.layout === "vertical-info" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", htmlFor: "customer-name", children: "Customer / Order Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "customer-name",
              className: "input",
              placeholder: "e.g. The Smith Family",
              value: product.customerName ?? "",
              onChange: (e) => update("customerName", e.target.value),
              maxLength: 60
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 11, color: "var(--color-text-muted)", marginTop: 5 }, children: "Shown at the bottom of the catering instruction label." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "editor-disclosure", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("summary", { children: "Advanced label details" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "editor-disclosure-body", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", style: { padding: 16, display: "flex", flexDirection: "column", gap: 14 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-label", style: { marginBottom: 0 }, children: "Details Panel" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", htmlFor: "serving-info", children: "Serving Info" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "textarea",
                  {
                    id: "serving-info",
                    className: "input",
                    rows: 2,
                    placeholder: "e.g. Serving Size: 1 oz | Calories 25",
                    value: product.servingInfo ?? "",
                    onChange: (e) => update("servingInfo", e.target.value),
                    style: { resize: "vertical", minHeight: 56 }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", htmlFor: "nutrition-info", children: "Nutrition Info" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "textarea",
                  {
                    id: "nutrition-info",
                    className: "input",
                    rows: 3,
                    placeholder: "e.g. Total Fat 0g | Total Carbohydrates 3g | Sodium 150mg | Protein 1g",
                    value: product.nutritionInfo ?? "",
                    onChange: (e) => update("nutritionInfo", e.target.value),
                    style: { resize: "vertical", minHeight: 72 }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", htmlFor: "cooking-instructions", children: "Cooking Instructions" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "textarea",
                  {
                    id: "cooking-instructions",
                    className: "input",
                    rows: 2,
                    placeholder: "e.g. Fry at 365° for 5 minutes",
                    value: product.cookingInstructions ?? "",
                    onChange: (e) => update("cookingInstructions", e.target.value),
                    style: { resize: "vertical", minHeight: 56 }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", htmlFor: "ingredients", children: "Ingredients" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "textarea",
                  {
                    id: "ingredients",
                    className: "input",
                    rows: 3,
                    placeholder: "e.g. water, chickpea flour, salt",
                    value: product.ingredients ?? "",
                    onChange: (e) => update("ingredients", e.target.value),
                    style: { resize: "vertical", minHeight: 72 }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", htmlFor: "allergen-note", children: "Allergen / Handling Note" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "textarea",
                  {
                    id: "allergen-note",
                    className: "input",
                    rows: 3,
                    placeholder: "e.g. Manufactured on equipment that also handles eggs, wheat...",
                    value: product.allergenStatement ?? "",
                    onChange: (e) => update("allergenStatement", e.target.value),
                    style: { resize: "vertical", minHeight: 72 }
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", style: { padding: 16, display: "flex", flexDirection: "column", gap: 12 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-label", style: { marginBottom: 0 }, children: "Display Options" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { style: { display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--color-text-strong-secondary)", cursor: "pointer" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: product.showPrice !== false,
                    onChange: (e) => updateFlag("showPrice", e.target.checked),
                    disabled: !usesPrice
                  }
                ),
                "Show price on label"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { style: { display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--color-text-strong-secondary)", cursor: "pointer" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: product.showBarcode !== false,
                    onChange: (e) => updateFlag("showBarcode", e.target.checked),
                    disabled: !usesBarcode
                  }
                ),
                "Show barcode on label"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { style: { display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--color-text-strong-secondary)", cursor: "pointer" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: product.showCookingInstructions !== false,
                    onChange: (e) => updateFlag("showCookingInstructions", e.target.checked),
                    disabled: !usesCookingInstructions
                  }
                ),
                "Show cooking instructions"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { style: { display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--color-text-strong-secondary)", cursor: "pointer" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: product.showProductName !== false,
                    onChange: (e) => updateFlag("showProductName", e.target.checked),
                    disabled: !usesProductNameToggle
                  }
                ),
                "Show product name on label"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 11, color: "var(--color-text-muted)", margin: 0 }, children: "Disabled options are ignored by the selected template." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", style: { padding: 16, display: "flex", flexDirection: "column", gap: 12 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-label", style: { marginBottom: 0 }, children: "Top Image" }) }),
              logoDataUri ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: logoDataUri,
                    alt: "Uploaded top image",
                    style: { width: 88, height: 44, objectFit: "contain", background: "var(--color-neutral-soft)", border: "1px solid var(--color-border)", borderRadius: 6, padding: 4 }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, color: "var(--color-text-secondary)", flex: 1 }, children: "Fills the image area at the top of the label." }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleRemoveLogo, className: "btn-ghost btn-sm", style: { color: "#f87171" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 12 }),
                  " Remove"
                ] })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleUploadLogo, className: "btn-outline btn-sm", style: { alignSelf: "flex-start" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 12 }),
                " Upload image"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 11, color: "var(--color-text-muted)", margin: 0 }, children: "Leave this empty to use the selected template’s default logo. An uploaded image overrides it for this product only." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", style: { padding: 16, display: "flex", flexDirection: "column", gap: 12 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-label", style: { marginBottom: 0 }, children: "Barcode (Code 128)" }),
                regenConfirm ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 6 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: "#d97706" }, children: "Confirm?" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleRegen, className: "btn-danger btn-sm", children: "Yes" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setRegenConfirm(false), className: "btn-ghost btn-sm", children: "Cancel" })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleRegen, className: "btn-outline btn-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 11 }),
                  " Regenerate"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", htmlFor: "barcode-number", children: "Barcode Number" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "barcode-number",
                    className: "input",
                    placeholder: "Type barcode value",
                    value: product.barcodeValue ?? "",
                    onChange: (e) => update("barcodeValue", e.target.value),
                    maxLength: 80,
                    style: { fontFamily: "monospace", letterSpacing: "0.04em" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 11, color: "var(--color-text-muted)", marginTop: 5 }, children: "You can type your own barcode or regenerate one automatically." }),
                usesBarcode && product.showBarcode !== false && barcodeValidity === false && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 11, color: "var(--color-danger-text)", marginTop: 5 }, children: "This value cannot be rendered as Code 128." }),
                usesBarcode && product.showBarcode !== false && barcodeValidity === true && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 11, color: "var(--color-success-text)", marginTop: 5 }, children: "Valid Code 128 value." })
              ] }),
              barcodeOverrideDataUri ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: barcodeOverrideDataUri,
                    alt: "Uploaded barcode",
                    style: { height: 36, objectFit: "contain", background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 6, padding: 4 }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, color: "var(--color-text-secondary)", flex: 1 }, children: "Custom uploaded image (overrides typed/generated barcode)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleRemoveBarcodeImage, className: "btn-ghost btn-sm", style: { color: "#f87171" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 12 }),
                  " Remove"
                ] })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleUploadBarcode, className: "btn-outline btn-sm", style: { alignSelf: "flex-start" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 12 }),
                " Upload image"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          fontSize: 12,
          color: "#78716c",
          background: "var(--color-warning-surface)",
          border: "1px solid var(--color-warning-border)",
          borderRadius: 8,
          padding: "10px 14px"
        }, children: [
          "When printing, set scale to ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "100% / Actual Size" }),
          '. Do not use "Fit to page."'
        ] })
      ] }) })
    ] })
  ] });
}
export {
  Editor as default
};
