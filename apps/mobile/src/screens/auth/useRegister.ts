import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { RegisterBodyType } from '@/schemas/auth';
import { Alert } from 'react-native';

export const useRegister = () => {
  const [formData, setFormData] = useState<RegisterBodyType>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Gọi useAuth hook bạn đã cung cấp
  const { registerMutation } = useAuth({
    onRegisterSuccess: () => {
      // Logic sau khi thành công, ví dụ chuyển sang màn hình nhập OTP
      console.log("Chuyển màn hình OTP");
    }
  });

  const onSignUp = () => {
    // Validation cơ bản trước khi gọi API
    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp!");
      return;
    }
    
    // Thực thi mutation từ useAuth
    registerMutation.mutate(formData);
  };

  return {
    formData,
    setFormData,
    onSignUp,
    isLoading: registerMutation.isPending
  };
};