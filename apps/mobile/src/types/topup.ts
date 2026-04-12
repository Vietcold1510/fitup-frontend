import { z } from "zod";
import { 
  ConversionRateSchema, 
  TopupCreateRequestSchema, 
  TopupResponseSchema 
} from "../schemas/topup";

export type ConversionRate = z.infer<typeof ConversionRateSchema>;
export type TopupCreateRequest = z.infer<typeof TopupCreateRequestSchema>;
export type TopupResponse = z.infer<typeof TopupResponseSchema>;

export interface ConversionRateListRes {
  status: number;
  msg: string;
  data: ConversionRate[];
}

export interface TopupDetailRes {
  status: number;
  msg: string;
  data: TopupResponse;
}

export interface TopupHistoryListRes {
  status: number;
  msg: string;
  data: TopupResponse[];
}