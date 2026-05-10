import { db } from '../db/index.js'

// Define entity dependencies for cascading deletion
// Key: entity type to delete
// Value: array of { entity, query } describing what to delete first
const CASCADE_RULES = {
  profile: [
    { entity: 'todos', query: (id) => db.todos.where('profileId').equals(id) },
    { entity: 'categories', query: (id) => db.categories.where('profileId').equals(id) },
    { entity: 'settings', query: (id) => [db.settings.delete(id)] }, // single delete
  ],
  category: [
    { entity: 'todos', query: (id) => db.todos.where('categoryId').equals(id) },
  ],
}

async function executeCascade(entityType, id) {
  const rules = CASCADE_RULES[entityType]
  if (!rules) throw new Error(`No cascade rules defined for entity type: ${entityType}`)

  for (const rule of rules) {
    const result = rule.query(id)
    // Check if it's an array (for single deletes) or a query
    if (Array.isArray(result)) {
      await Promise.all(result)
    } else {
      await result.delete()
    }
  }
}

export async function cascadeDeleteProfile(profileId) {
  await executeCascade('profile', profileId)
  return db.profiles.delete(profileId)
}

export async function cascadeDeleteCategory(categoryId) {
  await executeCascade('category', categoryId)
  return db.categories.delete(categoryId)
}
