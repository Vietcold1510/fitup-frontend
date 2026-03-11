import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function WorkoutPlayerScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { dayData } = route.params;
  const exercises = dayData?.exercises || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);

  const currentEx = exercises[currentIndex];
  const isTimerEx = !!currentEx?.durationSeconds; // Kiểm tra bài tập tính bằng giây

  // 1. Khởi tạo dữ liệu khi đổi bài tập
  useEffect(() => {
    if (isTimerEx) {
      setTimeLeft(currentEx.durationSeconds);
    } else {
      setTimeLeft(0);
      setCurrentSet(1);
    }
    setIsActive(false);
  }, [currentIndex]);

  // 2. Logic đếm ngược cho Timer
  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerEx && isActive) {
      setIsActive(false);
      // Tự động chuyển bài hoặc báo chuông ở đây
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.replace("Main"); // Hoàn thành buổi tập
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleSetComplete = () => {
    if (currentSet < (currentEx.sets || 1)) {
      setCurrentSet(currentSet + 1);
    } else {
      handleNext();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          BÀI {currentIndex + 1} / {exercises.length}
        </Text>
        <TouchableOpacity>
          <Ionicons name="help-circle-outline" size={26} color="#555" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* KHU VỰC HÌNH ẢNH / VIDEO */}
        <View style={styles.mediaBox}>
          <Image
            source={{
              uri: "https://via.placeholder.com/400x300/1C1C1E/FF9500?text=FITUP+ANIMATION",
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
          <Text style={styles.exName}>{currentEx?.workout?.name}</Text>
          <Text style={styles.exDesc}>{currentEx?.workout?.describe}</Text>

          {currentEx?.note && (
            <View style={styles.badgeNote}>
              <Text style={styles.noteText}>💡 {currentEx.note}</Text>
            </View>
          )}
        </View>

        {/* KHU VỰC ĐIỀU KHIỂN CHÍNH (TIMER HOẶC SETS) */}
        <View style={styles.controlCenter}>
          {isTimerEx ? (
            <View style={styles.timerWrapper}>
              <Text style={styles.bigNumber}>{timeLeft}s</Text>
              <TouchableOpacity
                style={styles.mainCircleBtn}
                onPress={() => setIsActive(!isActive)}
              >
                <Ionicons
                  name={isActive ? "pause" : "play"}
                  size={44}
                  color="#121212"
                  style={!isActive && { marginLeft: 6 }}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.setsWrapper}>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>SETS</Text>
                  <Text style={styles.statValue}>
                    {currentSet} / {currentEx.sets}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>REPS</Text>
                  <Text style={styles.statValue}>{currentEx.reps}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.doneBtn}
                onPress={handleSetComplete}
              >
                <Text style={styles.doneBtnText}>XONG HIỆP</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* FOOTER NAVIGATION */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={handlePrev} disabled={currentIndex === 0}>
          <Ionicons
            name="play-back"
            size={30}
            color={currentIndex === 0 ? "#333" : "#FFF"}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipBtn} onPress={handleNext}>
          <Text style={styles.skipText}>
            {currentIndex === exercises.length - 1 ? "HOÀN THÀNH" : "BỎ QUA"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          disabled={currentIndex === exercises.length - 1}
        >
          <Ionicons
            name="play-forward"
            size={30}
            color={currentIndex === exercises.length - 1 ? "#333" : "#FFF"}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 60,
  },
  headerTitle: {
    color: "#666",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1,
  },
  content: { flex: 1, alignItems: "center" },
  mediaBox: {
    width: width,
    height: 320,
    backgroundColor: "#1C1C1E",
    justifyContent: "center",
  },
  image: { width: "100%", height: "100%", resizeMode: "contain" },
  fade: { position: "absolute", bottom: 0, left: 0, right: 0, height: 80 },
  infoBox: { paddingHorizontal: 30, alignItems: "center", marginTop: -20 },
  exName: {
    color: "#FFF",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  exDesc: { color: "#888", fontSize: 16, marginTop: 8, textAlign: "center" },
  badgeNote: {
    backgroundColor: "#261C12",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 15,
  },
  noteText: { color: "#FF9500", fontSize: 13, fontWeight: "600" },
  controlCenter: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 40,
  },

  // Timer Styles
  timerWrapper: { alignItems: "center" },
  bigNumber: {
    color: "#FFF",
    fontSize: 100,
    fontWeight: "900",
    marginBottom: 20,
  },
  mainCircleBtn: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#FF9500",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#FF9500",
    shadowOpacity: 0.4,
    shadowRadius: 15,
  },

  // Strength Styles
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
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  statValue: {
    color: "#FF9500",
    fontSize: 44,
    fontWeight: "900",
    marginTop: 5,
  },
  doneBtn: {
    backgroundColor: "#FFF",
    width: "100%",
    height: 65,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  doneBtnText: { color: "#121212", fontSize: 18, fontWeight: "bold" },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingBottom: 20,
    height: 100,
  },
  skipBtn: {
    backgroundColor: "#1C1C1E",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#333",
  },
  skipText: { color: "#888", fontWeight: "bold" },
});
