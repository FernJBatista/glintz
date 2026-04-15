import * as habitsRepo from "@/server/repositories/habits.repository";
import * as logsRepo from "@/server/repositories/logs.repository";
import type { CreateHabitLogInput } from "@/lib/validations/logs";
import type { HabitLog } from "@/types/habit";

export type LogHabitResult =
  | { ok: true; log: HabitLog }
  | { ok: false; reason: "habit_not_found" | "habit_archived" };

export function logHabit(input: CreateHabitLogInput): LogHabitResult {
  const habit = habitsRepo.getHabitById(input.habitId);
  if (!habit) return { ok: false, reason: "habit_not_found" };
  if (habit.isArchived) return { ok: false, reason: "habit_archived" };

  const log = logsRepo.upsertLog({
    habitId: input.habitId,
    localDate: input.localDate,
    value: input.value,
    note: input.note,
  });
  return { ok: true, log };
}

export function fetchLogsForDay(localDate: string): HabitLog[] {
  return logsRepo.listLogsByDate(localDate);
}
