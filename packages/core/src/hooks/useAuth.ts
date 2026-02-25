import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authRequest } from "../api/auth";
import { handleErrorApi } from "../lib/errors";
import { 
    LoginBodyType, 
    RegisterBodyType, 
    VerifyOtpBodyType, 
    ForgotPasswordBodyType, 
    ResetPasswordBodyType 
} from "../schemas/auth";
import { toast } from "sonner"; // Hoặc bọc một hàm notify dùng chung

interface UseAuthOptions {
    onLoginSuccess?: (data: any) => void;
    onRegisterSuccess?: () => void;
    onVerifySuccess?: () => void;
    onResetPasswordSuccess?: () => void;
}

export const useAuth = (options?: UseAuthOptions) => {
    const queryClient = useQueryClient();

    // 1. Đăng ký
    const registerMutation = useMutation({
        mutationFn: (body: RegisterBodyType) => authRequest.register(body),
        onSuccess: () => {
            toast.success("Đăng ký thành công! Vui lòng kiểm tra mã OTP trong email.");
            options?.onRegisterSuccess?.();
        },
        onError: (error) => handleErrorApi({ error })
    });

    // 2. Xác thực OTP
    const verifyOtpMutation = useMutation({
        mutationFn: (body: VerifyOtpBodyType) => authRequest.verifyOtp(body),
        onSuccess: () => {
            toast.success("Xác thực tài khoản thành công!");
            options?.onVerifySuccess?.();
        },
        onError: (error) => handleErrorApi({ error })
    });

    // 3. Gửi lại OTP
    const resendOtpMutation = useMutation({
        mutationFn: (body: { email: string }) => authRequest.resendOtp(body),
        onSuccess: () => {
            toast.success("Mã OTP mới đã được gửi.");
        },
        onError: (error) => handleErrorApi({ error })
    });

    // 4. Đăng nhập
    const loginMutation = useMutation({
        mutationFn: (body: LoginBodyType) => authRequest.login(body),
        onSuccess: (res) => {
            toast.success("Đăng nhập thành công!");
            // res.data chứa token, bạn xử lý lưu vào Store ở đây
            options?.onLoginSuccess?.(res.data);
        },
        onError: (error) => handleErrorApi({ error })
    });

    // 5. Quên mật khẩu (Yêu cầu gửi OTP)
    const forgotPasswordMutation = useMutation({
        mutationFn: (body: ForgotPasswordBodyType) => authRequest.forgotPassword(body),
        onSuccess: () => {
            toast.success("Yêu cầu thành công. Vui lòng kiểm tra email để lấy mã reset.");
        },
        onError: (error) => handleErrorApi({ error })
    });

    // 6. Đặt lại mật khẩu (Dùng OTP mới)
    const resetPasswordMutation = useMutation({
        mutationFn: (body: ResetPasswordBodyType) => authRequest.resetPassword(body),
        onSuccess: () => {
            toast.success("Mật khẩu đã được thay đổi. Hãy đăng nhập lại.");
            options?.onResetPasswordSuccess?.();
        },
        onError: (error) => handleErrorApi({ error })
    });

    return {
        registerMutation,
        verifyOtpMutation,
        resendOtpMutation,
        loginMutation,
        forgotPasswordMutation,
        resetPasswordMutation
    };
};