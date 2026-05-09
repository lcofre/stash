const monoSm = { fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-3)', letterSpacing: '0.03em' }

export const MetadataRenderer = {
  watch: WatchMetadataRenderer,
  read: ReadMetadataRenderer,
  todo: TodoMetadataRenderer,
}

function WatchMetadataRenderer({ metadata }) {
  if (!metadata) return null

  const posterPath = metadata.posterPath
  const TMDB_IMG = 'https://image.tmdb.org/t/p/w185'

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
      {posterPath && (
        <img
          src={`${TMDB_IMG}${posterPath}`}
          alt=""
          style={{ width: '28px', height: '42px', objectFit: 'cover', borderRadius: '3px', flexShrink: 0 }}
        />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ ...monoSm }}>
          {metadata.mediaType === 'tv' ? 'series' : 'film'}
          {metadata.year ? ` · ${metadata.year}` : ''}
          {metadata.tmdbRating ? ` · ★ ${metadata.tmdbRating}` : ''}
          {metadata.ratings?.imdb ? ` · ${metadata.ratings.imdb} imdb` : ''}
        </p>
      </div>
    </div>
  )
}

function ReadMetadataRenderer({ metadata }) {
  if (!metadata) return null

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
      {metadata.coverUrl && (
        <img
          src={metadata.coverUrl}
          alt=""
          style={{ width: '28px', height: '42px', objectFit: 'cover', borderRadius: '3px', flexShrink: 0 }}
        />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ ...monoSm }}>
          {metadata.authors ? `${metadata.authors} · ` : ''}
          {metadata.publishedYear ? `${metadata.publishedYear}` : ''}
          {metadata.pageCount ? ` · ${metadata.pageCount}p` : ''}
        </p>
      </div>
    </div>
  )
}

function TodoMetadataRenderer({ metadata }) {
  if (!metadata) return null
  return null
}

export function getRenderer(categoryType) {
  return MetadataRenderer[categoryType] || TodoMetadataRenderer
}
