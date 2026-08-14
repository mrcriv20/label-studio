import { useState, useEffect, useMemo, useRef } from 'react'
import {
  ArrowLeft, Save, FileText, FileCode2,
  RefreshCw, Upload, X, AlertCircle, CheckCircle2, Layers, Sticker, MoreHorizontal
} from 'lucide-react'
import JsBarcode from 'jsbarcode'
import LabelPreview from '../components/LabelPreview'
import RollPrintDialog from '../components/RollPrintDialog'
import { generateBarcodeValue } from '../lib/barcode'
import type { Product, LabelTemplate, DesignTemplate, AppSettings } from '../types'
import { getLabelTemplate } from '../../../shared/labelTemplates'
import { assessProductContentFit, outputEligibilityError } from '../../../shared/contentFit'

interface Props {
  initialProduct: Product | null
  onBack: () => void
  onOpenSheet: (product: Product) => void
  onOpenDesigner?: (designId?: string | null) => void
  onDirtyChange: (dirty: boolean) => void
  repairField?: keyof Product | null
  onReturnToSheet?: () => void
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
  designImageOverrides: null,
  tillieProductId: null,
})

export default function Editor({ initialProduct, onBack, onOpenSheet, onOpenDesigner, onDirtyChange, repairField, onReturnToSheet }: Props): JSX.Element {
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
  const [rollProduct, setRollProduct] = useState<Product | null>(null)
  const [designDoc, setDesignDoc] = useState<DesignTemplate | null>(null)
  const [outputNotice, setOutputNotice] = useState('')
  const [outputError, setOutputError] = useState('')
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [renderedFitIssues, setRenderedFitIssues] = useState<Array<{ field: keyof Product; label: string; status: 'tight' | 'clipped'; message: string }> | null>(null)
  const saveInFlight = useRef<Promise<Product | null> | null>(null)
  const savedProductRef = useRef(JSON.stringify(product))
  const draftAssetIdRef = useRef(`draft-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`)
  const newAssetPathsRef = useRef(new Set<string>())
  const replacedAssetPathsRef = useRef(new Set<string>())
  const dirty = useMemo(() => JSON.stringify(product) !== savedProductRef.current, [product, saveStatus])
  const estimatedFitIssues = useMemo(() => assessProductContentFit(product), [product])
  const contentFitIssues = renderedFitIssues ?? estimatedFitIssues
  const clippedContent = contentFitIssues.filter((issue) => issue.status === 'clipped')

  useEffect(() => {
    onDirtyChange(dirty)
    return () => onDirtyChange(false)
  }, [dirty, onDirtyChange])

  useEffect(() => () => {
    for (const filePath of newAssetPathsRef.current) void window.api.file.deleteManagedImage(filePath)
  }, [])

  useEffect(() => {
    if (!repairField) return
    const ids: Partial<Record<keyof Product, string>> = {
      name: 'product-name',
      templateId: 'product-template',
      price: 'product-price',
      category: 'product-category',
      customerName: 'customer-name',
      servingInfo: 'serving-info',
      nutritionInfo: 'nutrition-info',
      cookingInstructions: 'cooking-instructions',
      ingredients: 'ingredients',
      allergenStatement: 'allergen-note',
    }
    const id = ids[repairField]
    if (!id) return
    const timer = window.setTimeout(() => {
      const field = document.getElementById(id) as HTMLElement | null
      const disclosure = field?.closest('details') as HTMLDetailsElement | null
      if (disclosure) disclosure.open = true
      field?.classList.add('repair-field-focus')
      field?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      field?.focus()
    }, 80)
    return () => window.clearTimeout(timer)
  }, [repairField])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.api.output.preflight([{ product: product as Product }]).then((result) => {
        if (result.ok) setRenderedFitIssues(result.data)
      })
    }, 180)
    return () => window.clearTimeout(timer)
  }, [product])

  function stageAssetReplacement(previousPath: string | null | undefined, nextPath: string): void {
    if (previousPath && previousPath !== nextPath) {
      if (newAssetPathsRef.current.delete(previousPath)) void window.api.file.deleteManagedImage(previousPath)
      else replacedAssetPathsRef.current.add(previousPath)
    }
    newAssetPathsRef.current.add(nextPath)
  }

  function stageAssetRemoval(filePath: string | null | undefined): void {
    if (!filePath) return
    if (newAssetPathsRef.current.delete(filePath)) void window.api.file.deleteManagedImage(filePath)
    else replacedAssetPathsRef.current.add(filePath)
  }

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
      if (r.ok) {
        setGlobalLabelBackground(r.data.labelBackgroundColor)
        setSettings(r.data)
      }
    })
  }, [])

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent): void {
      if (!(event.metaKey || event.ctrlKey)) return
      if (event.key.toLowerCase() === 's') {
        event.preventDefault()
        void handleSave()
      }
      if (event.key.toLowerCase() === 'p') {
        event.preventDefault()
        void handlePrint()
      }
    }
    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  })

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

  // Design templates: fetch the design so per-label image slots can be listed.
  useEffect(() => {
    if (!product.templateId?.startsWith('design-')) {
      setDesignDoc(null)
      return
    }
    let alive = true
    window.api.design.get(product.templateId).then((result) => {
      if (alive) setDesignDoc(result.ok ? result.data : null)
    })
    return () => {
      alive = false
    }
  }, [product.templateId])

  const designImageSlots = useMemo(
    () =>
      (designDoc?.elements ?? []).flatMap((element, index) =>
        element.type === 'image' && element.source === 'asset'
          ? [{ id: element.id, label: element.label || element.assetName || `Image ${index + 1}` }]
          : []
      ),
    [designDoc]
  )

  async function handlePickDesignImage(elementId: string): Promise<void> {
    const productId = product.id ?? draftAssetIdRef.current
    const result = await window.api.design.pickSlotImage(productId, elementId)
    if (!result.ok) { setOutputError(`Design image could not be saved: ${result.error}`); return }
    if (!result.data) return
    const storedPath = result.data
    stageAssetReplacement(product.designImageOverrides?.[elementId], storedPath)
    setProduct((prev) => ({
      ...prev,
      designImageOverrides: { ...(prev.designImageOverrides ?? {}), [elementId]: storedPath },
    }))
    setSaveStatus('idle')
  }

  function handleClearDesignImage(elementId: string): void {
    stageAssetRemoval(product.designImageOverrides?.[elementId])
    setProduct((prev) => {
      const next = { ...(prev.designImageOverrides ?? {}) }
      delete next[elementId]
      return { ...prev, designImageOverrides: Object.keys(next).length ? next : null }
    })
    setSaveStatus('idle')
  }

  const activeTemplate = useMemo(
    () => getLabelTemplate(product.templateId),
    [product.templateId]
  )
  const usesPrice = activeTemplate.layout === 'front' || activeTemplate.layout === 'info'
  const usesBarcode = activeTemplate.layout === 'front' || activeTemplate.layout === 'info'
  const usesCookingInstructions = activeTemplate.layout === 'info' || activeTemplate.layout === 'vertical-info'
  // Custom artwork templates often bake the name into the design, so it can be
  // hidden there. Design templates control visibility per element too.
  const isDesignTemplate = Boolean(product.templateId?.startsWith('design-'))
  const usesProductNameToggle = Boolean(product.templateId?.startsWith('custom-')) || isDesignTemplate
  const requiresName = activeTemplate.layout !== 'logo-only'
  const previewUsesSampleContent = isNew && (
    (requiresName && !product.name?.trim()) ||
    (usesPrice && product.showPrice !== false && !product.price?.trim())
  )

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

  function updateFlag(field: 'showPrice' | 'showBarcode' | 'showCookingInstructions' | 'showProductName', value: boolean): void {
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
        showProductName: product.showProductName ?? true,
        designImageOverrides: product.designImageOverrides ?? null,
        tillieProductId: product.tillieProductId ?? null,
      })
    } else {
      result = await window.api.product.update({
        ...(product as Product),
        barcodeValue: (product.barcodeValue ?? '').trim(),
      })
    }
    if (result.ok) {
      newAssetPathsRef.current.clear()
      for (const filePath of replacedAssetPathsRef.current) void window.api.file.deleteManagedImage(filePath)
      replacedAssetPathsRef.current.clear()
      savedProductRef.current = JSON.stringify(result.data)
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
    const eligibilityError = outputEligibilityError([{ product }], 'PDF export')
    if (eligibilityError) {
      setOutputError(eligibilityError)
      return
    }
    const saved = await handleSave()
    if (!saved) return
    setExporting(true)
    const result = await window.api.export.singlePDF(saved)
    if (!result.ok) setOutputError(`PDF export failed: ${result.error}. Check the export folder and try again.`)
    else if (result.data) setOutputNotice('Label PDF exported.')
    setExporting(false)
  }

  async function handleExportSVG(): Promise<void> {
    const eligibilityError = outputEligibilityError([{ product }], 'SVG export')
    if (eligibilityError) {
      setOutputError(eligibilityError)
      return
    }
    const saved = await handleSave()
    if (!saved) return
    setExporting(true)
    const result = await window.api.export.singleSVG(saved)
    if (!result.ok) setOutputError(`SVG export failed: ${result.error}. Check the export folder and try again.`)
    else if (result.data) setOutputNotice('Label SVG exported.')
    setExporting(false)
  }

  async function handlePrint(): Promise<void> {
    const eligibilityError = outputEligibilityError([{ product }], 'Sheet printing')
    if (eligibilityError) {
      setOutputError(eligibilityError)
      return
    }
    const saved = await handleSave()
    if (!saved) return
    onOpenSheet(saved)
  }

  async function handleRollPrint(): Promise<void> {
    const eligibilityError = outputEligibilityError([{ product }], 'Roll printing')
    if (eligibilityError) {
      setOutputError(eligibilityError)
      return
    }
    const saved = await handleSave()
    if (!saved) return
    setRollProduct(saved)
  }

  async function handleUploadBarcode(): Promise<void> {
    const pickedResult = await window.api.file.pickBarcodeImage()
    if (!pickedResult.ok || !pickedResult.data) return
    const sourcePath = pickedResult.data
    const productId = product.id ?? draftAssetIdRef.current
    const saveResult = await window.api.file.saveBarcodeImage(sourcePath, productId)
    if (!saveResult.ok) { setOutputError(`Barcode image could not be saved: ${saveResult.error}`); return }
    const storedPath = saveResult.data
    stageAssetReplacement(product.barcodeImagePath, storedPath)
    setProduct((prev) => ({ ...prev, barcodeImagePath: storedPath }))
    const b64Result = await window.api.file.readImageAsBase64(storedPath)
    if (b64Result.ok && b64Result.data) setBarcodeOverrideDataUri(b64Result.data)
    setSaveStatus('idle')
  }

  async function handleUploadLogo(): Promise<void> {
    const pickedResult = await window.api.file.pickLogoImage()
    if (!pickedResult.ok || !pickedResult.data) return
    const sourcePath = pickedResult.data
    const productId = product.id ?? draftAssetIdRef.current
    const saveResult = await window.api.file.saveLogoImage(sourcePath, productId)
    if (!saveResult.ok) { setOutputError(`Top image could not be saved: ${saveResult.error}`); return }
    stageAssetReplacement(product.logoImagePath, saveResult.data)
    setProduct((prev) => ({ ...prev, logoImagePath: saveResult.data }))
    setSaveStatus('idle')
  }

  function handleRemoveBarcodeImage(): void {
    stageAssetRemoval(product.barcodeImagePath)
    setProduct((prev) => ({ ...prev, barcodeImagePath: null }))
    setBarcodeOverrideDataUri('')
    setSaveStatus('idle')
  }

  function handleRemoveLogo(): void {
    stageAssetRemoval(product.logoImagePath)
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
      <div className="workspace-toolbar editor-toolbar" style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '0 20px', height: 52,
        background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-soft)',
        flexShrink: 0,
      }}>
        <button onClick={onBack} className="btn-ghost btn-sm">
          <ArrowLeft size={13} /> {onReturnToSheet ? 'Draft Sheet' : 'Products'}
        </button>
        <span style={{ color: 'var(--color-border-strong)', fontSize: 13 }}>/</span>
        <h1 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-workbench-navy)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
          {isNew ? 'New Label' : product.name || 'Edit Label'}
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          {saveStatus === 'saved' && (
            <span role="status" aria-live="polite" className="status-message" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#1f7a1f', fontWeight: 500, marginRight: 4 }}>
              <CheckCircle2 size={13} /> Saved
            </span>
          )}
          {dirty && saveStatus !== 'saving' && saveStatus !== 'error' && (
            <span role="status" className="status-message" style={{ fontSize: 12, color: 'var(--color-text-secondary)', fontWeight: 500, marginRight: 4 }}>
              Unsaved changes
            </span>
          )}
          {saveStatus === 'error' && saveError && (
            <span role="alert" className="status-message" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--color-danger-text)', fontWeight: 500, marginRight: 4 }}>
              <AlertCircle size={13} /> {saveError}
            </span>
          )}
          <button onClick={handleSave} disabled={saveStatus === 'saving'} className="btn-outline btn-sm" title="Save label (⌘S)">
            <Save size={12} /> {saveStatus === 'saving' ? 'Saving…' : 'Save'}
          </button>
          {onReturnToSheet && (
            <button onClick={async () => { const saved = await handleSave(); if (saved) onReturnToSheet() }} disabled={saveStatus === 'saving'} className="btn-green btn-sm">
              Return to Sheet
            </button>
          )}
          {!onReturnToSheet && <button onClick={handlePrint} className="btn-green btn-sm" title="Save and open print setup (⌘P)">
            <Layers size={12} /> Print Sheet
          </button>}
          <details className="row-actions-menu">
            <summary className="btn btn-icon" aria-label="More label output actions" title="More output actions"><MoreHorizontal size={14} /></summary>
            <div className="row-actions-popover">
              <button onClick={handleExportPDF} disabled={exporting}><FileText size={13} /> Export label PDF</button>
              <button onClick={handleExportSVG} disabled={exporting}><FileCode2 size={13} /> Export label SVG</button>
              <button onClick={handleRollPrint}><Sticker size={13} /> Print roll label</button>
            </div>
          </details>
        </div>
      </div>

      {rollProduct && <RollPrintDialog product={rollProduct} onClose={() => setRollProduct(null)} />}
      {outputNotice && (
        <div role="status" aria-live="polite" className="status-message" style={{ padding: '8px 20px', background: 'var(--color-success-surface)', color: 'var(--color-success-text)', fontSize: 12 }}>
          {outputNotice}
        </div>
      )}
      {outputError && (
        <div role="alert" className="status-message" style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 20px', background: 'var(--color-danger-surface)', color: 'var(--color-danger-text)', fontSize: 12 }}>
          <span style={{ flex: 1 }}>{outputError}</span>
          <button className="btn-ghost btn-sm" onClick={() => setOutputError('')}>Dismiss</button>
        </div>
      )}

      {/* ── Body ── */}
      <div className="editor-workspace" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Preview panel */}
        <div className="editor-preview-pane" style={{
          background: 'var(--color-panel)',
          borderRight: '1px solid var(--color-border-soft)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center',
          padding: '28px 24px',
          gap: 14,
          overflowY: 'auto',
        }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
            Preview
          </p>
          {previewUsesSampleContent && (
            <div role="status" style={{ fontSize: 12, color: 'var(--color-warning)', background: 'var(--color-warning-surface)', border: '1px solid var(--color-warning-border)', borderRadius: 8, padding: '7px 10px' }}>
              Sample preview — enter the required product details before saving or printing.
            </div>
          )}
          <div style={{ width: '80%', maxWidth: 480 }}>
            <LabelPreview
              product={product}
              barcodeOverrideDataUri={barcodeOverrideDataUri}
              logoDataUri={logoDataUri}
            />
          </div>
          <p style={{ fontSize: 11, color: 'var(--color-text-muted)', textAlign: 'center', lineHeight: 1.5, margin: 0 }}>
            Live label preview · verify physical placement in Print Sheet
          </p>
          <div className="card print-preflight" style={{ width: 'min(100%, 520px)', padding: 14 }}>
            <div className="preflight-item"><strong>Label</strong><span>{activeTemplate.name} · {(activeTemplate.width / 72).toFixed(2)} × {(activeTemplate.height / 72).toFixed(2)} in</span></div>
            <div className="preflight-item"><strong>Barcode</strong><span>{product.showBarcode === false || !usesBarcode ? 'Not printed' : barcodeValidity ? 'Ready' : 'Needs attention'}</span></div>
            <div className="preflight-item">
              <strong>Content fit</strong>
              <span className={clippedContent.length ? 'fit-status clipped' : contentFitIssues.length ? 'fit-status tight' : 'fit-status fits'}>
                {clippedContent.length ? `${clippedContent.length} field${clippedContent.length === 1 ? '' : 's'} clipped` : contentFitIssues.length ? 'Tight — review text' : 'Fits printable zones'}
              </span>
            </div>
            <div className="preflight-item"><strong>Sheet stock</strong><span>PLS780 · US Letter</span></div>
            <div className="preflight-item"><strong>Print setup</strong><span>Actual Size · offsets {settings?.sheetOffsetXIn || '0.000'}, {settings?.sheetOffsetYIn || '0.000'} in</span></div>
          </div>
          {contentFitIssues.length > 0 && (
            <div className={clippedContent.length ? 'content-fit-callout clipped' : 'content-fit-callout tight'} role={clippedContent.length ? 'alert' : 'status'}>
              <strong>{clippedContent.length ? 'Printed content will be clipped' : 'Printed content is close to the limit'}</strong>
              <ul>
                {contentFitIssues.map((issue) => <li key={`${issue.field}-${issue.status}`}>{issue.message}</li>)}
              </ul>
              <span>{clippedContent.length ? 'Shorten the field or choose another label before printing or exporting PDF.' : 'Check the preview carefully before output.'}</span>
            </div>
          )}
        </div>

        {/* Working inspector */}
        <div className="editor-form-pane" style={{ overflowY: 'auto', background: 'var(--color-surface)', padding: '28px 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Product name */}
            <div>
              <label className="label-text" htmlFor="product-name">Product Name {requiresName ? '*' : '(optional)'}</label>
              <input
                id="product-name"
                className="input"
                placeholder="e.g. Fresh Mozzarella"
                value={product.name ?? ''}
                onChange={(e) => update('name', e.target.value)}
                maxLength={80}
              />
            </div>

            <div>
              <label className="label-text" htmlFor="product-template">Choose Label</label>
              <select
                id="product-template"
                className="input"
                value={product.templateId ?? 'avery5821'}
                onChange={(e) => update('templateId', e.target.value)}
              >
                {templates.map((template) => <option key={template.id} value={template.id}>{template.name}</option>)}
              </select>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: '5px 0 0' }}>{templateNote}</p>
            </div>

            <details className="editor-disclosure">
              <summary>Customize this label only</summary>
              <div className="editor-disclosure-body">
            {/* Per-label design image slots */}
            {isDesignTemplate && designImageSlots.length > 0 && (
              <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <div className="section-label" style={{ marginBottom: 0 }}>Customize this label only</div>
                  <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: '5px 0 0' }}>Image changes below affect only this product. The reusable template stays unchanged.</p>
                </div>
                {designImageSlots.map((slot) => {
                  const overridden = Boolean(product.designImageOverrides?.[slot.id])
                  return (
                    <div key={slot.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ flex: 1, fontSize: 12, color: 'var(--color-text-strong-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {slot.label}
                        {overridden && <span style={{ color: 'var(--color-success-text)' }}> — custom</span>}
                      </span>
                      <button type="button" className="btn-outline btn-sm" onClick={() => handlePickDesignImage(slot.id)}>
                        <Upload size={12} /> {overridden ? 'Replace…' : 'Change…'}
                      </button>
                      {overridden && (
                        <button type="button" className="btn-outline btn-sm" title="Use the design's image" onClick={() => handleClearDesignImage(slot.id)}>
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  )
                })}
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0 }}>
                  Swap this design’s images for this label only. Other products using the template keep the design’s images.
                </p>
              </div>
            )}

            <div>
              <label className="label-text" htmlFor="label-background-hex">Label Background</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  id="label-background-hex"
                  type="color"
                  value={product.labelBackgroundColor || globalLabelBackground || activeTemplate.shellColor}
                  onChange={(e) => update('labelBackgroundColor', e.target.value)}
                  aria-label="Label background color"
                  style={{ width: 44, height: 36, padding: 2, border: '1px solid var(--color-border)', borderRadius: 6, background: 'var(--color-surface)', cursor: 'pointer' }}
                />
                <input
                  className="input"
                  aria-label="Label background hex value"
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
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 5 }}>
                Inheritance: reusable template → global color in Settings → this-label override. Leave blank to inherit the global color.
              </p>
              {onOpenDesigner && <button type="button" className="btn-ghost btn-sm" style={{ marginTop: 8 }} onClick={() => onOpenDesigner(product.templateId)}>Manage reusable templates in Designer</button>}
            </div>
              </div>
            </details>

            {/* Price */}
            <div>
              <label className="label-text" htmlFor="product-price">Price {usesPrice && product.showPrice !== false ? '*' : '(optional)'}</label>
              <input
                id="product-price"
                className="input"
                placeholder="e.g. $9.99/lb"
                value={product.price ?? ''}
                onChange={(e) => update('price', e.target.value)}
                maxLength={30}
              />
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 5 }}>
                Include symbol and unit — e.g. $9.99/lb or $4.50 each
              </p>
              {product.tillieProductId && (
                <p style={{ fontSize: 11, color: '#b45309', marginTop: 5 }}>
                  This label is linked to Tillie — name, price, and category are overwritten by the
                  register on each sync. Change the price in Tillie to keep them in step.
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="label-text" htmlFor="product-category">Category</label>
              <input
                id="product-category"
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
                <label className="label-text" htmlFor="customer-name">Customer / Order Name</label>
                <input
                  id="customer-name"
                  className="input"
                  placeholder="e.g. The Smith Family"
                  value={product.customerName ?? ''}
                  onChange={(e) => update('customerName', e.target.value)}
                  maxLength={60}
                />
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 5 }}>
                  Shown at the bottom of the catering instruction label.
                </p>
              </div>
            )}

            <details className="editor-disclosure">
              <summary>Advanced label details</summary>
              <div className="editor-disclosure-body">
            {/* Extra label info */}
            <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="section-label" style={{ marginBottom: 0 }}>Details Panel</div>

              <div>
                <label className="label-text" htmlFor="serving-info">Serving Info</label>
                <textarea
                  id="serving-info"
                  className="input"
                  rows={2}
                  placeholder="e.g. Serving Size: 1 oz | Calories 25"
                  value={product.servingInfo ?? ''}
                  onChange={(e) => update('servingInfo', e.target.value)}
                  style={{ resize: 'vertical', minHeight: 56 }}
                />
              </div>

              <div>
                <label className="label-text" htmlFor="nutrition-info">Nutrition Info</label>
                <textarea
                  id="nutrition-info"
                  className="input"
                  rows={3}
                  placeholder="e.g. Total Fat 0g | Total Carbohydrates 3g | Sodium 150mg | Protein 1g"
                  value={product.nutritionInfo ?? ''}
                  onChange={(e) => update('nutritionInfo', e.target.value)}
                  style={{ resize: 'vertical', minHeight: 72 }}
                />
              </div>

              <div>
                <label className="label-text" htmlFor="cooking-instructions">Cooking Instructions</label>
                <textarea
                  id="cooking-instructions"
                  className="input"
                  rows={2}
                  placeholder="e.g. Fry at 365° for 5 minutes"
                  value={product.cookingInstructions ?? ''}
                  onChange={(e) => update('cookingInstructions', e.target.value)}
                  style={{ resize: 'vertical', minHeight: 56 }}
                />
              </div>

              <div>
                <label className="label-text" htmlFor="ingredients">Ingredients</label>
                <textarea
                  id="ingredients"
                  className="input"
                  rows={3}
                  placeholder="e.g. water, chickpea flour, salt"
                  value={product.ingredients ?? ''}
                  onChange={(e) => update('ingredients', e.target.value)}
                  style={{ resize: 'vertical', minHeight: 72 }}
                />
              </div>

              <div>
                <label className="label-text" htmlFor="allergen-note">Allergen / Handling Note</label>
                <textarea
                  id="allergen-note"
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
              <div className="section-label" style={{ marginBottom: 0 }}>Display Options</div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--color-text-strong-secondary)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={product.showPrice !== false}
                  onChange={(e) => updateFlag('showPrice', e.target.checked)}
                  disabled={!usesPrice}
                />
                Show price on label
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--color-text-strong-secondary)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={product.showBarcode !== false}
                  onChange={(e) => updateFlag('showBarcode', e.target.checked)}
                  disabled={!usesBarcode}
                />
                Show barcode on label
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--color-text-strong-secondary)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={product.showCookingInstructions !== false}
                  onChange={(e) => updateFlag('showCookingInstructions', e.target.checked)}
                  disabled={!usesCookingInstructions}
                />
                Show cooking instructions
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--color-text-strong-secondary)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={product.showProductName !== false}
                  onChange={(e) => updateFlag('showProductName', e.target.checked)}
                  disabled={!usesProductNameToggle}
                />
                Show product name on label
              </label>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0 }}>
                Disabled options are ignored by the selected template.
              </p>
            </div>

            {/* Top image */}
            <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="section-label" style={{ marginBottom: 0 }}>Top Image</div>
              </div>

              {logoDataUri ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img
                    src={logoDataUri}
                    alt="Uploaded top image"
                    style={{ width: 88, height: 44, objectFit: 'contain', background: 'var(--color-neutral-soft)', border: '1px solid var(--color-border)', borderRadius: 6, padding: 4 }}
                  />
                  <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', flex: 1 }}>
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

              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0 }}>
                Leave this empty to use the selected template’s default logo. An uploaded image overrides it for this product only.
              </p>
            </div>

            {/* Barcode */}
            <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="section-label" style={{ marginBottom: 0 }}>Barcode (Code 128)</div>
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
                <label className="label-text" htmlFor="barcode-number">Barcode Number</label>
                <input
                  id="barcode-number"
                  className="input"
                  placeholder="Type barcode value"
                  value={product.barcodeValue ?? ''}
                  onChange={(e) => update('barcodeValue', e.target.value)}
                  maxLength={80}
                  style={{ fontFamily: 'monospace', letterSpacing: '0.04em' }}
                />
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 5 }}>
                  You can type your own barcode or regenerate one automatically.
                </p>
                {usesBarcode && product.showBarcode !== false && barcodeValidity === false && (
                  <p style={{ fontSize: 11, color: 'var(--color-danger-text)', marginTop: 5 }}>
                    This value cannot be rendered as Code 128.
                  </p>
                )}
                {usesBarcode && product.showBarcode !== false && barcodeValidity === true && (
                  <p style={{ fontSize: 11, color: 'var(--color-success-text)', marginTop: 5 }}>
                    Valid Code 128 value.
                  </p>
                )}
              </div>

              {barcodeOverrideDataUri ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img
                    src={barcodeOverrideDataUri}
                    alt="Uploaded barcode"
                    style={{ height: 36, objectFit: 'contain', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 6, padding: 4 }}
                  />
                  <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', flex: 1 }}>
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
              </div>
            </details>

            {/* Print warning */}
            <div style={{
              fontSize: 12, color: '#78716c',
              background: 'var(--color-warning-surface)', border: '1px solid var(--color-warning-border)',
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
