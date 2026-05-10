import { useLiveQuery } from 'dexie-react-hooks'
import { format } from 'date-fns'
import { db } from '../db/index.js'

// Get todos for calendar view: only dated, pending todos, grouped by date
// This consolidates the filtering logic that was previously in CalendarView
export function useCalendarTodos(categoryId, options = {}) {
  return useLiveQuery(async () => {
    // Get all todos with dates, for this category (if specified), that are pending
    let query = db.todos.where('profileId').equals(options.profileId)

    const todos = await query.toArray()
    if (!Array.isArray(todos)) {
      console.warn('[stash] IndexedDB returned non-array for useCalendarTodos query', { type: typeof todos, value: todos })
      return {}
    }

    // Filter: must have date, must be pending, optionally by category
    const filtered = todos.filter(t => {
      if (!t.date || t.done) return false
      if (categoryId && t.categoryId !== categoryId) return false
      return true
    })

    // Group by date (ISO string format YYYY-MM-DD)
    const byDate = {}
    filtered.forEach(todo => {
      const dateKey = format(new Date(todo.date), 'yyyy-MM-dd')
      if (!byDate[dateKey]) byDate[dateKey] = []
      byDate[dateKey].push(todo)
    })

    return byDate
  }, [categoryId, options.profileId])
}
