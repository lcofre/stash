import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/index.js'

export function useProfile(profileId) {
  return useLiveQuery(() => db.profiles.get(profileId), [profileId])
}

export function useProfileList() {
  return useLiveQuery(() => db.profiles.toArray(), [])
}
