import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { LoginBodyType } from '../../schemas/auth';

export const useLoginScreen = () => {
  const navigation = useNavigation<any>();
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState<LoginBodyType>({
    email: '',
    password: '',
  });

const { loginMutation } = useAuth({
  onLoginSuccess: () => {
    navigation.replace("Main"); 
  },
});
const handleLogin = () => {
  // 1. Kiểm tra dữ liệu trước (Validation)
  if (!formData.email || !formData.password) {
    Alert.alert("Thông báo", "Vui lòng nhập đầy đủ email và mật khẩu");
    return;
  }

  // 2. Log để debug (Chỉ nên log sau khi đã qua bước check)
  console.log("Đang gửi yêu cầu đăng nhập cho:", formData.email.trim());

  // 3. Chỉ gọi Mutation DUY NHẤT một lần với dữ liệu đã chuẩn hóa
  loginMutation.mutate({
    email: formData.email.trim(),
    password: formData.password,
  });
};

  const updateField = (field: keyof LoginBodyType, value: string) => {
    setFormData((prev: LoginBodyType) => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    updateField,
    showPass,
    setShowPass,
    handleLogin,
    isLoading: loginMutation.isPending,
    navigation,
  };
};