import { z } from "zod";
import { failureJson, successJson } from "@/lib/api-response";
import * as dashboardService from "@/server/services/dashboard.service";

const querySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD")
    .optional(),
});

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const parsed = querySchema.safeParse({
    date: url.searchParams.get("date") ?? undefined,
  });

  if (!parsed.success) {
    const message = parsed.error.errors.map((e) => e.message).join("; ");
    return failureJson(message || "Invalid query", 422);
  }

  const date = parsed.data.date ?? new Date().toISOString().slice(0, 10);
  const data = dashboardService.getDashboardSummaryForDate(date);
  return successJson(data);
}
