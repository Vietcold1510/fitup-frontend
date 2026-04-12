import { GoalType, ExperienceLevel, EquipmentType } from "../utils/enum";

// --- 1. Navigator Params (Giải quyết lỗi 'never' khi dùng useRoute) ---
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Onboarding: undefined;
  GeneratingPlan: { onboardingProfileId: string }; // Bắt buộc truyền ID này
  Main: undefined; // Hoặc BottomTab Navigator của bạn
  WorkoutDetail: { sessionId: string };
  WorkoutTypes: undefined;
  WorkoutTypeWorkouts: { workoutTypeId: string; workoutTypeName?: string };
  WorkoutVideo: { workoutName?: string; videoUrl?: string | null };
};

// --- 2. Onboarding Data (Dữ liệu từ Form) ---
export interface OnboardingFormData {
  goalType: number;
  experienceLevel: number;
  weeks: number;
  daysPerWeek: number;
  minutesPerSession: number;
  equipment: number;
  focusAreas: string;
  limitations: string;
}

// --- 3. UI Step Structure (Cho màn hình Onboarding) ---
export interface OnboardingOption {
  label: string;
  value: number;
  icon: string;
}

export interface OnboardingStep {
  id: number;
  title: string;
  sub: string;
  key?: keyof OnboardingFormData;
  options?: OnboardingOption[];
  isInput?: boolean;
}

// --- 4. API Responses (Dùng cho useQuery và useMutation) ---
export interface GeneratePlanResponse {
  status: number;
  msg: string;
  data: {
    workoutPlanId: string;
  };
}

export interface OnboardingResponse {
  onboardingProfileId: string;
}

// Interface cho kết quả trả về từ API Onboarding
export interface OnboardingResponse {
  onboardingProfileId: string;
}
