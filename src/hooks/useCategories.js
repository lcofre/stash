import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/index.js'

export function useCategories(profileId) {
  return useLiveQuery(
    () => profileId ? db.categories.where('profileId').equals(profileId).sortBy('order') : [],
    [profileId]
  )
}
