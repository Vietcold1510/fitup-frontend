import { http } from "@/lib/http";
import { WorkoutPlanListResponse } from "@/schemas/workoutPlan";

export const workoutPlanRequest = {
  // 1. Lấy danh sách plan
  getPlans: () => http.get<WorkoutPlanListResponse>("/api/workout-plans"),

  // 2. Chi tiết 1 plan tổng quan (Thêm overview theo Swagger)
  getPlanOverview: (id: string) => http.get(`/api/workout-plans/${id}/overview`),

  // 3. Chi tiết 1 plan đầy đủ
  getPlanDetail: (id: string) => http.get(`/api/workout-plans/${id}`),

  // 4. Lấy chi tiết 1 tuần (Theo Swagger)
  getWeekDetail: (id: string, week: number) => 
    http.get(`/api/workout-plans/${id}/weeks/${week}`),

  // 5. Lấy chi tiết các động tác trong 1 ngày (ĐÂY LÀ NGUỒN DATA CHO PLAYER)
  getDayDetail: (id: string, week: number, day: number) => 
    http.get(`/api/workout-plans/${id}/weeks/${week}/days/${day}`),
    
// 6. Sinh lộ trình
generatePlan: (profileId: string) => 
  http.post(`/api/workout-plans/generate?onboardingProfileId=${profileId}`),

  completeSession: (id: string) => http.post(`/api/workout-sessions/${id}/complete`),

// 7. Cập nhật trạng thái
  updateExerciseStatus: (exerciseId: string) => 
    http.patch(`/api/workout-plans/exercises/${exerciseId}/status`, { "isDone": true }),

  // 8. Xóa lộ trình
  deletePlan: (id: string) => http.delete(`/api/workout-plans/${id}`),
};

