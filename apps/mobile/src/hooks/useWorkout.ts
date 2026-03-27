import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react"; //
import { workoutPlanRequest } from "../api/workoutPlan";
import { handleErrorApi } from "../lib/errors";
import { WorkoutPlan, PlanDay, PlanExercise } from "../schemas/workoutPlan";
import { useAuthContext } from "@/context/AuthContext";
import { useNavigation } from "@react-navigation/native"; 

export const useWorkout = (planId?: string, sessionId?: string) => {
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();
  const { userId } = useAuthContext();

  // 1. LẤY TẤT CẢ LỘ TRÌNH (Dùng cho danh sách ở Home)
  const plansQuery = useQuery({
    queryKey: ["workout-plans"],
    queryFn: async () => {
      const res = await workoutPlanRequest.getPlans();
      return res.data.data || []; // Đảm bảo luôn trả về mảng
    },
  });

  // --- BẮT ĐẦU PHẦN THÊM MỚI: TỰ ĐỘNG GENERATE ---

  // MUTATION: Khởi tạo lộ trình mới
const generatePlanMutation = useMutation({
    mutationFn: (profileId: string) => workoutPlanRequest.generatePlan(profileId),
    onSuccess: () => {
      console.log("✅ Tự động sinh lộ trình thành công!");
      queryClient.invalidateQueries({ queryKey: ["workout-plans"] });
    },
    onError: (error: any) => {
      const serverMsg = error.response?.data?.msg;
      
      // 🔥 NẾU LỖI LÀ DO CHƯA ONBOARDING -> ĐẨY SANG MÀN HÌNH ONBOARDING
      if (serverMsg === "OnboardingProfile not found.") {
        console.log("⚠️ User chưa Onboarding, chuyển hướng...");
        navigation.navigate("Onboarding"); 
      } else {
        handleErrorApi({ error });
      }
    }
  });

  // EFFECT: Mắt thần theo dõi danh sách rỗng (PHIÊN BẢN CHỐNG SPAM)
  useEffect(() => {
    if (plansQuery.isFetching) return;

    if (plansQuery.isSuccess && plansQuery.data?.length === 0) {
      if (userId && !generatePlanMutation.isPending && !generatePlanMutation.isSuccess) {
        // Thử Generate, nếu lỗi Onboarding thì hàm onError ở trên sẽ lo việc chuyển trang
        generatePlanMutation.mutate(userId);
      }
    }
  }, [plansQuery.isFetching, plansQuery.isSuccess, plansQuery.data?.length, userId]);

  // 2. LẤY CHI TIẾT 1 LỘ TRÌNH
  const planDetailQuery = useQuery({
    queryKey: ["workout-plan-detail", planId],
    queryFn: async () => {
      const res = await workoutPlanRequest.getPlanDetail(planId!);
      return res.data.data;
    },
    enabled: !!planId, 
  });

  // 3. LẤY BÀI TẬP CỦA NGÀY HÔM NAY
  const todaySessionQuery = useQuery({
    queryKey: ["today-session"],
    queryFn: async () => {
      const res = await workoutPlanRequest.getTodaySession();
      return res.data.data as PlanDay;
    },
    // Chỉ lấy bài tập hôm nay khi đã có ít nhất 1 lộ trình (Tránh lỗi 404)
    enabled: !!plansQuery.data?.length, 
  });

  // 4. LẤY DANH SÁCH ĐỘNG TÁC CỦA MỘT BUỔI TẬP (Cân nhắc xóa nếu Swagger không có)
  const sessionExercisesQuery = useQuery({
    queryKey: ["session-exercises", sessionId],
    queryFn: async () => {
      const res = await workoutPlanRequest.getSessionExercises(sessionId!);
      return res.data.data;
    },
    enabled: !!sessionId,
  });

  // 5. MUTATION: ĐÁNH DẤU HOÀN THÀNH BUỔI TẬP (Cân nhắc xóa nếu Swagger không có)
  const completeSessionMutation = useMutation({
    mutationFn: (id: string) => workoutPlanRequest.completeSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout-plans"] });
      queryClient.invalidateQueries({ queryKey: ["workout-plan-detail"] });
      queryClient.invalidateQueries({ queryKey: ["today-session"] });
    },
    onError: (error) => handleErrorApi({ error })
  });

  return {
    allPlans: plansQuery.data || [],
    // Quan trọng: Báo loading khi đang GET hoặc đang GENERATE
    isLoadingPlans: plansQuery.isLoading || generatePlanMutation.isPending, 
    
    currentPlan: planDetailQuery.data,
    isLoadingDetail: planDetailQuery.isLoading,

    todaySession: todaySessionQuery.data,
    isLoadingToday: todaySessionQuery.isLoading,

    exercises: sessionExercisesQuery.data || [],
    isLoadingExercises: sessionExercisesQuery.isLoading,

    refetchAll: plansQuery.refetch,

  };
};