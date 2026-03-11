import { z } from "zod";
import { GoalType, ExperienceLevel, EquipmentType } from "../utils/enum";

export const OnboardingBodySchema = z.object({
  goalType: z.nativeEnum(GoalType),
  experienceLevel: z.nativeEnum(ExperienceLevel),
  weeks: z.number().min(1, "Vui lòng chọn số tuần"),
  daysPerWeek: z.number().min(1, "Vui lòng chọn số ngày mỗi tuần"),
  minutesPerSession: z.number().min(1, "Vui lòng chọn thời gian mỗi buổi"),
  equipment: z.nativeEnum(EquipmentType),
  focusAreas: z.string().min(1, "Vui lòng nhập vùng cơ muốn tập trung"),
  limitations: z.string().optional(),
});

export type OnboardingBodyType = z.infer<typeof OnboardingBodySchema>;

export interface OnboardingResponse {
  status: number;
  msg: string;
  data: {
    onboardingProfileId: string;
  };
}