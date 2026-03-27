import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Thêm import Navigation
import AsyncStorage from '@react-native-async-storage/async-storage'; // Thêm import Storage
import { useAuth } from '../../hooks/useAuth';
import { LoginBodyType } from '../../schemas/auth';

// Import thêm API và cấu hình http
import { workoutPlanRequest } from '../../api/workoutPlan';
import { http } from '../../lib/http'; 

export const useLoginScreen = (onLoginSuccess: (token: string) => void) => {
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState<LoginBodyType>({
    email: '',
    password: '',
  });
  
  const navigation = useNavigation<any>();

  // KHÔNG dùng onSuccess ở đây nữa, ta sẽ dùng mutateAsync ở dưới để kiểm soát luồng
  const { loginMutation } = useAuth({});

  // BÊN TRONG useLoginScreen.ts

  const handleLogin = async () => {
    if (!formData.email || !formData.password) return;

    try {
      const res = await loginMutation.mutateAsync(formData);
      const token = res.data?.data?.accessToken; // Dùng 2 lần data như đã fix

      if (token) {
        await AsyncStorage.setItem("accessToken", token);
        
        // CHỈ CẦN GỌI DÒNG NÀY LÀ ĐỦ! App.tsx sẽ tự chuyển sang Main
        onLoginSuccess(token); 
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
    }
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