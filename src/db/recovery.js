// Database recovery utilities for handling corrupted IndexedDB data
import { db } from './index.js'

export async function validateDatabase() {
  try {
    // Try to query each table and verify data integrity
    const [profiles, categories, todos, settings] = await Promise.all([
      db.profiles.toArray(),
      db.categories.toArray(),
      db.todos.toArray(),
      db.settings.toArray(),
    ])

    const issues = []

    if (!Array.isArray(profiles)) issues.push('profiles table is corrupted')
    if (!Array.isArray(categories)) issues.push('categories table is corrupted')
    if (!Array.isArray(todos)) issues.push('todos table is corrupted')
    if (!Array.isArray(settings)) issues.push('settings table is corrupted')

    // Check for malformed todo objects
    if (Array.isArray(todos)) {
      todos.forEach((todo, idx) => {
        if (!todo.id || typeof todo.title !== 'string') {
          issues.push(`todo at index ${idx} is malformed`)
        }
      })
    }

    return {
      isValid: issues.length === 0,
      issues,
      stats: {
        profiles: Array.isArray(profiles) ? profiles.length : 'corrupted',
        categories: Array.isArray(categories) ? categories.length : 'corrupted',
        todos: Array.isArray(todos) ? todos.length : 'corrupted',
        settings: Array.isArray(settings) ? settings.length : 'corrupted',
      }
    }
  } catch (error) {
    return {
      isValid: false,
      issues: [error.message],
      error: error.toString()
    }
  }
}

export async function clearDatabase() {
  try {
    await db.delete()
    await db.open()
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
