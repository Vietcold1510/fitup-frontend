import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthInput } from "../../components/auth/AuthInput";
import { useLoginScreen } from "./useLoginScreen";

interface LoginScreenProps {
  onLoginSuccess: (token: string) => void;
  navigation: any;
  route: any;
}

const appLogo = require("../../../assets/Fitness_Logo__1_-removebg-preview.png");

export default function LoginScreen({
  onLoginSuccess,
  navigation,
}: LoginScreenProps) {
  const {
    formData,
    updateField,
    showPass,
    setShowPass,
    handleLogin,
    isLoading,
  } = useLoginScreen(onLoginSuccess);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <View style={styles.header}>
          <Image source={appLogo} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>FitUp</Text>
          <Text style={styles.subtitle}>Chào mừng bạn quay trở lại!</Text>
        </View>

        <View style={styles.form}>
          <AuthInput
            label="Email"
            icon="mail-outline"
            placeholder="Nhập email của bạn"
            value={formData.email}
            onChangeText={(v: string) => updateField("email", v)}
            autoCapitalize="none"
          />

          <AuthInput
            label="Mat khau"
            icon="lock-closed-outline"
            placeholder="Nhập mật khẩu"
            secureTextEntry={!showPass}
            rightIcon={showPass ? "eye-off-outline" : "eye-outline"}
            onRightIconPress={() => setShowPass(!showPass)}
            value={formData.password}
            onChangeText={(v: string) => updateField("password", v)}
          />

          <TouchableOpacity
            style={styles.forgotBtn}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.forgotText}>Quên mật khẩu?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginBtn, isLoading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.loginText}>Đăng nhập</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Chưa có tài khoản? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.link}>Đăng ký ngay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  content: { flex: 1, padding: 24, justifyContent: "center" },
  header: { alignItems: "center", marginBottom: 40 },
  logo: { width: 110, height: 110, marginBottom: 10 },
  title: { fontSize: 42, fontWeight: "bold", color: "#FF9500" },
  subtitle: { color: "#999", marginTop: 10 },
  form: { backgroundColor: "#1A1A1A", padding: 20, borderRadius: 24 },
  forgotBtn: { alignSelf: "flex-end", marginBottom: 20 },
  forgotText: { color: "#FF9500" },
  loginBtn: {
    backgroundColor: "#A65E1F",
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  footer: { marginTop: 30, alignItems: "center" },
  footerRow: { flexDirection: "row", alignItems: "center" },
  footerText: { color: "#999", fontSize: 14 },
  link: { color: "#FF9500", fontWeight: "bold", fontSize: 14 },
  ptLink: {
    color: "#4CD964",
    fontWeight: "bold",
    textDecorationLine: "underline",
    fontSize: 14,
  },
});
