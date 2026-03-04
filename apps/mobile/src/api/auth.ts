import { http } from "../lib/http";
import { 
    LoginBodyType, 
    RegisterBodyType, 
    VerifyOtpBodyType, 
    ForgotPasswordBodyType, 
    ResetPasswordBodyType 
} from "../schemas/auth";

export const authRequest = {
    register: (body: RegisterBodyType) => http.post("/auth/register", body),
    verifyOtp: (body: VerifyOtpBodyType) => http.post("/auth/verify-otp", body),
    resendOtp: (body: { email: string }) => http.post("/auth/resend-otp", body),
    login: (body: LoginBodyType) => http.post("/auth/login", body),
    forgotPassword: (body: ForgotPasswordBodyType) => http.post("/auth/forgot-password", body),
    resetPassword: (body: ResetPasswordBodyType) => http.post("/auth/reset-password", body),
};