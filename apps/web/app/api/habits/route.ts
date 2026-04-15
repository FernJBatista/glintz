import { createHabitInput } from "@/lib/validations/habits";
import { failureJson, successJson } from "@/lib/api-response";
import * as habitsService from "@/server/services/habits.service";

export async function GET(): Promise<Response> {
  const data = habitsService.listActiveHabits();
  return successJson(data);
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return failureJson("Invalid JSON body", 400);
  }

  const parsed = createHabitInput.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.errors.map((e) => e.message).join("; ");
    return failureJson(message || "Validation failed", 422);
  }

  const habit = habitsService.createHabit(parsed.data);
  return successJson(habit, { status: 201 });
}
