import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Trash2, Plus, GripVertical, Eye, EyeOff, Download, Upload, UserPlus, LogOut } from 'lucide-react'
import Modal from './ui/Modal.jsx'
import { db, createProfile, CATEGORY_COLORS, CATEGORY_ICONS, exportProfile, importProfile } from '../db/index.js'

const TABS = ['Categories', 'Profiles', 'API Keys', 'Data']

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
    await db.categories.add({
      profileId, name: newName.trim(), icon: newIcon,
      color: newColor, type: newType, order: maxOrder + 1,
    })
    setNewName(''); setAdding(false)
  }

  async function deleteCategory(id) {
    if (!confirm('Delete this category? All its todos will also be deleted.')) return
    await db.todos.where('categoryId').equals(id).delete()
    await db.categories.delete(id)
  }

  return (
    <div className="flex flex-col gap-3">
      {(categories || []).map((cat, i) => (
        <div key={cat.id} className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl border border-slate-700">
          <span className="text-xl">{cat.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-100">{cat.name}</p>
            <p className="text-xs text-slate-500 capitalize">{cat.type}</p>
          </div>
          <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
          <button
            onClick={() => deleteCategory(cat.id)}
            className="text-slate-600 hover:text-red-400 transition-colors p-1"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}

      {adding ? (
        <div className="flex flex-col gap-3 p-4 bg-slate-800 rounded-xl border border-indigo-500/50">
          <div className="flex gap-3">
            {/* Icon picker */}
            <div className="flex flex-wrap gap-1 max-w-[180px]">
              {CATEGORY_ICONS.map(ic => (
                <button key={ic} onClick={() => setNewIcon(ic)}
                  className={`text-lg p-1 rounded transition-all ${newIcon === ic ? 'bg-slate-600 scale-110' : 'hover:bg-slate-700'}`}>
                  {ic}
                </button>
              ))}
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Category name"
                autoFocus
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 focus:border-indigo-500 rounded-lg text-slate-100 placeholder-slate-500 text-sm"
              />
              <select
                value={newType}
                onChange={e => setNewType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 text-sm"
              >
                <option value="todo">General todo</option>
                <option value="watch">Watch (movies/TV)</option>
                <option value="read">Read (books)</option>
                <option value="research">Research (URLs)</option>
                <option value="buy">Buy (shopping)</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>
          {/* Color picker */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORY_COLORS.map(c => (
              <button key={c} onClick={() => setNewColor(c)}
                className={`w-6 h-6 rounded-full transition-transform ${newColor === c ? 'ring-2 ring-white ring-offset-1 ring-offset-slate-800 scale-110' : ''}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setAdding(false)}
              className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 text-sm transition-colors">
              Cancel
            </button>
            <button onClick={addCategory} disabled={!newName.trim()}
              className="flex-1 py-2 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 rounded-lg text-white text-sm font-semibold transition-colors">
              Add
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)}
          className="flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-700 hover:border-slate-500 rounded-xl text-slate-500 hover:text-slate-300 text-sm transition-colors">
          <Plus size={16} /> New category
        </button>
      )}
    </div>
  )
}

// ── Profile Manager ────────────────────────────────────────────────────────

function ProfileManager({ profileId, profiles, onSwitchProfile, onProfileCreated, onClose }) {
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)

  async function handleCreate(e) {
    e.preventDefault()
    if (!newName.trim()) return
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

  return (
    <div className="flex flex-col gap-3">
      {profiles.map(p => (
        <div key={p.id} className={`flex items-center gap-3 p-3 bg-slate-800 rounded-xl border ${p.id === profileId ? 'border-indigo-500' : 'border-slate-700'}`}>
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-sm font-bold text-indigo-300 shrink-0">
            {p.name[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-100">{p.name}</p>
            {p.id === profileId && <p className="text-xs text-indigo-400">Active</p>}
          </div>
          {p.id !== profileId && (
            <button onClick={() => { onSwitchProfile(p.id); onClose() }}
              className="text-xs text-indigo-400 hover:text-indigo-300 px-2 py-1 bg-indigo-500/10 rounded-lg transition-colors">
              Switch
            </button>
          )}
          {profiles.length > 1 && (
            <button onClick={() => deleteProfile(p.id)} className="text-slate-600 hover:text-red-400 transition-colors p-1">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      ))}

      <form onSubmit={handleCreate} className="flex gap-2 pt-2">
        <input
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder="New profile name"
          className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 focus:border-indigo-500 rounded-xl text-slate-100 placeholder-slate-500 text-sm transition-colors"
        />
        <button type="submit" disabled={!newName.trim() || creating}
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 rounded-xl text-white text-sm font-semibold transition-colors flex items-center gap-1.5">
          <UserPlus size={14} /> Add
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
    <div className="flex flex-col gap-5">
      <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 leading-relaxed">
        API keys are stored locally on your device and never sent to any server.
        Both keys are optional — without them, search enrichment is disabled.
      </div>

      {[
        {
          key: 'tmdbApiKey', label: 'TMDB API Key', show: showTmdb, setShow: setShowTmdb,
          hint: 'Free at themoviedb.org — powers movie & TV search',
        },
        {
          key: 'omdbApiKey', label: 'OMDB API Key', show: showOmdb, setShow: setShowOmdb,
          hint: 'Free at omdbapi.com — adds IMDb & Rotten Tomatoes scores',
        },
      ].map(({ key, label, hint, show, setShow }) => (
        <div key={key}>
          <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">{label}</label>
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              value={settings[key] || ''}
              onChange={e => update(key, e.target.value)}
              placeholder="Paste your API key…"
              className="w-full px-4 pr-10 py-2.5 bg-slate-800 border border-slate-700 focus:border-indigo-500 rounded-xl text-slate-100 placeholder-slate-500 text-sm transition-colors"
            />
            <button type="button" onClick={() => setShow(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <p className="text-xs text-slate-600 mt-1.5">{hint}</p>
        </div>
      ))}
    </div>
  )
}

// ── Data Export/Import ────────────────────────────────────────────────────

function DataManager({ profileId }) {
  const [importing, setImporting] = useState(false)
  const [msg, setMsg] = useState('')

  async function handleExport() {
    const json = await exportProfile(profileId)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `stash-export-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport(e) {
    const file = e.target.files[0]
    if (!file) return
    setImporting(true)
    const reader = new FileReader()
    reader.onload = async (ev) => {
      try {
        await importProfile(ev.target.result)
        setMsg('Profile imported successfully! Switch to it from the Profiles tab.')
      } catch (err) {
        setMsg('Import failed: ' + err.message)
      } finally {
        setImporting(false)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-medium text-slate-200 mb-1">Export your data</p>
        <p className="text-xs text-slate-500 mb-3">Download all your todos and categories as a JSON file. Use this to back up or transfer to another device.</p>
        <button onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-200 text-sm font-medium transition-colors">
          <Download size={16} /> Export profile
        </button>
      </div>
      <div className="border-t border-slate-800 pt-4">
        <p className="text-sm font-medium text-slate-200 mb-1">Import a profile</p>
        <p className="text-xs text-slate-500 mb-3">Import a previously exported Stash JSON file. Creates a new profile.</p>
        <label className={`flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-200 text-sm font-medium transition-colors cursor-pointer ${importing ? 'opacity-50' : ''}`}>
          <Upload size={16} /> {importing ? 'Importing…' : 'Import file'}
          <input type="file" accept=".json" onChange={handleImport} className="hidden" disabled={importing} />
        </label>
        {msg && <p className={`text-xs mt-2 ${msg.includes('failed') ? 'text-red-400' : 'text-emerald-400'}`}>{msg}</p>}
      </div>
    </div>
  )
}

// ── Main Settings Modal ───────────────────────────────────────────────────

export default function SettingsModal({ profileId, profiles, onClose, onSwitchProfile, onProfileCreated }) {
  const [activeTab, setActiveTab] = useState('Categories')

  return (
    <Modal title="Settings" onClose={onClose} fullscreen>
      <div className="flex border-b border-slate-800 px-1 overflow-x-auto no-scrollbar shrink-0 sticky top-0 bg-slate-900 z-10">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px
              ${activeTab === tab ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="p-5">
        {activeTab === 'Categories' && <CategoryManager profileId={profileId} />}
        {activeTab === 'Profiles' && (
          <ProfileManager
            profileId={profileId} profiles={profiles}
            onSwitchProfile={onSwitchProfile} onProfileCreated={onProfileCreated} onClose={onClose}
          />
        )}
        {activeTab === 'API Keys' && <ApiKeysManager profileId={profileId} />}
        {activeTab === 'Data' && <DataManager profileId={profileId} />}
      </div>
    </Modal>
  )
}
