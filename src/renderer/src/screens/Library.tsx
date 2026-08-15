import { useState, useEffect, useCallback, useMemo } from 'react'
import { Search, Plus, Edit2, Copy, Trash2, FileText, Printer, RefreshCw, Upload, Tag, ArrowUpDown, ArrowUp, ArrowDown, Sticker, MoreHorizontal, Store, AlertCircle, CheckCircle2 } from 'lucide-react'
import type { Product } from '../types'
import RollPrintDialog from '../components/RollPrintDialog'
import { assessProductContentFit, outputEligibilityError } from '../../../shared/contentFit'
import { confirmUsingSavedTillieData, readTillieFreshness, recordTillieSyncFailure, recordTillieSyncSuccess, type TillieFreshness } from '../lib/tillieFreshness'

interface Props {
  onEdit: (product?: Product) => void
  onOpenSheet: (products: Product[]) => void
}

export default function Library({ onEdit, onOpenSheet }: Props): JSX.Element {
  type SortKey = 'name' | 'category' | 'price' | 'barcodeValue' | 'updatedAt'

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
  const [tillieNotice, setTillieNotice] = useState('')
  const [rollProduct, setRollProduct] = useState<Product | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())
  const [selectionNotice, setSelectionNotice] = useState('')
  const [operationNotice, setOperationNotice] = useState('')
  const [operationError, setOperationError] = useState('')
  const [freshness, setFreshness] = useState<TillieFreshness | null>(() => readTillieFreshness())
  const [syncRetrying, setSyncRetrying] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const result = await window.api.product.list()
    if (result.ok) { setProducts(result.data); setError('') }
    else setError(result.error)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const syncTillie = useCallback(async (cancelled?: () => boolean) => {
    setSyncRetrying(true)
    try {
      const cfg = await window.api.tillie.getConfig()
      if (cancelled?.()) return
      if (!cfg.ok) {
        setFreshness(recordTillieSyncFailure('Tillie configuration could not be checked.'))
        return
      }
      if (!cfg.data.autoSyncOnLaunch || (!cfg.data.lastSyncAt && !cfg.data.connectedUserName && !cfg.data.mongoUri)) return
      const result = await window.api.tillie.sync()
      if (cancelled?.()) return
      if (!result.ok) {
        setFreshness(recordTillieSyncFailure(result.error))
        return
      }
      setFreshness(recordTillieSyncSuccess())
      const { created, updated, pushed } = result.data
      if (created + updated + pushed > 0) {
        const parts = [updated ? `${updated} price/name update${updated !== 1 ? 's' : ''}` : '', created ? `${created} new label${created !== 1 ? 's' : ''}` : '', pushed ? `${pushed} label${pushed !== 1 ? 's' : ''} added to Tillie` : ''].filter(Boolean)
        setTillieNotice(`Synced from Tillie: ${parts.join(', ')}.`)
        await load()
      }
    } catch {
      if (!cancelled?.()) setFreshness(recordTillieSyncFailure('Tillie could not be reached.'))
    } finally {
      if (!cancelled?.()) setSyncRetrying(false)
    }
  }, [load])

  useEffect(() => {
    let cancelled = false
    void syncTillie(() => cancelled)
    return () => { cancelled = true }
  }, [syncTillie])

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

  function toggleProductSelection(id: string): void {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else if (next.size < 8) next.add(id)
      else setSelectionNotice('A PLS780 sheet holds eight labels. Clear one selection before adding another.')
      return next
    })
  }

  function toggleAllVisible(): void {
    const visibleIds = sortedProducts.map(({ id }) => id)
    const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id))
    setSelectedIds((current) => {
      const next = new Set(current)
      visibleIds.forEach((id) => {
        if (allSelected) next.delete(id)
        else if (next.size < 8) next.add(id)
      })
      if (!allSelected && visibleIds.length > 8) setSelectionNotice('Selected the first eight visible products—the maximum for one PLS780 sheet.')
      return next
    })
  }

  const selectedProducts = products.filter(({ id }) => selectedIds.has(id))
  const hasTillieLinkedProducts = products.some((product) => Boolean(product.tillieProductId))

  function renderSortIcon(key: SortKey): JSX.Element {
    if (sortKey !== key) return <ArrowUpDown size={12} />
    return sortDirection === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
  }

  async function handleDelete(id: string): Promise<void> {
    if (!confirm('Delete this product? This cannot be undone.')) return
    setDeleting(id)
    const result = await window.api.product.delete(id)
    if (result.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id))
      setSelectedIds((current) => {
        const next = new Set(current)
        next.delete(id)
        return next
      })
    }
    else setOperationError(`Product could not be deleted: ${result.error}`)
    setDeleting(null)
  }

  async function handleDuplicate(id: string): Promise<void> {
    const result = await window.api.product.duplicate(id)
    if (result.ok) setProducts((prev) => [result.data, ...prev])
    else setOperationError(`Product could not be duplicated: ${result.error}`)
  }

  async function handleImport(): Promise<void> {
    setImporting(true)
    const result = await window.api.product.importSpreadsheet()
    setImporting(false)
    if (!result.ok) { setOperationError(`Import failed: ${result.error}. Check the file and try again.`); return }
    if (result.data === null) return // user cancelled
    const { imported, skipped } = result.data
    await load()
    let msg = `Imported ${imported} product${imported !== 1 ? 's' : ''}.`
    if (skipped.length) msg += `\n\nSkipped ${skipped.length} row${skipped.length !== 1 ? 's' : ''}:\n${skipped.slice(0, 10).join('\n')}${skipped.length > 10 ? `\n…and ${skipped.length - 10} more` : ''}`
    setOperationNotice(msg.replace(/\n+/g, ' '))
  }

  async function handleExportPDF(product: Product): Promise<void> {
    const eligibilityError = outputEligibilityError([{ product }], 'PDF export')
    if (eligibilityError) { setOperationError(eligibilityError); return }
    if (!confirmUsingSavedTillieData([product])) return
    setExporting(product.id)
    const result = await window.api.export.singlePDF(product)
    if (!result.ok) setOperationError(`Label PDF export failed: ${result.error}. Check the export folder and try again.`)
    else if (result.data) setOperationNotice(`Exported ${product.name} as a label PDF.`)
    setExporting(null)
  }

  function openRollPrint(product: Product): void {
    const eligibilityError = outputEligibilityError([{ product }], 'Roll printing')
    if (eligibilityError) { setOperationError(eligibilityError); return }
    if (!confirmUsingSavedTillieData([product])) return
    setRollProduct(product)
  }

  function openSheet(productsToPrint: Product[]): void {
    if (!confirmUsingSavedTillieData(productsToPrint)) return
    onOpenSheet(productsToPrint)
  }

  function fmtDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="screen" style={{ display: 'flex', flexDirection: 'column', gap: 20, minHeight: 0 }}>

      {/* Header */}
      <div className="library-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-workbench-navy)', margin: 0 }}>Products</h1>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 3 }}>
            {products.length} product{products.length !== 1 ? 's' : ''} in your library
          </p>
        </div>
        <div className="library-header-actions" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={load} className="btn btn-icon" title="Refresh" aria-label="Refresh product library">
            <RefreshCw size={13} />
          </button>
          <button onClick={handleImport} disabled={importing} className="btn-outline btn-sm" title="Import from CSV / Excel">
            <Upload size={13} /> {importing ? 'Importing…' : 'Import'}
          </button>
          <button onClick={() => openSheet(selectedProducts)} className="btn-outline btn-sm">
            <Printer size={13} /> {selectedProducts.length ? `Print Sheet (${selectedProducts.length})` : 'Blank Print Sheet'}
          </button>
          <button onClick={() => onEdit()} className="btn-primary">
            <Plus size={14} /> New Label
          </button>
        </div>
      </div>

      {/* Search */}
      {selectionNotice && (
        <div role="status" className="status-message" style={{ padding: '8px 12px', background: 'var(--color-warning-surface)', color: 'var(--color-warning)', border: '1px solid var(--color-warning-border)', borderRadius: 8, fontSize: 12 }}>
          {selectionNotice}
        </div>
      )}
      {operationNotice && (
        <div role="status" aria-live="polite" className="status-message" style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 12px', background: 'var(--color-success-surface)', color: 'var(--color-success-text)', border: '1px solid var(--color-success-border)', borderRadius: 8, fontSize: 12 }}>
          <span style={{ flex: 1 }}>{operationNotice}</span><button className="btn-ghost btn-sm" onClick={() => setOperationNotice('')}>Dismiss</button>
        </div>
      )}
      {operationError && (
        <div role="alert" className="status-message" style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 12px', background: 'var(--color-danger-surface)', color: 'var(--color-danger-text)', border: '1px solid var(--color-danger-border)', borderRadius: 8, fontSize: 12 }}>
          <span style={{ flex: 1 }}>{operationError}</span><button className="btn-ghost btn-sm" onClick={() => setOperationError('')}>Dismiss</button>
        </div>
      )}
      {hasTillieLinkedProducts && freshness?.state === 'stale' && (
        <div role="alert" className="status-message sync-freshness is-stale">
          <AlertCircle size={15} />
          <div><strong>Offline — using saved Tillie data</strong><span>{freshness.lastSuccessAt ? `Last successful sync: ${new Date(freshness.lastSuccessAt).toLocaleString()}.` : 'No successful sync time is available.'} Output from linked products requires acknowledgment.</span></div>
          <button type="button" className="btn-outline btn-sm" onClick={() => void syncTillie()} disabled={syncRetrying}><RefreshCw size={12} className={syncRetrying ? 'spin' : undefined} />{syncRetrying ? 'Retrying…' : 'Retry sync'}</button>
        </div>
      )}
      {hasTillieLinkedProducts && freshness?.state === 'fresh' && freshness.lastSuccessAt && (
        <div role="status" className="sync-freshness is-fresh"><CheckCircle2 size={14} /><span>POS data verified {new Date(freshness.lastSuccessAt).toLocaleString()}.</span></div>
      )}
      <div style={{ position: 'relative' }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
        <input
          id="product-search"
          aria-label="Search products by name, price, or barcode"
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
          <Tag size={12} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
          {[{ id: '__all__', label: 'All' }, ...categories.map((c) => ({ id: c, label: c }))].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveCategory(id)}
              style={{
                padding: '3px 12px',
                minHeight: 28,
                borderRadius: 20,
                border: '1px solid',
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.1s',
                borderColor: activeCategory === id ? 'var(--color-action-blue)' : 'var(--color-border)',
                background: activeCategory === id ? 'var(--color-action-blue)' : 'white',
                color: activeCategory === id ? 'white' : 'var(--color-text-secondary)',
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

      {rollProduct && <RollPrintDialog product={rollProduct} onClose={() => setRollProduct(null)} />}

      {/* Tillie sync notice */}
      {tillieNotice && (
        <div role="status" aria-live="polite" className="status-message" style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--color-success-surface)', border: '1px solid var(--color-success-border)', borderRadius: 10, padding: '10px 16px', fontSize: 13, color: 'var(--color-success-text)' }}>
          <span style={{ flex: 1 }}>{tillieNotice}</span>
          <button
            onClick={() => setTillieNotice('')}
            style={{ border: 'none', background: 'transparent', color: 'var(--color-success-text)', cursor: 'pointer', fontSize: 12, padding: 0 }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div role="alert" className="status-message" style={{ background: 'var(--color-danger-surface)', border: '1px solid var(--color-danger-border)', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: 'var(--color-danger-text)' }}>
          {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: 13, paddingTop: 60 }}>
          Loading products…
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="card" style={{ padding: '60px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 8 }}>
          <Store size={38} strokeWidth={1.6} aria-hidden="true" style={{ color: 'var(--color-market-green)' }} />
          <p style={{ fontWeight: 600, color: 'var(--color-workbench-navy)', margin: 0 }}>
            {query || activeCategory !== '__all__' ? 'No products match your filter' : 'No products yet'}
          </p>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>
            {query || activeCategory !== '__all__' ? 'Try clearing the search or selecting a different category.' : 'Create your first product label to get started.'}
          </p>
          {!query && activeCategory === '__all__' && (
            <button
              onClick={() => onEdit()}
              className="btn-primary"
              style={{ marginTop: 8 }}
            >
              <Plus size={14} /> Create Label
            </button>
          )}
        </div>
      ) : (
        <div className="card" style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                <tr style={{ borderBottom: '1px solid #f1f5f9', background: 'var(--color-neutral-canvas)' }}>
                  <th style={{ width: 42, padding: '10px 8px 10px 16px' }}>
                    <input
                      type="checkbox"
                      aria-label="Select all visible products"
                      checked={sortedProducts.length > 0 && sortedProducts.every(({ id }) => selectedIds.has(id))}
                      onChange={toggleAllVisible}
                    />
                  </th>
                  <th aria-sort={sortKey === 'name' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#526173', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    <button type="button" onClick={() => toggleSort('name')} style={sortButtonStyle}>
                      Product {renderSortIcon('name')}
                    </button>
                  </th>
                  <th className="library-secondary-column" aria-sort={sortKey === 'category' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#526173', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    <button type="button" onClick={() => toggleSort('category')} style={sortButtonStyle}>
                      Category {renderSortIcon('category')}
                    </button>
                  </th>
                  <th aria-sort={sortKey === 'price' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#526173', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    <button type="button" onClick={() => toggleSort('price')} style={sortButtonStyle}>
                      Price {renderSortIcon('price')}
                    </button>
                  </th>
                  <th className="library-secondary-column" aria-sort={sortKey === 'barcodeValue' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#526173', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    <button type="button" onClick={() => toggleSort('barcodeValue')} style={sortButtonStyle}>
                      Barcode {renderSortIcon('barcodeValue')}
                    </button>
                  </th>
                  <th className="library-secondary-column" aria-sort={sortKey === 'updatedAt' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#526173', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    <button type="button" onClick={() => toggleSort('updatedAt')} style={sortButtonStyle}>
                      Modified {renderSortIcon('updatedAt')}
                    </button>
                  </th>
                  <th style={{ textAlign: 'right', padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#526173', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedProducts.map((p) => (
                  <tr
                    key={p.id}
                    style={{ borderBottom: '1px solid #f8fafc' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-neutral-canvas)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ width: 42, padding: '11px 8px 11px 16px' }}>
                      <input
                        type="checkbox"
                        aria-label={`Select ${p.name} for a print sheet`}
                        checked={selectedIds.has(p.id)}
                        onChange={() => toggleProductSelection(p.id)}
                      />
                    </td>
                    <td style={{ padding: '11px 16px' }}>
                      <button
                        type="button"
                        className="product-name-button"
                        onClick={() => onEdit(p)}
                        title={`Open ${p.name}`}
                      >
                        {p.name}
                      </button>
                      {assessProductContentFit(p).some((issue) => issue.status === 'clipped') && <button type="button" className="fit-inline-badge" onClick={() => onEdit(p)} title="Open this label to repair clipped content">Content needs attention</button>}
                      {p.tillieProductId && <span className="sr-only"> · Linked to Tillie POS</span>}
                    </td>
                    <td className="library-secondary-column" style={{ padding: '11px 16px', color: 'var(--color-text-strong-secondary)' }}>{p.category || 'Uncategorized'}</td>
                    <td style={{ padding: '11px 16px', color: 'var(--color-text-strong-secondary)', fontFamily: 'monospace' }}>{p.price}</td>
                    <td className="library-secondary-column" style={{ padding: '11px 16px', color: 'var(--color-text-muted)', fontFamily: 'monospace', fontSize: 11 }}>{p.barcodeValue}</td>
                    <td className="library-secondary-column" style={{ padding: '11px 16px', color: 'var(--color-text-muted)', fontSize: 12 }}>{fmtDate(p.updatedAt)}</td>
                    <td style={{ padding: '11px 16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 4 }}>
                        <button onClick={() => onEdit(p)} className="btn-ghost btn-sm"><Edit2 size={13} /> Edit</button>
                        <button onClick={() => openSheet([p])} className="btn-outline btn-sm" title={assessProductContentFit(p).some((issue) => issue.status === 'clipped') ? 'Open the sheet and repair content before printing' : 'Build a print sheet'}><Printer size={13} /> Print</button>
                        <details className="row-actions-menu">
                          <summary className="btn btn-icon" aria-label={`More actions for ${p.name}`} title="More actions"><MoreHorizontal size={14} /></summary>
                          <div className="row-actions-popover">
                            <button onClick={() => handleDuplicate(p.id)}><Copy size={13} /> Duplicate product</button>
                            <button onClick={() => handleExportPDF(p)} disabled={exporting === p.id}><FileText size={13} /> Export label PDF</button>
                            <button onClick={() => openRollPrint(p)}><Sticker size={13} /> Print roll label</button>
                            <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} className="danger"><Trash2 size={13} /> Delete product</button>
                          </div>
                        </details>
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
  minHeight: 24,
}
