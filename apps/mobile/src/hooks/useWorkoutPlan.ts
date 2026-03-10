import { useMutation } from "@tanstack/react-query";
import { workoutPlanRequest } from "../api/workoutPlan";
import { handleErrorApi } from "../lib/errors";
import { useNavigation } from "@react-navigation/native";

export const useGenerateWorkoutPlan = () => {
  const navigation = useNavigation<any>();

  return useMutation({
    mutationFn: (profileId: string) => workoutPlanRequest.generatePlan(profileId),
    onSuccess: (res) => {
      const planId = res.data.data.workoutPlanId;
      console.log("🚀 Lộ trình đã sẵn sàng:", planId);
      
      // Chuyển sang màn hình chính hoặc màn hình chúc mừng
      navigation.replace("Main", { screen: "Home", params: { planId } });
    },
    onError: (error) => {
      handleErrorApi({ error });
    }
  });
};