import { useState, useEffect, useMemo, useRef } from 'react'
import {
  ArrowLeft, Save, FileText, FileCode2,
  RefreshCw, Upload, X, AlertCircle, CheckCircle2, Layers
} from 'lucide-react'
import JsBarcode from 'jsbarcode'
import LabelPreview from '../components/LabelPreview'
import { generateBarcodeValue } from '../lib/barcode'
import type { Product, LabelTemplate } from '../types'
import { getLabelTemplate } from '../../../shared/labelTemplates'

interface Props {
  initialProduct: Product | null
  onBack: () => void
  onOpenSheet: (product: Product) => void
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

const EMPTY_PRODUCT = (): Omit<Product, 'id' | 'createdAt' | 'updatedAt'> => ({
  name: '',
  price: '',
  category: '',
  servingInfo: '',
  nutritionInfo: '',
  cookingInstructions: '',
  customerName: '',
  labelBackgroundColor: '',
  ingredients: '',
  allergenStatement: '',
  barcodeValue: generateBarcodeValue(),
  barcodeType: 'CODE128',
  barcodeImagePath: null,
  logoImagePath: null,
  templateId: 'avery5821',
  showPrice: true,
  showBarcode: true,
  showCookingInstructions: true,
})

export default function Editor({ initialProduct, onBack, onOpenSheet }: Props): JSX.Element {
  const isNew = !initialProduct

  const [product, setProduct] = useState<Partial<Product>>(
    initialProduct ?? EMPTY_PRODUCT()
  )
  const [barcodeOverrideDataUri, setBarcodeOverrideDataUri] = useState('')
  const [logoDataUri, setLogoDataUri] = useState('')
  const [templates, setTemplates] = useState<LabelTemplate[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [globalLabelBackground, setGlobalLabelBackground] = useState('')
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [saveError, setSaveError] = useState('')
  const [exporting, setExporting] = useState(false)
  const [regenConfirm, setRegenConfirm] = useState(false)
  const saveInFlight = useRef<Promise<Product | null> | null>(null)

  useEffect(() => {
    window.api.file.listTemplates().then((r) => {
      if (r.ok) setTemplates(r.data)
    })

    window.api.product.list().then((r) => {
      if (!r.ok) return

      const categoryByNormalizedName = new Map<string, string>()
      r.data.forEach(({ category }) => {
        const trimmedCategory = category?.trim()
        if (trimmedCategory) {
          categoryByNormalizedName.set(trimmedCategory.toLocaleLowerCase(), trimmedCategory)
        }
      })
      setCategories(
        Array.from(categoryByNormalizedName.values()).sort((a, b) =>
          a.localeCompare(b, undefined, { sensitivity: 'base' })
        )
      )
    })

    window.api.settings.get().then((r) => {
      if (r.ok) setGlobalLabelBackground(r.data.labelBackgroundColor)
    })
  }, [])

  useEffect(() => {
    if (!product.barcodeImagePath) {
      setBarcodeOverrideDataUri('')
      return
    }
    window.api.file.readImageAsBase64(product.barcodeImagePath).then((r) => {
      if (r.ok && r.data) setBarcodeOverrideDataUri(r.data)
    })
  }, [product.barcodeImagePath])

  useEffect(() => {
    if (!product.logoImagePath) {
      setLogoDataUri('')
      return
    }
    window.api.file.readImageAsBase64(product.logoImagePath).then((r) => {
      if (r.ok && r.data) setLogoDataUri(r.data)
    })
  }, [product.logoImagePath])

  const barcodeValidity = useMemo(() => {
    const value = (product.barcodeValue ?? '').trim()
    if (!value) return null
    try {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      JsBarcode(svg, value, {
        format: 'CODE128',
        displayValue: false,
      })
      return true
    } catch {
      return false
    }
  }, [product.barcodeValue])

  const activeTemplate = useMemo(
    () => getLabelTemplate(product.templateId),
    [product.templateId]
  )
  const usesPrice = activeTemplate.layout === 'front' || activeTemplate.layout === 'info'
  const usesBarcode = activeTemplate.layout === 'front' || activeTemplate.layout === 'info'
  const usesCookingInstructions = activeTemplate.layout === 'info' || activeTemplate.layout === 'vertical-info'
  const requiresName = activeTemplate.layout !== 'logo-only'

  const templateNote = activeTemplate.layout === 'front'
    ? 'Classic vertical label with name, optional price, and optional barcode.'
    : activeTemplate.layout === 'info'
      ? 'Landscape info label with nutrition, ingredients, and optional cooking instructions.'
      : activeTemplate.layout === 'vertical-info'
        ? 'Vertical label with a title and cooking instructions below the logo.'
        : 'Minimal white label that renders only the logo.'

  function update(field: keyof Product, value: string): void {
    setProduct((prev) => ({ ...prev, [field]: value }))
    if (saveStatus === 'saved') setSaveStatus('idle')
  }

  function updateFlag(field: 'showPrice' | 'showBarcode' | 'showCookingInstructions', value: boolean): void {
    setProduct((prev) => ({ ...prev, [field]: value }))
    if (saveStatus === 'saved') setSaveStatus('idle')
  }

  function handleSave(): Promise<Product | null> {
    if (saveInFlight.current) return saveInFlight.current

    const request = persistProduct()
    saveInFlight.current = request
    request.then(
      () => {
        if (saveInFlight.current === request) saveInFlight.current = null
      },
      () => {
        if (saveInFlight.current === request) saveInFlight.current = null
      }
    )
    return request
  }

  async function persistProduct(): Promise<Product | null> {
    if (product.labelBackgroundColor && !/^#[0-9a-f]{6}$/i.test(product.labelBackgroundColor)) {
      setSaveError('Label background must be a 6-digit hex color, such as #f5efdc.')
      setSaveStatus('error')
      return null
    }
    if (requiresName && !product.name?.trim()) {
      setSaveError('Product name is required.')
      setSaveStatus('error')
      return null
    }
    if (usesPrice && product.showPrice !== false && !product.price?.trim()) {
      setSaveError('Price is required.')
      setSaveStatus('error')
      return null
    }
    if (usesBarcode && product.showBarcode !== false && !product.barcodeValue?.trim() && !product.barcodeImagePath) {
      setSaveError('Barcode value is required.')
      setSaveStatus('error')
      return null
    }
    setSaveStatus('saving')
    setSaveError('')
    let result
    if (!product.id) {
      result = await window.api.product.create({
        name: product.name!,
        price: product.price ?? '',
        showPrice: product.showPrice ?? true,
        category: product.category ?? '',
        servingInfo: product.servingInfo ?? '',
        nutritionInfo: product.nutritionInfo ?? '',
        cookingInstructions: product.cookingInstructions ?? '',
        customerName: product.customerName ?? '',
        labelBackgroundColor: product.labelBackgroundColor ?? '',
        ingredients: product.ingredients ?? '',
        allergenStatement: product.allergenStatement ?? '',
        barcodeValue: (product.barcodeValue ?? '').trim(),
        showBarcode: product.showBarcode ?? true,
        barcodeType: 'CODE128',
        barcodeImagePath: product.barcodeImagePath ?? null,
        logoImagePath: product.logoImagePath ?? null,
        templateId: product.templateId ?? 'avery5821',
        showCookingInstructions: product.showCookingInstructions ?? true,
      })
    } else {
      result = await window.api.product.update({
        ...(product as Product),
        barcodeValue: (product.barcodeValue ?? '').trim(),
      })
    }
    if (result.ok) {
      setProduct(result.data)
      const savedCategory = result.data.category.trim()
      if (savedCategory) {
        setCategories((current) => {
          if (current.some((category) => category.localeCompare(savedCategory, undefined, { sensitivity: 'base' }) === 0)) {
            return current
          }
          return [...current, savedCategory].sort((a, b) =>
            a.localeCompare(b, undefined, { sensitivity: 'base' })
          )
        })
      }
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

  async function handleUploadLogo(): Promise<void> {
    const pickedResult = await window.api.file.pickLogoImage()
    if (!pickedResult.ok || !pickedResult.data) return
    const sourcePath = pickedResult.data
    const productId = product.id ?? `tmp-${Date.now()}`
    const saveResult = await window.api.file.saveLogoImage(sourcePath, productId)
    if (!saveResult.ok) { alert(`Failed to save top image: ${saveResult.error}`); return }
    setProduct((prev) => ({ ...prev, logoImagePath: saveResult.data }))
    setSaveStatus('idle')
  }

  function handleRemoveBarcodeImage(): void {
    setProduct((prev) => ({ ...prev, barcodeImagePath: null }))
    setBarcodeOverrideDataUri('')
    setSaveStatus('idle')
  }

  function handleRemoveLogo(): void {
    setProduct((prev) => ({ ...prev, logoImagePath: null }))
    setLogoDataUri('')
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
              barcodeOverrideDataUri={barcodeOverrideDataUri}
              logoDataUri={logoDataUri}
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
              <label className="label-text">Product Name {requiresName ? '*' : '(optional)'}</label>
              <input
                className="input"
                placeholder="e.g. Fresh Mozzarella"
                value={product.name ?? ''}
                onChange={(e) => update('name', e.target.value)}
                maxLength={80}
                autoFocus={isNew}
              />
            </div>

            {/* Template */}
            <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label className="label-text" style={{ marginBottom: 0 }}>Template</label>
              <select
                className="input"
                value={product.templateId ?? 'avery5821'}
                onChange={(e) => update('templateId', e.target.value)}
              >
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>{template.name}</option>
                ))}
              </select>
              <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>
                {templateNote}
              </p>
            </div>

            <div>
              <label className="label-text">Label Background</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="color"
                  value={product.labelBackgroundColor || globalLabelBackground || activeTemplate.shellColor}
                  onChange={(e) => update('labelBackgroundColor', e.target.value)}
                  aria-label="Label background color"
                  style={{ width: 44, height: 36, padding: 2, border: '1px solid #e2e8f0', borderRadius: 6, background: '#fff', cursor: 'pointer' }}
                />
                <input
                  className="input"
                  value={product.labelBackgroundColor || ''}
                  onChange={(e) => update('labelBackgroundColor', e.target.value)}
                  placeholder="Using global default"
                  pattern="^#[0-9A-Fa-f]{6}$"
                  maxLength={7}
                />
                {product.labelBackgroundColor && (
                  <button type="button" className="btn-outline" onClick={() => update('labelBackgroundColor', '')}>
                    Use Global
                  </button>
                )}
              </div>
              <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 5 }}>
                Leave blank to use the global label color from Settings.
              </p>
            </div>

