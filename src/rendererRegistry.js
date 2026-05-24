// Maps category types to their renderer components.
// Lives outside `domain/` so `domain/categoryTypes.js` can import this
// registry without a cycle. To keep that import acyclic, this file does NOT
// import `CATEGORY_TYPES` — it uses the same string literals instead.
// Keep these keys in sync with `CATEGORY_TYPES` in `domain/categoryTypes.js`.

import WatchRenderer from './components/renderers/WatchRenderer.jsx'
import ReadRenderer from './components/renderers/ReadRenderer.jsx'
import PlainRenderer from './components/renderers/PlainRenderer.jsx'

export const RENDERER_REGISTRY = {
  watch: WatchRenderer,
  read: ReadRenderer,
  todo: PlainRenderer,
  research: PlainRenderer,
  buy: PlainRenderer,
}

export const DEFAULT_RENDERER = PlainRenderer
