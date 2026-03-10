import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  color?: string;
}

export const AuthButton = ({
  title,
  onPress,
  isLoading,
  color = "#A65E1F",
}: AuthButtonProps) => (
  <TouchableOpacity
    style={[
      styles.button,
      { backgroundColor: color },
      isLoading && { opacity: 0.7 },
    ]}
    onPress={onPress}
    disabled={isLoading}
  >
    {isLoading ? (
      <ActivityIndicator color="#FFF" />
    ) : (
      <Text style={styles.text}>{title}</Text>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    height: 54,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  text: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
});
