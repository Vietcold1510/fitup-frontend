import { http } from "../lib/http";

export const ptPublicRequest = {
  // Lấy danh sách PT (có hỗ trợ filter theo tên và giá)
  getAllPts: (params?: { Name?: string; MinPrice?: number; MaxPrice?: number }) => 
    http.get("/api/pt", { params }),

  // Xem chi tiết một PT cụ thể bằng ID
  getPtById: (id: string) => 
    http.get(`/api/pt/${id}`),

  // Lấy các slot rảnh của một PT cụ thể theo khoảng thời gian
  getAvailableSlots: (ptId: string, startDate: string, endDate?: string) => 
    http.get(`/api/slots/available/${ptId}`, { 
      params: { startDate, endDate } 
    }),
};