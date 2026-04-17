import { z } from "zod";

export const cadenceSchema = z.enum(["daily", "weekly", "custom"]);
export const intensitySchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
]);

export const createHabitInput = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  cadence: cadenceSchema.default("daily"),
  intensity: intensitySchema.default(1),
  targetCount: z.number().int().positive().optional(),
});

export const updateHabitInput = createHabitInput.partial();

export type CreateHabitInput = z.infer<typeof createHabitInput>;
export type UpdateHabitInput = z.infer<typeof updateHabitInput>;
