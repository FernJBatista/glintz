import { createHabitLogInput } from "@/lib/validations/logs";
import { failureJson, successJson } from "@/lib/api-response";
import * as logsService from "@/server/services/logs.service";

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return failureJson("Invalid JSON body", 400);
  }

  const parsed = createHabitLogInput.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.errors.map((e) => e.message).join("; ");
    return failureJson(message || "Validation failed", 422);
  }

  const result = logsService.logHabit(parsed.data);
  if (!result.ok) {
    if (result.reason === "habit_not_found") return failureJson("Habit not found", 404);
    return failureJson("Cannot log an archived habit", 409);
  }

  return successJson(result.log, { status: 201 });
}
