import { useState, useEffect } from 'react'
import { Save, FolderOpen, FileCheck, Info } from 'lucide-react'
import type { AppSettings } from '../types'

export default function Settings(): JSX.Element {
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    window.api.settings.get().then((r) => {
      if (r.ok) setSettings(r.data)
      else setError(r.error)
    })
  }, [])

  function update(key: keyof AppSettings, value: string): void {
    setSettings((prev) => prev ? { ...prev, [key]: value } : null)
    setSaved(false)
  }

  async function handleSave(): Promise<void> {
    if (!settings) return
    setSaving(true)
    setError('')
    const entries = Object.entries(settings) as [string, string][]
    for (const [key, value] of entries) {
      const result = await window.api.settings.set(key, String(value))
      if (!result.ok) { setError(result.error); setSaving(false); return }
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function pickFolder(): Promise<void> {
    const result = await window.api.file.pickExportFolder()
    if (result.ok && result.data) update('exportFolder', result.data)
  }

  if (!settings) {
    return (
      <div className="screen" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 13 }}>
        {error || 'Loading settings…'}
      </div>
    )
  }

  return (
    <div className="screen">
      <div style={{ maxWidth: 560 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a2332', margin: '0 0 24px' }}>Settings</h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Label formatting */}
          <div className="card" style={{ padding: '20px 20px 24px' }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, color: '#1a2332', margin: '0 0 16px' }}>Label Formatting</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="label-text">Price prefix (currency symbol)</label>
                <input
                  className="input"
                  style={{ maxWidth: 100 }}
                  value={settings.pricePrefix}
                  onChange={(e) => update('pricePrefix', e.target.value)}
                  maxLength={5}
                  placeholder="$"
                />
                <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 5 }}>
                  Shown before the price — e.g. "$" for USD, "€" for EUR
                </p>
              </div>
              <div>
                <label className="label-text">Currency</label>
                <select
                  className="input"
                  style={{ maxWidth: 220 }}
                  value={settings.currency}
                  onChange={(e) => update('currency', e.target.value)}
                >
                  <option value="USD">USD — US Dollar</option>
                  <option value="EUR">EUR — Euro</option>
                  <option value="GBP">GBP — British Pound</option>
                </select>
              </div>
            </div>
          </div>

          {/* Barcode */}
          <div className="card" style={{ padding: '20px 20px 24px' }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, color: '#1a2332', margin: '0 0 16px' }}>Barcode</h2>
            <div>
              <label className="label-text">Default format</label>
              <select
                className="input"
                style={{ maxWidth: 280 }}
                value={settings.barcodeType}
                onChange={(e) => update('barcodeType', e.target.value)}
              >
                <option value="CODE128">Code 128 (recommended for internal use)</option>
              </select>
            </div>
          </div>

          {/* Export */}
          <div className="card" style={{ padding: '20px 20px 24px' }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, color: '#1a2332', margin: '0 0 16px' }}>Export</h2>
            <div>
              <label className="label-text">Default export folder</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input className="input" value={settings.exportFolder} onChange={(e) => update('exportFolder', e.target.value)} readOnly />
                <button onClick={pickFolder} className="btn-outline" style={{ flexShrink: 0 }}>
                  <FolderOpen size={13} /> Browse
                </button>
              </div>
            </div>
          </div>

          {/* Template info */}
          <div className="card" style={{ padding: '20px 20px 24px' }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, color: '#1a2332', margin: '0 0 16px' }}>Label Template</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', gap: 10, fontSize: 13, color: '#475569' }}>
                <FileCheck size={15} style={{ marginTop: 1, color: '#16a34a', flexShrink: 0 }} />
                <div>
                  <p style={{ fontWeight: 500, margin: 0 }}>label-template.eps — Grazia's Italian Market</p>
                  <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                    2.514" × 4.014" (181 × 289 pt) · Adobe Illustrator EPS · Stored in app data folder
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, fontSize: 13, color: '#475569' }}>
                <Info size={15} style={{ marginTop: 1, color: '#3b82f6', flexShrink: 0 }} />
                <div>
                  <p style={{ fontWeight: 500, margin: 0 }}>Avery 5821 Layout and Alternatives</p>
                  <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                    8 labels per US Letter sheet (8.5" × 11"). 2 columns × 4 rows.
                    Labels printed landscape (4" × 2.5" per slot). Margins: 0.25" left/right, 0.5" top/bottom.
                    Product templates are now built from modular header, brand, and content zones and can be selected per label.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#dc2626' }}>
              {error}
            </div>
          )}

          <div>
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              <Save size={14} />
              {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
