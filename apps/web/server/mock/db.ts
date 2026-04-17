import type { Habit, HabitLog } from "@/types/habit";

type MockDbState = {
  habits: Habit[];
  logs: HabitLog[];
  seeded: boolean;
};

type GlobalWithMockDb = typeof globalThis & {
  __glintzMockDb?: MockDbState;
};

function getMockDbState(): MockDbState {
  const globalState = globalThis as GlobalWithMockDb;
  if (!globalState.__glintzMockDb) {
    globalState.__glintzMockDb = {
      habits: [],
      logs: [],
      seeded: false,
    };
  }

  return globalState.__glintzMockDb;
}

function atUtcMiddayDaysAgo(daysAgo: number): Date {
  const date = new Date();
  date.setUTCHours(12, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date;
}

function localDateDaysAgo(daysAgo: number): string {
  return atUtcMiddayDaysAgo(daysAgo).toISOString().slice(0, 10);
}

function timestampDaysAgo(daysAgo: number): string {
  return atUtcMiddayDaysAgo(daysAgo).toISOString();
}

function seed(): void {
  const state = getMockDbState();
  if (state.seeded) return;
  state.seeded = true;

  const t0 = timestampDaysAgo(14);
  const t1 = timestampDaysAgo(10);
  const t2 = timestampDaysAgo(7);
  const t3 = timestampDaysAgo(6);
  const t4 = timestampDaysAgo(5);
  const t5 = timestampDaysAgo(4);
  const t6 = timestampDaysAgo(3);
  const t7 = timestampDaysAgo(2);
  const t8 = timestampDaysAgo(1);
  const t9 = timestampDaysAgo(0);

  state.habits.push(
    {
      id: "habit_seed_1",
      name: "Read 10 pages",
      color: "#3b82f6",
      icon: "book-open",
      cadence: "daily",
      intensity: 1,
      targetCount: 10,
      isArchived: false,
      createdAt: t0,
      updatedAt: t0,
    },
    {
      id: "habit_seed_2",
      name: "Exercise",
      color: "#22c55e",
      icon: "dumbbell",
      cadence: "daily",
      intensity: 3,
      targetCount: 1,
      isArchived: false,
      createdAt: t0,
      updatedAt: t1,
    },
    {
      id: "habit_seed_3",
      name: "Code work",
      color: "#f59e0b",
      icon: "code-xml",
      cadence: "daily",
      intensity: 2,
      targetCount: 1,
      isArchived: false,
      createdAt: t0,
      updatedAt: t2,
    },
    {
      id: "habit_seed_4",
      name: "Creative work",
      color: "#a855f7",
      icon: "palette",
      cadence: "daily",
      intensity: 2,
      targetCount: 1,
      isArchived: false,
      createdAt: t1,
      updatedAt: t3,
    },
  );

  state.logs.push(
    {
      id: "log_seed_1",
      habitId: "habit_seed_1",
      localDate: localDateDaysAgo(6),
      value: 12,
      createdAt: t3,
      updatedAt: t3,
    },
    {
      id: "log_seed_2",
      habitId: "habit_seed_2",
      localDate: localDateDaysAgo(6),
      value: 0,
      note: "Recovery day",
      createdAt: t3,
      updatedAt: t3,
    },
    {
      id: "log_seed_3",
      habitId: "habit_seed_3",
      localDate: localDateDaysAgo(6),
      value: 1,
      createdAt: t3,
      updatedAt: t3,
    },
    {
      id: "log_seed_4",
      habitId: "habit_seed_4",
      localDate: localDateDaysAgo(6),
      value: 1,
      createdAt: t3,
      updatedAt: t3,
    },
    {
      id: "log_seed_5",
      habitId: "habit_seed_1",
      localDate: localDateDaysAgo(5),
      value: 10,
      createdAt: t4,
      updatedAt: t4,
    },
    {
      id: "log_seed_6",
      habitId: "habit_seed_3",
      localDate: localDateDaysAgo(5),
      value: 1,
      createdAt: t4,
      updatedAt: t4,
    },
    {
      id: "log_seed_7",
      habitId: "habit_seed_1",
      localDate: localDateDaysAgo(4),
      value: 14,
      createdAt: t5,
      updatedAt: t5,
    },
    {
      id: "log_seed_8",
      habitId: "habit_seed_2",
      localDate: localDateDaysAgo(4),
      value: 1,
      createdAt: t5,
      updatedAt: t5,
    },
    {
      id: "log_seed_9",
      habitId: "habit_seed_3",
      localDate: localDateDaysAgo(4),
      value: 0,
      note: "Interrupted by meetings",
      createdAt: t5,
      updatedAt: t5,
    },
    {
      id: "log_seed_10",
      habitId: "habit_seed_4",
      localDate: localDateDaysAgo(4),
      value: 1,
      createdAt: t5,
      updatedAt: t5,
    },
    {
      id: "log_seed_11",
      habitId: "habit_seed_1",
      localDate: localDateDaysAgo(3),
      value: 11,
      createdAt: t6,
      updatedAt: t6,
    },
    {
      id: "log_seed_12",
      habitId: "habit_seed_2",
      localDate: localDateDaysAgo(3),
      value: 1,
      createdAt: t6,
      updatedAt: t6,
    },
    {
      id: "log_seed_13",
      habitId: "habit_seed_1",
      localDate: localDateDaysAgo(2),
      value: 1,
      createdAt: t7,
      updatedAt: t7,
    },
    {
      id: "log_seed_14",
      habitId: "habit_seed_2",
      localDate: localDateDaysAgo(2),
      value: 1,
      createdAt: t7,
      updatedAt: t7,
    },
    {
      id: "log_seed_15",
      habitId: "habit_seed_3",
      localDate: localDateDaysAgo(2),
      value: 1,
      createdAt: t7,
      updatedAt: t7,
    },
    {
      id: "log_seed_16",
      habitId: "habit_seed_4",
      localDate: localDateDaysAgo(2),
      value: 1,
      createdAt: t7,
      updatedAt: t7,
    },
    {
      id: "log_seed_17",
      habitId: "habit_seed_1",
      localDate: localDateDaysAgo(1),
      value: 13,
      createdAt: t8,
      updatedAt: t8,
    },
    {
      id: "log_seed_18",
      habitId: "habit_seed_2",
      localDate: localDateDaysAgo(1),
      value: 1,
      createdAt: t8,
      updatedAt: t8,
    },
    {
      id: "log_seed_19",
      habitId: "habit_seed_3",
      localDate: localDateDaysAgo(1),
      value: 1,
      createdAt: t8,
      updatedAt: t8,
    },
    {
      id: "log_seed_20",
      habitId: "habit_seed_4",
      localDate: localDateDaysAgo(1),
      value: 0,
      note: "Creative block day",
      createdAt: t8,
      updatedAt: t8,
    },
    {
      id: "log_seed_21",
      habitId: "habit_seed_1",
      localDate: localDateDaysAgo(0),
      value: 10,
      createdAt: t9,
      updatedAt: t9,
    },
    {
      id: "log_seed_22",
      habitId: "habit_seed_2",
      localDate: localDateDaysAgo(0),
      value: 1,
      createdAt: t9,
      updatedAt: t9,
    },
    {
      id: "log_seed_23",
      habitId: "habit_seed_3",
      localDate: localDateDaysAgo(0),
      value: 1,
      createdAt: t9,
      updatedAt: t9,
    },
  );
}

/** In-memory store; swap for Drizzle-backed connection later. */
export function getMockDb(): { habits: Habit[]; logs: HabitLog[] } {
  seed();
  const state = getMockDbState();
  return { habits: state.habits, logs: state.logs };
}
