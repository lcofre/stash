import { useLiveQuery } from 'dexie-react-hooks'
import { format, isToday, isTomorrow, isPast } from 'date-fns'
import { Package, CalendarDays } from 'lucide-react'
import TodoCard from './TodoCard.jsx'
import { db } from '../db/index.js'

function EmptyState({ message, sub }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <Package size={40} className="text-slate-700 mb-4" />
      <p className="text-slate-400 font-medium">{message}</p>
      {sub && <p className="text-slate-600 text-sm mt-1">{sub}</p>}
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
  if (todos.length === 0) return <EmptyState message="No dated items" sub="Add a date to any todo to see it here" />

  const catMap = Object.fromEntries(categories.map(c => [c.id, c]))

  const groups = {}
  for (const todo of todos) {
    const d = new Date(todo.date)
    let key
    if (isPast(d) && !isToday(d)) key = '⚠️ Overdue'
    else if (isToday(d)) key = '📅 Today'
    else if (isTomorrow(d)) key = '📅 Tomorrow'
    else key = `📅 ${format(d, 'EEEE, MMM d')}`
    if (!groups[key]) groups[key] = []
    groups[key].push(todo)
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      {Object.entries(groups).map(([label, items]) => (
        <div key={label}>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{label}</p>
          <div className="flex flex-col gap-2">
            {items.map(todo => (
              <TodoCard key={todo.id} todo={todo} category={catMap[todo.categoryId]} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function TodoList({ profileId, categoryId }) {
  const isCalendar = categoryId === '__calendar__'

  const category = useLiveQuery(
    () => categoryId && !isCalendar ? db.categories.get(categoryId) : null,
    [categoryId, isCalendar]
  )

  const todos = useLiveQuery(() => {
    if (isCalendar || !categoryId) return null
    return db.todos
      .where('categoryId').equals(categoryId)
      .toArray()
      .then(arr => arr.sort((a, b) => {
        if (a.done !== b.done) return a.done ? 1 : -1
        return new Date(b.createdAt) - new Date(a.createdAt)
      }))
  }, [categoryId, isCalendar])

  const allTodos = useLiveQuery(() => {
    if (categoryId) return null
    return db.todos.where('profileId').equals(profileId).toArray()
      .then(arr => arr.sort((a, b) => {
        if (a.done !== b.done) return a.done ? 1 : -1
        return new Date(b.createdAt) - new Date(a.createdAt)
      }))
  }, [profileId, categoryId])

  if (isCalendar) {
    return (
      <div className="flex-1 overflow-y-auto">
        <CalendarView profileId={profileId} />
      </div>
    )
  }

  const items = todos || allTodos || []

  if (!categoryId && !items.length) {
    return <EmptyState message="Nothing stashed yet" sub="Tap + to add your first item" />
  }

  if (categoryId && (!todos || todos.length === 0)) {
    return <EmptyState
      message={`${category?.icon || '📦'} ${category?.name || 'This category'} is empty`}
      sub="Tap + to stash something here"
    />
  }

  const pending = items.filter(t => !t.done)
  const done = items.filter(t => t.done)

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex flex-col gap-2 p-4">
        {pending.map(todo => (
          <TodoCard key={todo.id} todo={todo} category={category} />
        ))}
        {done.length > 0 && (
          <>
            <p className="text-xs text-slate-600 uppercase tracking-wider pt-2 pb-1">Done ({done.length})</p>
            {done.map(todo => (
              <TodoCard key={todo.id} todo={todo} category={category} />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
