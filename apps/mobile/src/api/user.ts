import { http } from "../lib/http";

export const userRequest = {
  // Lấy profile của chính mình (thường dùng sau khi login)
  getMyProfile: () => http.get("/UserProfiles"),

  // Lấy Profile chi tiết của PT (Để hiện Dashboard, Bio, Bằng cấp...)
  getPtProfile: () => http.get("/api/pt/profile"),
  
  // Lấy profile theo AccountId (cho Admin hoặc xem profile PT)
  getProfileById: (accountId: string) => http.get(`/UserProfiles/${accountId}`),
  
  // Tạo mới Profile (thường dùng trong Onboarding)
  createProfile: (body: any) => http.post("/UserProfiles", body),
  
  // Cập nhật Profile
  updateProfile: (accountId: string, body: any) => http.put(`/UserProfiles/${accountId}`, body),
};