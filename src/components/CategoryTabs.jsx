import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/index.js'

export default function CategoryTabs({ profileId, activeCategoryId, onSelect }) {
  const categories = useLiveQuery(
    () => db.categories.where('profileId').equals(profileId).sortBy('order'),
    [profileId]
  )

  if (!categories) {
    return <div style={{ height: '48px', background: 'var(--bg-2)', borderBottom: '1px solid var(--border-2)' }} />
  }

  const allItems = [
    ...categories,
    { id: '__calendar__', name: 'Calendar', icon: '◫', color: 'var(--text-3)' },
  ]

  return (
    <div
      className="no-scrollbar"
      style={{
        display: 'flex',
        gap: 0,
        overflowX: 'auto',
        background: 'var(--bg-2)',
        borderBottom: '1px solid var(--border-2)',
        flexShrink: 0,
        padding: '0 12px',
      }}
    >
      {allItems.map(cat => {
        const active = cat.id === activeCategoryId
        const color = typeof cat.color === 'string' && cat.color.startsWith('#') ? cat.color : 'var(--text-3)'
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(active ? null : cat.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 14px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: 'var(--sz-mono-sm)',
              fontWeight: active ? 600 : 500,
              color: active ? 'var(--text)' : 'var(--text-3)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              position: 'relative',
              letterSpacing: '0.01em',
              transition: 'color 0.15s ease',
              borderBottom: active ? `2.5px solid ${color}` : '2.5px solid transparent',
              marginBottom: '-1px',
              paddingBottom: 'calc(12px - 1.5px)',
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--text-2)' }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--text-3)' }}
          >
            <span style={{ fontSize: '16px', opacity: active ? 1 : 0.65 }}>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        )
      })}
    </div>
  )
}
