import { TMDB_IMG } from '../api/tmdb.js'

function Ratings({ metadata }) {
  const items = []
  if (metadata?.tmdbRating) items.push({ label: 'TMDB', val: metadata.tmdbRating })
  if (metadata?.ratings?.imdb) items.push({ label: 'IMDb', val: metadata.ratings.imdb })
  if (metadata?.ratings?.rottenTomatoes) items.push({ label: 'RT', val: metadata.ratings.rottenTomatoes })
  if (!items.length) return null
  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '6px' }}>
      {items.map(({ label, val }) => (
        <span key={label} style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--sz-mono-xs)', color: 'var(--text-3)', letterSpacing: '0.03em' }}>
          <span style={{ color: 'var(--amber)', opacity: 0.8 }}>★</span>{' '}
          <span style={{ color: 'var(--text-2)' }}>{val}</span>
          <span style={{ color: 'var(--text-4)', marginLeft: '3px' }}>{label}</span>
        </span>
      ))}
    </div>
  )
}

export default function ContentRenderer({ todo, category }) {
  const m = todo.metadata
  const hasMedia = m?.mediaType
  const hasBook = m?.googleId

  if (hasMedia) {
    return (
      <div style={{ display: 'flex', gap: '14px' }}>
        {m?.posterPath && (
          <div style={{ flexShrink: 0, width: '48px', height: '72px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-2)' }}>
            <img src={`${TMDB_IMG}${m.posterPath}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontFamily: 'var(--font-ui)', fontSize: '16px', fontWeight: 600,
            color: todo.done ? 'var(--text-3)' : 'var(--text)',
            lineHeight: 1.25, letterSpacing: '0.01em',
            textDecoration: todo.done ? 'line-through' : 'none',
          }}>
            {todo.title}
            {m?.year && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--sz-mono-xs)', color: 'var(--text-4)', marginLeft: '8px', fontWeight: 500, fontStyle: 'normal' }}>
                {m.year}
              </span>
            )}
          </p>
          {m && (
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--sz-mono-xs)', color: 'var(--text-3)', marginTop: '6px', letterSpacing: '0.02em' }}>
              {m.mediaType === 'tv' ? 'series' : 'film'}
              {m.genres?.length ? ' · ' + m.genres.join(', ') : ''}
            </p>
          )}
          <Ratings metadata={m} />
        </div>
      </div>
    )
  }

  if (hasBook) {
    return (
      <div style={{ display: 'flex', gap: '14px' }}>
        {m?.coverUrl && (
          <div style={{ flexShrink: 0, width: '48px', height: '72px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-2)' }}>
            <img src={m.coverUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontFamily: 'var(--font-ui)', fontSize: '16px', fontWeight: 600,
            color: todo.done ? 'var(--text-3)' : 'var(--text)',
            lineHeight: 1.25,
            textDecoration: todo.done ? 'line-through' : 'none',
          }}>
            {todo.title}
          </p>
          {m?.authors && (
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--sz-mono-xs)', color: 'var(--text-3)', marginTop: '6px' }}>
              {m.authors}
              {m.publishedYear && <span style={{ fontFamily: 'var(--font-mono)', marginLeft: '8px', fontSize: 'var(--sz-mono-xs)', color: 'var(--text-4)' }}>{m.publishedYear}</span>}
              {m.pageCount && <span style={{ fontFamily: 'var(--font-mono)', marginLeft: '8px', fontSize: 'var(--sz-mono-xs)', color: 'var(--text-4)' }}>{m.pageCount}p</span>}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <p style={{
      fontFamily: 'var(--font-ui)', fontSize: '16px', fontWeight: 500,
      color: todo.done ? 'var(--text-3)' : 'var(--text)',
      lineHeight: 1.4,
      textDecoration: todo.done ? 'line-through' : 'none',
    }}>
      {todo.title}
    </p>
  )
}
