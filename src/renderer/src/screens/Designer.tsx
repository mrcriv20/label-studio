import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  Barcode,
  Copy,
  Download,
  GripVertical,
  Image as ImageIcon,
  Lock,
  LockOpen,
  Plus,
  Save,
  Square,
  Trash2,
  Type,
  Upload,
  ZoomIn,
  ZoomOut,
  Undo2,
  Redo2,
  MoreHorizontal,
  CheckCircle2,
  X,
} from 'lucide-react'
import type { DesignTemplate, Product } from '../types'
import type {
  BarcodeElement,
  BoxElement,
  DesignElement,
  ImageElement,
  TextCase,
  TextElement,
  VisibleIf,
} from '../../../shared/design/types'
import { BINDABLE_FIELDS, DESIGN_ID_PREFIX, TEXT_CASE_OPTIONS } from '../../../shared/design/types'
import {
  paintDesignSVG,
  useBarcodeRenderer,
  useDesignImages,
  useTextMeasurer,
} from '../components/design/DesignLabelSvg'

// ── Constants ────────────────────────────────────────────────────────────────

const PT_PER_IN = 72
const MIN_ELEMENT_SIZE = 6
const SNAP_THRESHOLD = 3 // pt
const HISTORY_LIMIT = 100

const CANVAS_PRESETS: Array<{ label: string; w: number; h: number }> = [
  { label: '3.5 × 2 in — shelf tag', w: 252, h: 144 },
  { label: '2.5 × 4 in — roll portrait', w: 180, h: 288 },
  { label: '4 × 2.5 in — roll landscape', w: 288, h: 180 },
  { label: '5 × 3 in — jar / sauce label', w: 360, h: 216 },
  { label: 'PLS780-compatible slot (2.51 × 4.01 in)', w: 181, h: 289 },
]

const SAMPLE_PRODUCT: Partial<Product> = {
  name: 'Hot Honey Marinara',
  price: '$13.99',
  category: 'Sauces',
  ingredients: 'Tomatoes, olive oil, hot honey, garlic, basil, sea salt',
  allergenStatement: 'Made in a facility that also processes tree nuts.',
  servingInfo: 'Serving size 1/2 cup',
  nutritionInfo: 'Calories 45 per serving',
  cookingInstructions: 'Warm gently over low heat and serve.',
  customerName: 'Sample Customer',
  barcodeValue: '012345678905',
  showPrice: true,
  showBarcode: true,
  showCookingInstructions: true,
  showProductName: true,
}

const VISIBLE_IF_OPTIONS: Array<{ value: VisibleIf; label: string }> = [
  { value: 'always', label: 'Always' },
  { value: 'showProductName', label: 'When “Show product name” is on' },
  { value: 'showPrice', label: 'When “Show price” is on' },
  { value: 'showBarcode', label: 'When “Show barcode” is on' },
  { value: 'showCookingInstructions', label: 'When “Show cooking instructions” is on' },
]

