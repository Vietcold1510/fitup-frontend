
import { http } from "@/lib/http";
import { 
  TopupCreateRequest, 
  ConversionRateListRes, 
  TopupDetailRes 
} from "@/types/topup";

export const topupRequest = {
  // Lấy danh sách tỉ giá (Top-up vs Withdraw)
  getConversionRates: () => 
    http.get<ConversionRateListRes>("/api/conversion-rates"),

  // Tạo lệnh nạp tiền mới (PayOS)
  createTopup: (body: TopupCreateRequest) => 
    http.post<TopupDetailRes>("/api/topups/create", body),

  // Kiểm tra chi tiết một giao dịch
  getTopupDetail: (paymentId: string) => 
    http.get<TopupDetailRes>(`/api/topups/${paymentId}`),

  // Lấy lịch sử nạp tiền của tôi
  getMyTopups: () => 
    http.get<ConversionRateListRes>("/api/topups/my"),
// Xác thực kết quả trả về từ PayOS
  verifyPayOSReturn: (params: string) => 
    http.get(`/api/topups/payos/return?${params}`),
};

