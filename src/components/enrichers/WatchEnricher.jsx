import { useState, useEffect, useRef } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { X } from 'lucide-react'
import { db } from '../../db/index.js'
import { searchTMDB, TMDB_IMG } from '../../api/tmdb.js'
import { searchOMDB } from '../../api/omdb.js'

const monoSm = { fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-3)', letterSpacing: '0.03em' }

export default function WatchEnricher({ profileId, value, onChange }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')
  const timerRef = useRef(null)

  const settings = useLiveQuery(() => db.settings.get(profileId), [profileId])

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      if (!settings?.tmdbApiKey) { setError('Add a TMDB key in Settings → API Keys to search.'); return }
      setError('')
      setSearching(true)
      try {
        const items = await searchTMDB(query, settings.tmdbApiKey)
        setResults(items)
      } catch { setError('Search failed — check your TMDB key.') }
      finally { setSearching(false) }
    }, 380)
    return () => clearTimeout(timerRef.current)
  }, [query, settings])

  async function selectResult(item) {
    let enriched = { ...item }
    if (settings?.omdbApiKey && item.title) {
      const omdb = await searchOMDB(item.title, item.year, settings.omdbApiKey).catch(() => null)
      if (omdb?.ratings) enriched.ratings = omdb.ratings
    }
    onChange(enriched)
    setQuery('')
    setResults([])
  }

  if (value) {
    return (
      <div style={{
        display: 'flex', gap: '12px', padding: '12px',
        background: 'var(--bg-3)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
      }}>
        {value.posterPath && (
          <img
            src={`${TMDB_IMG}${value.posterPath}`}
            alt=""
            style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0, border: '1px solid var(--border)' }}
          />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 500, color: 'var(--text)', lineHeight: 1.2 }}>
            {value.title}
          </p>
          <p style={{ ...monoSm, marginTop: '4px' }}>
            {value.mediaType === 'tv' ? 'series' : 'film'}
            {value.year ? ` · ${value.year}` : ''}
            {value.tmdbRating ? ` · ★ ${value.tmdbRating}` : ''}
            {value.ratings?.imdb ? ` · ${value.ratings.imdb} imdb` : ''}
          </p>
        </div>
        <button onClick={() => onChange(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)', alignSelf: 'flex-start', padding: '2px', flexShrink: 0 }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-4)'}>
          <X size={15} />
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ position: 'relative' }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="search movies & TV shows…"
          className="field accent-focus"
        />
        {searching && (
          <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', border: '1.5px solid var(--amber)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        )}
        <style>{`@keyframes spin { to { transform: translateY(-50%) rotate(360deg); } }`}</style>
      </div>
      {error && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--amber)', opacity: 0.8 }}>{error}</p>}
      {results.length > 0 && (
        <div style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', maxHeight: '260px', overflowY: 'auto' }}>
          {results.map(item => (
            <button
              key={`${item.mediaType}-${item.tmdbId}`}
              onClick={() => selectResult(item)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
                padding: '10px 12px', background: 'transparent', border: 'none',
                borderBottom: '1px solid var(--border)', cursor: 'pointer',
                textAlign: 'left', transition: 'background 0.12s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-4)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {item.posterPath
                ? <img src={`${TMDB_IMG}${item.posterPath}`} alt="" style={{ width: '32px', height: '48px', objectFit: 'cover', borderRadius: '3px', flexShrink: 0 }} />
                : <div style={{ width: '32px', height: '48px', background: 'var(--bg-5)', borderRadius: '3px', flexShrink: 0 }} />
              }
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.title}
                </p>
                <p style={{ ...monoSm, marginTop: '3px' }}>
                  {item.mediaType === 'tv' ? 'series' : 'film'}
                  {item.year ? ` · ${item.year}` : ''}
                  {item.tmdbRating ? ` · ★ ${item.tmdbRating}` : ''}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
