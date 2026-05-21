import { useState, useEffect } from 'react'
import {
  ArrowLeft, Save, FileText, FileCode2,
  RefreshCw, Upload, X, AlertCircle, CheckCircle2, Layers
} from 'lucide-react'
import LabelPreview from '../components/LabelPreview'
import { generateBarcodeValue } from '../lib/barcode'
import type { Product } from '../types'

interface Props {
  initialProduct: Product | null
  onBack: () => void
  onOpenSheet: (product: Product) => void
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

const EMPTY_PRODUCT = (): Omit<Product, 'id' | 'createdAt' | 'updatedAt'> => ({
  name: '',
  price: '',
  barcodeValue: generateBarcodeValue(),
  barcodeType: 'CODE128',
  barcodeImagePath: null,
  templateId: 'avery5821',
})

export default function Editor({ initialProduct, onBack, onOpenSheet }: Props): JSX.Element {
  const isNew = !initialProduct

  const [product, setProduct] = useState<Partial<Product>>(
    initialProduct ?? EMPTY_PRODUCT()
  )
  const [templateDataUri, setTemplateDataUri] = useState('')
  const [barcodeOverrideDataUri, setBarcodeOverrideDataUri] = useState('')
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [saveError, setSaveError] = useState('')
  const [exporting, setExporting] = useState(false)
  const [regenConfirm, setRegenConfirm] = useState(false)

  useEffect(() => {
    window.api.file.getTemplatePNG().then((r) => {
      if (r.ok && r.data) setTemplateDataUri(r.data)
    })
  }, [])

  useEffect(() => {
    if (!initialProduct?.barcodeImagePath) return
    window.api.file.readImageAsBase64(initialProduct.barcodeImagePath).then((r) => {
      if (r.ok && r.data) setBarcodeOverrideDataUri(r.data)
    })
  }, [initialProduct?.barcodeImagePath])

  function update(field: keyof Product, value: string): void {
    setProduct((prev) => ({ ...prev, [field]: value }))
    if (saveStatus === 'saved') setSaveStatus('idle')
  }

  async function handleSave(): Promise<Product | null> {
    if (!product.name?.trim()) {
      setSaveError('Product name is required.')
      setSaveStatus('error')
      return null
    }
    if (!product.price?.trim()) {
      setSaveError('Price is required.')
      setSaveStatus('error')
      return null
    }
    setSaveStatus('saving')
    setSaveError('')
    let result
    if (isNew || !product.id) {
      result = await window.api.product.create({
        name: product.name!,
        price: product.price!,
        barcodeValue: product.barcodeValue!,
        barcodeType: 'CODE128',
        barcodeImagePath: product.barcodeImagePath ?? null,
        templateId: 'avery5821',
      })
    } else {
      result = await window.api.product.update(product as Product)
    }
    if (result.ok) {
      setProduct(result.data)
      setSaveStatus('saved')
      return result.data
    } else {
      setSaveError(result.error)
      setSaveStatus('error')
      return null
    }
  }

  async function handleExportPDF(): Promise<void> {
    const saved = await handleSave()
    if (!saved) return
    setExporting(true)
    const result = await window.api.export.singlePDF(saved)
    if (!result.ok) alert(`Export failed: ${result.error}`)
    setExporting(false)
  }

  async function handleExportSVG(): Promise<void> {
    const saved = await handleSave()
    if (!saved) return
    setExporting(true)
    const result = await window.api.export.singleSVG(saved)
    if (!result.ok) alert(`Export failed: ${result.error}`)
    setExporting(false)
  }

  async function handlePrint(): Promise<void> {
    const saved = await handleSave()
    if (!saved) return
    onOpenSheet(saved)
  }

  async function handleUploadBarcode(): Promise<void> {
    const pickedResult = await window.api.file.pickBarcodeImage()
    if (!pickedResult.ok || !pickedResult.data) return
    const sourcePath = pickedResult.data
    const productId = product.id ?? `tmp-${Date.now()}`
    const saveResult = await window.api.file.saveBarcodeImage(sourcePath, productId)
    if (!saveResult.ok) { alert(`Failed to save barcode image: ${saveResult.error}`); return }
    const storedPath = saveResult.data
    setProduct((prev) => ({ ...prev, barcodeImagePath: storedPath }))
    const b64Result = await window.api.file.readImageAsBase64(storedPath)
    if (b64Result.ok && b64Result.data) setBarcodeOverrideDataUri(b64Result.data)
    setSaveStatus('idle')
  }

  function handleRemoveBarcodeImage(): void {
    setProduct((prev) => ({ ...prev, barcodeImagePath: null }))
    setBarcodeOverrideDataUri('')
    setSaveStatus('idle')
  }

  function handleRegen(): void {
    if (!regenConfirm) { setRegenConfirm(true); return }
    const newVal = generateBarcodeValue()
    setProduct((prev) => ({ ...prev, barcodeValue: newVal, barcodeImagePath: null }))
    setBarcodeOverrideDataUri('')
    setRegenConfirm(false)
    setSaveStatus('idle')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>

      {/* ── Top bar ── */}
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
        <span style={{ fontSize: 13, fontWeight: 600, color: '#1a2332', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {isNew ? 'New Product' : product.name || 'Edit Product'}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          {saveStatus === 'saved' && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#1f7a1f', fontWeight: 500, marginRight: 4 }}>
              <CheckCircle2 size={13} /> Saved
            </span>
          )}
          {saveStatus === 'error' && saveError && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#dc2626', fontWeight: 500, marginRight: 4 }}>
              <AlertCircle size={13} /> {saveError}
            </span>
          )}
          <button onClick={handleSave} disabled={saveStatus === 'saving'} className="btn-primary btn-sm">
            <Save size={12} /> {saveStatus === 'saving' ? 'Saving…' : 'Save'}
          </button>
          <button onClick={handleExportPDF} disabled={exporting} className="btn-outline btn-sm">
            <FileText size={12} /> PDF
          </button>
          <button onClick={handleExportSVG} disabled={exporting} className="btn-outline btn-sm">
            <FileCode2 size={12} /> SVG
          </button>
          <button onClick={handlePrint} className="btn-green btn-sm">
            <Layers size={12} /> Print Sheet
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Preview panel — 2/3 width */}
        <div style={{
          flex: 2,
          background: '#f0f2f5',
          borderRight: '1px solid #e8eaed',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center',
          padding: '28px 24px',
          gap: 14,
          overflowY: 'auto',
        }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
            Preview
          </p>
          <div style={{ width: '80%', maxWidth: 480 }}>
            <LabelPreview
              product={product}
              templateDataUri={templateDataUri}
              barcodeOverrideDataUri={barcodeOverrideDataUri}
            />
          </div>
          <p style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', lineHeight: 1.5, margin: 0 }}>
            Live preview —<br />matches printed output
          </p>
        </div>

        {/* Form panel — 1/3 width */}
        <div style={{ flex: 1, overflowY: 'auto', background: 'white', padding: '28px 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Product name */}
            <div>
              <label className="label-text">Product Name *</label>
              <input
                className="input"
                placeholder="e.g. Fresh Mozzarella"
                value={product.name ?? ''}
                onChange={(e) => update('name', e.target.value)}
                maxLength={80}
                autoFocus={isNew}
              />
            </div>

            {/* Price */}
            <div>
              <label className="label-text">Price *</label>
              <input
                className="input"
                placeholder="e.g. $9.99/lb"
                value={product.price ?? ''}
                onChange={(e) => update('price', e.target.value)}
                maxLength={30}
              />
              <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 5 }}>
                Include symbol and unit — e.g. $9.99/lb or $4.50 each
              </p>
            </div>

            {/* Barcode */}
            <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label className="label-text" style={{ marginBottom: 0 }}>Barcode (Code 128)</label>
                {regenConfirm ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 11, color: '#d97706' }}>Confirm?</span>
                    <button onClick={handleRegen} className="btn-danger btn-sm">Yes</button>
                    <button onClick={() => setRegenConfirm(false)} className="btn-ghost btn-sm">Cancel</button>
                  </div>
                ) : (
                  <button onClick={handleRegen} className="btn-outline btn-sm">
                    <RefreshCw size={11} /> Regenerate
                  </button>
                )}
              </div>

              <div style={{
                background: '#f8fafc', borderRadius: 8, padding: '8px 12px',
                fontFamily: 'monospace', fontSize: 13, color: '#475569', letterSpacing: '0.05em'
              }}>
                {product.barcodeValue ?? '—'}
              </div>

              {barcodeOverrideDataUri ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img
                    src={barcodeOverrideDataUri}
                    alt="Uploaded barcode"
                    style={{ height: 36, objectFit: 'contain', background: 'white', border: '1px solid #e2e8f0', borderRadius: 6, padding: 4 }}
                  />
                  <span style={{ fontSize: 12, color: '#64748b', flex: 1 }}>Custom barcode image</span>
                  <button onClick={handleRemoveBarcodeImage} className="btn-ghost btn-sm" style={{ color: '#f87171' }}>
                    <X size={12} /> Remove
                  </button>
                </div>
              ) : (
                <button onClick={handleUploadBarcode} className="btn-outline btn-sm" style={{ alignSelf: 'flex-start' }}>
                  <Upload size={12} /> Upload barcode image
                </button>
              )}
            </div>

            {/* Print warning */}
            <div style={{
              fontSize: 12, color: '#78716c',
              background: '#fffbeb', border: '1px solid #fde68a',
              borderRadius: 8, padding: '10px 14px'
            }}>
              When printing, set scale to <strong>100% / Actual Size</strong>. Do not use "Fit to page."
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
