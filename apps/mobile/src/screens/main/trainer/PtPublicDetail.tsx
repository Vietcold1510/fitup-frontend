import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { ptPublicRequest } from "@/api/pt";
import { bookingRequest } from "@/api/booking";
import { usePointAmount } from "@/hooks/usePointAmount"; // 👈 Hook lấy số dư của Hàn

export default function PtPublicDetail({ navigation, route }: any) {
  const { ptId } = route.params || {};
  const queryClient = useQueryClient();

  // 1. STATE QUẢN LÝ
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD"),
  );
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [note, setNote] = useState("");

  const START_DATE = dayjs().format("YYYY-MM-DD");
  const END_DATE = dayjs().add(30, "day").format("YYYY-MM-DD");

  // 2. DATA: LẤY SỐ DƯ ĐIỂM HIỆN TẠI
  const { data: pointAmount = 0 } = usePointAmount();

  // 3. API: LẤY THÔNG TIN PT & SLOTS
  const { data: ptRes, isLoading: isPtLoading } = useQuery({
    queryKey: ["pt-detail", ptId],
    queryFn: () => ptPublicRequest.getPtById(ptId),
    enabled: !!ptId,
  });
  const ptData = ptRes?.data?.data;

  const { data: slotsRes, isLoading: isSlotsLoading } = useQuery({
    queryKey: ["pt-available-slots", ptId, START_DATE, END_DATE],
    queryFn: () =>
      ptPublicRequest.getAvailableSlots(ptId, START_DATE, END_DATE),
    enabled: !!ptId,
  });

  const allAvailableSlots = useMemo(() => {
    const rawData =
      slotsRes?.data?.data?.data ||
      slotsRes?.data?.data ||
      slotsRes?.data ||
      [];
    return Array.isArray(rawData) ? rawData : [];
  }, [slotsRes]);

  const markedDates = useMemo(() => {
    const marks: any = {};
    if (!Array.isArray(allAvailableSlots)) return marks;
    allAvailableSlots.forEach((slot: any) => {
      if (slot?.bookingDate) {
        marks[slot.bookingDate] = { marked: true, dotColor: "#FF9500" };
      }
    });
    marks[selectedDate] = {
      ...marks[selectedDate],
      selected: true,
      selectedColor: "#FF9500",
      selectedTextColor: "#000",
    };
    return marks;
  }, [allAvailableSlots, selectedDate]);

  const dailySlots = useMemo(() => {
    if (!allAvailableSlots || !Array.isArray(allAvailableSlots)) return [];
    return allAvailableSlots.filter(
      (s: any) => s && s.bookingDate === selectedDate,
    );
  }, [allAvailableSlots, selectedDate]);

  // 4. MUTATION: ĐẶT LỊCH
  const bookMutation = useMutation({
    mutationFn: bookingRequest.bookSlot,
    onSuccess: (res) => {
      if (res.status === 200 || res.data?.status === 200) {
        Alert.alert("Thành công", "Yêu cầu đặt lịch đã được gửi!", [
          {
            text: "Xem lịch",
            onPress: () => navigation.navigate("MyBookings"),
          },
        ]);
        queryClient.invalidateQueries({ queryKey: ["pt-available-slots"] });
        queryClient.invalidateQueries({ queryKey: ["point-amount"] }); // Reset số dư
      }
    },
    onError: (err: any) => {
      Alert.alert("Lỗi", err.response?.data?.msg || "Không thể đặt lịch.");
    },
  });

  // 5. LOGIC KIỂM TRA SỐ DƯ TRƯỚC KHI ĐẶT
  const handleBookingPress = () => {
    if (!selectedSlot) return;

    // Kiểm tra số dư
    const neededAmount = selectedSlot.price - pointAmount;
    if (pointAmount < selectedSlot.price) {
      Alert.alert(
        "Số dư không đủ",
        `Số điểm hiện tại (${pointAmount.toLocaleString()}p) không đủ. Bạn cần nạp thêm ít nhất ${(selectedSlot.price - pointAmount).toLocaleString()}p.`,
        [
          { text: "Để sau", style: "cancel" },
          {
            text: "Nạp thêm",
            onPress: () =>
              navigation.navigate("TopUpPoint", {
                suggestedAmount: neededAmount, // 🚀 Truyền số tiền cần nạp sang
              }),
          },
        ],
      );
      return;
    }

    // Nếu đủ điểm -> Xác nhận cuối
    Alert.alert(
      "Xác nhận đặt lịch",
      "Bạn đồng ý thanh toán cho buổi tập này chứ?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đồng ý",
          onPress: () =>
            bookMutation.mutate({ slotForBookingId: selectedSlot.id, note }),
        },
      ],
    );
  };

  if (!ptId)
    return (
      <View style={styles.center}>
        <Text style={{ color: "#FFF" }}>Không tìm thấy PT</Text>
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navHeader}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Đặt lịch tập</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {isPtLoading ? (
          <ActivityIndicator color="#FF9500" style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.profileBox}>
            <Image
              source={{
                uri:
                  ptData?.avatarUrl ||
                  `https://ui-avatars.com/api/?name=${ptData?.displayName}&background=FF9500&color=fff`,
              }}
              style={styles.avatar}
            />
            <Text style={styles.name}>{ptData?.displayName}</Text>
            <Text style={styles.bio} numberOfLines={2}>
              {ptData?.bio || "Huấn luyện viên chuyên nghiệp tại FitUp"}
            </Text>
          </View>
        )}

        <View style={styles.calendarCard}>
          <Calendar
            theme={calendarTheme}
            minDate={START_DATE}
            maxDate={END_DATE}
            onDayPress={(day) => {
              setSelectedDate(day.dateString);
              setSelectedSlot(null);
            }}
            markedDates={markedDates}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Giờ tập trống</Text>
            <Text style={styles.dateLabel}>
              {dayjs(selectedDate).format("DD/MM/YYYY")}
            </Text>
          </View>

          {isSlotsLoading ? (
            <ActivityIndicator color="#FF9500" />
          ) : (
            <View style={styles.slotGrid}>
              {dailySlots.length > 0 ? (
                dailySlots.map((slot: any) => (
                  <TouchableOpacity
                    key={slot.id}
                    style={[
                      styles.slotBtn,
                      selectedSlot?.id === slot.id && styles.slotBtnActive,
                    ]}
                    onPress={() => setSelectedSlot(slot)}
                  >
                    <Text
                      style={[
                        styles.slotTime,
                        selectedSlot?.id === slot.id && { color: "#000" },
                      ]}
                    >
                      {slot.startTime.substring(0, 5)}
                    </Text>
                    <Text
                      style={[
                        styles.slotPrice,
                        selectedSlot?.id === slot.id && { color: "#000" },
                      ]}
                    >
                      {slot.price?.toLocaleString()}đ
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyBox}>
                  <Ionicons name="calendar-outline" size={40} color="#333" />
                  <Text style={styles.emptyText}>
                    Ngày này PT không có lịch trống rồi Hàn ơi!
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ghi chú cho PT</Text>
          <TextInput
            style={styles.input}
            placeholder="Ví dụ: Tôi muốn tập trung vào nhóm cơ chân..."
            placeholderTextColor="#555"
            multiline
            value={note}
            onChangeText={setNote}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.bookBtn,
            !selectedSlot && { opacity: 0.5, backgroundColor: "#333" },
          ]}
          onPress={handleBookingPress}
          disabled={bookMutation.isPending || !selectedSlot}
        >
          {bookMutation.isPending ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text
              style={[styles.bookBtnText, !selectedSlot && { color: "#888" }]}
            >
              {selectedSlot
                ? `ĐẶT LỊCH LÚC ${selectedSlot.startTime.substring(0, 5)}`
                : "VUI LÒNG CHỌN GIỜ"}
            </Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const calendarTheme = {
  backgroundColor: "#1C1C1E",
  calendarBackground: "#1C1C1E",
  textSectionTitleColor: "#888",
  selectedDayBackgroundColor: "#FF9500",
  selectedDayTextColor: "#000",
  todayTextColor: "#FF9500",
  dayTextColor: "#FFF",
  textDisabledColor: "#444",
  dotColor: "#FF9500",
  selectedDotColor: "#000",
  monthTextColor: "#FFF",
  indicatorColor: "#FF9500",
  arrowColor: "#FF9500",
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  navHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
  },
  backBtn: { padding: 5 },
  navTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  profileBox: {
    alignItems: "center",
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#FF9500",
  },
  name: { color: "#FFF", fontSize: 24, fontWeight: "bold" },
  bio: {
    color: "#AAA",
    textAlign: "center",
    marginTop: 5,
    fontSize: 14,
    lineHeight: 20,
  },
  calendarCard: {
    margin: 16,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#1C1C1E",
    elevation: 5,
  },
  section: { paddingHorizontal: 20, marginTop: 20 },
  sectionTitle: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  dateLabel: { color: "#FF9500", fontWeight: "600" },
  slotGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  slotBtn: {
    width: "31%",
    backgroundColor: "#1C1C1E",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  slotBtnActive: { backgroundColor: "#FF9500", borderColor: "#FF9500" },
  slotTime: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  slotPrice: { color: "#FF9500", fontSize: 11, marginTop: 4 },
  emptyBox: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#1C1C1E",
    borderRadius: 20,
  },
  emptyText: {
    color: "#666",
    marginTop: 10,
    textAlign: "center",
    fontSize: 13,
  },
  input: {
    backgroundColor: "#1C1C1E",
    color: "#FFF",
    padding: 15,
    borderRadius: 16,
    height: 100,
    textAlignVertical: "top",
    marginTop: 10,
    fontSize: 15,
  },
  bookBtn: {
    backgroundColor: "#FF9500",
    margin: 20,
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#FF9500",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  bookBtnText: {
    color: "#000",
    fontWeight: "900",
    fontSize: 16,
    letterSpacing: 1,
  },
});
