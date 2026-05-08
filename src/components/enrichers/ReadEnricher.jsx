import { useState, useEffect, useRef } from 'react'
import { Search, X, BookOpen } from 'lucide-react'
import { searchBooks } from '../../api/googleBooks.js'

export default function ReadEnricher({ value, onChange }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        const items = await searchBooks(query)
        setResults(items)
      } catch {
        setResults([])
      } finally {
        setSearching(false)
      }
    }, 400)
    return () => clearTimeout(timerRef.current)
  }, [query])

  function selectResult(item) {
    onChange(item)
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
        {value.coverUrl
          ? <img src={value.coverUrl} alt={value.title} className="w-12 rounded-lg object-cover shrink-0" style={{ height: '4.5rem' }} />
          : <div className="w-12 shrink-0 bg-slate-700 rounded-lg flex items-center justify-center" style={{ height: '4.5rem' }}>
              <BookOpen size={20} className="text-slate-500" />
            </div>
        }
        <div className="flex-1 min-w-0">
          <p className="text-slate-100 font-medium text-sm leading-tight">{value.title}</p>
          {value.authors && <p className="text-slate-400 text-xs mt-0.5">{value.authors}</p>}
          <div className="flex gap-2 mt-1">
            {value.publishedYear && <span className="text-xs text-slate-500">{value.publishedYear}</span>}
            {value.pageCount && <span className="text-xs text-slate-500">· {value.pageCount} pg</span>}
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
          placeholder="Search books…"
          className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl text-slate-100 placeholder-slate-500 text-sm transition-colors"
        />
        {searching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        )}
      </div>
      {results.length > 0 && (
        <div className="flex flex-col gap-1 max-h-64 overflow-y-auto rounded-xl border border-slate-700 bg-slate-800">
          {results.map(item => (
            <button
              key={item.googleId}
              onClick={() => selectResult(item)}
              className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-700 transition-colors text-left"
            >
              {item.coverUrl
                ? <img src={item.coverUrl} alt="" className="w-8 h-12 object-cover rounded shrink-0" />
                : <div className="w-8 h-12 bg-slate-700 rounded shrink-0 flex items-center justify-center">
                    <BookOpen size={12} className="text-slate-500" />
                  </div>
              }
              <div className="flex-1 min-w-0">
                <p className="text-slate-100 text-sm font-medium leading-tight truncate">{item.title}</p>
                <p className="text-slate-400 text-xs mt-0.5 truncate">
                  {item.authors || 'Unknown author'}
                  {item.publishedYear && <span className="text-slate-500"> · {item.publishedYear}</span>}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
