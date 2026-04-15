import { z } from "zod";

export const cadenceSchema = z.enum(["daily", "weekly", "custom"]);

export const createHabitInput = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  cadence: cadenceSchema,
  targetCount: z.number().int().positive().optional(),
});

export const updateHabitInput = createHabitInput.partial();

export type CreateHabitInput = z.infer<typeof createHabitInput>;
export type UpdateHabitInput = z.infer<typeof updateHabitInput>;
