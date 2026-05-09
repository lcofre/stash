import { db } from '../db/index.js'

export async function addTodo({ profileId, categoryId, title, notes, date, url, metadata }) {
  if (!title?.trim()) throw new Error('Title is required')

  return db.todos.add({
    profileId,
    categoryId,
    title: title.trim(),
    notes: notes?.trim() || null,
    date: date ? new Date(date) : null,
    url: url?.trim() || null,
    done: false,
    metadata: metadata || null,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
}

export async function toggleTodo(todoId) {
  const todo = await db.todos.get(todoId)
  if (!todo) throw new Error('Todo not found')

  return db.todos.update(todoId, {
    done: !todo.done,
    updatedAt: new Date(),
  })
}

export async function updateTodo(todoId, updates) {
  return db.todos.update(todoId, {
    ...updates,
    updatedAt: new Date(),
  })
}

export async function deleteTodo(todoId) {
  return db.todos.delete(todoId)
}
