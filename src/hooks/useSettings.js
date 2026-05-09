import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/index.js'

export function useSettings(profileId) {
  return useLiveQuery(() => db.settings.get(profileId), [profileId])
}
