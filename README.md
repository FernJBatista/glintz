# Glintz

Glintz is a Turborepo-powered Next.js monorepo for a habit-tracking dashboard. The current codebase includes a styled dashboard shell, theme and font personalization, seeded habit and log APIs, and shared UI/tooling packages.

The project is no longer a generic template. This README reflects the functionality that exists in the repo today.

## Current Status

- The web app runs as a Next.js App Router application in `apps/web`.
- The dashboard shell, sidebar navigation, theme switching, and per-theme font preferences are implemented.
- Habit, log, and dashboard summary APIs are implemented.
- Data persistence is currently in-memory with seeded sample data.
- Most dashboard pages are still placeholders and are not yet wired to the APIs.

## Tech Stack

- Next.js 16
- React 19
- Turborepo
- Tailwind CSS 4
- shadcn-style shared UI package in `packages/ui`
- Zod for request validation
- ESLint, Prettier, and shared TypeScript configs

## Monorepo Structure

```text
.
|-- apps/
|   `-- web/                  # Next.js app
|-- packages/
|   |-- ui/                   # Shared UI components, styles, utilities
|   |-- eslint-config/        # Shared ESLint configuration
|   `-- typescript-config/    # Shared TypeScript configuration
|-- package.json
`-- turbo.json
```

## Web App Overview

The app entry point redirects `/` to `/tracker`.

Current dashboard routes:

- `/tracker` - default landing page with placeholder tracker widgets
- `/home` - work-in-progress page
- `/statistics` - work-in-progress page
- `/notebook` - work-in-progress page
- `/support` - work-in-progress page
- `/wiki` - work-in-progress page

The sidebar exposes navigation for those sections and includes:

- Theme switching between `dark`, `forest`, and `lollypop`
- Per-theme font preferences for `mono`, `sans`, and `serif`
- A collapsible dashboard layout

## Domain Model

The current backend domain centers on habits and daily logs.

### Habit

- `id`
- `name`
- `description?`
- `color?`
- `icon?`
- `cadence`: `daily | weekly | custom`
- `targetCount?`
- `isArchived`
- `createdAt`
- `updatedAt`

### HabitLog

- `id`
- `habitId`
- `localDate` in `YYYY-MM-DD` format
- `value`
- `note?`
- `createdAt`
- `updatedAt`

### DashboardSummary

- `totalHabits`
- `completedToday`
- `pendingToday`
- `completionRate`

## API

All API routes live under `apps/web/app/api` and return JSON in one of these shapes:

```json
{ "success": true, "data": {} }
```

```json
{ "success": false, "error": "message" }
```

### Dashboard

#### `GET /api/dashboard`

Returns the dashboard summary for a given date.

Query params:

- `date` optional, format `YYYY-MM-DD`

Example:

```bash
curl "http://localhost:3000/api/dashboard?date=2026-04-16"
```

### Habits

#### `GET /api/habits`

Returns all active, non-archived habits.

#### `POST /api/habits`

Creates a habit.

Request body:

```json
{
  "name": "Morning stretch",
  "description": "5 minutes after waking up",
  "color": "#22c55e",
  "icon": "activity",
  "cadence": "daily",
  "targetCount": 1
}
```

#### `GET /api/habits/:id`

Returns a single habit by id.

#### `PATCH /api/habits/:id`

Partially updates a habit.

#### `DELETE /api/habits/:id`

Archives a habit. This is not a hard delete.

### Logs

#### `POST /api/logs`

Creates or updates a habit log for a specific `habitId` and `localDate`.

Request body:

```json
{
  "habitId": "habit_seed_1",
  "localDate": "2026-04-16",
  "value": 1,
  "note": "Done before breakfast"
}
```

## Seed Data and Persistence

The current server-side data layer uses an in-memory mock store in `apps/web/server/mock/db.ts`.

That means:

- The app starts with seeded sample habits and logs
- API changes are not persisted across server restarts
- There is no real database connection yet

The repository already separates concerns into repositories and services so the mock store can be replaced later with a persistent backend.

## Getting Started

### Requirements

- Node.js 20 or newer
- npm 11 or newer

### Install

```bash
npm install
```

### Run the app in development

```bash
npm run dev
```

This runs the monorepo dev pipeline through Turbo. The web app uses `next dev --turbopack`.

Open:

- `http://localhost:3000`

### Build for production

```bash
npm run build
```

### Start the production web server

```bash
cd apps/web
npm run start
```

## Workspace Scripts

From the repo root:

```bash
npm run dev
npm run build
npm run lint
npm run format
npm run typecheck
```

## Shared UI Package

`packages/ui` contains reusable UI building blocks, shared Tailwind styles, and utilities that can be consumed by workspace apps.

Example import:

```tsx
import { Button } from "@workspace/ui/components/button"
```

## Known Limitations

- The main dashboard pages are mostly placeholders.
- The frontend is not yet wired to the habit and dashboard APIs.
- There is no authentication layer.
- There is no persistent database configured.
- There are no documented environment variables required for the current implementation.

## Roadmap Direction

Based on the current code structure, the most natural next steps are:

- Connect dashboard pages to the existing APIs
- Replace the in-memory mock store with a real database-backed repository layer
- Expand tracker and statistics views beyond placeholder content
- Add automated tests around service and route behavior
