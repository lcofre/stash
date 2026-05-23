import { vi, describe, it, expect, beforeEach } from 'vitest'

vi.mock('../../src/db/index.js', () => ({
  db: {
    todos: {
      add: vi.fn().mockResolvedValue(1),
      get: vi.fn(),
      update: vi.fn().mockResolvedValue(1),
      delete: vi.fn(),
    },
    categories: {
      get: vi.fn(),
    },
    profiles: {
      get: vi.fn(),
    },
  },
}))

import { db } from '../../src/db/index.js'
import { addTodo, updateTodo } from '../../src/commands/todos.js'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('addTodo metadata validation', () => {
  it('strips unknown metadata fields before saving', async () => {
    // category type is 'watch', schema allows: mediaType, tmdbRating, year, genres, posterPath, overview, ratings
    // metadata has an unknown field 'unknownField'
    db.categories.get.mockResolvedValue({ id: 1, profileId: 1, type: 'watch' })
    db.profiles.get.mockResolvedValue({ id: 1 })

    await addTodo({
      profileId: 1,
      categoryId: 1,
      title: 'Inception',
      metadata: { mediaType: 'movie', tmdbRating: '8.8', unknownField: 'bad' },
    })

    const savedMetadata = db.todos.add.mock.calls[0][0].metadata
    expect(savedMetadata).not.toHaveProperty('unknownField')
    expect(savedMetadata).toHaveProperty('mediaType', 'movie')
    expect(savedMetadata).toHaveProperty('tmdbRating', '8.8')
  })

  it('passes null metadata through without validation', async () => {
    db.categories.get.mockResolvedValue({ id: 1, profileId: 1, type: 'todo' })
    db.profiles.get.mockResolvedValue({ id: 1 })

    await addTodo({ profileId: 1, categoryId: 1, title: 'Buy milk', metadata: null })

    const savedMetadata = db.todos.add.mock.calls[0][0].metadata
    expect(savedMetadata).toBeNull()
  })

  it('strips metadata to null when all fields are unknown for type', async () => {
    // 'todo' type has no allowed fields, so all metadata should be stripped
    db.categories.get.mockResolvedValue({ id: 1, profileId: 1, type: 'todo' })
    db.profiles.get.mockResolvedValue({ id: 1 })

    await addTodo({
      profileId: 1,
      categoryId: 1,
      title: 'Clean house',
      metadata: { unknownField: 'bad', anotherBad: 'also bad' },
    })

    const savedMetadata = db.todos.add.mock.calls[0][0].metadata
    expect(savedMetadata).toBeNull()
  })

  it('passes metadata through without stripping when no categoryId is provided', async () => {
    db.profiles.get.mockResolvedValue({ id: 1 })

    await addTodo({
      profileId: 1,
      categoryId: null,
      title: 'Uncategorized',
      metadata: { someField: 'value' },
    })

    const savedMetadata = db.todos.add.mock.calls[0][0].metadata
    expect(savedMetadata).toHaveProperty('someField', 'value')
  })

  it('keeps all valid fields for read category type', async () => {
    db.categories.get.mockResolvedValue({ id: 2, profileId: 1, type: 'read' })
    db.profiles.get.mockResolvedValue({ id: 1 })

    await addTodo({
      profileId: 1,
      categoryId: 2,
      title: 'Dune',
      metadata: { authors: ['Frank Herbert'], pageCount: 412, badField: 'strip me' },
    })

    const savedMetadata = db.todos.add.mock.calls[0][0].metadata
    expect(savedMetadata).toHaveProperty('authors')
    expect(savedMetadata).toHaveProperty('pageCount', 412)
    expect(savedMetadata).not.toHaveProperty('badField')
  })
})

describe('updateTodo metadata validation', () => {
  it('strips unknown metadata fields before saving', async () => {
    db.todos.get.mockResolvedValue({ id: 1, profileId: 1, categoryId: 1 })
    db.categories.get.mockResolvedValue({ id: 1, profileId: 1, type: 'watch' })

    await updateTodo(1, {
      metadata: { mediaType: 'movie', unknownField: 'bad' },
      categoryId: 1,
    })

    const savedMetadata = db.todos.update.mock.calls[0][1].metadata
    expect(savedMetadata).not.toHaveProperty('unknownField')
    expect(savedMetadata).toHaveProperty('mediaType', 'movie')
  })

  it('passes null metadata through without validation', async () => {
    db.todos.get.mockResolvedValue({ id: 1, profileId: 1, categoryId: 1 })
    db.categories.get.mockResolvedValue({ id: 1, profileId: 1, type: 'watch' })

    await updateTodo(1, { metadata: null, categoryId: 1 })

    const savedMetadata = db.todos.update.mock.calls[0][1].metadata
    expect(savedMetadata).toBeNull()
  })

  it('passes metadata through without stripping when no categoryId in updates', async () => {
    await updateTodo(1, { title: 'New title', metadata: { someField: 'value' } })

    const updatedData = db.todos.update.mock.calls[0][1]
    expect(updatedData.metadata).toHaveProperty('someField', 'value')
  })
})
