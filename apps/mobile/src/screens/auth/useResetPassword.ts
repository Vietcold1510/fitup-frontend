import { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Alert } from 'react-native';
import { useAuth } from '../../hooks/useAuth';

export const useResetPassword = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  
  // Lấy email từ màn hình Forgot Password truyền sang
  const email = route.params?.email || "";

  const [formData, setFormData] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPass, setShowPass] = useState(false);

  const { resetPasswordMutation } = useAuth({
    onResetPasswordSuccess: () => {
      // Thành công thì về thẳng Login
      navigation.navigate("Login");
    }
  });

  const handleResetPassword = () => {
    const { otp, newPassword, confirmPassword } = formData;

    if (otp.length < 6) {
      return Alert.alert("Lỗi", "Vui lòng nhập đúng mã OTP 6 chữ số");
    }
    if (newPassword.length < 8) {
      return Alert.alert("Lỗi", "Mật khẩu mới phải từ 8 ký tự trở lên");
    }
    if (newPassword !== confirmPassword) {
      return Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
    }

    // Gọi API với cấu trúc JSON Hàn đã cung cấp
    resetPasswordMutation.mutate({
      email,
      otp,
      newPassword
    });
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return {
    email,
    formData,
    updateField,
    showPass,
    setShowPass,
    handleResetPassword,
    isLoading: resetPasswordMutation.isPending,
    navigation
  };
};