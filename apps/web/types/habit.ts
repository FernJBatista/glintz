export type HabitCadence = "daily" | "weekly" | "custom";

export type Habit = {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  cadence: HabitCadence;
  targetCount?: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
};

export type HabitLog = {
  id: string;
  habitId: string;
  localDate: string;
  value: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
};

export type DashboardSummary = {
  totalHabits: number;
  completedToday: number;
  pendingToday: number;
  completionRate: number;
};
