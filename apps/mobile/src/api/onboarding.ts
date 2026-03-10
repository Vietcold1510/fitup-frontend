import { http } from "../lib/http";
import { OnboardingBodyType, OnboardingResponse } from "../schemas/onboarding";

export const onboardingRequest = {
  submit: (body: OnboardingBodyType) => 
    http.post<OnboardingResponse>("/api/onboarding/submit", body),
};