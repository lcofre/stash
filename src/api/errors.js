export class APIError extends Error {
  constructor(type, code, message, details = {}) {
    super(message)
    this.name = 'APIError'
    this.type = type // 'network' | 'auth' | 'rateLimit' | 'invalid' | 'notFound'
    this.code = code // HTTP status or error code
    this.details = details
  }
}

export function parseAPIError(error, response) {
  if (!response) {
    // Network error or no response
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return new APIError('network', 'NETWORK_ERROR', 'Network request failed', { originalError: error.message })
    }
    return new APIError('network', 'UNKNOWN', 'Unknown error', { originalError: error.message })
  }

  if (response.status === 401) {
    return new APIError('auth', 401, 'Invalid API key. Check your settings.')
  }

  if (response.status === 429) {
    return new APIError('rateLimit', 429, 'Rate limited. Please try again later.')
  }

  if (!response.ok) {
    return new APIError('invalid', response.status, `API request failed with status ${response.status}`)
  }

  return null
}
