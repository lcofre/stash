# Stash Domain Context

## Core Concepts

### Profile
A user's isolated instance. Each profile has its own categories and todos. Users can switch between profiles (e.g., "Work", "Personal").

### Category
A grouping for todos (To Watch, To Read, To Do, etc.). Each category has a **type** that determines how todos are enriched and displayed.

### Category Type
Determines what enrichment metadata a todo can have and how it's displayed:
- **Watch**: Movies/TV shows. Enriched with TMDB/OMDB data (rating, year, genres, poster).
- **Read**: Books. Enriched with Google Books data (author, cover, page count).
- **Todo**: Generic tasks. No enrichment.
- **Research**: Research topics. Can have URLs.
- **Buy**: Shopping items. No standard enrichment.

When a todo's category type changes, its metadata is cleared (to avoid data pollution—a "To Do" shouldn't have movie metadata).

Metadata schema for each type lives in `domain/categoryTypes.js`.

### Todo
An item in the user's stash. Has:
- **title** (required)
- **categoryId** (required, determines type)
- **done** (boolean, marks completion)
- **date** (optional, for calendar view)
- **notes** (optional, user's thoughts)
- **url** (optional, relevant link)
- **metadata** (optional, enrichment data based on category type)

### View Modes
The app has two view modes:
- **Category View**: Shows todos for a selected category (or all todos if no category selected). Todos are split into pending and done.
- **Calendar View**: Shows all pending todos with dates, organized by date in a calendar grid.

View mode is controlled by `activeCategoryId` in App state. The special value `'__calendar__'` triggers calendar view (see TODO: #4 for refactoring this).

### Enrichment
Process of augmenting a todo with external data:
1. User selects a search result (via SearchEnricher) or types manually
2. Enricher adapter (movieAdapter, bookAdapter) calls external API and returns metadata
3. Metadata is stored in the todo
4. ContentRenderer displays it in TodoCard

Example: WatchEnricher → SearchEnricher → movieAdapter.onSelect() → calls TMDB API → returns {tmdbRating, year, genres, ...} → stored in todo.metadata → TodoCard.ContentRenderer displays it.

---

## Data Layer

### Hooks

Three purposeful hooks own data fetching, filtering, and sorting. **Components never sort or filter data; hooks do.**

#### `useTodos(categoryId, options?)`
For category view and most list views.

Returns: `{pending: Todo[], done: Todo[], all: Todo[], isLoading: boolean}`

Options:
- `sort`: `'createdAt'` (default) or `'date'`

**Filtering rules (baked in):**
- If categoryId is null, returns all profile todos
- If categoryId is provided, filters by that category
- Splits into pending (done=false) and done (done=true)
- Applies sort to both

#### `useTodosByProfile(profileId, options?)`
For app-level access to all profile todos.

Returns: `{pending: Todo[], done: Todo[], all: Todo[], isLoading: boolean}`

Options:
- `sort`: `'createdAt'` (default) or `'date'`

**Filtering rules:**
- All todos for the profile, split into pending/done

#### `useCalendarTodos(categoryId?, options?)`
For calendar view only.

Returns: `{byDate: Record<string, Todo[]>, isLoading: boolean}`

Where Record key is ISO date string: `{'2026-05-10': [todos], '2026-05-11': [todos]}`

**Filtering rules (baked in):**
- Only todos with dates (date !== null)
- Only pending todos (done=false)
- Grouped by date, unsorted within each day
- Optionally filtered by categoryId

---

## Form State

### useTodoForm(initialTodo?)
Manages todo form state for add/edit modals.

Returns: `{form, updateField, changeCategoryId, reset, validateMetadata}`

- `form`: `{title, notes, date, url, categoryId, metadata}`
- `updateField(field, value)`: Update a single field
- `changeCategoryId(newId)`: Change category (clears metadata on type change)
- `reset()`: Reset to initial state
- `validateMetadata(metadata, categoryType)`: Validate metadata against schema

**Key behavior:**
- When categoryId changes to a different type, metadata is cleared
- Metadata validation is optional at form level (components decide when to validate)
- Hook is lightweight; components still call todoCommands.addTodo/updateTodo

---

## Module: domain/categoryTypes.js

Single source of truth for category type system. Exports:
- `CATEGORY_TYPES`: enum of type names
- `getMetadataSchema(type)`: returns what fields/structure each type expects
- `validateMetadata(metadata, type)`: returns `{valid, errors}`
- `getEnricher(type)`: returns enricher component
- `getRenderer(type)`: returns renderer component (optional; can stay in components/)

Components should call these functions when:
- Building type dropdown (CATEGORY_TYPES)
- Validating form metadata (validateMetadata)
- Getting enricher to show (getEnricher)

---

## Testing Strategy

### Data Layer Hooks
Mock `db` (Dexie) once. All three hooks share the same mock. Test:
- Sorting behavior (pending first, then by createdAt/date)
- Filtering (done, date, categoryId)
- Real-time subscription (useLiveQuery behavior)

Example test:
```javascript
// __tests__/hooks/useTodos.test.js
it('returns {pending, done} split and sorted by createdAt', () => {
  // Mock db.todos.where().toArray() to return unsorted todos
  // Call useTodos(categoryId)
  // Assert pending are first, all are sorted by createdAt descending
})
```

### Form State Hook
No DB mocking needed. Test:
- State shape initialization
- updateField works
- changeCategoryId clears metadata
- validateMetadata calls domain/categoryTypes correctly

### Components (Post-Refactor)
No sorting/filtering logic to test. Instead, test:
- Component renders hook result correctly
- Component calls commands on save
- Error handling

Cleaner surface area because sorting/filtering moved to hooks.
