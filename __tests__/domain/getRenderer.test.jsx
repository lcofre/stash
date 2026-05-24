import { render, screen } from '@testing-library/react'
import { getRenderer, CATEGORY_TYPES } from '../../src/domain/categoryTypes.js'
import WatchRenderer from '../../src/components/renderers/WatchRenderer.jsx'
import ReadRenderer from '../../src/components/renderers/ReadRenderer.jsx'
import PlainRenderer from '../../src/components/renderers/PlainRenderer.jsx'

describe('getRenderer', () => {
  it('returns WatchRenderer for watch type', () => {
    expect(getRenderer(CATEGORY_TYPES.WATCH)).toBe(WatchRenderer)
  })

  it('returns ReadRenderer for read type', () => {
    expect(getRenderer(CATEGORY_TYPES.READ)).toBe(ReadRenderer)
  })

  it('returns PlainRenderer for todo type', () => {
    expect(getRenderer(CATEGORY_TYPES.TODO)).toBe(PlainRenderer)
  })

  it('returns PlainRenderer for research type', () => {
    expect(getRenderer(CATEGORY_TYPES.RESEARCH)).toBe(PlainRenderer)
  })

  it('returns PlainRenderer for buy type', () => {
    expect(getRenderer(CATEGORY_TYPES.BUY)).toBe(PlainRenderer)
  })

  it('returns PlainRenderer for unknown/undefined type', () => {
    expect(getRenderer(undefined)).toBe(PlainRenderer)
    expect(getRenderer('nonsense')).toBe(PlainRenderer)
  })

  it('returned renderer renders the todo title', () => {
    const Renderer = getRenderer(CATEGORY_TYPES.TODO)
    render(<Renderer todo={{ id: 1, title: 'hello', done: false, metadata: null }} />)
    expect(screen.getByText('hello')).toBeInTheDocument()
  })
})
