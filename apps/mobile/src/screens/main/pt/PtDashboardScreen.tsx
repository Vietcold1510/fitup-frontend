import React, { useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/vi";

// Import APIs
import { bookingRequest } from "@/api/booking";
import { ptPublicRequest } from "@/api/pt";

const { width } = Dimensions.get("window");

export default function PtDashboardScreen() {
  const navigation = useNavigation<any>();

  // 1. LẤY THÔNG TIN CÁ NHÂN PT (displayName, experience...)
  const { data: ptRes, isLoading: isPtLoading } = useQuery({
    queryKey: ["pt-me"],
    queryFn: () => ptPublicRequest.getMe(),
  });
  const ptInfo = ptRes?.data?.data;

  // 2. LẤY DANH SÁCH LỊCH TẬP CỦA PT
  const {
    data: bookingsRes,
    isLoading: isBookingsLoading,
    refetch,
  } = useQuery({
    queryKey: ["pt-my-bookings"],
    queryFn: () => bookingRequest.getPtBookings(),
  });
  const bookings = bookingsRes?.data?.data || [];

  // 3. LOGIC TÓM TẮT DỮ LIỆU
  const dashboardData = useMemo(() => {
    const today = dayjs().format("YYYY-MM-DD");

    const todaySessionsCount = bookings.filter(
      (b: any) =>
        dayjs(b.bookingDate).isSame(today, "day") && b.status === "Confirmed",
    ).length;

    const totalPending = bookings.filter(
      (b: any) => b.status === "Confirmed",
    ).length;

    const next = bookings
      .filter(
        (b: any) =>
          b.status === "Confirmed" &&
          dayjs(`${b.bookingDate} ${b.startTime}`).isAfter(dayjs()),
      )
      .sort(
        (a: any, b: any) =>
          dayjs(`${a.bookingDate} ${a.startTime}`).unix() -
          dayjs(`${b.bookingDate} ${b.startTime}`).unix(),
      )[0];

    return { todaySessionsCount, totalPending, next };
  }, [bookings]);

  const isLoading = isPtLoading || isBookingsLoading;

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      {/* HEADER: CHỈ HIỆN TÊN VÀ AVATAR */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.welcomeText}>Chào mừng trở lại,</Text>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {isPtLoading
              ? "Đ Đang tải..."
              : ptInfo?.displayName || "Huấn luyện viên"}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.avatarCircle}
          onPress={() => navigation.navigate("Profile")}
        >
          <Ionicons name="person-circle" size={40} color="#FF9500" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor="#FF9500"
            colors={["#FF9500"]}
          />
        }
      >
        {/* QUICK STATS GRID: THAY THU NHẬP BẰNG KINH NGHIỆM */}
        <View style={styles.statsGrid}>
          <StatCard
            title="Dạy hôm nay"
            value={dashboardData.todaySessionsCount}
            sub={
              dashboardData.todaySessionsCount > 0
                ? "Bắt đầu ngay"
                : "Lịch trống"
            }
            color="#FF9500"
          />
          <StatCard
            title="Lịch chờ"
            value={dashboardData.totalPending}
            badge={
              dashboardData.totalPending > 0 ? dashboardData.totalPending : null
            }
            color="#FFF"
          />
          <StatCard
            title="Kinh nghiệm"
            value={`${ptInfo?.experienceYears || 0}`}
            sub="Năm dạy"
            color="#4CD964"
          />
        </View>

        {/* NEXT SESSION CARD */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Buổi dạy tiếp theo</Text>
          <TouchableOpacity onPress={() => navigation.navigate("MyBookings")}>
            <Text style={styles.seeAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        {dashboardData.next ? (
          <TouchableOpacity
            style={styles.nextSessionCard}
            onPress={() =>
              navigation.navigate("PtBookingRequest", {
                bookingData: dashboardData.next,
              })
            }
          >
            <View style={styles.userRow}>
              <View style={styles.userAvatar}>
                <Ionicons name="person" size={24} color="#555" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.userName}>
                  {dashboardData.next.ptName || "Học viên FitUp"}
                </Text>
                <Text style={styles.programName}>Huấn luyện viên cá nhân</Text>
              </View>
              <View style={styles.statusLabel}>
                <Text style={styles.statusLabelText}>Sắp tới</Text>
              </View>
            </View>
            <View style={styles.timeInfoRow}>
              <View style={styles.timeTag}>
                <Ionicons name="calendar-outline" size={14} color="#FF9500" />
                <Text style={styles.timeTagText}>
                  {dayjs(dashboardData.next.bookingDate).format("DD/MM/YYYY")}
                </Text>
              </View>
              <View style={styles.timeTag}>
                <Ionicons name="time-outline" size={14} color="#FF9500" />
                <Text style={styles.timeTagText}>
                  {dashboardData.next.startTime.substring(0, 5)} -{" "}
                  {dashboardData.next.endTime.substring(0, 5)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons name="calendar-clear-outline" size={40} color="#333" />
            <Text style={styles.emptyText}>
              Hôm nay bạn không có lịch dạy nào.
            </Text>
          </View>
        )}

        {/* QUICK ACTIONS: LOẠI BỎ THU NHẬP */}
        <Text style={styles.sectionTitle}>Quản lý nhanh</Text>
        <View style={styles.quickActionsGrid}>
          <ActionButton
            icon="calendar"
            title="Cài đặt lịch dạy"
            onPress={() => navigation.navigate("Schedule")}
          />
          <ActionButton
            icon="list-outline"
            title="Yêu cầu của bạn"
            onPress={() => navigation.navigate("MyBookings")}
          />
          <ActionButton
            icon="person-outline"
            title="Hồ sơ cá nhân"
            onPress={() => navigation.navigate("Profile")}
          />
          <ActionButton
            icon="shield-checkmark-outline"
            title="Chứng chỉ"
            onPress={() =>
              Alert.alert(
                "Thông báo",
                "Tính năng xem bằng cấp đang phát triển.",
              )
            }
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Sub-components
const StatCard = ({ title, value, sub, badge, color }: any) => (
  <View style={styles.statCard}>
    {badge && (
      <View style={styles.statBadge}>
        <Text style={styles.badgeText}>{badge}</Text>
      </View>
    )}
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
    {sub && (
      <Text
        style={[
          styles.statSub,
          { color: color === "#4CD964" ? "#4CD964" : "#FF9500" },
        ]}
      >
        {sub}
      </Text>
    )}
  </View>
);

const ActionButton = ({ icon, title, onPress }: any) => (
  <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
    <View style={styles.iconCircle}>
      <Ionicons name={icon} size={20} color="#FF9500" />
    </View>
    <Text style={styles.actionBtnText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  welcomeText: { color: "#888", fontSize: 13 },
  headerTitle: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 2,
  },
  avatarCircle: { padding: 2 },

  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  statCard: {
    width: "31%",
    backgroundColor: "#1C1C1E",
    padding: 16,
    borderRadius: 20,
    position: "relative",
    borderWidth: 1,
    borderColor: "#2C2C2E",
  },
  statBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#FF3B30",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  badgeText: { color: "#FFF", fontSize: 10, fontWeight: "bold" },
  statValue: { color: "#FFF", fontSize: 22, fontWeight: "bold" },
  statTitle: { color: "#888", fontSize: 11, marginTop: 4 },
  statSub: { fontSize: 10, fontWeight: "bold", marginTop: 6 },

  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  seeAllText: { color: "#FF9500", fontSize: 13 },

  nextSessionCard: {
    backgroundColor: "#1C1C1E",
    padding: 20,
    borderRadius: 28,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#333",
  },
  userRow: { flexDirection: "row", alignItems: "center" },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#2C2C2E",
    justifyContent: "center",
    alignItems: "center",
  },
  userName: { color: "#FFF", fontSize: 17, fontWeight: "bold" },
  programName: { color: "#888", fontSize: 13, marginTop: 2 },
  statusLabel: {
    backgroundColor: "#FF950020",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  statusLabelText: { color: "#FF9500", fontSize: 11, fontWeight: "bold" },
  timeInfoRow: { flexDirection: "row", marginTop: 15, gap: 12 },
  timeTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  timeTagText: { color: "#FFF", fontSize: 13, fontWeight: "500" },

  emptyCard: {
    padding: 40,
    backgroundColor: "#1C1C1E",
    borderRadius: 24,
    alignItems: "center",
    marginBottom: 25,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#333",
  },
  emptyText: {
    color: "#666",
    marginTop: 12,
    fontSize: 14,
    textAlign: "center",
  },

  quickActionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  actionBtn: {
    width: "48%",
    backgroundColor: "#1C1C1E",
    padding: 16,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#2C2C2E",
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FF950015",
    justifyContent: "center",
    alignItems: "center",
  },
  actionBtnText: { color: "#FFF", fontWeight: "600", fontSize: 13 },
});
