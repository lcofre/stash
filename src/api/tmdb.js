import { APIError, parseAPIError } from './errors.js'

const BASE = 'https://api.themoviedb.org/3'
export const TMDB_IMG = 'https://image.tmdb.org/t/p/w185'

export async function searchTMDB(query, apiKey) {
  if (!apiKey) throw new APIError('auth', 'NO_KEY', 'TMDB API key not configured')
  if (!query.trim()) return []

  let res
  try {
    res = await fetch(
      `${BASE}/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`
    )
  } catch (error) {
    const apiError = parseAPIError(error, null)
    throw apiError
  }

  const err = parseAPIError(null, res)
  if (err) throw err

  const data = await res.json()
  return (data.results || [])
    .filter(r => r.media_type === 'movie' || r.media_type === 'tv')
    .slice(0, 8)
    .map(r => ({
      tmdbId: r.id,
      mediaType: r.media_type,
      title: r.title || r.name,
      year: (r.release_date || r.first_air_date || '').slice(0, 4),
      posterPath: r.poster_path,
      overview: r.overview,
      tmdbRating: r.vote_average ? r.vote_average.toFixed(1) : null,
    }))
}

export async function getTMDBDetails(tmdbId, mediaType, apiKey) {
  if (!apiKey) throw new APIError('auth', 'NO_KEY', 'TMDB API key not configured')

  let res
  try {
    res = await fetch(`${BASE}/${mediaType}/${tmdbId}?api_key=${apiKey}&language=en-US`)
  } catch (error) {
    const apiError = parseAPIError(error, null)
    throw apiError
  }

  const err = parseAPIError(null, res)
  if (err) throw err

  const r = await res.json()
  return {
    tmdbId: r.id,
    mediaType,
    title: r.title || r.name,
    year: (r.release_date || r.first_air_date || '').slice(0, 4),
    posterPath: r.poster_path,
    overview: r.overview,
    tmdbRating: r.vote_average ? r.vote_average.toFixed(1) : null,
    genres: (r.genres || []).map(g => g.name).slice(0, 3),
    imdbId: r.imdb_id || null,
  }
}
