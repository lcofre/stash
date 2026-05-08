const BASE = 'https://www.omdbapi.com'

export async function getOMDBRating(imdbId, apiKey) {
  if (!apiKey || !imdbId) return null
  const res = await fetch(`${BASE}/?i=${imdbId}&apikey=${apiKey}`)
  if (!res.ok) return null
  const data = await res.json()
  if (data.Response === 'False') return null
  const ratings = {}
  if (data.imdbRating && data.imdbRating !== 'N/A') ratings.imdb = data.imdbRating
  const rt = (data.Ratings || []).find(r => r.Source === 'Rotten Tomatoes')
  if (rt) ratings.rottenTomatoes = rt.Value
  return ratings
}

export async function searchOMDB(title, year, apiKey) {
  if (!apiKey || !title.trim()) return null
  const yearParam = year ? `&y=${year}` : ''
  const res = await fetch(`${BASE}/?t=${encodeURIComponent(title)}${yearParam}&apikey=${apiKey}`)
  if (!res.ok) return null
  const data = await res.json()
  if (data.Response === 'False') return null
  const ratings = {}
  if (data.imdbRating && data.imdbRating !== 'N/A') ratings.imdb = data.imdbRating
  const rt = (data.Ratings || []).find(r => r.Source === 'Rotten Tomatoes')
  if (rt) ratings.rottenTomatoes = rt.Value
  return { imdbId: data.imdbID, ratings }
}
