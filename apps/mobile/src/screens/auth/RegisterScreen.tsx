import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthInput } from "../../components/auth/AuthInput";
import { useRegisterScreen } from "./useRegisterScreen";

export default function RegisterScreen() {
  const {
    formData,
    updateField,
    showPass,
    setShowPass,
    showConfirmPass,
    setShowConfirmPass,
    handleSignUp,
    isLoading,
    navigation,
  } = useRegisterScreen();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Fitup</Text>
          <Text style={styles.subtitle}>
            Create your account to get started
          </Text>
        </View>

        <View style={styles.formCard}>
          <AuthInput
            label="Email Address"
            icon="mail-outline"
            placeholder="example@gmail.com"
            value={formData.email}
            onChangeText={(text) => updateField("email", text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <AuthInput
            label="Password"
            icon="lock-closed-outline"
            placeholder="Min. 8 characters"
            secureTextEntry={!showPass}
            rightIcon={showPass ? "eye-off-outline" : "eye-outline"}
            onRightIconPress={() => setShowPass(!showPass)}
            value={formData.password}
            onChangeText={(text) => updateField("password", text)}
          />

          <AuthInput
            label="Confirm Password"
            icon="shield-checkmark-outline"
            placeholder="Repeat password"
            secureTextEntry={!showConfirmPass}
            rightIcon={showConfirmPass ? "eye-off-outline" : "eye-outline"}
            onRightIconPress={() => setShowConfirmPass(!showConfirmPass)}
            value={formData.confirmPassword}
            onChangeText={(text) => updateField("confirmPassword", text)}
          />

          <TouchableOpacity
            style={[styles.signUpButton, isLoading && styles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.linkText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  scrollContent: { padding: 24 },
  header: { alignItems: "center", marginBottom: 32, marginTop: 20 },
  title: { fontSize: 36, fontWeight: "bold", color: "#FF9500" },
  subtitle: { color: "#999", fontSize: 14, marginTop: 8 },
  formCard: {
    backgroundColor: "#1A1A1A",
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#222",
  },
  signUpButton: {
    backgroundColor: "#A65E1F",
    height: 56,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#A65E1F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonDisabled: { backgroundColor: "#555", shadowOpacity: 0 },
  buttonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerText: { color: "#666", fontSize: 15 },
  linkText: { color: "#FF9500", fontWeight: "bold", fontSize: 15 },
});
