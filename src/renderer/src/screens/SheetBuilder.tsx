import { useState, useEffect, useMemo, useRef } from 'react'
import { ArrowLeft, FileText, Printer, RotateCcw, CheckCircle2, AlertCircle, X } from 'lucide-react'
import LabelPreview from '../components/LabelPreview'
import type { AppSettings, Product } from '../types'
import { getLabelTemplate } from '../../../shared/labelTemplates'
import {
  getSlotBoundsIn,
  PLS_780,
  toInches,
} from '../../../shared/sheetLayout'
import { assessProductContentFit, outputEligibilityError } from '../../../shared/contentFit'

interface SlotAssignment {
  product: Product | null
}

interface Props {
  initialProducts: Product[]
  onBack: () => void
}

export default function SheetBuilder({ initialProducts, onBack }: Props): JSX.Element {
  const [slots, setSlots] = useState<SlotAssignment[]>(
    Array.from({ length: PLS_780.labelsPerSheet }, () => ({ product: null }))
  )
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [settings, setSettings] = useState<AppSettings | null>(null)
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
  const reviewRef = useRef<HTMLElement | null>(null)
  const printTriggerRef = useRef<HTMLButtonElement | null>(null)
  const exportTriggerRef = useRef<HTMLButtonElement | null>(null)
  const activeReviewTriggerRef = useRef<HTMLButtonElement | null>(null)
  const [horizontalDirection, setHorizontalDirection] = useState<'none' | 'left' | 'right'>('none')
  const [verticalDirection, setVerticalDirection] = useState<'none' | 'up' | 'down'>('none')
  const [horizontalDistance, setHorizontalDistance] = useState('0.000')
  const [verticalDistance, setVerticalDistance] = useState('0.000')

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
        try { setLastSheetIds(JSON.parse(localStorage.getItem('tillie:last-sheet') || '[]')) } catch { setLastSheetIds([]) }
      }
    })
    window.api.settings.get().then((r) => {
      if (!r.ok) return
      setSettings(r.data)
      setCalibrationX(r.data.sheetOffsetXIn || '0')
      setCalibrationY(r.data.sheetOffsetYIn || '0')
    })
  }, [])

  useEffect(() => {
    if (initialProducts.length === 1) {
      setFillProduct(initialProducts[0])
      setMode('fill')
    } else if (initialProducts.length > 1) {
      const newSlots: SlotAssignment[] = Array.from({ length: PLS_780.labelsPerSheet }, () => ({ product: null }))
      initialProducts.slice(0, PLS_780.labelsPerSheet).forEach((p, i) => { newSlots[i].product = p })
      setSlots(newSlots)
      setMode('manual')
    }
  }, [initialProducts])

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
    const eligibilityError = outputEligibilityError(outputSlots.flatMap((product, index) => product ? [{ product, slot: index + 1 }] : []), 'Sheet PDF export')
    if (eligibilityError) { setPrintError(eligibilityError); return }
    setPrintError('')
    setExporting(true)
    const result = await window.api.export.sheetPDF(outputSlots)
    if (!result.ok) setPrintError(`Sheet export failed: ${result.error}. Check the export folder and try again.`)
    else if (result.data) {
      const ids = outputSlots.map((product) => product?.id ?? null)
      localStorage.setItem('tillie:last-sheet', JSON.stringify(ids))
      setLastSheetIds(ids)
      setOutcome('Print-sheet PDF exported and ready to print at actual size.')
      setReviewOpen(false)
    }
    setExporting(false)
  }

  async function handlePrintDirect(kind: 'final' | 'test' = 'final'): Promise<void> {
    const outputSlots = buildDisplaySlots()
    if (!outputSlots.some(Boolean)) { setPrintError('Assign at least one product before printing a sheet.'); return }
    const eligibilityError = outputEligibilityError(outputSlots.flatMap((product, index) => product ? [{ product, slot: index + 1 }] : []), 'Sheet printing')
    if (eligibilityError) { setPrintError(eligibilityError); return }
    setPrintError('')
    setPrinting(true)
    const result = await window.api.print.sheet(outputSlots)
    if (!result.ok) {
      setPrintError(`Print setup could not open: ${result.error}. Check the printer connection and try again.`)
    } else if (result.data) {
      const ids = outputSlots.map((product) => product?.id ?? null)
      localStorage.setItem('tillie:last-sheet', JSON.stringify(ids))
      setLastSheetIds(ids)
      setOutcome(kind === 'test'
        ? 'Test-sheet print dialog opened. Measure the result before changing calibration.'
        : 'System print dialog opened. Tillie Print cannot confirm whether the printer completed the job.')
      if (kind === 'final') setReviewOpen(false)
    } else {
      setOutcome('Print dialog closed without sending the sheet.')
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
    const result = await window.api.print.calibrationSheet()
    setPrinting(false)
    if (!result.ok) setPrintError(`Calibration test could not open: ${result.error}`)
    else if (result.data) setOutcome('Calibration-pattern print dialog opened. Print at Actual Size, then measure the outlines against the label edges.')
    else setOutcome('Calibration print dialog closed without printing.')
  }

  const displaySlots = buildDisplaySlots()
  const filled = displaySlots.filter(Boolean).length
  const readyToPrint = filled > 0
  const sheetFitIssues = useMemo(() => {
    const seen = new Set<string>()
    return displaySlots.flatMap((product, index) => {
      if (!product) return []
      return assessProductContentFit(product).filter((issue) => {
        const key = `${product.id}-${issue.field}-${issue.status}`
        if (seen.has(key)) return false
        seen.add(key)
        return true
      }).map((issue) => ({ ...issue, productName: product.name || `Slot ${index + 1}` }))
    })
  }, [displaySlots])
  const clippedSheetIssues = sheetFitIssues.filter((issue) => issue.status === 'clipped')
  const offsetX = toInches(settings?.sheetOffsetXIn)
  const offsetY = toInches(settings?.sheetOffsetYIn)
  const proposedX = toInches(calibrationX)
  const proposedY = toInches(calibrationY)
  const calibrationHasProposal = Math.abs(proposedX - offsetX) > 0.0005 || Math.abs(proposedY - offsetY) > 0.0005

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
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button ref={printTriggerRef} onClick={() => { activeReviewTriggerRef.current = printTriggerRef.current; setReviewAction('print'); setReviewOpen(true) }} disabled={printing || !readyToPrint} className="btn-green btn-sm" title={!readyToPrint ? 'Assign at least one product before printing' : 'Review physical print setup'}>
            <Printer size={13} /> Review & Print
          </button>
          <button ref={exportTriggerRef} onClick={() => { activeReviewTriggerRef.current = exportTriggerRef.current; setReviewAction('export'); setReviewOpen(true) }} disabled={exporting || !readyToPrint} className="btn-outline btn-sm" title={!readyToPrint ? 'Assign at least one product before exporting' : 'Review setup before exporting'}>
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
                <div className="preflight-item"><strong>Calibration</strong><span>X {offsetX >= 0 ? '+' : ''}{offsetX.toFixed(3)} · Y {offsetY >= 0 ? '+' : ''}{offsetY.toFixed(3)} in</span></div>
                <div className="preflight-item"><strong>Slot map</strong><span>{readyToPrint ? `${displaySlots.map((product, index) => product ? index + 1 : null).filter(Boolean).join(', ')} occupied` : 'Assign at least one label'}</span></div>
              </div>
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
              <div className="preflight-item"><strong>Output target</strong><span>{reviewAction === 'print' ? 'macOS system print dialog' : 'Reviewed PDF file'}</span></div>
              <div className="preflight-item"><strong>Stock</strong><span>PLS780 · US Letter portrait</span></div>
              <div className="preflight-item"><strong>Scale</strong><span>Choose 100% / Actual Size; never Fit to Page</span></div>
              <div className="preflight-item"><strong>Occupied slots</strong><span>{displaySlots.map((product, index) => product ? index + 1 : null).filter(Boolean).join(', ')}</span></div>
              <div className="preflight-item"><strong>Calibration</strong><span>X {offsetX >= 0 ? '+' : ''}{offsetX.toFixed(3)} · Y {offsetY >= 0 ? '+' : ''}{offsetY.toFixed(3)} in</span></div>
              <div className="preflight-item"><strong>Content fit</strong><span className={clippedSheetIssues.length ? 'fit-status clipped' : sheetFitIssues.length ? 'fit-status tight' : 'fit-status fits'}>{clippedSheetIssues.length ? `${clippedSheetIssues.length} clipped field${clippedSheetIssues.length === 1 ? '' : 's'}` : sheetFitIssues.length ? 'Tight — review text' : 'All assigned labels fit'}</span></div>
              <div className="preflight-item"><strong>Completion</strong><span>{reviewAction === 'print' ? 'The app can confirm the dialog opened, not that paper printed.' : 'The app confirms when the PDF file is created.'}</span></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
              <button className="btn-outline" onClick={() => { setReviewOpen(false); setCalibrationOpen(true) }}>Adjust calibration</button>
              {reviewAction === 'print' ? <><button className="btn-ghost" onClick={() => setReviewAction('export')}><FileText size={13} /> Switch to PDF</button><button data-primary-review-action="true" className="btn-green" onClick={() => handlePrintDirect('final')} disabled={printing || clippedSheetIssues.length > 0}><Printer size={13} /> {printing ? 'Opening…' : clippedSheetIssues.length ? 'Resolve clipped text' : 'Open Print Dialog'}</button></> : <><button className="btn-ghost" onClick={() => setReviewAction('print')}><Printer size={13} /> Switch to Print</button><button data-primary-review-action="true" className="btn-primary" onClick={handleExport} disabled={exporting || clippedSheetIssues.length > 0}><FileText size={13} /> {exporting ? 'Exporting…' : clippedSheetIssues.length ? 'Resolve clipped text' : 'Export reviewed PDF'}</button></>}
            </div>
            {sheetFitIssues.length > 0 && (
              <div className={clippedSheetIssues.length ? 'content-fit-callout clipped' : 'content-fit-callout tight'} role={clippedSheetIssues.length ? 'alert' : 'status'} style={{ marginTop: 14 }}>
                <strong>{clippedSheetIssues.length ? 'Output blocked until clipped text is resolved' : 'Some content is close to its printable limit'}</strong>
                <ul>{sheetFitIssues.map((issue) => <li key={`${issue.productName}-${issue.field}-${issue.status}`}><b>{issue.productName}:</b> {issue.message}</li>)}</ul>
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
