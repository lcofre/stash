import { APIError, parseAPIError } from './errors.js'

const BASE = 'https://www.omdbapi.com'

export async function getOMDBRating(imdbId, apiKey) {
  if (!apiKey) throw new APIError('auth', 'NO_KEY', 'OMDB API key not configured')
  if (!imdbId) return null

  let res
  try {
    res = await fetch(`${BASE}/?i=${imdbId}&apikey=${apiKey}`)
  } catch (error) {
    const apiError = parseAPIError(error, null)
    throw apiError
  }

  const err = parseAPIError(null, res)
  if (err) throw err

  const data = await res.json()
  if (data.Response === 'False') return null
  const ratings = {}
  if (data.imdbRating && data.imdbRating !== 'N/A') ratings.imdb = data.imdbRating
  const rt = (data.Ratings || []).find(r => r.Source === 'Rotten Tomatoes')
  if (rt) ratings.rottenTomatoes = rt.Value
  return ratings
}

export async function searchOMDB(title, year, apiKey) {
  if (!apiKey) throw new APIError('auth', 'NO_KEY', 'OMDB API key not configured')
  if (!title.trim()) return null

  const yearParam = year ? `&y=${year}` : ''
  let res
  try {
    res = await fetch(`${BASE}/?t=${encodeURIComponent(title)}${yearParam}&apikey=${apiKey}`)
  } catch (error) {
    const apiError = parseAPIError(error, null)
    throw apiError
  }

  const err = parseAPIError(null, res)
  if (err) throw err

  const data = await res.json()
  if (data.Response === 'False') return null
  const ratings = {}
  if (data.imdbRating && data.imdbRating !== 'N/A') ratings.imdb = data.imdbRating
  const rt = (data.Ratings || []).find(r => r.Source === 'Rotten Tomatoes')
  if (rt) ratings.rottenTomatoes = rt.Value
  return { imdbId: data.imdbID, ratings }
}
