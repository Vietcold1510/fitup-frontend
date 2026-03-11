import { useQuery } from "@tanstack/react-query";
import { workoutPlanRequest } from "@/api/workoutPlan";
import { handleErrorApi } from "@/lib/errors";

export const useHomeScreen = () => {
  const { 
    data: response, 
    isLoading, 
    isError, 
    refetch,
    isFetched // Quan trọng: Chỉ true sau khi hàm refetch() chạy xong
  } = useQuery({
    queryKey: ["home-workout-plans"],
    queryFn: async () => {
      try {
        const res = await workoutPlanRequest.getPlans();
        // Cấu trúc: res (Axios) -> .data (Server) -> .data (Array Plans)
        return res.data.data; 
      } catch (error) {
        handleErrorApi({ error });
        return [];
      }
    },
    enabled: false, // Ngắt tự động gọi khi mount để Hàn chủ động kiểm soát
  });

  const plans = response || [];
  const hasPlan = plans.length > 0;
  const latestPlan = hasPlan ? plans[0] : null;

  // Chuẩn bị dữ liệu hiển thị cho UI
  const homeData = {
    user: { name: "Hàn", points: 500, avatar: "" },
    stats: { 
      workouts: latestPlan?.totalSessions || 0, 
      streaks: 0, 
      calories: 0 
    },
    todayPlan: {
      title: latestPlan ? `Lộ trình ${latestPlan.totalWeeks} tuần` : "Chưa có lộ trình",
      duration: latestPlan ? "45 min" : "0 min",
      level: latestPlan ? "Cá nhân hóa" : "N/A",
      progress: latestPlan?.progress || 0,
      totalExercises: latestPlan?.totalSessions || 0
    }
  };

  return {
    homeData,
    hasPlan,
    isLoading,
    isError,
    isFetched, // Trả về để HomeScreen làm chốt chặn điều hướng
    refetch,
  };
};