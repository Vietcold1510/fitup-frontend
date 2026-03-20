import { http } from "../lib/http";

export const ptSlotRequest = {
  // Đăng ký lịch rảnh mẫu (Theo thứ trong tuần)
  createSlotTemplate: (body: { slotStart: string; slotEnd: string; dateInWeek: number; price: number }) => 
    http.post("/api/pt/slots", body),

  // Lấy danh sách các khung giờ rảnh mẫu đã cài đặt
  getSlotTemplates: () => http.get("/api/pt/slots"),

  // Cập nhật lịch mẫu
  updateSlotTemplate: (id: string, body: any) => http.put(`/api/pt/slots/${id}`, body),

  // Xóa lịch mẫu (Sẽ mất các slot tương ứng trong tương lai)
  deleteSlotTemplate: (id: string) => http.delete(`/api/pt/slots/${id}`),

  // LẤY LỊCH THỰC TẾ TRÊN CALENDAR (Để hiển thị dấu chấm trên bộ lịch)
  getCalendarSlots: (startDate: string) => 
    http.get(`/api/pt/slots/calendar?startDate=${startDate}`),

  // Xóa một slot cụ thể trên lịch (Ví dụ bận đột xuất ngày đó)
  deleteCalendarSlot: (id: string) => http.delete(`/api/pt/slots/calendar/${id}`),
};