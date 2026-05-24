// Registry mapping category type → enricher React component.
//
// This module sits above the domain/components split: it imports React
// components (an upward dependency for `domain/categoryTypes.js`) while
// `domain` only consults the registry through the exposed lookup. That
// removes the previous circular dependency that forced CommonJS `require()`
// calls inside `domain/categoryTypes.js`.
import WatchEnricher from './components/enrichers/WatchEnricher.jsx'
import ReadEnricher from './components/enrichers/ReadEnricher.jsx'
import { CATEGORY_TYPES } from './domain/categoryTypes.js'

const ENRICHERS = {
  [CATEGORY_TYPES.WATCH]: WatchEnricher,
  [CATEGORY_TYPES.READ]: ReadEnricher,
}

export function getEnricher(categoryType) {
  return ENRICHERS[categoryType] || null
}
