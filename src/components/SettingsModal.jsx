import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Trash2, Plus, Eye, EyeOff, Download, Upload, UserPlus } from 'lucide-react'
import Modal from './ui/Modal.jsx'
import { db, createProfile, CATEGORY_COLORS, CATEGORY_ICONS, exportProfile, importProfile } from '../db/index.js'

const TABS = ['Categories', 'Profiles', 'API Keys', 'Data']

const label = (text) => (
  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-3)', display: 'block', marginBottom: '8px' }}>
    {text}
  </span>
)

// ── Category Manager ────────────────────────────────────────────────────────

function CategoryManager({ profileId }) {
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [newIcon, setNewIcon] = useState('📝')
  const [newColor, setNewColor] = useState(CATEGORY_COLORS[0])
  const [newType, setNewType] = useState('todo')

  const categories = useLiveQuery(
    () => db.categories.where('profileId').equals(profileId).sortBy('order'),
    [profileId]
  )

  async function addCategory() {
    if (!newName.trim()) return
    const maxOrder = Math.max(0, ...(categories?.map(c => c.order) || []))
    await db.categories.add({ profileId, name: newName.trim(), icon: newIcon, color: newColor, type: newType, order: maxOrder + 1 })
    setNewName(''); setAdding(false)
  }

  async function deleteCategory(id) {
    if (!confirm('Delete this category? All its todos will also be deleted.')) return
    await db.todos.where('categoryId').equals(id).delete()
    await db.categories.delete(id)
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
              <option value="research">Research (URLs)</option>
              <option value="buy">Buy (shopping)</option>
              <option value="custom">Custom</option>
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

// ── Profile Manager ────────────────────────────────────────────────────────

function ProfileManager({ profileId, profiles, onSwitchProfile, onProfileCreated, onClose }) {
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')

  async function handleCreate(e) {
    e.preventDefault()
    if (!newName.trim() || creating) return
    setCreating(true)
    const id = await createProfile(newName.trim())
    onProfileCreated(id)
    onClose()
  }

  async function deleteProfile(id) {
    if (profiles.length <= 1) return
    if (!confirm('Delete this profile and all its data?')) return
    await db.todos.where('profileId').equals(id).delete()
    await db.categories.where('profileId').equals(id).delete()
    await db.settings.delete(id)
    await db.profiles.delete(id)
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
    await db.profiles.update(id, { name: trimmed })
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

// ── API Keys ─────────────────────────────────────────────────────────────────

function ApiKeysManager({ profileId }) {
  const settings = useLiveQuery(() => db.settings.get(profileId), [profileId])
  const [showTmdb, setShowTmdb] = useState(false)
  const [showOmdb, setShowOmdb] = useState(false)

  async function update(field, value) {
    await db.settings.update(profileId, { [field]: value })
  }

  if (!settings) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ padding: '12px 14px', background: 'var(--amber-bg)', border: '1px solid var(--amber-border)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-3)', lineHeight: 1.6, letterSpacing: '0.02em' }}>
        keys are stored locally — never sent anywhere.
        both are optional; without them, search enrichment is disabled.
      </div>

      {[
        { key: 'tmdbApiKey', lbl: 'TMDB API key', show: showTmdb, setShow: setShowTmdb, hint: 'free at themoviedb.org — powers movie & TV search' },
        { key: 'omdbApiKey', lbl: 'OMDB API key', show: showOmdb, setShow: setShowOmdb, hint: 'free at omdbapi.com — adds IMDb & RT scores' },
      ].map(({ key, lbl, hint, show, setShow }) => (
        <div key={key}>
          {label(lbl)}
          <div style={{ position: 'relative' }}>
            <input
              type={show ? 'text' : 'password'}
              value={settings[key] || ''}
              onChange={e => update(key, e.target.value)}
              placeholder="paste your key…"
              className="field accent-focus"
              style={{ paddingRight: '42px' }}
            />
            <button type="button" onClick={() => setShow(s => !s)}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)', display: 'flex', transition: 'color 0.15s ease' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-2)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-4)'}>
              {show ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-4)', marginTop: '6px', letterSpacing: '0.03em' }}>{hint}</p>
        </div>
      ))}
    </div>
  )
}

