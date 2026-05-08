import Dexie from 'dexie'

export const db = new Dexie('stash')

db.version(1).stores({
  profiles:   '++id, name',
  categories: '++id, profileId, order',
  todos:      '++id, profileId, categoryId, done, date',
  settings:   'profileId',
})

export const DEFAULT_CATEGORIES = [
  { name: 'To Watch',    type: 'watch',    icon: '🎬', color: '#9B7FBD', order: 0 },
  { name: 'To Read',     type: 'read',     icon: '📚', color: '#5A9E7E', order: 1 },
  { name: 'To Research', type: 'research', icon: '🔍', color: '#C9913E', order: 2 },
  { name: 'To Do',       type: 'todo',     icon: '✅', color: '#6B9BD4', order: 3 },
  { name: 'To Buy',      type: 'buy',      icon: '🛒', color: '#C4767A', order: 4 },
]

export const CATEGORY_COLORS = [
  '#9B7FBD', '#6B9BD4', '#5A9E7E', '#C9913E', '#C4767A',
  '#7BBDB4', '#D4A05A', '#8FB87B', '#B87B9E', '#8A8A9E',
]

export const CATEGORY_ICONS = [
  '🎬', '📚', '🔍', '✅', '🛒', '🎵', '🎮', '✈️', '💼',
  '❤️', '⭐', '📝', '💡', '🎯', '🏋️', '🍕', '🌎', '📱', '💰', '🔧',
]

export async function createProfile(name) {
  const profileId = await db.profiles.add({ name, createdAt: new Date() })
  const cats = DEFAULT_CATEGORIES.map(c => ({ ...c, profileId }))
  await db.categories.bulkAdd(cats)
  await db.settings.add({ profileId, tmdbApiKey: '', omdbApiKey: '', ratingSources: ['tmdb', 'imdb'] })
  return profileId
}

export async function exportProfile(profileId) {
  const [profile, categories, todos, settings] = await Promise.all([
    db.profiles.get(profileId),
    db.categories.where('profileId').equals(profileId).toArray(),
    db.todos.where('profileId').equals(profileId).toArray(),
    db.settings.get(profileId),
  ])
  return JSON.stringify({ profile, categories, todos, settings }, null, 2)
}

export async function importProfile(json) {
  const data = JSON.parse(json)
  const { profile, categories, todos, settings } = data
  const newProfileId = await db.profiles.add({ name: profile.name + ' (imported)', createdAt: new Date() })
  const idMap = {}
  for (const cat of categories) {
    const oldId = cat.id
    const { id: _id, ...rest } = cat
    const newId = await db.categories.add({ ...rest, profileId: newProfileId })
    idMap[oldId] = newId
  }
  for (const todo of todos) {
    const { id: _id, ...rest } = todo
    await db.todos.add({
      ...rest,
      profileId: newProfileId,
      categoryId: idMap[todo.categoryId] ?? todo.categoryId,
    })
  }
  if (settings) {
    const { profileId: _pid, ...restSettings } = settings
    await db.settings.add({ ...restSettings, profileId: newProfileId })
  }
  return newProfileId
}
