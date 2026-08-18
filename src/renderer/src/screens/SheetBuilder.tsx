import { useState, useEffect, useMemo, useRef } from 'react'
import { ArrowLeft, FileText, Printer, RotateCcw, CheckCircle2, AlertCircle, X } from 'lucide-react'
import LabelPreview from '../components/LabelPreview'
import type { AppSettings, PrinterInfo, Product } from '../types'
import { getLabelTemplate } from '../../../shared/labelTemplates'
import {
  getSlotBoundsIn,
  PLS_780,
  toInches,
} from '../../../shared/sheetLayout'
import { assessProductContentFit, outputEligibilityError } from '../../../shared/contentFit'
import { confirmUsingSavedTillieData } from '../lib/tillieFreshness'

interface SlotAssignment {
  product: Product | null
}

interface SheetDraft {
  version: 1
  mode: 'fill' | 'manual'
  slotIds: Array<string | null>
  fillProductId: string | null
  startSlot: number
  fillCount: number
  reviewAction: 'print' | 'export'
  calibrationOpen: boolean
  calibrationX: string
  calibrationY: string
  horizontalDirection: 'none' | 'left' | 'right'
  verticalDirection: 'none' | 'up' | 'down'
  horizontalDistance: string
  verticalDistance: string
  updatedAt: string
}

const SHEET_DRAFT_KEY = 'tillie:sheet-draft-v1'
const CALIBRATION_CACHE_KEY = 'tillie:sheet-calibration-cache-v1'
type DraftStatus = 'loading' | 'saving' | 'saved' | 'restored' | 'warning' | 'unavailable'
type PreflightStatus = 'checking' | 'checked' | 'unavailable'
type CalibrationSource = 'loading' | 'live' | 'cached' | 'unavailable'

function isSheetDraft(value: unknown): value is SheetDraft {
  if (!value || typeof value !== 'object') return false
  const draft = value as Partial<SheetDraft>
  return draft.version === 1
    && (draft.mode === 'fill' || draft.mode === 'manual')
    && Array.isArray(draft.slotIds)
    && draft.slotIds.length === PLS_780.labelsPerSheet
    && draft.slotIds.every((id) => id === null || typeof id === 'string')
    && (draft.fillProductId === null || typeof draft.fillProductId === 'string')
    && Number.isFinite(draft.startSlot) && Number.isFinite(draft.fillCount)
    && (draft.reviewAction === 'print' || draft.reviewAction === 'export')
    && typeof draft.updatedAt === 'string'
}

interface Props {
  initialProducts: Product[]
  onBack: () => void
  onRepairIssue: (product: Product, field: keyof Product) => void
}

