import { o as createLucideIcon, v as reactExports, m as assessProductContentFit, t as jsxRuntimeExports, f as Printer, F as FileText, C as CircleAlert, b as CircleCheck, X, u as outputEligibilityError, n as confirmUsingSavedTillieData, r as getLabelTemplate } from "./index-BxS2c6tc.js";
import { A as ArrowLeft, L as LabelPreview } from "./LabelPreview-CQjzg-BK.js";
import "./DesignLabelSvg-zfcFaBcf.js";
/**
 * @license lucide-react v0.390.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const RotateCcw = createLucideIcon("RotateCcw", [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
]);
const PLS_780 = {
  id: "pls780",
  name: "Premium Label Supply PLS780",
  pageWidthIn: 8.5,
  pageHeightIn: 11,
  labelWidthIn: 2.5,
  // portrait label width / landscape slot height
  labelHeightIn: 4,
  // portrait label height / landscape slot width
  labelsPerSheet: 8,
  columns: 2,
  rows: 4,
  marginTopIn: 0.5,
  marginLeftIn: 0.15625,
  horizontalGapIn: 0.1875,
  verticalGapIn: 0
};
function slotPosition(slot) {
  const idx = slot - 1;
  return { col: idx % PLS_780.columns, row: Math.floor(idx / PLS_780.columns) };
}
const PLS_780_SLOT_WIDTH_IN = PLS_780.labelHeightIn;
const PLS_780_SLOT_HEIGHT_IN = PLS_780.labelWidthIn;
function toInches(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const parsed = Number.parseFloat(String(value ?? "").trim());
  return Number.isFinite(parsed) ? parsed : 0;
}
function getSlotBoundsIn(slot, offsetXIn = 0, offsetYIn = 0) {
  const { col, row } = slotPosition(slot);
  return {
    leftIn: PLS_780.marginLeftIn + col * (PLS_780_SLOT_WIDTH_IN + PLS_780.horizontalGapIn) + offsetXIn,
    topIn: PLS_780.marginTopIn + row * (PLS_780_SLOT_HEIGHT_IN + PLS_780.verticalGapIn) + offsetYIn,
    widthIn: PLS_780_SLOT_WIDTH_IN,
    heightIn: PLS_780_SLOT_HEIGHT_IN
  };
}
const SHEET_DRAFT_KEY = "tillie:sheet-draft-v1";
const CALIBRATION_CACHE_KEY = "tillie:sheet-calibration-cache-v1";
function isSheetDraft(value) {
  if (!value || typeof value !== "object") return false;
  const draft = value;
  return draft.version === 1 && (draft.mode === "fill" || draft.mode === "manual") && Array.isArray(draft.slotIds) && draft.slotIds.length === PLS_780.labelsPerSheet && draft.slotIds.every((id) => id === null || typeof id === "string") && (draft.fillProductId === null || typeof draft.fillProductId === "string") && Number.isFinite(draft.startSlot) && Number.isFinite(draft.fillCount) && (draft.reviewAction === "print" || draft.reviewAction === "export") && typeof draft.updatedAt === "string";
}
function SheetBuilder({ initialProducts, onBack, onRepairIssue }) {
  const [slots, setSlots] = reactExports.useState(
    Array.from({ length: PLS_780.labelsPerSheet }, () => ({ product: null }))
  );
  const [allProducts, setAllProducts] = reactExports.useState([]);
  const [settings, setSettings] = reactExports.useState(null);
  const [cachedCalibration, setCachedCalibration] = reactExports.useState(null);
  const [calibrationSource, setCalibrationSource] = reactExports.useState("loading");
  const [settingsLoadError, setSettingsLoadError] = reactExports.useState("");
  const [startSlot, setStartSlot] = reactExports.useState(1);
  const [fillProduct, setFillProduct] = reactExports.useState(null);
  const [fillCount, setFillCount] = reactExports.useState(PLS_780.labelsPerSheet);
  const [exporting, setExporting] = reactExports.useState(false);
  const [printing, setPrinting] = reactExports.useState(false);
  const [activeSlot, setActiveSlot] = reactExports.useState(null);
  const [mode, setMode] = reactExports.useState("fill");
  const [outcome, setOutcome] = reactExports.useState("");
  const [calibrationOpen, setCalibrationOpen] = reactExports.useState(false);
  const [calibrationX, setCalibrationX] = reactExports.useState("0");
  const [calibrationY, setCalibrationY] = reactExports.useState("0");
  const [calibrationSaving, setCalibrationSaving] = reactExports.useState(false);
  const [calibrationError, setCalibrationError] = reactExports.useState("");
  const [printError, setPrintError] = reactExports.useState("");
  const [lastSheetIds, setLastSheetIds] = reactExports.useState([]);
  const [reviewOpen, setReviewOpen] = reactExports.useState(false);
  const [reviewAction, setReviewAction] = reactExports.useState("print");
  const [printers, setPrinters] = reactExports.useState([]);
  const [sheetPrinterName, setSheetPrinterName] = reactExports.useState("");
  const sheetPrinterInitRef = reactExports.useRef(false);
  const reviewRef = reactExports.useRef(null);
  const printTriggerRef = reactExports.useRef(null);
  const exportTriggerRef = reactExports.useRef(null);
  const activeReviewTriggerRef = reactExports.useRef(null);
  const [horizontalDirection, setHorizontalDirection] = reactExports.useState("none");
  const [verticalDirection, setVerticalDirection] = reactExports.useState("none");
  const [horizontalDistance, setHorizontalDistance] = reactExports.useState("0.000");
  const [verticalDistance, setVerticalDistance] = reactExports.useState("0.000");
  const [draftReady, setDraftReady] = reactExports.useState(false);
  const [draftStatus, setDraftStatus] = reactExports.useState("loading");
  const [draftMessage, setDraftMessage] = reactExports.useState("Loading automatic draft…");
  const [draftSavedAt, setDraftSavedAt] = reactExports.useState(null);
  const [draftRetryNonce, setDraftRetryNonce] = reactExports.useState(0);
  const [draftRestoreWarning, setDraftRestoreWarning] = reactExports.useState("");
  const restoredCalibrationRef = reactExports.useRef(false);
  const preflightRequestRef = reactExports.useRef(0);
  const [renderedSheetFitIssues, setRenderedSheetFitIssues] = reactExports.useState(null);
  const [preflightStatus, setPreflightStatus] = reactExports.useState("checking");
  const [preflightError, setPreflightError] = reactExports.useState("");
  reactExports.useEffect(() => {
    window.api.print.listPrinters().then((r) => {
      if (r.ok) setPrinters(r.data);
    });
  }, []);
  reactExports.useEffect(() => {
    if (settings && !sheetPrinterInitRef.current) {
      sheetPrinterInitRef.current = true;
      setSheetPrinterName(settings.sheetPrinterName ?? "");
    }
  }, [settings]);
  reactExports.useEffect(() => {
    if (!reviewOpen) return;
    const dialog = reviewRef.current;
    dialog?.querySelector('[data-primary-review-action="true"]')?.focus();
    const background = [document.querySelector(".sidebar"), document.querySelector(".sheet-toolbar"), document.querySelector(".sheet-workspace")].filter(Boolean);
    background.forEach((element) => element.setAttribute("inert", ""));
    function onKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        setReviewOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = dialog?.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      background.forEach((element) => element.removeAttribute("inert"));
      window.requestAnimationFrame(() => activeReviewTriggerRef.current?.focus());
    };
  }, [reviewOpen]);
  reactExports.useEffect(() => {
    window.api.product.list().then((r) => {
      if (r.ok) {
        setAllProducts(r.data);
        try {
          const previous = JSON.parse(localStorage.getItem("tillie:last-sheet") || "[]");
          setLastSheetIds(Array.isArray(previous) ? previous.slice(0, PLS_780.labelsPerSheet) : []);
        } catch {
          setLastSheetIds([]);
        }
        if (initialProducts.length === 1) {
          setFillProduct(initialProducts[0]);
          setMode("fill");
        } else if (initialProducts.length > 1) {
          const newSlots = Array.from({ length: PLS_780.labelsPerSheet }, () => ({ product: null }));
          initialProducts.slice(0, PLS_780.labelsPerSheet).forEach((product, index) => {
            newSlots[index].product = product;
          });
          setSlots(newSlots);
          setMode("manual");
        } else {
          try {
            const storedDraft = JSON.parse(localStorage.getItem(SHEET_DRAFT_KEY) || "null");
            if (isSheetDraft(storedDraft)) {
              const draft = storedDraft;
              const byId = new Map(r.data.map((product) => [product.id, product]));
              const restored = Array.from({ length: PLS_780.labelsPerSheet }, (_, index) => ({ product: draft.slotIds[index] ? byId.get(draft.slotIds[index]) ?? null : null }));
              const missingSlots = draft.slotIds.flatMap((id, index) => id && !byId.has(id) ? [index + 1] : []);
              setSlots(restored);
              setMode(draft.mode);
              setFillProduct(draft.fillProductId ? byId.get(draft.fillProductId) ?? null : null);
              setStartSlot(Math.min(PLS_780.labelsPerSheet, Math.max(1, draft.startSlot || 1)));
              setFillCount(Math.min(PLS_780.labelsPerSheet, Math.max(1, draft.fillCount || PLS_780.labelsPerSheet)));
              setReviewAction(draft.reviewAction);
              setCalibrationOpen(draft.calibrationOpen);
              setCalibrationX(draft.calibrationX);
              setCalibrationY(draft.calibrationY);
              restoredCalibrationRef.current = true;
              setHorizontalDirection(draft.horizontalDirection);
              setVerticalDirection(draft.verticalDirection);
              setHorizontalDistance(draft.horizontalDistance);
              setVerticalDistance(draft.verticalDistance);
              const savedAt = new Date(draft.updatedAt);
              setDraftSavedAt(Number.isNaN(savedAt.getTime()) ? null : savedAt);
              if (missingSlots.length) {
                setDraftStatus("warning");
                setDraftMessage(`Draft restored, but unavailable products left slot${missingSlots.length === 1 ? "" : "s"} ${missingSlots.join(", ")} empty.`);
                setDraftRestoreWarning(`Some products in the saved draft are no longer available. Physical slot${missingSlots.length === 1 ? "" : "s"} ${missingSlots.join(", ")} remain empty; review them before output.`);
              } else {
                setDraftStatus("restored");
                setDraftMessage("Automatic draft restored with all eight slot positions preserved.");
              }
            }
          } catch {
            try {
              localStorage.removeItem(SHEET_DRAFT_KEY);
            } catch {
            }
            setDraftStatus("warning");
            setDraftMessage("The saved draft was unreadable and was not restored. This sheet will replace it when saving is available.");
            setDraftRestoreWarning("The previous automatic draft was unreadable. Review this sheet before output; a new valid draft will replace it.");
          }
        }
        if (initialProducts.length > 0) {
          setDraftStatus("saving");
          setDraftMessage("Preparing automatic draft…");
        }
        setDraftReady(true);
      } else {
        setDraftStatus("unavailable");
        setDraftMessage("Products could not be loaded, so the automatic draft is paused.");
      }
    });
    void loadSheetSettings();
  }, [initialProducts]);
  async function loadSheetSettings() {
    setCalibrationSource("loading");
    setSettingsLoadError("");
    let result;
    try {
      result = await window.api.settings.get();
    } catch {
      result = { ok: false, error: "Settings service could not be reached." };
    }
    if (result.ok) {
      setSettings(result.data);
      const cache = { x: result.data.sheetOffsetXIn || "0", y: result.data.sheetOffsetYIn || "0", savedAt: (/* @__PURE__ */ new Date()).toISOString() };
      setCachedCalibration(cache);
      try {
        localStorage.setItem(CALIBRATION_CACHE_KEY, JSON.stringify(cache));
      } catch {
      }
      setCalibrationSource("live");
      if (!restoredCalibrationRef.current) {
        setCalibrationX(cache.x);
        setCalibrationY(cache.y);
      }
      return;
    }
    setSettingsLoadError(result.error);
    try {
      const cached = JSON.parse(localStorage.getItem(CALIBRATION_CACHE_KEY) || "null");
      if (cached && typeof cached.x === "string" && typeof cached.y === "string" && typeof cached.savedAt === "string") {
        setCachedCalibration({ x: cached.x, y: cached.y, savedAt: cached.savedAt });
        setCalibrationSource("cached");
        if (!restoredCalibrationRef.current) {
          setCalibrationX(cached.x);
          setCalibrationY(cached.y);
        }
        return;
      }
    } catch {
    }
    setCalibrationSource("unavailable");
  }
  reactExports.useEffect(() => {
    if (!draftReady) return;
    setDraftStatus("saving");
    setDraftMessage("Saving draft…");
    const timer = window.setTimeout(() => {
      const savedAt = /* @__PURE__ */ new Date();
      const draft = {
        version: 1,
        mode,
        slotIds: buildDisplaySlots().map((product) => product?.id ?? null),
        fillProductId: fillProduct?.id ?? null,
        startSlot,
        fillCount,
        reviewAction,
        calibrationOpen,
        calibrationX,
        calibrationY,
        horizontalDirection,
        verticalDirection,
        horizontalDistance,
        verticalDistance,
        updatedAt: savedAt.toISOString()
      };
      try {
        localStorage.setItem(SHEET_DRAFT_KEY, JSON.stringify(draft));
        setDraftSavedAt(savedAt);
        setDraftStatus("saved");
        setDraftMessage(`Draft saved at ${savedAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`);
      } catch {
        setDraftStatus("unavailable");
        setDraftMessage("Automatic draft could not be saved. Keep this window open and retry before leaving.");
      }
    }, 250);
    return () => window.clearTimeout(timer);
  }, [draftReady, draftRetryNonce, mode, slots, fillProduct, startSlot, fillCount, reviewAction, calibrationOpen, calibrationX, calibrationY, horizontalDirection, verticalDirection, horizontalDistance, verticalDistance]);
  function discardDraft() {
    try {
      localStorage.removeItem(SHEET_DRAFT_KEY);
      setDraftSavedAt(null);
      setDraftStatus("saved");
      setDraftMessage("Saved draft discarded. New changes will save automatically.");
    } catch {
      setDraftStatus("unavailable");
      setDraftMessage("The saved draft could not be discarded because local storage is unavailable.");
    }
  }
  function setSlotProduct(slotIndex, product) {
    setSlots((prev) => {
      const next = [...prev];
      next[slotIndex] = { product };
      return next;
    });
  }
  async function handleExport() {
    const outputSlots = buildDisplaySlots();
    if (!outputSlots.some(Boolean)) {
      setPrintError("Assign at least one product before exporting a sheet.");
      return;
    }
    if (!calibrationKnown) {
      setPrintError("Calibration settings are unavailable. Retry settings before exporting.");
      return;
    }
    if (preflightStatus !== "checked") {
      setPrintError(preflightStatus === "checking" ? "Wait for rendered-output verification to finish." : "Retry rendered-output verification before exporting.");
      return;
    }
    const eligibilityError = outputEligibilityError(outputSlots.flatMap((product, index) => product ? [{ product, slot: index + 1 }] : []), "Sheet PDF export");
    if (eligibilityError) {
      setPrintError(eligibilityError);
      return;
    }
    if (!confirmUsingSavedTillieData(outputSlots.filter((product) => Boolean(product)))) return;
    setPrintError("");
    setExporting(true);
    const result = await window.api.export.sheetPDF(outputSlots);
    if (!result.ok) setPrintError(`Sheet export failed: ${result.error}. Check the export folder and try again.`);
    else if (result.data) {
      const ids = outputSlots.map((product) => product?.id ?? null);
      try {
        localStorage.setItem("tillie:last-sheet", JSON.stringify(ids));
      } catch {
        setDraftStatus("warning");
        setDraftMessage("The PDF was exported, but Repeat Last Sheet could not be saved.");
      }
      setLastSheetIds(ids);
      setOutcome("Print-sheet PDF exported and ready to print at actual size.");
      setReviewOpen(false);
    }
    setExporting(false);
  }
  async function handlePrintDirect(kind = "final") {
    const outputSlots = buildDisplaySlots();
    if (!outputSlots.some(Boolean)) {
      setPrintError("Assign at least one product before printing a sheet.");
      return;
    }
    if (!calibrationKnown) {
      setPrintError("Calibration settings are unavailable. Retry settings before printing.");
      return;
    }
    if (preflightStatus !== "checked") {
      setPrintError(preflightStatus === "checking" ? "Wait for rendered-output verification to finish." : "Retry rendered-output verification before printing.");
      return;
    }
    const eligibilityError = outputEligibilityError(outputSlots.flatMap((product, index) => product ? [{ product, slot: index + 1 }] : []), "Sheet printing");
    if (eligibilityError) {
      setPrintError(eligibilityError);
      return;
    }
    if (!confirmUsingSavedTillieData(outputSlots.filter((product) => Boolean(product)))) return;
    setPrintError("");
    setPrinting(true);
    window.api.settings.set("sheetPrinterName", sheetPrinterName);
    const result = await window.api.print.sheet(outputSlots, { printerName: sheetPrinterName });
    if (!result.ok) {
      setPrintError(`The sheet could not be sent to the printer: ${result.error}`);
    } else if (result.data) {
      const ids = outputSlots.map((product) => product?.id ?? null);
      try {
        localStorage.setItem("tillie:last-sheet", JSON.stringify(ids));
      } catch {
        setDraftStatus("warning");
        setDraftMessage("The sheet was sent to the printer, but Repeat Last Sheet could not be saved.");
      }
      setLastSheetIds(ids);
      const printerLabel = sheetPrinterLabel();
      setOutcome(kind === "test" ? `Test sheet sent to ${printerLabel} at 100% scale. Measure the result before changing calibration.` : `Sheet sent to ${printerLabel} at 100% scale. Check the printer to confirm it finished.`);
      if (kind === "final") setReviewOpen(false);
    } else {
      setOutcome("The sheet was not sent to the printer.");
    }
    setPrinting(false);
  }
  function buildDisplaySlots() {
    if (mode === "fill" && fillProduct) {
      return Array.from({ length: PLS_780.labelsPerSheet }, (_, i) => {
        const slot = i + 1;
        if (slot < startSlot) return null;
        if (slot - startSlot < fillCount) return fillProduct;
        return null;
      });
    }
    return slots.map((s) => s.product);
  }
  async function saveCalibration() {
    const x = Number(calibrationX);
    const y = Number(calibrationY);
    if (!Number.isFinite(x) || !Number.isFinite(y) || Math.abs(x) > 0.5 || Math.abs(y) > 0.5) {
      setCalibrationError("Enter offsets between -0.500 and +0.500 inches.");
      return;
    }
    setCalibrationSaving(true);
    setCalibrationError("");
    const result = await window.api.settings.setMany({ sheetOffsetXIn: x.toFixed(3), sheetOffsetYIn: y.toFixed(3) });
    setCalibrationSaving(false);
    if (!result.ok) {
      setCalibrationError(result.error);
      return;
    }
    setSettings((current) => current ? { ...current, sheetOffsetXIn: x.toFixed(3), sheetOffsetYIn: y.toFixed(3) } : current);
    const cache = { x: x.toFixed(3), y: y.toFixed(3), savedAt: (/* @__PURE__ */ new Date()).toISOString() };
    setCachedCalibration(cache);
    setCalibrationSource("live");
    try {
      localStorage.setItem(CALIBRATION_CACHE_KEY, JSON.stringify(cache));
    } catch {
    }
    setOutcome("Calibration saved for PLS780 sheets.");
    setCalibrationOpen(false);
  }
  function applyMeasuredCorrection() {
    const horizontal = Math.abs(Number(horizontalDistance));
    const vertical = Math.abs(Number(verticalDistance));
    if (!Number.isFinite(horizontal) || !Number.isFinite(vertical) || horizontal > 0.5 || vertical > 0.5) {
      setCalibrationError("Measured distances must be between 0 and 0.500 inches.");
      return;
    }
    const x = horizontalDirection === "left" ? horizontal : horizontalDirection === "right" ? -horizontal : 0;
    const y = verticalDirection === "up" ? vertical : verticalDirection === "down" ? -vertical : 0;
    setCalibrationX(x.toFixed(3));
    setCalibrationY(y.toFixed(3));
    setCalibrationError("");
  }
  async function handleCalibrationTest() {
    setPrinting(true);
    setPrintError("");
    const result = await window.api.print.calibrationSheet({ printerName: sheetPrinterName });
    setPrinting(false);
    if (!result.ok) setPrintError(`Calibration test could not print: ${result.error}`);
    else if (result.data) setOutcome(`Calibration pattern sent to ${sheetPrinterLabel()} at 100% scale. Measure the outlines against the label edges.`);
    else setOutcome("The calibration pattern was not sent to the printer.");
  }
  function sheetPrinterLabel() {
    if (!sheetPrinterName) return "the system default printer";
    const printer = printers.find((p) => p.name === sheetPrinterName);
    return printer?.displayName || sheetPrinterName;
  }
  const displaySlots = buildDisplaySlots();
  const displaySignature = JSON.stringify(displaySlots.map((product) => product ? [product.id, product.updatedAt, product.templateId, product.name, product.price, product.ingredients, product.cookingInstructions, product.allergenStatement] : null));
  const filled = displaySlots.filter(Boolean).length;
  const readyToPrint = filled > 0;
  const estimatedSheetFitIssues = reactExports.useMemo(() => {
    return displaySlots.flatMap((product, index) => {
      if (!product) return [];
      return assessProductContentFit(product).map((issue) => ({ ...issue, product, productName: product.name || `Slot ${index + 1}`, slot: index + 1 }));
    });
  }, [displaySignature]);
  const sheetFitIssues = renderedSheetFitIssues ?? estimatedSheetFitIssues;
  const clippedSheetIssues = sheetFitIssues.filter((issue) => issue.status === "clipped");
  const offsetX = toInches(settings?.sheetOffsetXIn ?? cachedCalibration?.x);
  const offsetY = toInches(settings?.sheetOffsetYIn ?? cachedCalibration?.y);
  const calibrationKnown = calibrationSource === "live" || calibrationSource === "cached";
  const proposedX = toInches(calibrationX);
  const proposedY = toInches(calibrationY);
  const calibrationHasProposal = Math.abs(proposedX - offsetX) > 5e-4 || Math.abs(proposedY - offsetY) > 5e-4;
  async function runSheetPreflight() {
    const requestId = ++preflightRequestRef.current;
    const currentSlots = buildDisplaySlots();
    const entries = currentSlots.flatMap((product, index) => product ? [{ product, slot: index + 1 }] : []);
    if (!entries.length) {
      setRenderedSheetFitIssues([]);
      setPreflightStatus("checked");
      setPreflightError("");
      return;
    }
    setPreflightStatus("checking");
    setPreflightError("");
    setRenderedSheetFitIssues(null);
    let result;
    try {
      result = await window.api.output.preflight(entries);
    } catch {
      if (requestId !== preflightRequestRef.current) return;
      setPreflightStatus("unavailable");
      setPreflightError("Tillie Print could not reach the output verifier. Check the app connection and retry.");
      return;
    }
    if (requestId !== preflightRequestRef.current) return;
    if (!result.ok) {
      setPreflightStatus("unavailable");
      setPreflightError("Tillie Print could not verify the rendered sheet. Print and PDF remain blocked until the check succeeds.");
      return;
    }
    const mapped = result.data.flatMap((issue) => {
      const slot = issue.slot ?? 0;
      const product = slot ? currentSlots[slot - 1] : currentSlots.find((candidate) => candidate?.id === issue.productId);
      return product ? [{ ...issue, product, productName: product.name || `Slot ${slot}`, slot }] : [];
    });
    setRenderedSheetFitIssues(mapped);
    setPreflightStatus("checked");
  }
  reactExports.useEffect(() => {
    const requestId = ++preflightRequestRef.current;
    setRenderedSheetFitIssues(null);
    setPreflightStatus("checking");
    setPreflightError("");
    const entries = displaySlots.flatMap((product, index) => product ? [{ product, slot: index + 1 }] : []);
    if (!entries.length) {
      setRenderedSheetFitIssues([]);
      setPreflightStatus("checked");
      return;
    }
    let alive = true;
    window.api.output.preflight(entries).then((result) => {
      if (!alive || requestId !== preflightRequestRef.current) return;
      if (!result.ok) {
        setPreflightStatus("unavailable");
        setPreflightError("Tillie Print could not verify the rendered sheet. Print and PDF remain blocked until the check succeeds.");
        return;
      }
      const mapped = result.data.flatMap((issue) => {
        const slot = issue.slot ?? 0;
        const product = slot ? displaySlots[slot - 1] : displaySlots.find((candidate) => candidate?.id === issue.productId);
        return product ? [{ ...issue, product, productName: product.name || `Slot ${slot}`, slot }] : [];
      });
      setRenderedSheetFitIssues(mapped);
      setPreflightStatus("checked");
    }).catch(() => {
      if (!alive || requestId !== preflightRequestRef.current) return;
      setPreflightStatus("unavailable");
      setPreflightError("Tillie Print could not reach the output verifier. Check the app connection and retry.");
    });
    return () => {
      alive = false;
    };
  }, [displaySignature]);
  function repeatLastSheet() {
    const restored = lastSheetIds.slice(0, PLS_780.labelsPerSheet).map((id) => id ? allProducts.find((product) => product.id === id) ?? null : null);
    if (!restored.some(Boolean)) {
      setPrintError("The previous sheet’s products are no longer available.");
      return;
    }
    const next = Array.from({ length: PLS_780.labelsPerSheet }, () => ({ product: null }));
    restored.forEach((product, index) => {
      next[index].product = product;
    });
    setSlots(next);
    setMode("manual");
    const restoredCount = restored.filter(Boolean).length;
    setOutcome(`Restored the last sheet with ${restoredCount} label${restoredCount === 1 ? "" : "s"} in their original physical slots.`);
    setPrintError("");
  }
  function clearSheet() {
    setSlots(Array.from({ length: PLS_780.labelsPerSheet }, () => ({ product: null })));
    setFillProduct(null);
    setStartSlot(1);
    setFillCount(PLS_780.labelsPerSheet);
    setOutcome("Sheet cleared. Your saved products were not changed.");
    setPrintError("");
  }
  function duplicateActiveSlot() {
    if (activeSlot === null || !slots[activeSlot]?.product) {
      setPrintError("Select a filled manual slot before duplicating it.");
      return;
    }
    const emptyIndex = slots.findIndex((slot, index) => index > activeSlot && !slot.product);
    const fallbackIndex = slots.findIndex((slot) => !slot.product);
    const targetIndex = emptyIndex >= 0 ? emptyIndex : fallbackIndex;
    if (targetIndex < 0) {
      setPrintError("All eight physical slots are already filled.");
      return;
    }
    setSlotProduct(targetIndex, slots[activeSlot].product);
    setActiveSlot(targetIndex);
    setOutcome(`Copied slot ${activeSlot + 1} to slot ${targetIndex + 1}.`);
    setPrintError("");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "workspace-toolbar sheet-toolbar", style: {
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
        " Products"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--color-border-strong)", fontSize: 13 }, children: "/" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontSize: 16, fontWeight: 650, color: "var(--color-workbench-navy)", margin: 0 }, children: "Print Sheet Builder" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sheet-stock-badge", style: { fontSize: 11, background: "var(--color-neutral-subtle)", color: "var(--color-text-secondary)", borderRadius: 20, padding: "2px 10px", marginLeft: 4 }, children: "PLS780 · 8 labels" }),
      draftReady && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `sheet-draft-status is-${draftStatus}`, role: "status", title: draftSavedAt ? `Last saved ${draftSavedAt.toLocaleString()}` : void 0, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: draftMessage }),
        draftStatus === "unavailable" && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn-ghost btn-sm", onClick: () => setDraftRetryNonce((value) => value + 1), children: "Retry" }),
        draftSavedAt && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn-ghost btn-sm", onClick: discardDraft, children: "Discard draft" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginLeft: "auto", display: "flex", gap: 8 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { ref: printTriggerRef, onClick: () => {
          activeReviewTriggerRef.current = printTriggerRef.current;
          setReviewAction("print");
          setReviewOpen(true);
        }, disabled: printing || !readyToPrint || preflightStatus !== "checked" || !calibrationKnown, className: "btn-green btn-sm", title: !readyToPrint ? "Assign at least one product before printing" : !calibrationKnown ? "Load calibration settings before output" : preflightStatus === "checking" ? "Checking rendered output" : preflightStatus === "unavailable" ? "Retry output verification first" : "Review physical print setup", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 13 }),
          " Review & Print"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { ref: exportTriggerRef, onClick: () => {
          activeReviewTriggerRef.current = exportTriggerRef.current;
          setReviewAction("export");
          setReviewOpen(true);
        }, disabled: exporting || !readyToPrint || preflightStatus !== "checked" || !calibrationKnown, className: "btn-outline btn-sm", title: !readyToPrint ? "Assign at least one product before exporting" : !calibrationKnown ? "Load calibration settings before output" : preflightStatus === "checking" ? "Checking rendered output" : preflightStatus === "unavailable" ? "Retry output verification first" : "Review setup before exporting", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 13 }),
          " Export PDF"
        ] })
      ] })
    ] }),
    outcome && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { role: "status", "aria-live": "polite", className: "status-message", style: { display: "flex", alignItems: "center", gap: 8, padding: "8px 20px", background: "var(--color-success-surface)", color: "var(--color-success-text)", fontSize: 12 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { flex: 1 }, children: outcome }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-ghost btn-sm", onClick: () => setOutcome(""), children: "Dismiss" })
    ] }),
    printError && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { role: "alert", className: "status-message", style: { display: "flex", alignItems: "center", gap: 8, padding: "8px 20px", background: "var(--color-danger-surface)", color: "var(--color-danger-text)", fontSize: 12 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 14 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { flex: 1 }, children: printError }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-ghost btn-sm", onClick: () => setPrintError(""), children: "Dismiss" })
    ] }),
    draftRestoreWarning && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { role: "alert", className: "status-message", style: { display: "flex", alignItems: "center", gap: 8, padding: "8px 20px", background: "var(--color-warning-surface)", color: "var(--color-warning-text)", fontSize: 12 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 14 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { flex: 1 }, children: draftRestoreWarning }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-ghost btn-sm", onClick: () => setDraftRestoreWarning(""), children: "Dismiss" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sheet-workspace", style: { display: "flex", flex: 1, overflow: "hidden" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sheet-controls-pane", style: { flex: "0 0 460px", overflowY: "auto", padding: "24px 28px", background: "var(--color-surface)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { maxWidth: 520, display: "flex", flexDirection: "column", gap: 20 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", style: { padding: 16 }, "aria-label": "Print readiness preflight", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 16, style: { color: readyToPrint ? "var(--color-success-text)" : "var(--color-text-muted)" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13, fontWeight: 650 }, children: readyToPrint ? "Ready for print setup" : "Complete the sheet to print" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "print-preflight", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preflight-item", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Stock" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "PLS780 · 8 labels" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preflight-item", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Page" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "US Letter · portrait" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preflight-item", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Scale" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "100% / Actual Size" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preflight-item", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Assigned" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                filled,
                " of 8 slots"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preflight-item", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Calibration" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: calibrationSource === "cached" ? "fit-status tight" : calibrationSource === "unavailable" ? "fit-status clipped" : "", children: calibrationSource === "loading" ? "Loading saved calibration…" : calibrationSource === "unavailable" ? "Unavailable — output blocked" : `X ${offsetX >= 0 ? "+" : ""}${offsetX.toFixed(3)} · Y ${offsetY >= 0 ? "+" : ""}${offsetY.toFixed(3)} in${calibrationSource === "cached" ? ` · cached ${cachedCalibration ? new Date(cachedCalibration.savedAt).toLocaleString() : ""}` : ""}` })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preflight-item", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Slot map" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: readyToPrint ? `${displaySlots.map((product, index) => product ? index + 1 : null).filter(Boolean).join(", ")} occupied` : "Assign at least one label" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preflight-item", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Output check" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: preflightStatus === "unavailable" ? "fit-status clipped" : preflightStatus === "checking" ? "fit-status checking" : clippedSheetIssues.length ? "fit-status clipped" : sheetFitIssues.length ? "fit-status tight" : "fit-status fits", children: preflightStatus === "checking" ? "Checking rendered sheet…" : preflightStatus === "unavailable" ? "Verification unavailable" : clippedSheetIssues.length ? "Blocked — repair clipped text" : sheetFitIssues.length ? "Verified — review tight text" : "Verified for output" })
            ] })
          ] }),
          (calibrationSource === "cached" || calibrationSource === "unavailable") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: calibrationSource === "cached" ? "content-fit-callout tight" : "content-fit-callout clipped", role: "alert", style: { marginTop: 12 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: calibrationSource === "cached" ? "Using cached calibration" : "Calibration could not be loaded" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              calibrationSource === "cached" ? "The saved calibration service is unavailable. These last-known offsets remain labeled as cached throughout review and output." : "No trusted calibration value is available, so physical output is blocked.",
              " ",
              settingsLoadError
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn-outline btn-sm", onClick: () => void loadSheetSettings(), children: "Retry settings" })
          ] }),
          preflightStatus === "unavailable" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "content-fit-callout clipped", role: "alert", style: { marginTop: 12 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Output verification did not finish" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: preflightError }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn-outline btn-sm", onClick: () => void runSheetPreflight(), children: "Retry verification" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn-outline btn-sm", style: { marginTop: 12 }, onClick: () => setCalibrationOpen((open) => !open), "aria-expanded": calibrationOpen, children: calibrationOpen ? "Close calibration" : "Calibrate or test this sheet" })
        ] }),
        lastSheetIds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn-outline", onClick: repeatLastSheet, style: { alignSelf: "flex-start" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { size: 13 }),
          " Repeat Last Sheet"
        ] }),
        calibrationOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", style: { padding: 16, display: "flex", flexDirection: "column", gap: 12 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13, fontWeight: 650, color: "var(--color-text)" }, children: "Calibrate PLS780 alignment" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: "5px 0 0", fontSize: 12, lineHeight: 1.5, color: "var(--color-text-secondary)" }, children: "1. Print the alignment pattern at 100% / Actual Size. 2. Measure how far it drifts. 3. Calculate and save the correction before testing again." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 110px", gap: 8 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", htmlFor: "calibration-horizontal-direction", children: "Horizontal drift" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { id: "calibration-horizontal-direction", className: "input", value: horizontalDirection, onChange: (event) => setHorizontalDirection(event.target.value), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "none", children: "No horizontal drift" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "left", children: "Print is too far left" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "right", children: "Print is too far right" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", htmlFor: "calibration-horizontal-distance", children: "Distance (in)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "calibration-horizontal-distance", className: "input", type: "number", min: 0, max: 0.5, step: 5e-3, value: horizontalDistance, onChange: (event) => setHorizontalDistance(event.target.value) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", htmlFor: "calibration-vertical-direction", children: "Vertical drift" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { id: "calibration-vertical-direction", className: "input", value: verticalDirection, onChange: (event) => setVerticalDirection(event.target.value), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "none", children: "No vertical drift" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "up", children: "Print is too far up" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "down", children: "Print is too far down" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", htmlFor: "calibration-vertical-distance", children: "Distance (in)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "calibration-vertical-distance", className: "input", type: "number", min: 0, max: 0.5, step: 5e-3, value: verticalDistance, onChange: (event) => setVerticalDistance(event.target.value) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-outline btn-sm", onClick: applyMeasuredCorrection, children: "Calculate correction" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "calibration-comparison", "aria-live": "polite", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Currently saved" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "X ",
                offsetX >= 0 ? "+" : "",
                offsetX.toFixed(3),
                " · Y ",
                offsetY >= 0 ? "+" : "",
                offsetY.toFixed(3),
                " in"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: calibrationHasProposal ? "has-proposal" : "", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Proposed" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "X ",
                proposedX >= 0 ? "+" : "",
                proposedX.toFixed(3),
                " · Y ",
                proposedY >= 0 ? "+" : "",
                proposedY.toFixed(3),
                " in"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "editor-disclosure", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("summary", { children: "Advanced signed offsets" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "editor-disclosure-body", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", htmlFor: "calibration-x", children: "Horizontal correction" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "calibration-x", className: "input", type: "number", min: -0.5, max: 0.5, step: 5e-3, value: calibrationX, onChange: (event) => setCalibrationX(event.target.value) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: "4px 0 0", fontSize: 11, color: "var(--color-text-muted)" }, children: "Positive moves right." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", htmlFor: "calibration-y", children: "Vertical correction" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "calibration-y", className: "input", type: "number", min: -0.5, max: 0.5, step: 5e-3, value: calibrationY, onChange: (event) => setCalibrationY(event.target.value) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: "4px 0 0", fontSize: 11, color: "var(--color-text-muted)" }, children: "Positive moves down." })
              ] })
            ] }) })
          ] }),
          calibrationError && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { role: "alert", style: { fontSize: 12, color: "var(--color-danger-text)" }, children: calibrationError }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-primary btn-sm", onClick: saveCalibration, disabled: calibrationSaving || !calibrationHasProposal, children: calibrationSaving ? "Saving…" : calibrationHasProposal ? "Save & update preview" : "Calibration is saved" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn-outline btn-sm", onClick: handleCalibrationTest, disabled: printing, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 12 }),
              " Print Alignment Pattern"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-label", children: "Layout mode" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setMode("fill"),
                "aria-pressed": mode === "fill",
                className: mode === "fill" ? "btn-primary btn-sm" : "btn-outline btn-sm",
                style: { flex: 1 },
                children: "Fill all with one product"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setMode("manual"),
                "aria-pressed": mode === "manual",
                className: mode === "manual" ? "btn-primary btn-sm" : "btn-outline btn-sm",
                style: { flex: 1 },
                children: "Assign slots manually"
              }
            )
          ] })
        ] }),
        mode === "fill" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", style: { padding: 16, display: "flex", flexDirection: "column", gap: 14 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", htmlFor: "sheet-fill-product", children: "Product" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                id: "sheet-fill-product",
                className: "input",
                value: fillProduct?.id ?? "",
                onChange: (e) => setFillProduct(allProducts.find((p) => p.id === e.target.value) ?? null),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— Select a product —" }),
                  allProducts.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: p.id, children: [
                    p.name,
                    " — ",
                    p.price
                  ] }, p.id))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 12 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", htmlFor: "sheet-fill-quantity", children: "Quantity" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "sheet-fill-quantity",
                  type: "number",
                  className: "input",
                  min: 1,
                  max: PLS_780.labelsPerSheet - startSlot + 1,
                  value: fillCount,
                  onChange: (e) => {
                    const remaining = PLS_780.labelsPerSheet - startSlot + 1;
                    const requested = Number(e.target.value);
                    setFillCount(Number.isFinite(requested) ? Math.min(remaining, Math.max(1, requested)) : 1);
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { margin: "4px 0 0", fontSize: 11, color: "var(--color-text-muted)" }, children: [
                Math.min(fillCount, PLS_780.labelsPerSheet - startSlot + 1),
                " label",
                Math.min(fillCount, PLS_780.labelsPerSheet - startSlot + 1) === 1 ? "" : "s",
                " will print."
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", htmlFor: "sheet-start-slot", children: "Start at slot" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  id: "sheet-start-slot",
                  className: "input",
                  value: startSlot,
                  onChange: (e) => {
                    const s = Number(e.target.value);
                    setStartSlot(s);
                    setFillCount(Math.min(fillCount, PLS_780.labelsPerSheet - s + 1));
                  },
                  children: Array.from({ length: PLS_780.labelsPerSheet }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: i + 1, children: [
                    "Slot ",
                    i + 1,
                    i === 0 ? " (top-left)" : ""
                  ] }, i + 1))
                }
              )
            ] })
          ] })
        ] }),
        mode === "manual" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", style: { padding: 16 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-label", style: { flex: 1 }, children: "Slot assignments" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-ghost btn-sm", onClick: duplicateActiveSlot, children: "Duplicate selected" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-ghost btn-sm", onClick: clearSheet, children: "Clear sheet" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }, children: slots.map((slot, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: { display: "flex", alignItems: "center", gap: 8, padding: 5, borderRadius: 6, background: activeSlot === i ? "var(--color-success-surface)" : "transparent" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 11, color: "var(--color-text-muted)", width: 40, textAlign: "right", flexShrink: 0 }, children: [
                  "#",
                  i + 1
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    "aria-label": `Product assigned to slot ${i + 1}`,
                    className: "input",
                    style: { fontSize: 12, padding: "6px 10px" },
                    value: slot.product?.id ?? "",
                    onFocus: () => setActiveSlot(i),
                    onChange: (e) => setSlotProduct(i, allProducts.find((p) => p.id === e.target.value) ?? null),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— empty —" }),
                      allProducts.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: p.id, children: p.name }, p.id))
                    ]
                  }
                )
              ]
            },
            i
          )) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sheet-preview-pane", style: {
        flex: "1 1 520px",
        minWidth: 360,
        background: "var(--color-panel)",
        borderLeft: "1px solid var(--color-border-soft)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px 20px",
        gap: 12,
        overflowY: "auto"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 11, fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }, children: "Sheet Preview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "min(100%, 440px)", background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 8, padding: 10 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "relative", background: "#d1d5db", aspectRatio: "8.5 / 11" }, children: displaySlots.map((product, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          SheetSlotPreview,
          {
            index: i,
            product,
            offsetXIn: offsetX,
            offsetYIn: offsetY,
            isActive: activeSlot === i,
            onClick: () => setActiveSlot(activeSlot === i ? null : i)
          },
          i
        )) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { fontSize: 12, color: "var(--color-text-muted)", margin: 0 }, children: [
          filled,
          " / ",
          PLS_780.labelsPerSheet,
          " slots filled"
        ] })
      ] })
    ] }),
    reviewOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "print-review-backdrop", role: "presentation", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { ref: reviewRef, className: "print-review", role: "dialog", "aria-modal": "true", "aria-labelledby": "print-review-title", "aria-describedby": "print-review-description", "aria-busy": printing || exporting, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id: "print-review-title", style: { margin: 0, fontSize: 18, color: "var(--color-text)" }, children: reviewAction === "print" ? "Review before printing" : "Review before PDF export" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { id: "print-review-description", style: { margin: "4px 0 0", fontSize: 12, color: "var(--color-text-secondary)" }, children: "Tillie Print will preserve all eight positions, including empty slots." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-icon", "aria-label": "Close print review", onClick: () => setReviewOpen(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 15 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "print-preflight", style: { marginTop: 18 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preflight-item", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Output target" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: reviewAction === "print" ? sheetPrinterLabel() : "Reviewed PDF file" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preflight-item", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Scale" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: reviewAction === "print" ? "Printed at 100% / Actual Size automatically" : "Choose 100% / Actual Size when printing; never Fit to Page" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preflight-item", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Completion" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: reviewAction === "print" ? "The app confirms the job reached the printer queue, not that paper printed." : "The app confirms when the PDF file is created." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preflight-item", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Calibration source" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: calibrationSource === "cached" ? "fit-status tight" : "", children: calibrationSource === "cached" ? `Cached from ${cachedCalibration ? new Date(cachedCalibration.savedAt).toLocaleString() : "last successful load"}` : "Current saved settings" })
        ] })
      ] }),
      reviewAction === "print" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 14 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label-text", htmlFor: "sheet-printer", children: "Printer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { id: "sheet-printer", className: "input", value: sheetPrinterName, onChange: (e) => setSheetPrinterName(e.target.value), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "System default printer" }),
          printers.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: p.name, children: [
            p.displayName || p.name,
            p.isDefault ? " (default)" : ""
          ] }, p.name))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20, flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-outline", onClick: () => {
          setReviewOpen(false);
          setCalibrationOpen(true);
        }, children: "Adjust calibration" }),
        reviewAction === "print" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn-ghost", onClick: () => setReviewAction("export"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 13 }),
            " Switch to PDF"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { "data-primary-review-action": "true", className: "btn-green", onClick: () => handlePrintDirect("final"), disabled: printing || clippedSheetIssues.length > 0, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 13 }),
            " ",
            printing ? "Printing…" : clippedSheetIssues.length ? "Resolve clipped text" : "Print Sheet"
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn-ghost", onClick: () => setReviewAction("print"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 13 }),
            " Switch to Print"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { "data-primary-review-action": "true", className: "btn-primary", onClick: handleExport, disabled: exporting || clippedSheetIssues.length > 0, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 13 }),
            " ",
            exporting ? "Exporting…" : clippedSheetIssues.length ? "Resolve clipped text" : "Export reviewed PDF"
          ] })
        ] })
      ] }),
      sheetFitIssues.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: clippedSheetIssues.length ? "content-fit-callout clipped" : "content-fit-callout tight", role: clippedSheetIssues.length ? "alert" : "status", style: { marginTop: 14 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: clippedSheetIssues.length ? "Output blocked until clipped text is resolved" : "Some content is close to its printable limit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "repair-issue-list", children: sheetFitIssues.map((issue) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { children: [
              "Slot ",
              issue.slot,
              " · ",
              issue.productName
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: issue.message })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "btn-outline btn-sm", onClick: () => {
            setReviewOpen(false);
            onRepairIssue(issue.product, issue.field);
          }, children: [
            "Edit ",
            issue.label.toLowerCase()
          ] })
        ] }, `${issue.slot}-${issue.product.id}-${issue.field}-${issue.status}`)) })
      ] })
    ] }) })
  ] });
}
function SheetSlotPreview({
  index,
  product,
  offsetXIn,
  offsetYIn,
  isActive,
  onClick
}) {
  const bounds = getSlotBoundsIn(index + 1, offsetXIn, offsetYIn);
  const pageWidth = PLS_780.pageWidthIn;
  const pageHeight = PLS_780.pageHeightIn;
  const slotLeft = bounds.leftIn / pageWidth * 100;
  const slotTop = bounds.topIn / pageHeight * 100;
  const slotWidth = bounds.widthIn / pageWidth * 100;
  const slotHeight = bounds.heightIn / pageHeight * 100;
  const SLOT_ASPECT = bounds.widthIn / bounds.heightIn;
  const template = product ? getLabelTemplate(product.templateId) : null;
  const isInfoLayout = template?.layout === "info";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      "aria-label": product ? `Select sheet slot ${index + 1}, ${product.name}` : `Select empty sheet slot ${index + 1}`,
      "aria-pressed": isActive,
      onClick,
      style: {
        position: "absolute",
        cursor: "pointer",
        overflow: "hidden",
        padding: 0,
        border: 0,
        background: product ? "white" : "var(--color-neutral-soft)",
        outline: isActive ? "2px solid #2d8f2d" : "none",
        outlineOffset: -2,
        left: `${slotLeft}%`,
        top: `${slotTop}%`,
        width: `${slotWidth}%`,
        height: `${slotHeight}%`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      },
      title: product ? product.name : `Slot ${index + 1} — empty`,
      children: product ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          style: {
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                width: isInfoLayout ? "100%" : "auto",
                height: isInfoLayout ? "auto" : `${SLOT_ASPECT * 100}%`,
                aspectRatio: isInfoLayout ? `${template?.width ?? 289} / ${template?.height ?? 181}` : "181 / 289",
                transform: isInfoLayout ? "none" : "rotate(-90deg)",
                transformOrigin: "center",
                flexShrink: 0
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(LabelPreview, { product, scale: 1 })
            }
          )
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, color: "var(--color-text-secondary)", fontWeight: 650 }, children: index + 1 })
    }
  );
}
export {
  SheetBuilder as default
};
