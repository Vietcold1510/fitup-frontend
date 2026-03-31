import { http } from "@/lib/http";
import { ServicePaymentDetailResponseSchema, ServicePaymentListResponseSchema } from "@/schemas/servicePayment";


export const servicePaymentRequest = {
  // Lấy danh sách lịch sử
  getMyHistory: async () => {
    const res = await http.get("/api/service-payments/my-history");
    // Validate dữ liệu mảng
    return ServicePaymentListResponseSchema.parse(res.data).data;
  },

  // Lấy chi tiết một hóa đơn
  getPaymentDetail: async (id: string) => {
    const res = await http.get(`/api/service-payments/my-history/${id}`);
    // Validate object chi tiết
    return ServicePaymentDetailResponseSchema.parse(res.data).data;
  }
};