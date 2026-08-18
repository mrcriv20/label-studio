import { useState, useEffect, useRef } from 'react'
import { Printer, X } from 'lucide-react'
import type { Product, PrinterInfo } from '../types'

// Common roll label media sizes (width × height, inches)
const PRESETS: Array<{ id: string; label: string; w: number; h: number }> = [
  { id: '4x2.5', label: '4" × 2.5" (matches sheet labels)', w: 4, h: 2.5 },
  { id: '4x3', label: '4" × 3"', w: 4, h: 3 },
  { id: '4x6', label: '4" × 6"', w: 4, h: 6 },
  { id: '3x2', label: '3" × 2"', w: 3, h: 2 },
  { id: '2.25x1.25', label: '2.25" × 1.25"', w: 2.25, h: 1.25 },
  { id: '2x1', label: '2" × 1"', w: 2, h: 1 },
]

interface Props {
  product: Product
  onClose: () => void
}

export default function RollPrintDialog({ product, onClose }: Props): JSX.Element {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const printerSelectRef = useRef<HTMLSelectElement>(null)
  const [printers, setPrinters] = useState<PrinterInfo[]>([])
  const [printerName, setPrinterName] = useState('')
  const [presetId, setPresetId] = useState('4x2.5')
  const [customW, setCustomW] = useState('4')
  const [customH, setCustomH] = useState('2.5')
  const [copies, setCopies] = useState('1')
  const [printing, setPrinting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    window.api.print.listPrinters().then((r) => {
      if (r.ok) setPrinters(r.data)
    })
    window.api.settings.get().then((r) => {
      if (!r.ok) return
      const { rollPrinterName, rollLabelWidthIn, rollLabelHeightIn } = r.data
      setPrinterName(rollPrinterName)
      const preset = PRESETS.find(
        (p) => String(p.w) === rollLabelWidthIn && String(p.h) === rollLabelHeightIn
      )
      if (preset) setPresetId(preset.id)
      else if (rollLabelWidthIn && rollLabelHeightIn) {
        setPresetId('custom')
        setCustomW(rollLabelWidthIn)
        setCustomH(rollLabelHeightIn)
      }
    })
  }, [])

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    printerSelectRef.current?.focus()
    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); return }
      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), select:not([disabled]), input:not([disabled])'))
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => { document.removeEventListener('keydown', onKeyDown); previouslyFocused?.focus() }
  }, [onClose])

  const preset = PRESETS.find((p) => p.id === presetId)
  const widthIn = preset ? preset.w : Number.parseFloat(customW)
  const heightIn = preset ? preset.h : Number.parseFloat(customH)
  const sizeValid = Number.isFinite(widthIn) && widthIn > 0 && Number.isFinite(heightIn) && heightIn > 0

  async function handlePrint(): Promise<void> {
    if (!sizeValid) { setError('Enter a valid width and height in inches.'); return }
    setPrinting(true)
    setError('')
    setDone(false)
    // Remember the choices for next time.
    window.api.settings.set('rollPrinterName', printerName)
    window.api.settings.set('rollLabelWidthIn', String(widthIn))
    window.api.settings.set('rollLabelHeightIn', String(heightIn))
    const result = await window.api.print.rollLabel(product, {
      printerName,
      widthIn,
      heightIn,
      copies: Number.parseInt(copies, 10) || 1,
    })
    setPrinting(false)
    if (!result.ok) { setError(result.error); return }
    if (result.data) setDone(true)
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="roll-print-title"
        aria-describedby="roll-print-product"
        className="card"
        style={{ width: 'min(420px, calc(100vw - 32px))', maxHeight: 'calc(100vh - 32px)', overflowY: 'auto', padding: '20px 20px 24px', background: 'var(--color-surface)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <h2 id="roll-print-title" style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-workbench-navy)', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Printer size={15} /> Print to Roll
          </h2>
          <button ref={closeButtonRef} onClick={onClose} className="btn btn-icon" aria-label="Close print dialog" title="Close"><X size={14} /></button>
        </div>
        <p id="roll-print-product" style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: '0 0 16px' }}>{product.name}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="label-text" htmlFor="roll-printer">Printer</label>
            <select ref={printerSelectRef} id="roll-printer" className="input" value={printerName} onChange={(e) => setPrinterName(e.target.value)}>
              <option value="">System default printer</option>
              {printers.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.displayName || p.name}{p.isDefault ? ' (default)' : ''}
                </option>
              ))}
            </select>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 5 }}>
              Pick your roll printer (e.g. UniNet iColor). Labels print directly at 100% scale.
            </p>
          </div>

          <div>
            <label className="label-text" htmlFor="roll-size">Label size</label>
            <select id="roll-size" className="input" value={presetId} onChange={(e) => setPresetId(e.target.value)}>
              {PRESETS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
              <option value="custom">Custom…</option>
            </select>
            {presetId === 'custom' && (
              <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
                <input aria-label="Custom label width in inches" className="input" style={{ maxWidth: 90 }} inputMode="decimal" value={customW} onChange={(e) => setCustomW(e.target.value)} placeholder="Width" />
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>×</span>
                <input aria-label="Custom label height in inches" className="input" style={{ maxWidth: 90 }} inputMode="decimal" value={customH} onChange={(e) => setCustomH(e.target.value)} placeholder="Height" />
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>inches</span>
              </div>
            )}
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 5 }}>
              The label design scales to fit and rotates automatically if the media orientation differs.
              Set the same size as the media loaded in the printer.
            </p>
          </div>

          <div>
            <label className="label-text" htmlFor="roll-copies">Copies</label>
            <input
              id="roll-copies"
              className="input"
              style={{ maxWidth: 90 }}
              inputMode="numeric"
              value={copies}
              onChange={(e) => setCopies(e.target.value)}
            />
          </div>

          {error && (
            <div role="alert" className="status-message" style={{ background: 'var(--color-danger-surface)', border: '1px solid var(--color-danger-border)', borderRadius: 8, padding: '10px 14px', fontSize: 12.5, color: 'var(--color-danger-text)' }}>
              {error}
            </div>
          )}
          {done && (
            <div role="status" aria-live="polite" className="status-message" style={{ background: 'var(--color-success-surface)', border: '1px solid var(--color-success-border)', borderRadius: 8, padding: '10px 14px', fontSize: 12.5, color: 'var(--color-success-text)' }}>
              Print request completed. Check the printer to confirm the label finished successfully.
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="btn-outline" onClick={onClose}>Close</button>
            <button className="btn-primary" onClick={handlePrint} disabled={printing || !sizeValid}>
              <Printer size={14} /> {printing ? 'Printing…' : 'Print'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
