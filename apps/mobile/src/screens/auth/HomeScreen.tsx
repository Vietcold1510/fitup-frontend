import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { premiumRequest } from "@/api/premium";
import { usePointAmount } from "@/hooks/usePointAmount";
import { useWorkout } from "@/hooks/useWorkout";

const appLogo = require("../../../assets/Fitness_Logo__1_-removebg-preview.png");

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { data: premiumStatusRes, refetch: refetchPremiumStatus } = useQuery({
    queryKey: ["premium-my-status"],
    queryFn: () => premiumRequest.getMyStatus(),
  });
  const { data: pointAmount = 0, refetch: refetchPointAmount } = usePointAmount();
  const { todaySession, isLoadingToday } = useWorkout();

  useFocusEffect(
    React.useCallback(() => {
      refetchPointAmount();
      refetchPremiumStatus();
    }, [refetchPointAmount, refetchPremiumStatus]),
  );

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

  const handlePremiumFeaturePress = (targetScreen: string) => {
    if (!isPremiumActive) {
      redirectPremiumWithAlert();
      return;
    }
    navigation.navigate(targetScreen);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Chào bạn!</Text>
            <Text style={styles.subWelcome}>
              Quản lý point, premium và thao tác nhanh
            </Text>
          </View>
          <TouchableOpacity
            style={styles.logoButton}
            onPress={() => navigation.navigate("Profile")}
          >
            <Image
              source={appLogo}
              style={styles.headerLogo}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.metaStack}>
            <View style={styles.metaLine}>
              <Ionicons
                name={isPremiumActive ? "diamond" : "diamond-outline"}
                size={15}
                color="#FF9500"
              />
              <Text style={styles.metaLabel}>Premium</Text>
              <Text style={styles.metaValue}>
                {isPremiumActive
                  ? `${premiumStatus?.remainingDays ?? 0} ngày`
                  : "Chưa kích hoạt"}
              </Text>
            </View>

            <View style={styles.metaLine}>
              <Ionicons name="wallet-outline" size={15} color="#FF9500" />
              <Text style={styles.metaLabel}>Points</Text>
              <Text style={[styles.metaValue, styles.pointValue]}>
                {pointAmount.toLocaleString("vi-VN")} Pts
              </Text>
            </View>
          </View>

          <View style={styles.todaySection}>
            <Text style={styles.sectionTitle}>Mục tiêu hôm nay</Text>
            {isLoadingToday ? (
              <View style={styles.todayLoading}>
                <ActivityIndicator size="small" color="#FF9500" />
              </View>
            ) : todaySession ? (
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

          {!isPremiumActive && (
            <LinearGradient
              colors={["#FFB347", "#FF9500", "#D97706"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.premiumCard}
            >
              <View style={styles.premiumHead}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.premiumTitle}>Nâng cấp Premium</Text>
                  <Text style={styles.premiumSub}>
                    Mở khóa toàn bộ tính năng và huấn luyện AI
                  </Text>
                </View>
                <Ionicons name="diamond" size={22} color="#FFF" />
              </View>

              <View style={styles.premiumList}>
                <View style={styles.premiumItem}>
                  <Ionicons name="checkmark" size={16} color="#FFF" />
                  <Text style={styles.premiumItemText}>AI Chat không giới hạn</Text>
                </View>
                <View style={styles.premiumItem}>
                  <Ionicons name="checkmark" size={16} color="#FFF" />
                  <Text style={styles.premiumItemText}>Tạo trình tập luyện nâng cao</Text>
                </View>
                <View style={styles.premiumItem}>
                  <Ionicons name="checkmark" size={16} color="#FFF" />
                  <Text style={styles.premiumItemText}>Ưu tiên hỗ trợ từ hệ thống AI</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.premiumBtn}
                onPress={() => navigation.navigate("Premium")}
              >
                <Text style={styles.premiumBtnText}>Xem gói Premium</Text>
              </TouchableOpacity>
            </LinearGradient>
          )}

          <Text
            style={[
              styles.sectionTitle,
              isPremiumActive
                ? styles.quickFeatureTitleWhenHasPremium
                : styles.quickFeatureTitle,
            ]}
          >
            Tính năng nhanh
          </Text>
          <View style={styles.featureGrid}>
            <TouchableOpacity
              style={styles.featureCard}
              onPress={() => navigation.navigate("WorkoutTypes")}
            >
              <View style={styles.featureIconWrap}>
                <Ionicons name="play" size={18} color="#FF9500" />
              </View>
              <Text style={styles.featureTitle}>Thư viện bài tập</Text>
              <Text style={styles.featureSub}>Xem danh sách bài tập theo nhóm</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.featureCard}
              onPress={() => handlePremiumFeaturePress("Workouts")}
            >
              {!isPremiumActive && (
                <View style={styles.premiumTagTopRight}>
                  <Ionicons name="diamond" size={10} color="#111" />
                  <Text style={styles.premiumTagText}>Premium</Text>
                </View>
              )}
              <View style={styles.featureIconWrap}>
                <Ionicons name="barbell-outline" size={18} color="#FFB347" />
              </View>
              <Text style={styles.featureTitle}>Lộ trình tập luyện</Text>
              <Text style={styles.featureSub}>Theo dõi mục tiêu và tiến độ tập</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.featureCard}
              onPress={() => handlePremiumFeaturePress("AiChatConversations")}
            >
              {!isPremiumActive && (
                <View style={styles.premiumTagTopRight}>
                  <Ionicons name="diamond" size={10} color="#111" />
                  <Text style={styles.premiumTagText}>Premium</Text>
                </View>
              )}
              <View style={styles.featureIconWrap}>
                <Ionicons name="sparkles-outline" size={18} color="#FF9500" />
              </View>
              <Text style={styles.featureTitle}>AI Chat</Text>
              <Text style={styles.featureSub}>Hỏi đáp và tư vấn luyện tập cùng AI</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.featureCard}
              onPress={() => navigation.navigate("Trainers")}
            >
              <View style={styles.featureIconWrap}>
                <Ionicons name="people-outline" size={18} color="#FF9500" />
              </View>
              <Text style={styles.featureTitle}>Book PT</Text>
              <Text style={styles.featureSub}>Đặt lịch tập cùng huấn luyện viên</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  welcomeText: { color: "#FFF", fontSize: 28, fontWeight: "800" },
  subWelcome: { color: "#888", fontSize: 14, marginTop: 4 },
  logoButton: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#1C1C1E",
    borderWidth: 1,
    borderColor: "#2C2C2E",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  headerLogo: { width: 42, height: 42 },
  content: { paddingHorizontal: 20, paddingBottom: 100 },
  metaStack: {
    gap: 10,
  },
  metaLine: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaLabel: {
    color: "#CFCFCF",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 8,
    minWidth: 68,
  },
  metaValue: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "800",
  },
  pointValue: { color: "#FF9500" },
  todaySection: { marginTop: 24 },
  sectionTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 15,
  },
  quickFeatureTitle: {
    marginTop: 20,
  },
  quickFeatureTitleWhenHasPremium: {
    marginTop: 10,
  },
  todayLoading: {
    backgroundColor: "#1C1C1E",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#2C2C2E",
    paddingVertical: 28,
    alignItems: "center",
  },
  todayCard: {
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
    padding: 30,
    borderRadius: 24,
    backgroundColor: "#1C1C1E",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2C2C2E",
  },
  emptyTodayText: { color: "#666", fontSize: 14 },

  premiumCard: {
    marginTop: 22,
    borderRadius: 20,
    padding: 18,
  },
  premiumHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  premiumTitle: {
    color: "#FFF",
    fontSize: 30,
    fontWeight: "900",
  },
  premiumSub: {
    color: "#1F1F1F",
    marginTop: 4,
    fontSize: 14,
    fontWeight: "700",
    opacity: 0.9,
  },
  premiumList: {
    marginTop: 14,
    gap: 8,
  },
  premiumItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  premiumItemText: {
    color: "#111",
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "800",
  },
  premiumBtn: {
    marginTop: 16,
    backgroundColor: "#F0F0F0",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  premiumBtnText: {
    color: "#222",
    fontSize: 18,
    fontWeight: "900",
  },

  featureGrid: {
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    width: "48.5%",
    backgroundColor: "#1C1C1E",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#2C2C2E",
    padding: 14,
    marginBottom: 12,
    minHeight: 165,
    position: "relative",
  },
  featureIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#261C12",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  featureTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 24,
    marginBottom: 6,
    flexShrink: 1,
  },
  featureSub: {
    color: "#A8A8A8",
    fontSize: 14,
    lineHeight: 19,
  },
  premiumTagTopRight: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#FF9500",
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  premiumTagText: {
    color: "#111",
    fontSize: 10,
    fontWeight: "800",
    marginLeft: 4,
  },
});
