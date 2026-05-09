import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'

const monoSm = { fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-3)', letterSpacing: '0.03em' }

export default function SearchEnricher({
  adapter,
  value,
  onChange,
  config = {},
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')
  const timerRef = useRef(null)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      setError('')
      setSearching(true)
      try {
        const items = await adapter.search(query, config)
        setResults(items)
      } catch (err) {
        setError(err.message || 'Search failed')
        setResults([])
      } finally {
        setSearching(false)
      }
    }, 380)

    return () => clearTimeout(timerRef.current)
  }, [query, adapter, config])

  const handleSelect = async (item) => {
    if (adapter.onSelect) {
      const enriched = await adapter.onSelect(item, config)
      onChange(enriched)
    } else {
      onChange(item)
    }
    setQuery('')
    setResults([])
  }

  if (value) {
    return (
      <div style={{
        display: 'flex', gap: '12px', padding: '12px',
        background: 'var(--bg-3)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
      }}>
        {adapter.displaySelected ? adapter.displaySelected(value) : null}
        <button
          onClick={() => onChange(null)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-4)', alignSelf: 'flex-start', padding: '2px',
            flexShrink: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-4)'}
        >
          <X size={15} />
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ position: 'relative' }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={adapter.placeholder || 'search…'}
          className="field accent-focus"
        />
        {searching && (
          <div style={{
            position: 'absolute', right: '12px', top: '50%',
            transform: 'translateY(-50%)', width: '14px', height: '14px',
            border: '1.5px solid var(--amber)', borderTopColor: 'transparent',
            borderRadius: '50%', animation: 'spin 0.7s linear infinite',
          }} />
        )}
        <style>{`@keyframes spin { to { transform: translateY(-50%) rotate(360deg); } }`}</style>
      </div>

      {error && (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--amber)', opacity: 0.8 }}>
          {error}
        </p>
      )}

      {results.length > 0 && (
        <div style={{
          background: 'var(--bg-3)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', overflow: 'hidden',
          maxHeight: '260px', overflowY: 'auto',
        }}>
          {results.map(item => (
            <button
              key={adapter.resultKey(item)}
              onClick={() => handleSelect(item)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
                padding: '10px 12px', background: 'transparent', border: 'none',
                borderBottom: '1px solid var(--border)', cursor: 'pointer',
                textAlign: 'left', transition: 'background 0.12s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-4)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {adapter.displayResult(item)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
