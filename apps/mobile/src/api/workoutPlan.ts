import { http } from "@/lib/http";
import { WorkoutPlanListResponse } from "@/schemas/workoutPlan";

export const workoutPlanRequest = {
  // Lấy danh sách plan
  getPlans: () => http.get<WorkoutPlanListResponse>("/api/workout-plans"),

  // Chi tiết 1 plan (Overview)
  getPlanDetail: (id: string) => http.get(`/api/workout-plans/${id}`),

  // Lấy bài tập hôm nay (Hàn hãy check lại endpoint thực tế của Backend)
  getTodaySession: () => http.get("/api/workout-plans/today"),

  // Lấy chi tiết các động tác trong 1 ngày cụ thể
  getSessionExercises: (id: string) => http.get(`/api/workout-sessions/${id}/exercises`),

  // Các hàm cũ của Hàn giữ lại nếu cần
  getDayDetail: (id: string, week: number, day: number) => 
    http.get(`/api/workout-plans/${id}/weeks/${week}/days/${day}`),
    
  generatePlan: (onboardingProfileId: string) => 
    http.post(`/api/workout-plans/generate?onboardingProfileId=${onboardingProfileId}`),

  completeSession: (id: string) => http.post(`/api/workout-sessions/${id}/complete`),
};