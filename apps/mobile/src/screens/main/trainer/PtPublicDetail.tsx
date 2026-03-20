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

export default function PtPublicDetail({ navigation, route }: any) {
  const { ptId } = route.params || {};
  const queryClient = useQueryClient();

  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD"),
  );
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [note, setNote] = useState("");

  // 1. API: Lấy thông tin PT
  const { data: ptRes, isLoading: isPtLoading } = useQuery({
    queryKey: ["pt-detail", ptId],
    queryFn: () => ptPublicRequest.getPtById(ptId),
    enabled: !!ptId,
  });
  const ptData = ptRes?.data?.data;

  // 2. API: Lấy Slot rảnh
  const { data: slotsRes, isLoading: isSlotsLoading } = useQuery({
    queryKey: ["pt-available-slots", ptId],
    queryFn: () =>
      ptPublicRequest.getAvailableSlots(ptId, dayjs().format("YYYY-MM-DD")),
    enabled: !!ptId,
  });
  const allSlots = slotsRes?.data?.data?.data || [];

  // 3. Mutation: Đặt lịch
  const bookMutation = useMutation({
    mutationFn: bookingRequest.bookSlot,
    onSuccess: (res) => {
      if (res.data?.status === 200) {
        Alert.alert("Thành công", "Đã gửi yêu cầu đặt lịch!", [
          {
            text: "Xem lịch của tôi",
            onPress: () => navigation.navigate("MyBookings"),
          },
        ]);
        queryClient.invalidateQueries({ queryKey: ["pt-available-slots"] });
      }
    },
    onError: () => Alert.alert("Lỗi", "Không thể đặt lịch lúc này."),
  });

  const markedDates = useMemo(() => {
    const marks: any = {};
    allSlots.forEach((s: any) => {
      marks[s.bookingDate] = { marked: true, dotColor: "#FF9500" };
    });
    marks[selectedDate] = {
      ...marks[selectedDate],
      selected: true,
      selectedColor: "#FF9500",
    };
    return marks;
  }, [allSlots, selectedDate]);

  const dailySlots = allSlots.filter(
    (s: any) => s.bookingDate === selectedDate,
  );

  if (!ptId)
    return (
      <View style={styles.center}>
        <Text style={{ color: "#FFF" }}>Thiếu ID PT</Text>
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER NAV */}
      <View style={styles.navHeader}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Chi tiết PT</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView>
        <View style={styles.profileBox}>
          <Image
            source={{
              uri: `https://ui-avatars.com/api/?name=${ptData?.displayName}&background=FF9500`,
            }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{ptData?.displayName}</Text>
          <Text style={styles.bio}>{ptData?.bio || "Chưa có giới thiệu"}</Text>
        </View>

        <View style={styles.calendarCard}>
          <Calendar
            theme={calendarTheme}
            onDayPress={(day) => {
              setSelectedDate(day.dateString);
              setSelectedSlot(null);
            }}
            markedDates={markedDates}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chọn giờ tập</Text>
          <View style={styles.slotGrid}>
            {dailySlots.map((slot: any) => (
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
                  {slot.price.toLocaleString()}đ
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ghi chú</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhắn nhủ tới PT..."
            placeholderTextColor="#444"
            value={note}
            onChangeText={setNote}
          />
        </View>

        <TouchableOpacity
          style={[styles.bookBtn, !selectedSlot && { opacity: 0.5 }]}
          onPress={() =>
            selectedSlot &&
            bookMutation.mutate({ slotForBookingId: selectedSlot.id, note })
          }
          disabled={bookMutation.isPending || !selectedSlot}
        >
          {bookMutation.isPending ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.bookBtnText}>XÁC NHẬN ĐẶT LỊCH</Text>
          )}
        </TouchableOpacity>
        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const calendarTheme = {
  backgroundColor: "#1C1C1E",
  calendarBackground: "#1C1C1E",
  dayTextColor: "#FFF",
  monthTextColor: "#FFF",
  arrowColor: "#FF9500",
  todayTextColor: "#FF9500",
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
  navTitle: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  profileBox: { alignItems: "center", marginVertical: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
  name: { color: "#FFF", fontSize: 22, fontWeight: "bold" },
  bio: { color: "#888", fontStyle: "italic" },
  calendarCard: { margin: 16, borderRadius: 15, overflow: "hidden" },
  section: { paddingHorizontal: 20, marginTop: 10 },
  sectionTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  slotGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  slotBtn: {
    width: "30%",
    backgroundColor: "#1C1C1E",
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  slotBtnActive: { backgroundColor: "#FF9500", borderColor: "#FF9500" },
  slotTime: { color: "#FFF", fontWeight: "bold" },
  slotPrice: { color: "#FF9500", fontSize: 10 },
  input: {
    backgroundColor: "#1C1C1E",
    color: "#FFF",
    padding: 15,
    borderRadius: 12,
    height: 80,
  },
  bookBtn: {
    backgroundColor: "#FF9500",
    margin: 20,
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
  },
  bookBtnText: { color: "#000", fontWeight: "bold" },
});
