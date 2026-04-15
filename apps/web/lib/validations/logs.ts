import { z } from "zod";

const localDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "localDate must be YYYY-MM-DD");

export const createHabitLogInput = z.object({
  habitId: z.string().min(1, "habitId is required"),
  localDate: localDateSchema,
  value: z.number().finite(),
  note: z.string().optional(),
});

export type CreateHabitLogInput = z.infer<typeof createHabitLogInput>;
