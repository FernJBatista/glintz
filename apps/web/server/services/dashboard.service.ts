import * as habitsRepo from "@/server/repositories/habits.repository";
import * as logsRepo from "@/server/repositories/logs.repository";
import type { Habit, DashboardSummary } from "@/types/habit";

function thresholdForHabit(habit: Habit): number {
  return habit.targetCount ?? 1;
}

function isHabitCompletedForDate(habit: Habit, value: number | undefined): boolean {
  if (value === undefined) return false;
  return value >= thresholdForHabit(habit);
}

export function computeCompletionRate(completed: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((completed / total) * 1000) / 10;
}

export function getDashboardSummaryForDate(localDate: string): DashboardSummary {
  const activeHabits = habitsRepo.listHabits().filter((h) => !h.isArchived);
  const dayLogs = logsRepo.listLogsByDate(localDate);
  const logByHabit = new Map(dayLogs.map((l) => [l.habitId, l.value]));

  let completedToday = 0;
  for (const habit of activeHabits) {
    if (isHabitCompletedForDate(habit, logByHabit.get(habit.id))) {
      completedToday += 1;
    }
  }

  const totalHabits = activeHabits.length;
  const pendingToday = Math.max(0, totalHabits - completedToday);
  const completionRate = computeCompletionRate(completedToday, totalHabits);

  return {
    totalHabits,
    completedToday,
    pendingToday,
    completionRate,
  };
}
