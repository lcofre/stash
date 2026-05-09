import { useState, useEffect } from 'react'
import { SlidersHorizontal, Plus } from 'lucide-react'
import { useProfileList } from './hooks/index.js'

function GithubIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}
import ProfileSelector from './components/ProfileSelector.jsx'
import CategoryTabs from './components/CategoryTabs.jsx'
import TodoList from './components/TodoList.jsx'
import AddTodoModal from './components/AddTodoModal.jsx'
import SettingsModal from './components/SettingsModal.jsx'

function Header({ profile, onSettings }) {
  return (
    <header style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--border-2)' }}
      className="flex items-center justify-between px-4 py-4 shrink-0">
      <div className="flex items-center gap-3">
        <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text)' }}>
          stash
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--sz-mono-xs)', color: 'var(--text-3)', letterSpacing: '0.03em' }}>
          {profile.name}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        <a
          href="https://github.com/lcofre/stash"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--text-3)', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', transition: 'color 0.15s ease', opacity: 0.5 }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-2)'; e.currentTarget.style.opacity = '1' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-3)'; e.currentTarget.style.opacity = '0.5' }}
          aria-label="GitHub repository"
        >
          <GithubIcon size={16} />
        </a>
        <button
          onClick={onSettings}
          style={{ color: 'var(--text-3)', padding: '8px', borderRadius: '8px', background: 'transparent', border: 'none', transition: 'color 0.15s ease, background 0.15s ease', cursor: 'pointer' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
          aria-label="Settings"
        >
          <SlidersHorizontal size={18} strokeWidth={1.8} />
        </button>
      </div>
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

  const profiles = useProfileList()

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
          width: '56px', height: '56px',
          background: 'var(--amber)',
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#0c0b0f',
          boxShadow: '0 4px 16px rgba(212,168,86,0.25)',
          transition: 'background 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',
          zIndex: 40,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'var(--amber-2)'
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(212,168,86,0.35)'
          e.currentTarget.style.transform = 'scale(1.05)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'var(--amber)'
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(212,168,86,0.25)'
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        <Plus size={24} strokeWidth={2.2} />
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
