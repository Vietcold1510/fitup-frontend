import React from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useGeneratingPlan } from "./useGeneratingPlan"; // Check path

export default function GeneratingPlanScreen() {
  const { progress, statusMessage, onboardingProfileId } = useGeneratingPlan();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#121212", "#1C1C1E"]} style={styles.content}>
        {/* Vòng tròn Progress */}
        <View style={styles.circleContainer}>
          <Text style={styles.percentText}>{progress}%</Text>
          <ActivityIndicator
            size={180}
            color="#FF9500"
            style={styles.spinner}
          />
        </View>

        <Text style={styles.title}>AI Đang làm việc</Text>
        <Text style={styles.statusText}>{statusMessage}</Text>

        {/* Thông tin ID (ẩn nhỏ bên dưới để debug) */}
        <View style={styles.debugInfo}>
          <Text style={styles.debugText}>ID: {onboardingProfileId}</Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  circleContainer: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  percentText: { color: "#FF9500", fontSize: 40, fontWeight: "bold" },
  spinner: { position: "absolute" },
  title: { color: "#FFF", fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  statusText: { color: "#888", fontSize: 16 },
  debugInfo: { position: "absolute", bottom: 30, opacity: 0.3 },
  debugText: { color: "#FFF", fontSize: 10 },
});
