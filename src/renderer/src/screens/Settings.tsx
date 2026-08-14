import { useState, useEffect, useId, useMemo, useRef } from 'react'
import { Save, FolderOpen, FileCheck, Info, Upload, Download } from 'lucide-react'
import type { AppSettings, FontAsset } from '../types'
import { applyFontSettings, installFonts } from '../lib/fonts'
import TillieSyncCard from '../components/TillieSyncCard'

interface Props {
  onDirtyChange: (dirty: boolean) => void
  onOpenCalibration: () => void
}

export default function Settings({ onDirtyChange, onOpenCalibration }: Props): JSX.Element {
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [fonts, setFonts] = useState<FontAsset[]>([])
  const [googleFamily, setGoogleFamily] = useState('')
  const [addingFont, setAddingFont] = useState(false)
  const savedSettingsRef = useRef('')
  const dirty = useMemo(() => Boolean(settings) && JSON.stringify(settings) !== savedSettingsRef.current, [settings, saved])

  useEffect(() => {
    window.api.settings.get().then((r) => {
      if (r.ok) {
        savedSettingsRef.current = JSON.stringify(r.data)
        setSettings(r.data)
      }
      else setError(r.error)
    })
  }, [])
  useEffect(() => () => {
    if (!savedSettingsRef.current) return
    try {
      const savedSettings = JSON.parse(savedSettingsRef.current) as AppSettings
      document.documentElement.style.setProperty('--page-background', savedSettings.pageBackgroundColor)
      applyFontSettings(savedSettings)
    } catch {
      // The saved snapshot comes from our own serializer; a malformed value
      // should not prevent navigation away from Settings.
    }
  }, [])
  useEffect(() => {
    onDirtyChange(dirty)
    return () => onDirtyChange(false)
  }, [dirty, onDirtyChange])
  useEffect(() => {
    window.api.font.list().then((result) => {
      if (result.ok) { setFonts(result.data); installFonts(result.data) }
    })
  }, [])

  function update(key: keyof AppSettings, value: string): void {
    setSettings((prev) => prev ? { ...prev, [key]: value } : null)
    if (key === 'pageBackgroundColor') {
      document.documentElement.style.setProperty('--page-background', value)
    }
    if (key === 'titleFontId' || key === 'priceFontId' || key === 'bodyFontId') {
      const next = settings ? { ...settings, [key]: value } : null
      if (next) applyFontSettings(next)
    }
    setSaved(false)
  }

  async function handleSave(): Promise<void> {
    if (!settings) return
    if (!/^#[0-9a-f]{6}$/i.test(settings.pageBackgroundColor) ||
        (settings.labelBackgroundColor && !/^#[0-9a-f]{6}$/i.test(settings.labelBackgroundColor))) {
      setError('Background colors must use a 6-digit hex value, such as #f4f5f7.')
      return
    }
    const x = Number(settings.sheetOffsetXIn)
    const y = Number(settings.sheetOffsetYIn)
    if (!Number.isFinite(x) || !Number.isFinite(y) || Math.abs(x) > 0.5 || Math.abs(y) > 0.5) {
      setError('Calibration offsets must be numbers between -0.500 and +0.500 inches.')
      return
    }
    setSaving(true)
    setError('')
    const result = await window.api.settings.setMany(settings)
    if (!result.ok) { setError(result.error); setSaving(false); return }
    setSaving(false)
    savedSettingsRef.current = JSON.stringify(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function pickFolder(): Promise<void> {
    const result = await window.api.file.pickExportFolder()
    if (result.ok && result.data) update('exportFolder', result.data)
  }

  async function addFont(kind: 'local' | 'upload' | 'google'): Promise<void> {
    setAddingFont(true)
    setError('')
    const result = kind === 'google'
      ? await window.api.font.addGoogle(googleFamily)
      : kind === 'local'
        ? await window.api.font.importLocal()
        : await window.api.font.upload()
    setAddingFont(false)
    if (!result.ok) { setError(result.error); return }
    if (!result.data) return
    const next = [...fonts, result.data]
    setFonts(next)
    installFonts(next)
    if (kind === 'google') setGoogleFamily('')
  }

  if (!settings) {
    return (
      <div className="screen" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: 13 }}>
        {error || 'Loading settings…'}
      </div>
    )
  }

  return (
    <div className="screen">
      <div style={{ maxWidth: 560 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-workbench-navy)', margin: '0 0 24px' }}>Settings</h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Tillie POS sync */}
          <TillieSyncCard />

          {/* Label formatting */}
          <div className="card" style={{ padding: '20px 20px 24px' }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-workbench-navy)', margin: '0 0 16px' }}>Label Formatting</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="label-text" htmlFor="price-prefix">Price prefix (currency symbol)</label>
                <input
                  id="price-prefix"
                  className="input"
                  style={{ maxWidth: 100 }}
                  value={settings.pricePrefix}
                  onChange={(e) => update('pricePrefix', e.target.value)}
                  maxLength={5}
                  placeholder="$"
                />
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 5 }}>
                  Shown before the price — e.g. "$" for USD, "€" for EUR
                </p>
              </div>
              <div>
                <label className="label-text" htmlFor="currency">Currency</label>
                <select
                  id="currency"
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

          <div className="card" style={{ padding: '20px 20px 24px' }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-workbench-navy)', margin: '0 0 6px' }}>Label Fonts</h2>
            <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', margin: '0 0 16px', lineHeight: 1.5 }}>
              Font selections preview immediately and are restored if you discard Settings changes. Imported font files are installed immediately and remain available even if you leave without saving.
            </p>
            <div className="settings-font-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FontSelect label="Product title" value={settings.titleFontId} fonts={fonts} onChange={(v) => update('titleFontId', v)} />
              <FontSelect label="Price" value={settings.priceFontId} fonts={fonts} onChange={(v) => update('priceFontId', v)} />
              <FontSelect label="Details and instructions" value={settings.bodyFontId} fonts={fonts} onChange={(v) => update('bodyFontId', v)} />
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button className="btn-outline" onClick={() => addFont('local')} disabled={addingFont}><FolderOpen size={13} /> Local font</button>
              <button className="btn-outline" onClick={() => addFont('upload')} disabled={addingFont}><Upload size={13} /> Upload file</button>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <input aria-label="Google Fonts family" className="input" value={googleFamily} onChange={(e) => setGoogleFamily(e.target.value)} placeholder="Google Fonts family, e.g. Roboto" />
              <button className="btn-outline" onClick={() => addFont('google')} disabled={addingFont || !googleFamily.trim()} style={{ flexShrink: 0 }}>
                <Download size={13} /> {addingFont ? 'Adding…' : 'Add Google font'}
              </button>
            </div>
          </div>

          <div className="card" style={{ padding: '20px 20px 24px' }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-workbench-navy)', margin: '0 0 16px' }}>Background Colors</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <ColorSetting
                label="App page background"
                value={settings.pageBackgroundColor}
                fallback="#f4f5f7"
                onChange={(value) => update('pageBackgroundColor', value)}
              />
              <ColorSetting
                label="Global label background"
                value={settings.labelBackgroundColor}
                fallback="#f5efdc"
                onChange={(value) => update('labelBackgroundColor', value)}
                allowDefault
              />
              <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', margin: 0 }}>
                The global label color applies unless a label has its own override. Resetting it preserves each template’s original color.
              </p>
            </div>
          </div>

          {/* Barcode */}
          <div className="card" style={{ padding: '20px 20px 24px' }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-workbench-navy)', margin: '0 0 16px' }}>Barcode</h2>
            <div>
              <label className="label-text" htmlFor="barcode-format">Default format</label>
              <select
                id="barcode-format"
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
            <h2 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-workbench-navy)', margin: '0 0 16px' }}>Export</h2>
            <div>
              <label className="label-text" htmlFor="export-folder">Default export folder</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input id="export-folder" className="input" value={settings.exportFolder} onChange={(e) => update('exportFolder', e.target.value)} readOnly />
                <button onClick={pickFolder} className="btn-outline" style={{ flexShrink: 0 }}>
                  <FolderOpen size={13} /> Browse
                </button>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '20px 20px 24px' }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-workbench-navy)', margin: '0 0 16px' }}>Print Calibration</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', margin: 0 }}>
                Current PLS780 calibration: horizontal {Number(settings.sheetOffsetXIn) >= 0 ? '+' : ''}{Number(settings.sheetOffsetXIn || 0).toFixed(3)} in · vertical {Number(settings.sheetOffsetYIn) >= 0 ? '+' : ''}{Number(settings.sheetOffsetYIn || 0).toFixed(3)} in. Calibration applies to sheet PDF export and direct printing.
              </p>
              <button className="btn-outline" onClick={onOpenCalibration} style={{ alignSelf: 'flex-start' }}>Open guided calibration in Print Sheet</button>
            </div>
          </div>

          {/* Template info */}
          <div className="card" style={{ padding: '20px 20px 24px' }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-workbench-navy)', margin: '0 0 16px' }}>Label Template</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', gap: 10, fontSize: 13, color: 'var(--color-text-tertiary)' }}>
                <FileCheck size={15} style={{ marginTop: 1, color: '#16a34a', flexShrink: 0 }} />
                <div>
                  <p style={{ fontWeight: 500, margin: 0 }}>Built-in market template — Grazia's Italian Market</p>
                  <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                    2.514" × 4.014" (181 × 289 pt) · Adobe Illustrator EPS · Stored in app data folder
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, fontSize: 13, color: 'var(--color-text-tertiary)' }}>
                <Info size={15} style={{ marginTop: 1, color: '#3b82f6', flexShrink: 0 }} />
                <div>
                  <p style={{ fontWeight: 500, margin: 0 }}>Premium Label Supply PLS780 Sheet Layout</p>
                  <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                    8 labels per US Letter sheet (8.5" × 11"). 2 columns × 4 rows.
                    Labels print landscape at 4" × 2.5" per slot with 0.15625" side margins, a 0.1875" center gutter, and 0.5" top/bottom margins.
                    Product templates are now built from modular header, brand, and content zones and can be selected per label.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div role="alert" className="status-message" style={{ background: 'var(--color-danger-surface)', border: '1px solid var(--color-danger-border)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--color-danger-text)' }}>
              {error}
            </div>
          )}

          <div>
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              <Save size={14} />
              {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Settings'}
            </button>
            <span role="status" aria-live="polite" className="sr-only">
              {saving ? 'Saving settings' : saved ? 'Settings saved' : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function FontSelect({ label, value, fonts, onChange }: { label: string; value: string; fonts: FontAsset[]; onChange: (value: string) => void }): JSX.Element {
  const id = useId()
  return (
    <div>
      <label className="label-text" htmlFor={id}>{label}</label>
      <select id={id} className="input" value={value} onChange={(e) => onChange(e.target.value)}>
        {fonts.map((font) => <option key={font.id} value={font.id}>{font.family} · {font.source}</option>)}
      </select>
      <div style={{ marginTop: 5, fontSize: 18, lineHeight: 1.2, fontFamily: `LabelFont-${value.replace(/[^a-z0-9_-]/gi, '-')}` }}>Market Aa</div>
    </div>
  )
}

function ColorSetting({
  label,
  value,
  fallback,
  onChange,
  allowDefault = false,
}: {
  label: string
  value: string
  fallback: string
  onChange: (value: string) => void
  allowDefault?: boolean
}): JSX.Element {
  const colorId = useId()
  const textId = useId()
  return (
    <div>
      <label className="label-text" htmlFor={textId}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <input
          id={colorId}
          aria-label={`${label} color picker`}
          type="color"
          value={value || fallback}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: 44, height: 36, padding: 2, border: '1px solid var(--color-border)', borderRadius: 6, background: 'var(--color-surface)', cursor: 'pointer' }}
        />
        <input
          id={textId}
          className="input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={allowDefault ? 'Template default' : fallback}
          pattern="^#[0-9A-Fa-f]{6}$"
          maxLength={7}
        />
        {allowDefault && value && (
          <button type="button" className="btn-outline" onClick={() => onChange('')}>Reset</button>
        )}
      </div>
    </div>
  )
}
