import { useLiveQuery } from 'dexie-react-hooks'
import { format, isToday, isTomorrow, isPast } from 'date-fns'
import TodoCard from './TodoCard.jsx'
import { db } from '../db/index.js'

function EmptyState({ icon, message, sub, onAdd }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '60px 32px', textAlign: 'center',
    }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '64px', opacity: 0.12, lineHeight: 1, marginBottom: '24px', userSelect: 'none' }}>
        {icon || '◻'}
      </div>
      <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '20px', color: 'var(--text-3)', marginBottom: '8px', fontWeight: 400 }}>
        {message}
      </p>
      {sub && (
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--text-4)', letterSpacing: '0.02em' }}>
          {sub}
        </p>
      )}
      {onAdd && (
        <button
          onClick={onAdd}
          className="btn btn-ghost"
          style={{ marginTop: '24px', fontSize: '13px' }}
        >
          add the first one
        </button>
      )}
    </div>
  )
}

function CalendarView({ profileId }) {
  const todos = useLiveQuery(
    () => db.todos
      .where('profileId').equals(profileId)
      .filter(t => !!t.date && !t.done)
      .toArray()
      .then(arr => arr.sort((a, b) => new Date(a.date) - new Date(b.date))),
    [profileId]
  )
  const categories = useLiveQuery(
    () => db.categories.where('profileId').equals(profileId).toArray(),
    [profileId]
  )

  if (!todos || !categories) return null
  if (todos.length === 0) {
    return <EmptyState icon="◫" message="no dated items" sub="add a date to any item to see it here" />
  }

  const catMap = Object.fromEntries(categories.map(c => [c.id, c]))

  const groups = {}
  for (const todo of todos) {
    const d = new Date(todo.date)
    let key
    if (isPast(d) && !isToday(d)) key = 'overdue'
    else if (isToday(d)) key = 'today'
    else if (isTomorrow(d)) key = 'tomorrow'
    else key = format(d, 'EEEE d MMM').toLowerCase()
    if (!groups[key]) groups[key] = []
    groups[key].push(todo)
  }

  const overdueColor = '#C47B7A'
  const todayColor = '#7B9ED4'

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px 100px' }}>
      <div className="flex flex-col gap-6 stagger">
        {Object.entries(groups).map(([label, items]) => (
          <div key={label}>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: 'var(--sz-mono-xs)',
              color: label === 'overdue' ? overdueColor : label === 'today' ? todayColor : 'var(--text-3)',
              marginBottom: '10px', paddingLeft: '2px',
            }}>
              {label}
            </p>
            <div className="flex flex-col gap-2">
              {items.map(todo => (
                <TodoCard key={todo.id} todo={todo} category={catMap[todo.categoryId]} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TodoList({ profileId, categoryId, onAdd }) {
  const isCalendar = categoryId === '__calendar__'

  const category = useLiveQuery(
    () => categoryId && !isCalendar ? db.categories.get(categoryId) : null,
    [categoryId, isCalendar]
  )

  const todos = useLiveQuery(() => {
    if (isCalendar || !categoryId) return undefined
    return db.todos
      .where('categoryId').equals(categoryId)
      .toArray()
      .then(arr => arr.sort((a, b) => {
        if (a.done !== b.done) return a.done ? 1 : -1
        return new Date(b.createdAt) - new Date(a.createdAt)
      }))
  }, [categoryId, isCalendar])

  const allTodos = useLiveQuery(() => {
    if (categoryId) return undefined
    return db.todos.where('profileId').equals(profileId).toArray()
      .then(arr => arr.sort((a, b) => {
        if (a.done !== b.done) return a.done ? 1 : -1
        return new Date(b.createdAt) - new Date(a.createdAt)
      }))
  }, [profileId, categoryId])

  if (isCalendar) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <CalendarView profileId={profileId} />
      </div>
    )
  }

  const items = todos ?? allTodos ?? []

  if (!categoryId && items.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <EmptyState icon="◻" message="your stash is empty" sub="tap ＋ to add something" onAdd={onAdd} />
      </div>
    )
  }

  if (categoryId && (!todos || todos.length === 0)) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <EmptyState
          icon={category?.icon}
          message={`nothing in ${category?.name?.toLowerCase() || 'this list'}`}
          sub="tap ＋ to stash something here"
          onAdd={onAdd}
        />
      </div>
    )
  }

  const pending = items.filter(t => !t.done)
  const done = items.filter(t => t.done)

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div className="flex flex-col gap-2 stagger" style={{ padding: '16px 14px 100px' }}>
        {pending.map(todo => (
          <TodoCard key={todo.id} todo={todo} category={category} />
        ))}
        {done.length > 0 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0 4px' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--sz-mono-xs)', color: 'var(--text-4)' }}>
                done · {done.length}
              </span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            </div>
            {done.map(todo => (
              <TodoCard key={todo.id} todo={todo} category={category} />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
