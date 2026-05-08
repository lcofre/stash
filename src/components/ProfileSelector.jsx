import { useState } from 'react'
import { createProfile } from '../db/index.js'

export default function ProfileSelector({ profiles, onSelect }) {
  const [name, setName] = useState('')
  const [creating, setCreating] = useState(false)

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
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 24px',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%,-50%)',
        width: '300px', height: '200px',
        background: 'radial-gradient(ellipse, rgba(201,145,62,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="anim-fade-up" style={{ width: '100%', maxWidth: '340px', position: 'relative' }}>
        {/* Wordmark */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '48px',
            fontWeight: 500,
            letterSpacing: '0.22em',
            color: 'var(--text)',
            margin: 0,
            lineHeight: 1,
          }}>
            STASH
          </h1>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-4)',
            letterSpacing: '0.14em',
            marginTop: '10px',
            textTransform: 'uppercase',
          }}>
            your personal archive
          </p>
          <div style={{ width: '32px', height: '1px', background: 'var(--amber)', opacity: 0.5, margin: '18px auto 0' }} />
        </div>

        {/* Existing profiles */}
        {profiles.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '10px',
              color: 'var(--text-4)', letterSpacing: '0.1em',
              textTransform: 'uppercase', marginBottom: '10px',
            }}>
              continue as
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {profiles.map(p => (
                <button
                  key={p.id}
                  onClick={() => onSelect(p.id)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%', padding: '12px 16px',
                    background: 'var(--bg-2)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s ease, background 0.15s ease',
                    textAlign: 'left',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-3)'; e.currentTarget.style.background = 'var(--bg-3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-2)'; }}
                >
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '15px', fontWeight: 500, color: 'var(--text)' }}>
                    {p.name}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--amber)', opacity: 0.7 }}>→</span>
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0 20px' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-4)', letterSpacing: '0.08em' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            </div>
          </div>
        )}

        {/* Create form */}
        <div>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '10px',
            color: 'var(--text-4)', letterSpacing: '0.1em',
            textTransform: 'uppercase', marginBottom: '10px',
          }}>
            {profiles.length === 0 ? 'begin' : 'new profile'}
          </p>
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
              style={{ width: '100%', padding: '13px', fontSize: '14px', letterSpacing: '0.04em' }}
            >
              {profiles.length === 0 ? 'begin your archive →' : 'create profile →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
