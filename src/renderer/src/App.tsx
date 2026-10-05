import { lazy, Suspense, useEffect, useState } from 'react'
import Nav from './components/Nav'
import Library from './screens/Library'
import type { Product } from './types'
import { applyFontSettings, installFonts } from './lib/fonts'

const Editor = lazy(() => import('./screens/Editor'))
const SheetBuilder = lazy(() => import('./screens/SheetBuilder'))
const Settings = lazy(() => import('./screens/Settings'))
const HowTo = lazy(() => import('./screens/HowTo'))
const Designer = lazy(() => import('./screens/Designer'))

export type Screen = 'library' | 'editor' | 'sheet' | 'designer' | 'settings' | 'how-to'

export default function App(): JSX.Element {
  const [screen, setScreen] = useState<Screen>('library')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [sheetProducts, setSheetProducts] = useState<Product[]>([])
  const [sheetReturnProduct, setSheetReturnProduct] = useState<Product | null>(null)
  const [libraryCategory, setLibraryCategory] = useState('__all__')
  const [designerTarget, setDesignerTarget] = useState<string | null>(null)
  const [hasUnsavedWork, setHasUnsavedWork] = useState(false)
  const [sheetRepair, setSheetRepair] = useState<{ field: keyof Product } | null>(null)

  useEffect(() => {
    Promise.all([window.api.settings.get(), window.api.font.list()]).then(([settings, fonts]) => {
      if (fonts.ok) installFonts(fonts.data)
      if (!settings.ok) return
      document.documentElement.style.setProperty('--page-background', settings.data.pageBackgroundColor)
      applyFontSettings(settings.data)
    })
  }, [])

  useEffect(() => {
    function protectWindowClose(event: BeforeUnloadEvent): void {
      if (!hasUnsavedWork) return
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', protectWindowClose)
    return () => window.removeEventListener('beforeunload', protectWindowClose)
  }, [hasUnsavedWork])

  useEffect(() => {
    function handleGlobalShortcut(event: KeyboardEvent): void {
      if (!(event.metaKey || event.ctrlKey)) return
      const key = event.key.toLowerCase()
      if (key === 'n') {
        event.preventDefault()
        openEditor()
      }
      if (key === 'k') {
        event.preventDefault()
        if (screen !== 'library') navigateTo('library')
        window.requestAnimationFrame(() => document.getElementById('product-search')?.focus())
      }
    }
    window.addEventListener('keydown', handleGlobalShortcut)
    return () => window.removeEventListener('keydown', handleGlobalShortcut)
  })

  function canLeaveWorkspace(): boolean {
    return !hasUnsavedWork || window.confirm('Discard your unsaved changes? This cannot be undone.')
  }

  function navigateTo(next: Screen): void {
    if (next === screen || !canLeaveWorkspace()) return
    setHasUnsavedWork(false)
    if (next === 'editor') {
      setEditingProduct(null)
    }
    if (next !== 'sheet') setSheetReturnProduct(null)
    setScreen(next)
  }

  function openEditor(product?: Product): void {
    if (screen !== 'library' && !canLeaveWorkspace()) return
    setHasUnsavedWork(false)
    setEditingProduct(product ?? null)
    setSheetReturnProduct(null)
    setScreen('editor')
  }

  function openSheet(products: Product[], returnProduct?: Product | null): void {
    setSheetRepair(null)
    setHasUnsavedWork(false)
    setSheetProducts(products)
    setSheetReturnProduct(returnProduct ?? null)
    setScreen('sheet')
  }

  function openSheetRepair(product: Product, field: keyof Product): void {
    setHasUnsavedWork(false)
    setEditingProduct(product)
    setSheetRepair({ field })
    setScreen('editor')
  }

  function finishSheetRepair(): void {
    setHasUnsavedWork(false)
    setEditingProduct(null)
    setSheetProducts([])
    setSheetRepair(null)
    setScreen('sheet')
  }

  function backToDraftSheet(): void {
    if (!canLeaveWorkspace()) return
    finishSheetRepair()
  }

  function openDesigner(designId?: string | null): void {
    if (!canLeaveWorkspace()) return
    setHasUnsavedWork(false)
    setDesignerTarget(designId ?? null)
    setScreen('designer')
  }

  function backToLibrary(): void {
    if (!canLeaveWorkspace()) return
    setHasUnsavedWork(false)
    setEditingProduct(null)
    setSheetReturnProduct(null)
    setScreen('library')
  }

  function backFromSheet(): void {
    if (!canLeaveWorkspace()) return
    setHasUnsavedWork(false)
    if (sheetReturnProduct) {
      setEditingProduct(sheetReturnProduct)
      setSheetProducts([])
      setSheetReturnProduct(null)
      setScreen('editor')
      return
    }
    setScreen('library')
  }

  return (
    <div className="app-layout">
      <Nav
        current={screen}
        onNavigate={(s) => {
          navigateTo(s)
        }}
      />
      <main className="content-area" id="main-content">
        <Suspense fallback={<div role="status" className="screen app-loading">Loading workspace…</div>}>
          {screen === 'library' && (
            <Library
              onEdit={openEditor}
              onOpenSheet={openSheet}
              activeCategory={libraryCategory}
              onActiveCategoryChange={setLibraryCategory}
            />
          )}
          {screen === 'editor' && (
            <Editor
              initialProduct={editingProduct}
              onBack={sheetRepair ? backToDraftSheet : backToLibrary}
              onOpenSheet={(p) => openSheet([p], p)}
              onOpenDesigner={openDesigner}
              onDirtyChange={setHasUnsavedWork}
              repairField={sheetRepair?.field ?? null}
              onReturnToSheet={sheetRepair ? finishSheetRepair : undefined}
            />
          )}
          {screen === 'designer' && <Designer initialDesignId={designerTarget} onDirtyChange={setHasUnsavedWork} />}
          {screen === 'sheet' && (
            <SheetBuilder
              initialProducts={sheetProducts}
              onBack={backFromSheet}
              backLabel={sheetReturnProduct ? 'Label' : 'Products'}
              onRepairIssue={openSheetRepair}
            />
          )}
          {screen === 'settings' && <Settings onDirtyChange={setHasUnsavedWork} onOpenCalibration={() => { if (!canLeaveWorkspace()) return; setSheetProducts([]); setSheetReturnProduct(null); setHasUnsavedWork(false); setScreen('sheet') }} />}
          {screen === 'how-to' && <HowTo onNavigate={setScreen} />}
        </Suspense>
      </main>
    </div>
  )
}
