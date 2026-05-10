import { db } from '../db/index.js'
import { cascadeDeleteCategory } from './cascades.js'
import { validateCategoryExists, validateProfileExists } from './validation.js'

export async function createCategory({ profileId, name, type, icon, color }) {
  if (!name?.trim()) throw new Error('Category name is required')
  if (!['watch', 'read', 'todo', 'research', 'buy'].includes(type)) throw new Error('Invalid category type')
  await validateProfileExists(profileId)

  const order = await db.categories
    .where('profileId').equals(profileId)
    .toArray()
    .then(cats => Math.max(0, ...cats.map(c => c.order || 0)) + 1)

  return db.categories.add({
    profileId,
    name: name.trim(),
    type,
    icon: icon || '◻',
    color: color || '#d4a856',
    order,
    createdAt: new Date(),
  })
}

export async function updateCategory(categoryId, updates) {
  return db.categories.update(categoryId, {
    ...updates,
    updatedAt: new Date(),
  })
}

export async function deleteCategory(categoryId) {
  await validateCategoryExists(categoryId)
  return cascadeDeleteCategory(categoryId)
}

export async function reorderCategories(profileId, categoryIds) {
  const updates = categoryIds.map((id, index) => ({
    key: id,
    changes: { order: index, updatedAt: new Date() },
  }))
  return db.categories.bulkUpdate(updates)
}
