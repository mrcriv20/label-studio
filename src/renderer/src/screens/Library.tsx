import { useState, useEffect, useCallback } from 'react'
import { Search, Plus, Edit2, Copy, Trash2, FileText, Layers, RefreshCw } from 'lucide-react'
import type { Product } from '../types'

interface Props {
  onEdit: (product: Product) => void
  onOpenSheet: (products: Product[]) => void
}

export default function Library({ onEdit, onOpenSheet }: Props): JSX.Element {
  const [products, setProducts] = useState<Product[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [exporting, setExporting] = useState<string | null>(null)

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
    <div className="screen" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

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
          {products.length > 0 && (
            <button onClick={() => onOpenSheet(products.slice(0, 8))} className="btn-outline btn-sm">
              <Layers size={13} /> Print Sheet
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
      ) : filtered.length === 0 ? (
        <div className="card" style={{ padding: '60px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 8 }}>
          <div style={{ fontSize: 40 }}>🏪</div>
          <p style={{ fontWeight: 600, color: '#1a2332', margin: 0 }}>
            {query ? 'No products match your search' : 'No products yet'}
          </p>
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
            {query ? 'Try a different search term.' : 'Create your first product label to get started.'}
          </p>
          {!query && (
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
        <div className="card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#fafafa' }}>
                <th style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Product</th>
                <th style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Price</th>
                <th style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Barcode</th>
                <th style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Modified</th>
                <th style={{ textAlign: 'right', padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  style={{ borderBottom: '1px solid #f8fafc' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#fafafa')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '11px 16px', fontWeight: 600, color: '#1a2332' }}>{p.name}</td>
                  <td style={{ padding: '11px 16px', color: '#334155', fontFamily: 'monospace' }}>{p.price}</td>
                  <td style={{ padding: '11px 16px', color: '#94a3b8', fontFamily: 'monospace', fontSize: 11 }}>{p.barcodeValue}</td>
                  <td style={{ padding: '11px 16px', color: '#94a3b8', fontSize: 12 }}>{fmtDate(p.updatedAt)}</td>
                  <td style={{ padding: '11px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                      <button onClick={() => onEdit(p)} className="btn btn-icon" title="Edit"><Edit2 size={13} /></button>
                      <button onClick={() => handleDuplicate(p.id)} className="btn btn-icon" title="Duplicate"><Copy size={13} /></button>
                      <button onClick={() => handleExportPDF(p)} disabled={exporting === p.id} className="btn btn-icon" title="Export PDF"><FileText size={13} /></button>
                      <button onClick={() => onOpenSheet([p])} className="btn btn-icon" title="Print Sheet"><Layers size={13} /></button>
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
      )}
    </div>
  )
}
