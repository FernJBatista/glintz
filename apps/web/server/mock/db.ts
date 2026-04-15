import type { Habit, HabitLog } from "@/types/habit";

const habits: Habit[] = [];
const logs: HabitLog[] = [];

let seeded = false;

function seed(): void {
  if (seeded) return;
  seeded = true;

  const t0 = "2026-01-01T10:00:00.000Z";
  const t1 = "2026-01-02T10:00:00.000Z";
  const t2 = "2026-01-03T10:00:00.000Z";

  habits.push(
    {
      id: "habit_seed_1",
      name: "Morning stretch",
      description: "5 minutes after waking up",
      color: "#22c55e",
      icon: "activity",
      cadence: "daily",
      targetCount: 1,
      isArchived: false,
      createdAt: t0,
      updatedAt: t0,
    },
    {
      id: "habit_seed_2",
      name: "Read 20 pages",
      color: "#3b82f6",
      icon: "book-open",
      cadence: "daily",
      targetCount: 20,
      isArchived: false,
      createdAt: t0,
      updatedAt: t1,
    },
    {
      id: "habit_seed_3",
      name: "Weekly review",
      cadence: "weekly",
      targetCount: 1,
      isArchived: false,
      createdAt: t0,
      updatedAt: t2,
    },
  );

  logs.push(
    {
      id: "log_seed_1",
      habitId: "habit_seed_1",
      localDate: "2026-04-15",
      value: 1,
      note: "Felt great",
      createdAt: t1,
      updatedAt: t1,
    },
    {
      id: "log_seed_2",
      habitId: "habit_seed_2",
      localDate: "2026-04-15",
      value: 22,
      createdAt: t1,
      updatedAt: t1,
    },
    {
      id: "log_seed_3",
      habitId: "habit_seed_1",
      localDate: "2026-04-16",
      value: 1,
      createdAt: t2,
      updatedAt: t2,
    },
  );
}

/** In-memory store; swap for Drizzle-backed connection later. */
export function getMockDb(): { habits: Habit[]; logs: HabitLog[] } {
  seed();
  return { habits, logs };
}
