import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/index.js'

// Sorting function extracted for reuse
const createSortFn = (sort) => {
  return sort === 'date'
    ? (a, b) => {
        const aDate = a.date ? new Date(a.date).getTime() : Infinity
        const bDate = b.date ? new Date(b.date).getTime() : Infinity
        return aDate - bDate
      }
    : (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
}

// Get todos for a category, split into pending and done, pre-sorted
// This consolidates sorting logic that was previously scattered across TodoList and CalendarView
export function useTodos(categoryId, options = {}) {
  const { sort = 'createdAt' } = options

  return useLiveQuery(() => {
    const query = categoryId
      ? db.todos.where('categoryId').equals(categoryId)
      : db.todos.toCollection()

    return query.toArray().then(todos => {
      if (!Array.isArray(todos)) todos = []
      const pending = todos.filter(t => !t.done)
      const done = todos.filter(t => t.done)

      const sortFn = createSortFn(sort)

      return {
        pending: pending.sort(sortFn),
        done: done.sort(sortFn),
        all: [...pending.sort(sortFn), ...done.sort(sortFn)],
      }
    })
  }, [categoryId, sort])
}

// Get all todos for a profile, split into pending and done, pre-sorted
export function useTodosByProfile(profileId, options = {}) {
  const { sort = 'createdAt' } = options

  return useLiveQuery(() => {
    return db.todos.where('profileId').equals(profileId).toArray().then(todos => {
      if (!Array.isArray(todos)) todos = []
      const pending = todos.filter(t => !t.done)
      const done = todos.filter(t => t.done)

      const sortFn = createSortFn(sort)

      return {
        pending: pending.sort(sortFn),
        done: done.sort(sortFn),
        all: [...pending.sort(sortFn), ...done.sort(sortFn)],
      }
    })
  }, [profileId, sort])
}

// Get a single todo by ID
export function useTodo(todoId) {
  return useLiveQuery(() => db.todos.get(todoId), [todoId])
}
