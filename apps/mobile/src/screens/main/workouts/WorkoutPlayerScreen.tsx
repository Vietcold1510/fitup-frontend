import React, { useState, useEffect, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { workoutPlanRequest } from "@/api/workoutPlan";

const { width } = Dimensions.get("window");

export default function WorkoutPlayerScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();

  // 1. LẤY PARAMS TỪ NAVIGATION
  const { planId, weekNumber, dayNumber, fallbackData } = route.params || {};

  // 2. FETCH DỮ LIỆU CHI TIẾT BUỔI TẬP
  const { data: dayDetailRes, isLoading } = useQuery({
    queryKey: ["day-detail", planId, weekNumber, dayNumber],
    queryFn: () =>
      workoutPlanRequest.getDayDetail(planId, weekNumber, dayNumber),
    enabled: !!planId && !!weekNumber && !!dayNumber,
  });

  const exercises = useMemo(() => {
    const freshExercises = dayDetailRes?.data?.data?.exercises;
    return freshExercises || fallbackData?.exercises || [];
  }, [dayDetailRes, fallbackData]);

  // 3. STATE QUẢN LÝ TẬP LUYỆN
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);

  const currentEx = exercises[currentIndex];
  const isTimerEx = !!currentEx?.durationSeconds;

  // 4. MUTATION CẬP NHẬT TRẠNG THÁI (DONE/SKIP)
  const updateStatusMutation = useMutation({
    mutationFn: ({
      exerciseId,
      isDone,
    }: {
      exerciseId: string;
      isDone: boolean;
    }) => {
      return workoutPlanRequest.updateExerciseStatus(exerciseId, { isDone });
    },
    onSuccess: () => {
      // Refresh lại dữ liệu ngày để cập nhật trạng thái isDone lên UI
      queryClient.invalidateQueries({
        queryKey: ["day-detail", planId, weekNumber, dayNumber],
      });
      queryClient.invalidateQueries({ queryKey: ["workout-plan"] });
    },
  });

  // 5. RESET KHI ĐỔI BÀI
  useEffect(() => {
    if (!currentEx) return;
    if (isTimerEx) {
      setTimeLeft(currentEx.durationSeconds);
    } else {
      setTimeLeft(0);
      setCurrentSet(1);
    }
    setIsActive(false);
  }, [currentIndex, currentEx]);

  // 6. LOGIC ĐẾM NGƯỢC
  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isTimerEx && isActive) {
      handleNext(true); // Hết giờ tự động coi là Hoàn thành
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // 7. XỬ LÝ CHUYỂN BÀI
  const handleNext = async (isFinished: boolean) => {
    setIsActive(false);
    const currentExerciseId = currentEx?.id;

    if (currentExerciseId && !currentEx.isDone) {
      try {
        await updateStatusMutation.mutateAsync({
          exerciseId: currentExerciseId,
          isDone: isFinished,
        });
      } catch (e) {
        console.log("⚠️ Không thể cập nhật trạng thái, chuyển bài tiếp.");
      }
    }

    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      Alert.alert("Tuyệt vời!", "Bạn đã hoàn thành buổi tập hôm nay! 🔥", [
        { text: "Về lộ trình", onPress: () => navigation.goBack() },
      ]);
    }
  };

  const handleSetComplete = () => {
    if (currentSet < (currentEx?.sets || 1)) {
      setCurrentSet(currentSet + 1);
    } else {
      handleNext(true);
    }
  };

  if (isLoading || !currentEx) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#FF9500" size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          disabled={updateStatusMutation.isPending}
        >
          <Ionicons name="close" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          BÀI {currentIndex + 1} / {exercises.length}
        </Text>
        <TouchableOpacity>
          <Ionicons name="help-circle-outline" size={24} color="#555" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* MEDIA SECTION */}
        <View style={styles.mediaBox}>
          <Image
            source={{
              uri:
                currentEx.workout?.thumbnail ||
                "https://via.placeholder.com/400x300/1C1C1E/FF9500?text=FitUp+Exercise",
            }}
            style={styles.image}
          />
          <LinearGradient
            colors={["transparent", "#121212"]}
            style={styles.fade}
          />
        </View>

        {/* INFO SECTION */}
        <View style={styles.infoBox}>
          <Text style={styles.exName}>{currentEx.workout?.name}</Text>
          <Text style={styles.exDesc}>{currentEx.workout?.describe}</Text>
          {currentEx.note && (
            <View style={styles.badgeNote}>
              <Text style={styles.noteText}>💡 {currentEx.note}</Text>
            </View>
          )}
        </View>

        {/* CONTROL CENTER */}
        <View style={styles.controlCenter}>
          {currentEx.isDone ? (
            // VIEW KHI ĐÃ XONG (DẤU V TÍCH)
            <View style={styles.completedWrapper}>
              <View style={styles.successCircle}>
                <Ionicons name="checkmark-sharp" size={60} color="#4CD964" />
              </View>
              <Text style={styles.completedTitle}>HOÀN THÀNH</Text>
              <TouchableOpacity
                style={styles.nextBtn}
                onPress={() => handleNext(true)}
              >
                <Text style={styles.nextBtnText}>TIẾP TỤC</Text>
                <Ionicons name="arrow-forward" size={18} color="#FF9500" />
              </TouchableOpacity>
            </View>
          ) : isTimerEx ? (
            // VIEW ĐẾM NGƯỢC
            <View style={styles.timerWrapper}>
              <Text style={styles.bigNumber}>{timeLeft}s</Text>
              <TouchableOpacity
                style={styles.playBtn}
                onPress={() => setIsActive(!isActive)}
              >
                <Ionicons
                  name={isActive ? "pause" : "play"}
                  size={44}
                  color="#000"
                />
              </TouchableOpacity>
            </View>
          ) : (
            // VIEW THEO HIỆP
            <View style={styles.setsWrapper}>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>HIỆP</Text>
                  <Text style={styles.statValue}>
                    {currentSet}/{currentEx.sets}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>LẦN (REPS)</Text>
                  <Text style={styles.statValue}>{currentEx.reps}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={[
                  styles.doneBtn,
                  updateStatusMutation.isPending && { opacity: 0.6 },
                ]}
                onPress={handleSetComplete}
                disabled={updateStatusMutation.isPending}
              >
                {updateStatusMutation.isPending ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={styles.doneBtnText}>XONG HIỆP {currentSet}</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* FOOTER */}
      {!currentEx.isDone && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.skipBtn,
              updateStatusMutation.isPending && { opacity: 0.5 },
            ]}
            onPress={() => handleNext(currentIndex === exercises.length - 1)}
            disabled={updateStatusMutation.isPending}
          >
            <Text style={styles.skipText}>
              {currentIndex === exercises.length - 1
                ? "HOÀN THÀNH BUỔI TẬP"
                : "BỎ QUA BÀI NÀY"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  loading: { flex: 1, justifyContent: "center", backgroundColor: "#121212" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    alignItems: "center",
  },
  headerTitle: {
    color: "#888",
    fontWeight: "bold",
    letterSpacing: 1,
    fontSize: 12,
  },

  mediaBox: { width: width, height: 260, backgroundColor: "#1C1C1E" },
  image: { width: "100%", height: "100%", resizeMode: "cover" },
  fade: { position: "absolute", bottom: 0, left: 0, right: 0, height: 60 },

  infoBox: { paddingHorizontal: 30, alignItems: "center", marginTop: 10 },
  exName: {
    color: "#FFF",
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
  },
  exDesc: {
    color: "#888",
    textAlign: "center",
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
  },
  badgeNote: {
    backgroundColor: "#261C12",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginTop: 15,
  },
  noteText: { color: "#FF9500", fontWeight: "600", fontSize: 12 },

  controlCenter: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingVertical: 20,
  },

  // Styles cho trạng thái hoàn thành
  completedWrapper: { alignItems: "center" },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#4CD96410",
    borderWidth: 2,
    borderColor: "#4CD964",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  completedTitle: {
    color: "#4CD964",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 2,
  },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
    backgroundColor: "#1C1C1E",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 15,
  },
  nextBtnText: { color: "#FF9500", fontWeight: "bold", marginRight: 10 },

  // Styles cho Timer
  timerWrapper: { alignItems: "center" },
  bigNumber: {
    color: "#FFF",
    fontSize: 85,
    fontWeight: "900",
    fontVariant: ["tabular-nums"],
  },
  playBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FF9500",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },

  // Styles cho Sets
  setsWrapper: { alignItems: "center" },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 30,
  },
  statItem: { alignItems: "center" },
  statLabel: { color: "#555", fontWeight: "bold", fontSize: 12 },
  statValue: { color: "#FF9500", fontSize: 44, fontWeight: "900" },
  doneBtn: {
    backgroundColor: "#FFF",
    width: "100%",
    height: 55,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  doneBtnText: { color: "#121212", fontWeight: "bold", fontSize: 16 },

  footer: { paddingBottom: 30, alignItems: "center" },
  skipBtn: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2C2C2E",
  },
  skipText: { color: "#555", fontWeight: "bold", fontSize: 13 },
});
