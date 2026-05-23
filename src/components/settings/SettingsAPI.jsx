import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useSettings } from '../../hooks/index.js'
import { updateApiKey } from '../../commands/settings.js'
import { useProfileId } from '../../contexts/ProfileContext.jsx'

const label = (text) => (
  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text-3)', display: 'block', marginBottom: '8px' }}>
    {text}
  </span>
)

export default function SettingsAPI() {
  const profileId = useProfileId()
  const settings = useSettings(profileId)
  const [showTmdb, setShowTmdb] = useState(false)
  const [showOmdb, setShowOmdb] = useState(false)

  async function update(field, value) {
    await updateApiKey(profileId, field, value)
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
