import { useState, useEffect, useCallback } from 'react'
import { RefreshCw, Plug, Unplug, ChevronDown, ChevronRight, Store, Search } from 'lucide-react'
import type { TillieCategory, TillieConfig, TillieProductSummary } from '../types'
import { recordTillieSyncFailure, recordTillieSyncSuccess } from '../lib/tillieFreshness'

export default function TillieSyncCard(): JSX.Element {
  const [config, setConfig] = useState<TillieConfig | null>(null)
  const [categories, setCategories] = useState<TillieCategory[] | null>(null)
  const [products, setProducts] = useState<TillieProductSummary[] | null>(null)
  const [baseUrlDraft, setBaseUrlDraft] = useState('')
  const [mongoUriDraft, setMongoUriDraft] = useState('')
  const [showDbSetup, setShowDbSetup] = useState(false)
  const [pin, setPin] = useState('')
  const [busy, setBusy] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [showPicker, setShowPicker] = useState(false)
  const [showCategories, setShowCategories] = useState(false)
  const [categoryQuery, setCategoryQuery] = useState('')
  const [configSaving, setConfigSaving] = useState(false)
  const [auditSummary, setAuditSummary] = useState<string[]>([])
  const [syncSummary, setSyncSummary] = useState<{ created: number; updated: number; unchanged: number; pushed: number; pushSkipped: string[]; duplicateBarcodes: string[] } | null>(null)
  const [adminCredentialAcknowledged, setAdminCredentialAcknowledged] = useState(false)

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
    if (result.ok) { setConfig(result.data); setNotice('Tillie register disconnected. Saved labels remain available offline.') }
    else { setError(`Tillie could not be disconnected: ${result.error}`); return }
    setProducts(null)
  }

  async function applyConfig(patch: Partial<TillieConfig>, summary: string[]): Promise<void> {
    setConfigSaving(true)
    setError('')
    const result = await window.api.tillie.setConfig(patch)
    setConfigSaving(false)
    if (!result.ok) { setError(result.error); setNotice(''); return }
    setConfig(result.data)
    setAuditSummary(summary)
    setNotice('Sync scope saved immediately.')
    if (products) refreshProducts()
  }

  function toggleCategory(cat: TillieCategory): void {
    if (!config) return
    const subscribed = config.subscribedCategories.some((c) => c.id === cat.id)
    const next = subscribed
      ? config.subscribedCategories.filter((c) => c.id !== cat.id)
      : [...config.subscribedCategories, { id: cat.id, name: cat.name }]
    applyConfig({ subscribedCategories: next }, [
      `${subscribed ? 'Removed' : 'Added'} category: ${cat.name}.`,
      `${next.length} categor${next.length === 1 ? 'y' : 'ies'} will import new Tillie products.`,
      ...(subscribed ? ['Products already linked from this category remain linked and continue syncing.'] : []),
    ])
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
      }, [`${excluded ? 'Restored' : 'Excluded'} product: ${p.name}.`, excluded ? 'This product will resume syncing through its selected category.' : 'This linked product will stop receiving Tillie updates.'])
    } else {
      const included = config.includedProductIds.includes(p.id)
      applyConfig({
        includedProductIds: included
          ? config.includedProductIds.filter((id) => id !== p.id)
          : [...config.includedProductIds, p.id],
        // Re-adding a previously deleted label should work again.
        excludedProductIds: config.excludedProductIds.filter((id) => id !== p.id),
      }, [`${included ? 'Removed individual inclusion for' : 'Added individual inclusion for'} ${p.name}.`, included ? 'It will sync only if its category is selected.' : 'It will sync even though its category is not selected.'])
    }
  }

  async function syncNow(): Promise<void> {
    setSyncing(true)
    setError('')
    setNotice('')
    setSyncSummary(null)
    const result = await window.api.tillie.sync()
    setSyncing(false)
    if (!result.ok) { recordTillieSyncFailure(result.error); setError(`Sync failed: ${result.error}. Saved labels remain available offline.`); return }
    const { created, updated, unchanged, pushed, pushSkipped, duplicateBarcodes } = result.data
    recordTillieSyncSuccess()
    setSyncSummary({ created, updated, unchanged, pushed, pushSkipped, duplicateBarcodes })
    setNotice(pushSkipped.length || duplicateBarcodes.length ? 'Sync finished with items that need attention.' : 'Sync complete.')
    const cfg = await window.api.tillie.getConfig()
    if (cfg.ok) setConfig(cfg.data)
    refreshProducts()
  }

  const dbMode = Boolean(config?.mongoUri)
  const connected = dbMode || Boolean(config?.connectedUserName)

  async function saveMongoUri(uri: string): Promise<void> {
    const result = await window.api.tillie.setConfig({ mongoUri: uri })
    if (!result.ok) { setError(result.error); return }
    setConfig(result.data)
    setMongoUriDraft('')
    setShowDbSetup(false)
    setError('')
    setProducts(null)
    refreshCategories()
  }
  const productCountFor = (name: string): number | null =>
    products ? products.filter((p) => p.category === name).length : null
  const selectedCategoryCount = config?.subscribedCategories.length ?? 0
  const visibleCategories = (categories ?? []).filter((category) =>
    category.name.toLocaleLowerCase().includes(categoryQuery.trim().toLocaleLowerCase())
  )

  function setAllCategories(selected: boolean): void {
    if (!categories) return
    applyConfig({
      subscribedCategories: selected ? categories.map(({ id, name }) => ({ id, name })) : [],
    }, selected
      ? [`Selected all ${categories.length} categories.`, 'New products from every category will be imported; linked products remain linked.']
      : ['Cleared all category subscriptions.', 'No new category products will be imported; products already linked to Tillie remain linked and continue syncing.'])
  }

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
      <h2 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-workbench-navy)', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: 6 }}>
        <Store size={14} /> Tillie POS · Optional integration
      </h2>
      <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', margin: '0 0 16px', lineHeight: 1.5 }}>
        Pull products from your Tillie register. Labels linked to Tillie get their name, price, and
        category updated automatically — Tillie is the source of truth for those fields. Changes in this integration section save immediately.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {dbMode ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--color-success-text)' }}>
            <Plug size={14} />
            Connected directly to Tillie&apos;s database
            <button
              className="btn-outline btn-sm"
              onClick={() => saveMongoUri('')}
              style={{ marginLeft: 'auto' }}
            >
              <Unplug size={13} /> Disconnect
            </button>
          </div>
        ) : (
          <>
            {/* Register (HTTP) connection */}
            <div>
              <label className="label-text" htmlFor="tillie-address">Tillie address</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  id="tillie-address"
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--color-success-text)' }}>
                <Plug size={14} />
                Connected as {config?.connectedUserName}
                <button className="btn-outline btn-sm" onClick={disconnect} style={{ marginLeft: 'auto' }}>
                  <Unplug size={13} /> Disconnect
                </button>
              </div>
            ) : (
              <div>
                <label className="label-text" htmlFor="tillie-pin">Tillie PIN</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    id="tillie-pin"
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
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 5 }}>
                  Use the same PIN you sign in with at the register. The PIN itself is never stored.
                </p>
              </div>
            )}

            {/* Direct database connection (works from anywhere with internet) */}
            <div>
              <button
                type="button"
                className="disclosure-button"
                aria-expanded={showDbSetup}
                onClick={() => setShowDbSetup((v) => !v)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 4, border: 'none', background: 'transparent', fontSize: 12, fontWeight: 500, color: 'var(--color-action-blue)', cursor: 'pointer' }}
              >
                {showDbSetup ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                Administrator database connection
              </button>
              {showDbSetup && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      aria-label="Tillie database connection string"
                      className="input"
                      type="password"
                      value={mongoUriDraft}
                      onChange={(e) => setMongoUriDraft(e.target.value)}
                      placeholder="mongodb+srv://…  (Atlas connection string)"
                    />
                    <button
                      className="btn-outline"
                      style={{ flexShrink: 0 }}
                      onClick={() => saveMongoUri(mongoUriDraft.trim())}
                      disabled={!mongoUriDraft.trim() || !adminCredentialAcknowledged}
                    >
                      Connect
                    </button>
                  </div>
                  <div className="admin-credential-warning" role="alert">
                    <strong>Administrator-only credential</strong>
                    <span>This connection string grants broad access to store data. Use a dedicated least-privilege account, never share or paste it into support messages, and rotate it immediately if exposed.</span>
                    <label><input type="checkbox" checked={adminCredentialAcknowledged} onChange={(event) => setAdminCredentialAcknowledged(event.target.checked)} /> I am authorized to connect this store database.</label>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Category subscriptions */}
        <div>
          <button
            type="button"
            aria-expanded={showCategories}
            onClick={() => setShowCategories((open) => !open)}
            className="btn-outline"
            style={{ width: '100%', justifyContent: 'space-between' }}
          >
            <span>Categories to sync · {selectedCategoryCount} selected</span>
            {showCategories ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          {categories === null ? (
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0 }}>
              Waiting for Tillie — check the address above and make sure the register app is running.
            </p>
          ) : categories.length === 0 ? (
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0 }}>No categories found in Tillie.</p>
          ) : showCategories ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={13} style={{ position: 'absolute', insetInlineStart: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                  <input
                    className="input"
                    aria-label="Search Tillie categories"
                    value={categoryQuery}
                    onChange={(event) => setCategoryQuery(event.target.value)}
                    placeholder="Search categories…"
                    style={{ paddingInlineStart: 32 }}
                  />
                </div>
                <button className="btn-ghost btn-sm" onClick={() => setAllCategories(true)} disabled={configSaving}>Select all</button>
                <button className="btn-ghost btn-sm" onClick={() => setAllCategories(false)} disabled={configSaving}>Clear</button>
              </div>
              <div style={{ maxHeight: 260, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6, border: '1px solid var(--color-border)', borderRadius: 8, padding: 10 }}>
              {visibleCategories.map((cat) => {
                const subscribed = config?.subscribedCategories.some((c) => c.id === cat.id) ?? false
                const count = productCountFor(cat.name)
                return (
                  <label
                    key={cat.id}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-text-strong-secondary)', cursor: 'pointer' }}
                  >
                    <input type="checkbox" checked={subscribed} disabled={configSaving} onChange={() => toggleCategory(cat)} />
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: cat.color || 'var(--color-border-strong)', flexShrink: 0 }} />
                    {cat.name}
                    {count !== null && (
                      <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                        {count} product{count !== 1 ? 's' : ''}
                      </span>
                    )}
                  </label>
                )
              })}
              {visibleCategories.length === 0 && (
                <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-muted)' }}>No categories match “{categoryQuery}”.</p>
              )}
              </div>
            </div>
          ) : null}
          <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 6 }}>
            New products are imported from selected categories. Products already linked to Tillie keep syncing even if their category is later cleared.
          </p>
          <span role="status" aria-live="polite" className="sr-only">{configSaving ? 'Saving sync settings' : ''}</span>
        </div>

        {/* Per-product picker */}
        <div>
          <button
            type="button"
            className="disclosure-button"
            aria-expanded={showPicker}
            onClick={() => { setShowPicker((v) => !v); if (!products) refreshProducts() }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, border: 'none', background: 'transparent', fontSize: 12, fontWeight: 500, color: 'var(--color-action-blue)', cursor: 'pointer' }}
          >
            {showPicker ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
            Choose individual products
          </button>
          {showPicker && (
            products === null ? (
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 6 }}>
                {connected ? 'Loading products…' : 'Connect with your PIN to browse Tillie products.'}
              </p>
            ) : (
              <div style={{ maxHeight: 260, overflow: 'auto', border: '1px solid #f1f5f9', borderRadius: 8, marginTop: 8, padding: '6px 10px' }}>
                {pickerGroups.map(([category, items]) => (
                  <div key={category} style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '6px 0 4px' }}>
                      {category}
                    </div>
                    {items.map((p) => (
                      <label
                        key={p.id}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--color-text-strong-secondary)', padding: '3px 0', cursor: 'pointer' }}
                      >
                        <input type="checkbox" checked={p.inScope} disabled={configSaving} onChange={() => toggleProduct(p)} />
                        <span style={{ flex: 1 }}>{p.name}</span>
                        {p.linked && (
                          <span style={{ fontSize: 11, color: 'var(--color-success-text)', border: '1px solid var(--color-success-border)', background: 'var(--color-success-surface)', borderRadius: 10, padding: '2px 7px' }}>
                            linked
                          </span>
                        )}
                        <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--color-text-muted)' }}>
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
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-text-strong-secondary)', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={config?.autoSyncOnLaunch ?? true}
            onChange={(e) => applyConfig({ autoSyncOnLaunch: e.target.checked }, [e.target.checked ? 'Enabled automatic sync when Tillie Print opens.' : 'Disabled automatic sync on launch.', 'This change was saved immediately.'])}
          />
          Sync automatically when the app opens
        </label>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="btn-primary" onClick={syncNow} disabled={syncing}>
            <RefreshCw size={14} className={syncing ? 'spin' : undefined} />
            {syncing ? 'Syncing…' : 'Sync Now'}
          </button>
          {config?.lastSyncAt && (
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
              Last synced {new Date(config.lastSyncAt).toLocaleString()}
            </span>
          )}
        </div>

        {notice && (
          <div role="status" aria-live="polite" className="status-message" style={{ background: 'var(--color-success-surface)', border: '1px solid var(--color-success-border)', borderRadius: 8, padding: '10px 14px', fontSize: 12.5, color: 'var(--color-success-text)' }}>
            {notice}
          </div>
        )}
        {auditSummary.length > 0 && (
          <div className="sync-audit-summary" role="status" aria-live="polite"><strong>Saved change</strong><ul>{auditSummary.map((item) => <li key={item}>{item}</li>)}</ul></div>
        )}
        {syncSummary && (
          <div className="sync-result-summary" aria-label="Tillie sync result">
            <div className="is-success"><strong>Updated</strong><span>{syncSummary.created} new · {syncSummary.updated} changed · {syncSummary.pushed} sent to Tillie</span></div>
            <div><strong>Unchanged</strong><span>{syncSummary.unchanged} already current</span></div>
            {(syncSummary.pushSkipped.length > 0 || syncSummary.duplicateBarcodes.length > 0) && <div className="is-warning"><strong>Needs attention</strong><span>{syncSummary.pushSkipped.length ? `Unreadable price: ${syncSummary.pushSkipped.join(', ')}. ` : ''}{syncSummary.duplicateBarcodes.length ? `Duplicate barcode: ${syncSummary.duplicateBarcodes.join(', ')}.` : ''}</span></div>}
          </div>
        )}
        {error && (
          <div role="alert" className="status-message" style={{ background: 'var(--color-danger-surface)', border: '1px solid var(--color-danger-border)', borderRadius: 8, padding: '10px 14px', fontSize: 12.5, color: 'var(--color-danger-text)' }}>
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
