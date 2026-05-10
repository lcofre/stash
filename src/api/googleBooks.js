import { APIError, parseAPIError } from './errors.js'

const BASE = 'https://www.googleapis.com/books/v1/volumes'

export async function searchBooks(query) {
  if (!query.trim()) return []

  let res
  try {
    res = await fetch(`${BASE}?q=${encodeURIComponent(query)}&maxResults=8&langRestrict=en`)
  } catch (error) {
    const apiError = parseAPIError(error, null)
    throw apiError
  }

  const err = parseAPIError(null, res)
  if (err) throw err

  const data = await res.json()
  return (data.items || []).map(item => {
    const info = item.volumeInfo
    return {
      googleId: item.id,
      title: info.title,
      authors: (info.authors || []).join(', '),
      publishedYear: (info.publishedDate || '').slice(0, 4),
      coverUrl: info.imageLinks?.thumbnail?.replace('http:', 'https:') || null,
      description: info.description || null,
      pageCount: info.pageCount || null,
      categories: (info.categories || []).slice(0, 2),
      previewLink: info.previewLink || null,
    }
  })
}
