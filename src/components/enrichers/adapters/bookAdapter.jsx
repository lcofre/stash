import { searchBooks } from '../../../api/googleBooks.js'

const monoSm = { fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-3)', letterSpacing: '0.03em' }

/**
 * Book adapter config schema:
 * No API keys required (uses free Google Books API)
 */

export const bookAdapter = {
  placeholder: 'search books…',

  // Config schema for validation
  configSchema: {
    required: [],
    optional: [],
  },

  async search(query) {
    return searchBooks(query)
  },

  resultKey: (item) => item.googleId,

  displayResult: (item) => (
    <>
      {item.coverUrl ? (
        <img
          src={item.coverUrl}
          alt=""
          style={{ width: '32px', height: '48px', objectFit: 'cover', borderRadius: '3px', flexShrink: 0 }}
        />
      ) : (
        <div style={{ width: '32px', height: '48px', background: 'var(--bg-5)', borderRadius: '3px', flexShrink: 0 }} />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: 'var(--font-ui)', fontStyle: 'italic', fontSize: '14px', fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.title}
        </p>
        <p style={{ ...monoSm, marginTop: '3px' }}>
          {item.authors || 'unknown'}
          {item.publishedYear ? ` · ${item.publishedYear}` : ''}
        </p>
      </div>
    </>
  ),

  displaySelected: (item) => (
    <>
      {item.coverUrl ? (
        <img
          src={item.coverUrl}
          alt=""
          style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0, border: '1px solid var(--border)' }}
        />
      ) : (
        <div style={{ width: '40px', height: '60px', background: 'var(--bg-5)', borderRadius: '4px', flexShrink: 0 }} />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: 'var(--font-ui)', fontStyle: 'italic', fontSize: '16px', fontWeight: 500, color: 'var(--text)', lineHeight: 1.2 }}>
          {item.title}
        </p>
        <p style={{ ...monoSm, marginTop: '4px' }}>
          {item.authors || 'unknown author'}
          {item.publishedYear ? ` · ${item.publishedYear}` : ''}
          {item.pageCount ? ` · ${item.pageCount}p` : ''}
        </p>
      </div>
    </>
  ),
}
