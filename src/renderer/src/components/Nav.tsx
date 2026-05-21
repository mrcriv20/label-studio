import { LayoutGrid, Tag, Layers, Settings } from 'lucide-react'
import type { Screen } from '../App'

const items: { id: Screen; label: string; Icon: typeof LayoutGrid }[] = [
  { id: 'library', label: 'Products', Icon: LayoutGrid },
  { id: 'editor', label: 'New Label', Icon: Tag },
  { id: 'sheet', label: 'Print Sheet', Icon: Layers },
  { id: 'settings', label: 'Settings', Icon: Settings },
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
        <div className="sidebar-brand-name">GRAZIA'S</div>
        <div className="sidebar-brand-sub">Label Studio</div>
      </div>

      <div className="sidebar-sep" />

      <nav className="sidebar-nav">
        {items.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`nav-item${current === id ? ' active' : ''}`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  )
}
