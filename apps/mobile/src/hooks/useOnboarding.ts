import { useMutation } from "@tanstack/react-query";
import { onboardingRequest } from "../api/onboarding";
import { OnboardingBodyType } from "../schemas/onboarding";
import { handleErrorApi } from "../lib/errors";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";

export const useOnboarding = () => {
  const navigation = useNavigation<any>();

  const submitOnboardingMutation = useMutation({
    mutationFn: (body: OnboardingBodyType) => onboardingRequest.submit(body),
    onSuccess: (res) => {
      console.log("Onboarding Profile ID:", res.data.data.onboardingProfileId);
      Alert.alert("Thành công", "Lộ trình tập luyện của bạn đã được khởi tạo!");
      // Chuyển vào màn hình Main sau khi onboarding xong
      navigation.replace("Main");
    },
    onError: (error) => {
      handleErrorApi({ error });
    },
  });

  return {
    submitOnboarding: submitOnboardingMutation.mutate,
    isLoading: submitOnboardingMutation.isPending,
  };
};