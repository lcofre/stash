# Domain Docs: Structure and Consumer Rules

This repo uses **single-context** domain documentation. All domain knowledge, architectural decisions, and terminology live in two places at the repo root:

- **`CONTEXT.md`** — the domain language and model
- **`docs/adr/`** — architectural decision records

## CONTEXT.md: Domain Language

Create a `CONTEXT.md` file at the repo root to define the **ubiquitous language** of the project. This is not a generic guide; it's the specific vocabulary that the codebase uses.

### What goes in CONTEXT.md

- **Entities and concepts** — the nouns and verbs of the domain (e.g., "A Profile is a named container for categories and todos. A Category is user-defined and type-aware (watch, read, todo). A Todo is an item with optional metadata enriched from external APIs.")
- **Relationships** — how concepts relate (e.g., "A Profile owns Categories. A Category owns Todos.")
- **Invariants** — rules that must always be true (e.g., "A Category's type determines what metadata can be attached to its Todos.")
- **Terminology** — what words mean in this codebase (e.g., "enrichment" means fetching external data (TMDB, Google Books) and embedding it as metadata; "seam" is a place where behaviour can be altered without editing in place)

### What doesn't go in CONTEXT.md

- Code structure or file paths (those change; concepts don't)
- Implementation details (how data is stored, which library is used)
- Generic software patterns (don't define "component" or "module" — those are universally understood)

### Format

Use **markdown headers and short paragraphs**. The goal is **readability for humans**, not completeness. When the `improve-codebase-architecture` skill reads this, it uses it to name good seams and recognize when two pieces of code are solving the same problem in different ways.

Example:

```markdown
## Entities

### Profile
A named container for a user's categories and todos. Users can create multiple profiles and switch between them. Each profile has its own category set, todo list, and settings (API keys for enrichment).

### Category
A user-defined container for todos. Has a name, color, icon, and **type** (watch, read, or todo). Type is immutable and determines what metadata can be attached to todos in the category.

### Todo
An item with a title, optional notes, optional due date, and optional metadata. The shape of metadata is determined by its category's type.

## Terminology

**Enrichment**: The process of fetching external data (movie ratings from TMDB, book covers from Google Books) and embedding it as metadata on a todo. Each enricher is responsible for search, selection, and normalization.

**Seam**: A place where behaviour can be altered without editing the module in place. Example: the enricher interface is a seam — adding a new enricher (e.g., podcasts) doesn't require changes to existing code, only a new adapter.
```

## docs/adr/: Architectural Decision Records

Create a `docs/adr/` directory at the repo root. Each file is one ADR — a record of an important architectural decision and its rationale.

### Format

Each ADR is a markdown file named `ADR-NNNN-slug.md` (e.g., `ADR-0001-offline-first.md`). Use this structure:

```markdown
# ADR-0001: Offline-first architecture

## Status
Accepted

## Context
Users want to use the app on mobile without a server dependency. This rules out requiring signup or real-time sync.

## Decision
We use Dexie (IndexedDB) for client-side persistence. No server required. Users can export/import data for portability.

## Consequences
- Pro: instant responsiveness, no account required, privacy-respecting
- Con: no real-time sync across devices; import/export is the sync mechanism
```

### Why ADRs matter for skills

When the `improve-codebase-architecture` skill proposes a refactor, it checks whether an ADR already forbids it. For example, if an ADR says "we avoid real-time sync," the skill won't suggest adding a WebSocket layer. ADRs prevent re-litigating settled decisions.

### When to write an ADR

Write an ADR when you've made a decision that:
1. Is load-bearing (if you reverse it, the codebase changes significantly)
2. Has trade-offs (there were real alternatives considered)
3. Is non-obvious to a future reader (or to an AI reviewing the code)

Don't write an ADR for every choice (e.g., "we use Vite" is obvious from `vite.config.js`).

## Multi-context repos (monorepos)

If this repo has separate frontend and backend with different domain languages, create:

- `CONTEXT-MAP.md` at the root (lists all contexts and where to find them)
- `frontend/CONTEXT.md` + `frontend/docs/adr/`
- `backend/CONTEXT.md` + `backend/docs/adr/`

The skill will look for `CONTEXT-MAP.md` and read per-context docs from the paths you list.

## How skills use these docs

- **`improve-codebase-architecture`** — reads `CONTEXT.md` to find domain seams and name good refactors; reads ADRs to avoid suggesting decisions that are already settled
- **`diagnose`** — reads `CONTEXT.md` to understand invariants and catch bugs that violate them
- **`tdd`** — reads `CONTEXT.md` to write tests that verify domain invariants, not just code correctness
