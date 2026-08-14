import { LayoutGrid, Tag, Layers, PenTool, Settings, CircleHelp } from 'lucide-react'
import type { Screen } from '../App'
import logo from '../assets/logo.png'

const items: { id: Screen; label: string; Icon: typeof LayoutGrid }[] = [
  { id: 'library', label: 'Products', Icon: LayoutGrid },
  { id: 'editor', label: 'New Label', Icon: Tag },
  { id: 'sheet', label: 'Print Sheet', Icon: Layers },
  { id: 'designer', label: 'Designer', Icon: PenTool },
  { id: 'settings', label: 'Settings', Icon: Settings },
  { id: 'how-to', label: 'How to Use', Icon: CircleHelp },
]

interface Props {
  current: Screen
  onNavigate: (screen: Screen) => void
}

export default function Nav({ current, onNavigate }: Props): JSX.Element {
  return (
    <aside className="sidebar">
      {/* macOS traffic lights drag region */}
      <div className="sidebar-traffic" />

      <div className="sidebar-brand">
        <img src={logo} alt="Tillie Print logo" className="sidebar-brand-logo"/>
      </div>

      <div className="sidebar-sep" />

      <nav className="sidebar-nav" aria-label="Primary navigation">
        {items.slice(0, 4).map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`nav-item${current === id ? ' active' : ''}`}
            aria-current={current === id ? 'page' : undefined}
            title={label}
          >
            <Icon size={20} />
            {label}
          </button>
        ))}
        <div className="sidebar-nav-secondary" aria-label="Support and settings">
          {items.slice(4).map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`nav-item${current === id ? ' active' : ''}`}
              aria-current={current === id ? 'page' : undefined}
              title={label}
            >
              <Icon size={20} />
              {label}
            </button>
          ))}
        </div>
      </nav>
    </aside>
  )
}
