import { z } from "zod";
import { WorkoutSchema } from "./workout";
import { GoalType } from "../utils/enum";

// 1. Chi tiết từng bài tập trong một buổi
export const PlanExerciseSchema = z.object({
  id: z.string().optional(),      
  order: z.number(),
  sets: z.number().nullable(),
  reps: z.string().nullable(),
  durationSeconds: z.number().nullable(),
  restSeconds: z.number().nullable(),
  note: z.string().nullable(),
  isDone: z.boolean().optional(),  
  workout: WorkoutSchema
});

// 2. Thông tin một ngày tập luyện
export const PlanDaySchema = z.object({
  sessionId: z.string().optional(),
  dayNumber: z.number(),
  progress: z.number(),
  notes: z.string().nullable(),
  exerciseCount: z.number().optional(),
  exercises: z.array(PlanExerciseSchema).optional()
});

// 3. Thông tin một tuần tập luyện
export const PlanWeekSchema = z.object({
  weekNumber: z.number(),
  describe: z.string(),
  progress: z.number().optional(),
  totalDays: z.number().optional(),
  days: z.array(PlanDaySchema).optional()
});

// 4. Tổng thể lộ trình (Workout Plan)
export const WorkoutPlanSchema = z.object({
  id: z.string(),
  goalType: z.nativeEnum(GoalType),
  progress: z.number().optional(),
  startDate: z.string(),
  endDate: z.string(),
  totalWeeks: z.number().optional(),
  totalSessions: z.number().optional(),
  weeks: z.array(PlanWeekSchema).optional()
});

// --- EXPORT TYPES ---
export type WorkoutPlan = z.infer<typeof WorkoutPlanSchema>;
export type PlanDay = z.infer<typeof PlanDaySchema>;
export type PlanWeek = z.infer<typeof PlanWeekSchema>;
export type PlanExercise = z.infer<typeof PlanExerciseSchema>;

// 5. Cấu trúc Response (Bọc mảng WorkoutPlan)
export interface WorkoutPlanListResponse {
  data: WorkoutPlan[]; 
  message?: string;
  status?: number;
}

// 6. Cấu trúc Single Response (Dùng cho Get Detail)
export interface WorkoutPlanDetailResponse {
  data: WorkoutPlan;
  message?: string;
}