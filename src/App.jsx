import { useState, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { SlidersHorizontal, Plus } from 'lucide-react'
import { db } from './db/index.js'
import ProfileSelector from './components/ProfileSelector.jsx'
import CategoryTabs from './components/CategoryTabs.jsx'
import TodoList from './components/TodoList.jsx'
import AddTodoModal from './components/AddTodoModal.jsx'
import SettingsModal from './components/SettingsModal.jsx'

function Header({ profile, onSettings }) {
  return (
    <header style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--border)' }}
      className="flex items-center justify-between px-5 py-3.5 shrink-0">
      <div className="flex items-baseline gap-2.5">
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 500, letterSpacing: '0.08em', color: 'var(--text)', lineHeight: 1 }}>
          STASH
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--amber)', opacity: 0.45, letterSpacing: '0.02em' }}>·</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--amber)', opacity: 0.55, letterSpacing: '0.04em' }}>
          {profile.name}
        </span>
      </div>
      <button
        onClick={onSettings}
        style={{ color: 'var(--text-3)', padding: '6px', borderRadius: '8px', background: 'transparent', border: 'none', transition: 'color 0.15s ease', cursor: 'pointer' }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
        aria-label="Settings"
      >
        <SlidersHorizontal size={18} />
      </button>
    </header>
  )
}

function LoadingScreen() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '28px', height: '28px', border: '1.5px solid var(--amber)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
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

  if (profiles === undefined) return <LoadingScreen />

  const activeProfile = profiles.find(p => p.id === activeProfileId)
  if (profiles.length === 0 || !activeProfile) {
    return <ProfileSelector profiles={profiles} onSelect={setActiveProfileId} />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg)' }}>
      <Header profile={activeProfile} onSettings={() => setShowSettings(true)} />

      <CategoryTabs
        profileId={activeProfileId}
        activeCategoryId={activeCategoryId}
        onSelect={setActiveCategoryId}
      />

      <TodoList
        profileId={activeProfileId}
        categoryId={activeCategoryId}
        onAdd={() => setShowAddModal(true)}
      />

      {/* FAB */}
      <button
        onClick={() => setShowAddModal(true)}
        aria-label="Add item"
        style={{
          position: 'fixed', bottom: '24px', right: '22px',
          width: '52px', height: '52px',
          background: 'var(--amber)',
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#0c0b0f',
          boxShadow: '0 2px 12px rgba(201,145,62,0.35)',
          transition: 'background 0.15s ease, box-shadow 0.15s ease',
          zIndex: 40,
          animation: 'fab-breathe 3s ease-in-out infinite',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'var(--amber-2)'
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(201,145,62,0.55)'
          e.currentTarget.style.animation = 'none'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'var(--amber)'
          e.currentTarget.style.boxShadow = '0 2px 12px rgba(201,145,62,0.35)'
          e.currentTarget.style.animation = 'fab-breathe 3s ease-in-out infinite'
        }}
      >
        <Plus size={22} strokeWidth={2.5} />
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
