// Single source of truth for category type system

export const CATEGORY_TYPES = {
  WATCH: 'watch',
  READ: 'read',
  TODO: 'todo',
  RESEARCH: 'research',
  BUY: 'buy',
}

// Metadata schema for each type
// Defines what fields are allowed and which are required
const METADATA_SCHEMAS = {
  [CATEGORY_TYPES.WATCH]: {
    fields: ['mediaType', 'tmdbRating', 'year', 'genres', 'posterPath', 'overview', 'ratings'],
    required: [],
  },
  [CATEGORY_TYPES.READ]: {
    fields: ['authors', 'coverUrl', 'publishedYear', 'pageCount', 'description'],
    required: [],
  },
  [CATEGORY_TYPES.TODO]: {
    fields: [],
    required: [],
  },
  [CATEGORY_TYPES.RESEARCH]: {
    fields: [],
    required: [],
  },
  [CATEGORY_TYPES.BUY]: {
    fields: [],
    required: [],
  },
}

// Renderers — display the todo's title area. Dispatched on category type
// rather than fingerprinting `todo.metadata`. The dispatch table lives in
// `src/rendererRegistry.js` to keep `domain/` free of React imports and to
// avoid an import cycle (the registry uses string literals, not
// CATEGORY_TYPES, to stay acyclic — see that file).
import { RENDERER_REGISTRY, DEFAULT_RENDERER } from '../rendererRegistry.js'

export function getRenderer(categoryType) {
  return RENDERER_REGISTRY[categoryType] || DEFAULT_RENDERER
}

// Enrichers (return the component to render)
// These are lazy-loaded to avoid circular dependencies
let enricherCache = {}

export function getEnricher(categoryType) {
  if (enricherCache[categoryType]) return enricherCache[categoryType]

  let enricher = null
  if (categoryType === CATEGORY_TYPES.WATCH) {
    enricher = require('../components/enrichers/WatchEnricher').default
  } else if (categoryType === CATEGORY_TYPES.READ) {
    enricher = require('../components/enrichers/ReadEnricher').default
  }

  if (enricher) enricherCache[categoryType] = enricher
  return enricher || null
}

// Metadata validation
export function validateMetadata(metadata, categoryType) {
  if (!metadata) return { valid: true, errors: {} }

  const schema = METADATA_SCHEMAS[categoryType]
  if (!schema) return { valid: true, errors: {} }

  const errors = {}

  // Check required fields
  schema.required.forEach(field => {
    if (metadata[field] === undefined || metadata[field] === null) {
      errors[field] = `Required for ${categoryType}`
    }
  })

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

// Get metadata schema for a type
export function getMetadataSchema(categoryType) {
  return METADATA_SCHEMAS[categoryType] || { fields: [], required: [] }
}

// Check if a category type is valid
export function isValidCategoryType(type) {
  return Object.values(CATEGORY_TYPES).includes(type)
}

// Get all category types as array (for dropdowns, etc.)
export function getCategoryTypesList() {
  return Object.values(CATEGORY_TYPES)
}
