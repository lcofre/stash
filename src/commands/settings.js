import { db } from '../db/index.js'

const VALID_SETTINGS_KEYS = ['tmdbApiKey', 'omdbApiKey', 'ratingSources']

export async function updateSettings(profileId, updates) {
  // Validate that only known keys are being updated
  const invalidKeys = Object.keys(updates).filter(k => !VALID_SETTINGS_KEYS.includes(k))
  if (invalidKeys.length > 0) {
    throw new Error(`Invalid settings keys: ${invalidKeys.join(', ')}`)
  }

  return db.settings.update(profileId, updates)
}

export async function updateApiKey(profileId, keyName, value) {
  if (!['tmdbApiKey', 'omdbApiKey'].includes(keyName)) {
    throw new Error(`Invalid API key: ${keyName}`)
  }
  return updateSettings(profileId, { [keyName]: value })
}

export async function getSettings(profileId) {
  return db.settings.get(profileId)
}
