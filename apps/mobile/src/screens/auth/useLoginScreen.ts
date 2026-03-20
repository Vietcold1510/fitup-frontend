import { useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { LoginBodyType } from '../../schemas/auth';

// Nhận callback onLoginSuccess từ Screen
export const useLoginScreen = (onLoginSuccess: (token: string) => void) => {
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState<LoginBodyType>({
    email: '',
    password: '',
  });

  // Sử dụng useAuth mutation
  const { loginMutation } = useAuth({
    onLoginSuccess: (res: any) => {
      // 1. Lấy token từ phản hồi của Backend Hàn (JSON data.accessToken)
      const token = res?.data?.accessToken || res?.accessToken;

      if (token) {
        // 2. Gọi callback để App.tsx thực hiện decode Role và chuyển màn hình
        // CHỈ CẦN DÒNG NÀY, không dùng navigation.replace nữa
        onLoginSuccess(token);
        console.log("--- Token sent to App.tsx ---");
      } else {
        Alert.alert("Lỗi", "Không tìm thấy mã truy cập từ máy chủ.");
      }
    },
  });

  const handleLogin = () => {
    // Kiểm tra dữ liệu
    if (!formData.email || !formData.password) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }

    // Chuẩn hóa email và gửi mutation
    loginMutation.mutate({
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    });
  };

  const updateField = (field: keyof LoginBodyType, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    updateField,
    showPass,
    setShowPass,
    handleLogin,
    isLoading: loginMutation.isPending,
  };
};