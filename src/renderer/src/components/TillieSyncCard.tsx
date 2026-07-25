import { useState, useEffect, useCallback } from 'react'
import { RefreshCw, Plug, Unplug, ChevronDown, ChevronRight, Store } from 'lucide-react'
import type { TillieCategory, TillieConfig, TillieProductSummary } from '../types'

export default function TillieSyncCard(): JSX.Element {
  const [config, setConfig] = useState<TillieConfig | null>(null)
  const [categories, setCategories] = useState<TillieCategory[] | null>(null)
  const [products, setProducts] = useState<TillieProductSummary[] | null>(null)
  const [baseUrlDraft, setBaseUrlDraft] = useState('')
  const [pin, setPin] = useState('')
  const [busy, setBusy] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [showPicker, setShowPicker] = useState(false)

  const refreshCategories = useCallback(async () => {
    const result = await window.api.tillie.getCategories()
    if (result.ok) { setCategories(result.data); setError('') }
    else { setCategories(null); setError(result.error) }
  }, [])

  const refreshProducts = useCallback(async () => {
    const result = await window.api.tillie.listProducts()
    if (result.ok) setProducts(result.data)
    else setProducts(null)
  }, [])

  useEffect(() => {
    window.api.tillie.getConfig().then((result) => {
      if (!result.ok) { setError(result.error); return }
      setConfig(result.data)
      setBaseUrlDraft(result.data.baseUrl)
    })
    refreshCategories()
  }, [refreshCategories])

  useEffect(() => {
    if (config?.connectedUserName && !products) refreshProducts()
  }, [config?.connectedUserName, products, refreshProducts])

  async function saveBaseUrl(): Promise<void> {
    const result = await window.api.tillie.setConfig({ baseUrl: baseUrlDraft })
    if (!result.ok) { setError(result.error); return }
    setConfig(result.data)
    setBaseUrlDraft(result.data.baseUrl)
    refreshCategories()
  }

  async function connect(): Promise<void> {
    setBusy(true)
    setError('')
    const result = await window.api.tillie.login(pin)
    setBusy(false)
    if (!result.ok) { setError(result.error); return }
    setConfig(result.data)
    setPin('')
    refreshCategories()
    refreshProducts()
  }

  async function disconnect(): Promise<void> {
    const result = await window.api.tillie.disconnect()
    if (result.ok) setConfig(result.data)
    setProducts(null)
  }

  async function applyConfig(patch: Partial<TillieConfig>): Promise<void> {
    const result = await window.api.tillie.setConfig(patch)
    if (!result.ok) { setError(result.error); return }
    setConfig(result.data)
    if (products) refreshProducts()
  }

  function toggleCategory(cat: TillieCategory): void {
    if (!config) return
    const subscribed = config.subscribedCategories.some((c) => c.id === cat.id)
    const next = subscribed
      ? config.subscribedCategories.filter((c) => c.id !== cat.id)
      : [...config.subscribedCategories, { id: cat.id, name: cat.name }]
    applyConfig({ subscribedCategories: next })
  }

  function toggleProduct(p: TillieProductSummary): void {
    if (!config) return
    const inSubscribedCategory = config.subscribedCategories.some((c) => c.name === p.category)
    if (inSubscribedCategory) {
      const excluded = config.excludedProductIds.includes(p.id)
      applyConfig({
        excludedProductIds: excluded
          ? config.excludedProductIds.filter((id) => id !== p.id)
          : [...config.excludedProductIds, p.id],
      })
    } else {
      const included = config.includedProductIds.includes(p.id)
      applyConfig({
        includedProductIds: included
          ? config.includedProductIds.filter((id) => id !== p.id)
          : [...config.includedProductIds, p.id],
        // Re-adding a previously deleted label should work again.
        excludedProductIds: config.excludedProductIds.filter((id) => id !== p.id),
      })
    }
  }

  async function syncNow(): Promise<void> {
    setSyncing(true)
    setError('')
    setNotice('')
    const result = await window.api.tillie.sync()
    setSyncing(false)
    if (!result.ok) { setError(result.error); return }
    const { created, updated, unchanged, duplicateBarcodes } = result.data
    let msg = `Sync complete — ${created} new label${created !== 1 ? 's' : ''}, ${updated} updated, ${unchanged} already up to date.`
    if (duplicateBarcodes.length) {
      msg += ` Skipped ${duplicateBarcodes.length} duplicate barcode${duplicateBarcodes.length !== 1 ? 's' : ''} in Tillie: ${duplicateBarcodes.join(', ')}.`
    }
    setNotice(msg)
    const cfg = await window.api.tillie.getConfig()
    if (cfg.ok) setConfig(cfg.data)
    refreshProducts()
  }

  const connected = Boolean(config?.connectedUserName)
  const productCountFor = (name: string): number | null =>
    products ? products.filter((p) => p.category === name).length : null

  const pickerGroups = (() => {
    if (!products) return []
    const groups = new Map<string, TillieProductSummary[]>()
    for (const p of products) {
      const key = p.category || 'Uncategorized'
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key)!.push(p)
    }
    return Array.from(groups.entries())
  })()

  return (
    <div className="card" style={{ padding: '20px 20px 24px' }}>
      <h2 style={{ fontSize: 13, fontWeight: 600, color: '#1a2332', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: 6 }}>
        <Store size={14} /> Tillie POS Sync
      </h2>
      <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 16px', lineHeight: 1.5 }}>
        Pull products from your Tillie register. Labels linked to Tillie get their name, price, and
        category updated automatically — Tillie is the source of truth for those fields.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Connection */}
        <div>
          <label className="label-text">Tillie address</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              className="input"
              value={baseUrlDraft}
              onChange={(e) => setBaseUrlDraft(e.target.value)}
              placeholder="http://127.0.0.1:3000"
            />
            <button
              className="btn-outline"
              style={{ flexShrink: 0 }}
              onClick={saveBaseUrl}
              disabled={!config || baseUrlDraft === config.baseUrl}
            >
              Save
            </button>
          </div>
        </div>

        {connected ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#16a34a' }}>
            <Plug size={14} />
            Connected as {config?.connectedUserName}
            <button className="btn-outline btn-sm" onClick={disconnect} style={{ marginLeft: 'auto' }}>
              <Unplug size={13} /> Disconnect
            </button>
          </div>
        ) : (
          <div>
            <label className="label-text">Tillie PIN</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                className="input"
                style={{ maxWidth: 160 }}
                type="password"
                inputMode="numeric"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && pin.trim()) connect() }}
                placeholder="Enter register PIN"
              />
              <button className="btn-outline" onClick={connect} disabled={busy || !pin.trim()} style={{ flexShrink: 0 }}>
                <Plug size={13} /> {busy ? 'Connecting…' : 'Connect'}
              </button>
            </div>
            <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 5 }}>
              Use the same PIN you sign in with at the register. The PIN itself is never stored.
            </p>
          </div>
        )}

        {/* Category subscriptions */}
        <div>
          <label className="label-text">Categories to sync</label>
          {categories === null ? (
            <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
              Waiting for Tillie — check the address above and make sure the register app is running.
            </p>
          ) : categories.length === 0 ? (
            <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>No categories found in Tillie.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
              {categories.map((cat) => {
                const subscribed = config?.subscribedCategories.some((c) => c.id === cat.id) ?? false
                const count = productCountFor(cat.name)
                return (
                  <label
                    key={cat.id}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#334155', cursor: 'pointer' }}
                  >
                    <input type="checkbox" checked={subscribed} onChange={() => toggleCategory(cat)} />
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: cat.color || '#cbd5e1', flexShrink: 0 }} />
                    {cat.name}
                    {count !== null && (
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>
                        {count} product{count !== 1 ? 's' : ''}
                      </span>
                    )}
                  </label>
                )
              })}
            </div>
          )}
          <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>
            All products in checked categories are pulled in on each sync. Labels you already linked
            keep syncing even if their category is unchecked.
          </p>
        </div>

        {/* Per-product picker */}
        <div>
          <button
            type="button"
            onClick={() => { setShowPicker((v) => !v); if (!products) refreshProducts() }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, border: 'none', background: 'transparent', padding: 0, fontSize: 12, fontWeight: 500, color: '#2563eb', cursor: 'pointer' }}
          >
            {showPicker ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
            Choose individual products
          </button>
          {showPicker && (
            products === null ? (
              <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>
                {connected ? 'Loading products…' : 'Connect with your PIN to browse Tillie products.'}
              </p>
            ) : (
              <div style={{ maxHeight: 260, overflow: 'auto', border: '1px solid #f1f5f9', borderRadius: 8, marginTop: 8, padding: '6px 10px' }}>
                {pickerGroups.map(([category, items]) => (
                  <div key={category} style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '6px 0 4px' }}>
                      {category}
                    </div>
                    {items.map((p) => (
                      <label
                        key={p.id}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: '#334155', padding: '3px 0', cursor: 'pointer' }}
                      >
                        <input type="checkbox" checked={p.inScope} onChange={() => toggleProduct(p)} />
                        <span style={{ flex: 1 }}>{p.name}</span>
                        {p.linked && (
                          <span style={{ fontSize: 10, color: '#16a34a', border: '1px solid #bbf7d0', background: '#f0fdf4', borderRadius: 10, padding: '1px 7px' }}>
                            linked
                          </span>
                        )}
                        <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#94a3b8' }}>
                          ${p.price.toFixed(2)}
                        </span>
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* Auto-sync + sync now */}
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#334155', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={config?.autoSyncOnLaunch ?? true}
            onChange={(e) => applyConfig({ autoSyncOnLaunch: e.target.checked })}
          />
          Sync automatically when the app opens
        </label>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="btn-primary" onClick={syncNow} disabled={syncing}>
            <RefreshCw size={14} className={syncing ? 'spin' : undefined} />
            {syncing ? 'Syncing…' : 'Sync Now'}
          </button>
          {config?.lastSyncAt && (
            <span style={{ fontSize: 11, color: '#94a3b8' }}>
              Last synced {new Date(config.lastSyncAt).toLocaleString()}
            </span>
          )}
        </div>

        {notice && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '10px 14px', fontSize: 12.5, color: '#166534' }}>
            {notice}
          </div>
        )}
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 12.5, color: '#dc2626' }}>
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
