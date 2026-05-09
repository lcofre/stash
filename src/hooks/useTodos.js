import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/index.js'

export function useTodos(categoryId) {
  return useLiveQuery(
    () => categoryId ? db.todos.where('categoryId').equals(categoryId).toArray() : [],
    [categoryId]
  )
}

export function useTodosByProfile(profileId) {
  return useLiveQuery(
    () => profileId ? db.todos.where('profileId').equals(profileId).toArray() : [],
    [profileId]
  )
}

export function useTodo(todoId) {
  return useLiveQuery(() => db.todos.get(todoId), [todoId])
}
