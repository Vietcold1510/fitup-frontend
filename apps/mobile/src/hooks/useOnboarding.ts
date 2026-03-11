import { useMutation } from "@tanstack/react-query";
import { onboardingRequest } from "../api/onboarding";
import { OnboardingBodyType } from "../schemas/onboarding";
import { handleErrorApi } from "../lib/errors";
import { useNavigation } from "@react-navigation/native";

export const useOnboarding = () => {
  const navigation = useNavigation<any>();

  const submitOnboardingMutation = useMutation({
    mutationFn: (body: OnboardingBodyType) => onboardingRequest.submit(body),
    onSuccess: (res) => {
      // Bóc tách ID từ cấu trúc: res.data.data.onboardingProfileId
      const profileId = res.data.data.onboardingProfileId;
      
      console.log("-----------------------------------------");
      console.log("✅ [STEP 1] ONBOARDING SUCCESS");
      console.log("🆔 Profile ID:", profileId);
      
      // Chuyển sang màn hình Loading và truyền ID làm params
      navigation.replace("GeneratingPlan", { 
        onboardingProfileId: profileId 
      });
    },
    onError: (error) => {
      console.error("❌ [STEP 1] ONBOARDING ERROR:", error);
      handleErrorApi({ error });
    },
  });

  return {
    submitOnboarding: submitOnboardingMutation.mutate,
    isLoading: submitOnboardingMutation.isPending,
  };
};