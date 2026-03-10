import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { RegisterBodyType } from "../../schemas/auth";

export const useRegisterScreen = () => {
  const navigation = useNavigation<any>();

  // 1. Quản lý trạng thái Form
  const [formData, setFormData] = useState<RegisterBodyType>({
    fullName: "", // Tùy chọn nếu API của bạn cần
    email: "",
    password: "",
    confirmPassword: "",
  });

  // 2. Trạng thái hiển thị (UI State)
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // 3. Kết nối với useAuth (TanStack Query)
  const { registerMutation } = useAuth({
    onRegisterSuccess: () => {
      // Khi API trả về thành công, chuyển sang màn hình VerifyOtp
      // Truyền email qua route params để màn hình tiếp theo sử dụng
      navigation.navigate("VerifyOtp", { email: formData.email.trim() });

      Alert.alert(
        "Xác thực Email",
        "Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra!",
      );
    },
  });

  // 4. Hàm xử lý khi nhấn nút Sign Up
  const handleSignUp = () => {
    const { email, password, confirmPassword } = formData;

    // Validation cơ bản phía Client
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ Email và Mật khẩu");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 8 ký tự");
      return;
    }

    // Thực hiện gọi API qua Mutation
    // API Render của Hàn: POST /auth/register
    registerMutation.mutate({
      email: email.trim(),
      password: password,
    });
  };

  // 5. Hàm cập nhật dữ liệu linh hoạt
  const updateField = (field: keyof RegisterBodyType, value: string) => {
    setFormData((prev: RegisterBodyType) => ({
      ...prev,
      [field]: value,
    }));
  };

  return {
    formData,
    updateField,
    showPass,
    setShowPass,
    showConfirmPass,
    setShowConfirmPass,
    handleSignUp,
    isLoading: registerMutation.isPending,
    navigation,
  };
};
