import { http } from "../lib/http";

export const bookingRequest = {
  // 1. Đặt lịch mới (Dành cho Học viên)
  bookSlot: (body: { slotForBookingId: string; note: string }) => 
    http.post("/api/Booking/book", body),

  // 2. Lấy danh sách lịch đã đặt của tôi (Dành cho Học viên)
  getMyBookings: () => 
    http.get("/api/Booking/my-bookings"),

  // 3. Hủy lịch tập
  cancelBooking: (id: string) => 
    http.delete(`/api/Booking/my-bookings/${id}`),

  // 4. Gửi đánh giá sau buổi tập
  sendFeedback: (body: { bookingId: string; rating: number; comment: string }) => 
    http.post("/api/Booking/feedback", body),

  // 5. Lấy danh sách lịch tập của tôi (Dành cho PT) - 🚀 MỚI THÊM
  getPtBookings: () => 
    http.get("/api/Booking/pt/my-bookings"),

  // 6. Xác nhận hoàn thành buổi tập (Dành cho PT)
  completeBooking: (bookingId: string) => 
    http.post(`/api/Booking/${bookingId}/complete`), // Thêm /api/ để khớp với Backend
};