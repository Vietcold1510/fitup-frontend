import { z } from "zod";

// Định nghĩa Schema cho một loại Workout
export const WorkoutTypeSchema = z.object({
  id: z.string(),
  type: z.string(),
  workouts: z.any().nullable(),
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
});

// Định nghĩa Schema cho mảng dữ liệu trả về từ API
export const WorkoutTypeResponseSchema = z.object({
  status: z.number(),
  msg: z.string(),
  data: z.array(WorkoutTypeSchema),
});
export const WorkoutSchema = z.object({
  id: z.string(),
  workoutTypeId: z.string(),
  name: z.string(),
  describe: z.string(),
  instructionVidLink: z.string().nullable(),
  level: z.number(),
  equipment: z.number(),
  primaryMuscle: z.number(),
  tags: z.string(), // "cardio,hiit,knee-safe"
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
});

export const WorkoutsResponseSchema = z.object({
  status: z.number(),
  msg: z.string(),
  data: z.array(WorkoutSchema),
});

export type Workout = z.infer<typeof WorkoutSchema>;
export type WorkoutsResponse = z.infer<typeof WorkoutsResponseSchema>;
export type WorkoutType = z.infer<typeof WorkoutTypeSchema>;
export type WorkoutTypeResponse = z.infer<typeof WorkoutTypeResponseSchema>;