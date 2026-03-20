import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authRequest } from "../api/auth";
import { handleErrorApi } from "../lib/errors";
import { Alert } from "react-native";
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
    onRegisterPtSuccess?: (data: any) => void;
}

export const useAuth = (options?: UseAuthOptions) => {
    const queryClient = useQueryClient();

    // 1. Đăng ký tài khoản User
    const registerMutation = useMutation({
        mutationFn: (body: RegisterBodyType) => authRequest.register(body),
        onSuccess: (res) => {
            const successMsg = res.data?.message || "Mã OTP đã được gửi đến email của bạn.";
            Alert.alert("Thành công", successMsg);
            options?.onRegisterSuccess?.();
        },
        onError: (error) => handleErrorApi({ error })
    });

    // 2. Xác thực OTP
    const verifyOtpMutation = useMutation({
        mutationFn: (body: VerifyOtpBodyType) => authRequest.verifyOtp(body),
        onSuccess: (res) => {
            Alert.alert("Thành công", "Tài khoản của bạn đã được xác thực.");
            options?.onVerifySuccess?.();
        },
        onError: (error) => handleErrorApi({ error })
    });

    // 3. Gửi lại mã OTP
    const resendOtpMutation = useMutation({
        mutationFn: (body: { email: string }) => authRequest.resendOtp(body),
        onSuccess: (res) => {
            Alert.alert("Thông báo", res.data?.message || "Mã OTP mới đã được gửi.");
        },
        onError: (error) => handleErrorApi({ error })
    });

    // 4. Đăng nhập
    const loginMutation = useMutation({
        mutationFn: (body: LoginBodyType) => authRequest.login(body),
        onSuccess: async (res) => {
            const token = res.data?.data?.accessToken;
            if (token) {
                await tokenStorage.saveAuth(token);
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

    // 7. Đăng ký trở thành PT (Dựa trên API registerPt bạn vừa thêm)
    const registerPtMutation = useMutation({
        mutationFn: (body: any) => authRequest.registerPt(body),
        onSuccess: (res) => {
            const msg = res.data?.data?.message || "Hồ sơ PT đã được gửi thành công!";
            Alert.alert("Thành công", msg);
            options?.onRegisterPtSuccess?.(res.data);
        },
        onError: (error) => handleErrorApi({ error })
    });
    // 8. LOGOUT - Giải pháp dứt điểm lỗi Reset Navigator
const logout = async (onLogoutCallback?: () => void) => {
    try {
        await tokenStorage.clearAuth(); 
        
        queryClient.clear();

        if (onLogoutCallback) {
            onLogoutCallback();
        }
        
        console.log("Đã đăng xuất thành công.");
    } catch (error) {
        console.error("Lỗi khi đăng xuất:", error);
        Alert.alert("Lỗi", "Không thể đăng xuất lúc này.");
    }
};

    return {
        registerMutation,
        verifyOtpMutation,
        resendOtpMutation,
        loginMutation,
        forgotPasswordMutation,
        resetPasswordMutation,
        registerPtMutation,
        logout
    };
};