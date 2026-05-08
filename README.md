# Stash

A personal, categorized todo list PWA. Install it on Android from your browser — no app store needed.

**Built-in category types:**
- 🎬 **To Watch** — search movies & TV shows via TMDB, shows ratings from TMDB + IMDb + Rotten Tomatoes
- 📚 **To Read** — search books via Google Books, shows cover, author, page count
- 🔍 **To Research** — save URLs with notes
- ✅ **To Do** — general todos
- 🛒 **To Buy** — shopping items

All categories are customizable per profile. Add/remove categories and choose the type, icon, and color.

## Features

- Offline-first via IndexedDB (no account needed)
- Multiple profiles on the same device
- Optional date field on any item — calendar view shows all dated items
- Export/import your data as JSON
- Installable as a PWA on Android (and desktop)

## Setup

```bash
npm install
npm run dev
```

## API Keys (optional)

Add your keys in **Settings → API Keys**:

- **TMDB** — free at [themoviedb.org](https://www.themoviedb.org/settings/api) — enables movie/TV search and metadata
- **OMDB** — free at [omdbapi.com](https://www.omdbapi.com/apikey.aspx) — adds IMDb + Rotten Tomatoes scores

Keys are stored locally in your browser and never sent to any server.

## Deploy

```bash
npm run build
```

Deploy the `dist/` folder to Vercel, Netlify, or GitHub Pages.