export default function SheetBuilder({ initialProducts, onBack, onRepairIssue }: Props): JSX.Element {
  const [slots, setSlots] = useState<SlotAssignment[]>(
    Array.from({ length: PLS_780.labelsPerSheet }, () => ({ product: null }))
  )
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [cachedCalibration, setCachedCalibration] = useState<{ x: string; y: string; savedAt: string } | null>(null)
  const [calibrationSource, setCalibrationSource] = useState<CalibrationSource>('loading')
  const [settingsLoadError, setSettingsLoadError] = useState('')
  const [startSlot, setStartSlot] = useState(1)
  const [fillProduct, setFillProduct] = useState<Product | null>(null)
  const [fillCount, setFillCount] = useState<number>(PLS_780.labelsPerSheet)
  const [exporting, setExporting] = useState(false)
  const [printing, setPrinting] = useState(false)
  const [activeSlot, setActiveSlot] = useState<number | null>(null)
  const [mode, setMode] = useState<'fill' | 'manual'>('fill')
  const [outcome, setOutcome] = useState('')
  const [calibrationOpen, setCalibrationOpen] = useState(false)
  const [calibrationX, setCalibrationX] = useState('0')
  const [calibrationY, setCalibrationY] = useState('0')
  const [calibrationSaving, setCalibrationSaving] = useState(false)
  const [calibrationError, setCalibrationError] = useState('')
  const [printError, setPrintError] = useState('')
  const [lastSheetIds, setLastSheetIds] = useState<Array<string | null>>([])
  const [reviewOpen, setReviewOpen] = useState(false)
  const [reviewAction, setReviewAction] = useState<'print' | 'export'>('print')
  const [printers, setPrinters] = useState<PrinterInfo[]>([])
  const [sheetPrinterName, setSheetPrinterName] = useState('')
  const sheetPrinterInitRef = useRef(false)
  const reviewRef = useRef<HTMLElement | null>(null)
  const printTriggerRef = useRef<HTMLButtonElement | null>(null)
  const exportTriggerRef = useRef<HTMLButtonElement | null>(null)
  const activeReviewTriggerRef = useRef<HTMLButtonElement | null>(null)
  const [horizontalDirection, setHorizontalDirection] = useState<'none' | 'left' | 'right'>('none')
  const [verticalDirection, setVerticalDirection] = useState<'none' | 'up' | 'down'>('none')
  const [horizontalDistance, setHorizontalDistance] = useState('0.000')
  const [verticalDistance, setVerticalDistance] = useState('0.000')
  const [draftReady, setDraftReady] = useState(false)
  const [draftStatus, setDraftStatus] = useState<DraftStatus>('loading')
  const [draftMessage, setDraftMessage] = useState('Loading automatic draft…')
  const [draftSavedAt, setDraftSavedAt] = useState<Date | null>(null)
  const [draftRetryNonce, setDraftRetryNonce] = useState(0)
  const [draftRestoreWarning, setDraftRestoreWarning] = useState('')
  const restoredCalibrationRef = useRef(false)
  const preflightRequestRef = useRef(0)
  const [renderedSheetFitIssues, setRenderedSheetFitIssues] = useState<Array<{ field: keyof Product; label: string; status: 'tight' | 'clipped'; message: string; product: Product; productName: string; slot: number }> | null>(null)
  const [preflightStatus, setPreflightStatus] = useState<PreflightStatus>('checking')
  const [preflightError, setPreflightError] = useState('')

  useEffect(() => {
    window.api.print.listPrinters().then((r) => {
      if (r.ok) setPrinters(r.data)
    })
  }, [])

  useEffect(() => {
    if (settings && !sheetPrinterInitRef.current) {
      sheetPrinterInitRef.current = true
      setSheetPrinterName(settings.sheetPrinterName ?? '')
    }
  }, [settings])

  useEffect(() => {
    if (!reviewOpen) return
    const dialog = reviewRef.current
    dialog?.querySelector<HTMLElement>('[data-primary-review-action="true"]')?.focus()
    const background = [document.querySelector<HTMLElement>('.sidebar'), document.querySelector<HTMLElement>('.sheet-toolbar'), document.querySelector<HTMLElement>('.sheet-workspace')].filter(Boolean) as HTMLElement[]
    background.forEach((element) => element.setAttribute('inert', ''))
    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        event.preventDefault()
        setReviewOpen(false)
        return
      }
      if (event.key !== 'Tab') return
      const focusable = dialog?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])')
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      background.forEach((element) => element.removeAttribute('inert'))
      window.requestAnimationFrame(() => activeReviewTriggerRef.current?.focus())
    }
  }, [reviewOpen])

  useEffect(() => {
    window.api.product.list().then((r) => {
      if (r.ok) {
        setAllProducts(r.data)
        try {
          const previous = JSON.parse(localStorage.getItem('tillie:last-sheet') || '[]')
          setLastSheetIds(Array.isArray(previous) ? previous.slice(0, PLS_780.labelsPerSheet) : [])
        } catch { setLastSheetIds([]) }
        if (initialProducts.length === 1) {
          setFillProduct(initialProducts[0])
          setMode('fill')
        } else if (initialProducts.length > 1) {
          const newSlots: SlotAssignment[] = Array.from({ length: PLS_780.labelsPerSheet }, () => ({ product: null }))
          initialProducts.slice(0, PLS_780.labelsPerSheet).forEach((product, index) => { newSlots[index].product = product })
          setSlots(newSlots)
          setMode('manual')
        } else {
          try {
            const storedDraft = JSON.parse(localStorage.getItem(SHEET_DRAFT_KEY) || 'null') as unknown
            if (isSheetDraft(storedDraft)) {
              const draft = storedDraft
              const byId = new Map(r.data.map((product) => [product.id, product]))
              const restored = Array.from({ length: PLS_780.labelsPerSheet }, (_, index) => ({ product: draft.slotIds[index] ? byId.get(draft.slotIds[index] as string) ?? null : null }))
              const missingSlots = draft.slotIds.flatMap((id, index) => id && !byId.has(id) ? [index + 1] : [])
              setSlots(restored)
              setMode(draft.mode)
              setFillProduct(draft.fillProductId ? byId.get(draft.fillProductId) ?? null : null)
              setStartSlot(Math.min(PLS_780.labelsPerSheet, Math.max(1, draft.startSlot || 1)))
              setFillCount(Math.min(PLS_780.labelsPerSheet, Math.max(1, draft.fillCount || PLS_780.labelsPerSheet)))
              setReviewAction(draft.reviewAction)
              setCalibrationOpen(draft.calibrationOpen)
              setCalibrationX(draft.calibrationX)
              setCalibrationY(draft.calibrationY)
              restoredCalibrationRef.current = true
              setHorizontalDirection(draft.horizontalDirection)
              setVerticalDirection(draft.verticalDirection)
              setHorizontalDistance(draft.horizontalDistance)
              setVerticalDistance(draft.verticalDistance)
              const savedAt = new Date(draft.updatedAt)
              setDraftSavedAt(Number.isNaN(savedAt.getTime()) ? null : savedAt)
              if (missingSlots.length) {
                setDraftStatus('warning')
                setDraftMessage(`Draft restored, but unavailable products left slot${missingSlots.length === 1 ? '' : 's'} ${missingSlots.join(', ')} empty.`)
                setDraftRestoreWarning(`Some products in the saved draft are no longer available. Physical slot${missingSlots.length === 1 ? '' : 's'} ${missingSlots.join(', ')} remain empty; review them before output.`)
              } else {
                setDraftStatus('restored')
                setDraftMessage('Automatic draft restored with all eight slot positions preserved.')
              }
            }
          } catch {
            try { localStorage.removeItem(SHEET_DRAFT_KEY) } catch { /* storage may be unavailable */ }
            setDraftStatus('warning')
            setDraftMessage('The saved draft was unreadable and was not restored. This sheet will replace it when saving is available.')
            setDraftRestoreWarning('The previous automatic draft was unreadable. Review this sheet before output; a new valid draft will replace it.')
          }
        }
        if (initialProducts.length > 0) {
          setDraftStatus('saving')
          setDraftMessage('Preparing automatic draft…')
        }
        setDraftReady(true)
      } else {
        setDraftStatus('unavailable')
        setDraftMessage('Products could not be loaded, so the automatic draft is paused.')
      }
    })
    void loadSheetSettings()
  }, [initialProducts])

  async function loadSheetSettings(): Promise<void> {
    setCalibrationSource('loading')
    setSettingsLoadError('')
    let result
    try {
      result = await window.api.settings.get()
    } catch {
      result = { ok: false as const, error: 'Settings service could not be reached.' }
    }
    if (result.ok) {
      setSettings(result.data)
      const cache = { x: result.data.sheetOffsetXIn || '0', y: result.data.sheetOffsetYIn || '0', savedAt: new Date().toISOString() }
      setCachedCalibration(cache)
      try { localStorage.setItem(CALIBRATION_CACHE_KEY, JSON.stringify(cache)) } catch { /* live settings remain authoritative */ }
      setCalibrationSource('live')
      if (!restoredCalibrationRef.current) {
        setCalibrationX(cache.x)
        setCalibrationY(cache.y)
      }
      return
    }
    setSettingsLoadError(result.error)
    try {
      const cached = JSON.parse(localStorage.getItem(CALIBRATION_CACHE_KEY) || 'null') as { x?: unknown; y?: unknown; savedAt?: unknown } | null
      if (cached && typeof cached.x === 'string' && typeof cached.y === 'string' && typeof cached.savedAt === 'string') {
        setCachedCalibration({ x: cached.x, y: cached.y, savedAt: cached.savedAt })
        setCalibrationSource('cached')
        if (!restoredCalibrationRef.current) {
          setCalibrationX(cached.x)
          setCalibrationY(cached.y)
        }
        return
      }
    } catch { /* invalid cache is treated as unavailable */ }
    setCalibrationSource('unavailable')
  }

  useEffect(() => {
    if (!draftReady) return
    setDraftStatus('saving')
    setDraftMessage('Saving draft…')
    const timer = window.setTimeout(() => {
      const savedAt = new Date()
      const draft: SheetDraft = {
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
        updatedAt: savedAt.toISOString(),
      }
      try {
        localStorage.setItem(SHEET_DRAFT_KEY, JSON.stringify(draft))
        setDraftSavedAt(savedAt)
        setDraftStatus('saved')
        setDraftMessage(`Draft saved at ${savedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`)
      } catch {
        setDraftStatus('unavailable')
        setDraftMessage('Automatic draft could not be saved. Keep this window open and retry before leaving.')
      }
    }, 250)
    return () => window.clearTimeout(timer)
  }, [draftReady, draftRetryNonce, mode, slots, fillProduct, startSlot, fillCount, reviewAction, calibrationOpen, calibrationX, calibrationY, horizontalDirection, verticalDirection, horizontalDistance, verticalDistance])

  function discardDraft(): void {
    try {
      localStorage.removeItem(SHEET_DRAFT_KEY)
      setDraftSavedAt(null)
      setDraftStatus('saved')
      setDraftMessage('Saved draft discarded. New changes will save automatically.')
    } catch {
      setDraftStatus('unavailable')
      setDraftMessage('The saved draft could not be discarded because local storage is unavailable.')
    }
  }

  function setSlotProduct(slotIndex: number, product: Product | null): void {
    setSlots((prev) => {
      const next = [...prev]
      next[slotIndex] = { product }
      return next
    })
  }

  async function handleExport(): Promise<void> {
    const outputSlots = buildDisplaySlots()
    if (!outputSlots.some(Boolean)) { setPrintError('Assign at least one product before exporting a sheet.'); return }
    if (!calibrationKnown) { setPrintError('Calibration settings are unavailable. Retry settings before exporting.'); return }
    if (preflightStatus !== 'checked') { setPrintError(preflightStatus === 'checking' ? 'Wait for rendered-output verification to finish.' : 'Retry rendered-output verification before exporting.'); return }
    const eligibilityError = outputEligibilityError(outputSlots.flatMap((product, index) => product ? [{ product, slot: index + 1 }] : []), 'Sheet PDF export')
    if (eligibilityError) { setPrintError(eligibilityError); return }
    if (!confirmUsingSavedTillieData(outputSlots.filter((product): product is Product => Boolean(product)))) return
    setPrintError('')
    setExporting(true)
    const result = await window.api.export.sheetPDF(outputSlots)
    if (!result.ok) setPrintError(`Sheet export failed: ${result.error}. Check the export folder and try again.`)
    else if (result.data) {
      const ids = outputSlots.map((product) => product?.id ?? null)
      try { localStorage.setItem('tillie:last-sheet', JSON.stringify(ids)) } catch {
        setDraftStatus('warning')
        setDraftMessage('The PDF was exported, but Repeat Last Sheet could not be saved.')
      }
      setLastSheetIds(ids)
      setOutcome('Print-sheet PDF exported and ready to print at actual size.')
      setReviewOpen(false)
    }
    setExporting(false)
  }

  async function handlePrintDirect(kind: 'final' | 'test' = 'final'): Promise<void> {
    const outputSlots = buildDisplaySlots()
    if (!outputSlots.some(Boolean)) { setPrintError('Assign at least one product before printing a sheet.'); return }
    if (!calibrationKnown) { setPrintError('Calibration settings are unavailable. Retry settings before printing.'); return }
    if (preflightStatus !== 'checked') { setPrintError(preflightStatus === 'checking' ? 'Wait for rendered-output verification to finish.' : 'Retry rendered-output verification before printing.'); return }
    const eligibilityError = outputEligibilityError(outputSlots.flatMap((product, index) => product ? [{ product, slot: index + 1 }] : []), 'Sheet printing')
    if (eligibilityError) { setPrintError(eligibilityError); return }
    if (!confirmUsingSavedTillieData(outputSlots.filter((product): product is Product => Boolean(product)))) return
    setPrintError('')
    setPrinting(true)
    window.api.settings.set('sheetPrinterName', sheetPrinterName)
    const result = await window.api.print.sheet(outputSlots, { printerName: sheetPrinterName })
    if (!result.ok) {
      setPrintError(`The sheet could not be sent to the printer: ${result.error}`)
    } else if (result.data) {
      const ids = outputSlots.map((product) => product?.id ?? null)
      try { localStorage.setItem('tillie:last-sheet', JSON.stringify(ids)) } catch {
        setDraftStatus('warning')
        setDraftMessage('The sheet was sent to the printer, but Repeat Last Sheet could not be saved.')
      }
      setLastSheetIds(ids)
      const printerLabel = sheetPrinterLabel()
      setOutcome(kind === 'test'
        ? `Test sheet sent to ${printerLabel} at 100% scale. Measure the result before changing calibration.`
        : `Sheet sent to ${printerLabel} at 100% scale. Check the printer to confirm it finished.`)
      if (kind === 'final') setReviewOpen(false)
    } else {
      setOutcome('The sheet was not sent to the printer.')
    }
    setPrinting(false)
  }

  function buildDisplaySlots(): (Product | null)[] {
    if (mode === 'fill' && fillProduct) {
      return Array.from({ length: PLS_780.labelsPerSheet }, (_, i) => {
        const slot = i + 1
        if (slot < startSlot) return null
        if (slot - startSlot < fillCount) return fillProduct
        return null
      })
    }
    return slots.map((s) => s.product)
  }

  async function saveCalibration(): Promise<void> {
    const x = Number(calibrationX)
    const y = Number(calibrationY)
    if (!Number.isFinite(x) || !Number.isFinite(y) || Math.abs(x) > 0.5 || Math.abs(y) > 0.5) {
      setCalibrationError('Enter offsets between -0.500 and +0.500 inches.')
      return
    }
    setCalibrationSaving(true)
    setCalibrationError('')
    const result = await window.api.settings.setMany({ sheetOffsetXIn: x.toFixed(3), sheetOffsetYIn: y.toFixed(3) })
    setCalibrationSaving(false)
    if (!result.ok) {
      setCalibrationError(result.error)
      return
    }
    setSettings((current) => current ? { ...current, sheetOffsetXIn: x.toFixed(3), sheetOffsetYIn: y.toFixed(3) } : current)
    const cache = { x: x.toFixed(3), y: y.toFixed(3), savedAt: new Date().toISOString() }
    setCachedCalibration(cache)
    setCalibrationSource('live')
    try { localStorage.setItem(CALIBRATION_CACHE_KEY, JSON.stringify(cache)) } catch { /* saved settings remain authoritative */ }
    setOutcome('Calibration saved for PLS780 sheets.')
    setCalibrationOpen(false)
  }

  function applyMeasuredCorrection(): void {
    const horizontal = Math.abs(Number(horizontalDistance))
    const vertical = Math.abs(Number(verticalDistance))
    if (!Number.isFinite(horizontal) || !Number.isFinite(vertical) || horizontal > 0.5 || vertical > 0.5) {
      setCalibrationError('Measured distances must be between 0 and 0.500 inches.')
      return
    }
    const x = horizontalDirection === 'left' ? horizontal : horizontalDirection === 'right' ? -horizontal : 0
    const y = verticalDirection === 'up' ? vertical : verticalDirection === 'down' ? -vertical : 0
    setCalibrationX(x.toFixed(3))
    setCalibrationY(y.toFixed(3))
    setCalibrationError('')
  }

  async function handleCalibrationTest(): Promise<void> {
    setPrinting(true)
    setPrintError('')
    const result = await window.api.print.calibrationSheet({ printerName: sheetPrinterName })
    setPrinting(false)
    if (!result.ok) setPrintError(`Calibration test could not print: ${result.error}`)
    else if (result.data) setOutcome(`Calibration pattern sent to ${sheetPrinterLabel()} at 100% scale. Measure the outlines against the label edges.`)
    else setOutcome('The calibration pattern was not sent to the printer.')
  }

  function sheetPrinterLabel(): string {
    if (!sheetPrinterName) return 'the system default printer'
    const printer = printers.find((p) => p.name === sheetPrinterName)
    return printer?.displayName || sheetPrinterName
  }

  const displaySlots = buildDisplaySlots()
  const displaySignature = JSON.stringify(displaySlots.map((product) => product ? [product.id, product.updatedAt, product.templateId, product.name, product.price, product.ingredients, product.cookingInstructions, product.allergenStatement] : null))
  const filled = displaySlots.filter(Boolean).length
  const readyToPrint = filled > 0
  const estimatedSheetFitIssues = useMemo(() => {
    return displaySlots.flatMap((product, index) => {
      if (!product) return []
      return assessProductContentFit(product).map((issue) => ({ ...issue, product, productName: product.name || `Slot ${index + 1}`, slot: index + 1 }))
    })
  }, [displaySignature])
  const sheetFitIssues = renderedSheetFitIssues ?? estimatedSheetFitIssues
  const clippedSheetIssues = sheetFitIssues.filter((issue) => issue.status === 'clipped')
  const offsetX = toInches(settings?.sheetOffsetXIn ?? cachedCalibration?.x)
  const offsetY = toInches(settings?.sheetOffsetYIn ?? cachedCalibration?.y)
  const calibrationKnown = calibrationSource === 'live' || calibrationSource === 'cached'
  const proposedX = toInches(calibrationX)
  const proposedY = toInches(calibrationY)
  const calibrationHasProposal = Math.abs(proposedX - offsetX) > 0.0005 || Math.abs(proposedY - offsetY) > 0.0005

  async function runSheetPreflight(): Promise<void> {
    const requestId = ++preflightRequestRef.current
    const currentSlots = buildDisplaySlots()
    const entries = currentSlots.flatMap((product, index) => product ? [{ product, slot: index + 1 }] : [])
    if (!entries.length) {
      setRenderedSheetFitIssues([])
      setPreflightStatus('checked')
      setPreflightError('')
      return
    }
    setPreflightStatus('checking')
    setPreflightError('')
    setRenderedSheetFitIssues(null)
    let result
    try {
      result = await window.api.output.preflight(entries)
    } catch {
      if (requestId !== preflightRequestRef.current) return
      setPreflightStatus('unavailable')
      setPreflightError('Tillie Print could not reach the output verifier. Check the app connection and retry.')
      return
    }
    if (requestId !== preflightRequestRef.current) return
    if (!result.ok) {
      setPreflightStatus('unavailable')
      setPreflightError('Tillie Print could not verify the rendered sheet. Print and PDF remain blocked until the check succeeds.')
      return
    }
    const mapped = result.data.flatMap((issue) => {
        const slot = issue.slot ?? 0
        const product = slot ? currentSlots[slot - 1] : currentSlots.find((candidate) => candidate?.id === issue.productId)
        return product ? [{ ...issue, product, productName: product.name || `Slot ${slot}`, slot }] : []
    })
    setRenderedSheetFitIssues(mapped)
    setPreflightStatus('checked')
  }

  useEffect(() => {
    const requestId = ++preflightRequestRef.current
    setRenderedSheetFitIssues(null)
    setPreflightStatus('checking')
    setPreflightError('')
    const entries = displaySlots.flatMap((product, index) => product ? [{ product, slot: index + 1 }] : [])
    if (!entries.length) { setRenderedSheetFitIssues([]); setPreflightStatus('checked'); return }
    let alive = true
    window.api.output.preflight(entries).then((result) => {
      if (!alive || requestId !== preflightRequestRef.current) return
      if (!result.ok) {
        setPreflightStatus('unavailable')
        setPreflightError('Tillie Print could not verify the rendered sheet. Print and PDF remain blocked until the check succeeds.')
        return
      }
      const mapped = result.data.flatMap((issue) => {
        const slot = issue.slot ?? 0
        const product = slot ? displaySlots[slot - 1] : displaySlots.find((candidate) => candidate?.id === issue.productId)
        return product ? [{ ...issue, product, productName: product.name || `Slot ${slot}`, slot }] : []
      })
      setRenderedSheetFitIssues(mapped)
      setPreflightStatus('checked')
    }).catch(() => {
      if (!alive || requestId !== preflightRequestRef.current) return
      setPreflightStatus('unavailable')
      setPreflightError('Tillie Print could not reach the output verifier. Check the app connection and retry.')
    })
    return () => { alive = false }
  }, [displaySignature])

  function repeatLastSheet(): void {
    const restored = lastSheetIds.slice(0, PLS_780.labelsPerSheet).map((id) => id ? allProducts.find((product) => product.id === id) ?? null : null)
    if (!restored.some(Boolean)) {
      setPrintError('The previous sheet’s products are no longer available.')
      return
    }
    const next = Array.from({ length: PLS_780.labelsPerSheet }, () => ({ product: null as Product | null }))
    restored.forEach((product, index) => { next[index].product = product })
    setSlots(next)
    setMode('manual')
    const restoredCount = restored.filter(Boolean).length
    setOutcome(`Restored the last sheet with ${restoredCount} label${restoredCount === 1 ? '' : 's'} in their original physical slots.`)
    setPrintError('')
  }

  function clearSheet(): void {
    setSlots(Array.from({ length: PLS_780.labelsPerSheet }, () => ({ product: null })))
    setFillProduct(null)
    setStartSlot(1)
    setFillCount(PLS_780.labelsPerSheet)
    setOutcome('Sheet cleared. Your saved products were not changed.')
    setPrintError('')
  }

  function duplicateActiveSlot(): void {
    if (activeSlot === null || !slots[activeSlot]?.product) {
      setPrintError('Select a filled manual slot before duplicating it.')
      return
    }
    const emptyIndex = slots.findIndex((slot, index) => index > activeSlot && !slot.product)
    const fallbackIndex = slots.findIndex((slot) => !slot.product)
    const targetIndex = emptyIndex >= 0 ? emptyIndex : fallbackIndex
    if (targetIndex < 0) {
      setPrintError('All eight physical slots are already filled.')
      return
    }
    setSlotProduct(targetIndex, slots[activeSlot].product)
    setActiveSlot(targetIndex)
    setOutcome(`Copied slot ${activeSlot + 1} to slot ${targetIndex + 1}.`)
    setPrintError('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>

      {/* Top bar */}
      <div className="workspace-toolbar sheet-toolbar" style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '0 20px', height: 52,
        background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-soft)',
        flexShrink: 0,
      }}>
        <button onClick={onBack} className="btn-ghost btn-sm">
          <ArrowLeft size={13} /> Products
        </button>
        <span style={{ color: 'var(--color-border-strong)', fontSize: 13 }}>/</span>
        <h1 style={{ fontSize: 16, fontWeight: 650, color: 'var(--color-workbench-navy)', margin: 0 }}>Print Sheet Builder</h1>
        <span className="sheet-stock-badge" style={{ fontSize: 11, background: 'var(--color-neutral-subtle)', color: 'var(--color-text-secondary)', borderRadius: 20, padding: '2px 10px', marginLeft: 4 }}>
          PLS780 · 8 labels
        </span>
        {draftReady && (
          <div className={`sheet-draft-status is-${draftStatus}`} role="status" title={draftSavedAt ? `Last saved ${draftSavedAt.toLocaleString()}` : undefined}>
            <span>{draftMessage}</span>
            {draftStatus === 'unavailable' && <button type="button" className="btn-ghost btn-sm" onClick={() => setDraftRetryNonce((value) => value + 1)}>Retry</button>}
            {draftSavedAt && <button type="button" className="btn-ghost btn-sm" onClick={discardDraft}>Discard draft</button>}
          </div>
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button ref={printTriggerRef} onClick={() => { activeReviewTriggerRef.current = printTriggerRef.current; setReviewAction('print'); setReviewOpen(true) }} disabled={printing || !readyToPrint || preflightStatus !== 'checked' || !calibrationKnown} className="btn-green btn-sm" title={!readyToPrint ? 'Assign at least one product before printing' : !calibrationKnown ? 'Load calibration settings before output' : preflightStatus === 'checking' ? 'Checking rendered output' : preflightStatus === 'unavailable' ? 'Retry output verification first' : 'Review physical print setup'}>
            <Printer size={13} /> Review & Print
          </button>
          <button ref={exportTriggerRef} onClick={() => { activeReviewTriggerRef.current = exportTriggerRef.current; setReviewAction('export'); setReviewOpen(true) }} disabled={exporting || !readyToPrint || preflightStatus !== 'checked' || !calibrationKnown} className="btn-outline btn-sm" title={!readyToPrint ? 'Assign at least one product before exporting' : !calibrationKnown ? 'Load calibration settings before output' : preflightStatus === 'checking' ? 'Checking rendered output' : preflightStatus === 'unavailable' ? 'Retry output verification first' : 'Review setup before exporting'}>
            <FileText size={13} /> Export PDF
          </button>
        </div>
      </div>

      {outcome && (
        <div role="status" aria-live="polite" className="status-message" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 20px', background: 'var(--color-success-surface)', color: 'var(--color-success-text)', fontSize: 12 }}>
          <span style={{ flex: 1 }}>{outcome}</span><button className="btn-ghost btn-sm" onClick={() => setOutcome('')}>Dismiss</button>
        </div>
      )}
      {printError && (
        <div role="alert" className="status-message" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 20px', background: 'var(--color-danger-surface)', color: 'var(--color-danger-text)', fontSize: 12 }}>
          <AlertCircle size={14} /><span style={{ flex: 1 }}>{printError}</span>
          <button className="btn-ghost btn-sm" onClick={() => setPrintError('')}>Dismiss</button>
        </div>
      )}
      {draftRestoreWarning && (
        <div role="alert" className="status-message" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 20px', background: 'var(--color-warning-surface)', color: 'var(--color-warning-text)', fontSize: 12 }}>
          <AlertCircle size={14} /><span style={{ flex: 1 }}>{draftRestoreWarning}</span>
          <button className="btn-ghost btn-sm" onClick={() => setDraftRestoreWarning('')}>Dismiss</button>
        </div>
      )}

      {/* Body */}
      <div className="sheet-workspace" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Controls panel */}
        <div className="sheet-controls-pane" style={{ flex: '0 0 460px', overflowY: 'auto', padding: '24px 28px', background: 'var(--color-surface)' }}>
          <div style={{ maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 20 }}>

            <div className="card" style={{ padding: 16 }} aria-label="Print readiness preflight">
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
                <CheckCircle2 size={16} style={{ color: readyToPrint ? 'var(--color-success-text)' : 'var(--color-text-muted)' }} />
                <div style={{ fontSize: 13, fontWeight: 650 }}>{readyToPrint ? 'Ready for print setup' : 'Complete the sheet to print'}</div>
              </div>
              <div className="print-preflight">
                <div className="preflight-item"><strong>Stock</strong><span>PLS780 · 8 labels</span></div>
                <div className="preflight-item"><strong>Page</strong><span>US Letter · portrait</span></div>
                <div className="preflight-item"><strong>Scale</strong><span>100% / Actual Size</span></div>
                <div className="preflight-item"><strong>Assigned</strong><span>{filled} of 8 slots</span></div>
                <div className="preflight-item"><strong>Calibration</strong><span className={calibrationSource === 'cached' ? 'fit-status tight' : calibrationSource === 'unavailable' ? 'fit-status clipped' : ''}>{calibrationSource === 'loading' ? 'Loading saved calibration…' : calibrationSource === 'unavailable' ? 'Unavailable — output blocked' : `X ${offsetX >= 0 ? '+' : ''}${offsetX.toFixed(3)} · Y ${offsetY >= 0 ? '+' : ''}${offsetY.toFixed(3)} in${calibrationSource === 'cached' ? ` · cached ${cachedCalibration ? new Date(cachedCalibration.savedAt).toLocaleString() : ''}` : ''}`}</span></div>
                <div className="preflight-item"><strong>Slot map</strong><span>{readyToPrint ? `${displaySlots.map((product, index) => product ? index + 1 : null).filter(Boolean).join(', ')} occupied` : 'Assign at least one label'}</span></div>
                <div className="preflight-item"><strong>Output check</strong><span className={preflightStatus === 'unavailable' ? 'fit-status clipped' : preflightStatus === 'checking' ? 'fit-status checking' : clippedSheetIssues.length ? 'fit-status clipped' : sheetFitIssues.length ? 'fit-status tight' : 'fit-status fits'}>{preflightStatus === 'checking' ? 'Checking rendered sheet…' : preflightStatus === 'unavailable' ? 'Verification unavailable' : clippedSheetIssues.length ? 'Blocked — repair clipped text' : sheetFitIssues.length ? 'Verified — review tight text' : 'Verified for output'}</span></div>
              </div>
              {(calibrationSource === 'cached' || calibrationSource === 'unavailable') && <div className={calibrationSource === 'cached' ? 'content-fit-callout tight' : 'content-fit-callout clipped'} role="alert" style={{ marginTop: 12 }}><strong>{calibrationSource === 'cached' ? 'Using cached calibration' : 'Calibration could not be loaded'}</strong><span>{calibrationSource === 'cached' ? 'The saved calibration service is unavailable. These last-known offsets remain labeled as cached throughout review and output.' : 'No trusted calibration value is available, so physical output is blocked.'} {settingsLoadError}</span><button type="button" className="btn-outline btn-sm" onClick={() => void loadSheetSettings()}>Retry settings</button></div>}
              {preflightStatus === 'unavailable' && <div className="content-fit-callout clipped" role="alert" style={{ marginTop: 12 }}><strong>Output verification did not finish</strong><span>{preflightError}</span><button type="button" className="btn-outline btn-sm" onClick={() => void runSheetPreflight()}>Retry verification</button></div>}
              <button type="button" className="btn-outline btn-sm" style={{ marginTop: 12 }} onClick={() => setCalibrationOpen((open) => !open)} aria-expanded={calibrationOpen}>
                {calibrationOpen ? 'Close calibration' : 'Calibrate or test this sheet'}
              </button>
            </div>

            {lastSheetIds.length > 0 && (
              <button className="btn-outline" onClick={repeatLastSheet} style={{ alignSelf: 'flex-start' }}>
                <RotateCcw size={13} /> Repeat Last Sheet
              </button>
            )}

            {calibrationOpen && (
              <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 650, color: 'var(--color-text)' }}>Calibrate PLS780 alignment</div>
                  <p style={{ margin: '5px 0 0', fontSize: 12, lineHeight: 1.5, color: 'var(--color-text-secondary)' }}>
                    1. Print the alignment pattern at 100% / Actual Size. 2. Measure how far it drifts. 3. Calculate and save the correction before testing again.
                  </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px', gap: 8 }}>
                  <div><label className="label-text" htmlFor="calibration-horizontal-direction">Horizontal drift</label><select id="calibration-horizontal-direction" className="input" value={horizontalDirection} onChange={(event) => setHorizontalDirection(event.target.value as typeof horizontalDirection)}><option value="none">No horizontal drift</option><option value="left">Print is too far left</option><option value="right">Print is too far right</option></select></div>
                  <div><label className="label-text" htmlFor="calibration-horizontal-distance">Distance (in)</label><input id="calibration-horizontal-distance" className="input" type="number" min={0} max={0.5} step={0.005} value={horizontalDistance} onChange={(event) => setHorizontalDistance(event.target.value)} /></div>
                  <div><label className="label-text" htmlFor="calibration-vertical-direction">Vertical drift</label><select id="calibration-vertical-direction" className="input" value={verticalDirection} onChange={(event) => setVerticalDirection(event.target.value as typeof verticalDirection)}><option value="none">No vertical drift</option><option value="up">Print is too far up</option><option value="down">Print is too far down</option></select></div>
                  <div><label className="label-text" htmlFor="calibration-vertical-distance">Distance (in)</label><input id="calibration-vertical-distance" className="input" type="number" min={0} max={0.5} step={0.005} value={verticalDistance} onChange={(event) => setVerticalDistance(event.target.value)} /></div>
                </div>
                <button className="btn-outline btn-sm" onClick={applyMeasuredCorrection}>Calculate correction</button>
                <div className="calibration-comparison" aria-live="polite">
                  <div><strong>Currently saved</strong><span>X {offsetX >= 0 ? '+' : ''}{offsetX.toFixed(3)} · Y {offsetY >= 0 ? '+' : ''}{offsetY.toFixed(3)} in</span></div>
                  <div className={calibrationHasProposal ? 'has-proposal' : ''}><strong>Proposed</strong><span>X {proposedX >= 0 ? '+' : ''}{proposedX.toFixed(3)} · Y {proposedY >= 0 ? '+' : ''}{proposedY.toFixed(3)} in</span></div>
                </div>
                <details className="editor-disclosure">
                  <summary>Advanced signed offsets</summary>
                  <div className="editor-disclosure-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label className="label-text" htmlFor="calibration-x">Horizontal correction</label>
                    <input id="calibration-x" className="input" type="number" min={-0.5} max={0.5} step={0.005} value={calibrationX} onChange={(event) => setCalibrationX(event.target.value)} />
                    <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--color-text-muted)' }}>Positive moves right.</p>
                  </div>
                  <div>
                    <label className="label-text" htmlFor="calibration-y">Vertical correction</label>
                    <input id="calibration-y" className="input" type="number" min={-0.5} max={0.5} step={0.005} value={calibrationY} onChange={(event) => setCalibrationY(event.target.value)} />
                    <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--color-text-muted)' }}>Positive moves down.</p>
                  </div>
                </div>
                  </div>
                </details>
                {calibrationError && <div role="alert" style={{ fontSize: 12, color: 'var(--color-danger-text)' }}>{calibrationError}</div>}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn-primary btn-sm" onClick={saveCalibration} disabled={calibrationSaving || !calibrationHasProposal}>{calibrationSaving ? 'Saving…' : calibrationHasProposal ? 'Save & update preview' : 'Calibration is saved'}</button>
                  <button className="btn-outline btn-sm" onClick={handleCalibrationTest} disabled={printing}><Printer size={12} /> Print Alignment Pattern</button>
                </div>
              </div>
            )}

            {/* Mode toggle */}
            <div>
              <div className="section-label">Layout mode</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setMode('fill')}
                  aria-pressed={mode === 'fill'}
                  className={mode === 'fill' ? 'btn-primary btn-sm' : 'btn-outline btn-sm'}
                  style={{ flex: 1 }}
                >
                  Fill all with one product
                </button>
                <button
                  onClick={() => setMode('manual')}
                  aria-pressed={mode === 'manual'}
                  className={mode === 'manual' ? 'btn-primary btn-sm' : 'btn-outline btn-sm'}
                  style={{ flex: 1 }}
                >
                  Assign slots manually
                </button>
              </div>
            </div>

            {mode === 'fill' && (
              <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label className="label-text" htmlFor="sheet-fill-product">Product</label>
                  <select
                    id="sheet-fill-product"
                    className="input"
                    value={fillProduct?.id ?? ''}
                    onChange={(e) => setFillProduct(allProducts.find((p) => p.id === e.target.value) ?? null)}
                  >
                    <option value="">— Select a product —</option>
                    {allProducts.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} — {p.price}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label className="label-text" htmlFor="sheet-fill-quantity">Quantity</label>
                    <input
                      id="sheet-fill-quantity"
                      type="number" className="input" min={1} max={PLS_780.labelsPerSheet - startSlot + 1}
                      value={fillCount}
                      onChange={(e) => {
                        const remaining = PLS_780.labelsPerSheet - startSlot + 1
                        const requested = Number(e.target.value)
                        setFillCount(Number.isFinite(requested) ? Math.min(remaining, Math.max(1, requested)) : 1)
                      }}
                    />
                    <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--color-text-muted)' }}>{Math.min(fillCount, PLS_780.labelsPerSheet - startSlot + 1)} label{Math.min(fillCount, PLS_780.labelsPerSheet - startSlot + 1) === 1 ? '' : 's'} will print.</p>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="label-text" htmlFor="sheet-start-slot">Start at slot</label>
                    <select
                      id="sheet-start-slot"
                      className="input"
                      value={startSlot}
                      onChange={(e) => {
                        const s = Number(e.target.value)
                        setStartSlot(s)
                        setFillCount(Math.min(fillCount, PLS_780.labelsPerSheet - s + 1))
                      }}
                    >
                      {Array.from({ length: PLS_780.labelsPerSheet }, (_, i) => (
                        <option key={i + 1} value={i + 1}>Slot {i + 1}{i === 0 ? ' (top-left)' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {mode === 'manual' && (
              <div className="card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div className="section-label" style={{ flex: 1 }}>Slot assignments</div>
                  <button className="btn-ghost btn-sm" onClick={duplicateActiveSlot}>Duplicate selected</button>
                  <button className="btn-ghost btn-sm" onClick={clearSheet}>Clear sheet</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {slots.map((slot, i) => (
                    <div
                      key={i}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 5, borderRadius: 6, background: activeSlot === i ? 'var(--color-success-surface)' : 'transparent' }}
                    >
                      <span style={{ fontSize: 11, color: 'var(--color-text-muted)', width: 40, textAlign: 'right', flexShrink: 0 }}>
                        #{i + 1}
                      </span>
                      <select
                        aria-label={`Product assigned to slot ${i + 1}`}
                        className="input"
                        style={{ fontSize: 12, padding: '6px 10px' }}
                        value={slot.product?.id ?? ''}
                        onFocus={() => setActiveSlot(i)}
                        onChange={(e) => setSlotProduct(i, allProducts.find((p) => p.id === e.target.value) ?? null)}
                      >
                        <option value="">— empty —</option>
                        {allProducts.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Sheet preview panel */}
        <div className="sheet-preview-pane" style={{
          flex: '1 1 520px', minWidth: 360,
          background: 'var(--color-panel)', borderLeft: '1px solid var(--color-border-soft)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '24px 20px', gap: 12, overflowY: 'auto',
        }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
            Sheet Preview
          </p>
          <div style={{ width: 'min(100%, 440px)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, padding: 10 }}>
            <div style={{ position: 'relative', background: '#d1d5db', aspectRatio: '8.5 / 11' }}>
              {displaySlots.map((product, i) => (
                <SheetSlotPreview
                  key={i}
                  index={i}
                  product={product}
                  offsetXIn={offsetX}
                  offsetYIn={offsetY}
                  isActive={activeSlot === i}
                  onClick={() => setActiveSlot(activeSlot === i ? null : i)}
                />
              ))}
            </div>
          </div>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0 }}>
            {filled} / {PLS_780.labelsPerSheet} slots filled
          </p>
        </div>
      </div>
      {reviewOpen && (
        <div className="print-review-backdrop" role="presentation">
          <section ref={reviewRef} className="print-review" role="dialog" aria-modal="true" aria-labelledby="print-review-title" aria-describedby="print-review-description" aria-busy={printing || exporting}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <h2 id="print-review-title" style={{ margin: 0, fontSize: 18, color: 'var(--color-text)' }}>{reviewAction === 'print' ? 'Review before printing' : 'Review before PDF export'}</h2>
                <p id="print-review-description" style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--color-text-secondary)' }}>Tillie Print will preserve all eight positions, including empty slots.</p>
              </div>
              <button className="btn-icon" aria-label="Close print review" onClick={() => setReviewOpen(false)}><X size={15} /></button>
            </div>
            <div className="print-preflight" style={{ marginTop: 18 }}>
              <div className="preflight-item"><strong>Output target</strong><span>{reviewAction === 'print' ? sheetPrinterLabel() : 'Reviewed PDF file'}</span></div>
              <div className="preflight-item"><strong>Scale</strong><span>{reviewAction === 'print' ? 'Printed at 100% / Actual Size automatically' : 'Choose 100% / Actual Size when printing; never Fit to Page'}</span></div>
              <div className="preflight-item"><strong>Completion</strong><span>{reviewAction === 'print' ? 'The app confirms the job reached the printer queue, not that paper printed.' : 'The app confirms when the PDF file is created.'}</span></div>
              <div className="preflight-item"><strong>Calibration source</strong><span className={calibrationSource === 'cached' ? 'fit-status tight' : ''}>{calibrationSource === 'cached' ? `Cached from ${cachedCalibration ? new Date(cachedCalibration.savedAt).toLocaleString() : 'last successful load'}` : 'Current saved settings'}</span></div>
            </div>
            {reviewAction === 'print' && (
              <div style={{ marginTop: 14 }}>
                <label className="label-text" htmlFor="sheet-printer">Printer</label>
                <select id="sheet-printer" className="input" value={sheetPrinterName} onChange={(e) => setSheetPrinterName(e.target.value)}>
                  <option value="">System default printer</option>
                  {printers.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.displayName || p.name}{p.isDefault ? ' (default)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
              <button className="btn-outline" onClick={() => { setReviewOpen(false); setCalibrationOpen(true) }}>Adjust calibration</button>
              {reviewAction === 'print' ? <><button className="btn-ghost" onClick={() => setReviewAction('export')}><FileText size={13} /> Switch to PDF</button><button data-primary-review-action="true" className="btn-green" onClick={() => handlePrintDirect('final')} disabled={printing || clippedSheetIssues.length > 0}><Printer size={13} /> {printing ? 'Printing…' : clippedSheetIssues.length ? 'Resolve clipped text' : 'Print Sheet'}</button></> : <><button className="btn-ghost" onClick={() => setReviewAction('print')}><Printer size={13} /> Switch to Print</button><button data-primary-review-action="true" className="btn-primary" onClick={handleExport} disabled={exporting || clippedSheetIssues.length > 0}><FileText size={13} /> {exporting ? 'Exporting…' : clippedSheetIssues.length ? 'Resolve clipped text' : 'Export reviewed PDF'}</button></>}
            </div>
            {sheetFitIssues.length > 0 && (
              <div className={clippedSheetIssues.length ? 'content-fit-callout clipped' : 'content-fit-callout tight'} role={clippedSheetIssues.length ? 'alert' : 'status'} style={{ marginTop: 14 }}>
                <strong>{clippedSheetIssues.length ? 'Output blocked until clipped text is resolved' : 'Some content is close to its printable limit'}</strong>
                <ul className="repair-issue-list">{sheetFitIssues.map((issue) => <li key={`${issue.slot}-${issue.product.id}-${issue.field}-${issue.status}`}><div><b>Slot {issue.slot} · {issue.productName}</b><span>{issue.message}</span></div><button type="button" className="btn-outline btn-sm" onClick={() => { setReviewOpen(false); onRepairIssue(issue.product, issue.field) }}>Edit {issue.label.toLowerCase()}</button></li>)}</ul>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}

function SheetSlotPreview({
  index, product, offsetXIn, offsetYIn, isActive, onClick,
}: {
  index: number
  product: Product | null
  offsetXIn: number
  offsetYIn: number
  isActive: boolean
  onClick: () => void
}): JSX.Element {
  // Slot is 4"x2.5" (aspect 1.6). Scale portrait label so that after -90deg
  // rotation it fills the slot width and keeps full content visible.
  const bounds = getSlotBoundsIn(index + 1, offsetXIn, offsetYIn)
  const pageWidth = PLS_780.pageWidthIn
  const pageHeight = PLS_780.pageHeightIn
  const slotLeft = (bounds.leftIn / pageWidth) * 100
  const slotTop = (bounds.topIn / pageHeight) * 100
  const slotWidth = (bounds.widthIn / pageWidth) * 100
  const slotHeight = (bounds.heightIn / pageHeight) * 100
  const SLOT_ASPECT = bounds.widthIn / bounds.heightIn
  const template = product ? getLabelTemplate(product.templateId) : null
  const isInfoLayout = template?.layout === 'info'

  return (
    <button
      type="button"
      aria-label={product ? `Select sheet slot ${index + 1}, ${product.name}` : `Select empty sheet slot ${index + 1}`}
      aria-pressed={isActive}
      onClick={onClick}
      style={{
        position: 'absolute', cursor: 'pointer', overflow: 'hidden', padding: 0, border: 0,
        background: product ? 'white' : 'var(--color-neutral-soft)',
        outline: isActive ? '2px solid #2d8f2d' : 'none',
        outlineOffset: -2,
        left: `${slotLeft}%`,
        top: `${slotTop}%`,
        width: `${slotWidth}%`,
        height: `${slotHeight}%`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      title={product ? product.name : `Slot ${index + 1} — empty`}
    >
      {product ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: isInfoLayout ? '100%' : 'auto',
              height: isInfoLayout ? 'auto' : `${SLOT_ASPECT * 100}%`,
              aspectRatio: isInfoLayout ? `${template?.width ?? 289} / ${template?.height ?? 181}` : '181 / 289',
              transform: isInfoLayout ? 'none' : 'rotate(-90deg)',
              transformOrigin: 'center',
              flexShrink: 0,
            }}
          >
            <LabelPreview product={product} scale={1} />
          </div>
        </div>
      ) : (
        <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', fontWeight: 650 }}>{index + 1}</span>
      )}
    </button>
  )
}
