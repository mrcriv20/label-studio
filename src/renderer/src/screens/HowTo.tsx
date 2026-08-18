import {
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  Lightbulb,
  Printer,
  Settings,
  Tag,
} from 'lucide-react'
import type { Screen } from '../App'

interface Props {
  onNavigate: (screen: Screen) => void
}

const steps = [
  {
    number: '01',
    title: 'Add a product',
    description: 'Choose New Label to enter one product, or use Import on the Products page to add a CSV or Excel list.',
    Icon: FileSpreadsheet,
  },
  {
    number: '02',
    title: 'Design the label',
    description: 'Pick a template, enter the product details, and use the live preview to check the result. Save when it looks right.',
    Icon: Tag,
  },
  {
    number: '03',
    title: 'Build a print sheet',
    description: 'Open Print Sheet, then fill the sheet with one product or assign a different product to each of the eight slots.',
    Icon: Layers,
  },
  {
    number: '04',
    title: 'Print at actual size',
    description: 'Review the physical setup, then print or export a PDF. Printing from the app sends the sheet at 100% / Actual Size automatically; if you print an exported PDF yourself, choose US Letter and 100% / Actual Size.',
    Icon: Printer,
  },
]

export default function HowTo({ onNavigate }: Props): JSX.Element {
  return (
    <div className="screen">
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <p style={{ margin: '0 0 5px', color: 'var(--color-market-green)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Quick guide
          </p>
          <h1 style={{ fontSize: 24, lineHeight: 1.2, fontWeight: 700, color: 'var(--color-workbench-navy)', margin: 0 }}>
            Create and print labels in four steps
          </h1>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--color-text-secondary)', margin: '8px 0 0', maxWidth: 620 }}>
            Tillie Print keeps product data in one library, turns it into reusable labels, and places those labels precisely on a PLS780 print sheet.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14 }}>
          {steps.map(({ number, title, description, Icon }) => (
            <div key={number} className="card" style={{ padding: 20, display: 'flex', gap: 15 }}>
              <div style={{ width: 38, height: 38, borderRadius: 9, flexShrink: 0, background: '#eef8ee', color: 'var(--color-market-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em' }}>STEP {number}</span>
                  <h2 style={{ margin: 0, color: 'var(--color-workbench-navy)', fontSize: 14, fontWeight: 650 }}>{title}</h2>
                </div>
                <p style={{ margin: '7px 0 0', color: 'var(--color-text-secondary)', fontSize: 12, lineHeight: 1.55 }}>{description}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 14, marginTop: 14 }}>
          <div className="card" style={{ padding: 20 }}>
            <h2 style={{ margin: '0 0 14px', color: 'var(--color-workbench-navy)', fontSize: 14, fontWeight: 650 }}>Good to know</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {[
                'Use the Products page to search, sort, duplicate, edit, export, or delete saved labels.',
                'When reusing a partially printed sheet, set Start at slot to the first unused label.',
                'If labels drift on the paper, open Calibrate or test this sheet, print the alignment pattern, and enter the measured correction.',
                'Product editing changes one label. Reusable template creation, import, export, and deletion live in Designer.',
              ].map((tip) => (
                <div key={tip} style={{ display: 'flex', gap: 9, alignItems: 'flex-start', color: 'var(--color-text-tertiary)', fontSize: 12, lineHeight: 1.5 }}>
                  <CheckCircle2 size={14} style={{ color: 'var(--color-market-green)', marginTop: 2, flexShrink: 0 }} />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderRadius: 10, padding: 20, background: 'var(--color-warning-surface)', border: '1px solid var(--color-warning-border)' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: '#92400e' }}>
              <Lightbulb size={16} />
              <h2 style={{ margin: 0, fontSize: 14, fontWeight: 650 }}>Best print results</h2>
            </div>
            <p style={{ margin: '10px 0 0', color: '#78716c', fontSize: 12, lineHeight: 1.55 }}>
              Use Premium Label Supply PLS780 sheets. Select US Letter and <strong>100% / Actual Size</strong>. Turn off Fit to Page or Scale to Fit.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
          <button className="btn btn-primary" onClick={() => onNavigate('editor')}>
            <Tag size={14} /> Create a label <ArrowRight size={13} />
          </button>
          <button className="btn btn-outline" onClick={() => onNavigate('library')}>
            View products
          </button>
          <button className="btn btn-ghost" onClick={() => onNavigate('settings')}>
            <Settings size={14} /> Open settings
          </button>
        </div>
      </div>
    </div>
  )
}
