import { useState } from 'react'
import { format, isPast, isToday, isTomorrow, differenceInDays } from 'date-fns'
import { Check, Trash2, Star, Film, Tv, BookOpen, Link, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react'
import { TMDB_IMG } from '../api/tmdb.js'
import { db } from '../db/index.js'

function DateBadge({ date }) {
  if (!date) return null
  const d = new Date(date)
  const today = isToday(d)
  const tomorrow = isTomorrow(d)
  const past = isPast(d) && !today
  const soon = !past && !today && !tomorrow && differenceInDays(d, new Date()) <= 3

  let label = format(d, 'MMM d, yyyy')
  if (today) label = 'Today'
  else if (tomorrow) label = 'Tomorrow'

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium
      ${today ? 'bg-indigo-500/20 text-indigo-300' :
        tomorrow ? 'bg-amber-500/20 text-amber-300' :
        past ? 'bg-red-500/20 text-red-400' :
        soon ? 'bg-orange-500/20 text-orange-300' :
        'bg-slate-700 text-slate-400'}`}
    >
      📅 {label}
    </span>
  )
}

function WatchMeta({ metadata }) {
  return (
    <div className="flex gap-3">
      {metadata.posterPath && (
        <img
          src={`${TMDB_IMG}${metadata.posterPath}`}
          alt={metadata.title}
          className="w-10 rounded object-cover shrink-0"
          style={{ height: '3.75rem' }}
        />
      )}
      <div className="min-w-0">
        <p className="text-xs text-slate-400 flex items-center gap-1.5">
          {metadata.mediaType === 'tv' ? <Tv size={10} /> : <Film size={10} />}
          {metadata.mediaType === 'tv' ? 'TV Series' : 'Movie'}
          {metadata.year && <span>· {metadata.year}</span>}
        </p>
        <div className="flex flex-wrap gap-2 mt-1">
          {metadata.tmdbRating && (
            <span className="text-xs text-yellow-400 flex items-center gap-0.5">
              <Star size={10} fill="currentColor" /> {metadata.tmdbRating}
              <span className="text-slate-500 ml-0.5">TMDB</span>
            </span>
          )}
          {metadata.ratings?.imdb && (
            <span className="text-xs text-yellow-300 flex items-center gap-0.5">
              <Star size={10} fill="currentColor" /> {metadata.ratings.imdb}
              <span className="text-slate-500 ml-0.5">IMDb</span>
            </span>
          )}
          {metadata.ratings?.rottenTomatoes && (
            <span className="text-xs text-red-400">{metadata.ratings.rottenTomatoes} 🍅</span>
          )}
        </div>
      </div>
    </div>
  )
}

function ReadMeta({ metadata }) {
  return (
    <div className="flex gap-3">
      {metadata.coverUrl
        ? <img src={metadata.coverUrl} alt={metadata.title} className="w-10 rounded object-cover shrink-0" style={{ height: '3.75rem' }} />
        : <div className="w-10 shrink-0 bg-slate-700 rounded flex items-center justify-center" style={{ height: '3.75rem' }}>
            <BookOpen size={14} className="text-slate-500" />
          </div>
      }
      <div className="min-w-0">
        {metadata.authors && <p className="text-xs text-slate-400 truncate">{metadata.authors}</p>}
        <div className="flex gap-2 mt-0.5">
          {metadata.publishedYear && <span className="text-xs text-slate-500">{metadata.publishedYear}</span>}
          {metadata.pageCount && <span className="text-xs text-slate-500">· {metadata.pageCount} pg</span>}
        </div>
      </div>
    </div>
  )
}

export default function TodoCard({ todo, category }) {
  const [expanded, setExpanded] = useState(false)

  async function toggleDone() {
    await db.todos.update(todo.id, { done: !todo.done, updatedAt: new Date() })
  }

  async function deleteTodo() {
    await db.todos.delete(todo.id)
  }

  const hasExtras = todo.notes || todo.url || (todo.metadata?.overview) || (todo.metadata?.description)

  return (
    <div className={`bg-slate-800 border rounded-2xl px-4 py-3 transition-opacity ${todo.done ? 'opacity-50 border-slate-700' : 'border-slate-700 hover:border-slate-600'}`}>
      <div className="flex items-start gap-3">
        <button
          onClick={toggleDone}
          className={`shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
            ${todo.done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600 hover:border-slate-400'}`}
          aria-label={todo.done ? 'Mark undone' : 'Mark done'}
        >
          {todo.done && <Check size={11} className="text-white" strokeWidth={3} />}
        </button>

        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium leading-snug ${todo.done ? 'line-through text-slate-500' : 'text-slate-100'}`}>
            {todo.title}
          </p>

          {!todo.done && (
            <>
              {todo.metadata?.mediaType && <div className="mt-2"><WatchMeta metadata={todo.metadata} /></div>}
              {todo.metadata?.googleId && <div className="mt-2"><ReadMeta metadata={todo.metadata} /></div>}

              <div className="flex flex-wrap items-center gap-2 mt-2">
                {todo.date && <DateBadge date={todo.date} />}
                {todo.url && (
                  <a
                    href={todo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 truncate max-w-[180px]"
                    onClick={e => e.stopPropagation()}
                  >
                    <Link size={10} /> {new URL(todo.url).hostname}
                  </a>
                )}
              </div>

              {hasExtras && (
                <button
                  onClick={() => setExpanded(e => !e)}
                  className="mt-2 text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors"
                >
                  {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  {expanded ? 'Less' : 'More'}
                </button>
              )}

              {expanded && (
                <div className="mt-2 space-y-2">
                  {(todo.metadata?.overview || todo.metadata?.description) && (
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-4">
                      {todo.metadata.overview || todo.metadata.description}
                    </p>
                  )}
                  {todo.notes && (
                    <p className="text-xs text-slate-300 whitespace-pre-wrap border-t border-slate-700 pt-2">{todo.notes}</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {todo.done && (
            <button
              onClick={toggleDone}
              className="p-1.5 text-slate-500 hover:text-emerald-400 transition-colors"
              title="Mark undone"
            >
              <RotateCcw size={14} />
            </button>
          )}
          <button
            onClick={deleteTodo}
            className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
