import { db } from '../db/index.js'
import { validateProfileExists, validateCategoryExists, validateTodoExists } from './validation.js'
import { getMetadataSchema } from '../domain/categoryTypes.js'

function stripMetadata(metadata, categoryType) {
  if (!metadata || !categoryType) return metadata
  const schema = getMetadataSchema(categoryType)
  if (!schema.fields.length) return null
  const stripped = {}
  for (const field of schema.fields) {
    if (metadata[field] !== undefined) stripped[field] = metadata[field]
  }
  return Object.keys(stripped).length > 0 ? stripped : null
}

export async function addTodo({ profileId, categoryId, title, notes, date, url, metadata }) {
  if (!title?.trim()) throw new Error('Title is required')

  await validateProfileExists(profileId)
  let categoryType = null
  if (categoryId) {
    await validateCategoryExists(categoryId)
    const category = await db.categories.get(categoryId)
    if (category.profileId !== profileId) {
      throw new Error('Category does not belong to this profile')
    }
    categoryType = category.type
  }

  const cleanedMetadata = metadata ? stripMetadata(metadata, categoryType) : null

  return db.todos.add({
    profileId,
    categoryId,
    title: title.trim(),
    notes: notes?.trim() || null,
    date: date ? new Date(date) : null,
    url: url?.trim() || null,
    done: false,
    metadata: cleanedMetadata,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
}

export async function toggleTodo(todoId) {
  const todo = await db.todos.get(todoId)
  await validateTodoExists(todoId)

  return db.todos.update(todoId, {
    done: !todo.done,
    updatedAt: new Date(),
  })
}

export async function updateTodo(todoId, updates) {
  let cleanedUpdates = { ...updates }

  if (updates.metadata && updates.categoryId) {
    const category = await db.categories.get(updates.categoryId)
    if (category) {
      cleanedUpdates.metadata = stripMetadata(updates.metadata, category.type)
    }
  }

  return db.todos.update(todoId, {
    ...cleanedUpdates,
    updatedAt: new Date(),
  })
}

export async function deleteTodo(todoId) {
  await validateTodoExists(todoId)
  return db.todos.delete(todoId)
}
