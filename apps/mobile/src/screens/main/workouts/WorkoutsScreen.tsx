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
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useWorkout } from "@/hooks/useWorkout";
import { workoutPlanRequest } from "@/api/workoutPlan";
import { premiumRequest } from "@/api/premium";
import { GoalType } from "@/utils/enum";

const { width } = Dimensions.get("window");

export default function WorkoutsScreen() {
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();
  const { allPlans, todaySession, isLoadingPlans, isLoadingToday } = useWorkout();

  const { data: premiumStatusRes } = useQuery({
    queryKey: ["premium-my-status"],
    queryFn: () => premiumRequest.getMyStatus(),
  });

  const premiumStatus = premiumStatusRes?.data?.data;
  const isPremiumActive =
    !!premiumStatus?.hasPremium &&
    !!premiumStatus?.isActive &&
    (premiumStatus?.remainingDays ?? 0) > 0;

  const redirectPremiumWithAlert = () => {
    navigation.navigate("Premium");
    setTimeout(() => {
      Alert.alert(
        "Yêu cầu Premium",
        "Tính năng này chỉ dành cho tài khoản Premium. Vui lòng mua gói Premium để tiếp tục.",
      );
    }, 120);
  };

  const deletePlanMutation = useMutation({
    mutationFn: (id: string) => workoutPlanRequest.deletePlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout-plans"] });
    },
    onError: (err: any) => {
      console.error("Lỗi xóa:", err);
      Alert.alert("Lỗi", "Không thể xóa lộ trình lúc này.");
    },
  });

  const handleConfirmDelete = (id: string) => {
    if (!isPremiumActive) {
      redirectPremiumWithAlert();
      return;
    }

    Alert.alert(
      "Xóa Lộ Trình",
      "Bạn có chắc chắn muốn xóa lộ trình này không? Hành động này sẽ xóa toàn bộ dữ liệu tiến độ.",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => deletePlanMutation.mutate(id),
        },
      ],
    );
  };

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
        return { label: "Luyện tập", color: "#8E8E93", icon: "fitness-outline" };
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
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Workouts</Text>
            <Text style={styles.subtitle}>Theo dõi buổi tập và lộ trình của bạn</Text>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons name="barbell-outline" size={24} color="#FF9500" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mục tiêu hôm nay</Text>
          {todaySession ? (
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
                  <Text style={styles.todayDay}>NGÀY {todaySession.dayNumber}</Text>
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
              <Text style={styles.emptyTodayText}>Hôm nay là ngày nghỉ ngơi.</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Lộ trình của bạn</Text>
            {isPremiumActive && (
              <TouchableOpacity onPress={() => navigation.navigate("Onboarding")}>
                <Ionicons name="add-circle" size={28} color="#FF9500" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.planListWrap}>
            <View style={!isPremiumActive ? styles.dimmedContent : undefined}>
              <FlatList
                data={allPlans}
                horizontal
                scrollEnabled={isPremiumActive}
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
                      onPress={() => {
                        if (!isPremiumActive) {
                          redirectPremiumWithAlert();
                          return;
                        }
                        navigation.navigate("PlanDetail", { planId: item.id });
                      }}
                    >
                      <View style={styles.cardHeader}>
                        <View
                          style={[
                            styles.badge,
                            { backgroundColor: `${goalStyle.color}20` },
                          ]}
                        >
                          <Ionicons
                            name={goalStyle.icon as any}
                            size={12}
                            color={goalStyle.color}
                          />
                          <Text style={[styles.badgeText, { color: goalStyle.color }]}>
                            {goalStyle.label}
                          </Text>
                        </View>

                        <TouchableOpacity
                          style={styles.deleteBtn}
                          onPress={() => handleConfirmDelete(item.id)}
                          disabled={deletePlanMutation.isPending}
                        >
                          <Ionicons name="trash-outline" size={18} color="#FF3B30" />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.statsRow}>
                        <Text style={styles.progressValue}>{item.progress || 0}%</Text>
                        <Text style={styles.sessionCount}>{item.totalSessions} buổi</Text>
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
                    onPress={() =>
                      isPremiumActive
                        ? navigation.navigate("Onboarding")
                        : redirectPremiumWithAlert()
                    }
                  >
                    <Ionicons name="add" size={40} color="#333" />
                    <Text style={{ color: "#666" }}>Chưa có lộ trình nào</Text>
                  </TouchableOpacity>
                }
              />
            </View>

            {!isPremiumActive && (
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.premiumOverlay}
                onPress={redirectPremiumWithAlert}
              >
                <Text style={styles.premiumOverlayText}>Tính năng Premium</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thư viện bài tập</Text>
          <TouchableOpacity
            style={styles.libraryCard}
            onPress={() => navigation.navigate("WorkoutTypes")}
          >
            <View style={styles.libraryIconBox}>
              <Ionicons name="library-outline" size={24} color="#FF9500" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.libraryTitle}>Xem bài tập theo nhóm</Text>
              <Text style={styles.librarySubtitle}>
                Chọn loại workout và xem danh sách bài tập theo từng nhóm
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#777" />
          </TouchableOpacity>
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
  title: { color: "#FFF", fontSize: 28, fontWeight: "800" },
  subtitle: { color: "#888", fontSize: 14, marginTop: 4 },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#1C1C1E",
    borderWidth: 1,
    borderColor: "#2C2C2E",
    justifyContent: "center",
    alignItems: "center",
  },
  section: { marginTop: 18 },
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
  planListWrap: {
    position: "relative",
    minHeight: 158,
  },
  dimmedContent: {
    opacity: 0.32,
  },
  premiumOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 12,
    right: 12,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderWidth: 1,
    borderColor: "rgba(255,149,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  premiumOverlayText: {
    color: "#FFB347",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  planCard: {
    width: 200,
    backgroundColor: "#1C1C1E",
    borderRadius: 24,
    padding: 18,
    marginRight: 15,
    borderWidth: 1,
    borderColor: "#2C2C2E",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  badgeText: { fontSize: 10, fontWeight: "bold", marginLeft: 4 },
  deleteBtn: { padding: 4 },
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
  libraryCard: {
    marginHorizontal: 20,
    borderRadius: 18,
    padding: 14,
    backgroundColor: "#1C1C1E",
    borderWidth: 1,
    borderColor: "#2C2C2E",
    flexDirection: "row",
    alignItems: "center",
  },
  libraryIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#2B1D0D",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  libraryTitle: { color: "#FFF", fontSize: 15, fontWeight: "700" },
  librarySubtitle: { color: "#8A8A8A", fontSize: 12, marginTop: 4 },
});
