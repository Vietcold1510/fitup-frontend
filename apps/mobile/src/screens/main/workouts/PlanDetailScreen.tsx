import React, { useState } from "react";
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

export default function PlanDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { planId } = route.params;
  const { currentPlan, isLoadingDetail } = useWorkout(planId);

  // State để quản lý việc đóng/mở các tuần
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1);

  if (isLoadingDetail)
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#FF9500" />
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết lộ trình</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner Tổng quát */}
        <View style={styles.topCard}>
          <Text style={styles.goalText}>
            {currentPlan?.goalType === 2 ? "Tăng cơ" : "Giảm mỡ"}
          </Text>
          <Text style={styles.dateText}>
            {dayjs(currentPlan?.startDate).format("DD/MM")} -{" "}
            {dayjs(currentPlan?.endDate).format("DD/MM")}
          </Text>
        </View>

        {/* Danh sách Tuần (Accordion) */}
        {currentPlan?.weeks?.map((week: any) => {
          const isExpanded = expandedWeek === week.weekNumber;
          return (
            <View key={week.weekNumber} style={styles.weekWrapper}>
              <TouchableOpacity
                style={[
                  styles.weekHeader,
                  isExpanded && styles.weekHeaderActive,
                ]}
                onPress={() =>
                  setExpandedWeek(isExpanded ? null : week.weekNumber)
                }
              >
                <View style={styles.row}>
                  <View style={styles.weekBadge}>
                    <Text style={styles.weekBadgeText}>W{week.weekNumber}</Text>
                  </View>
                  <Text style={styles.weekTitle}>{week.describe}</Text>
                </View>
                <Ionicons
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.daysList}>
                  {week.days?.map((day: any) => (
                    <TouchableOpacity
                      key={day.dayNumber}
                      style={styles.dayItem}
                      onPress={() =>
                        navigation.navigate("WorkoutPlayer", { dayData: day })
                      }
                    >
                      <View style={styles.dayInfo}>
                        <View style={styles.dayCircle}>
                          <Text style={styles.dayNum}>{day.dayNumber}</Text>
                        </View>
                        <View>
                          <Text style={styles.dayName}>
                            Ngày {day.dayNumber}: {day.notes}
                          </Text>
                          <Text style={styles.dayMeta}>
                            {day.exercises?.length || 0} bài tập
                          </Text>
                        </View>
                      </View>
                      <Ionicons name="play-circle" size={32} color="#FF9500" />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  loading: {
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
  headerTitle: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  topCard: {
    margin: 20,
    padding: 25,
    backgroundColor: "#1C1C1E",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#333",
  },
  goalText: { color: "#FF9500", fontSize: 24, fontWeight: "bold" },
  dateText: { color: "#666", marginTop: 5 },
  weekWrapper: {
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 15,
    overflow: "hidden",
  },
  weekHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    backgroundColor: "#1C1C1E",
  },
  weekHeaderActive: { borderBottomWidth: 1, borderBottomColor: "#333" },
  row: { flexDirection: "row", alignItems: "center" },
  weekBadge: {
    backgroundColor: "#333",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 12,
  },
  weekBadgeText: { color: "#FFF", fontSize: 10, fontWeight: "bold" },
  weekTitle: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  daysList: { backgroundColor: "#1C1C1E", paddingBottom: 10 },
  dayItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  dayInfo: { flexDirection: "row", alignItems: "center" },
  dayCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  dayNum: { color: "#FF9500", fontSize: 12, fontWeight: "bold" },
  dayName: { color: "#FFF", fontSize: 14, fontWeight: "600" },
  dayMeta: { color: "#666", fontSize: 11, marginTop: 2 },
});
