import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  { label: 'Avery sheet slot (2.51 × 4.01 in)', w: 181, h: 289 },
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
}

export default function Designer({ initialDesignId }: Props): JSX.Element {
  const [designs, setDesigns] = useState<Array<{ id: string; name: string }>>([])
  const [design, setDesign] = useState<DesignTemplate | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)
  const [savedFlash, setSavedFlash] = useState(false)
  const [zoom, setZoom] = useState(2)
  const [guides, setGuides] = useState<{ vx: number | null; vy: number | null }>({ vx: null, vy: null })
  const [fonts, setFonts] = useState<Array<{ id: string; family: string }>>([])
  const [products, setProducts] = useState<Product[]>([])
  const [sampleProductId, setSampleProductId] = useState('')
  const [error, setError] = useState('')
  const [dragLayerId, setDragLayerId] = useState<string | null>(null)
  const [dropIndex, setDropIndex] = useState<number | null>(null)

  const pastRef = useRef<DesignTemplate[]>([])
  const futureRef = useRef<DesignTemplate[]>([])
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

  const sampleProduct = useMemo<Partial<Product>>(() => {
    const chosen = products.find((product) => product.id === sampleProductId)
    return chosen ?? SAMPLE_PRODUCT
  }, [products, sampleProductId])

  const images = useDesignImages(design, undefined, sampleProduct.designImageOverrides)

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
      const result = await window.api.design.get(id)
      if (result.ok) openDesign(result.data)
      else setError(result.error)
    },
    [openDesign],
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
    const result = await window.api.design.importFile()
    if (!result.ok) {
      setError(result.error)
      return
    }
    if (!result.data) return
    await refreshDesignList()
    openDesign(result.data)
  }, [refreshDesignList, openDesign])

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
    if (!design || !measurer) return ''
    return paintDesignSVG(design, sampleProduct, measurer, images)
  }, [design, sampleProduct, measurer, images])

  if (!design) {
    return <div style={{ padding: 40, color: '#94a3b8' }}>Loading designer…</div>
  }

  const canvasW = design.canvas.width * zoom
  const canvasH = design.canvas.height * zoom

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* ── Top bar ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '14px 20px',
          borderBottom: '1px solid #e8eaed',
          background: 'white',
          flexWrap: 'wrap',
        }}
      >
        <select
          className="input"
          style={{ width: 210 }}
          value={designs.some((d) => d.id === design.id) ? design.id : '__new__'}
          onChange={(e) => {
            if (e.target.value === '__new__') openDesign(newDesign())
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
        <button className="btn-outline btn-sm" onClick={() => openDesign(newDesign())}>
          <Plus size={12} /> New
        </button>
        <input
          className="input"
          style={{ width: 200 }}
          value={design.name}
          onChange={(e) => commit((d) => ({ ...d, name: e.target.value }))}
          placeholder="Design name"
        />

        <div style={{ width: 1, alignSelf: 'stretch', background: '#e8eaed' }} />

        <button className="btn-outline btn-sm" onClick={() => addElement(newBox(design.canvas))}>
          <Square size={12} /> Box
        </button>
        <button className="btn-outline btn-sm" onClick={() => addElement(newText(design.canvas))}>
          <Type size={12} /> Text
        </button>
        <button className="btn-outline btn-sm" onClick={() => addElement(newBarcode(design.canvas))}>
          <Barcode size={12} /> Barcode
        </button>
        <button className="btn-outline btn-sm" onClick={() => addElement(newImage(design.canvas, 'productLogo'))}>
          <ImageIcon size={12} /> Logo
        </button>
        <button
          className="btn-outline btn-sm"
          onClick={async () => {
            const result = await window.api.design.importImage()
            if (result.ok && result.data) addElement(newImage(design.canvas, 'asset', result.data.assetName))
            else if (!result.ok) setError(result.error)
          }}
        >
          <ImageIcon size={12} /> Image…
        </button>

        <div style={{ flex: 1 }} />

        <button className="btn-outline btn-sm" onClick={() => setZoom((z) => Math.max(0.5, round2(z - 0.5)))}>
          <ZoomOut size={12} />
        </button>
        <span style={{ fontSize: 11, color: '#64748b', width: 38, textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
        <button className="btn-outline btn-sm" onClick={() => setZoom((z) => Math.min(6, round2(z + 0.5)))}>
          <ZoomIn size={12} />
        </button>

        <button className="btn-outline btn-sm" title="Import a design exported from another Label Studio" onClick={importDesign}>
          <Upload size={12} /> Import…
        </button>
        <button className="btn-outline btn-sm" title="Export this design to share with another Label Studio" onClick={exportDesign}>
          <Download size={12} /> Export
        </button>
        <button className="btn-outline btn-sm" onClick={deleteDesign}>
          <Trash2 size={12} /> Delete
        </button>
        <button className="btn-green btn-sm" onClick={saveDesign}>
          <Save size={12} /> {savedFlash ? 'Saved ✓' : dirty ? 'Save*' : 'Save'}
        </button>
      </div>

      {error && (
        <div style={{ padding: '8px 20px', background: '#fef2f2', color: '#b91c1c', fontSize: 12 }}>{error}</div>
      )}

      {/* ── Body ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Layers */}
        <div style={{ width: 190, borderRight: '1px solid #e8eaed', background: 'white', overflowY: 'auto', padding: 10 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '4px 4px 8px' }}>
            Layers
          </p>
          <div
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
                draggable
                onClick={() => setSelectedId(element.id)}
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
                  color: '#334155',
                  opacity: dragLayerId === element.id ? 0.4 : 1,
                  boxShadow:
                    dropIndex === index
                      ? 'inset 0 2px 0 #4f46e5'
                      : dropIndex === index + 1 && index === displayed.length - 1
                        ? 'inset 0 -2px 0 #4f46e5'
                        : 'none',
                }}
              >
                <span style={{ color: '#cbd5e1', display: 'inline-flex', cursor: 'grab' }}>
                  <GripVertical size={11} />
                </span>
                <span style={{ color: '#94a3b8', display: 'inline-flex' }}>{layerIcon(element)}</span>
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {layerName(element)}
                </span>
                <button
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
          style={{ flex: 1, overflow: 'auto', background: '#eceff3', display: 'flex', padding: 40 }}
          onPointerDown={() => setSelectedId(null)}
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
                  onPointerDown={(e) => beginGesture(e, element, 'move', null)}
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
                        onPointerDown={(e) => beginGesture(e, element, 'resize', handle)}
                        style={handleStyle(handle)}
                      />
                    ))}
                </div>
              )
            })}

            {/* snap guides */}
            {guides.vx !== null && (
              <div style={{ position: 'absolute', left: guides.vx * zoom, top: 0, bottom: 0, width: 1, background: '#f43f5e', pointerEvents: 'none' }} />
            )}
            {guides.vy !== null && (
              <div style={{ position: 'absolute', top: guides.vy * zoom, left: 0, right: 0, height: 1, background: '#f43f5e', pointerEvents: 'none' }} />
            )}
          </div>
        </div>

        {/* Inspector */}
        <div style={{ width: 300, borderLeft: '1px solid #e8eaed', background: 'white', overflowY: 'auto', padding: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Canvas settings */}
            <div className="card" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label className="label-text" style={{ marginBottom: 0 }}>Canvas</label>
              <select
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
              <label className="label-text" style={{ marginBottom: 0 }}>Preview with</label>
              <select className="input" value={sampleProductId} onChange={(e) => setSampleProductId(e.target.value)}>
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
              <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
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
        <label className="label-text" style={{ marginBottom: 0, flex: 1 }}>
          {typeLabel(element)}
        </label>
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <NumberField label="X (pt)" value={round2(element.x)} onChange={(x) => onChange({ x })} />
        <NumberField label="Y (pt)" value={round2(element.y)} onChange={(y) => onChange({ y })} />
        <NumberField label="W (pt)" value={round2(element.w)} min={MIN_ELEMENT_SIZE} onChange={(w) => onChange({ w })} />
        <NumberField label="H (pt)" value={round2(element.h)} min={MIN_ELEMENT_SIZE} onChange={(h) => onChange({ h })} />
      </div>

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
            <label className="label-text">Text</label>
            <textarea
              className="input"
              rows={3}
              value={element.content}
              onChange={(e) => onChange({ content: e.target.value })}
              style={{ resize: 'vertical', fontFamily: 'inherit' }}
            />
            <select
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
            <label className="label-text">Font</label>
            <select className="input" value={element.fontId} onChange={(e) => onChange({ fontId: e.target.value })}>
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
              <label className="label-text">Align</label>
              <select className="input" value={element.align} onChange={(e) => onChange({ align: e.target.value as TextElement['align'] })}>
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
            <label className="label-text">Letter case</label>
            <select
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
          <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>
            The barcode always uses the product’s barcode number (CODE128).
          </p>
        </>
      )}

      {element.type === 'image' && (
        <>
          <div>
            <label className="label-text">Source</label>
            <select
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
            <label className="label-text">Fit</label>
            <select className="input" value={element.fit} onChange={(e) => onChange({ fit: e.target.value as ImageElement['fit'] })}>
              <option value="contain">Contain (letterbox)</option>
              <option value="cover">Cover (crop)</option>
              <option value="stretch">Stretch</option>
            </select>
          </div>
          <div>
            <label className="label-text">Slot name (shown in product editor)</label>
            <input
              className="input"
              value={element.label ?? ''}
              placeholder="e.g. Product photo"
              onChange={(e) => onChange({ label: e.target.value || undefined })}
            />
            <p style={{ fontSize: 11, color: '#94a3b8', margin: '4px 0 0' }}>
              Each product can replace this image from the label editor; this design’s image is the default.
            </p>
          </div>
        </>
      )}

      {/* Common */}
      <div>
        <label className="label-text">Visibility</label>
        <select
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
  return (
    <div style={{ flex: 1 }}>
      <label className="label-text">{label}</label>
      <input
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
  return (
    <div>
      <label className="label-text">{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="color"
          value={/^#[0-9a-f]{6}$/i.test(value) ? value : '#ffffff'}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          style={{ width: 38, height: 32, padding: 2, border: '1px solid #e2e8f0', borderRadius: 6, background: '#fff', cursor: 'pointer' }}
        />
        <input
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
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#334155', cursor: 'pointer' }}>
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
  color: '#94a3b8',
  display: 'inline-flex',
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
    background: 'white',
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
