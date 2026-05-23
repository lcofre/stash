import { render, screen } from '@testing-library/react'
import ContentRenderer from '../../src/components/ContentRenderer.jsx'

describe('ContentRenderer', () => {
  it('renders plain title for a todo without metadata', () => {
    const todo = { id: 1, title: 'Buy groceries', done: false, metadata: null }
    render(<ContentRenderer todo={todo} />)
    expect(screen.getByText('Buy groceries')).toBeInTheDocument()
  })

  it('renders movie title with year for a watch todo', () => {
    const todo = {
      id: 1, title: 'Inception', done: false,
      metadata: { mediaType: 'movie', year: 2010, tmdbRating: '8.8' }
    }
    render(<ContentRenderer todo={todo} />)
    expect(screen.getByText('Inception')).toBeInTheDocument()
    expect(screen.getByText('2010')).toBeInTheDocument()
  })

  it('renders film/series type label for watch todo', () => {
    const todo = {
      id: 1, title: 'The Crown', done: false,
      metadata: { mediaType: 'tv' }
    }
    render(<ContentRenderer todo={todo} />)
    expect(screen.getByText(/series/)).toBeInTheDocument()
  })

  it('renders book author for a read todo', () => {
    const todo = {
      id: 1, title: 'Dune', done: false,
      metadata: { googleId: 'abc123', authors: 'Frank Herbert', publishedYear: 1965 }
    }
    render(<ContentRenderer todo={todo} />)
    expect(screen.getByText('Dune')).toBeInTheDocument()
    expect(screen.getByText(/Frank Herbert/)).toBeInTheDocument()
  })

  it('applies strikethrough style when todo is done', () => {
    const todo = { id: 1, title: 'Done task', done: true, metadata: null }
    render(<ContentRenderer todo={todo} />)
    const titleEl = screen.getByText('Done task')
    expect(titleEl).toHaveStyle({ textDecoration: 'line-through' })
  })
})
