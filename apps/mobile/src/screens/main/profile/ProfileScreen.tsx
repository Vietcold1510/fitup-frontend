import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useAuthContext } from "@/context/AuthContext";
import { premiumRequest } from "@/api/premium";
import { usePointAmount } from "@/hooks/usePointAmount";

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { userRole, logout } = useAuthContext();
  const { data: premiumStatusRes } = useQuery({
    queryKey: ["premium-my-status"],
    queryFn: () => premiumRequest.getMyStatus(),
  });
  const { data: pointAmount = 0 } = usePointAmount({
    enabled: userRole !== "PT",
  });
  const premiumStatus = premiumStatusRes?.data?.data;
  const isPremiumActive =
    !!premiumStatus?.hasPremium && !!premiumStatus?.isActive;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {userRole !== "PT" && (
          <View style={styles.pointCard}>
            <View style={styles.pointHeaderRow}>
              <View style={styles.pointTitleRow}>
                <Ionicons name="wallet-outline" size={16} color="#FF9500" />
                <Text style={styles.pointTitle}>Điểm của bạn</Text>
              </View>
              <Text style={styles.pointCaption}>Point balance</Text>
            </View>
            <Text style={styles.pointAmount}>
              {pointAmount.toLocaleString("vi-VN")} Pts
            </Text>
          </View>
        )}

        <View style={styles.premiumCard}>
          <View style={styles.premiumHeaderRow}>
            <View style={styles.premiumTitleRow}>
              <Ionicons name="diamond" size={16} color="#FF9500" />
              <Text style={styles.premiumTitle}>Gói Premium</Text>
            </View>
            <Text
              style={[
                styles.premiumStatusTag,
                { color: isPremiumActive ? "#4CD964" : "#999" },
              ]}
            >
              {isPremiumActive ? "Đang hoạt động" : "Chưa kích hoạt"}
            </Text>
          </View>

          {isPremiumActive ? (
            <>
              <View style={styles.premiumInfoRow}>
                <Text style={styles.premiumDesc}>Còn lại </Text>
                <Text style={styles.premiumDayValue}>
                  {premiumStatus?.remainingDays ?? 0}
                </Text>
                <Text style={styles.premiumDesc}> ngày</Text>
              </View>
              <Text style={styles.premiumDateText}>
                Hết hạn: {dayjs(premiumStatus.endDate).format("DD/MM/YYYY")}
              </Text>
            </>
          ) : (
            <Text style={styles.premiumDateText}>Bạn chưa có gói premium</Text>
          )}
        </View>

        {userRole !== "PT" && (
          <TouchableOpacity
            style={styles.ptCard}
            onPress={() => navigation.navigate("PtRegister")}
          >
            <LinearGradient
              colors={["#5B3FD1", "#8F5BFF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ptGradient}
            >
              <View style={styles.ptInfo}>
                <Text style={styles.ptTitle}>Trở thành PT chuyên nghiệp</Text>
                <Text style={styles.ptSub}>
                  Chia sẻ kinh nghiệm và gia tăng thu nhập ngay hôm nay!
                </Text>
              </View>
              <View style={styles.ptIconBox}>
                <Ionicons name="chevron-forward" size={20} color="#FFF" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconCircle}>
            <Ionicons name="settings-outline" size={20} color="#FFF" />
          </View>
          <Text style={styles.menuText}>Cài đặt tài khoản</Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color="#444"
            style={{ marginLeft: "auto" }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("AiChatConversations")}
        >
          <View style={styles.menuIconCircle}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={20}
              color="#0A84FF"
            />
          </View>
          <Text style={styles.menuText}>AI Chat</Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color="#444"
            style={{ marginLeft: "auto" }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("TransactionHistory")}
        >
          <View style={styles.menuIconCircle}>
            <Ionicons name="receipt-outline" size={20} color="#FF9500" />
          </View>
          <Text style={styles.menuText}>Lịch sử giao dịch</Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color="#444"
            style={{ marginLeft: "auto" }}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
          <Text style={styles.logoutText}>Đăng xuất tài khoản</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  content: { padding: 20, marginTop: 30 },
  pointCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2C2C2E",
    padding: 16,
    marginBottom: 18,
  },
  pointHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pointTitleRow: { flexDirection: "row", alignItems: "center" },
  pointTitle: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 6,
  },
  pointCaption: { color: "#8F8F8F", fontSize: 11 },
  pointAmount: {
    color: "#FF9500",
    fontWeight: "900",
    fontSize: 28,
    marginTop: 10,
  },
  premiumCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2C2C2E",
    padding: 16,
    marginBottom: 18,
  },
  premiumHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  premiumTitleRow: { flexDirection: "row", alignItems: "center" },
  premiumTitle: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 6,
  },
  premiumStatusTag: { fontSize: 12, fontWeight: "700" },
  premiumInfoRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  premiumDesc: { color: "#BDBDBD", fontSize: 13 },
  premiumDayValue: { color: "#FF9500", fontWeight: "900", fontSize: 16 },
  premiumDateText: { color: "#8F8F8F", fontSize: 12, marginTop: 8 },
  ptCard: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#7B61FF",
    elevation: 5,
    shadowColor: "#AF52DE",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  ptGradient: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  ptInfo: { flex: 1 },
  ptTitle: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  ptSub: { color: "#F1E9FF", fontSize: 12, marginTop: 4, opacity: 1 },
  ptIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#1C1C1E",
  },
  menuText: { color: "#FFF", fontSize: 16, marginLeft: 15 },
  menuIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#1C1C1E",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 20,
    paddingVertical: 15,
    marginHorizontal: 20,
    backgroundColor: "#FF3B3010",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FF3B3030",
  },
  logoutText: {
    color: "#FF3B30",
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
