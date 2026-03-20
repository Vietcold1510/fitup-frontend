import { http } from "../lib/http";

export const bookingRequest = {
  // 1. Đặt lịch mới
  bookSlot: (body: { slotForBookingId: string; note: string }) => 
    http.post("/api/Booking/book", body),

  // 2. Lấy danh sách lịch đã đặt của tôi
  getMyBookings: () => 
    http.get("/api/Booking/my-bookings"),

  // 3. Hủy lịch tập
  cancelBooking: (id: string) => 
    http.delete(`/api/Booking/my-bookings/${id}`),

  // 4. Gửi đánh giá sau buổi tập
  sendFeedback: (body: { bookingId: string; rating: number; comment: string }) => 
    http.post("/api/Booking/feedback", body),
};