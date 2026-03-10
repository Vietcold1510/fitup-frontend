import { useQuery } from "@tanstack/react-query";
import { workoutRequest } from "../api/workout";
import { handleErrorApi } from "../lib/errors";

export const useWorkouts = (typeId?: string) => {
  return useQuery({
    queryKey: ["workouts", typeId],
    queryFn: async () => {
      try {
        const res = await workoutRequest.getWorkouts(typeId);
        return res.data.data;
      } catch (error) {
        handleErrorApi({ error });
        throw error;
      }
    },
    enabled: true, // Có thể chỉnh thành false nếu muốn đợi user chọn Type trước
  });
};