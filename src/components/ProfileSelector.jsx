import { useState } from 'react'
import { createProfile } from '../commands/profiles.js'

function ProfileRow({ profile, onSelect }) {
  return (
    <button
      onClick={onSelect}
      style={{
        display: 'flex', alignItems: 'center', gap: '14px',
        width: '100%', padding: '14px 16px',
        background: 'var(--bg-2)',
        border: '1px solid var(--border-2)',
        borderRadius: 'var(--radius)',
        cursor: 'pointer',
        transition: 'border-color 0.15s ease, background 0.15s ease',
        textAlign: 'left',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--border-3)'
        e.currentTarget.style.background = 'var(--bg-3)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border-2)'
        e.currentTarget.style.background = 'var(--bg-2)'
      }}
    >
      <div style={{
        width: '36px', height: '36px', borderRadius: '50%',
        background: 'var(--amber-bg)',
        border: '1px solid var(--amber-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-ui)', fontSize: '16px',
        color: 'var(--amber)', flexShrink: 0, fontWeight: 600,
        lineHeight: 1,
      }}>
        {profile.name[0].toUpperCase()}
      </div>
      <span style={{ flex: 1, fontFamily: 'var(--font-ui)', fontSize: '15px', fontWeight: 500, color: 'var(--text)' }}>
        {profile.name}
      </span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--sz-mono-xs)', color: 'var(--text-3)', opacity: 0.6 }}>→</span>
    </button>
  )
}

const sectionLabel = {
  display: 'block',
  fontFamily: 'var(--font-mono)', fontSize: '10px',
  color: 'var(--text-4)', letterSpacing: '0.14em',
  textTransform: 'uppercase', marginBottom: '10px',
}

export default function ProfileSelector({ profiles, onSelect }) {
  const [name, setName] = useState('')
  const [creating, setCreating] = useState(false)
  const isFirst = profiles.length === 0

  async function handleCreate(e) {
    e.preventDefault()
    if (!name.trim() || creating) return
    setCreating(true)
    const id = await createProfile(name.trim())
    onSelect(id)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>

      <div className="anim-fade-up" style={{ width: '100%', maxWidth: '360px' }}>

        {/* ── Hero ── */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '42px',
            fontWeight: 700,
            letterSpacing: '0.02em',
            color: 'var(--text)',
            margin: '0 0 12px',
            lineHeight: 1.1,
          }}>
            stash
          </h1>
          <p style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--sz-mono-xs)',
            color: 'var(--text-3)',
            margin: 0,
            letterSpacing: '0.03em',
          }}>
            your private archive
          </p>
        </div>

        {/* ── Existing profiles ── */}
        {profiles.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <span style={sectionLabel}>continue as</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {profiles.map(p => (
                <ProfileRow key={p.id} profile={p} onSelect={() => onSelect(p.id)} />
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-2)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--sz-mono-xs)', color: 'var(--text-4)', letterSpacing: '0.04em' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-2)' }} />
            </div>
          </div>
        )}

        {/* ── Create form ── */}
        <div>
          <span style={sectionLabel}>
            {isFirst ? 'create your archive' : 'new profile'}
          </span>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="your name or nickname"
              className="field accent-focus"
              style={{ fontSize: '16px', padding: '13px 16px' }}
              autoFocus
            />
            <button
              type="submit"
              disabled={!name.trim() || creating}
              className="btn btn-primary"
              style={{ width: '100%', padding: '13px', fontSize: '14px', letterSpacing: '0.04em', fontWeight: 600 }}
            >
              {isFirst ? 'create archive' : 'create profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
