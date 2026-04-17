import * as habitsRepo from "@/server/repositories/habits.repository";
import type { CreateHabitInput, UpdateHabitInput } from "@/lib/validations/habits";
import type { Habit } from "@/types/habit";

export function listActiveHabits(): Habit[] {
  return habitsRepo.listHabits().filter((h) => !h.isArchived);
}

export function getHabitById(id: string): Habit | undefined {
  return habitsRepo.getHabitById(id);
}

export function createHabit(input: CreateHabitInput): Habit {
  return habitsRepo.createHabit({
    name: input.name,
    description: input.description,
    color: input.color,
    icon: input.icon,
    cadence: input.cadence,
    intensity: input.intensity,
    targetCount: input.targetCount,
    isArchived: false,
  });
}

export function updateHabit(id: string, input: UpdateHabitInput): Habit | undefined {
  const existing = habitsRepo.getHabitById(id);
  if (!existing || existing.isArchived) return undefined;
  return habitsRepo.updateHabit(id, input);
}

export function archiveHabit(id: string): Habit | undefined {
  const existing = habitsRepo.getHabitById(id);
  if (!existing || existing.isArchived) return undefined;
  return habitsRepo.archiveHabit(id);
}
