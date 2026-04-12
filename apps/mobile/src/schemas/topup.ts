import { z } from "zod";
import { ConversionRateType, PaymentStatus, PaymentMethod } from "@/utils/enum";

export const ConversionRateSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(ConversionRateType),
  rate: z.number(),
  status: z.number(),
});

export const TopupCreateRequestSchema = z.object({
  amountVnd: z.number().min(1000, "Số tiền tối thiểu là 1.000đ"),
  conversionRateId: z.string(),
});

export const TopupResponseSchema = z.object({
  paymentId: z.string(),
  amount: z.number(),
  orderCode: z.number(),
  checkoutUrl: z.string().url(),
  status: z.nativeEnum(PaymentStatus),
  expiredAt: z.string(),
  paidAt: z.string().nullable().optional(),
  confirmedAt: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  method: z.nativeEnum(PaymentMethod).optional(),
});

export const TopupHistoryResponseSchema = z.array(TopupResponseSchema);