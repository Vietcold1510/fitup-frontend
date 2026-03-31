import { z } from "zod";
import { WorkoutSchema } from "./workout"; // Đảm bảo file này tồn tại
import { GoalType } from "../utils/enum";

// 1. Chi tiết từng bài tập trong một buổi (Exercise Level)
export const PlanExerciseSchema = z.object({
  id: z.string().optional(),      
  order: z.number(),
  sets: z.number().nullable(),
  reps: z.string().nullable(),
  durationSeconds: z.number().nullable(),
  restSeconds: z.number().nullable(),
  note: z.string().nullable(),
  isDone: z.boolean().optional().default(false),  
  workout: WorkoutSchema // Thông tin gốc của bài tập (tên, gif, v.v.)
});

// 2. Thông tin một buổi tập (Session/Day Level)
// Khớp với API: /api/workout-plans/{id}/weeks/{weekNumber}
export const PlanDaySchema = z.object({
  sessionId: z.string(),
  dayNumber: z.number(),
  progress: z.number().default(0),   
  notes: z.string().nullable().default("Focus: FULLBODY"),
  exerciseCount: z.number(),
  exercises: z.array(PlanExerciseSchema).optional() // Chỉ hiện khi vào chi tiết buổi tập
});

// 3. Thông tin một tuần tập luyện (Week Level)
// Khớp với mảng 'weeks' trong API: /overview
export const PlanWeekSchema = z.object({
  scheduleId: z.string(), // API trả về scheduleId thay vì id ở cấp tuần
  weekNumber: z.number(),
  describe: z.string(),
  progress: z.number().default(0),
  totalDays: z.number().default(3),
  days: z.array(PlanDaySchema).optional() // Chứa dữ liệu từ API Weeks
});

// 4. Tổng thể lộ trình (Workout Plan Level)
// Khớp với API: /overview
export const WorkoutPlanSchema = z.object({
  id: z.string(),
  goalType: z.nativeEnum(GoalType),
  progress: z.number().default(0),
  startDate: z.string(),
  endDate: z.string(),
  weeks: z.array(PlanWeekSchema).optional(),
  // Các trường bổ sung nếu Hàn cần tính toán thêm ở Front-end
  totalWeeks: z.number().optional(),
  totalSessions: z.number().optional(),
});

// --- EXPORT TYPES ---
export type WorkoutPlan = z.infer<typeof WorkoutPlanSchema>;
export type PlanWeek = z.infer<typeof PlanWeekSchema>;
export type PlanDay = z.infer<typeof PlanDaySchema>;
export type PlanExercise = z.infer<typeof PlanExerciseSchema>;

// --- API RESPONSE INTERFACES ---
export interface WorkoutPlanOverviewResponse {
  status: number;
  msg: string;
  data: WorkoutPlan;
}

export interface WorkoutWeekDetailResponse {
  status: number;
  msg: string;
  data: PlanDay[]; // API Weeks trả về mảng các Session trực tiếp
  
}

export interface WorkoutPlanListResponse {
  data: WorkoutPlan[]; // Mảng các lộ trình tập luyện
  message?: string;
  status?: number;
}

export interface WorkoutPlanDetailResponse {
  data: WorkoutPlan;
  message?: string;
  status?: number;
}

export const WorkoutWeekDetailResponseSchema = z.object({
  status: z.number(),
  msg: z.string(),
  data: z.array(PlanDaySchema),
});