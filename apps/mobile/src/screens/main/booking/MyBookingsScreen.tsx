import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingRequest } from "@/api/booking";
import dayjs from "dayjs";
import "dayjs/locale/vi";

const { width } = Dimensions.get("window");

export default function MyBookingsScreen({ navigation }: any) {
  const queryClient = useQueryClient();

  // --- STATE QUẢN LÝ FEEDBACK ---
  const [isFeedbackVisible, setFeedbackVisible] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // 1. API: LẤY DANH SÁCH LỊCH ĐÃ ĐẶT (HỌC VIÊN)
  const {
    data: res,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: () => bookingRequest.getMyBookings(),
  });
  const bookings = res?.data?.data?.data || [];

  // 2. MUTATION: HỦY LỊCH TẬP
  const cancelMutation = useMutation({
    mutationFn: (id: string) => bookingRequest.cancelBooking(id),
    onSuccess: () => {
      Alert.alert("Thành công", "Đã hủy lịch tập của bạn.");
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["pt-available-slots"] }); // Trả lại slot cho PT
    },
    onError: (err: any) => {
      Alert.alert(
        "Lỗi",
        err.response?.data?.msg || "Không thể hủy lịch lúc này.",
      );
    },
  });

  // 3. MUTATION: GỬI ĐÁNH GIÁ
  const feedbackMutation = useMutation({
    mutationFn: (body: any) => bookingRequest.sendFeedback(body),
    onSuccess: () => {
      Alert.alert("Cảm ơn 🧡", "Đánh giá của bạn giúp dịch vụ tốt hơn!");
      setFeedbackVisible(false);
      setRating(5);
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
    },
    onError: () => Alert.alert("Lỗi", "Gửi đánh giá thất bại."),
  });

  const handleOpenFeedback = (id: string) => {
    setSelectedBookingId(id);
    setFeedbackVisible(true);
  };

  const handleSubmitFeedback = () => {
    if (!selectedBookingId) return;
    feedbackMutation.mutate({
      bookingId: selectedBookingId,
      rating,
      comment,
    });
  };

  // --- RENDER GIAO DIỆN ITEM ---
  const renderBookingItem = ({ item }: any) => {
    const isConfirmed = item.status === "Confirmed";
    const isCompleted = item.status === "Completed";

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() =>
          navigation.navigate("BookingDetail", { bookingData: item })
        } // 🚀 TRUYỀN DỮ LIỆU SANG CHI TIẾT
      >
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.ptName}>
              {item.ptName || "Huấn luyện viên"}
            </Text>
            <Text style={styles.bookingId}>
              Mã đơn: #{item.id.substring(0, 8).toUpperCase()}
            </Text>
          </View>

          {/* TAG TRẠNG THÁI */}
          <View
            style={[
              styles.statusTag,
              {
                backgroundColor: isConfirmed
                  ? "#4CD96420"
                  : isCompleted
                    ? "#FF950020"
                    : "#2C2C2E",
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color: isConfirmed
                    ? "#4CD964"
                    : isCompleted
                      ? "#FF9500"
                      : "#888",
                },
              ]}
            >
              {isConfirmed ? "Sắp tới" : isCompleted ? "Đã xong" : item.status}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color="#FF9500" />
          <Text style={styles.infoValue}>
            {dayjs(item.bookingDate).format("DD/MM/YYYY")} •{" "}
            {item.startTime.substring(0, 5)} - {item.endTime.substring(0, 5)}
          </Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Học phí đã thanh toán:</Text>
          <Text style={styles.priceValue}>{item.total.toLocaleString()}đ</Text>
        </View>

        {/* CỤM NÚT BẤM DỰA TRÊN TRẠNG THÁI */}
        <View style={styles.actionRow}>
          {isConfirmed && (
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() =>
                Alert.alert("Xác nhận", "Bạn muốn hủy lịch tập này?", [
                  { text: "Quay lại" },
                  {
                    text: "Hủy ngay",
                    onPress: () => cancelMutation.mutate(item.id),
                    style: "destructive",
                  },
                ])
              }
            >
              <Text style={styles.secondaryBtnText}>Hủy lịch</Text>
            </TouchableOpacity>
          )}

          {isCompleted && (
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => handleOpenFeedback(item.id)}
            >
              <Text style={styles.primaryBtnText}>Đánh giá buổi tập</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER BAR */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch tập của tôi</Text>
        <TouchableOpacity onPress={() => refetch()} disabled={isLoading}>
          <Ionicons name="refresh" size={22} color="#FF9500" />
        </TouchableOpacity>
      </View>

      {/* DANH SÁCH LỊCH */}
      {isLoading ? (
        <ActivityIndicator color="#FF9500" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={renderBookingItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={64} color="#2C2C2E" />
              <Text style={styles.emptyText}>
                Bạn chưa đăng ký lịch tập nào.
              </Text>
            </View>
          }
          refreshing={isLoading}
          onRefresh={refetch}
        />
      )}

      {/* FEEDBACK MODAL */}
      <Modal visible={isFeedbackVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderLine} />
            <Text style={styles.modalTitle}>Đánh giá buổi tập</Text>
            <Text style={styles.modalSub}>
              Trải nghiệm của Hàn với huấn luyện viên thế nào?
            </Text>

            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <TouchableOpacity key={s} onPress={() => setRating(s)}>
                  <FontAwesome
                    name={s <= rating ? "star" : "star-o"}
                    size={38}
                    color="#FF9500"
                    style={{ marginHorizontal: 6 }}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Nhập cảm nhận của Hàn..."
              placeholderTextColor="#555"
              multiline
              value={comment}
              onChangeText={setComment}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setFeedbackVisible(false)}
              >
                <Text style={styles.modalCancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalSubmit,
                  feedbackMutation.isPending && { opacity: 0.6 },
                ]}
                onPress={handleSubmitFeedback}
                disabled={feedbackMutation.isPending}
              >
                {feedbackMutation.isPending ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={styles.modalSubmitText}>Gửi đánh giá</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: { color: "#FFF", fontSize: 20, fontWeight: "bold" },
  card: {
    backgroundColor: "#1C1C1E",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2C2C2E",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  ptName: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  bookingId: { color: "#555", fontSize: 11, marginTop: 4 },
  statusTag: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10 },
  statusText: { fontSize: 11, fontWeight: "bold" },
  divider: { height: 1, backgroundColor: "#2C2C2E", marginVertical: 16 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  infoValue: { color: "#AAA", fontSize: 14 },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    alignItems: "center",
  },
  priceLabel: { color: "#888", fontSize: 13 },
  priceValue: { color: "#FF9500", fontSize: 18, fontWeight: "900" },
  actionRow: { flexDirection: "row", gap: 12, marginTop: 20 },
  primaryBtn: {
    flex: 1,
    backgroundColor: "#FF9500",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryBtnText: { color: "#000", fontWeight: "bold", fontSize: 14 },
  secondaryBtn: {
    flex: 1,
    backgroundColor: "transparent",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
  secondaryBtnText: { color: "#FF3B30", fontWeight: "bold", fontSize: 14 },
  emptyContainer: { flex: 1, alignItems: "center", marginTop: 120 },
  emptyText: { color: "#444", marginTop: 20, fontSize: 15 },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1C1C1E",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    alignItems: "center",
    paddingBottom: 40,
  },
  modalHeaderLine: {
    width: 40,
    height: 4,
    backgroundColor: "#333",
    borderRadius: 2,
    marginBottom: 20,
  },
  modalTitle: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  modalSub: {
    color: "#888",
    textAlign: "center",
    marginBottom: 25,
    fontSize: 14,
  },
  starRow: { flexDirection: "row", marginBottom: 30 },
  input: {
    width: "100%",
    backgroundColor: "#2C2C2E",
    color: "#FFF",
    borderRadius: 16,
    padding: 16,
    height: 110,
    textAlignVertical: "top",
    marginBottom: 30,
    fontSize: 15,
  },
  modalActions: { flexDirection: "row", gap: 16, width: "100%" },
  modalCancel: { flex: 1, padding: 16, alignItems: "center" },
  modalCancelText: { color: "#888", fontWeight: "bold" },
  modalSubmit: {
    flex: 2,
    backgroundColor: "#FF9500",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  modalSubmitText: { color: "#000", fontWeight: "bold" },
});
