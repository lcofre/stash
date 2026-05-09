import { db } from '../db/index.js'

export async function createProfile(name) {
  if (!name?.trim()) throw new Error('Profile name is required')

  const id = await db.profiles.add({
    name: name.trim(),
    createdAt: new Date(),
  })

  await db.settings.add({ profileId: id })
  return id
}

export async function updateProfile(profileId, updates) {
  return db.profiles.update(profileId, {
    ...updates,
    updatedAt: new Date(),
  })
}

export async function deleteProfile(profileId) {
  await db.todos.where('profileId').equals(profileId).delete()
  await db.categories.where('profileId').equals(profileId).delete()
  await db.settings.delete(profileId)
  return db.profiles.delete(profileId)
}

export async function renameProfile(profileId, newName) {
  if (!newName?.trim()) throw new Error('Profile name is required')
  return updateProfile(profileId, { name: newName.trim() })
}
