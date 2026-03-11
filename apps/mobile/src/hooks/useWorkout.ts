import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workoutPlanRequest } from "../api/workoutPlan";
import { handleErrorApi } from "../lib/errors";
import { WorkoutPlan, PlanDay, PlanExercise } from "../schemas/workoutPlan";

export const useWorkout = (planId?: string, sessionId?: string) => {
  const queryClient = useQueryClient();

  // 1. LẤY TẤT CẢ LỘ TRÌNH (Dùng cho danh sách ở Home)
  // Trả về: WorkoutPlan[]
  const plansQuery = useQuery({
    queryKey: ["workout-plans"],
    queryFn: async () => {
      const res = await workoutPlanRequest.getPlans();
      return res.data.data;
    },
  });

  // 2. LẤY CHI TIẾT 1 LỘ TRÌNH (Dùng khi nhấn vào 1 loại bài tập)
  // Trả về: WorkoutPlan (kèm mảng weeks, days)
  const planDetailQuery = useQuery({
    queryKey: ["workout-plan-detail", planId],
    queryFn: async () => {
      const res = await workoutPlanRequest.getPlanDetail(planId!);
      return res.data.data;
    },
    enabled: !!planId, // Chỉ chạy khi có planId truyền vào
  });

  // 3. LẤY BÀI TẬP CỦA NGÀY HÔM NAY
  // Dùng để hiển thị nhanh ở Widget "Today's Goal"
  const todaySessionQuery = useQuery({
    queryKey: ["today-session"],
    queryFn: async () => {
      const res = await workoutPlanRequest.getTodaySession();
      return res.data.data as PlanDay;
    },
    // Bạn có thể thêm enabled: !!plansQuery.data?.length 
    // để chỉ lấy bài tập khi đã có ít nhất 1 lộ trình
  });

  // 4. LẤY DANH SÁCH ĐỘNG TÁC CỦA MỘT BUỔI TẬP
  // Trả về: PlanExercise[]
  const sessionExercisesQuery = useQuery({
    queryKey: ["session-exercises", sessionId],
    queryFn: async () => {
      const res = await workoutPlanRequest.getSessionExercises(sessionId!);
      return res.data.data;
    },
    enabled: !!sessionId,
  });

  // 5. MUTATION: ĐÁNH DẤU HOÀN THÀNH BUỔI TẬP
  const completeSessionMutation = useMutation({
    mutationFn: (id: string) => workoutPlanRequest.completeSession(id),
    onSuccess: () => {
      // Làm mới toàn bộ dữ liệu liên quan để cập nhật Progress bar
      queryClient.invalidateQueries({ queryKey: ["workout-plans"] });
      queryClient.invalidateQueries({ queryKey: ["workout-plan-detail"] });
      queryClient.invalidateQueries({ queryKey: ["today-session"] });
    },
    onError: (error) => handleErrorApi({ error })
  });

  return {
    // Data & Loading cho danh sách nhiều lộ trình
    allPlans: plansQuery.data || [],
    isLoadingPlans: plansQuery.isLoading,

    // Data & Loading cho chi tiết 1 lộ trình được chọn
    currentPlan: planDetailQuery.data,
    isLoadingDetail: planDetailQuery.isLoading,

    // Dữ liệu buổi tập hôm nay
    todaySession: todaySessionQuery.data,
    isLoadingToday: todaySessionQuery.isLoading,

    // Dữ liệu động tác (sets/reps)
    exercises: sessionExercisesQuery.data || [],
    isLoadingExercises: sessionExercisesQuery.isLoading,

    // Actions
    refetchAll: plansQuery.refetch,
    completeSession: completeSessionMutation.mutate,
    isCompleting: completeSessionMutation.isPending
  };
};