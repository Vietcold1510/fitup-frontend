import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useWorkout } from "@/hooks/useWorkout";
import { useRoute, useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";

export default function PlanOverviewScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { planId } = route.params;

  // Sử dụng Hook để lấy dữ liệu Overview (planDetailQuery trong useWorkout)
  const { currentPlan, isLoadingDetail } = useWorkout(planId);

  if (isLoadingDetail) {
    return (
      <View style={styles.loadingCenter}>
        <ActivityIndicator size="large" color="#FF9500" />
      </View>
    );
  }

  const start = dayjs(currentPlan?.startDate).format("DD/MM/YYYY");
  const end = dayjs(currentPlan?.endDate).format("DD/MM/YYYY");

  return (
    <SafeAreaView style={styles.container}>
      {/* Header gọn gàng */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lộ trình tập luyện</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Banner Tổng quan */}
        <View style={styles.overviewBox}>
          <Text style={styles.planName}>
            {currentPlan?.goalType === 2
              ? "Tăng cơ chuyên sâu"
              : "Giảm mỡ thần tốc"}
          </Text>
          <Text style={styles.dateText}>
            {start} - {end}
          </Text>

          <View style={styles.progressSection}>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>Tiến độ tổng</Text>
              <Text style={styles.progressValue}>
                {currentPlan?.progress || 0}%
              </Text>
            </View>
            <View style={styles.barBg}>
              <View
                style={[
                  styles.barFill,
                  { width: `${currentPlan?.progress || 0}%` },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Danh sách các tuần */}
        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>Các giai đoạn tập luyện</Text>

          {currentPlan?.weeks?.map((week: any) => (
            <TouchableOpacity
              key={week.weekNumber}
              style={styles.weekCard}
              onPress={() =>
                navigation.navigate("WeekDetail", {
                  planId: currentPlan.id,
                  weekNumber: week.weekNumber,
                })
              }
            >
              <View style={styles.weekInfo}>
                <View style={styles.weekCircle}>
                  <Text style={styles.weekNumText}>{week.weekNumber}</Text>
                </View>
                <View style={styles.weekTextContent}>
                  <Text style={styles.weekTitle}>{week.describe}</Text>
                  <Text style={styles.weekSub}>
                    {week.totalDays} buổi tập / tuần
                  </Text>
                </View>
              </View>

              <View style={styles.weekAction}>
                {week.progress === 100 ? (
                  <Ionicons name="checkmark-circle" size={24} color="#4CD964" />
                ) : (
                  <View style={styles.progressBadge}>
                    <Text style={styles.badgeText}>{week.progress}%</Text>
                    <Ionicons name="chevron-forward" size={16} color="#666" />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
    padding: 15,
  },
  headerTitle: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  backBtn: { width: 40, height: 40, justifyContent: "center" },

  overviewBox: {
    margin: 20,
    padding: 25,
    backgroundColor: "#1C1C1E",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#2C2C2E",
  },
  planName: { color: "#FF9500", fontSize: 22, fontWeight: "bold" },
  dateText: { color: "#666", fontSize: 13, marginTop: 5 },
  progressSection: { marginTop: 20 },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  progressLabel: { color: "#AAA", fontSize: 14 },
  progressValue: { color: "#FFF", fontSize: 14, fontWeight: "bold" },
  barBg: {
    height: 6,
    backgroundColor: "#333",
    borderRadius: 3,
    overflow: "hidden",
  },
  barFill: { height: "100%", backgroundColor: "#FF9500" },

  listSection: { paddingHorizontal: 20 },
  sectionTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  weekCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    padding: 18,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2C2C2E",
  },
  weekInfo: { flexDirection: "row", alignItems: "center" },
  weekCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#261C12",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF9500",
  },
  weekNumText: { color: "#FF9500", fontWeight: "bold" },
  weekTextContent: { marginLeft: 15 },
  weekTitle: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  weekSub: { color: "#666", fontSize: 12, marginTop: 2 },
  weekAction: { flexDirection: "row", alignItems: "center" },
  progressBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#121212",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: { color: "#888", fontSize: 12, marginRight: 5 },
});
