import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AuthInput } from "../../components/auth/AuthInput";
import { useResetPassword } from "./useResetPassword";

export default function ResetPasswordScreen() {
  const {
    email,
    formData,
    updateField,
    showPass,
    setShowPass,
    handleResetPassword,
    isLoading,
    navigation,
  } = useResetPassword();

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Mũi tên quay lại ở góc trên */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={28} color="#FFF" />
      </TouchableOpacity>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Thiết lập lại</Text>
            <Text style={styles.subtitle}>Mã xác thực đã được gửi đến:</Text>
            <Text style={styles.emailText}>{email}</Text>
          </View>

          <View style={styles.form}>
            <AuthInput
              label="Mã OTP"
              icon="key-outline"
              placeholder="Nhập 6 số từ Email"
              keyboardType="number-pad"
              maxLength={6}
              value={formData.otp}
              onChangeText={(v) => updateField("otp", v)}
            />

            <AuthInput
              label="Mật khẩu mới"
              icon="lock-closed-outline"
              placeholder="Ít nhất 8 ký tự"
              secureTextEntry={!showPass}
              rightIcon={showPass ? "eye-off-outline" : "eye-outline"}
              onRightIconPress={() => setShowPass(!showPass)}
              value={formData.newPassword}
              onChangeText={(v) => updateField("newPassword", v)}
            />

            <AuthInput
              label="Xác nhận mật khẩu"
              icon="shield-checkmark-outline"
              placeholder="Nhập lại mật khẩu mới"
              secureTextEntry={!showPass}
              value={formData.confirmPassword}
              onChangeText={(v) => updateField("confirmPassword", v)}
            />

            <TouchableOpacity
              style={[styles.btn, isLoading && { opacity: 0.7 }]}
              onPress={handleResetPassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.btnText}>Cập nhật mật khẩu</Text>
              )}
            </TouchableOpacity>

            {/* 2. Nút quay về màn hình Login ở dưới cùng của form */}
            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.loginLinkText}>
                Quay lại <Text style={styles.orangeText}>Đăng nhập</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  backButton: {
    padding: 16,
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
  },
  scrollContent: { padding: 24, flexGrow: 1, justifyContent: "center" },
  header: { marginBottom: 32, alignItems: "center" },
  title: { fontSize: 32, fontWeight: "bold", color: "#FFF" },
  subtitle: { color: "#999", marginTop: 8 },
  emailText: { color: "#FF9500", fontWeight: "600", marginTop: 4 },
  form: {
    backgroundColor: "#1A1A1A",
    padding: 20,
    borderRadius: 24,
    width: "100%",
  },
  btn: {
    backgroundColor: "#A65E1F",
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  btnText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  loginLink: { marginTop: 25, alignItems: "center" },
  loginLinkText: { color: "#999", fontSize: 14 },
  orangeText: { color: "#FF9500", fontWeight: "bold" },
});
