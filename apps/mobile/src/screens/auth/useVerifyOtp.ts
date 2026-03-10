import { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAuth } from "../../hooks/useAuth";
import { Alert } from "react-native";

export const useVerifyOtp = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const email = route.params?.email || ""; // Lấy email từ màn Register truyền sang

  const [code, setCode] = useState("");

  const { verifyOtpMutation, resendOtpMutation } = useAuth({
    onVerifySuccess: () => {
      navigation.navigate("Login"); // Xác thực xong thì đăng nhập
    },
  });

  const handleVerify = () => {
    if (code.length < 6) {
      Alert.alert("Lỗi", "Vui lòng nhập đủ 6 số");
      return;
    }
    verifyOtpMutation.mutate({ email, otp: code });
  };

  const handleResend = () => {
    resendOtpMutation.mutate({ email });
  };

  return {
    code,
    setCode,
    email,
    handleVerify,
    handleResend,
    isLoading: verifyOtpMutation.isPending,
    isResending: resendOtpMutation.isPending,
  };
};
