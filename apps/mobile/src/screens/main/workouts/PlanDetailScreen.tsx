import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useWorkout } from "@/hooks/useWorkout";
import { useRoute, useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";

export default function PlanDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { planId } = route.params || {};

  const { currentPlan, isLoadingDetail } = useWorkout(planId);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1);

  if (isLoadingDetail)
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#FF9500" />
      </View>
    );

  // Helper render icon trạng thái buổi tập
  const renderProgressStatus = (progress: number) => {
    if (progress === 100)
      return <Ionicons name="checkmark-circle" size={26} color="#4CD964" />;
    if (progress > 0)
      return (
        <View style={styles.partialBadge}>
          <Text style={styles.partialText}>{progress}%</Text>
          <Ionicons name="play-circle" size={24} color="#FF9500" />
        </View>
      );
    return <Ionicons name="play-circle-outline" size={26} color="#444" />;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết lộ trình</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* DANH SÁCH TUẦN (ACCORDION) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Các tuần tập luyện</Text>

          {currentPlan?.weeks?.map((week: any) => {
            const isExpanded = expandedWeek === week.weekNumber;

            // TỰ TÍNH TIẾN ĐỘ TUẦN DỰA TRÊN DATA THỰC TẾ
            const weekProgress =
              week.progress ??
              (week.days
                ? Math.round(
                    week.days.reduce(
                      (acc: number, d: any) => acc + d.progress,
                      0,
                    ) / week.days.length,
                  )
                : 0);

            // HIGHLIGHT LOGIC: Nếu đạt từ 90-99%
            const isAlmostDone = weekProgress >= 90 && weekProgress < 100;

            return (
              <View
                key={`week-${week.weekNumber}`}
                style={[
                  styles.weekContainer,
                  isAlmostDone && styles.borderAlmostDone,
                ]}
              >
                {/* WEEK HEADER */}
                <TouchableOpacity
                  style={[
                    styles.weekHeader,
                    isExpanded && styles.weekHeaderActive,
                  ]}
                  onPress={() =>
                    setExpandedWeek(isExpanded ? null : week.weekNumber)
                  }
                  activeOpacity={0.8}
                >
                  <View style={styles.row}>
                    <View
                      style={[
                        styles.weekCircle,
                        weekProgress === 100 && styles.weekCircleDone,
                        isAlmostDone && styles.weekCircleAlmostDone,
                      ]}
                    >
                      {weekProgress === 100 ? (
                        <Ionicons name="checkmark" size={16} color="#FFF" />
                      ) : (
                        <Text
                          style={[
                            styles.weekNumText,
                            isAlmostDone && { color: "#FF9500" },
                          ]}
                        >
                          {week.weekNumber}
                        </Text>
                      )}
                    </View>
                    <View style={{ marginLeft: 12 }}>
                      <Text style={styles.weekName}>{week.describe}</Text>
                      <Text style={styles.weekSub}>
                        {week.days?.length || 0} buổi tập •
                        <Text
                          style={[
                            styles.progressHighlight,
                            isAlmostDone && styles.textOrange,
                          ]}
                        >
                          {` ${weekProgress}%`}
                        </Text>
                      </Text>
                    </View>
                  </View>

                  <View style={styles.row}>
                    {isAlmostDone && (
                      <View style={styles.fireBadge}>
                        <Ionicons name="flame" size={12} color="#FF9500" />
                        <Text style={styles.fireText}>SẮP XONG</Text>
                      </View>
                    )}
                    <Ionicons
                      name={isExpanded ? "chevron-up" : "chevron-down"}
                      size={20}
                      color={isAlmostDone ? "#FF9500" : "#666"}
                    />
                  </View>
                </TouchableOpacity>

                {/* SESSIONS LIST */}
                {isExpanded && (
                  <View style={styles.sessionList}>
                    {week.days?.map((day: any) => (
                      <TouchableOpacity
                        key={`session-${day.dayNumber}`}
                        style={styles.sessionItem}
                        onPress={() =>
                          navigation.navigate("WorkoutPlayer", {
                            planId: currentPlan.id,
                            weekNumber: week.weekNumber,
                            dayNumber: day.dayNumber,
                          })
                        }
                      >
                        <View style={styles.sessionInfo}>
                          <View
                            style={[
                              styles.statusVertical,
                              {
                                backgroundColor:
                                  day.progress === 100
                                    ? "#4CD964"
                                    : day.progress > 0
                                      ? "#FF9500"
                                      : "#333",
                              },
                            ]}
                          />
                          <View>
                            <Text style={styles.dayTitle}>
                              Ngày {day.dayNumber}: {day.notes}
                            </Text>
                            <Text style={styles.daySub}>
                              {day.exerciseCount ?? day.exercises?.length ?? 0}{" "}
                              bài tập
                            </Text>
                          </View>
                        </View>
                        {renderProgressStatus(day.progress)}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    height: 60,
  },
  headerTitle: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  backBtn: { padding: 5 },

  topCard: {
    margin: 20,
    padding: 25,
    backgroundColor: "#1C1C1E",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#2C2C2E",
  },
  goalTag: {
    backgroundColor: "#FF950020",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  goalTagText: { color: "#FF9500", fontSize: 10, fontWeight: "800" },
  planTitle: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  dateRange: { color: "#666", fontSize: 13 },

  overallProgress: { marginTop: 25 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: { color: "#888", fontSize: 12 },
  progressValue: { color: "#FFF", fontSize: 14, fontWeight: "bold" },
  barBg: {
    height: 6,
    backgroundColor: "#333",
    borderRadius: 3,
    overflow: "hidden",
  },
  barFill: { height: "100%", backgroundColor: "#FF9500" },

  section: { paddingHorizontal: 20 },
  sectionTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },

  // --- STYLES CHO TUẦN ---
  weekContainer: {
    backgroundColor: "#1C1C1E",
    borderRadius: 20,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#2C2C2E",
  },
  borderAlmostDone: { borderColor: "#FF950050", borderWidth: 1.5 },

  weekHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
  },
  weekHeaderActive: { borderBottomWidth: 1, borderBottomColor: "#2C2C2E" },

  weekCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#444",
  },
  weekCircleAlmostDone: {
    borderColor: "#FF9500",
    borderStyle: "dashed",
    borderWidth: 2,
    backgroundColor: "#FF950010",
  },
  weekCircleDone: { backgroundColor: "#4CD964", borderColor: "#4CD964" },

  weekNumText: { color: "#FF9500", fontSize: 12, fontWeight: "bold" },
  weekName: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  weekSub: { color: "#666", fontSize: 12, marginTop: 2 },

  progressHighlight: { color: "#666", fontWeight: "600" },
  textOrange: { color: "#FF9500", fontWeight: "900", fontSize: 15 },

  fireBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF950015",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 10,
  },
  fireText: {
    color: "#FF9500",
    fontSize: 9,
    fontWeight: "bold",
    marginLeft: 4,
  },

  // --- STYLES CHO BUỔI TẬP ---
  sessionList: { backgroundColor: "#161618" },
  sessionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  sessionInfo: { flexDirection: "row", alignItems: "center", flex: 1 },
  statusVertical: { width: 3, height: 30, borderRadius: 2, marginRight: 15 },
  dayTitle: { color: "#FFF", fontSize: 14, fontWeight: "600" },
  daySub: { color: "#555", fontSize: 12, marginTop: 2 },

  row: { flexDirection: "row", alignItems: "center" },
  partialBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF950015",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  partialText: {
    color: "#FF9500",
    fontSize: 11,
    fontWeight: "bold",
    marginRight: 5,
  },
});
