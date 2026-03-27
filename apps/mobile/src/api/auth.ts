import { http } from "../lib/http";
import { 
    LoginBodyType, 
    RegisterBodyType, 
    VerifyOtpBodyType, 
    ForgotPasswordBodyType, 
    ResetPasswordBodyType 
} from "../schemas/auth";

export const authRequest = {
    // Đăng ký tài khoản người dùng cơ bản
    register: (body: RegisterBodyType) => http.post("/auth/register", body),
    
    // Xác thực mã OTP
    verifyOtp: (body: VerifyOtpBodyType) => http.post("/auth/verify-otp", body),
    
    // Gửi lại mã OTP
    resendOtp: (body: { email: string }) => http.post("/auth/resend-otp", body),
    
    // Đăng nhập hệ thống
    login: (body: LoginBodyType) => http.post("/auth/login", body),
    
    // Quên mật khẩu
    forgotPassword: (body: ForgotPasswordBodyType) => http.post("/auth/forgot-password", body),
    
    // Đặt lại mật khẩu mới
    resetPassword: (body: ResetPasswordBodyType) => http.post("/auth/reset-password", body),

registerPt: (body: any) => http.post("/api/pt/register", body),
    // Lấy thông tin profile hiện tại để kiểm tra Role và Status
    getProfile: () => http.get("/auth/profile"),
};