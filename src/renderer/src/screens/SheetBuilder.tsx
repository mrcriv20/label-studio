import { useState, useEffect } from 'react'
import { ArrowLeft, FileText, Info } from 'lucide-react'
import LabelPreview from '../components/LabelPreview'
import type { Product } from '../types'

interface SlotAssignment {
  product: Product | null
}

interface Props {
  initialProducts: Product[]
  onBack: () => void
}

export default function SheetBuilder({ initialProducts, onBack }: Props): JSX.Element {
  const [slots, setSlots] = useState<SlotAssignment[]>(Array.from({ length: 8 }, () => ({ product: null })))
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [templateDataUri, setTemplateDataUri] = useState('')
  const [startSlot, setStartSlot] = useState(1)
  const [fillProduct, setFillProduct] = useState<Product | null>(null)
  const [fillCount, setFillCount] = useState(8)
  const [exporting, setExporting] = useState(false)
  const [activeSlot, setActiveSlot] = useState<number | null>(null)
  const [mode, setMode] = useState<'fill' | 'manual'>('fill')

  useEffect(() => {
    window.api.product.list().then((r) => { if (r.ok) setAllProducts(r.data) })
    window.api.file.getTemplatePNG().then((r) => { if (r.ok && r.data) setTemplateDataUri(r.data) })
  }, [])

  useEffect(() => {
    if (initialProducts.length === 1) {
      setFillProduct(initialProducts[0])
      setMode('fill')
    } else if (initialProducts.length > 1) {
      const newSlots: SlotAssignment[] = Array.from({ length: 8 }, () => ({ product: null }))
      initialProducts.slice(0, 8).forEach((p, i) => { newSlots[i].product = p })
      setSlots(newSlots)
      setMode('manual')
    }
  }, [initialProducts])

  function resolveSlots(): Product[] {
    if (mode === 'fill' && fillProduct) {
      const result: Product[] = []
      for (let s = startSlot; s <= 8 && result.length < fillCount; s++) result.push(fillProduct)
      return result
    }
    return slots.map((s) => s.product).filter(Boolean) as Product[]
  }

  function setSlotProduct(slotIndex: number, product: Product | null): void {
    setSlots((prev) => {
      const next = [...prev]
      next[slotIndex] = { product }
      return next
    })
  }

  async function handleExport(): Promise<void> {
    const toExport = resolveSlots()
    if (toExport.length === 0) { alert('No products assigned to slots.'); return }
    setExporting(true)
    const result = await window.api.export.sheetPDF(toExport, startSlot)
    if (!result.ok) alert(`Export failed: ${result.error}`)
    setExporting(false)
  }

  function buildDisplaySlots(): (Product | null)[] {
    if (mode === 'fill' && fillProduct) {
      return Array.from({ length: 8 }, (_, i) => {
        const slot = i + 1
        if (slot < startSlot) return null
        if (slot - startSlot < fillCount) return fillProduct
        return null
      })
    }
    return slots.map((s) => s.product)
  }

  const displaySlots = buildDisplaySlots()
  const filled = displaySlots.filter(Boolean).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>

      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '0 20px', height: 52,
        background: 'white', borderBottom: '1px solid #e8eaed',
        flexShrink: 0,
      }}>
        <button onClick={onBack} className="btn-ghost btn-sm">
          <ArrowLeft size={13} /> Products
        </button>
        <span style={{ color: '#cbd5e1', fontSize: 13 }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#1a2332' }}>Print Sheet Builder</span>
        <span style={{ fontSize: 11, background: '#f1f5f9', color: '#64748b', borderRadius: 20, padding: '2px 10px', marginLeft: 4 }}>
          Avery 5821 — 8 labels per sheet
        </span>
        <div style={{ marginLeft: 'auto' }}>
          <button onClick={handleExport} disabled={exporting} className="btn-primary btn-sm">
            <FileText size={13} /> {exporting ? 'Exporting…' : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Controls panel */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', background: 'white' }}>
          <div style={{ maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Mode toggle */}
            <div>
              <label className="label-text">Layout mode</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setMode('fill')}
                  className={mode === 'fill' ? 'btn-primary btn-sm' : 'btn-outline btn-sm'}
                  style={{ flex: 1 }}
                >
                  Fill all with one product
                </button>
                <button
                  onClick={() => setMode('manual')}
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
                  <label className="label-text">Product</label>
                  <select
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
                    <label className="label-text">Quantity</label>
                    <input
                      type="number" className="input" min={1} max={8 - startSlot + 1}
                      value={fillCount}
                      onChange={(e) => setFillCount(Math.min(8, Math.max(1, Number(e.target.value))))}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="label-text">Start at slot</label>
                    <select
                      className="input"
                      value={startSlot}
                      onChange={(e) => {
                        const s = Number(e.target.value)
                        setStartSlot(s)
                        setFillCount(Math.min(fillCount, 8 - s + 1))
                      }}
                    >
                      {Array.from({ length: 8 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>Slot {i + 1}{i === 0 ? ' (top-left)' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {mode === 'manual' && (
              <div className="card" style={{ padding: 16 }}>
                <label className="label-text" style={{ marginBottom: 10 }}>Slot assignments</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {slots.map((slot, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 11, color: '#94a3b8', width: 40, textAlign: 'right', flexShrink: 0 }}>
                        #{i + 1}
                      </span>
                      <select
                        className="input"
                        style={{ fontSize: 12, padding: '6px 10px' }}
                        value={slot.product?.id ?? ''}
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

            {/* Print note */}
            <div style={{ display: 'flex', gap: 8, background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#78716c' }}>
              <Info size={13} style={{ flexShrink: 0, marginTop: 1, color: '#f59e0b' }} />
              <span>
                <strong>Print at 100% / Actual Size.</strong> Do not enable "Fit to Page." The PDF is sized for Avery 5821 (US Letter, 8 labels).
              </span>
            </div>
          </div>
        </div>

        {/* Sheet preview panel */}
        <div style={{
          width: 260, flexShrink: 0,
          background: '#f0f2f5', borderLeft: '1px solid #e8eaed',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '24px 20px', gap: 12, overflowY: 'auto',
        }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
            Sheet Preview
          </p>
          <div style={{ width: '100%', background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, padding: 8 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'repeat(4, 1fr)', gap: 2, background: '#d1d5db', aspectRatio: '8.5 / 11' }}>
              {displaySlots.map((product, i) => (
                <SheetSlotPreview
                  key={i}
                  index={i}
                  product={product}
                  templateDataUri={templateDataUri}
                  isActive={activeSlot === i}
                  onClick={() => setActiveSlot(activeSlot === i ? null : i)}
                />
              ))}
            </div>
          </div>
          <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
            {filled} / 8 slots filled
          </p>
        </div>
      </div>
    </div>
  )
}

function SheetSlotPreview({
  index, product, templateDataUri, isActive, onClick,
}: {
  index: number
  product: Product | null
  templateDataUri: string
  isActive: boolean
  onClick: () => void
}): JSX.Element {
  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative', cursor: 'pointer', overflow: 'hidden',
        background: product ? 'white' : '#f8fafc',
        outline: isActive ? '2px solid #2d8f2d' : 'none',
        outlineOffset: -2,
        aspectRatio: '4 / 2.5',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      title={product ? product.name : `Slot ${index + 1} — empty`}
    >
      {product ? (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', transform: 'rotate(-90deg) scale(0.62)', transformOrigin: 'center' }}>
          <LabelPreview product={product} templateDataUri={templateDataUri} scale={1} />
        </div>
      ) : (
        <span style={{ fontSize: 9, color: '#cbd5e1', fontWeight: 500 }}>{index + 1}</span>
      )}
    </div>
  )
}
