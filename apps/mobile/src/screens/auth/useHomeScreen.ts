import { useQuery } from "@tanstack/react-query";
import { http } from "../../lib/http";
import { Alert } from "react-native";

export const useHomeScreen = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["homeData"],
    queryFn: async () => {
      try {
        // Tạm thời gọi đường dẫn tới home hoặc dashboard
        const res = await http.get("/home"); 
        return res.data.data;
      } catch (error) {
        // Nếu API chưa sẵn sàng, trả về null để dùng dữ liệu mẫu bên dưới
        return null;
      }
    },
    retry: 1,
  });

  // Dữ liệu mặc định để hiển thị khi API chưa có hoặc đang phát triển
  const mockData = {
    user: { name: "Hàn Nguyễn", points: 500, avatar: "" },
    stats: { workouts: 12, streaks: 5, calories: 850 },
    todayPlan: {
      title: "Upper Body Strength",
      duration: "45 min",
      level: "Intermediate",
      progress: 3,
      totalExercises: 8
    }
  };

  const homeData = data || mockData;

  return {
    homeData,
    isLoading,
    isError,
    refetch,
  };
};