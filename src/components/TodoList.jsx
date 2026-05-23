import { useLiveQuery } from 'dexie-react-hooks'
import { format, isToday, getMonth, getYear, startOfMonth, getDaysInMonth, addMonths } from 'date-fns'
import { useState } from 'react'
import TodoCard from './TodoCard.jsx'
import { useTodos, useCalendarTodos, useCategories } from '../hooks/index.js'
import { db } from '../db/index.js'
import { useProfileId } from '../contexts/ProfileContext.jsx'
import { VIEW_MODES } from '../domain/viewModes.js'

function EmptyState({ icon, message, sub, onAdd }) {
  const defaultIcon = icon ? (
    <span style={{ fontSize: '56px', lineHeight: 1 }}>{icon}</span>
  ) : (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.25 }}>
      <rect x="14" y="14" width="28" height="28" rx="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M20 28L24 32L36 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"/>
    </svg>
  );

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '60px 32px', textAlign: 'center',
    }}>
      <div style={{ fontSize: '56px', opacity: 0.25, lineHeight: 1, marginBottom: '28px', userSelect: 'none', color: 'var(--text)' }}>
        {defaultIcon}
      </div>
      <p style={{ fontSize: '18px', fontWeight: 500, color: 'var(--text-2)', marginBottom: '10px' }}>
        {message}
      </p>
      {sub && (
        <p style={{ fontSize: 'var(--sz-mono-xs)', color: 'var(--text-3)', letterSpacing: '0.01em', lineHeight: 1.5 }}>
          {sub}
        </p>
      )}
      {onAdd && (
        <button
          onClick={onAdd}
          className="btn btn-ghost"
          style={{ marginTop: '28px', fontSize: 'var(--sz-mono-xs)', fontWeight: 500 }}
        >
          + add the first one
        </button>
      )}
    </div>
  )
}

