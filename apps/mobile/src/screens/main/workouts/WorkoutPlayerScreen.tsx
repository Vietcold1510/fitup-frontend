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

  // 1. Nhận "Tọa độ" từ màn hình trước
  const { planId, weekNumber, dayNumber, fallbackData } = route.params || {};

  // 2. TỰ ĐỘNG GỌI API LẤY CHI TIẾT NGÀY TẬP (CÓ CHỨA ID VÀ ISDONE)
  // 1. DÙNG USEQUERY ĐỂ GỌI DATA XỊN
  const { data: dayDetailRes, isLoading } = useQuery({
    queryKey: ["day-detail", planId, weekNumber, dayNumber],
    queryFn: () =>
      workoutPlanRequest.getDayDetail(planId, weekNumber, dayNumber),
    enabled: !!planId && !!weekNumber && !!dayNumber,
  });

  // 2. KHÚC NÀY QUAN TRỌNG NHẤT: CHẤM 2 LẦN DATA !!!
  const exercises = useMemo(() => {
    // Axios bọc 1 lớp data, Backend của bạn bọc thêm 1 lớp data nữa -> Phải là .data.data
    const freshExercises = dayDetailRes?.data?.data?.exercises;

    // Nếu có data mới thì xài, không thì xài data cũ từ màn hình trước
    return freshExercises || fallbackData?.exercises || [];
  }, [dayDetailRes, fallbackData]);

  // 2. STATE QUẢN LÝ LUỒNG TẬP
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);

  const currentEx = exercises[currentIndex];
  const isTimerEx = !!currentEx?.durationSeconds;

  // 3. MUTATION: Cập nhật trạng thái từng bài tập lẻ
  const updateStatusMutation = useMutation({
    mutationFn: (exerciseId: string) => {
      console.log(`📡 [GỬI LÊN SERVER] PATCH ID Bài Tập: ${exerciseId}`);
      return workoutPlanRequest.updateExerciseStatus(exerciseId);
    },
    onSuccess: () => {
      console.log(
        `✅ [SERVER TRẢ VỀ] Đã đánh dấu Xong cho bài: ${currentEx?.workout?.name}`,
      );
      // Ép App tải lại dữ liệu Plan để màn hình ngoài cập nhật %
      queryClient.invalidateQueries({ queryKey: ["workout-plan"] });
    },
    onError: (err: any) => {
      console.error("❌ [LỖI PATCH] Status:", err.response?.status);
      console.error("❌ [LỖI PATCH] Data:", err.response?.data);
    },
  });

  // 4. EFFECT: Reset đồng hồ và hiệp khi đổi bài
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

  // 5. EFFECT: Xử lý đếm ngược (Timer)
  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isTimerEx && isActive) {
      handleNext(); // Hết giờ tự động qua bài
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // 6. HÀM XỬ LÝ CHUYỂN BÀI - CHUẨN XÁC VÀ BẤT ĐỒNG BỘ
  const handleNext = async () => {
    setIsActive(false);

    // BƯỚC A: Lấy ID chuẩn xác nằm ở ngoài cùng
    const currentExerciseId = currentEx?.id;

    if (currentExerciseId) {
      try {
        // Đợi Server lưu xong bài tập lẻ này mới cho chạy tiếp
        await updateStatusMutation.mutateAsync(currentExerciseId);
      } catch (e) {
        console.log(
          "⚠️ Bỏ qua cập nhật do lỗi mạng, nhưng vẫn cho phép đi tiếp.",
        );
      }
    } else {
      console.log("🔴 BỎ QUA PATCH: Không tìm thấy ID bài tập hợp lệ.");
    }

    // BƯỚC B: Chuyển bài hoặc Kết thúc
    if (currentIndex < exercises.length - 1) {
      // Nhảy sang bài tiếp theo
      setCurrentIndex(currentIndex + 1);
    } else {
      // Không cần gọi completeSession nữa vì Backend không có API này
      console.log("🏁 Hoàn thành buổi tập.");
      Alert.alert(
        "Tuyệt vời!",
        "Bạn đã hoàn thành xuất sắc buổi tập hôm nay! 🔥",
        [{ text: "Về trang chủ", onPress: () => navigation.replace("Main") }],
      );
    }
  };

  const handleSetComplete = () => {
    if (currentSet < (currentEx?.sets || 1)) {
      setCurrentSet(currentSet + 1);
    } else {
      handleNext();
    }
  };

  const isPending = updateStatusMutation.isPending;

  if (!currentEx)
    return (
      <ActivityIndicator
        style={[styles.container, { justifyContent: "center" }]}
        color="#FF9500"
        size="large"
      />
    );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          disabled={isPending}
        >
          <Ionicons name="close" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          BÀI {currentIndex + 1} / {exercises.length}
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* MEDIA BOX */}
        <View style={styles.mediaBox}>
          <Image
            source={{
              uri: "https://via.placeholder.com/400x300/1C1C1E/FF9500?text=FITUP",
            }}
            style={styles.image}
          />
          <LinearGradient
            colors={["transparent", "#121212"]}
            style={styles.fade}
          />
        </View>

        {/* THÔNG TIN BÀI TẬP */}
        <View style={styles.infoBox}>
          <Text style={styles.exName}>{currentEx.workout?.name}</Text>
          <Text style={styles.exDesc}>{currentEx.workout?.describe}</Text>
          {currentEx.note && (
            <View style={styles.badgeNote}>
              <Text style={styles.noteText}>💡 {currentEx.note}</Text>
            </View>
          )}
        </View>

        {/* KHU VỰC ĐIỀU KHIỂN (TIMER HOẶC SETS) */}
        <View style={styles.controlCenter}>
          {isTimerEx ? (
            <View style={styles.timerWrapper}>
              <Text style={styles.bigNumber}>{timeLeft}s</Text>
              <TouchableOpacity
                style={styles.playBtn}
                onPress={() => setIsActive(!isActive)}
                disabled={isPending}
              >
                <Ionicons
                  name={isActive ? "pause" : "play"}
                  size={44}
                  color="#000"
                  style={!isActive && { marginLeft: 5 }}
                />
              </TouchableOpacity>
            </View>
          ) : (
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
                style={[styles.doneBtn, isPending && { opacity: 0.6 }]}
                onPress={handleSetComplete}
                disabled={isPending}
              >
                {isPending ? (
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
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.skipBtn, isPending && { opacity: 0.5 }]}
          onPress={handleNext}
          disabled={isPending}
        >
          <Text style={styles.skipText}>
            {currentIndex === exercises.length - 1 ? "HOÀN THÀNH" : "BỎ QUA"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// STYLES
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    alignItems: "center",
  },
  headerTitle: { color: "#888", fontWeight: "bold", letterSpacing: 1 },
  mediaBox: { width: width, height: 280, backgroundColor: "#1C1C1E" },
  image: { width: "100%", height: "100%", resizeMode: "contain" },
  fade: { position: "absolute", bottom: 0, left: 0, right: 0, height: 60 },
  infoBox: { paddingHorizontal: 30, alignItems: "center", marginTop: 15 },
  exName: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  exDesc: { color: "#888", textAlign: "center", marginTop: 8, fontSize: 15 },
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
    marginTop: 20,
  },
  timerWrapper: { alignItems: "center" },
  bigNumber: {
    color: "#FFF",
    fontSize: 80,
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
    marginTop: 20,
  },
  setsWrapper: { alignItems: "center" },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 30,
  },
  statItem: { alignItems: "center" },
  statLabel: {
    color: "#555",
    fontWeight: "bold",
    fontSize: 12,
    letterSpacing: 1,
  },
  statValue: {
    color: "#FF9500",
    fontSize: 40,
    fontWeight: "900",
    marginTop: 5,
  },
  doneBtn: {
    backgroundColor: "#FFF",
    width: "100%",
    height: 60,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  doneBtnText: { color: "#121212", fontWeight: "bold", fontSize: 16 },
  footer: { padding: 30, alignItems: "center" },
  skipBtn: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  skipText: { color: "#888", fontWeight: "bold", fontSize: 14 },
});
