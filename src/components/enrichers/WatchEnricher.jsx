import { useState, useEffect, useRef } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Search, X, Star, Tv, Film } from 'lucide-react'
import { db } from '../../db/index.js'
import { searchTMDB, TMDB_IMG } from '../../api/tmdb.js'
import { searchOMDB } from '../../api/omdb.js'

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
      if (!settings?.tmdbApiKey) { setError('Add your TMDB API key in Settings to search.'); return }
      setError('')
      setSearching(true)
      try {
        const items = await searchTMDB(query, settings.tmdbApiKey)
        setResults(items)
      } catch {
        setError('Search failed. Check your TMDB API key.')
      } finally {
        setSearching(false)
      }
    }, 400)
    return () => clearTimeout(timerRef.current)
  }, [query, settings])

  async function selectResult(item) {
    let enriched = { ...item }
    if (settings?.omdbApiKey && item.tmdbId) {
      const omdb = await searchOMDB(item.title, item.year, settings.omdbApiKey).catch(() => null)
      if (omdb?.ratings) enriched.ratings = omdb.ratings
    }
    onChange(enriched)
    setQuery('')
    setResults([])
  }

  function clear() {
    onChange(null)
    setQuery('')
    setResults([])
  }

  if (value) {
    return (
      <div className="flex gap-3 p-3 bg-slate-800 rounded-xl border border-slate-700">
        {value.posterPath && (
          <img
            src={`${TMDB_IMG}${value.posterPath}`}
            alt={value.title}
            className="w-12 h-18 object-cover rounded-lg shrink-0"
            style={{ height: '4.5rem' }}
          />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-slate-100 font-medium text-sm leading-tight">{value.title}</p>
          <p className="text-slate-400 text-xs mt-0.5 flex items-center gap-2">
            {value.mediaType === 'tv' ? <Tv size={11} /> : <Film size={11} />}
            {value.mediaType === 'tv' ? 'TV Series' : 'Movie'}
            {value.year && <span>· {value.year}</span>}
          </p>
          <div className="flex flex-wrap gap-2 mt-1">
            {value.tmdbRating && (
              <span className="text-xs text-yellow-400 flex items-center gap-0.5">
                <Star size={10} fill="currentColor" /> {value.tmdbRating} TMDB
              </span>
            )}
            {value.ratings?.imdb && (
              <span className="text-xs text-yellow-300 flex items-center gap-0.5">
                <Star size={10} fill="currentColor" /> {value.ratings.imdb} IMDb
              </span>
            )}
            {value.ratings?.rottenTomatoes && (
              <span className="text-xs text-red-400">{value.ratings.rottenTomatoes} RT</span>
            )}
          </div>
        </div>
        <button onClick={clear} className="text-slate-500 hover:text-slate-300 shrink-0">
          <X size={16} />
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search movies & TV shows…"
          className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 focus:border-indigo-500 rounded-xl text-slate-100 placeholder-slate-500 text-sm transition-colors"
        />
        {searching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
        )}
      </div>
      {error && <p className="text-xs text-amber-400 px-1">{error}</p>}
      {results.length > 0 && (
        <div className="flex flex-col gap-1 max-h-64 overflow-y-auto rounded-xl border border-slate-700 bg-slate-800">
          {results.map(item => (
            <button
              key={`${item.mediaType}-${item.tmdbId}`}
              onClick={() => selectResult(item)}
              className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-700 transition-colors text-left"
            >
              {item.posterPath
                ? <img src={`${TMDB_IMG}${item.posterPath}`} alt="" className="w-8 h-12 object-cover rounded shrink-0" />
                : <div className="w-8 h-12 bg-slate-700 rounded shrink-0 flex items-center justify-center text-slate-500 text-xs">?</div>
              }
              <div className="flex-1 min-w-0">
                <p className="text-slate-100 text-sm font-medium leading-tight truncate">{item.title}</p>
                <p className="text-slate-400 text-xs flex items-center gap-1.5 mt-0.5">
                  {item.mediaType === 'tv' ? <Tv size={10} /> : <Film size={10} />}
                  {item.mediaType === 'tv' ? 'TV' : 'Movie'}
                  {item.year && <span>· {item.year}</span>}
                  {item.tmdbRating && (
                    <span className="flex items-center gap-0.5 text-yellow-400">
                      <Star size={9} fill="currentColor" /> {item.tmdbRating}
                    </span>
                  )}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
