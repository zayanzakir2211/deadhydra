# Deadhydra

A personal dashboard / new-tab replacement built with React + Vite. No backend, no database — everything is stored in `localStorage`.

## Features

- Live clock + time-of-day greeting (customizable name, 12h/24h toggle)
- Search bar (Google / Bing / DuckDuckGo)
- Todo list with filters
- Quick links grid with auto-fetched favicons
- Weather via Open-Meteo (geolocation or manual city)
- Daily quote (ZenQuotes with a 30-quote offline fallback)
- Pomodoro / focus timer with browser notifications
- Daily-changing background photo (Picsum) or custom upload, solid color, or none
- Dark / light mode
- Drag-and-drop widget reordering (dnd-kit), with per-widget show/hide
- One settings panel controlling everything, with a full reset button

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Outputs a static site to `dist/`. Verify locally with:

```bash
npx serve dist
```

`vite.config.js` is set with `base: '/Deadhydra/'` to match GitHub Pages project-page hosting. If your repo has a different name/casing, update that value before deploying.
