import { useState, useEffect } from 'react'
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
        className="card"
        style={{ width: 420, padding: '20px 20px 24px', background: 'white' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: '#1a2332', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Printer size={15} /> Print to Roll
          </h2>
          <button onClick={onClose} className="btn btn-icon" title="Close"><X size={14} /></button>
        </div>
        <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{product.name}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="label-text">Printer</label>
            <select className="input" value={printerName} onChange={(e) => setPrinterName(e.target.value)}>
              <option value="">Ask each time (system print dialog)</option>
              {printers.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.displayName || p.name}{p.isDefault ? ' (default)' : ''}
                </option>
              ))}
            </select>
            <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 5 }}>
              Pick your roll printer (e.g. UniNet iColor) to print directly with no dialog.
            </p>
          </div>

          <div>
            <label className="label-text">Label size</label>
            <select className="input" value={presetId} onChange={(e) => setPresetId(e.target.value)}>
              {PRESETS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
              <option value="custom">Custom…</option>
            </select>
            {presetId === 'custom' && (
              <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
                <input className="input" style={{ maxWidth: 90 }} inputMode="decimal" value={customW} onChange={(e) => setCustomW(e.target.value)} placeholder="W" />
                <span style={{ fontSize: 12, color: '#94a3b8' }}>×</span>
                <input className="input" style={{ maxWidth: 90 }} inputMode="decimal" value={customH} onChange={(e) => setCustomH(e.target.value)} placeholder="H" />
                <span style={{ fontSize: 12, color: '#94a3b8' }}>inches</span>
              </div>
            )}
            <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 5 }}>
              The label design scales to fit and rotates automatically if the media orientation differs.
              Set the same size as the media loaded in the printer.
            </p>
          </div>

          <div>
            <label className="label-text">Copies</label>
            <input
              className="input"
              style={{ maxWidth: 90 }}
              inputMode="numeric"
              value={copies}
              onChange={(e) => setCopies(e.target.value)}
            />
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 12.5, color: '#dc2626' }}>
              {error}
            </div>
          )}
          {done && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '10px 14px', fontSize: 12.5, color: '#166534' }}>
              Sent to printer.
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
