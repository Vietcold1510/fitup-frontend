import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

// Context & APIs
import { useAuthContext } from "@/context/AuthContext";
import { premiumRequest } from "@/api/premium";
import { usePointAmount } from "@/hooks/usePointAmount";

const { width } = Dimensions.get("window");

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { userRole, logout } = useAuthContext();

  // 🚩 Cờ kiểm tra quyền PT
  const isPT = userRole === "PT";

  // 1. Lấy số dư Point (Chỉ dành cho Học viên)
  const { data: pointAmount = 0, refetch: refetchPointAmount } = usePointAmount(
    {
      enabled: !isPT, // 🚀 Tối ưu: PT không cần gọi API này
    },
  );

  // 2. Lấy trạng thái Premium (Chỉ dành cho Học viên)
  const { data: premiumStatusRes, refetch: refetchPremiumStatus } = useQuery({
    queryKey: ["premium-my-status"],
    queryFn: () => premiumRequest.getMyStatus(),
    enabled: !isPT, // 🚀 Tối ưu: PT không cần gọi API này
  });

  const premiumStatus = premiumStatusRes?.data?.data;
  const isPremiumActive =
    !!premiumStatus?.hasPremium &&
    !!premiumStatus?.isActive &&
    (premiumStatus?.remainingDays ?? 0) > 0;

  useFocusEffect(
    React.useCallback(() => {
      if (!isPT) {
        refetchPointAmount();
        refetchPremiumStatus();
      }
    }, [refetchPointAmount, refetchPremiumStatus, isPT]),
  );

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* --- KHỐI AVATAR CHUNG --- */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarLarge}>
              <Ionicons name="person" size={45} color="#555" />
            </View>
            <View style={styles.headerTextGroup}>
              <Text style={styles.headerTitle}>
                {isPT ? "Huấn luyện viên chuyên nghiệp" : "Học viên FitUp"}
              </Text>
              <Text style={styles.headerSub}>Thành viên từ 2026</Text>
            </View>
          </View>

          {/* ================= CHỈ HIỆN CHO HỌC VIÊN ================= */}
          {!isPT && (
            <>
              {/* CARD ĐIỂM SỐ */}
              <View style={styles.pointCard}>
                <View style={styles.pointHeaderRow}>
                  <View style={styles.pointTitleRow}>
                    <Ionicons name="wallet-outline" size={16} color="#FF9500" />
                    <Text style={styles.pointTitle}>Số dư điểm của bạn</Text>
                  </View>
                </View>

                <View style={styles.pointMainRow}>
                  <View style={styles.pointAmountGroup}>
                    <Text style={styles.pointAmount}>
                      {pointAmount.toLocaleString("vi-VN")}
                    </Text>
                    <Text style={styles.pointUnit}>Pts</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.rechargeBtnBig}
                    onPress={() => navigation.navigate("TopUpPoint")}
                  >
                    <Ionicons name="add-circle" size={18} color="#121212" />
                    <Text style={styles.rechargeBtnTextBig}>Nạp thêm</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* CARD PREMIUM */}
              <View style={styles.premiumCard}>
                <View style={styles.premiumHeaderRow}>
                  <View style={styles.premiumTitleRow}>
                    <Ionicons name="diamond" size={16} color="#FF9500" />
                    <Text style={styles.premiumTitle}>Gói Premium</Text>
                  </View>
                  <Text
                    style={[
                      styles.statusTag,
                      { color: isPremiumActive ? "#4CD964" : "#666" },
                    ]}
                  >
                    {isPremiumActive ? "Đang hoạt động" : "Chưa kích hoạt"}
                  </Text>
                </View>

                {isPremiumActive ? (
                  <View style={styles.premiumActiveInfo}>
                    <Text style={styles.premiumDesc}>
                      Còn lại{" "}
                      <Text style={styles.orangeText}>
                        {premiumStatus?.remainingDays ?? 0}
                      </Text>{" "}
                      ngày sử dụng
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.premiumDesc}>
                    Nâng cấp để nhận nhiều ưu đãi hơn
                  </Text>
                )}
              </View>

              {/* BANNER ĐĂNG KÝ PT */}
              <TouchableOpacity
                style={styles.ptRegisterCard}
                onPress={() => navigation.navigate("PtRegister")}
              >
                <LinearGradient
                  colors={["#5B3FD1", "#8F5BFF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.ptGradient}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.ptTitle}>Trở thành PT</Text>
                    <Text style={styles.ptSub}>
                      Kiếm thêm thu nhập từ việc huấn luyện
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#FFF" />
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}
          {/* ========================================================= */}

          {/* --- DANH MỤC MENU CHUNG --- */}
          <Text style={styles.menuLabel}>Tài khoản & Bảo mật</Text>

          <MenuBtn
            icon="chatbubble-ellipses-outline"
            title="AI Chat trợ giúp"
            color="#0A84FF"
            onPress={() => navigation.navigate("AiChatConversations")}
          />

          {!isPT && (
            <>
              <Text style={styles.menuLabel}>Giao dịch</Text>
              <MenuBtn
                icon="receipt-outline"
                title="Lịch sử dùng điểm"
                color="#FF9500"
                onPress={() => navigation.navigate("TransactionHistory")}
              />
              <MenuBtn
                icon="card-outline"
                title="Lịch sử nạp tiền"
                color="#34C759"
                onPress={() => navigation.navigate("TopUpHistory")}
              />
            </>
          )}

          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
            <Text style={styles.logoutText}>Đăng xuất tài khoản</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Component Menu rút gọn
const MenuBtn = ({ icon, title, color, onPress }: any) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuIconBox}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <Text style={styles.menuText}>{title}</Text>
    <Ionicons name="chevron-forward" size={16} color="#333" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  content: { padding: 20 },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  avatarLarge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#1C1C1E",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  headerTextGroup: { marginLeft: 16 },
  headerTitle: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  headerSub: { color: "#666", fontSize: 13, marginTop: 4 },

  // Point Card
  pointCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2C2C2E",
  },
  pointHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  pointTitleRow: { flexDirection: "row", alignItems: "center" },
  pointTitle: { color: "#8F8F8F", fontSize: 13, marginLeft: 8 },
  pointMainRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pointAmountGroup: { flexDirection: "row", alignItems: "baseline" },
  pointAmount: { color: "#FFF", fontSize: 32, fontWeight: "900" },
  pointUnit: {
    color: "#FF9500",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 4,
  },
  rechargeBtnBig: {
    backgroundColor: "#FF9500",
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  rechargeBtnTextBig: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 14,
    marginLeft: 6,
  },

  // Premium Card
  premiumCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2C2C2E",
  },
  premiumHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  premiumTitleRow: { flexDirection: "row", alignItems: "center" },
  premiumTitle: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 8,
  },
  statusTag: { fontSize: 11, fontWeight: "bold" },
  premiumActiveInfo: { marginTop: 10 },
  premiumDesc: { color: "#666", fontSize: 13, marginTop: 8 },
  orangeText: { color: "#FF9500", fontWeight: "bold" },

  // PT Register
  ptRegisterCard: { borderRadius: 20, overflow: "hidden", marginBottom: 30 },
  ptGradient: { padding: 20, flexDirection: "row", alignItems: "center" },
  ptTitle: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  ptSub: { color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 4 },

  // Menu
  menuLabel: {
    color: "#444",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 10,
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#1C1C1E",
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#1C1C1E",
    justifyContent: "center",
    alignItems: "center",
  },
  menuText: { flex: 1, color: "#DDD", fontSize: 15, marginLeft: 14 },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    paddingVertical: 16,
    backgroundColor: "#FF3B3010",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FF3B3020",
  },
  logoutText: { color: "#FF3B30", fontWeight: "bold", marginLeft: 10 },
});
