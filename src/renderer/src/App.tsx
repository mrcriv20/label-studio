import { useEffect, useState } from 'react'
import Nav from './components/Nav'
import Library from './screens/Library'
import Editor from './screens/Editor'
import SheetBuilder from './screens/SheetBuilder'
import Settings from './screens/Settings'
import HowTo from './screens/HowTo'
import type { Product } from './types'
import { applyFontSettings, installFonts } from './lib/fonts'

export type Screen = 'library' | 'editor' | 'sheet' | 'settings' | 'how-to'

export default function App(): JSX.Element {
  const [screen, setScreen] = useState<Screen>('library')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [sheetProducts, setSheetProducts] = useState<Product[]>([])

  useEffect(() => {
    Promise.all([window.api.settings.get(), window.api.font.list()]).then(([settings, fonts]) => {
      if (fonts.ok) installFonts(fonts.data)
      if (!settings.ok) return
      document.documentElement.style.setProperty('--page-background', settings.data.pageBackgroundColor)
      applyFontSettings(settings.data)
    })
  }, [])

  function openEditor(product?: Product): void {
    setEditingProduct(product ?? null)
    setScreen('editor')
  }

  function openSheet(products: Product[]): void {
    setSheetProducts(products)
    setScreen('sheet')
  }

  function backToLibrary(): void {
    setEditingProduct(null)
    setScreen('library')
  }

  return (
    <div className="app-layout">
      <Nav
        current={screen}
        onNavigate={(s) => {
          if (s === 'editor') openEditor()
          else setScreen(s)
        }}
      />
      <div className="content-area">
        {screen === 'library' && (
          <Library onEdit={openEditor} onOpenSheet={openSheet} />
        )}
        {screen === 'editor' && (
          <Editor
            initialProduct={editingProduct}
            onBack={backToLibrary}
            onOpenSheet={(p) => openSheet([p])}
          />
        )}
        {screen === 'sheet' && (
          <SheetBuilder
            initialProducts={sheetProducts}
            onBack={() => setScreen('library')}
          />
        )}
        {screen === 'settings' && <Settings />}
        {screen === 'how-to' && <HowTo onNavigate={setScreen} />}
      </div>
    </div>
  )
}
