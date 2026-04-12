import React from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { workoutRequest } from "@/api/workout";
import { Workout } from "@/schemas/workout";
import { EquipmentType, MuscleGroup, WorkoutLevel } from "@/utils/enum";

const MOCK_WORKOUT_VIDEO_PATH = "assets/scpd.mp4";

const getLevelLabel = (level: number) => {
  switch (level) {
    case WorkoutLevel.Beginner:
      return "Cơ bản";
    case WorkoutLevel.Intermediate:
      return "Trung bình";
    case WorkoutLevel.Advanced:
      return "Khó";
    default:
      return `Cấp độ ${level}`;
  }
};

const getLevelStyle = (level: number) => {
  switch (level) {
    case WorkoutLevel.Beginner:
      return {
        badge: { backgroundColor: "#10243E", borderColor: "#2E6FD8" },
        text: { color: "#7DB3FF" },
      };
    case WorkoutLevel.Advanced:
      return {
        badge: { backgroundColor: "#2C1111", borderColor: "#C73B3B" },
        text: { color: "#FF7A7A" },
      };
    case WorkoutLevel.Intermediate:
    default:
      return {
        badge: { backgroundColor: "#2B1D0D", borderColor: "#7C4B0A" },
        text: { color: "#FFB75D" },
      };
  }
};

const getEquipmentLabel = (equipment: number) => {
  switch (equipment) {
    case EquipmentType.Bodyweight:
      return "Trọng lượng cơ thể";
    case EquipmentType.Dumbbell:
      return "Tạ tay";
    case EquipmentType.Gym:
      return "Máy tập gym";
    default:
      return `Thiết bị ${equipment}`;
  }
};

const getMuscleLabel = (muscle: number) => {
  switch (muscle) {
    case MuscleGroup.FullBody:
      return "Toàn thân";
    case MuscleGroup.Chest:
      return "Ngực";
    case MuscleGroup.Back:
      return "Lưng";
    case MuscleGroup.Legs:
      return "Chân";
    case MuscleGroup.Shoulders:
      return "Vai";
    case MuscleGroup.Arms:
      return "Tay";
    case MuscleGroup.Core:
      return "Cơ lõi";
    case MuscleGroup.Glutes:
      return "Mông";
    case MuscleGroup.Cardio:
      return "Cardio";
    default:
      return `Nhóm cơ ${muscle}`;
  }
};

export default function WorkoutTypeWorkoutsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { workoutTypeId, workoutTypeName } = route.params || {};

  const {
    data: workoutsRes,
    isLoading,
    isRefetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["workouts-by-type", workoutTypeId],
    queryFn: () => workoutRequest.getWorkouts(workoutTypeId),
    enabled: !!workoutTypeId,
  });

  const workouts: Workout[] = (workoutsRes?.data?.data || []).map((item) => ({
    ...item,
    instructionVidLink:
      typeof item.instructionVidLink === "string" && item.instructionVidLink.trim().length > 0
        ? item.instructionVidLink
        : MOCK_WORKOUT_VIDEO_PATH,
  }));

  if (!workoutTypeId) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingCenter}>
          <Text style={styles.invalidText}>Thiếu thông tin loại bài tập.</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.retryText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{workoutTypeName || "Bài tập"}</Text>
        <View style={{ width: 40 }} />
      </View>

      {isLoading ? (
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color="#FF9500" />
        </View>
      ) : (
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshing={isRefetching}
          onRefresh={refetch}
          renderItem={({ item }) => {
            const levelStyle = getLevelStyle(item.level);

            return (
              <TouchableOpacity
                style={styles.workoutCard}
                activeOpacity={0.85}
                onPress={() =>
                  navigation.navigate("WorkoutVideo", {
                    workoutName: item.name,
                    videoUrl: item.instructionVidLink,
                  })
                }
              >
                <View style={styles.workoutHeader}>
                  <Text style={styles.workoutName}>{item.name}</Text>
                  <View style={[styles.levelBadge, levelStyle.badge]}>
                    <Text style={[styles.levelText, levelStyle.text]}>{getLevelLabel(item.level)}</Text>
                  </View>
                </View>

                <Text style={styles.workoutDesc}>{item.describe || "Không có mô tả"}</Text>

                <View style={styles.metaRow}>
                  <View style={styles.metaChip}>
                    <Ionicons name="barbell-outline" size={14} color="#FF9500" />
                    <Text style={styles.metaText}>{getEquipmentLabel(item.equipment)}</Text>
                  </View>
                  <View style={styles.metaChip}>
                    <Ionicons name="body-outline" size={14} color="#6EA8FE" />
                    <Text style={styles.metaText}>{getMuscleLabel(item.primaryMuscle)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          ListHeaderComponent={
            <Text style={styles.pageSubtitle}>
              Danh sách bài tập thuộc nhóm {String(workoutTypeName || "").toLowerCase()}
            </Text>
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name={isError ? "alert-circle-outline" : "search-outline"} size={38} color="#666" />
              <Text style={styles.emptyText}>
                {isError
                  ? "Không tải được danh sách bài tập cho nhóm này."
                  : "Chưa có bài tập nào cho nhóm này."}
              </Text>
              {isError && (
                <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
                  <Text style={styles.retryText}>Thử lại</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    height: 60,
  },
  backBtn: { width: 40, height: 40, justifyContent: "center" },
  headerTitle: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  loadingCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
    paddingHorizontal: 24,
  },
  invalidText: { color: "#B0B0B0", textAlign: "center", marginBottom: 12 },
  listContent: { paddingHorizontal: 20, paddingBottom: 28 },
  pageSubtitle: {
    color: "#9A9A9A",
    fontSize: 13,
    marginBottom: 14,
    marginTop: 4,
  },
  workoutCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2C2C2E",
    padding: 14,
    marginBottom: 12,
  },
  workoutHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  workoutName: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "800",
    flex: 1,
  },
  levelBadge: {
    backgroundColor: "#2B1D0D",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#7C4B0A",
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 10,
  },
  levelText: { color: "#FFB75D", fontSize: 11, fontWeight: "700" },
  workoutDesc: { color: "#A8A8A8", fontSize: 13, marginTop: 8, lineHeight: 18 },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2D2D2F",
    backgroundColor: "#171719",
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  metaText: { color: "#D9D9D9", fontSize: 12, marginLeft: 6 },
  emptyState: {
    marginTop: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2C2C2E",
    backgroundColor: "#1C1C1E",
    alignItems: "center",
    paddingVertical: 28,
    paddingHorizontal: 20,
  },
  emptyText: { color: "#9A9A9A", marginTop: 10, textAlign: "center" },
  retryBtn: {
    marginTop: 14,
    backgroundColor: "#FF9500",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  retryText: { color: "#111", fontWeight: "700" },
});
