import React from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";

interface OtpInputProps {
  code: string;
  setCode: (code: string) => void;
  maximumLength: number;
}

export const OtpInput = ({ code, setCode, maximumLength }: OtpInputProps) => {
  const boxArray = new Array(maximumLength).fill(0);

  return (
    <View style={styles.container}>
      <View style={styles.boxContainer}>
        {boxArray.map((_, index) => (
          <View
            key={index}
            style={[styles.box, code.length === index && styles.boxFocused]}
          >
            <Text style={styles.boxText}>{code[index] || ""}</Text>
          </View>
        ))}
      </View>
      <TextInput
        style={styles.hiddenInput}
        value={code}
        onChangeText={setCode}
        maxLength={maximumLength}
        keyboardType="number-pad"
        autoFocus={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 20, alignItems: "center" },
  boxContainer: { flexDirection: "row", justifyContent: "center" },
  box: {
    width: 50,
    height: 60,
    borderWidth: 2,
    borderColor: "#333",
    borderRadius: 12,
    marginHorizontal: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
  },
  boxFocused: { borderColor: "#FF9500" },
  boxText: { color: "#FFF", fontSize: 24, fontWeight: "bold" },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    width: "100%",
    height: "100%",
  },
});
