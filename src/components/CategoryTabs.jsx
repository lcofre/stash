import { useCategoryCache } from '../contexts/CategoryContext.jsx'

export default function CategoryTabs({ profileId, activeCategoryId, onSelect }) {
  const categories = useCategoryCache()

  if (!categories) {
    return <div style={{ height: '52px', background: 'var(--bg-2)', borderBottom: '1px solid var(--border-2)' }} />
  }

  const allItems = [
    ...categories,
    { id: '__calendar__', name: 'Calendar', icon: '◫', color: 'var(--text-3)' },
  ]

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        background: 'var(--bg-2)',
        borderBottom: '1px solid var(--border-2)',
        flexShrink: 0,
        padding: '10px 12px',
      }}
    >
      {allItems.map(cat => {
        const active = cat.id === activeCategoryId
        const accentColor = typeof cat.color === 'string' && cat.color.startsWith('#') ? cat.color : 'var(--amber)'
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(active ? null : cat.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              border: active ? `1px solid ${accentColor}` : '1px solid var(--border-2)',
              borderRadius: '6px',
              background: active ? `color-mix(in oklch, ${accentColor} 12%, transparent)` : 'transparent',
              cursor: 'pointer',
              fontSize: 'var(--sz-mono-sm)',
              fontWeight: active ? 600 : 500,
              color: active ? accentColor : 'var(--text-3)',
              whiteSpace: 'nowrap',
              letterSpacing: '0.01em',
              transition: 'color 0.15s ease, border-color 0.15s ease, background 0.15s ease',
              minHeight: '32px',
            }}
            onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'var(--text-2)'; e.currentTarget.style.borderColor = 'var(--border)' } }}
            onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'var(--text-3)'; e.currentTarget.style.borderColor = 'var(--border-2)' } }}
          >
            <span style={{ fontSize: '14px', opacity: active ? 1 : 0.65 }}>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        )
      })}
    </div>
  )
}
