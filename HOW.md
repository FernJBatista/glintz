# How To Use Habit Data

This document explains how habit-related backend data can be used in the frontend with the project structure that exists today.

It is intentionally based on the current codebase, not on future plans.

## What Exists Right Now

The repo already has:

- A Next.js app in `apps/web`
- Route handlers under `apps/web/app/api`
- A service layer under `apps/web/server/services`
- A repository layer under `apps/web/server/repositories`
- An in-memory seeded data store under `apps/web/server/mock/db.ts`
- Shared TypeScript types in `apps/web/types/habit.ts`

The current data flow is:

```text
Frontend page/component
  -> /api route handlers
  -> server services
  -> repositories
  -> in-memory mock DB
```

For server-rendered pages inside the same app, there is also a second option:

```text
Server component
  -> server services directly
  -> repositories
  -> in-memory mock DB
```

## What Is Possible Now

You can already:

- Read the list of active habits
- Read a single habit by id
- Create a habit
- Update a habit
- Archive a habit
- Create or update a daily log entry for a habit
- Read a dashboard summary for a given date
- Render that data in the frontend from either server or client components

## What Is Not Implemented Yet

Important current limitations:

- Data is not persisted to a real database
- Restarting the server resets the data back to the seed state
- The current dashboard pages are mostly placeholders
- There is no shared frontend fetch wrapper yet
- There is no auth layer
- There is no existing UI connected to these APIs yet

## Available Types

These types already exist in `apps/web/types/habit.ts`:

- `Habit`
- `HabitLog`
- `DashboardSummary`

The API response wrapper already exists in `apps/web/lib/api-response.ts`:

- Success shape: `{ success: true, data: ... }`
- Failure shape: `{ success: false, error: string }`

## Available Endpoints

### `GET /api/habits`

Returns active habits only.

### `POST /api/habits`

Creates a new habit.

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

### `GET /api/habits/:id`

Returns one habit by id.

### `PATCH /api/habits/:id`

Partially updates a habit.

### `DELETE /api/habits/:id`

Archives a habit instead of deleting it permanently.

### `POST /api/logs`

Creates or updates a log for a habit and date.

Request body:

```json
{
  "habitId": "habit_seed_1",
  "localDate": "2026-04-16",
  "value": 1,
  "note": "Done before breakfast"
}
```

### `GET /api/dashboard?date=YYYY-MM-DD`

Returns:

- `totalHabits`
- `completedToday`
- `pendingToday`
- `completionRate`

If `date` is omitted, the route uses today's UTC date string.

## Recommended Patterns In This Repo

Because this is a Next.js App Router app, there are two good ways to get habit data into the UI.

### 1. Server components for reads

Use this when a page in `apps/web/app` needs data to render on the server.

This is the cleanest option for read-only page rendering inside the same app because:

- it avoids an extra HTTP hop to your own backend
- it uses the existing service layer directly
- it matches the current repo structure

### 2. Client components for interactive fetches and mutations

Use this when the browser needs to:

- load data after mount
- submit forms
- handle button-driven updates
- post logs
- update the UI without navigating away

In this case, call the existing `/api/...` routes with `fetch`.

## Pattern A: Read Data In A Server Component

If you want `apps/web/app/(dashboard)/tracker/page.tsx` to show real habits today, you can read the service layer directly.

Example:

```tsx
import * as habitsService from "@/server/services/habits.service"
import * as dashboardService from "@/server/services/dashboard.service"

export default function TrackerPage() {
  const today = new Date().toISOString().slice(0, 10)
  const habits = habitsService.listActiveHabits()
  const summary = dashboardService.getDashboardSummaryForDate(today)

  return (
    <section className="flex min-h-full flex-col gap-6">
      <header className="space-y-1">
        <h1>Tracker</h1>
        <p className="text-sm text-muted-foreground">
          Habit data is being rendered from the server layer.
        </p>
      </header>

      <article className="border border-alt-border bg-background p-4">
        <h3>Today Summary</h3>
        <p>Total habits: {summary.totalHabits}</p>
        <p>Completed: {summary.completedToday}</p>
        <p>Pending: {summary.pendingToday}</p>
        <p>Completion rate: {summary.completionRate}%</p>
      </article>

      <article className="border border-alt-border bg-background p-4">
        <h3>Habits</h3>
        <ul className="space-y-2">
          {habits.map((habit) => (
            <li key={habit.id} className="border border-alt-border p-2">
              <div>{habit.name}</div>
              <div className="text-sm text-muted-foreground">
                {habit.cadence}
              </div>
            </li>
          ))}
        </ul>
      </article>
    </section>
  )
}
```

### When to use this

- Page-level reads
- Dashboard summary reads
- Initial habit list rendering
- Anything that should be ready on first render

### Why this works well here

The current app already keeps business logic in `apps/web/server/services`, so server components can use that logic directly.

## Pattern B: Read Data In A Client Component

If you want browser-side loading, use a client component and call `/api/habits`.

Example:

