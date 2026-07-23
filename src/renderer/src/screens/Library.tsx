import { useState, useEffect, useCallback, useMemo } from 'react'
import { Search, Plus, Edit2, Copy, Trash2, FileText, Printer, RefreshCw, Upload, Tag, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import type { Product } from '../types'

interface Props {
  onEdit: (product: Product) => void
  onOpenSheet: (products: Product[]) => void
}

export default function Library({ onEdit, onOpenSheet }: Props): JSX.Element {
  type SortKey = 'name' | 'price' | 'barcodeValue' | 'updatedAt'

  const [products, setProducts] = useState<Product[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [exporting, setExporting] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>('__all__')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const load = useCallback(async () => {
    setLoading(true)
    const result = await window.api.product.list()
    if (result.ok) { setProducts(result.data); setError('') }
    else setError(result.error)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.barcodeValue.includes(query) ||
      p.price.toLowerCase().includes(query.toLowerCase())
  )

  // Sorted unique categories (non-empty)
  const categories = Array.from(
    new Set(products.map((p) => p.category?.trim()).filter(Boolean))
  ).sort((a, b) => a!.localeCompare(b!)) as string[]

  const categoryFiltered = filtered.filter(
    (p) => activeCategory === '__all__' || (p.category?.trim() || '') === activeCategory
  )

  const sortedProducts = useMemo(() => {
    const items = [...categoryFiltered]
    items.sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1

      if (sortKey === 'price') {
        return direction * (parsePrice(a.price) - parsePrice(b.price))
      }

      if (sortKey === 'updatedAt') {
        return direction * (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
      }

      const aValue = (a[sortKey] ?? '').toString()
      const bValue = (b[sortKey] ?? '').toString()
      return direction * aValue.localeCompare(bValue, undefined, { numeric: true, sensitivity: 'base' })
    })
    return items
  }, [categoryFiltered, sortDirection, sortKey])

  function parsePrice(value: string): number {
    const numeric = Number.parseFloat(value.replace(/[^0-9.-]/g, ''))
    return Number.isNaN(numeric) ? Number.NEGATIVE_INFINITY : numeric
  }

  function toggleSort(nextKey: SortKey): void {
    if (sortKey === nextKey) {
      setSortDirection((prev) => prev === 'asc' ? 'desc' : 'asc')
      return
    }
    setSortKey(nextKey)
    setSortDirection('asc')
  }

  function renderSortIcon(key: SortKey): JSX.Element {
    if (sortKey !== key) return <ArrowUpDown size={12} />
    return sortDirection === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
  }

  async function handleDelete(id: string): Promise<void> {
    if (!confirm('Delete this product? This cannot be undone.')) return
    setDeleting(id)
    const result = await window.api.product.delete(id)
    if (result.ok) setProducts((prev) => prev.filter((p) => p.id !== id))
    else alert(`Delete failed: ${result.error}`)
    setDeleting(null)
  }

  async function handleDuplicate(id: string): Promise<void> {
    const result = await window.api.product.duplicate(id)
    if (result.ok) setProducts((prev) => [result.data, ...prev])
    else alert(`Duplicate failed: ${result.error}`)
  }

  async function handleImport(): Promise<void> {
    setImporting(true)
    const result = await window.api.product.importSpreadsheet()
    setImporting(false)
    if (!result.ok) { alert(`Import failed: ${result.error}`); return }
    if (result.data === null) return // user cancelled
    const { imported, skipped } = result.data
    await load()
    let msg = `Imported ${imported} product${imported !== 1 ? 's' : ''}.`
    if (skipped.length) msg += `\n\nSkipped ${skipped.length} row${skipped.length !== 1 ? 's' : ''}:\n${skipped.slice(0, 10).join('\n')}${skipped.length > 10 ? `\n…and ${skipped.length - 10} more` : ''}`
    alert(msg)
  }

  async function handleExportPDF(product: Product): Promise<void> {
    setExporting(product.id)
    const result = await window.api.export.singlePDF(product)
    if (!result.ok) alert(`Export failed: ${result.error}`)
    setExporting(null)
  }

  function fmtDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="screen" style={{ display: 'flex', flexDirection: 'column', gap: 20, minHeight: 0 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a2332', margin: 0 }}>Products</h1>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 3 }}>
            {products.length} product{products.length !== 1 ? 's' : ''} in your library
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
          <button onClick={load} className="btn btn-icon" title="Refresh">
            <RefreshCw size={13} />
          </button>
          <button onClick={handleImport} disabled={importing} className="btn-outline btn-sm" title="Import from CSV / Excel">
            <Upload size={13} /> {importing ? 'Importing…' : 'Import'}
          </button>
          {products.length > 0 && (
            <button onClick={() => onOpenSheet(sortedProducts.slice(0, 8))} className="btn-outline btn-sm">
              <Printer size={13} /> Print Sheet
            </button>
          )}
          <button onClick={() => onEdit(undefined as unknown as Product)} className="btn-primary">
            <Plus size={14} /> New Product
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative' }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
        <input
          className="input"
          style={{ paddingLeft: 36 }}
          placeholder="Search by name, price, or barcode…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Category filter tabs */}
      {categories.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          <Tag size={12} style={{ color: '#94a3b8', flexShrink: 0 }} />
          {[{ id: '__all__', label: 'All' }, ...categories.map((c) => ({ id: c, label: c }))].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveCategory(id)}
              style={{
                padding: '3px 12px',
                borderRadius: 20,
                border: '1px solid',
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.1s',
                borderColor: activeCategory === id ? '#2563eb' : '#e2e8f0',
                background: activeCategory === id ? '#2563eb' : 'white',
                color: activeCategory === id ? 'white' : '#64748b',
              }}
            >
              {label}
              {id !== '__all__' && (
                <span style={{ marginLeft: 5, opacity: 0.7 }}>
                  {products.filter((p) => (p.category?.trim() || '') === id).length}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#dc2626' }}>
          {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 13, paddingTop: 60 }}>
          Loading products…
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="card" style={{ padding: '60px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 8 }}>
          <div style={{ fontSize: 40 }}>🏪</div>
          <p style={{ fontWeight: 600, color: '#1a2332', margin: 0 }}>
            {query || activeCategory !== '__all__' ? 'No products match your filter' : 'No products yet'}
          </p>
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
            {query || activeCategory !== '__all__' ? 'Try clearing the search or selecting a different category.' : 'Create your first product label to get started.'}
          </p>
          {!query && activeCategory === '__all__' && (
            <button
              onClick={() => onEdit(undefined as unknown as Product)}
              className="btn-primary"
              style={{ marginTop: 8 }}
            >
              <Plus size={14} /> Create Product
            </button>
          )}
        </div>
      ) : (
        <div className="card" style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#fafafa' }}>
                  <th style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    <button type="button" onClick={() => toggleSort('name')} style={sortButtonStyle}>
                      Product {renderSortIcon('name')}
                    </button>
                  </th>
                  <th style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    <button type="button" onClick={() => toggleSort('price')} style={sortButtonStyle}>
                      Price {renderSortIcon('price')}
                    </button>
                  </th>
                  <th style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    <button type="button" onClick={() => toggleSort('barcodeValue')} style={sortButtonStyle}>
                      Barcode {renderSortIcon('barcodeValue')}
                    </button>
                  </th>
                  <th style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    <button type="button" onClick={() => toggleSort('updatedAt')} style={sortButtonStyle}>
                      Modified {renderSortIcon('updatedAt')}
                    </button>
                  </th>
                  <th style={{ textAlign: 'right', padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedProducts.map((p) => (
                  <tr
                    key={p.id}
                    style={{ borderBottom: '1px solid #f8fafc' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#fafafa')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '11px 16px' }}>
                      <button
                        type="button"
                        className="product-name-button"
                        onClick={() => onEdit(p)}
                        title={`Open ${p.name}`}
                      >
                        {p.name}
                      </button>
                    </td>
                    <td style={{ padding: '11px 16px', color: '#334155', fontFamily: 'monospace' }}>{p.price}</td>
                    <td style={{ padding: '11px 16px', color: '#94a3b8', fontFamily: 'monospace', fontSize: 11 }}>{p.barcodeValue}</td>
                    <td style={{ padding: '11px 16px', color: '#94a3b8', fontSize: 12 }}>{fmtDate(p.updatedAt)}</td>
                    <td style={{ padding: '11px 16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <button onClick={() => onEdit(p)} className="btn btn-icon" title="Edit"><Edit2 size={13} /></button>
                        <button onClick={() => handleDuplicate(p.id)} className="btn btn-icon" title="Duplicate"><Copy size={13} /></button>
                        <button onClick={() => handleExportPDF(p)} disabled={exporting === p.id} className="btn btn-icon" title="Export PDF"><FileText size={13} /></button>
                        <button onClick={() => onOpenSheet([p])} className="btn btn-icon" title="Print Sheet"><Printer size={13} /></button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={deleting === p.id}
                          className="btn btn-icon danger"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

const sortButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: 0,
  border: 'none',
  background: 'transparent',
  color: 'inherit',
  font: 'inherit',
  textTransform: 'inherit',
  letterSpacing: 'inherit',
  cursor: 'pointer',
}
