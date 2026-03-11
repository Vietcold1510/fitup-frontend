import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { OtpInput } from "../../components/auth/OtpInput";
import { useVerifyOtp } from "./useVerifyOtp";

export default function VerifyOtpScreen() {
  const {
    code,
    setCode,
    email,
    handleVerify,
    handleResend,
    isLoading,
    isResending,
  } = useVerifyOtp();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Verify Email</Text>
        <Text style={styles.subtitle}>
          Mã xác thực đã được gửi đến:{"\n"}
          <Text style={styles.emailText}>{email}</Text>
        </Text>

        <OtpInput code={code} setCode={setCode} maximumLength={6} />

        <TouchableOpacity
          style={[styles.btn, isLoading && { opacity: 0.6 }]}
          onPress={handleVerify}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.btnText}>Verify Now</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleResend}
          disabled={isResending}
          style={styles.resendBtn}
        >
          <Text style={styles.resendText}>
            {isResending
              ? "Đang gửi lại..."
              : "Chưa nhận được mã? Gửi lại mã mới"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  content: { padding: 24, alignItems: "center", marginTop: 50 },
  title: { fontSize: 32, fontWeight: "bold", color: "#FFF", marginBottom: 12 },
  subtitle: {
    color: "#999",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 30,
  },
  emailText: { color: "#FF9500", fontWeight: "bold" },
  btn: {
    backgroundColor: "#A65E1F",
    width: "100%",
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  btnText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  resendBtn: { marginTop: 30 },
  resendText: { color: "#FF9500", fontWeight: "600" },
});
