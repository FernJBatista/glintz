import { getMockDb } from "@/server/mock/db";
import type { Habit } from "@/types/habit";

export type HabitCreatePayload = Omit<Habit, "id" | "createdAt" | "updatedAt">;
export type HabitUpdatePayload = Partial<
  Pick<
    Habit,
    | "name"
    | "description"
    | "color"
    | "icon"
    | "cadence"
    | "intensity"
    | "targetCount"
    | "isArchived"
  >
>;

/** TODO: replace with Drizzle/PostgreSQL */
export function listHabits(): Habit[] {
  const { habits } = getMockDb();
  return [...habits];
}

/** TODO: replace with Drizzle/PostgreSQL */
export function getHabitById(id: string): Habit | undefined {
  const { habits } = getMockDb();
  return habits.find((h) => h.id === id);
}

/** TODO: replace with Drizzle/PostgreSQL */
export function createHabit(data: HabitCreatePayload): Habit {
  const { habits } = getMockDb();
  const now = new Date().toISOString();
  const habit: Habit = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  habits.push(habit);
  return habit;
}

/** TODO: replace with Drizzle/PostgreSQL */
export function updateHabit(id: string, data: HabitUpdatePayload): Habit | undefined {
  const { habits } = getMockDb();
  const idx = habits.findIndex((h) => h.id === id);
  if (idx === -1) return undefined;
  const now = new Date().toISOString();
  const updated: Habit = { ...habits[idx]!, ...data, updatedAt: now };
  habits[idx] = updated;
  return updated;
}

/** TODO: replace with Drizzle/PostgreSQL */
export function archiveHabit(id: string): Habit | undefined {
  return updateHabit(id, { isArchived: true });
}
