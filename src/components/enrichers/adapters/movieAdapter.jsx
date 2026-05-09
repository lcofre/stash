import { searchTMDB, searchOMDB, TMDB_IMG } from '../../../api/tmdb.js'

const monoSm = { fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-3)', letterSpacing: '0.03em' }

export const movieAdapter = {
  placeholder: 'search movies & TV shows…',

  async search(query, { tmdbApiKey }) {
    if (!tmdbApiKey) {
      throw new Error('Add a TMDB key in Settings → API Keys to search.')
    }
    return searchTMDB(query, tmdbApiKey)
  },

  resultKey: (item) => `${item.mediaType}-${item.tmdbId}`,

  displayResult: (item) => (
    <>
      {item.posterPath ? (
        <img
          src={`${TMDB_IMG}${item.posterPath}`}
          alt=""
          style={{ width: '32px', height: '48px', objectFit: 'cover', borderRadius: '3px', flexShrink: 0 }}
        />
      ) : (
        <div style={{ width: '32px', height: '48px', background: 'var(--bg-5)', borderRadius: '3px', flexShrink: 0 }} />
      )}
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
    </>
  ),

  displaySelected: (item) => (
    <>
      {item.posterPath && (
        <img
          src={`${TMDB_IMG}${item.posterPath}`}
          alt=""
          style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0, border: '1px solid var(--border)' }}
        />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '16px', fontWeight: 500, color: 'var(--text)', lineHeight: 1.2 }}>
          {item.title}
        </p>
        <p style={{ ...monoSm, marginTop: '4px' }}>
          {item.mediaType === 'tv' ? 'series' : 'film'}
          {item.year ? ` · ${item.year}` : ''}
          {item.tmdbRating ? ` · ★ ${item.tmdbRating}` : ''}
          {item.ratings?.imdb ? ` · ${item.ratings.imdb} imdb` : ''}
        </p>
      </div>
    </>
  ),

  async onSelect(item, { omdbApiKey }) {
    let enriched = { ...item }
    if (omdbApiKey && item.title) {
      const omdb = await searchOMDB(item.title, item.year, omdbApiKey).catch(() => null)
      if (omdb?.ratings) enriched.ratings = omdb.ratings
    }
    return enriched
  },
}
