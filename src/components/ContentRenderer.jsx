import { createElement } from 'react'
import { getRenderer } from '../domain/categoryTypes.js'

// Thin dispatcher: picks a renderer based on the category's type.
// All layout logic lives in `src/components/renderers/*`.
// Adding a new enrichable type only requires changes to
// `src/domain/categoryTypes.js` + `src/rendererRegistry.js`.
// Note: we use `createElement` rather than `<Renderer />` to make it explicit
// that we are selecting an existing component from a static registry — no
// component is created at render time.
export default function ContentRenderer({ todo, category }) {
  return createElement(getRenderer(category?.type), { todo })
}
