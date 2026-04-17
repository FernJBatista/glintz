import * as dashboardService from "@/server/services/dashboard.service"
import * as habitsRepo from "@/server/repositories/habits.repository"
import * as logsRepo from "@/server/repositories/logs.repository"
import type { Habit, HabitLog } from "@/types/habit"

export type TrackerStreakItem = {
  habitId: string
  habitName: string
  icon?: string
  intensity: Habit["intensity"]
  currentStreak: number
}

export type TrackerCompletionItem = {
  habitId: string
  habitName: string
  icon?: string
  intensity: Habit["intensity"]
  completionRate: number
}

export type TrackerSnapshot = {
  dateLabel: string
  daysTracked: number
  topStreakItems: TrackerStreakItem[]
  topCompletionItems: TrackerCompletionItem[]
}

function thresholdForHabit(habit: Habit): number {
  return habit.targetCount ?? 1
}

function isHabitCompleted(habit: Habit, value: number | undefined): boolean {
  if (value === undefined) return false
  return value >= thresholdForHabit(habit)
}

function parseLocalDate(localDate: string): Date {
  return new Date(`${localDate}T12:00:00.000Z`)
}

function shiftLocalDate(localDate: string, days: number): string {
  const date = parseLocalDate(localDate)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

function getCurrentLocalDate(): string {
  const date = new Date()
  date.setUTCHours(12, 0, 0, 0)
  return date.toISOString().slice(0, 10)
}

function formatCurrentDateLabel(localDate: string): string {
  const date = parseLocalDate(localDate)
  const month = new Intl.DateTimeFormat("en-US", {
    month: "long",
    timeZone: "UTC",
  }).format(date)

  return `${date.getUTCDate()} ${month}`
}

function countCurrentStreak(habit: Habit, logs: HabitLog[], localDate: string): number {
  const valuesByDate = new Map(logs.map((log) => [log.localDate, log.value]))
  let streak = 0
  let cursor = localDate

  while (isHabitCompleted(habit, valuesByDate.get(cursor))) {
    streak += 1
    cursor = shiftLocalDate(cursor, -1)
  }

  return streak
}

function getCompletionRate(habit: Habit, logs: HabitLog[]): number {
  const trackedDays = logs.length
  const completedDays = logs.filter((log) => isHabitCompleted(habit, log.value)).length
  return dashboardService.computeCompletionRate(completedDays, trackedDays)
}

export function getTrackerSnapshot(): TrackerSnapshot {
  const today = getCurrentLocalDate()
  const habits = habitsRepo.listHabits().filter((habit) => !habit.isArchived)
  const logs = logsRepo.listLogs()
  const daysTracked = new Set(logs.map((log) => log.localDate)).size

  const topStreakItems = habits
    .map((habit) => {
      const habitLogs = logsRepo.listLogsByHabit(habit.id).filter((log) => log.localDate <= today)

      return {
        habitId: habit.id,
        habitName: habit.name,
        icon: habit.icon,
        intensity: habit.intensity,
        currentStreak: countCurrentStreak(habit, habitLogs, today),
      }
    })
    .sort((left, right) => {
      return right.currentStreak - left.currentStreak || left.habitName.localeCompare(right.habitName)
    })
    .slice(0, 3)

  const topCompletionItems = habits
    .map((habit) => {
      const habitLogs = logsRepo.listLogsByHabit(habit.id).filter((log) => log.localDate <= today)

      return {
        habitId: habit.id,
        habitName: habit.name,
        icon: habit.icon,
        intensity: habit.intensity,
        completionRate: getCompletionRate(habit, habitLogs),
      }
    })
    .sort((left, right) => {
      return (
        right.completionRate - left.completionRate ||
        left.habitName.localeCompare(right.habitName)
      )
    })
    .slice(0, 3)

  return {
    dateLabel: formatCurrentDateLabel(today),
    daysTracked,
    topStreakItems,
    topCompletionItems,
  }
}
