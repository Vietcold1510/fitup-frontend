import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AuthInputProps extends TextInputProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
}

export const AuthInput = ({
  label,
  icon,
  rightIcon,
  onRightIconPress,
  ...props
}: AuthInputProps) => (
  <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputWrapper}>
      <Ionicons name={icon} size={20} color="#999" style={styles.icon} />
      <TextInput style={styles.input} placeholderTextColor="#666" {...props} />
      {rightIcon && (
        <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
          <Ionicons name={rightIcon} size={20} color="#999" />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { color: "#FFF", marginBottom: 8, fontSize: 14, fontWeight: "500" },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 54,
    borderWidth: 1,
    borderColor: "#333",
  },
  icon: { marginRight: 10 },
  input: { flex: 1, color: "#FFF", fontSize: 16 },
  rightIcon: { padding: 4 },
});
