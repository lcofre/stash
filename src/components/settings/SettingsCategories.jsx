import { useState } from 'react'
import { Trash2, Plus } from 'lucide-react'
import { useCategories } from '../../hooks/index.js'
import { categories as categoryCommands } from '../../commands/index.js'
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../../db/index.js'
import { useProfileId } from '../../contexts/ProfileContext.jsx'

const label = (text) => (
  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-3)', display: 'block', marginBottom: '8px' }}>
    {text}
  </span>
)

export default function SettingsCategories() {
  const profileId = useProfileId()
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [newIcon, setNewIcon] = useState('📝')
  const [newColor, setNewColor] = useState(CATEGORY_COLORS[0])
  const [newType, setNewType] = useState('todo')

  const categories = useCategories(profileId)

  async function addCategory() {
    if (!newName.trim()) return
    await categoryCommands.createCategory({
      profileId,
      name: newName.trim(),
      icon: newIcon,
      color: newColor,
      type: newType,
    })
    setNewName('')
    setAdding(false)
  }

  async function deleteCategory(id) {
    if (!confirm('Delete this category? All its todos will also be deleted.')) return
    await categoryCommands.deleteCategory(id)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {(categories || []).map(cat => (
        <div key={cat.id} style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '11px 14px',
          background: 'var(--bg-3)', border: '1px solid var(--border)',
          borderLeft: `3px solid ${cat.color}`,
          borderRadius: 'var(--radius)',
        }}>
          <span style={{ fontSize: '18px' }}>{cat.icon}</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--text)', margin: 0 }}>{cat.name}</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-4)', margin: 0, letterSpacing: '0.05em' }}>{cat.type}</p>
          </div>
          <button onClick={() => deleteCategory(cat.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)', padding: '4px', transition: 'color 0.15s ease' }}
            onMouseEnter={e => e.currentTarget.style.color = '#C47B7A'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-4)'}>
            <Trash2 size={14} />
          </button>
        </div>
      ))}

      {adding ? (
        <div style={{ padding: '14px', background: 'var(--bg-3)', border: '1px solid var(--border-2)', borderRadius: 'var(--radius)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              {label('name')}
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Category name" autoFocus className="field accent-focus" style={{ fontSize: '14px' }} />
            </div>
          </div>
          <div>
            {label('type')}
            <select value={newType} onChange={e => setNewType(e.target.value)}
              className="field"
              style={{ cursor: 'pointer' }}>
              <option value="todo">General todo</option>
              <option value="watch">Watch (movies/TV)</option>
              <option value="read">Read (books)</option>
            </select>
          </div>
          <div>
            {label('icon')}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {CATEGORY_ICONS.map(ic => (
                <button key={ic} type="button" onClick={() => setNewIcon(ic)}
                  style={{
                    fontSize: '18px', padding: '5px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                    background: newIcon === ic ? 'var(--bg-5)' : 'transparent',
                    transform: newIcon === ic ? 'scale(1.15)' : 'none',
                    transition: 'all 0.12s ease',
                  }}>
                  {ic}
                </button>
              ))}
            </div>
          </div>
          <div>
            {label('color')}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {CATEGORY_COLORS.map(c => (
                <button key={c} type="button" onClick={() => setNewColor(c)}
                  style={{
                    width: '24px', height: '24px', borderRadius: '50%', border: 'none', cursor: 'pointer',
                    background: c,
                    outline: newColor === c ? `2px solid ${c}` : 'none',
                    outlineOffset: '2px',
                    transform: newColor === c ? 'scale(1.12)' : 'none',
                    transition: 'all 0.12s ease',
                  }} />
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setAdding(false)} className="btn btn-ghost" style={{ flex: 1, fontSize: '13px', padding: '9px' }}>cancel</button>
            <button onClick={addCategory} disabled={!newName.trim()} className="btn btn-primary" style={{ flex: 1, fontSize: '13px', padding: '9px' }}>add →</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            padding: '11px', background: 'transparent',
            border: '1px dashed var(--border-2)', borderRadius: 'var(--radius)',
            color: 'var(--text-4)', fontFamily: 'var(--font-ui)', fontSize: '13px',
            cursor: 'pointer', transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-3)'; e.currentTarget.style.color = 'var(--text-2)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.color = 'var(--text-4)'; }}>
          <Plus size={14} /> new category
        </button>
      )}
    </div>
  )
}
