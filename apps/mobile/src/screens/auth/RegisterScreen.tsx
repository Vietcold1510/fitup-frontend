import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function RegisterScreen() {
  const navigation = useNavigation<any>();
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [agree, setAgree] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header & Logo */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="barbell" size={40} color="black" />
            </View>
            <Text style={styles.brandTitle}>Fit up</Text>
            <Text style={styles.mainTitle}>Create your account</Text>
            <Text style={styles.subtitle}>
              Start your personalized fitness journey
            </Text>
          </View>

          {/* Registration Card */}
          <View style={styles.card}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor="#666"
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="mail"
                  size={20}
                  color="#999"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="you@example.com"
                  placeholderTextColor="#666"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed"
                  size={20}
                  color="#999"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Create a password"
                  secureTextEntry={!showPass}
                  placeholderTextColor="#666"
                />
                <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                  <Ionicons
                    name={showPass ? "eye-off" : "eye"}
                    size={20}
                    color="#999"
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.hint}>
                Min 8 characters, include number and letter
              </Text>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed"
                  size={20}
                  color="#999"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm your password"
                  secureTextEntry={!showConfirmPass}
                  placeholderTextColor="#666"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPass(!showConfirmPass)}
                >
                  <Ionicons
                    name={showConfirmPass ? "eye-off" : "eye"}
                    size={20}
                    color="#999"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Quick Preferences */}
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>
                Quick Preferences (Optional)
              </Text>
              <Ionicons name="chevron-down" size={20} color="#999" />
            </TouchableOpacity>

            {/* Terms Checkbox */}
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                onPress={() => setAgree(!agree)}
                style={[styles.checkbox, agree && styles.checkboxActive]}
              >
                {agree && <Ionicons name="checkmark" size={16} color="white" />}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>
                I agree to the{" "}
                <Text style={styles.orangeLink}>Terms of Service</Text> and{" "}
                <Text style={styles.orangeLink}>Privacy Policy</Text>
              </Text>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity style={styles.signUpButton}>
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.linkText}>Log in</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dividerContainer}>
              <View style={styles.line} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.line} />
            </View>

            {/* Google Social */}
            <TouchableOpacity style={styles.googleButton}>
              <Ionicons
                name="logo-google"
                size={20}
                color="#FFF"
                style={{ marginRight: 12 }}
              />
              <Text style={styles.googleText}>Continue with Google</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  scrollContent: { padding: 24 },
  header: { alignItems: "center", marginBottom: 24 },
  logoContainer: {
    backgroundColor: "#FF9500",
    padding: 10,
    borderRadius: 14,
    marginBottom: 12,
  },
  brandTitle: { fontSize: 28, fontWeight: "bold", color: "#FFF" },
  mainTitle: { fontSize: 22, fontWeight: "bold", color: "#FFF", marginTop: 16 },
  subtitle: { fontSize: 14, color: "#999", marginTop: 8 },
  card: {
    backgroundColor: "#1E1E1E",
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#333",
  },
  inputGroup: { marginBottom: 18 },
  label: { color: "#FFF", marginBottom: 8, fontSize: 14, fontWeight: "500" },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 54,
    borderWidth: 1,
    borderColor: "#444",
  },
  icon: { marginRight: 10 },
  input: { flex: 1, color: "#FFF", fontSize: 16 },
  hint: { color: "#666", fontSize: 12, marginTop: 6 },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    borderTopWidth: 1,
    borderTopColor: "#333",
    marginTop: 8,
  },
  dropdownText: { color: "#FFF", fontSize: 15, fontWeight: "600" },
  checkboxContainer: {
    flexDirection: "row",
    marginTop: 15,
    alignItems: "flex-start",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#444",
    borderRadius: 6,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxActive: { backgroundColor: "#A65E1F", borderColor: "#A65E1F" },
  checkboxLabel: { color: "#999", flex: 1, fontSize: 13, lineHeight: 20 },
  orangeLink: { color: "#A65E1F", fontWeight: "600" },
  signUpButton: {
    backgroundColor: "#A65E1F",
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
  },
  signUpButtonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  footerText: { color: "#999", fontSize: 15 },
  linkText: { color: "#A65E1F", fontWeight: "bold", fontSize: 15 },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  line: { flex: 1, height: 1, backgroundColor: "#333" },
  orText: { color: "#666", marginHorizontal: 12 },
  googleButton: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    height: 54,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  googleText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
});