type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'
const RESIZE_HANDLES: ResizeHandle[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']

// ── Element factories ────────────────────────────────────────────────────────

let elementCounter = 0
function nextElementId(): string {
  return `el-${Date.now()}-${elementCounter++}`
}

function centered(canvas: { width: number; height: number }, w: number, h: number): { x: number; y: number; w: number; h: number } {
  const cw = Math.min(w, canvas.width - 8)
  const ch = Math.min(h, canvas.height - 8)
  return {
    x: Math.round((canvas.width - cw) / 2),
    y: Math.round((canvas.height - ch) / 2),
    w: Math.round(cw),
    h: Math.round(ch),
  }
}

function newBox(canvas: { width: number; height: number }): BoxElement {
  return {
    id: nextElementId(),
    type: 'box',
    ...centered(canvas, 120, 72),
    fill: '#f6f2df',
    stroke: '',
    strokeWidth: 1,
    cornerRadius: 8,
  }
}

function newText(canvas: { width: number; height: number }): TextElement {
  return {
    id: nextElementId(),
    type: 'text',
    ...centered(canvas, Math.min(200, canvas.width - 16), 32),
    content: '{name}',
    fontId: 'bundled:lora',
    size: 18,
    autoFit: true,
    color: '#1b2733',
    align: 'center',
    lineHeight: 1.1,
  }
}

function newBarcode(canvas: { width: number; height: number }): BarcodeElement {
  return {
    id: nextElementId(),
    type: 'barcode',
    ...centered(canvas, 110, 36),
    showText: true,
    color: '#000000',
  }
}

function newImage(canvas: { width: number; height: number }, source: 'productLogo' | 'asset', assetName?: string): ImageElement {
  return {
    id: nextElementId(),
    type: 'image',
    ...centered(canvas, 100, 80),
    source,
    ...(assetName ? { assetName } : {}),
    fit: 'contain',
  }
}

function newDesign(): DesignTemplate {
  const now = new Date().toISOString()
  const canvas = { width: 252, height: 144, background: '#ffffff' }
  return {
    schemaVersion: 1,
    id: `${DESIGN_ID_PREFIX}${Date.now()}`,
    name: 'Untitled Design',
    canvas,
    elements: [newText(canvas)],
    createdAt: now,
    updatedAt: now,
  }
}

// ── Screen ───────────────────────────────────────────────────────────────────

interface Props {
  initialDesignId?: string | null
  onDirtyChange: (dirty: boolean) => void
}

export default function Designer({ initialDesignId, onDirtyChange }: Props): JSX.Element {
  const [designs, setDesigns] = useState<Array<{ id: string; name: string }>>([])
  const [design, setDesign] = useState<DesignTemplate | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [layersOpen, setLayersOpen] = useState(false)
  const [inspectorOpen, setInspectorOpen] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [savedFlash, setSavedFlash] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [guides, setGuides] = useState<{ vx: number | null; vy: number | null }>({ vx: null, vy: null })
  const [fonts, setFonts] = useState<Array<{ id: string; family: string }>>([])
  const [products, setProducts] = useState<Product[]>([])
  const [sampleProductId, setSampleProductId] = useState('')
  const [error, setError] = useState('')
  const [dragLayerId, setDragLayerId] = useState<string | null>(null)
  const [dropIndex, setDropIndex] = useState<number | null>(null)
  const [compactLayout, setCompactLayout] = useState(false)

  const pastRef = useRef<DesignTemplate[]>([])
  const futureRef = useRef<DesignTemplate[]>([])
  const canvasViewportRef = useRef<HTMLDivElement>(null)
  const layersPaneRef = useRef<HTMLDivElement>(null)
  const inspectorPaneRef = useRef<HTMLDivElement>(null)
  const layersTriggerRef = useRef<HTMLButtonElement>(null)
  const inspectorTriggerRef = useRef<HTMLButtonElement>(null)
  const gestureRef = useRef<{
    mode: 'move' | 'resize'
    handle: ResizeHandle | null
    elementId: string
    startClientX: number
    startClientY: number
    original: DesignElement
    moved: boolean
  } | null>(null)

  const measurer = useTextMeasurer()

  useEffect(() => {
    onDirtyChange(dirty)
    return () => onDirtyChange(false)
  }, [dirty, onDirtyChange])

  useEffect(() => {
    const query = window.matchMedia('(max-width: 760px)')
    const update = (): void => {
      setCompactLayout(query.matches)
      if (!query.matches) {
        setLayersOpen(false)
        setInspectorOpen(false)
      }
    }
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!compactLayout || (!layersOpen && !inspectorOpen)) return
    const pane = layersOpen ? layersPaneRef.current : inspectorPaneRef.current
    const trigger = layersOpen ? layersTriggerRef.current : inspectorTriggerRef.current
    const background = [
      document.querySelector<HTMLElement>('.designer-toolbar'),
      document.querySelector<HTMLElement>('.designer-onboarding'),
      canvasViewportRef.current,
    ].filter(Boolean) as HTMLElement[]
    background.forEach((element) => element.setAttribute('inert', ''))
    pane?.querySelector<HTMLElement>('button, input, select, [tabindex]:not([tabindex="-1"])')?.focus()

    function closePane(): void {
      setLayersOpen(false)
      setInspectorOpen(false)
    }
    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        event.preventDefault()
        closePane()
        return
      }
      if (event.key !== 'Tab') return
      const focusable = pane?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), summary, [tabindex]:not([tabindex="-1"])')
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
      window.requestAnimationFrame(() => trigger?.focus())
    }
  }, [compactLayout, layersOpen, inspectorOpen])

  useEffect(() => {
    const pairs: Array<[HTMLElement | null, boolean]> = [
      [layersPaneRef.current, layersOpen],
      [inspectorPaneRef.current, inspectorOpen],
    ]
    for (const [pane, open] of pairs) {
      if (!pane) continue
      if (compactLayout && !open) pane.setAttribute('inert', '')
      else pane.removeAttribute('inert')
    }
  }, [compactLayout, layersOpen, inspectorOpen, design?.id])

  const confirmDiscard = useCallback((): boolean => (
    !dirty || window.confirm('Discard your unsaved design changes? This cannot be undone.')
  ), [dirty])

  const sampleProduct = useMemo<Partial<Product>>(() => {
    const chosen = products.find((product) => product.id === sampleProductId)
    return chosen ?? SAMPLE_PRODUCT
  }, [products, sampleProductId])

  const images = useDesignImages(design, undefined, sampleProduct.designImageOverrides)
  const hasBarcode = useMemo(() => design?.elements.some((element) => element.type === 'barcode') ?? false, [design])
  const barcodeReady = useBarcodeRenderer(hasBarcode)

  const fitCanvas = useCallback((): void => {
    if (!design || !canvasViewportRef.current) return
    const { clientWidth, clientHeight } = canvasViewportRef.current
    const fitted = Math.min((clientWidth - 80) / design.canvas.width, (clientHeight - 80) / design.canvas.height)
    setZoom(Math.max(0.5, Math.min(4, round2(fitted))))
  }, [design?.id, design?.canvas.width, design?.canvas.height])

  useEffect(() => {
    const frame = requestAnimationFrame(fitCanvas)
    return () => cancelAnimationFrame(frame)
  }, [fitCanvas])

  // ── Loading ────────────────────────────────────────────────────────────────

  const refreshDesignList = useCallback(async (): Promise<Array<{ id: string; name: string }>> => {
    const result = await window.api.design.list()
    const list = result.ok ? result.data.map(({ id, name }) => ({ id, name })) : []
    setDesigns(list)
    return list
  }, [])

  const openDesign = useCallback((doc: DesignTemplate): void => {
    pastRef.current = []
    futureRef.current = []
    setDesign(doc)
    setSelectedId(null)
    setDirty(false)
    setError('')
  }, [])

  const loadDesign = useCallback(
    async (id: string): Promise<void> => {
      if (!confirmDiscard()) return
      const result = await window.api.design.get(id)
      if (result.ok) openDesign(result.data)
      else setError(result.error)
    },
    [confirmDiscard, openDesign],
  )

  useEffect(() => {
    window.api.font.list().then((result) => {
      if (result.ok) setFonts(result.data.map(({ id, family }) => ({ id, family })))
    })
    window.api.product.list().then((result) => {
      if (result.ok) setProducts(result.data)
    })
  }, [])

  useEffect(() => {
    let alive = true
    refreshDesignList().then((list) => {
      if (!alive) return
      const target = initialDesignId && list.some((d) => d.id === initialDesignId)
        ? initialDesignId
        : list[0]?.id
      if (target) loadDesign(target)
      else openDesign(newDesign())
    })
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialDesignId])

  // ── History / mutation ─────────────────────────────────────────────────────

  const recordSnapshot = useCallback((snapshot: DesignTemplate): void => {
    pastRef.current.push(snapshot)
    if (pastRef.current.length > HISTORY_LIMIT) pastRef.current.shift()
    futureRef.current = []
  }, [])

  const commit = useCallback(
    (mutate: (d: DesignTemplate) => DesignTemplate): void => {
      setDesign((prev) => {
        if (!prev) return prev
        recordSnapshot(prev)
        setDirty(true)
        return mutate(prev)
      })
    },
    [recordSnapshot],
  )

  /** Mutation without a history entry (used mid-gesture). */
  const patchElement = useCallback((id: string, patch: Partial<DesignElement>): void => {
    setDesign((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        elements: prev.elements.map((el) => (el.id === id ? ({ ...el, ...patch } as DesignElement) : el)),
      }
    })
    setDirty(true)
  }, [])

  const commitElement = useCallback(
    (id: string, patch: Partial<DesignElement>): void => {
      commit((d) => ({
        ...d,
        elements: d.elements.map((el) => (el.id === id ? ({ ...el, ...patch } as DesignElement) : el)),
      }))
    },
    [commit],
  )

  const undo = useCallback((): void => {
    setDesign((prev) => {
      const past = pastRef.current
      if (!prev || !past.length) return prev
      const snapshot = past.pop() as DesignTemplate
      futureRef.current.push(prev)
      setDirty(true)
      return snapshot
    })
  }, [])

  const redo = useCallback((): void => {
    setDesign((prev) => {
      const future = futureRef.current
      if (!prev || !future.length) return prev
      const snapshot = future.pop() as DesignTemplate
      pastRef.current.push(prev)
      setDirty(true)
      return snapshot
    })
  }, [])

  const selected = design?.elements.find((el) => el.id === selectedId) ?? null

  const addElement = useCallback(
    (element: DesignElement): void => {
      commit((d) => ({ ...d, elements: [...d.elements, element] }))
      setSelectedId(element.id)
    },
    [commit],
  )

  const deleteElement = useCallback(
    (id: string): void => {
      commit((d) => ({ ...d, elements: d.elements.filter((el) => el.id !== id) }))
      setSelectedId((current) => (current === id ? null : current))
    },
    [commit],
  )

  const duplicateElement = useCallback(
    (id: string): void => {
      setDesign((prev) => {
        if (!prev) return prev
        const source = prev.elements.find((el) => el.id === id)
        if (!source) return prev
        recordSnapshot(prev)
        setDirty(true)
        const copy = { ...source, id: nextElementId(), x: source.x + 8, y: source.y + 8 }
        setSelectedId(copy.id)
        return { ...prev, elements: [...prev.elements, copy] }
      })
    },
    [recordSnapshot],
  )

  const moveLayer = useCallback(
    (id: string, direction: 1 | -1): void => {
      commit((d) => {
        const index = d.elements.findIndex((el) => el.id === id)
        const target = index + direction
        if (index < 0 || target < 0 || target >= d.elements.length) return d
        const elements = [...d.elements]
        const [element] = elements.splice(index, 1)
        elements.splice(target, 0, element)
        return { ...d, elements }
      })
    },
    [commit],
  )

  /** Move a layer to a new position in the layers panel (display order = topmost first). */
  const reorderLayer = useCallback(
    (id: string, displayInsertIndex: number): void => {
      setDesign((prev) => {
        if (!prev) return prev
        const displayed = [...prev.elements].reverse()
        const from = displayed.findIndex((el) => el.id === id)
        if (from < 0) return prev
        let to = displayInsertIndex > from ? displayInsertIndex - 1 : displayInsertIndex
        to = Math.max(0, Math.min(displayed.length - 1, to))
        if (to === from) return prev
        recordSnapshot(prev)
        setDirty(true)
        const [element] = displayed.splice(from, 1)
        displayed.splice(to, 0, element)
        return { ...prev, elements: displayed.reverse() }
      })
    },
    [recordSnapshot],
  )

  // ── Save / manage designs ──────────────────────────────────────────────────

  const saveDesign = useCallback(async (): Promise<void> => {
    if (!design) return
    const result = await window.api.design.save(design)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setDesign(result.data)
    setDirty(false)
    setError('')
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 1400)
    refreshDesignList()
  }, [design, refreshDesignList])

  const exportDesign = useCallback(async (): Promise<void> => {
    if (!design) return
    const result = await window.api.design.exportFile(design)
    if (!result.ok) setError(result.error)
    else setError('')
  }, [design])

  const importDesign = useCallback(async (): Promise<void> => {
    if (!confirmDiscard()) return
    const result = await window.api.design.importFile()
    if (!result.ok) {
      setError(result.error)
      return
    }
    if (!result.data) return
    await refreshDesignList()
    openDesign(result.data)
  }, [confirmDiscard, refreshDesignList, openDesign])

  const deleteDesign = useCallback(async (): Promise<void> => {
    if (!design) return
    if (!window.confirm(`Delete the design "${design.name}"? Products using it will fall back to the default template.`)) return
    await window.api.design.delete(design.id)
    const list = await refreshDesignList()
    if (list.length) loadDesign(list[0].id)
    else openDesign(newDesign())
  }, [design, refreshDesignList, loadDesign, openDesign])

  // ── Canvas gestures ────────────────────────────────────────────────────────

  const snapTargets = useMemo(() => {
    if (!design) return { xs: [] as number[], ys: [] as number[] }
    const xs = [0, design.canvas.width / 2, design.canvas.width]
    const ys = [0, design.canvas.height / 2, design.canvas.height]
    for (const el of design.elements) {
      if (el.id === selectedId) continue
      xs.push(el.x, el.x + el.w / 2, el.x + el.w)
      ys.push(el.y, el.y + el.h / 2, el.y + el.h)
    }
    return { xs, ys }
  }, [design, selectedId])

  const beginGesture = useCallback(
    (event: React.PointerEvent, element: DesignElement, mode: 'move' | 'resize', handle: ResizeHandle | null): void => {
      event.preventDefault()
      event.stopPropagation()
      setSelectedId(element.id)
      if (element.locked) return
      gestureRef.current = {
        mode,
        handle,
        elementId: element.id,
        startClientX: event.clientX,
        startClientY: event.clientY,
        original: element,
        moved: false,
      }
    },
    [],
  )

  useEffect(() => {
    const onMove = (event: PointerEvent): void => {
      const gesture = gestureRef.current
      if (!gesture || !design) return
      const dx = (event.clientX - gesture.startClientX) / zoom
      const dy = (event.clientY - gesture.startClientY) / zoom
      if (!gesture.moved && Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return
      if (!gesture.moved) {
        recordSnapshot(design)
        gesture.moved = true
      }
      const original = gesture.original

      if (gesture.mode === 'move') {
        let x = original.x + dx
        let y = original.y + dy
        let vx: number | null = null
        let vy: number | null = null
        let bestX = SNAP_THRESHOLD
        for (const target of snapTargets.xs) {
          for (const offset of [0, original.w / 2, original.w]) {
            const delta = Math.abs(x + offset - target)
            if (delta < bestX) {
              bestX = delta
              x = target - offset
              vx = target
            }
          }
        }
        let bestY = SNAP_THRESHOLD
        for (const target of snapTargets.ys) {
          for (const offset of [0, original.h / 2, original.h]) {
            const delta = Math.abs(y + offset - target)
            if (delta < bestY) {
              bestY = delta
              y = target - offset
              vy = target
            }
          }
        }
        setGuides({ vx, vy })
        patchElement(gesture.elementId, { x: round2(x), y: round2(y) })
      } else {
        const handle = gesture.handle as ResizeHandle
        let { x, y, w, h } = original
        if (handle.includes('e')) w = original.w + dx
        if (handle.includes('s')) h = original.h + dy
        if (handle.includes('w')) {
          w = original.w - dx
          x = original.x + dx
        }
        if (handle.includes('n')) {
          h = original.h - dy
          y = original.y + dy
        }
        if (w < MIN_ELEMENT_SIZE) {
          if (handle.includes('w')) x -= MIN_ELEMENT_SIZE - w
          w = MIN_ELEMENT_SIZE
        }
        if (h < MIN_ELEMENT_SIZE) {
          if (handle.includes('n')) y -= MIN_ELEMENT_SIZE - h
          h = MIN_ELEMENT_SIZE
        }
        patchElement(gesture.elementId, { x: round2(x), y: round2(y), w: round2(w), h: round2(h) })
      }
    }
    const onUp = (): void => {
      gestureRef.current = null
      setGuides({ vx: null, vy: null })
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [design, zoom, snapTargets, patchElement, recordSnapshot])

  // ── Keyboard shortcuts ─────────────────────────────────────────────────────

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      const target = event.target as HTMLElement | null
      const inField =
        !!target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable)
      const meta = event.metaKey || event.ctrlKey

      if (meta && event.key.toLowerCase() === 'z') {
        event.preventDefault()
        if (event.shiftKey) redo()
        else undo()
        return
      }
      if (meta && event.key.toLowerCase() === 's') {
        event.preventDefault()
        saveDesign()
        return
      }
      if (inField) return
      if (meta && event.key.toLowerCase() === 'd' && selectedId) {
        event.preventDefault()
        duplicateElement(selectedId)
        return
      }
      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedId) {
        event.preventDefault()
        deleteElement(selectedId)
        return
      }
      if (selectedId && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault()
        const step = event.shiftKey ? 10 : 1
        const dx = event.key === 'ArrowLeft' ? -step : event.key === 'ArrowRight' ? step : 0
        const dy = event.key === 'ArrowUp' ? -step : event.key === 'ArrowDown' ? step : 0
        const element = design?.elements.find((el) => el.id === selectedId)
        if (element && !element.locked) commitElement(selectedId, { x: element.x + dx, y: element.y + dy })
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [design, selectedId, undo, redo, saveDesign, duplicateElement, deleteElement, commitElement])

  // ── Painted canvas ─────────────────────────────────────────────────────────

  const svg = useMemo(() => {
    if (!design || !measurer || !barcodeReady) return ''
    return paintDesignSVG(design, sampleProduct, measurer, images)
  }, [design, sampleProduct, measurer, images, barcodeReady])

  if (!design) {
    return <div style={{ padding: 40, color: 'var(--color-text-muted)' }}>Loading designer…</div>
  }

  const canvasW = design.canvas.width * zoom
  const canvasH = design.canvas.height * zoom

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <h1 className="sr-only">Reusable Label Template Designer</h1>
      {/* ── Top bar ── */}
      <div
        className="workspace-toolbar designer-toolbar"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '14px 20px',
          borderBottom: '1px solid var(--color-border-soft)',
          background: 'var(--color-surface)',
          flexWrap: 'wrap',
        }}
      >
        <select
          id="designer-design-selector"
          aria-label="Open a saved label design"
          className="input"
          style={{ width: 210 }}
          value={designs.some((d) => d.id === design.id) ? design.id : '__new__'}
          onChange={(e) => {
            if (e.target.value === '__new__') {
              if (confirmDiscard()) openDesign(newDesign())
            }
            else loadDesign(e.target.value)
          }}
        >
          {!designs.some((d) => d.id === design.id) && <option value="__new__">Unsaved design</option>}
          {designs.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <button className="btn-outline btn-sm" onClick={() => { if (confirmDiscard()) openDesign(newDesign()) }}>
          <Plus size={12} /> New
        </button>
        <input
          className="input"
          aria-label="Design name"
          style={{ width: 200 }}
          value={design.name}
          onChange={(e) => commit((d) => ({ ...d, name: e.target.value }))}
          placeholder="Design name"
        />

        <div className="designer-control-cluster" aria-label="Design history">
          <button aria-label="Undo design change" title="Undo (⌘Z)" className="btn-icon" onClick={undo} disabled={pastRef.current.length === 0}><Undo2 size={13} /></button>
          <button aria-label="Redo design change" title="Redo (⇧⌘Z)" className="btn-icon" onClick={redo} disabled={futureRef.current.length === 0}><Redo2 size={13} /></button>
        </div>

        <div style={{ width: 1, alignSelf: 'stretch', background: 'var(--color-border-soft)' }} />

        <details className="row-actions-menu">
          <summary className="btn-outline btn-sm"><Plus size={12} /> Add</summary>
          <div className="row-actions-popover" style={{ insetInlineStart: 0, insetInlineEnd: 'auto' }}>
            <button onClick={() => addElement(newBox(design.canvas))}><Square size={13} /> Box</button>
            <button onClick={() => addElement(newText(design.canvas))}><Type size={13} /> Text</button>
            <button onClick={() => addElement(newBarcode(design.canvas))}><Barcode size={13} /> Barcode</button>
            <button onClick={() => addElement(newImage(design.canvas, 'productLogo'))}><ImageIcon size={13} /> Product logo</button>
            <button onClick={async () => {
              const result = await window.api.design.importImage()
              if (result.ok && result.data) addElement(newImage(design.canvas, 'asset', result.data.assetName))
              else if (!result.ok) setError(result.error)
            }}><ImageIcon size={13} /> Uploaded image</button>
          </div>
        </details>

        <button
          ref={layersTriggerRef}
          type="button"
          className="btn-outline btn-sm compact-only"
          aria-expanded={layersOpen}
          aria-controls="designer-layers"
          onClick={() => { setLayersOpen((open) => !open); setInspectorOpen(false) }}
        >
          Layers
        </button>
        <button
          ref={inspectorTriggerRef}
          type="button"
          className="btn-outline btn-sm compact-only"
          aria-expanded={inspectorOpen}
          aria-controls="designer-inspector"
          onClick={() => { setInspectorOpen((open) => !open); setLayersOpen(false) }}
        >
          Inspector
        </button>
        <div style={{ flex: 1 }} />

        <div className="designer-control-cluster" aria-label="Canvas zoom">
          <button aria-label="Zoom out" className="btn-icon" onClick={() => setZoom((z) => Math.max(0.5, round2(z - 0.5)))}><ZoomOut size={13} /></button>
          <span style={{ fontSize: 11, color: 'var(--color-text-secondary)', minWidth: 36, textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
          <button aria-label="Zoom in" className="btn-icon" onClick={() => setZoom((z) => Math.min(6, round2(z + 0.5)))}><ZoomIn size={13} /></button>
          <button className="btn-ghost btn-sm" onClick={fitCanvas}>Fit</button>
        </div>

        <details className="row-actions-menu">
          <summary className="btn btn-icon" aria-label="More design actions" title="More design actions"><MoreHorizontal size={14} /></summary>
          <div className="row-actions-popover">
            <button title="Import a design exported from Tillie Print" onClick={importDesign}><Upload size={13} /> Import design</button>
            <button title="Export this design to share with another Tillie Print installation" onClick={exportDesign}><Download size={13} /> Export design</button>
            <button className="danger" onClick={deleteDesign}><Trash2 size={13} /> Delete design</button>
          </div>
        </details>
        <button className="btn-primary btn-sm" onClick={saveDesign}>
          <Save size={12} /> {savedFlash ? 'Saved' : 'Save Template'}
        </button>
      </div>

      {dirty && !savedFlash && <div role="status" className="status-message" style={{ padding: '6px 20px', background: 'var(--color-warning-surface)', color: 'var(--color-warning)', fontSize: 12 }}>Unsaved template changes</div>}

      {error && (
        <div role="alert" className="status-message" style={{ padding: '8px 20px', background: 'var(--color-danger-surface)', color: 'var(--color-danger-text)', fontSize: 12 }}>{error}</div>
      )}

      {(design.elements.length <= 2 || dirty) && (
        <div className="designer-onboarding" role="region" aria-label="Reusable template progress">
          <strong>Template progress</strong>
          <span><CheckCircle2 size={12} /> Size ready</span>
          <span className={design.elements.length > 1 ? 'is-complete' : ''}><CheckCircle2 size={12} /> {design.elements.length > 1 ? 'Content added' : 'Add content'}</span>
          <span className={sampleProductId ? 'is-complete' : ''}><CheckCircle2 size={12} /> {sampleProductId ? 'Preview selected' : 'Choose preview product'}</span>
          <span className={!dirty ? 'is-complete' : ''}><CheckCircle2 size={12} /> {!dirty ? 'Saved' : 'Save template'}</span>
        </div>
      )}

      {/* ── Body ── */}
      <div className="designer-workspace" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {compactLayout && (layersOpen || inspectorOpen) && <button type="button" className="designer-pane-scrim" aria-label="Close Designer panel" onClick={() => { setLayersOpen(false); setInspectorOpen(false) }} />}
        {/* Layers */}
        <div ref={layersPaneRef} id="designer-layers" className={`designer-layers-pane${layersOpen ? ' is-open' : ''}`} aria-hidden={compactLayout && !layersOpen} style={{ width: 190, borderRight: '1px solid var(--color-border-soft)', background: 'var(--color-surface)', overflowY: 'auto', padding: 10 }}>
          <div className="designer-pane-heading"><p className="section-label">Layers</p><button type="button" className="btn-icon compact-only" aria-label="Close Layers" onClick={() => setLayersOpen(false)}><X size={14} /></button></div>
          <div
            role="listbox"
            aria-label="Design layers"
            onDragOver={(e) => {
              if (dragLayerId) {
                e.preventDefault()
                e.dataTransfer.dropEffect = 'move'
              }
            }}
            onDrop={(e) => {
              e.preventDefault()
              if (dragLayerId && dropIndex !== null) reorderLayer(dragLayerId, dropIndex)
              setDragLayerId(null)
              setDropIndex(null)
            }}
          >
            {[...design.elements].reverse().map((element, index, displayed) => (
              <div
                key={element.id}
                role="option"
                aria-selected={element.id === selectedId}
                aria-label={`${layerName(element)} layer${element.locked ? ', locked' : ''}`}
                tabIndex={0}
                draggable
                onClick={() => { setSelectedId(element.id); setInspectorOpen(true); if (compactLayout) setLayersOpen(false) }}
                onKeyDown={(event) => {
                  if ((event.metaKey || event.ctrlKey) && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
                    event.preventDefault()
                    moveLayer(element.id, event.key === 'ArrowUp' ? 1 : -1)
                    return
                  }
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setSelectedId(element.id)
                    setInspectorOpen(true)
                    if (compactLayout) setLayersOpen(false)
                  }
                }}
                onDragStart={(e) => {
                  e.dataTransfer.effectAllowed = 'move'
                  setDragLayerId(element.id)
                  setSelectedId(element.id)
                }}
                onDragOver={(e) => {
                  if (!dragLayerId) return
                  e.preventDefault()
                  const rect = e.currentTarget.getBoundingClientRect()
                  const below = e.clientY > rect.top + rect.height / 2
                  setDropIndex(below ? index + 1 : index)
                }}
                onDragEnd={() => {
                  setDragLayerId(null)
                  setDropIndex(null)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 8px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: 12,
                  background: element.id === selectedId ? '#eef2ff' : 'transparent',
                  color: 'var(--color-text-strong-secondary)',
                  opacity: dragLayerId === element.id ? 0.4 : 1,
                  boxShadow:
                    dropIndex === index
                      ? 'inset 0 2px 0 #4f46e5'
                      : dropIndex === index + 1 && index === displayed.length - 1
                        ? 'inset 0 -2px 0 #4f46e5'
                        : 'none',
                }}
              >
                <span style={{ color: 'var(--color-border-strong)', display: 'inline-flex', cursor: 'grab' }}>
                  <GripVertical size={11} />
                </span>
                <span style={{ color: 'var(--color-text-muted)', display: 'inline-flex' }}>{layerIcon(element)}</span>
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {layerName(element)}
                </span>
                <button
                  aria-label={element.locked ? `Unlock ${layerName(element)} layer` : `Lock ${layerName(element)} layer`}
                  title={element.locked ? 'Unlock' : 'Lock'}
                  onClick={(e) => {
                    e.stopPropagation()
                    commitElement(element.id, { locked: !element.locked })
                  }}
                  style={iconButtonStyle}
                >
                  {element.locked ? <Lock size={11} /> : <LockOpen size={11} />}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div
          ref={canvasViewportRef}
          style={{ flex: 1, overflow: 'auto', background: '#eceff3', display: 'flex', padding: 40 }}
          onPointerDown={() => { setSelectedId(null); if (compactLayout) { setLayersOpen(false); setInspectorOpen(false) } }}
        >
          <div style={{ margin: 'auto', position: 'relative', width: canvasW, height: canvasH, flexShrink: 0 }}>
            <div
              className="design-label-svg"
              style={{ position: 'absolute', inset: 0, boxShadow: '0 4px 24px rgba(0,0,0,0.18)', background: design.canvas.background }}
              dangerouslySetInnerHTML={{ __html: svg }}
            />

            {/* element hit targets / selection */}
            {design.elements.map((element) => {
              const isSelected = element.id === selectedId
              return (
                <div
                  key={element.id}
                  role="button"
                  aria-label={`${layerName(element)} canvas element${element.locked ? ', locked' : ''}. Use arrow keys to move.`}
                  aria-pressed={isSelected}
                  tabIndex={0}
                  onPointerDown={(e) => beginGesture(e, element, 'move', null)}
                  onFocus={() => { setSelectedId(element.id); if (!compactLayout) setInspectorOpen(true) }}
                  style={{
                    position: 'absolute',
                    left: element.x * zoom,
                    top: element.y * zoom,
                    width: element.w * zoom,
                    height: element.h * zoom,
                    cursor: element.locked ? 'default' : 'move',
                    outline: isSelected
                      ? '1.5px solid #4f46e5'
                      : '1px dashed rgba(100,116,139,0.0)',
                    outlineOffset: 0,
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) (e.currentTarget as HTMLDivElement).style.outline = '1px dashed rgba(100,116,139,0.55)'
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) (e.currentTarget as HTMLDivElement).style.outline = '1px dashed rgba(100,116,139,0)'
                  }}
                >
                  {isSelected &&
                    !element.locked &&
                    RESIZE_HANDLES.map((handle) => (
                      <div
                        key={handle}
                        role="button"
                        tabIndex={handle === 'se' ? 0 : -1}
                        aria-label={`Resize ${layerName(element)} from ${handle}. Use arrow keys.`}
                        onPointerDown={(e) => beginGesture(e, element, 'resize', handle)}
                        onKeyDown={(event) => {
                          const step = event.shiftKey ? 10 : 1
                          if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return
                          event.preventDefault()
                          if (event.key === 'ArrowLeft') commitElement(element.id, { w: Math.max(MIN_ELEMENT_SIZE, element.w - step) })
                          if (event.key === 'ArrowRight') commitElement(element.id, { w: element.w + step })
                          if (event.key === 'ArrowUp') commitElement(element.id, { h: Math.max(MIN_ELEMENT_SIZE, element.h - step) })
                          if (event.key === 'ArrowDown') commitElement(element.id, { h: element.h + step })
                        }}
                        style={handleStyle(handle)}
                      />
                    ))}
                </div>
              )
            })}

            {/* snap guides */}
            {guides.vx !== null && (
              <div style={{ position: 'absolute', left: guides.vx * zoom, top: 0, bottom: 0, width: 1, background: 'var(--color-snap-guide)', pointerEvents: 'none' }} />
            )}
            {guides.vy !== null && (
              <div style={{ position: 'absolute', top: guides.vy * zoom, left: 0, right: 0, height: 1, background: 'var(--color-snap-guide)', pointerEvents: 'none' }} />
            )}
          </div>
        </div>

        {/* Inspector */}
        <div ref={inspectorPaneRef} id="designer-inspector" className={`designer-inspector-pane${inspectorOpen ? ' is-open' : ''}`} aria-hidden={compactLayout && !inspectorOpen} style={{ width: 300, borderLeft: '1px solid var(--color-border-soft)', background: 'var(--color-surface)', overflowY: 'auto', padding: 16 }}>
          <div className="designer-pane-heading compact-only"><p className="section-label">Inspector</p><button type="button" className="btn-icon" aria-label="Close Inspector" onClick={() => setInspectorOpen(false)}><X size={14} /></button></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Canvas settings */}
            <div className="card" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label className="label-text" htmlFor="designer-canvas-preset" style={{ marginBottom: 0 }}>Canvas</label>
              <select
                id="designer-canvas-preset"
                className="input"
                value={CANVAS_PRESETS.findIndex((p) => p.w === design.canvas.width && p.h === design.canvas.height)}
                onChange={(e) => {
                  const preset = CANVAS_PRESETS[Number(e.target.value)]
                  if (preset) commit((d) => ({ ...d, canvas: { ...d.canvas, width: preset.w, height: preset.h } }))
                }}
              >
                <option value={-1}>Custom size…</option>
                {CANVAS_PRESETS.map((preset, index) => (
                  <option key={preset.label} value={index}>
                    {preset.label}
                  </option>
                ))}
              </select>
              <div style={{ display: 'flex', gap: 8 }}>
                <NumberField
                  label="Width (in)"
                  value={round3(design.canvas.width / PT_PER_IN)}
                  step={0.05}
                  min={0.5}
                  onChange={(value) => commit((d) => ({ ...d, canvas: { ...d.canvas, width: Math.round(value * PT_PER_IN) } }))}
                />
                <NumberField
                  label="Height (in)"
                  value={round3(design.canvas.height / PT_PER_IN)}
                  step={0.05}
                  min={0.5}
                  onChange={(value) => commit((d) => ({ ...d, canvas: { ...d.canvas, height: Math.round(value * PT_PER_IN) } }))}
                />
              </div>
              <ColorField
                label="Background"
                value={design.canvas.background}
                onChange={(value) => commit((d) => ({ ...d, canvas: { ...d.canvas, background: value } }))}
              />
            </div>

            {/* Sample data */}
            <div className="card" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label className="label-text" htmlFor="designer-preview-product" style={{ marginBottom: 0 }}>Preview with</label>
              <select id="designer-preview-product" className="input" value={sampleProductId} onChange={(e) => setSampleProductId(e.target.value)}>
                <option value="">Sample data</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name || '(unnamed product)'}
                  </option>
                ))}
              </select>
            </div>

            {/* Element inspector */}
            {selected ? (
              <ElementInspector
                key={selected.id}
                element={selected}
                fonts={fonts}
                onChange={(patch) => commitElement(selected.id, patch)}
                onDelete={() => deleteElement(selected.id)}
                onDuplicate={() => duplicateElement(selected.id)}
                onLayer={(direction) => moveLayer(selected.id, direction)}
              />
            ) : (
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.6 }}>
                Select an element on the canvas to edit it.
                <br />
                Drag to move · handles to resize · arrows to nudge (⇧ = 10) · ⌘D duplicate · ⌘Z undo · Delete removes.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Element inspector ────────────────────────────────────────────────────────

