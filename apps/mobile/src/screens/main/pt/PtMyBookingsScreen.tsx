import React from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { bookingRequest } from "@/api/booking";

export default function PtMyBookingsScreen({ navigation }: any) {
  // 1. Gọi API lấy lịch của PT
  const {
    data: res,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["pt-my-bookings"],
    queryFn: () => bookingRequest.getPtBookings(),
  });

  // 🛡️ Dựa trên JSON Hàn gửi: data nằm trong res.data.data
  const bookings = res?.data?.data || [];

  const renderItem = ({ item }: any) => {
    const isConfirmed = item.status === "Confirmed";

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          // 🚀 TRUYỀN DỮ LIỆU SANG CHI TIẾT
          navigation.navigate("PtBookingRequest", { bookingData: item });
        }}
      >
        <View style={styles.rowBetween}>
          <View style={styles.statusBadge}>
            <View
              style={[
                styles.dot,
                { backgroundColor: isConfirmed ? "#4CD964" : "#888" },
              ]}
            />
            <Text style={styles.statusText}>
              {item.status === "Confirmed" ? "Chờ tập" : "Đã xong"}
            </Text>
          </View>
          <Text style={styles.price}>{item.total.toLocaleString()}đ</Text>
        </View>

        <Text style={styles.customerName}>
          {item.ptName || "Học viên chưa cập nhật"}
        </Text>

        <View style={styles.timeInfo}>
          <Ionicons name="time-outline" size={14} color="#888" />
          <Text style={styles.timeText}>
            {dayjs(item.bookingDate).format("DD/MM/YYYY")} |{" "}
            {item.startTime.substring(0, 5)} - {item.endTime.substring(0, 5)}
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color="#333"
          style={styles.arrow}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lịch dạy của tôi</Text>
        <TouchableOpacity onPress={() => refetch()}>
          <Ionicons name="refresh" size={24} color="#FF9500" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator color="#FF9500" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Hàn chưa có yêu cầu đặt lịch nào.
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: { color: "#FFF", fontSize: 22, fontWeight: "bold" },
  card: {
    backgroundColor: "#1C1C1E",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: { color: "#FFF", fontSize: 12 },
  price: { color: "#FF9500", fontWeight: "bold", fontSize: 16 },
  customerName: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  timeInfo: { flexDirection: "row", alignItems: "center", gap: 6 },
  timeText: { color: "#888", fontSize: 14 },
  emptyText: { color: "#444", textAlign: "center", marginTop: 100 },
  arrow: { position: "absolute", right: 16, bottom: 20 },
});
