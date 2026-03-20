import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ptSlotRequest } from "@/api/ptSlot";
import dayjs from "dayjs";

export default function PtScheduleScreen({ navigation }: any) {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD"),
  );

  // API: Lấy danh sách slot thực tế trên Calendar
  const { data: calendarRes, isLoading } = useQuery({
    queryKey: ["ptCalendar", selectedDate],
    queryFn: () => ptSlotRequest.getCalendarSlots(selectedDate),
  });

  const slots = calendarRes?.data?.data || [];

  // API: Xóa một slot cụ thể
  const deleteSlotMutation = useMutation({
    mutationFn: (id: string) => ptSlotRequest.deleteCalendarSlot(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ptCalendar"] });
      Alert.alert("Thành công", "Đã xóa khung giờ này khỏi lịch.");
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Schedule</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("PtSetAvailability")}
        >
          <View style={styles.setupBtn}>
            <Ionicons name="settings-outline" size={18} color="#FF9500" />
            <Text style={styles.setupText}>Cài đặt lịch mẫu</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Calendar
          theme={calendarTheme}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: "#FF9500" },
          }}
        />

        <View style={styles.content}>
          <View style={styles.listHeader}>
            <Text style={styles.dateTitle}>
              {dayjs(selectedDate).format("DD MMMM, YYYY")}
            </Text>
            <Text style={styles.countText}>{slots.length} Slots</Text>
          </View>

          {isLoading ? (
            <ActivityIndicator color="#FF9500" style={{ marginTop: 20 }} />
          ) : slots.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={50} color="#333" />
              <Text style={styles.emptyText}>
                Không có lịch rảnh vào ngày này
              </Text>
            </View>
          ) : (
            slots.map((item: any) => (
              <View key={item.id} style={styles.slotCard}>
                <View style={styles.slotInfo}>
                  <Text style={styles.slotTime}>
                    {item.startTime.substring(0, 5)} -{" "}
                    {item.endTime.substring(0, 5)}
                  </Text>
                  <Text style={styles.slotPrice}>
                    {item.price.toLocaleString()}đ
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        item.status === "Available" ? "#4CD96420" : "#FF3B3020",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color:
                          item.status === "Available" ? "#4CD964" : "#FF3B30",
                      },
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => deleteSlotMutation.mutate(item.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const calendarTheme = {
  backgroundColor: "#121212",
  calendarBackground: "#121212",
  textSectionTitleColor: "#b6c1cd",
  selectedDayBackgroundColor: "#FF9500",
  todayTextColor: "#FF9500",
  dayTextColor: "#fff",
  monthTextColor: "#fff",
  arrowColor: "#FF9500",
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: { color: "#FFF", fontSize: 20, fontWeight: "bold" },
  setupBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    padding: 8,
    borderRadius: 8,
  },
  setupText: { color: "#FF9500", marginLeft: 6, fontSize: 12 },
  content: { padding: 20 },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dateTitle: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  countText: { color: "#888" },
  slotCard: {
    backgroundColor: "#1C1C1E",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  slotInfo: { flex: 1 },
  slotTime: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  slotPrice: { color: "#FF9500", fontSize: 14, marginTop: 4 },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 15,
  },
  statusText: { fontSize: 12, fontWeight: "bold" },
  emptyState: { alignItems: "center", marginTop: 40 },
  emptyText: { color: "#444", marginTop: 10 },
});