// ── Data ──────────────────────────────────────────────────────────────────

function DataManager({ profileId }) {
  const [importing, setImporting] = useState(false)
  const [msg, setMsg] = useState('')

  async function handleExport() {
    const json = await exportProfile(profileId)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `stash-${Date.now()}.json`; a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport(e) {
    const file = e.target.files[0]
    if (!file) return
    setImporting(true)
    const reader = new FileReader()
    reader.onload = async (ev) => {
      try { await importProfile(ev.target.result); setMsg('imported. switch to it from Profiles tab.') }
      catch (err) { setMsg('import failed: ' + err.message) }
      finally { setImporting(false) }
    }
    reader.readAsText(file)
  }

  const rowStyle = { display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }
  const btnStyle = { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text-2)', fontFamily: 'var(--font-ui)', fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s ease', width: 'fit-content' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={rowStyle}>
        {label('export')}
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-4)', marginBottom: '4px', lineHeight: 1.6 }}>download all your data as json</p>
        <button onClick={handleExport} style={btnStyle}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.color = 'var(--text)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)'; }}>
          <Download size={14} /> export profile
        </button>
      </div>
      <div>
        {label('import')}
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-4)', marginBottom: '8px', lineHeight: 1.6 }}>import a stash json file — creates a new profile</p>
        <label style={{ ...btnStyle, cursor: importing ? 'default' : 'pointer', opacity: importing ? 0.5 : 1 }}
          onMouseEnter={e => { if (!importing) { e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.color = 'var(--text)'; }}}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)'; }}>
          <Upload size={14} /> {importing ? 'importing…' : 'import file'}
          <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} disabled={importing} />
        </label>
        {msg && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: msg.includes('failed') ? '#C47B7A' : '#5A9E7E', marginTop: '8px' }}>{msg}</p>}
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────

export default function SettingsModal({ profileId, profiles, onClose, onSwitchProfile, onProfileCreated }) {
  const [activeTab, setActiveTab] = useState('Categories')

  return (
    <Modal title="settings" onClose={onClose} fullscreen>
      {/* Tabs */}
      <div className="no-scrollbar" style={{
        display: 'flex', overflowX: 'auto',
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, background: 'var(--bg-2)', zIndex: 10,
        padding: '0 16px',
        flexShrink: 0,
      }}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '12px 14px', background: 'none', border: 'none',
              borderBottom: `2px solid ${activeTab === tab ? 'var(--amber)' : 'transparent'}`,
              marginBottom: '-1px',
              color: activeTab === tab ? 'var(--text)' : 'var(--text-4)',
              fontFamily: 'var(--font-ui)', fontSize: '13px',
              fontWeight: activeTab === tab ? 600 : 400,
              cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'color 0.15s ease',
              letterSpacing: '0.02em',
            }}
            onMouseEnter={e => { if (activeTab !== tab) e.currentTarget.style.color = 'var(--text-2)'; }}
            onMouseLeave={e => { if (activeTab !== tab) e.currentTarget.style.color = 'var(--text-4)'; }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{ padding: '20px' }}>
        {activeTab === 'Categories' && <CategoryManager profileId={profileId} />}
        {activeTab === 'Profiles' && <ProfileManager profileId={profileId} profiles={profiles} onSwitchProfile={onSwitchProfile} onProfileCreated={onProfileCreated} onClose={onClose} />}
        {activeTab === 'API Keys' && <ApiKeysManager profileId={profileId} />}
        {activeTab === 'Data' && <DataManager profileId={profileId} />}
      </div>
    </Modal>
  )
}
