# Farm Expense HQ

A full-stack Next.js app to track farm expenses, yields, weather, and AI insights, with multilingual UI (English/Hindi/Marathi).

## Quick Start
1) Install deps: `npm i`  
2) Configure `.env.local` (see Environment)  
3) Dev server: `npm run dev`  
4) Production: `npm run build && npm start`

## Scripts
- `npm run dev`: Next.js dev server
- `npm run build`: Production build
- `npm start`: Run production build
- `npm run lint`: Lint using ESLint

## Tech Stack
- Next.js 16 (App Router, Turbopack), React 19
- Tailwind CSS v4 (design tokens via CSS variables)
- MongoDB via Mongoose
- SWR fetch utilities
- jsPDF + jspdf-autotable (PDF), SheetJS (Excel)

## Environment
Add these to `.env.local`:
- `MONGODB_URI` – MongoDB connection string
- `JWT_SECRET` – token signing
- `OPENWEATHER_API_KEY` – OpenWeather data
- `GEMINI_API_KEY` – Gemini for AI insights

Restart the dev server after changes.

## Project Layout
```
app/                      # App Router
  (dashboard)/            # Authenticated dashboard
  api/                    # Route handlers (REST)
components/               # Reusable UI and providers
lib/                      # db, models, analytics, i18n, weather
locales/                  # i18n JSON dictionaries (en/hi/mr)
public/                   # static assets
```

## Providers
- Theme: `components/ThemeProvider` sets `data-theme` and persists choice.
- i18n: `lib/i18n` exposes `I18nProvider` and `useI18n()`.
  - Dictionaries: `locales/en.json`, `locales/hi.json`, `locales/mr.json`
  - Usage (client components only):
    ```js
    'use client'
    import { useI18n } from '@/lib/i18n'
    const { t } = useI18n()
    return <h1>{t('hero.title')}</h1>
    ```
  - Language selector: `components/LanguageToggle`

## Data & API
- Auth endpoints under `app/api/auth/*`
- Core resources: `crops`, `expenses`, `yields`, `summary`, `weather`, `insights`
- Reports: `GET /api/reports?demo=true` (demo) or `GET /api/reports?userId=...` (auth)
  - Exports ZIP with PDF and Excel. Currency printed as `INR 12.34` to avoid PDF glyph issues.

## Demo Mode
Toggle in the sidebar. Loads sample user, crops, expenses, yields, weather, and insights without login.

## Internationalization Coverage
- Landing page (hero/nav/footer)
- Sidebar/navigation labels
- Overview, Insights, Weather pages and widgets
- Extend by adding keys to `locales/*.json` and replacing literals with `t('...')`.

## Common Dev Tips
- Seeing stale runtime errors? Stop dev server, delete `.next/`, restart.
- Weather blank? Ensure `OPENWEATHER_API_KEY` and a 6‑digit pincode in profile.
- AI blank? Ensure `GEMINI_API_KEY` or enable Demo Mode from the sidebar.
