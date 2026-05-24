import { render, screen } from '@testing-library/react'
import ContentRenderer from '../../src/components/ContentRenderer.jsx'

const watchCat = { id: 'c1', name: 'To Watch', type: 'watch' }
const readCat = { id: 'c2', name: 'To Read', type: 'read' }
const todoCat = { id: 'c3', name: 'To Do', type: 'todo' }

describe('ContentRenderer', () => {
  it('renders plain title for a todo category', () => {
    const todo = { id: 1, title: 'Buy groceries', done: false, metadata: null }
    render(<ContentRenderer todo={todo} category={todoCat} />)
    expect(screen.getByText('Buy groceries')).toBeInTheDocument()
  })

  it('renders plain title when category is undefined (fallback)', () => {
    const todo = { id: 1, title: 'Lonely todo', done: false, metadata: null }
    render(<ContentRenderer todo={todo} />)
    expect(screen.getByText('Lonely todo')).toBeInTheDocument()
  })

  it('renders movie title with year for a watch todo', () => {
    const todo = {
      id: 1, title: 'Inception', done: false,
      metadata: { mediaType: 'movie', year: 2010, tmdbRating: '8.8' }
    }
    render(<ContentRenderer todo={todo} category={watchCat} />)
    expect(screen.getByText('Inception')).toBeInTheDocument()
    expect(screen.getByText('2010')).toBeInTheDocument()
  })

  it('renders film/series type label for watch todo', () => {
    const todo = {
      id: 1, title: 'The Crown', done: false,
      metadata: { mediaType: 'tv' }
    }
    render(<ContentRenderer todo={todo} category={watchCat} />)
    expect(screen.getByText(/series/)).toBeInTheDocument()
  })

  it('renders book author for a read todo', () => {
    const todo = {
      id: 1, title: 'Dune', done: false,
      metadata: { googleId: 'abc123', authors: 'Frank Herbert', publishedYear: 1965 }
    }
    render(<ContentRenderer todo={todo} category={readCat} />)
    expect(screen.getByText('Dune')).toBeInTheDocument()
    expect(screen.getByText(/Frank Herbert/)).toBeInTheDocument()
  })

  it('applies strikethrough style when todo is done', () => {
    const todo = { id: 1, title: 'Done task', done: true, metadata: null }
    render(<ContentRenderer todo={todo} category={todoCat} />)
    const titleEl = screen.getByText('Done task')
    expect(titleEl).toHaveStyle({ textDecoration: 'line-through' })
  })

  it('dispatches by category.type, not by metadata fingerprint (mediaType on read category renders book layout)', () => {
    // A todo whose metadata accidentally has mediaType but lives in a read category
    // should follow the category's renderer, not metadata fingerprint.
    const todo = {
      id: 1, title: 'Dune', done: false,
      metadata: { authors: 'Frank Herbert', mediaType: 'movie' }
    }
    render(<ContentRenderer todo={todo} category={readCat} />)
    // Read layout shows authors; movie layout would show "film"/"series" label.
    expect(screen.getByText(/Frank Herbert/)).toBeInTheDocument()
    expect(screen.queryByText(/series/)).not.toBeInTheDocument()
    expect(screen.queryByText(/^film$/)).not.toBeInTheDocument()
  })
})
