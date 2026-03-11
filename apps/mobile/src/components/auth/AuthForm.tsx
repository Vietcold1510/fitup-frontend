import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Component Input dùng chung cho cả Login/Register
export const AuthInput = ({ label, icon, ...props }: any) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputWrapper}>
      <Ionicons name={icon} size={20} color="#999" style={styles.icon} />
      <TextInput style={styles.input} placeholderTextColor="#666" {...props} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  inputGroup: { marginBottom: 15 },
  label: { color: "#FFF", marginBottom: 8, fontSize: 14 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 52,
    borderWidth: 1,
    borderColor: "#444",
  },
  icon: { marginRight: 10 },
  input: { flex: 1, color: "#FFF", fontSize: 16 },
});
