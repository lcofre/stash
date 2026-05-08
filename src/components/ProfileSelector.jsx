import { useState } from 'react'
import { createProfile } from '../db/index.js'

function ProfileRow({ profile, onSelect }) {
  return (
    <button
      onClick={onSelect}
      style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        width: '100%', padding: '12px 14px',
        background: 'var(--bg-2)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        cursor: 'pointer',
        transition: 'border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease',
        textAlign: 'left',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--amber-border)'
        e.currentTarget.style.background = 'rgba(201,145,62,0.04)'
        e.currentTarget.style.boxShadow = '0 0 24px rgba(201,145,62,0.09)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.background = 'var(--bg-2)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{
        width: '32px', height: '32px', borderRadius: '50%',
        background: 'var(--amber-bg)',
        border: '1px solid var(--amber-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)', fontSize: '16px',
        color: 'var(--amber)', flexShrink: 0, fontWeight: 500,
        lineHeight: 1,
      }}>
        {profile.name[0].toUpperCase()}
      </div>
      <span style={{ flex: 1, fontFamily: 'var(--font-ui)', fontSize: '15px', fontWeight: 500, color: 'var(--text)' }}>
        {profile.name}
      </span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--amber)', opacity: 0.55 }}>→</span>
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

      {/* Amber light source from above */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        top: 0, left: '50%',
        width: '900px', height: '560px',
        transform: 'translateX(-50%)',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(201,145,62,0.10) 0%, transparent 62%)',
        pointerEvents: 'none',
      }} />

      <div className="anim-fade-up" style={{ width: '100%', maxWidth: '360px', position: 'relative', zIndex: 1 }}>

        {/* ── Hero ── */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>

          {/* Top ornament rule */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '30px' }}>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(201,145,62,0.32))' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--amber)', opacity: 0.45 }}>◈</span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, rgba(201,145,62,0.32))' }} />
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '80px',
            fontWeight: 500,
            letterSpacing: '0.32em',
            paddingLeft: '0.32em', /* optical centering with letter-spacing */
            color: 'var(--text)',
            margin: '0 0 18px',
            lineHeight: 1,
            textShadow: '0 0 60px rgba(201,145,62,0.22), 0 2px 40px rgba(201,145,62,0.08)',
          }}>
            STASH
          </h1>

          <p style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: '15px',
            color: 'var(--text-3)',
            margin: 0,
            letterSpacing: '0.03em',
          }}>
            a private archive
          </p>

          {/* Bottom ornament rule */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '30px' }}>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, var(--border-2))' }} />
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, var(--border-2))' }} />
          </div>
        </div>

        {/* ── Existing profiles ── */}
        {profiles.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <span style={sectionLabel}>continue as</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {profiles.map(p => (
                <ProfileRow key={p.id} profile={p} onSelect={() => onSelect(p.id)} />
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0 20px' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-4)', letterSpacing: '0.08em' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            </div>
          </div>
        )}

        {/* ── Create form ── */}
        <div>
          <span style={sectionLabel}>
            {isFirst ? 'create your archive' : 'new profile'}
          </span>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="your name or nickname"
              className="field accent-focus"
              style={{ fontSize: '15px', padding: '13px 16px' }}
              autoFocus
            />
            <button
              type="submit"
              disabled={!name.trim() || creating}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '14px', letterSpacing: '0.06em' }}
            >
              {isFirst ? 'begin your archive →' : 'create profile →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
