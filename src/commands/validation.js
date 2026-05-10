import { db } from '../db/index.js'

// Invariants that must always be true
export async function validateProfileCount() {
  const count = await db.profiles.count()
  if (count < 1) {
    throw new Error('At least one profile must exist')
  }
}

export async function validateProfileExists(profileId) {
  const profile = await db.profiles.get(profileId)
  if (!profile) {
    throw new Error(`Profile ${profileId} does not exist`)
  }
}

export async function validateCategoryExists(categoryId) {
  const category = await db.categories.get(categoryId)
  if (!category) {
    throw new Error(`Category ${categoryId} does not exist`)
  }
}

export async function validateCategoryBelongsToProfile(categoryId, profileId) {
  const category = await db.categories.get(categoryId)
  if (!category || category.profileId !== profileId) {
    throw new Error(`Category ${categoryId} does not belong to profile ${profileId}`)
  }
}

export async function validateTodoExists(todoId) {
  const todo = await db.todos.get(todoId)
  if (!todo) {
    throw new Error(`Todo ${todoId} does not exist`)
  }
}

export async function validateTodoBelongsToProfile(todoId, profileId) {
  const todo = await db.todos.get(todoId)
  if (!todo || todo.profileId !== profileId) {
    throw new Error(`Todo ${todoId} does not belong to profile ${profileId}`)
  }
}

// Schema validation for import/export
export function validateImportSchema(data) {
  if (!data.profile || typeof data.profile !== 'object') {
    throw new Error('Invalid import: missing or invalid profile')
  }

  if (!Array.isArray(data.categories)) {
    throw new Error('Invalid import: categories must be an array')
  }

  if (!Array.isArray(data.todos)) {
    throw new Error('Invalid import: todos must be an array')
  }

  if (data.settings && typeof data.settings !== 'object') {
    throw new Error('Invalid import: invalid settings object')
  }

  // Validate profile has required fields
  if (!data.profile.name || !data.profile.createdAt) {
    throw new Error('Invalid import: profile missing required fields (name, createdAt)')
  }

  // Validate categories have required fields
  for (const cat of data.categories) {
    if (!cat.name || !cat.type || cat.order === undefined) {
      throw new Error('Invalid import: category missing required fields (name, type, order)')
    }
  }

  // Validate todos have required fields
  for (const todo of data.todos) {
    if (!todo.title || todo.done === undefined) {
      throw new Error('Invalid import: todo missing required fields (title, done)')
    }
  }

  return true
}

// Rollback queue for transaction-like behavior
export class RollbackQueue {
  constructor() {
    this.operations = []
  }

  add(rollbackFn) {
    this.operations.push(rollbackFn)
  }

  async execute() {
    for (const fn of this.operations.reverse()) {
      await fn()
    }
  }
}
