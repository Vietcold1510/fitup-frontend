import { http } from "../lib/http";
import { WorkoutTypeResponse, WorkoutsResponse } from "../schemas/workout";

export const workoutRequest = {
  getWorkoutTypes: () => 
    http.get<WorkoutTypeResponse>("/api/workout-types"),
    
  // Lấy tất cả bài tập hoặc lọc theo loại
  getWorkouts: (typeId?: string) => 
    http.get<WorkoutsResponse>("/api/workouts", {
      params: typeId ? { workoutTypeId: typeId } : {}
    }),
};