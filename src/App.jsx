import { useState, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Settings, Plus, Package } from 'lucide-react'
import { db } from './db/index.js'
import ProfileSelector from './components/ProfileSelector.jsx'
import CategoryTabs from './components/CategoryTabs.jsx'
import TodoList from './components/TodoList.jsx'
import AddTodoModal from './components/AddTodoModal.jsx'
import SettingsModal from './components/SettingsModal.jsx'

function Header({ profile, onSettings }) {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 shrink-0">
      <div className="flex items-center gap-2">
        <Package size={20} className="text-indigo-400" />
        <span className="font-bold text-slate-100 text-lg tracking-tight">Stash</span>
        <span className="text-slate-500 text-sm">· {profile.name}</span>
      </div>
      <button
        onClick={onSettings}
        className="p-2 text-slate-400 hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-800"
      >
        <Settings size={20} />
      </button>
    </header>
  )
}

export default function App() {
  const [activeProfileId, setActiveProfileId] = useState(
    () => { const v = localStorage.getItem('stash_profile'); return v ? Number(v) : null }
  )
  const [activeCategoryId, setActiveCategoryId] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const profiles = useLiveQuery(() => db.profiles.toArray(), [])

  useEffect(() => {
    if (activeProfileId) localStorage.setItem('stash_profile', String(activeProfileId))
  }, [activeProfileId])

  // still loading
  if (profiles === undefined) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // no profiles yet, or active profile deleted
  const activeProfile = profiles.find(p => p.id === activeProfileId)
  if (profiles.length === 0 || !activeProfile) {
    return (
      <ProfileSelector
        profiles={profiles}
        onSelect={(id) => setActiveProfileId(id)}
      />
    )
  }

  return (
    <div className="flex flex-col h-screen bg-slate-950">
      <Header profile={activeProfile} onSettings={() => setShowSettings(true)} />

      <CategoryTabs
        profileId={activeProfileId}
        activeCategoryId={activeCategoryId}
        onSelect={setActiveCategoryId}
      />

      <TodoList
        profileId={activeProfileId}
        categoryId={activeCategoryId}
      />

      {/* Floating action button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-500 hover:bg-indigo-400 active:scale-95 rounded-full shadow-lg shadow-indigo-500/30 flex items-center justify-center transition-all z-40"
        aria-label="Add item"
      >
        <Plus size={24} className="text-white" />
      </button>

      {showAddModal && (
        <AddTodoModal
          profileId={activeProfileId}
          categoryId={activeCategoryId !== '__calendar__' ? activeCategoryId : null}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {showSettings && (
        <SettingsModal
          profileId={activeProfileId}
          profiles={profiles}
          onClose={() => setShowSettings(false)}
          onSwitchProfile={(id) => { setActiveProfileId(id); setActiveCategoryId(null) }}
          onProfileCreated={(id) => { setActiveProfileId(id); setActiveCategoryId(null) }}
        />
      )}
    </div>
  )
}
