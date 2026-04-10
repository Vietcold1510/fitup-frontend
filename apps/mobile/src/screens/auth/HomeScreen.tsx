import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { premiumRequest } from "@/api/premium";
import { usePointAmount } from "@/hooks/usePointAmount";
import { useWorkout } from "@/hooks/useWorkout";

const appLogo = require("../../../assets/Fitness_Logo__1_-removebg-preview.png");

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { data: premiumStatusRes } = useQuery({
    queryKey: ["premium-my-status"],
    queryFn: () => premiumRequest.getMyStatus(),
  });
  const { data: pointAmount = 0 } = usePointAmount();
  const { todaySession, isLoadingToday } = useWorkout();

  const premiumStatus = premiumStatusRes?.data?.data;
  const isPremiumActive =
    !!premiumStatus?.hasPremium && !!premiumStatus?.isActive;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Chào bạn!</Text>
            <Text style={styles.subWelcome}>
              Quản lý point, premium và thao tác nhanh
            </Text>
          </View>
          <TouchableOpacity
            style={styles.logoButton}
            onPress={() => navigation.navigate("Profile")}
          >
            <Image source={appLogo} style={styles.headerLogo} resizeMode="contain" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.metaStack}>
            <View style={styles.metaLine}>
              <Ionicons
                name={isPremiumActive ? "diamond" : "diamond-outline"}
                size={15}
                color="#AF52DE"
              />
              <Text style={styles.metaLabel}>Premium</Text>
              <Text style={styles.metaValue}>
                {isPremiumActive
                  ? `${premiumStatus?.remainingDays ?? 0} ngay`
                  : "Chua kich hoat"}
              </Text>
            </View>

            <View style={styles.metaLine}>
              <Ionicons name="wallet-outline" size={15} color="#FF9500" />
              <Text style={styles.metaLabel}>Points</Text>
              <Text style={[styles.metaValue, styles.pointValue]}>
                {pointAmount.toLocaleString("vi-VN")} Pts
              </Text>
            </View>
          </View>

          <View style={styles.todaySection}>
            <Text style={styles.sectionTitle}>Mục tiêu hôm nay</Text>
            {isLoadingToday ? (
              <View style={styles.todayLoading}>
                <ActivityIndicator size="small" color="#FF9500" />
              </View>
            ) : todaySession ? (
              <TouchableOpacity
                style={styles.todayCard}
                onPress={() =>
                  navigation.navigate("WorkoutPlayer", {
                    sessionId: todaySession.sessionId,
                  })
                }
              >
                <LinearGradient
                  colors={["#FF9500", "#F47100"]}
                  style={styles.todayGradient}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.todayDay}>NGAY {todaySession.dayNumber}</Text>
                    <Text style={styles.todayTitle} numberOfLines={1}>
                      {todaySession.notes || "San sang but pha"}
                    </Text>
                    <Text style={styles.todayInfo}>
                      <Ionicons name="stats-chart" size={12} />{" "}
                      {todaySession.exerciseCount || 0} bai tap
                    </Text>
                  </View>
                  <Ionicons name="play-circle" size={54} color="#FFF" />
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <View style={styles.emptyToday}>
                <Text style={styles.emptyTodayText}>Hôm nay là ngày nghỉ ngơi.</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.workoutShortcut}
            onPress={() => navigation.navigate("Workouts")}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="barbell-outline" size={18} color="#FF9500" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Đi tới Workouts</Text>
              <Text style={styles.actionSub}>
                Mục tiêu hôm nay và lộ trình của bạn
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#FF9500" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  welcomeText: { color: "#FFF", fontSize: 28, fontWeight: "800" },
  subWelcome: { color: "#888", fontSize: 14, marginTop: 4 },
  logoButton: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#1C1C1E",
    borderWidth: 1,
    borderColor: "#2C2C2E",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  headerLogo: { width: 42, height: 42 },
  content: { paddingHorizontal: 20, paddingBottom: 100 },
  metaStack: {
    gap: 10,
  },
  metaLine: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaLabel: {
    color: "#CFCFCF",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 8,
    minWidth: 68,
  },
  metaValue: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "800",
  },
  pointValue: { color: "#FF9500" },
  todaySection: { marginTop: 24 },
  sectionTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  todayLoading: {
    backgroundColor: "#1C1C1E",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#2C2C2E",
    paddingVertical: 28,
    alignItems: "center",
  },
  todayCard: {
    borderRadius: 24,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  todayGradient: { padding: 24, flexDirection: "row", alignItems: "center" },
  todayDay: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "800",
    opacity: 0.9,
    letterSpacing: 1,
  },
  todayTitle: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 6,
  },
  todayInfo: { color: "#FFF", fontSize: 12, opacity: 0.8 },
  emptyToday: {
    padding: 30,
    borderRadius: 24,
    backgroundColor: "#1C1C1E",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2C2C2E",
  },
  emptyTodayText: { color: "#666", fontSize: 14 },
  workoutShortcut: {
    marginTop: 14,
    backgroundColor: "#1C1C1E",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FF950044",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  actionIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#FF950014",
    justifyContent: "center",
    alignItems: "center",
  },
  actionContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  actionTitle: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "800",
  },
  actionSub: {
    color: "#8F8F8F",
    fontSize: 12,
    marginTop: 4,
  },
});