            {/* Price */}
            <div>
              <label className="label-text">Price {usesPrice && product.showPrice !== false ? '*' : '(optional)'}</label>
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

            {/* Category */}
            <div>
              <label className="label-text">Category</label>
              <input
                className="input"
                placeholder="e.g. Grab & Go, Sauces, Cheese…"
                value={product.category ?? ''}
                onChange={(e) => update('category', e.target.value)}
                list="product-categories"
                maxLength={60}
              />
              <datalist id="product-categories">
                {categories.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
            </div>

            {activeTemplate.layout === 'vertical-info' && (
              <div>
                <label className="label-text">Customer / Order Name</label>
                <input
                  className="input"
                  placeholder="e.g. The Smith Family"
                  value={product.customerName ?? ''}
                  onChange={(e) => update('customerName', e.target.value)}
                  maxLength={60}
                />
                <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 5 }}>
                  Shown at the bottom of the catering instruction label.
                </p>
              </div>
            )}

            {/* Extra label info */}
            <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <label className="label-text" style={{ marginBottom: 0 }}>Details Panel</label>

              <div>
                <label className="label-text">Serving Info</label>
                <textarea
                  className="input"
                  rows={2}
                  placeholder="e.g. Serving Size: 1 oz | Calories 25"
                  value={product.servingInfo ?? ''}
                  onChange={(e) => update('servingInfo', e.target.value)}
                  style={{ resize: 'vertical', minHeight: 56 }}
                />
              </div>

              <div>
                <label className="label-text">Nutrition Info</label>
                <textarea
                  className="input"
                  rows={3}
                  placeholder="e.g. Total Fat 0g | Total Carbohydrates 3g | Sodium 150mg | Protein 1g"
                  value={product.nutritionInfo ?? ''}
                  onChange={(e) => update('nutritionInfo', e.target.value)}
                  style={{ resize: 'vertical', minHeight: 72 }}
                />
              </div>

              <div>
                <label className="label-text">Cooking Instructions</label>
                <textarea
                  className="input"
                  rows={2}
                  placeholder="e.g. Fry at 365° for 5 minutes"
                  value={product.cookingInstructions ?? ''}
                  onChange={(e) => update('cookingInstructions', e.target.value)}
                  style={{ resize: 'vertical', minHeight: 56 }}
                />
              </div>

              <div>
                <label className="label-text">Ingredients</label>
                <textarea
                  className="input"
                  rows={3}
                  placeholder="e.g. water, chickpea flour, salt"
                  value={product.ingredients ?? ''}
                  onChange={(e) => update('ingredients', e.target.value)}
                  style={{ resize: 'vertical', minHeight: 72 }}
                />
              </div>

              <div>
                <label className="label-text">Allergen / Handling Note</label>
                <textarea
                  className="input"
                  rows={3}
                  placeholder="e.g. Manufactured on equipment that also handles eggs, wheat..."
                  value={product.allergenStatement ?? ''}
                  onChange={(e) => update('allergenStatement', e.target.value)}
                  style={{ resize: 'vertical', minHeight: 72 }}
                />
              </div>
            </div>

            {/* Display options */}
            <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label className="label-text" style={{ marginBottom: 0 }}>Display Options</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#334155', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={product.showPrice !== false}
                  onChange={(e) => updateFlag('showPrice', e.target.checked)}
                  disabled={!usesPrice}
                />
                Show price on label
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#334155', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={product.showBarcode !== false}
                  onChange={(e) => updateFlag('showBarcode', e.target.checked)}
                  disabled={!usesBarcode}
                />
                Show barcode on label
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#334155', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={product.showCookingInstructions !== false}
                  onChange={(e) => updateFlag('showCookingInstructions', e.target.checked)}
                  disabled={!usesCookingInstructions}
                />
                Show cooking instructions
              </label>
              <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>
                Disabled options are ignored by the selected template.
              </p>
            </div>

            {/* Top image */}
            <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label className="label-text" style={{ marginBottom: 0 }}>Top Image</label>
              </div>

              {logoDataUri ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img
                    src={logoDataUri}
                    alt="Uploaded top image"
                    style={{ width: 88, height: 44, objectFit: 'contain', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: 4 }}
                  />
                  <span style={{ fontSize: 12, color: '#64748b', flex: 1 }}>
                    Fills the image area at the top of the label.
                  </span>
                  <button onClick={handleRemoveLogo} className="btn-ghost btn-sm" style={{ color: '#f87171' }}>
                    <X size={12} /> Remove
                  </button>
                </div>
              ) : (
                <button onClick={handleUploadLogo} className="btn-outline btn-sm" style={{ alignSelf: 'flex-start' }}>
                  <Upload size={12} /> Upload image
                </button>
              )}

              <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>
                If you leave this empty, the default Grazia's logo is used. Uploading an image overrides it for this product only.
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

              <div>
                <label className="label-text">Barcode Number</label>
                <input
                  className="input"
                  placeholder="Type barcode value"
                  value={product.barcodeValue ?? ''}
                  onChange={(e) => update('barcodeValue', e.target.value)}
                  maxLength={80}
                  style={{ fontFamily: 'monospace', letterSpacing: '0.04em' }}
                />
                <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 5 }}>
                  You can type your own barcode or regenerate one automatically.
                </p>
                {usesBarcode && product.showBarcode !== false && barcodeValidity === false && (
                  <p style={{ fontSize: 11, color: '#dc2626', marginTop: 5 }}>
                    This value cannot be rendered as Code 128.
                  </p>
                )}
                {usesBarcode && product.showBarcode !== false && barcodeValidity === true && (
                  <p style={{ fontSize: 11, color: '#16a34a', marginTop: 5 }}>
                    Valid Code 128 value.
                  </p>
                )}
              </div>

              {barcodeOverrideDataUri ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img
                    src={barcodeOverrideDataUri}
                    alt="Uploaded barcode"
                    style={{ height: 36, objectFit: 'contain', background: 'white', border: '1px solid #e2e8f0', borderRadius: 6, padding: 4 }}
                  />
                  <span style={{ fontSize: 12, color: '#64748b', flex: 1 }}>
                    Custom uploaded image (overrides typed/generated barcode)
                  </span>
                  <button onClick={handleRemoveBarcodeImage} className="btn-ghost btn-sm" style={{ color: '#f87171' }}>
                    <X size={12} /> Remove
                  </button>
                </div>
              ) : (
                <button onClick={handleUploadBarcode} className="btn-outline btn-sm" style={{ alignSelf: 'flex-start' }}>
                  <Upload size={12} /> Upload image
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