function CalendarPopover({ todos, categories, x, y, onClose, onEditTodo }) {
  // Clamp x and y to keep popover within viewport
  const clampedX = Math.max(8, Math.min(x, window.innerWidth - 228))
  const clampedY = Math.max(8, Math.min(y, window.innerHeight - 200))

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 39, background: 'transparent'
        }}
      />
      {/* Popover */}
      <div
        style={{
          position: 'fixed',
          left: `${clampedX}px`,
          top: `${clampedY}px`,
          zIndex: 40,
          background: 'var(--bg-2)',
          border: '1px solid var(--border-2)',
          borderRadius: '8px',
          padding: '12px',
          maxWidth: '220px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
          minWidth: '160px',
          maxHeight: '70vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {todos.map(todo => {
            const category = categories?.find(c => c.id === todo.categoryId)
            const catColor = category?.color || 'var(--amber)'
            return (
              <div
                key={todo.id}
                onClick={() => onEditTodo(todo.id)}
                style={{
                  cursor: 'pointer',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  background: 'var(--bg)',
                  border: `1px solid ${catColor}`,
                  fontSize: '13px',
                  color: 'var(--text)',
                  lineHeight: 1.4,
                  transition: 'background 0.15s ease, color 0.15s ease',
                  wordBreak: 'break-word',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  minHeight: '32px',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = `color-mix(in oklch, ${catColor} 12%, transparent)`
                  e.currentTarget.style.color = 'var(--text)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'var(--bg)'
                  e.currentTarget.style.color = 'var(--text)'
                }}
              >
                <span style={{ fontSize: '12px', opacity: 0.7 }}>{category?.icon || '·'}</span>
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {todo.title}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

function CalendarView({ selectedCategoryId, onEditTodo }) {
  const profileId = useProfileId()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [popoverState, setPopoverState] = useState(null)

  const todosByDate = useCalendarTodos(selectedCategoryId, { profileId }) || {}
  const allCategories = useCategories(profileId)

  if (!allCategories) return null

  if (Object.keys(todosByDate).length === 0) {
    return <EmptyState icon="◫" message="no dated items" sub="add a date to any item to see it here" />
  }

  // Calculate calendar grid
  const year = getYear(currentDate)
  const month = getMonth(currentDate)
  const monthStart = startOfMonth(currentDate)
  const daysInMonth = getDaysInMonth(currentDate)
  const startDay = monthStart.getDay() // 0 = Sunday

  const days = []
  // Add empty cells for days before month starts
  for (let i = 0; i < startDay; i++) {
    days.push(null)
  }
  // Add day numbers
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d)
  }

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const handleNavMonth = (offset) => {
    setCurrentDate(addMonths(currentDate, offset))
    setPopoverState(null)
  }

  const handleDayClick = (day, e) => {
    if (!day) return
    const dateStr = format(new Date(year, month, day), 'yyyy-MM-dd')
    const todosOnDay = todosByDate[dateStr] || []
    if (todosOnDay.length === 0) return

    const rect = e.currentTarget.getBoundingClientRect()
    setPopoverState({
      todos: todosOnDay,
      x: rect.left + rect.width / 2 - 100,
      y: rect.bottom + 8,
    })
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '16px 14px',
        borderBottom: '1px solid var(--border-2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
      }}>
        <button
          onClick={() => handleNavMonth(-1)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-3)',
            padding: '8px',
            fontSize: '16px',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
          aria-label="Previous month"
        >
          ←
        </button>
        <h2 style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '16px',
          fontWeight: 600,
          color: 'var(--text)',
          textAlign: 'center',
          flex: 1,
          letterSpacing: '0.01em',
        }}>
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <button
          onClick={() => handleNavMonth(1)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-3)',
            padding: '8px',
            fontSize: '16px',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
          aria-label="Next month"
        >
          →
        </button>
      </div>

      {/* Calendar Grid */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 8px 100px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '4px',
          height: 'fit-content',
          maxWidth: '100%',
        }}>
          {/* Day labels */}
          {dayLabels.map(label => (
            <div
              key={label}
              style={{
                textAlign: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--sz-mono-xs)',
                color: 'var(--text-3)',
                padding: '8px 4px',
                fontWeight: 500,
                borderBottom: '1px solid var(--border-2)',
                paddingBottom: '10px',
              }}
            >
              {label}
            </div>
          ))}

          {/* Day cells */}
          {days.map((day, idx) => {
            const isCurrentDay = day && isToday(new Date(year, month, day))
            const dateStr = day ? format(new Date(year, month, day), 'yyyy-MM-dd') : null
            const todosOnDay = dateStr ? (todosByDate[dateStr] || []) : []
            const hasTodos = todosOnDay.length > 0

            return (
              <button
                key={idx}
                onClick={e => handleDayClick(day, e)}
                style={{
                  aspectRatio: '1',
                  minHeight: '40px',
                  border: isCurrentDay ? `2px solid var(--amber)` : '1px solid var(--border-2)',
                  background: isCurrentDay ? 'color-mix(in oklch, var(--amber) 8%, transparent)' : 'var(--bg)',
                  borderRadius: '6px',
                  cursor: day && hasTodos ? 'pointer' : day ? 'default' : 'default',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  padding: '4px',
                  transition: 'border-color 0.15s ease, background 0.15s ease',
                  opacity: day ? 1 : 0.25,
                  pointerEvents: day ? 'auto' : 'none',
                }}
                onMouseEnter={e => {
                  if (day && hasTodos) {
                    e.currentTarget.style.borderColor = 'var(--text-2)'
                    e.currentTarget.style.background = 'color-mix(in oklch, var(--text) 4%, transparent)'
                  }
                }}
                onMouseLeave={e => {
                  if (day) {
                    e.currentTarget.style.borderColor = isCurrentDay ? 'var(--amber)' : 'var(--border-2)'
                    e.currentTarget.style.background = isCurrentDay ? 'color-mix(in oklch, var(--amber) 8%, transparent)' : 'var(--bg)'
                  }
                }}
                aria-label={day ? `${format(new Date(year, month, day), 'MMMM d')}` + (hasTodos ? `, ${todosOnDay.length} item${todosOnDay.length > 1 ? 's' : ''}` : '') : undefined}
              >
                {day && (
                  <>
                    <span style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '12px',
                      fontWeight: 500,
                      color: 'var(--text-2)',
                      lineHeight: 1,
                      marginBottom: '4px',
                    }}>
                      {day}
                    </span>
                    {todosOnDay.length > 0 && (
                      <div style={{
                        display: 'flex',
                        gap: '3px',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        width: '100%',
                      }}>
                        {todosOnDay.slice(0, 3).map(todo => {
                          const category = allCategories.find(c => c.id === todo.categoryId)
                          return (
                            <span
                              key={todo.id}
                              style={{
                                fontSize: '11px',
                                opacity: 0.7,
                              }}
                              title={category?.name}
                            >
                              {category?.icon || '·'}
                            </span>
                          )
                        })}
                        {todosOnDay.length > 3 && (
                          <span style={{
                            fontSize: '10px',
                            color: 'var(--text-3)',
                            lineHeight: 1,
                          }}>
                            +{todosOnDay.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Popover */}
      {popoverState && (
        <CalendarPopover
          todos={popoverState.todos}
          categories={allCategories}
          x={popoverState.x}
          y={popoverState.y}
          onClose={() => setPopoverState(null)}
          onEditTodo={(todoId) => {
            setPopoverState(null)
            onEditTodo?.(todoId)
          }}
        />
      )}
    </div>
  )
}

export default function TodoList({ categoryId, onAdd, onEdit }) {
  const isCalendar = categoryId === VIEW_MODES.CALENDAR

  // Calendar view: different data structure and rendering entirely
  if (isCalendar) {
    return (
      <CalendarView
        selectedCategoryId={null}
        onEditTodo={onEdit}
      />
    )
  }

  // Category view: use new data layer hooks
  const category = useLiveQuery(
    () => categoryId ? db.categories.get(categoryId) : null,
    [categoryId]
  )

  // Data layer now owns ALL filtering and sorting
  // Hook returns {pending, done} pre-computed and sorted by createdAt
  const data = useTodos(categoryId)

  if (!data || (data.pending.length === 0 && data.done.length === 0)) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <EmptyState
          icon={category?.icon}
          message={categoryId ? `nothing in ${category?.name?.toLowerCase() || 'this list'}` : 'your stash is empty'}
          sub={categoryId ? 'tap ＋ to stash something here' : 'tap ＋ to add something'}
          onAdd={onAdd}
        />
      </div>
    )
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div className="flex flex-col gap-2 stagger" style={{ padding: '16px 14px 100px' }}>
        {data.pending.map(todo => (
          <TodoCard key={todo.id} todo={todo} category={category} onEdit={onEdit} />
        ))}
        {data.done.length > 0 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0 4px' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--sz-mono-xs)', color: 'var(--text-4)' }}>
                done · {data.done.length}
              </span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            </div>
            {data.done.map(todo => (
              <TodoCard key={todo.id} todo={todo} category={category} onEdit={onEdit} />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