```tsx
"use client"

import { useEffect, useState } from "react"

import type { ApiResponse } from "@/lib/api-response"
import type { Habit } from "@/types/habit"

export function HabitListClient() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/habits")
        const json = (await response.json()) as ApiResponse<Habit[]>

        if (!response.ok || !json.success) {
          setError(json.success ? "Failed to load habits" : json.error)
          return
        }

        setHabits(json.data)
      } catch {
        setError("Network error while loading habits")
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [])

  if (loading) return <p>Loading habits...</p>
  if (error) return <p>{error}</p>

  return (
    <ul className="space-y-2">
      {habits.map((habit) => (
        <li key={habit.id} className="border border-alt-border p-2">
          <div>{habit.name}</div>
          <div className="text-sm text-muted-foreground">{habit.cadence}</div>
        </li>
      ))}
    </ul>
  )
}
```

### When to use this

- Interactive widgets
- Components that refresh in the browser
- Components that submit forms and then reload data
- Client-only UI states like loading, retry, and optimistic behavior

## Pattern C: Create A Habit From The Frontend

The current `POST /api/habits` route is ready to use from the frontend.

Example:

```ts
async function createHabit() {
  const response = await fetch("/api/habits", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Drink water",
      cadence: "daily",
      targetCount: 8,
    }),
  })

  const json = await response.json()

  if (!response.ok || !json.success) {
    throw new Error(json.error ?? "Failed to create habit")
  }

  return json.data
}
```

Notes:

- `name` is required
- `cadence` must be `daily`, `weekly`, or `custom`
- `targetCount`, if provided, must be a positive integer

## Pattern D: Update Or Archive A Habit

Update example:

```ts
async function renameHabit(habitId: string, name: string) {
  const response = await fetch(`/api/habits/${habitId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  })

  const json = await response.json()

  if (!response.ok || !json.success) {
    throw new Error(json.error ?? "Failed to update habit")
  }

  return json.data
}
```

Archive example:

```ts
async function archiveHabit(habitId: string) {
  const response = await fetch(`/api/habits/${habitId}`, {
    method: "DELETE",
  })

  const json = await response.json()

  if (!response.ok || !json.success) {
    throw new Error(json.error ?? "Failed to archive habit")
  }

  return json.data
}
```

Notes:

- Archived habits are excluded from `GET /api/habits`
- Archived habits are also excluded from dashboard summary calculations

## Pattern E: Log Habit Completion

The current logs route behaves like an upsert for `(habitId, localDate)`.

That means posting again for the same habit and day updates the existing log instead of creating duplicates.

Example:

```ts
async function logHabitForToday(habitId: string, value: number) {
  const localDate = new Date().toISOString().slice(0, 10)

  const response = await fetch("/api/logs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      habitId,
      localDate,
      value,
    }),
  })

  const json = await response.json()

  if (!response.ok || !json.success) {
    throw new Error(json.error ?? "Failed to log habit")
  }

  return json.data
}
```

Notes:

- `localDate` must be `YYYY-MM-DD`
- Logging an archived habit returns an error
- Logging a missing habit returns an error

## Pattern F: Display Dashboard Summary

If the UI needs top-level stats, `GET /api/dashboard` is already usable.

Example client-side fetch:

```ts
async function getDashboardSummary(date: string) {
  const response = await fetch(`/api/dashboard?date=${date}`)
  const json = await response.json()

  if (!response.ok || !json.success) {
    throw new Error(json.error ?? "Failed to load dashboard summary")
  }

  return json.data
}
```

This endpoint already calculates:

- how many active habits exist
- how many are completed for that date
- how many are still pending
- the completion rate percentage

## If You Are Updating `tracker/page.tsx`

With the current project structure, the simplest upgrade path for `apps/web/app/(dashboard)/tracker/page.tsx` is:

1. Replace placeholder content with server-side reads from `habits.service` and `dashboard.service`
2. Render the returned `Habit[]` and `DashboardSummary`
3. Add small client components later for buttons and forms that call `/api/habits` and `/api/logs`
4. Refresh server-rendered data after mutations if needed

This lets the page stay simple:

- reads happen on the server
- writes happen through API routes
- UI stays aligned with the existing architecture

## A Good Split For This Repo

Given the current codebase, this is a practical split:

### Use server services directly for:

- page-level reads
- initial tracker data
- dashboard summaries
- any data needed before first paint

### Use `/api` routes from the browser for:

- form submissions
- button actions
- logging habits
- editing habits
- archiving habits
- refreshing small client-side widgets

## Important Current Caveats

### 1. Data is mock and in-memory

Everything currently goes through `apps/web/server/mock/db.ts`.

So:

- the seed data is useful for development
- mutations work during the current dev session
- all changes disappear when the server restarts

### 2. No centralized frontend data layer yet

There is no existing:

- `lib/api.ts`
- React Query setup
- SWR setup
- shared mutation hook layer

So right now, fetches are best written per component or added as small local helpers.

### 3. No dedicated log-reading API yet

You can write logs through `POST /api/logs`, and dashboard summary uses logs internally, but there is not currently a public `GET /api/logs` route for the frontend.

If the frontend needs raw log history, that endpoint would need to be added.

## Suggested Next Step

If the goal is to start showing real backend data immediately, the best next implementation step is:

1. Convert `apps/web/app/(dashboard)/tracker/page.tsx` from placeholder content to a server-rendered tracker page
2. Read habits and dashboard summary from the service layer
3. Add a small client component for creating logs or habits through `/api`

That approach fits the codebase as it exists now without requiring any new infrastructure.
