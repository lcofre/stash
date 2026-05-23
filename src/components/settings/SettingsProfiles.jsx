import { useState } from 'react'
import { Trash2, UserPlus } from 'lucide-react'
import { profiles as profileCommands } from '../../commands/index.js'
import { useProfileId } from '../../contexts/ProfileContext.jsx'

export default function SettingsProfiles({ profiles, onSwitchProfile, onProfileCreated, onClose }) {
  const profileId = useProfileId()
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')

  async function handleCreate(e) {
    e.preventDefault()
    if (!newName.trim() || creating) return
    setCreating(true)
    try {
      const id = await profileCommands.createProfile(newName.trim())
      onProfileCreated(id)
      onClose()
    } finally {
      setCreating(false)
    }
  }

  async function deleteProfile(id) {
    if (profiles.length <= 1) return
    if (!confirm('Delete this profile and all its data?')) return
    await profileCommands.deleteProfile(id)
    if (id === profileId) {
      const remaining = profiles.find(p => p.id !== id)
      if (remaining) onSwitchProfile(remaining.id)
    }
  }

  async function saveProfileName(id) {
    const trimmed = editingName.trim()
    if (!trimmed) {
      setEditingId(null)
      return
    }
    await profileCommands.renameProfile(id, trimmed)
    setEditingId(null)
    setEditingName('')
  }

  function startEdit(profile) {
    setEditingId(profile.id)
    setEditingName(profile.name)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      saveProfileName(editingId)
    } else if (e.key === 'Escape') {
      setEditingId(null)
      setEditingName('')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {profiles.map(p => (
        <div key={p.id} style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '12px 14px',
          background: 'var(--bg-3)',
          border: `1px solid ${p.id === profileId ? 'var(--amber-border)' : 'var(--border)'}`,
          borderRadius: 'var(--radius)',
        }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'var(--amber-bg)', border: '1px solid var(--amber-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-ui)', fontSize: '16px', color: 'var(--amber)', flexShrink: 0,
          }}>
            {(editingId === p.id ? editingName : p.name)[0].toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            {editingId === p.id ? (
              <input
                type="text"
                value={editingName}
                onChange={e => setEditingName(e.target.value)}
                onBlur={() => saveProfileName(p.id)}
                onKeyDown={handleKeyDown}
                autoFocus
                className="field"
                style={{ fontSize: '14px', width: '100%' }}
              />
            ) : (
              <>
                <p onClick={() => startEdit(p)} style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--text)', margin: 0, cursor: 'pointer', transition: 'opacity 0.15s ease' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                  {p.name}
                </p>
                {p.id === profileId && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--amber)', margin: 0, letterSpacing: '0.05em' }}>active</p>}
              </>
            )}
          </div>
          {editingId !== p.id && (
            <>
              {p.id !== profileId && (
                <button onClick={() => { onSwitchProfile(p.id); onClose() }}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-3)', background: 'transparent', border: '1px solid var(--border)', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', transition: 'all 0.15s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--amber)'; e.currentTarget.style.borderColor = 'var(--amber-border)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-3)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
                  switch →
                </button>
              )}
              {profiles.length > 1 && (
                <button onClick={() => deleteProfile(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)', padding: '4px', transition: 'color 0.15s ease' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#C47B7A'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-4)'}>
                  <Trash2 size={14} />
                </button>
              )}
            </>
          )}
        </div>
      ))}

      <form onSubmit={handleCreate} style={{ display: 'flex', gap: '8px', paddingTop: '4px' }}>
        <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="new profile name" className="field accent-focus" style={{ flex: 1, fontSize: '14px' }} />
        <button type="submit" disabled={!newName.trim() || creating} className="btn btn-primary" style={{ padding: '0 16px', flexShrink: 0 }}>
          <UserPlus size={14} />
        </button>
      </form>
    </div>
  )
}
