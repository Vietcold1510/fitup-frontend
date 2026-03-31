import { z } from "zod";
import { PaymentStatus, ServiceType } from "../utils/enum";

/**
 * 1. CHI TIẾT THANH TOÁN CHO BOOKING (PT)
 * Tương ứng với trường 'bookingPaymentDetail' trong API
 */
export const BookingPaymentDetailSchema = z.object({
  bookingPaymentId: z.string(),
  price: z.number(),
  bookingId: z.string(),
  accountId: z.string(),
  slotForBookingId: z.string(),
  total: z.number(),
  note: z.string().default(""),
  bookingStatus: z.number(),
});

/**
 * 2. CHI TIẾT THANH TOÁN CHO PREMIUM
 * Hiện tại đang là null trong API mẫu của Hàn, dùng placeholder để mở rộng sau này
 */
export const PremiumPaymentDetailSchema = z.object({
  premiumPaymentId: z.string(),
  price: z.number(),
  premiumId: z.string(),
  premiumTypeId: z.string(),
  accountId: z.string(),
  startDate: z.string(), // ISO Date
  endDate: z.string(),   // ISO Date
  premiumStatus: z.number(),
});

/**
 * 3. SCHEMA CƠ SỞ (BASE)
 * Chứa các trường chung mà cả List và Detail đều có
 */
export const BaseServicePaymentSchema = z.object({
  servicePaymentId: z.string(), 
  amount: z.number(),
  serviceType: z.nativeEnum(ServiceType),
  paymentDate: z.string(),
  status: z.nativeEnum(PaymentStatus),
});

/**
 * 4. SCHEMA CHO DANH SÁCH GIAO DỊCH
 * API: GET /api/service-payments/my-history
 */
export const ServicePaymentListResponseSchema = z.object({
  status: z.number(),
  msg: z.string(),
  data: z.array(
    BaseServicePaymentSchema.extend({
      premiumId: z.string().nullable(), 
      bookingId: z.string().nullable(), 
      accountId: z.string(),
    })
  ),
});

/**
 * 5. SCHEMA CHO CHI TIẾT GIAO DỊCH
 * API: GET /api/service-payments/my-history/{servicePaymentId}
 */
export const ServicePaymentDetailResponseSchema = z.object({
  status: z.number(),
  msg: z.string(),
  data: z.object({
    servicePaymentId: z.string(),
    amount: z.number(),
    serviceType: z.nativeEnum(ServiceType),
    paymentDate: z.string(),
    status: z.nativeEnum(PaymentStatus),
    premiumPaymentDetail: PremiumPaymentDetailSchema.nullable(),
    bookingPaymentDetail: BookingPaymentDetailSchema.nullable(),
  }),
});

// --- INFERRED TYPES (Dùng để export ra sử dụng trong Component) ---

export type ServicePaymentListItem = z.infer<typeof ServicePaymentListResponseSchema>["data"][0];
export type ServicePaymentDetail = z.infer<typeof ServicePaymentDetailResponseSchema>["data"];
export type BookingPaymentDetail = z.infer<typeof BookingPaymentDetailSchema>;