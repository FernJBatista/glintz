import { updateHabitInput } from "@/lib/validations/habits";
import { failureJson, successJson } from "@/lib/api-response";
import * as habitsService from "@/server/services/habits.service";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext): Promise<Response> {
  const { id } = await context.params;
  const habit = habitsService.getHabitById(id);
  if (!habit) return failureJson("Habit not found", 404);
  return successJson(habit);
}

export async function PATCH(request: Request, context: RouteContext): Promise<Response> {
  const { id } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return failureJson("Invalid JSON body", 400);
  }

  const parsed = updateHabitInput.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.errors.map((e) => e.message).join("; ");
    return failureJson(message || "Validation failed", 422);
  }

  const habit = habitsService.updateHabit(id, parsed.data);
  if (!habit) return failureJson("Habit not found or archived", 404);
  return successJson(habit);
}

export async function DELETE(_request: Request, context: RouteContext): Promise<Response> {
  const { id } = await context.params;
  const habit = habitsService.archiveHabit(id);
  if (!habit) return failureJson("Habit not found or already archived", 404);
  return successJson(habit);
}
