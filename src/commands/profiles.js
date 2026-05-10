import { db, DEFAULT_CATEGORIES } from '../db/index.js'
import { cascadeDeleteProfile } from './cascades.js'
import { validateProfileExists, validateProfileCount } from './validation.js'

export async function createProfile(name) {
  if (!name?.trim()) throw new Error('Profile name is required')

  const id = await db.profiles.add({
    name: name.trim(),
    createdAt: new Date(),
  })

  const categories = DEFAULT_CATEGORIES.map(c => ({ ...c, profileId: id }))
  await db.categories.bulkAdd(categories)
  await db.settings.add({ profileId: id, tmdbApiKey: '', omdbApiKey: '', ratingSources: ['tmdb', 'imdb'] })
  return id
}

export async function updateProfile(profileId, updates) {
  return db.profiles.update(profileId, {
    ...updates,
    updatedAt: new Date(),
  })
}

export async function deleteProfile(profileId) {
  await validateProfileExists(profileId)

  // Check that at least one other profile exists
  const profiles = await db.profiles.toArray()
  if (profiles.length === 1) {
    throw new Error('Cannot delete the last profile. Create another profile first.')
  }

  return cascadeDeleteProfile(profileId)
}

export async function renameProfile(profileId, newName) {
  if (!newName?.trim()) throw new Error('Profile name is required')
  return updateProfile(profileId, { name: newName.trim() })
}
