import { useState } from "react";
import { onboardingRequest } from "@/api/onboarding";
import { OnboardingFormData } from "@/types/workout";

export const useOnboarding = () => {
  const [isLoading, setIsLoading] = useState(false);

  const submitOnboarding = async (formData: OnboardingFormData) => {
    setIsLoading(true);
    console.log("-----------------------------------------");
    console.log("🚀 [STEP 1] SENDING ONBOARDING DATA...");
    
    try {
      const res = await onboardingRequest.submit(formData);
      // Theo cấu trúc Hàn gửi: res.data.data.onboardingProfileId
      const result = res.data.data;

      if (result?.onboardingProfileId) {
        console.log("✅ [STEP 1] SUCCESS: ID RECEIVED");
        console.log("🆔 ID:", result.onboardingProfileId);
        console.log("-----------------------------------------");
        return result;
      }
      
      console.warn("⚠️ [STEP 1] WARNING: NO ID IN RESPONSE");
      return null;
    } catch (error) {
      console.error("❌ [STEP 1] FAILED:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { submitOnboarding, isLoading };
};