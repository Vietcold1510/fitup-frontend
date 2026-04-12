import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { workoutRequest } from "@/api/workout";
import { WorkoutType } from "@/schemas/workout";

const getTypeIcon = (type: string) => {
  const normalizedType = type.toLowerCase();
  if (normalizedType.includes("cardio")) return "pulse-outline";
  if (normalizedType.includes("strength")) return "barbell-outline";
  if (normalizedType.includes("mobility")) return "body-outline";
  if (normalizedType.includes("yoga")) return "leaf-outline";
  return "fitness-outline";
};

export default function WorkoutTypesScreen() {
  const navigation = useNavigation<any>();

  const {
    data: workoutTypesRes,
    isLoading,
    isRefetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["workout-types"],
    queryFn: () => workoutRequest.getWorkoutTypes(),
  });

  const workoutTypes: WorkoutType[] = workoutTypesRes?.data?.data || [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thư viện bài tập</Text>
        <View style={{ width: 40 }} />
      </View>

      {isLoading ? (
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color="#FF9500" />
        </View>
      ) : (
        <FlatList
          data={workoutTypes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshing={isRefetching}
          onRefresh={refetch}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.typeCard}
              onPress={() =>
                navigation.navigate("WorkoutTypeWorkouts", {
                  workoutTypeId: item.id,
                  workoutTypeName: item.type,
                })
              }
            >
              <View style={styles.typeInfo}>
                <View style={styles.iconWrap}>
                  <Ionicons name={getTypeIcon(item.type) as any} size={20} color="#FF9500" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.typeName}>{item.type}</Text>
                  <Text style={styles.typeSubtitle}>
                    Xem các bài tập thuộc nhóm {item.type.toLowerCase()}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#777" />
            </TouchableOpacity>
          )}
          ListHeaderComponent={
            <Text style={styles.pageSubtitle}>
              Chọn một nhóm bài tập để xem danh sách chi tiết
            </Text>
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name={isError ? "alert-circle-outline" : "search-outline"} size={38} color="#666" />
              <Text style={styles.emptyText}>
                {isError ? "Không tải được danh sách loại bài tập." : "Chưa có loại bài tập nào."}
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
  },
  listContent: { paddingHorizontal: 20, paddingBottom: 28 },
  pageSubtitle: {
    color: "#9A9A9A",
    fontSize: 13,
    marginBottom: 14,
    marginTop: 4,
  },
  typeCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2C2C2E",
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  typeInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#2B1D0D",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  typeName: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  typeSubtitle: { color: "#7B7B7B", fontSize: 12, marginTop: 4 },
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
