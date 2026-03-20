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
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingRequest } from "@/api/booking";
import dayjs from "dayjs";

export default function MyBookingsScreen({ navigation }: any) {
  const queryClient = useQueryClient();

  // State cho Modal Feedback
  const [isFeedbackVisible, setFeedbackVisible] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // 1. API: Lấy danh sách lịch đã đặt
  const {
    data: res,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: () => bookingRequest.getMyBookings(),
  });
  const bookings = res?.data?.data?.data || [];

  // 2. API: Hủy lịch tập (DELETE)
  const cancelMutation = useMutation({
    mutationFn: (id: string) => bookingRequest.cancelBooking(id),
    onSuccess: () => {
      Alert.alert("Thành công", "Đã hủy lịch tập.");
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["pt-available-slots"] }); // Hoàn lại slot cho PT
    },
    onError: () => Alert.alert("Lỗi", "Không thể hủy lịch lúc này."),
  });

  // 3. API: Gửi Feedback (POST)
  const feedbackMutation = useMutation({
    mutationFn: (body: any) => bookingRequest.sendFeedback(body),
    onSuccess: () => {
      Alert.alert("Cảm ơn", "Đánh giá của bạn đã được gửi đi!");
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

  const renderBookingItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.ptName}>{item.ptName}</Text>
          <Text style={styles.bookingId}>ID: #{item.id.substring(0, 8)}</Text>
        </View>
        <View
          style={[
            styles.statusTag,
            {
              backgroundColor:
                item.status === "Confirmed" ? "#4CD964" : "#2C2C2E",
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: item.status === "Confirmed" ? "#000" : "#888" },
            ]}
          >
            {item.status}
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
        <Text style={styles.priceLabel}>Tổng thanh toán:</Text>
        <Text style={styles.priceValue}>{item.total.toLocaleString()}đ</Text>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() =>
            Alert.alert("Xác nhận", "Bạn muốn hủy lịch tập này?", [
              { text: "Không" },
              {
                text: "Hủy lịch",
                onPress: () => cancelMutation.mutate(item.id),
                style: "destructive",
              },
            ])
          }
        >
          <Text style={styles.secondaryBtnText}>Hủy lịch</Text>
        </TouchableOpacity>

        {item.status === "Confirmed" && (
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => handleOpenFeedback(item.id)}
          >
            <Text style={styles.primaryBtnText}>Đánh giá</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch tập của tôi</Text>
        <TouchableOpacity onPress={() => refetch()}>
          <Ionicons name="refresh" size={22} color="#FF9500" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator color="#FF9500" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={renderBookingItem}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={60} color="#2C2C2E" />
              <Text style={styles.emptyText}>
                Bạn chưa có lịch tập nào được đặt.
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
            <Text style={styles.modalTitle}>Đánh giá buổi tập</Text>
            <Text style={styles.modalSub}>
              Trải nghiệm của bạn với huấn luyện viên thế nào?
            </Text>

            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <TouchableOpacity key={s} onPress={() => setRating(s)}>
                  <FontAwesome
                    name={s <= rating ? "star" : "star-o"}
                    size={40}
                    color="#FF9500"
                    style={{ marginHorizontal: 6 }}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Nhập cảm nhận của bạn..."
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
                <Text style={styles.modalCancelText}>Đóng</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSubmit}
                onPress={handleSubmitFeedback}
                disabled={feedbackMutation.isPending}
              >
                {feedbackMutation.isPending ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={styles.modalSubmitText}>Gửi ngay</Text>
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
    padding: 16,
  },
  headerTitle: { color: "#FFF", fontSize: 20, fontWeight: "bold" },
  card: {
    backgroundColor: "#1C1C1E",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  ptName: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  bookingId: { color: "#555", fontSize: 11, marginTop: 2 },
  statusTag: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: "bold" },
  divider: { height: 1, backgroundColor: "#2C2C2E", marginVertical: 15 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  infoValue: { color: "#AAA", fontSize: 14 },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    alignItems: "center",
  },
  priceLabel: { color: "#888", fontSize: 14 },
  priceValue: { color: "#FF9500", fontSize: 18, fontWeight: "bold" },
  actionRow: { flexDirection: "row", gap: 12, marginTop: 20 },
  primaryBtn: {
    flex: 1,
    backgroundColor: "#FF9500",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryBtnText: { color: "#000", fontWeight: "bold" },
  secondaryBtn: {
    flex: 1,
    backgroundColor: "transparent",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
  secondaryBtnText: { color: "#FF3B30", fontWeight: "bold" },
  emptyContainer: { flex: 1, alignItems: "center", marginTop: 100 },
  emptyText: { color: "#444", marginTop: 20 },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#1C1C1E",
    borderRadius: 25,
    padding: 25,
    alignItems: "center",
  },
  modalTitle: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalSub: { color: "#888", textAlign: "center", marginBottom: 25 },
  starRow: { flexDirection: "row", marginBottom: 25 },
  input: {
    width: "100%",
    backgroundColor: "#2C2C2E",
    color: "#FFF",
    borderRadius: 15,
    padding: 15,
    height: 100,
    textAlignVertical: "top",
    marginBottom: 25,
  },
  modalActions: { flexDirection: "row", gap: 15 },
  modalCancel: { flex: 1, padding: 15, alignItems: "center" },
  modalCancelText: { color: "#888", fontWeight: "bold" },
  modalSubmit: {
    flex: 2,
    backgroundColor: "#FF9500",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  modalSubmitText: { color: "#000", fontWeight: "bold" },
});
