import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { ProfileProvider } from '../../src/contexts/ProfileContext.jsx'

// Mock the commands module - this is the natural seam at the boundary
vi.mock('../../src/commands/index.js', () => ({
  todos: {
    addTodo: vi.fn().mockResolvedValue(1),
    updateTodo: vi.fn().mockResolvedValue(undefined),
  },
}))

// Mock useCategories to avoid Dexie/IndexedDB in tests
vi.mock('../../src/hooks/useCategories.js', () => ({
  useCategories: vi.fn(),
}))

// Mock useSettings (used inside WatchEnricher) to avoid Dexie
vi.mock('../../src/hooks/useSettings.js', () => ({
  useSettings: () => ({ tmdbApiKey: '', omdbApiKey: '' }),
}))

// Stub out the real enricher components — we're testing the modal's
// dispatch via getEnricher, not the SearchEnricher implementation itself.
vi.mock('../../src/enricherRegistry.js', () => {
  function WatchStub(props) {
    return <div data-testid="enricher-watch" data-profile-id={props.profileId} />
  }
  function ReadStub() {
    return <div data-testid="enricher-read" />
  }
  return {
    getEnricher: (type) => {
      if (type === 'watch') return WatchStub
      if (type === 'read') return ReadStub
      return null
    },
  }
})

import TodoFormModal from '../../src/components/TodoFormModal.jsx'
import { todos as todoCommands } from '../../src/commands/index.js'
import { useCategories } from '../../src/hooks/useCategories.js'

const CATEGORIES = [
  { id: 1, name: 'To Watch', type: 'watch', icon: '🎬', color: '#9B7FBD', order: 0, profileId: 42 },
  { id: 2, name: 'To Read', type: 'read', icon: '📚', color: '#5A9E7E', order: 1, profileId: 42 },
  { id: 3, name: 'To Do', type: 'todo', icon: '✅', color: '#6B9BD4', order: 3, profileId: 42 },
]

function renderWithProfile(ui, { profileId = 42 } = {}) {
  return render(<ProfileProvider profileId={profileId}>{ui}</ProfileProvider>)
}

beforeEach(() => {
  vi.clearAllMocks()
  useCategories.mockReturnValue(CATEGORIES)
})

async function flushPromises() {
  // mutate is async — give the microtask queue a chance to settle
  await new Promise(resolve => setTimeout(resolve, 0))
  await new Promise(resolve => setTimeout(resolve, 0))
}

describe('TodoFormModal — add mode', () => {
  it('submits a new todo via addTodo with profileId and closes', async () => {
    const onClose = vi.fn()

    renderWithProfile(
      <TodoFormModal mode="add" categoryId={3} onClose={onClose} />
    )

    const titleInput = screen.getByPlaceholderText(/what needs doing/i)
    fireEvent.change(titleInput, { target: { value: 'Buy milk' } })

    fireEvent.click(screen.getByRole('button', { name: /stash it/i }))
    await flushPromises()

    expect(todoCommands.addTodo).toHaveBeenCalledTimes(1)
    const payload = todoCommands.addTodo.mock.calls[0][0]
    expect(payload).toMatchObject({
      profileId: 42,
      categoryId: 3,
      title: 'Buy milk',
    })
    expect(onClose).toHaveBeenCalled()
  })
})

describe('TodoFormModal — edit mode', () => {
  it('submits via updateTodo with the todo id and no profileId in payload', async () => {
    const onClose = vi.fn()
    const todo = {
      id: 99,
      title: 'Old title',
      notes: '',
      date: null,
      url: '',
      categoryId: 3,
      metadata: null,
    }

    renderWithProfile(
      <TodoFormModal mode="edit" todo={todo} onClose={onClose} />
    )

    const titleInput = screen.getByDisplayValue('Old title')
    fireEvent.change(titleInput, { target: { value: 'New title' } })

    fireEvent.click(screen.getByRole('button', { name: /update/i }))
    await flushPromises()

    expect(todoCommands.updateTodo).toHaveBeenCalledTimes(1)
    const [todoId, payload] = todoCommands.updateTodo.mock.calls[0]
    expect(todoId).toBe(99)
    expect(payload).toMatchObject({
      title: 'New title',
      categoryId: 3,
    })
    expect(payload.profileId).toBeUndefined()
    expect(onClose).toHaveBeenCalled()
  })
})

describe('TodoFormModal — enricher dispatch', () => {
  it('renders the watch enricher (looked up via getEnricher) for a watch category', () => {
    renderWithProfile(
      <TodoFormModal mode="add" categoryId={1} onClose={() => {}} />
    )
    expect(screen.getByTestId('enricher-watch')).toBeInTheDocument()
    // The modal passes profileId through so enrichers that need it (WatchEnricher) can use it
    expect(screen.getByTestId('enricher-watch')).toHaveAttribute('data-profile-id', '42')
    // Title input still uses watch-specific placeholder
    expect(screen.getByPlaceholderText(/title of movie or show/i)).toBeInTheDocument()
  })

  it('renders the read enricher for a read category', () => {
    renderWithProfile(
      <TodoFormModal mode="add" categoryId={2} onClose={() => {}} />
    )
    expect(screen.getByTestId('enricher-read')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/book title or link/i)).toBeInTheDocument()
  })

  it('does not render an enricher for plain todo category', () => {
    renderWithProfile(
      <TodoFormModal mode="add" categoryId={3} onClose={() => {}} />
    )
    expect(screen.queryByTestId('enricher-watch')).not.toBeInTheDocument()
    expect(screen.queryByTestId('enricher-read')).not.toBeInTheDocument()
  })
})
