import { movieAdapter } from './movieAdapter.jsx'
import { bookAdapter } from './bookAdapter.jsx'

// Define config schemas for each adapter
const ADAPTER_CONFIGS = {
  movie: {
    required: ['tmdbApiKey'],
    optional: ['omdbApiKey'],
    description: 'Movie/TV adapter requires TMDB API key. OMDB key is optional for additional ratings.',
  },
  book: {
    required: [],
    optional: [],
    description: 'Book adapter requires no API keys (uses free Google Books API).',
  },
}

export const adapters = {
  movie: movieAdapter,
  book: bookAdapter,
}

export function validateAdapterConfig(adapterName, config) {
  const schema = ADAPTER_CONFIGS[adapterName]
  if (!schema) {
    throw new Error(`Unknown adapter: ${adapterName}`)
  }

  // Check required keys
  for (const key of schema.required) {
    if (!config || !(key in config) || !config[key]) {
      throw new Error(`${adapterName} adapter requires ${key}. ${schema.description}`)
    }
  }

  // Warn about unknown keys (for debugging)
  const validKeys = [...schema.required, ...schema.optional]
  for (const key in config) {
    if (!validKeys.includes(key)) {
      console.warn(`Unknown config key "${key}" for ${adapterName} adapter`)
    }
  }

  return true
}

export function getAdapterConfig(adapterName) {
  return ADAPTER_CONFIGS[adapterName]
}