function ElementInspector({
  element,
  fonts,
  onChange,
  onDelete,
  onDuplicate,
  onLayer,
}: {
  element: DesignElement
  fonts: Array<{ id: string; family: string }>
  onChange: (patch: Partial<DesignElement>) => void
  onDelete: () => void
  onDuplicate: () => void
  onLayer: (direction: 1 | -1) => void
}): JSX.Element {
  return (
    <div className="card" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div className="section-label" style={{ marginBottom: 0, flex: 1 }}>
          {typeLabel(element)}
        </div>
        <button className="btn-outline btn-sm" title="Bring forward" onClick={() => onLayer(1)}>
          <ArrowUp size={12} />
        </button>
        <button className="btn-outline btn-sm" title="Send backward" onClick={() => onLayer(-1)}>
          <ArrowDown size={12} />
        </button>
        <button className="btn-outline btn-sm" title="Duplicate (⌘D)" onClick={onDuplicate}>
          <Copy size={12} />
        </button>
        <button className="btn-outline btn-sm" title="Delete" onClick={onDelete}>
          <Trash2 size={12} />
        </button>
      </div>

      {/* Geometry */}
      <details className="editor-disclosure">
        <summary>Advanced geometry</summary>
        <div className="editor-disclosure-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <NumberField label="X (pt)" value={round2(element.x)} onChange={(x) => onChange({ x })} />
        <NumberField label="Y (pt)" value={round2(element.y)} onChange={(y) => onChange({ y })} />
        <NumberField label="W (pt)" value={round2(element.w)} min={MIN_ELEMENT_SIZE} onChange={(w) => onChange({ w })} />
        <NumberField label="H (pt)" value={round2(element.h)} min={MIN_ELEMENT_SIZE} onChange={(h) => onChange({ h })} />
        </div>
      </details>

      {element.type === 'box' && (
        <>
          <ColorField label="Fill" value={element.fill} allowNone onChange={(fill) => onChange({ fill })} />
          <ColorField label="Stroke" value={element.stroke} allowNone onChange={(stroke) => onChange({ stroke })} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <NumberField label="Stroke width" value={element.strokeWidth} min={0} step={0.5} onChange={(strokeWidth) => onChange({ strokeWidth })} />
            <NumberField label="Corner radius" value={element.cornerRadius} min={0} onChange={(cornerRadius) => onChange({ cornerRadius })} />
          </div>
        </>
      )}

      {element.type === 'text' && (
        <>
          <div>
            <label className="label-text" htmlFor={`element-text-${element.id}`}>Text</label>
            <textarea
              id={`element-text-${element.id}`}
              className="input"
              rows={3}
              value={element.content}
              onChange={(e) => onChange({ content: e.target.value })}
              style={{ resize: 'vertical', fontFamily: 'inherit' }}
            />
            <select
              aria-label="Insert product field"
              className="input"
              style={{ marginTop: 6 }}
              value=""
              onChange={(e) => {
                if (e.target.value) onChange({ content: `${element.content}{${e.target.value}}` })
              }}
            >
              <option value="">Insert product field…</option>
              {BINDABLE_FIELDS.map(({ field, label }) => (
                <option key={field} value={field}>
                  {label} — {'{'}{field}{'}'}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-text" htmlFor={`element-font-${element.id}`}>Font</label>
            <select id={`element-font-${element.id}`} className="input" value={element.fontId} onChange={(e) => onChange({ fontId: e.target.value })}>
              {fonts.map((font) => (
                <option key={font.id} value={font.id}>
                  {font.family}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <NumberField label={element.autoFit ? 'Max size (pt)' : 'Size (pt)'} value={element.size} min={4} onChange={(size) => onChange({ size })} />
            <NumberField label="Line height" value={element.lineHeight} min={0.5} max={3} step={0.05} onChange={(lineHeight) => onChange({ lineHeight })} />
          </div>
          <CheckboxField
            label="Auto-fit text to the box"
            checked={element.autoFit}
            onChange={(autoFit) => onChange({ autoFit })}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div>
              <label className="label-text" htmlFor={`element-align-${element.id}`}>Align</label>
              <select id={`element-align-${element.id}`} className="input" value={element.align} onChange={(e) => onChange({ align: e.target.value as TextElement['align'] })}>
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
            <NumberField
              label="Max lines (0 = auto)"
              value={element.maxLines ?? 0}
              min={0}
              onChange={(value) => onChange({ maxLines: value > 0 ? Math.floor(value) : undefined })}
            />
          </div>
          <div>
            <label className="label-text" htmlFor={`element-case-${element.id}`}>Letter case</label>
            <select
              id={`element-case-${element.id}`}
              className="input"
              value={element.textCase ?? 'none'}
              onChange={(e) => {
                const value = e.target.value as TextCase
                onChange({ textCase: value === 'none' ? undefined : value })
              }}
            >
              {TEXT_CASE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <ColorField label="Color" value={element.color} onChange={(color) => onChange({ color })} />
        </>
      )}

      {element.type === 'barcode' && (
        <>
          <CheckboxField label="Show number under bars" checked={element.showText} onChange={(showText) => onChange({ showText })} />
          <ColorField label="Color" value={element.color} onChange={(color) => onChange({ color })} />
          <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0 }}>
            The barcode always uses the product’s barcode number (CODE128).
          </p>
        </>
      )}

      {element.type === 'image' && (
        <>
          <div>
            <label className="label-text" htmlFor={`element-source-${element.id}`}>Source</label>
            <select
              id={`element-source-${element.id}`}
              className="input"
              value={element.source}
              onChange={async (e) => {
                const source = e.target.value as ImageElement['source']
                if (source === 'asset' && !element.assetName) {
                  const result = await window.api.design.importImage()
                  if (result.ok && result.data) onChange({ source, assetName: result.data.assetName })
                } else {
                  onChange({ source })
                }
              }}
            >
              <option value="productLogo">Product logo</option>
              <option value="asset">Uploaded image</option>
            </select>
          </div>
          {element.source === 'asset' && (
            <button
              className="btn-outline btn-sm"
              onClick={async () => {
                const result = await window.api.design.importImage()
                if (result.ok && result.data) onChange({ assetName: result.data.assetName })
              }}
            >
              <ImageIcon size={12} /> {element.assetName ? 'Replace image…' : 'Choose image…'}
            </button>
          )}
          <div>
            <label className="label-text" htmlFor={`element-fit-${element.id}`}>Fit</label>
            <select id={`element-fit-${element.id}`} className="input" value={element.fit} onChange={(e) => onChange({ fit: e.target.value as ImageElement['fit'] })}>
              <option value="contain">Contain (letterbox)</option>
              <option value="cover">Cover (crop)</option>
              <option value="stretch">Stretch</option>
            </select>
          </div>
          <div>
            <label className="label-text" htmlFor={`element-slot-${element.id}`}>Slot name (shown in product editor)</label>
            <input
              id={`element-slot-${element.id}`}
              className="input"
              value={element.label ?? ''}
              placeholder="e.g. Product photo"
              onChange={(e) => onChange({ label: e.target.value || undefined })}
            />
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
              Each product can replace this image from the label editor; this design’s image is the default.
            </p>
          </div>
        </>
      )}

      {/* Common advanced controls */}
      <details className="editor-disclosure">
        <summary>Advanced visibility and locking</summary>
        <div className="editor-disclosure-body">
      <div>
        <label className="label-text" htmlFor={`element-visibility-${element.id}`}>Visibility</label>
        <select
          id={`element-visibility-${element.id}`}
          className="input"
          value={element.visibleIf ?? 'always'}
          onChange={(e) => {
            const value = e.target.value as VisibleIf
            onChange({ visibleIf: value === 'always' ? undefined : value })
          }}
        >
          {VISIBLE_IF_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <NumberField
        label="Opacity (%)"
        value={Math.round((element.opacity ?? 1) * 100)}
        min={0}
        max={100}
        onChange={(value) => onChange({ opacity: Math.min(100, Math.max(0, value)) / 100 })}
      />
      <CheckboxField label="Locked" checked={Boolean(element.locked)} onChange={(locked) => onChange({ locked })} />
        </div>
      </details>
    </div>
  )
}

// ── Small form controls ──────────────────────────────────────────────────────

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
}): JSX.Element {
  const id = useId()
  return (
    <div style={{ flex: 1 }}>
      <label className="label-text" htmlFor={id}>{label}</label>
      <input
        id={id}
        className="input"
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => {
          const parsed = Number(e.target.value)
          if (Number.isFinite(parsed)) onChange(min !== undefined ? Math.max(min, parsed) : parsed)
        }}
      />
    </div>
  )
}

function ColorField({
  label,
  value,
  onChange,
  allowNone = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  allowNone?: boolean
}): JSX.Element {
  const colorId = useId()
  const textId = useId()
  return (
    <div>
      <label className="label-text" htmlFor={textId}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          id={colorId}
          type="color"
          value={/^#[0-9a-f]{6}$/i.test(value) ? value : '#ffffff'}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          style={{ width: 38, height: 32, padding: 2, border: '1px solid var(--color-border)', borderRadius: 6, background: 'var(--color-surface)', cursor: 'pointer' }}
        />
        <input
          id={textId}
          className="input"
          value={value}
          placeholder={allowNone ? 'None' : '#000000'}
          maxLength={7}
          onChange={(e) => onChange(e.target.value)}
        />
        {allowNone && value && (
          <button type="button" className="btn-outline btn-sm" onClick={() => onChange('')}>
            None
          </button>
        )}
      </div>
    </div>
  )
}

function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}): JSX.Element {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--color-text-strong-secondary)', cursor: 'pointer' }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  )
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const iconButtonStyle: React.CSSProperties = {
  border: 'none',
  background: 'transparent',
  padding: 2,
  cursor: 'pointer',
  color: 'var(--color-text-muted)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 28,
}

function layerIcon(element: DesignElement): JSX.Element {
  switch (element.type) {
    case 'box':
      return <Square size={12} />
    case 'text':
      return <Type size={12} />
    case 'barcode':
      return <Barcode size={12} />
    case 'image':
      return <ImageIcon size={12} />
  }
}

function layerName(element: DesignElement): string {
  switch (element.type) {
    case 'box':
      return 'Box'
    case 'text':
      return element.content.replace(/\s+/g, ' ').trim() || 'Text'
    case 'barcode':
      return 'Barcode'
    case 'image':
      return element.source === 'productLogo' ? 'Product logo' : element.assetName || 'Image'
  }
}

function typeLabel(element: DesignElement): string {
  switch (element.type) {
    case 'box':
      return 'Box'
    case 'text':
      return 'Text'
    case 'barcode':
      return 'Barcode'
    case 'image':
      return 'Image'
  }
}

function handleStyle(handle: ResizeHandle): React.CSSProperties {
  const base: React.CSSProperties = {
    position: 'absolute',
    width: 9,
    height: 9,
    background: 'var(--color-surface)',
    border: '1.5px solid #4f46e5',
    borderRadius: 2,
    zIndex: 2,
  }
  const offset = -5
  if (handle.includes('n')) base.top = offset
  if (handle.includes('s')) base.bottom = offset
  if (handle.includes('w')) base.left = offset
  if (handle.includes('e')) base.right = offset
  if (handle === 'n' || handle === 's') {
    base.left = '50%'
    base.marginLeft = -4.5
  }
  if (handle === 'e' || handle === 'w') {
    base.top = '50%'
    base.marginTop = -4.5
  }
  const cursors: Record<ResizeHandle, string> = {
    nw: 'nwse-resize',
    se: 'nwse-resize',
    ne: 'nesw-resize',
    sw: 'nesw-resize',
    n: 'ns-resize',
    s: 'ns-resize',
    e: 'ew-resize',
    w: 'ew-resize',
  }
  base.cursor = cursors[handle]
  return base
}

function round2(value: number): number {
  return Math.round(value * 100) / 100
}

function round3(value: number): number {
  return Math.round(value * 1000) / 1000
}
