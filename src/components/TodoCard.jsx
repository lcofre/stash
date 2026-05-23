import { useState } from 'react'
import { format, isPast, isToday, isTomorrow, differenceInDays } from 'date-fns'
import { Trash2, ExternalLink, ChevronDown } from 'lucide-react'
import { todos as todoCommands } from '../commands/index.js'
import ContentRenderer from './ContentRenderer.jsx'
import { useMutation } from '../hooks/index.js'

function DateLabel({ date }) {
  if (!date) return null
  const d = new Date(date)
  const today = isToday(d)
  const tomorrow = isTomorrow(d)
  const past = isPast(d) && !today
  const soon = !past && !today && !tomorrow && differenceInDays(d, new Date()) <= 3

  const label = today ? 'today' : tomorrow ? 'tomorrow' : format(d, 'dd MMM yyyy').toLowerCase()
  const color = today ? '#7B9ED4' : tomorrow ? 'var(--amber)' : past ? '#C47B7A' : soon ? '#D4A05A' : 'var(--text-3)'

  return (
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--sz-mono-xs)', color, letterSpacing: '0.03em' }}>
      {label}
    </span>
  )
}


export default function TodoCard({ todo, category, onEdit }) {
  const [expanded, setExpanded] = useState(false)
  const catColor = category?.color || 'var(--amber)'

  const hasMedia = todo.metadata?.mediaType
  const hasBook = todo.metadata?.googleId
  const hasExtras = todo.notes || todo.url || todo.metadata?.overview || todo.metadata?.description

  const { mutate: toggleDone, isLoading: checking } = useMutation(() => todoCommands.toggleTodo(todo.id))
  const { mutate: deleteTodo } = useMutation(() => todoCommands.deleteTodo(todo.id))

  return (
    <div
      className={`card anim-fade-up${todo.done ? ' done' : ''}`}
      onClick={() => !todo.done && onEdit?.(todo.id)}
      style={{ position: 'relative', padding: '14px 14px 12px 20px', '--cat-color': catColor, cursor: todo.done ? 'default' : 'pointer', transition: 'opacity 0.15s ease' }}
      onMouseEnter={e => { if (!todo.done) e.currentTarget.style.opacity = '0.85' }}
      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
    >
      {/* Left category bar */}
      <div className="cat-bar" />

      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <ContentRenderer todo={todo} category={category} />

          {/* Footer row */}
          {!todo.done && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px', flexWrap: 'wrap' }}>
              <DateLabel date={todo.date} />
              {todo.url && (
                <a
                  href={todo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)', fontSize: 'var(--sz-mono-xs)', color: 'var(--text-3)', textDecoration: 'none', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--amber)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
                >
                  <ExternalLink size={10} />
                  {new URL(todo.url).hostname.replace('www.', '')}
                </a>
              )}
              {hasExtras && (
                <button
                  onClick={() => setExpanded(e => !e)}
                  style={{ display: 'flex', alignItems: 'center', gap: '3px', fontFamily: 'var(--font-ui)', fontSize: 'var(--sz-mono-xs)', color: 'var(--text-4)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, transition: 'color 0.15s ease' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--text-2)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-4)'}
                >
                  <ChevronDown size={12} style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
                  {expanded ? 'less' : 'more'}
                </button>
              )}
            </div>
          )}

          {/* Expanded content */}
          {expanded && !todo.done && (
            <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
              {(todo.metadata?.overview || todo.metadata?.description) && (
                <p style={{ fontFamily: 'var(--font-ui)', fontStyle: 'italic', fontSize: '14px', color: 'var(--text-3)', lineHeight: 1.6, marginBottom: todo.notes ? '10px' : 0 }}>
                  {(todo.metadata.overview || todo.metadata.description).slice(0, 280)}
                  {(todo.metadata.overview || todo.metadata.description).length > 280 ? '…' : ''}
                </p>
              )}
              {todo.notes && (
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>
                  {todo.notes}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', paddingTop: '2px', flexShrink: 0 }}>
          {/* Done button */}
          <button
            onClick={toggleDone}
            className={checking ? 'anim-check' : ''}
            style={{
              width: '22px', height: '22px',
              borderRadius: '50%',
              border: todo.done ? 'none' : `1.5px solid ${catColor}`,
              background: todo.done ? catColor : 'transparent',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.18s ease, opacity 0.18s ease',
              flexShrink: 0,
              opacity: todo.done ? 0.6 : 1,
            }}
            aria-label={todo.done ? 'Unmark' : 'Mark done'}
          >
            {todo.done && (
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M1.5 5.5L4 8.5L9.5 2.5" stroke="#0c0b0f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>

          {/* Delete */}
          <button
            onClick={deleteTodo}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)', padding: '2px', transition: 'color 0.15s ease' }}
            aria-label="Delete"
            onMouseEnter={e => e.currentTarget.style.color = '#C47B7A'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-4)'}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}
