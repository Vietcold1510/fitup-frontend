import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/vi";

import { bookingRequest } from "@/api/booking";

export default function PtBookingRequestScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const queryClient = useQueryClient();

  // 1. Lấy dữ liệu từ route params
  const { bookingData } = route.params || {};

  // 🚀 THÊM LOG TẠI ĐÂY ĐỂ KIỂM TRA
  console.log("====================================");
  console.log("🔍 FULL ROUTE PARAMS:", JSON.stringify(route.params, null, 2));
  console.log("📅 BOOKING DATA ID:", bookingData?.id);
  console.log("👤 PT NAME:", bookingData?.ptName);
  console.log("🚦 STATUS:", bookingData?.status);
  console.log("====================================");
  // 2. Mutation xác nhận hoàn thành buổi tập (Dành cho PT)
  const completeMutation = useMutation({
    mutationFn: () => bookingRequest.completeBooking(bookingData.id),
    onSuccess: () => {
      Alert.alert(
        "Thành công 🎖️",
        "Hệ thống đã ghi nhận buổi tập hoàn thành!",
        [
          {
            text: "Đã hiểu",
            onPress: () => {
              // Refetch lại danh sách lịch tập của PT để cập nhật trạng thái mới
              queryClient.invalidateQueries({ queryKey: ["pt-my-bookings"] });
              navigation.goBack();
            },
          },
        ],
      );
    },
    onError: (err: any) => {
      Alert.alert(
        "Lỗi xác nhận",
        err.response?.data?.msg || "Không thể thực hiện thao tác này lúc này.",
      );
    },
  });

  if (!bookingData) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#FFF" }}>
          Không tìm thấy thông tin đơn đặt lịch
        </Text>
        <TouchableOpacity
          style={{ marginTop: 20 }}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: "#FF9500" }}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isConfirmed = bookingData.status === "Confirmed";
  const isCompleted = bookingData.status === "Completed";

  return (
    <SafeAreaView style={styles.container}>
      {/* THANH TIÊU ĐỀ */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={20} color="#666" />
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.headerName}>
              {bookingData.ptName || "Học viên FitUp"}
            </Text>
            <Text style={styles.headerSub}>Học viên của bạn</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.chatBtn}>
          <Ionicons name="chatbubble-ellipses" size={24} color="#FF9500" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
      >
        {/* TRẠNG THÁI BUỔI TẬP */}
        <View
          style={[
            styles.statusBanner,
            isCompleted ? styles.bgGreen : styles.bgOrange,
          ]}
        >
          <Ionicons
            name={isCompleted ? "checkmark-circle" : "time"}
            size={18}
            color={isCompleted ? "#4CD964" : "#FF9500"}
          />
          <Text
            style={[
              styles.statusText,
              { color: isCompleted ? "#4CD964" : "#FF9500" },
            ]}
          >
            Trạng thái:{" "}
            {isCompleted ? "Đã hoàn thành" : "Đã xác nhận (Sắp diễn ra)"}
          </Text>
        </View>

        {/* CHI TIẾT LỊCH TẬP */}
        <View style={styles.mainCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.tagPrimary}>
              <Text style={styles.tagText}>Huấn luyện cá nhân</Text>
            </View>
            <Text style={styles.bookingId}>
              Mã đơn: #{bookingData.id.substring(0, 8).toUpperCase()}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="calendar" size={20} color="#FF9500" />
            <View style={{ marginLeft: 15 }}>
              <Text style={styles.infoLabel}>
                {dayjs(bookingData.bookingDate)
                  .locale("vi")
                  .format("dddd, DD [Tháng] MM, YYYY")}
              </Text>
              <Text style={styles.infoSub}>
                {bookingData.startTime.substring(0, 5)} -{" "}
                {bookingData.endTime.substring(0, 5)}
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="fitness" size={20} color="#FF9500" />
            <Text style={[styles.infoLabel, { marginLeft: 15 }]}>
              Buổi tập 60 phút
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="wallet" size={20} color="#FF9500" />
            <Text style={[styles.infoLabel, { marginLeft: 15 }]}>
              {bookingData.total.toLocaleString("vi-VN")} VNĐ
            </Text>
          </View>
        </View>

        {/* GHI CHÚ TỪ HỌC VIÊN */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text" size={18} color="#FF9500" />
            <Text style={styles.sectionTitle}>Lời nhắn từ học viên</Text>
          </View>
          <Text style={styles.noteContent}>
            {bookingData.note && bookingData.note !== "nothing"
              ? `"${bookingData.note}"`
              : "Học viên không có yêu cầu đặc biệt nào."}
          </Text>
        </View>

        {/* CHÍNH SÁCH DÀNH CHO PT */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="shield-checkmark" size={18} color="#FF9500" />
            <Text style={styles.sectionTitle}>Nhiệm vụ huấn luyện</Text>
          </View>
          <Text style={styles.policyContent}>
            Hãy đảm bảo bạn đã hoàn thành buổi hướng dẫn cho học viên trước khi
            xác nhận. Sau khi xác nhận "Hoàn thành", hệ thống sẽ tất toán thù
            lao cho bạn.
          </Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* NÚT XÁC NHẬN - CHỈ HIỆN KHI TRẠNG THÁI LÀ CONFIRMED */}
      {isConfirmed && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.completeBtn}
            onPress={() => {
              Alert.alert(
                "Xác nhận hoàn thành",
                "Buổi tập này thực sự đã kết thúc tốt đẹp chứ?",
                [
                  { text: "Chưa, quay lại", style: "cancel" },
                  {
                    text: "Đã hoàn thành",
                    style: "default",
                    onPress: () => completeMutation.mutate(),
                  },
                ],
              );
            }}
            disabled={completeMutation.isPending}
          >
            {completeMutation.isPending ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.completeText}>XÁC NHẬN HOÀN THÀNH</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#1C1C1E",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 15,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  backBtn: { padding: 4 },
  chatBtn: { padding: 4 },
  headerName: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  headerSub: { color: "#888", fontSize: 12 },

  statusBanner: {
    flexDirection: "row",
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  bgOrange: { backgroundColor: "#FF950015" },
  bgGreen: { backgroundColor: "#4CD96415" },
  statusText: { fontWeight: "bold", fontSize: 14 },

  mainCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2C2C2E",
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  tagPrimary: {
    backgroundColor: "#FF9500",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: { color: "#000", fontWeight: "bold", fontSize: 11 },
  bookingId: { color: "#666", fontSize: 12 },
  infoItem: { flexDirection: "row", alignItems: "center", marginBottom: 18 },
  infoLabel: { color: "#FFF", fontSize: 15, fontWeight: "600" },
  infoSub: { color: "#888", fontSize: 13, marginTop: 4 },

  sectionCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: { color: "#FFF", fontSize: 15, fontWeight: "bold" },
  noteContent: {
    color: "#CCC",
    fontSize: 14,
    lineHeight: 22,
    fontStyle: "italic",
  },
  policyContent: { color: "#888", fontSize: 13, lineHeight: 20 },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1C1C1E",
    padding: 20,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  completeBtn: {
    backgroundColor: "#FF9500",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#FF9500",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  completeText: {
    color: "#000",
    fontWeight: "900",
    fontSize: 16,
    letterSpacing: 1,
  },
});
