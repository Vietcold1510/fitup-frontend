import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import { useWorkout } from "@/hooks/useWorkout";
import { GoalType } from "@/utils/enum";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { allPlans, todaySession, isLoadingPlans, isLoadingToday } =
    useWorkout();

  // Helper xử lý Style theo GoalType Enum của Hàn
  const getGoalStyle = (type: GoalType) => {
    switch (type) {
      case GoalType.LoseFat:
        return { label: "Giảm mỡ", color: "#FF3B30", icon: "flame-outline" };
      case GoalType.GainMuscle:
        return { label: "Tăng cơ", color: "#FF9500", icon: "barbell-outline" };
      case GoalType.Strength:
        return { label: "Sức mạnh", color: "#5856D6", icon: "flash-outline" };
      case GoalType.Maintain:
        return { label: "Duy trì", color: "#4CD964", icon: "leaf-outline" };
      default:
        return {
          label: "Luyện tập",
          color: "#8E8E93",
          icon: "fitness-outline",
        };
    }
  };

  if (isLoadingPlans || isLoadingToday) {
    return (
      <View style={styles.loadingCenter}>
        <ActivityIndicator size="large" color="#FF9500" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Chào Hàn! 👋</Text>
            <Text style={styles.subWelcome}>Hôm nay bạn muốn tập gì?</Text>
          </View>
          <TouchableOpacity style={styles.profileBtn}>
            <Ionicons name="person-circle-outline" size={40} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* SECTION 1: BÀI TẬP HÔM NAY */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mục tiêu hôm nay</Text>
          {todaySession ? (
            <TouchableOpacity
              style={styles.todayCard}
              onPress={() =>
                navigation.navigate("WorkoutDetail", {
                  sessionId: todaySession.sessionId,
                })
              }
            >
              <LinearGradient
                colors={["#FF9500", "#F47100"]}
                style={styles.todayGradient}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.todayDay}>
                    NGÀY {todaySession.dayNumber}
                  </Text>
                  <Text style={styles.todayTitle} numberOfLines={1}>
                    {todaySession.notes || "Sẵn sàng bứt phá"}
                  </Text>
                  <Text style={styles.todayInfo}>
                    <Ionicons name="stats-chart" size={12} />{" "}
                    {todaySession.exerciseCount || 0} bài tập
                  </Text>
                </View>
                <Ionicons name="play-circle" size={54} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={styles.emptyToday}>
              <Text style={styles.emptyTodayText}>
                Hôm nay là ngày nghỉ ngơi. 🧘‍♂️
              </Text>
            </View>
          )}
        </View>

        {/* SECTION 2: DANH SÁCH LỘ TRÌNH (MULTI-PLANS) */}
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Lộ trình của bạn</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Onboarding")}>
              <Ionicons name="add-circle" size={28} color="#FF9500" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={allPlans}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingLeft: 20, paddingRight: 20 }}
            renderItem={({ item }) => {
              const goalStyle = getGoalStyle(item.goalType);
              const start = dayjs(item.startDate).format("DD/MM");
              const end = dayjs(item.endDate).format("DD/MM");

              return (
                <TouchableOpacity
                  style={styles.planCard}
                  onPress={() =>
                    navigation.navigate("PlanDetail", { planId: item.id })
                  }
                >
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: goalStyle.color + "20" },
                    ]}
                  >
                    <Ionicons
                      name={goalStyle.icon as any}
                      size={12}
                      color={goalStyle.color}
                    />
                    <Text
                      style={[styles.badgeText, { color: goalStyle.color }]}
                    >
                      {goalStyle.label}
                    </Text>
                  </View>

                  <View style={styles.statsRow}>
                    <Text style={styles.progressValue}>
                      {item.progress || 0}%
                    </Text>
                    <Text style={styles.sessionCount}>
                      {item.totalSessions} buổi
                    </Text>
                  </View>

                  <View style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${item.progress || 0}%`,
                          backgroundColor: goalStyle.color,
                        },
                      ]}
                    />
                  </View>

                  <Text style={styles.durationText}>
                    {item.totalWeeks} tuần • {start} - {end}
                  </Text>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <TouchableOpacity
                style={styles.emptyState}
                onPress={() => navigation.navigate("Onboarding")}
              >
                <Ionicons name="add" size={40} color="#333" />
                <Text style={{ color: "#666" }}>Chưa có lộ trình nào</Text>
              </TouchableOpacity>
            }
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  loadingCenter: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  welcomeText: { color: "#FFF", fontSize: 24, fontWeight: "bold" },
  subWelcome: { color: "#888", fontSize: 14, marginTop: 4 },
  profileBtn: { padding: 4 },
  section: { marginTop: 25 },
  sectionTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 20,
    marginBottom: 15,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 20,
  },

  // Today Card
  todayCard: {
    marginHorizontal: 20,
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
    marginHorizontal: 20,
    padding: 30,
    borderRadius: 24,
    backgroundColor: "#1C1C1E",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2C2C2E",
  },
  emptyTodayText: { color: "#666", fontSize: 14 },

  // Plan Card
  planCard: {
    width: 200,
    backgroundColor: "#1C1C1E",
    borderRadius: 24,
    padding: 18,
    marginRight: 15,
    borderWidth: 1,
    borderColor: "#2C2C2E",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginBottom: 14,
  },
  badgeText: { fontSize: 10, fontWeight: "bold", marginLeft: 4 },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  progressValue: { color: "#FFF", fontSize: 26, fontWeight: "800" },
  sessionCount: { color: "#888", fontSize: 11, marginBottom: 4 },
  progressBarBg: {
    height: 6,
    backgroundColor: "#333",
    borderRadius: 3,
    width: "100%",
    marginBottom: 12,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 3 },
  durationText: { color: "#555", fontSize: 10, fontWeight: "600" },
  emptyState: {
    width: width - 40,
    height: 150,
    borderRadius: 24,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
});
