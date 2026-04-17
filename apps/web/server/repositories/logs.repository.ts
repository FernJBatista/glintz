import { getMockDb } from "@/server/mock/db";
import type { HabitLog } from "@/types/habit";

export type LogUpsertPayload = Pick<HabitLog, "habitId" | "localDate" | "value" | "note">;

/** TODO: replace with Drizzle/PostgreSQL */
export function listLogs(): HabitLog[] {
  const { logs } = getMockDb();
  return [...logs];
}

/** TODO: replace with Drizzle/PostgreSQL */
export function listLogsByDate(localDate: string): HabitLog[] {
  const { logs } = getMockDb();
  return logs.filter((l) => l.localDate === localDate);
}

/** TODO: replace with Drizzle/PostgreSQL */
export function listLogsByHabit(habitId: string): HabitLog[] {
  const { logs } = getMockDb();
  return logs.filter((l) => l.habitId === habitId);
}

/** TODO: replace with Drizzle/PostgreSQL — enforce unique (habitId, localDate) in DB */
export function upsertLog(data: LogUpsertPayload): HabitLog {
  const { logs } = getMockDb();
  const now = new Date().toISOString();
  const existingIdx = logs.findIndex(
    (l) => l.habitId === data.habitId && l.localDate === data.localDate,
  );

  if (existingIdx === -1) {
    const created: HabitLog = {
      id: crypto.randomUUID(),
      habitId: data.habitId,
      localDate: data.localDate,
      value: data.value,
      note: data.note,
      createdAt: now,
      updatedAt: now,
    };
    logs.push(created);
    return created;
  }

  const prev = logs[existingIdx]!;
  const updated: HabitLog = {
    ...prev,
    value: data.value,
    note: data.note,
    updatedAt: now,
  };
  logs[existingIdx] = updated;
  return updated;
}
