import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authRequest } from "../api/auth";
import { handleErrorApi } from "../lib/errors";
import { Alert } from "react-native"; // Dùng Alert thay cho toast của Web
import { 
    LoginBodyType, 
    RegisterBodyType, 
    VerifyOtpBodyType, 
    ForgotPasswordBodyType, 
    ResetPasswordBodyType 
} from "../schemas/auth";
import { tokenStorage } from "@/lib/storage";

interface UseAuthOptions {
    onLoginSuccess?: (data: any) => void;
    onRegisterSuccess?: () => void;
    onVerifySuccess?: () => void;
    onForgotPasswordSuccess?: () => void;
    onResetPasswordSuccess?: () => void;
}

export const useAuth = (options?: UseAuthOptions) => {
    const queryClient = useQueryClient();

    // 1. Đăng ký
const registerMutation = useMutation({
    mutationFn: (body: RegisterBodyType) => authRequest.register(body),
    onSuccess: (res) => {
        // API trả về: { data: { message: "OTP has been sent." } }
        const successMsg = res.data?.message || "OTP has been sent.";
        Alert.alert("Thành công", successMsg);
        
        options?.onRegisterSuccess?.();
    },
    onError: (error) => {
        handleErrorApi({ error });
    }
});

    // 2. Xác thực OTP
    const verifyOtpMutation = useMutation({
        mutationFn: (body: VerifyOtpBodyType) => authRequest.verifyOtp(body),
        onSuccess: () => {
            Alert.alert("Thông báo", "Xác thực tài khoản thành công!");
            options?.onVerifySuccess?.();
        },
        onError: (error) => handleErrorApi({ error })
    });

    // 3. Gửi lại OTP
    const resendOtpMutation = useMutation({
        mutationFn: (body: { email: string }) => authRequest.resendOtp(body),
        onSuccess: () => {
            Alert.alert("Thành công", "Mã OTP mới đã được gửi.");
        },
        onError: (error) => handleErrorApi({ error })
    });

    // 4. Đăng nhập
const loginMutation = useMutation({
  mutationFn: (body: LoginBodyType) => authRequest.login(body),
  onSuccess: async (res) => {
    // API trả về: res.data.data.accessToken
    const token = res.data?.data?.accessToken; 

    if (token) {
      // Lưu vào máy để dùng cho các lần sau
      await tokenStorage.saveAuth(token); 
      
      // Kích hoạt callback để chuyển trang ở màn hình Login
      options?.onLoginSuccess?.(res.data);
    } else {
      console.log("Không tìm thấy accessToken trong phản hồi");
    }
  },
  onError: (error) => handleErrorApi({ error })
});
    // 5. Quên mật khẩu
const forgotPasswordMutation = useMutation({
    mutationFn: (body: ForgotPasswordBodyType) => authRequest.forgotPassword(body),
    onSuccess: (res) => {
        const msg = res.data?.data?.message || "Vui lòng kiểm tra email để lấy mã reset.";
        Alert.alert("Thông báo", msg);
        options?.onForgotPasswordSuccess?.(); 
    },
    onError: (error) => handleErrorApi({ error })
});

    // 6. Đặt lại mật khẩu
    const resetPasswordMutation = useMutation({
        mutationFn: (body: ResetPasswordBodyType) => authRequest.resetPassword(body),
        onSuccess: () => {
            Alert.alert("Thành công", "Mật khẩu đã được thay đổi. Hãy đăng nhập lại.");
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