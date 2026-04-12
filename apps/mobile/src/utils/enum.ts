/**
 * Vai trò của tài khoản trong hệ thống
 */
export enum AccountRole {
  User = 0,
  PT = 1,
  Admin = 2,
  Staff = 3,
}

/**
 * Trạng thái hoạt động của tài khoản
 */
export enum AccountStatus {
  Inactive = 0,
  PendingVerification = 1,
  Active = 2,
  Suspended = 3,
}

/**
 * Trạng thái đơn đặt lịch tập (Booking)
 */
export enum BookingStatus {
  Pending = 0,
  Confirmed = 1,
  Completed = 2,
  Cancelled = 3,
}

/**
 * Loại thiết bị tập luyện (Khớp với trường 'equipment' trong API Workouts)
 */
export enum EquipmentType {
  Bodyweight = 1,
  Dumbbell = 2,
  Gym = 3,
}

/**
 * Trình độ kinh nghiệm của người dùng
 */
export enum ExperienceLevel {
  Beginner = 1,
  Intermediate = 2,
  Advanced = 3,
}

/**
 * Mục tiêu tập luyện
 */
export enum GoalType {
  LoseFat = 1,
  GainMuscle = 2,
  Maintain = 3,
  Strength = 4,
}

/**
 * Nhóm cơ mục tiêu (Khớp với trường 'primaryMuscle' trong API Workouts)
 */
export enum MuscleGroup {
  FullBody = 1,
  Chest = 2,
  Back = 3,
  Legs = 4,
  Shoulders = 5,
  Arms = 6,
  Core = 7,
  Glutes = 8,
  Cardio = 9,
}

/**
 * Trạng thái thanh toán
 */
export enum PaymentStatus {
  Pending = 0,
  Success = 1,
  Failed = 2,
  Cancelled = 3,
}

/**
 * Trạng thái gói đăng ký Premium
 */
export enum PremiumStatus {
  Active = 0,
  Expired = 1,
  Cancelled = 2,
}

/**
 * Các Enums đã cập nhật từ trước
 */
export enum WorkoutLevel {
  Beginner = 1,
  Intermediate = 2,
  Advanced = 3,
}

export enum PTReviewAction {
  Submitted = 1,
  Resubmitted = 2,
  Approved = 3,
  Rejected = 4,
}

export enum VerificationStatus {
  Pending = 0,
  Verified = 1,
  Rejected = 2,
}

export enum SlotForBookingStatus {
  Available = 0,
  Locked = 1,
  Booked = 2,
  Cancelled = 3,
}

export enum ServiceType {
  BookingPT = 0,
  Premium = 1,
}

export enum PremiumTypeStatus {
  Active = 0,
  Inactive = 1,
}

export enum ReviewStatus {
  Active = 0,
  Hidden = 1,
}

export enum SlotStatus {
  Active = 0,
  Inactive = 1,
}

export enum ConversionRateStatus {
  Active = 0,
  Inactive = 1,
}

export enum ConversionRateType {
  TopUp = 1,
  Withdraw = 2,
}

export enum PaymentMethod {
PayOS = 0,
}