import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthInput } from "../../components/auth/AuthInput";
import { useForgotPassword } from "./useForgotPassword";
import { Ionicons } from "@expo/vector-icons";

export default function ForgotPasswordScreen() {
  const { email, setEmail, handleSend, isLoading, navigation } =
    useForgotPassword();

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#FFF" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Quên mật khẩu?</Text>
        <Text style={styles.subtitle}>
          Đừng lo lắng! Hãy nhập Email đã đăng ký, chúng tôi sẽ gửi mã OTP để
          bạn đặt lại mật khẩu.
        </Text>

        <AuthInput
          label="Email Address"
          icon="mail-outline"
          placeholder="Nhập email của bạn"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[styles.btn, isLoading && { backgroundColor: "#555" }]}
          onPress={handleSend}
          disabled={isLoading}
        >
          {isLoading ? (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <ActivityIndicator color="#FFF" />
              <Text style={{ color: "#FFF", marginLeft: 10 }}>
                Đang kết nối Server (đợi 30s)...
              </Text>
            </View>
          ) : (
            <Text style={styles.btnText}>Gửi mã OTP</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  backBtn: { padding: 20 },
  content: { padding: 24, justifyContent: "center", flex: 0.8 },
  title: { fontSize: 32, fontWeight: "bold", color: "#FFF", marginBottom: 12 },
  subtitle: { color: "#999", lineHeight: 22, marginBottom: 32 },
  btn: {
    backgroundColor: "#A65E1F",
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  btnText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
});
