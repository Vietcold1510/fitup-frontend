import { http } from "../lib/http";

export interface GeneratePlanResponse {
  status: number;
  msg: string;
  data: {
    workoutPlanId: string;
  };
}

export const workoutPlanRequest = {
  // Gọi API generate với Query Param
  generatePlan: (profileId: string) => 
    http.post<GeneratePlanResponse>(`/api/workout-plans/generate`, null, {
      params: { onboardingProfileId: profileId }
    }),
};