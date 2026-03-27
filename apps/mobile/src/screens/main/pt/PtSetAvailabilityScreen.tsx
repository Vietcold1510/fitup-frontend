import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ptSlotRequest } from "@/api/ptSlot";

// Định nghĩa mảng Thứ: 0 = Chủ Nhật, 1-6 = Thứ 2-7
const DAYS = [
  { label: "CN", value: 0 },
  { label: "T2", value: 1 },
  { label: "T3", value: 2 },
  { label: "T4", value: 3 },
  { label: "T5", value: 4 },
  { label: "T6", value: 5 },
  { label: "T7", value: 6 },
];

export default function PtSetAvailabilityScreen({ navigation }: any) {
  const queryClient = useQueryClient();

  // State quản lý việc Sửa hay Thêm
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    slotStart: "08:00",
    slotEnd: "09:00",
    dateInWeek: 1, // Mặc định Thứ 2
    price: 60000,
  });

  // 1. Lấy danh sách lịch mẫu
  const { data: templatesRes, isLoading: isFetching } = useQuery({
    queryKey: ["ptTemplates"],
    queryFn: ptSlotRequest.getSlotTemplates,
  });

  // 2. Mutation Thêm mới
  const createMutation = useMutation({
    mutationFn: ptSlotRequest.createSlotTemplate,
    onSuccess: () => {
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["ptTemplates"] });
      Alert.alert("Thành công", "Đã tạo lịch mới cho 4 tuần tới.");
    },
  });

  // 3. Mutation Cập nhật (PUT)
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      ptSlotRequest.updateSlotTemplate(id, data),
    onSuccess: () => {
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["ptTemplates"] });
      Alert.alert("Thành công", "Đã cập nhật lịch mẫu.");
    },
  });

  // 4. Mutation Xóa lịch mẫu
  const deleteMutation = useMutation({
    mutationFn: (id: string) => ptSlotRequest.deleteSlotTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ptTemplates"] });
      // Nếu xóa đúng cái đang sửa thì reset form
      resetForm();
      Alert.alert("Thành công", "Đã xóa lịch mẫu này.");
    },
    onError: () => Alert.alert("Lỗi", "Không thể xóa lịch mẫu lúc này."),
  });

  // Hàm xác nhận trước khi xóa (UX tốt hơn)
  const confirmDelete = (id: string) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa lịch định kỳ này không? Hành động này không thể hoàn tác.",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => deleteMutation.mutate(id),
        },
      ],
    );
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      slotStart: "08:00",
      slotEnd: "09:00",
      dateInWeek: 1,
      price: 60000,
    });
  };

  const handleEditPress = (item: any) => {
    setEditingId(item.id);
    setForm({
      slotStart: item.slotStart.substring(0, 5),
      slotEnd: item.slotEnd.substring(0, 5),
      dateInWeek: item.dateInWeek,
      price: item.price,
    });
  };

  const handleSave = () => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {editingId ? "Chỉnh sửa khung giờ" : "Cài đặt lịch mẫu"}
        </Text>
        {editingId ? (
          <TouchableOpacity onPress={resetForm}>
            <Text style={{ color: "#FF3B30", fontWeight: "bold" }}>Hủy</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24 }} />
        )}
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* FORM NHẬP LIỆU */}
        <View style={[styles.card, editingId && styles.cardHighlight]}>
          <Text style={styles.label}>Ngày trong tuần (0-6)</Text>
          <View style={styles.daysRow}>
            {DAYS.map((day) => (
              <TouchableOpacity
                key={day.value}
                style={[
                  styles.dayBtn,
                  form.dateInWeek === day.value && styles.dayBtnActive,
                ]}
                onPress={() => setForm({ ...form, dateInWeek: day.value })}
              >
                <Text
                  style={[
                    styles.dayText,
                    form.dateInWeek === day.value && styles.dayTextActive,
                  ]}
                >
                  {day.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.label}>Bắt đầu</Text>
              <TextInput
                style={styles.input}
                value={form.slotStart}
                onChangeText={(v) => setForm({ ...form, slotStart: v })}
                placeholder="08:00"
                placeholderTextColor="#444"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Kết thúc</Text>
              <TextInput
                style={styles.input}
                value={form.slotEnd}
                onChangeText={(v) => setForm({ ...form, slotEnd: v })}
                placeholder="09:00"
                placeholderTextColor="#444"
              />
            </View>
          </View>

          <Text style={styles.label}>Giá tiền mỗi buổi (đ)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={form.price.toString()}
            onChangeText={(v) => setForm({ ...form, price: Number(v) || 0 })}
          />

          <TouchableOpacity
            style={[
              styles.submitBtn,
              editingId && { backgroundColor: "#5856D6" },
            ]}
            onPress={handleSave}
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.submitText}>
                {editingId ? "LƯU THAY ĐỔI" : "THÊM LỊCH MẪU"}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* DANH SÁCH LỊCH MẪU HIỆN TẠI */}
        <Text style={styles.sectionTitle}>Danh sách lịch định kỳ</Text>
        {isFetching ? (
          <ActivityIndicator color="#FF9500" />
        ) : (
          templatesRes?.data?.data?.map((item: any) => (
            <View key={item.id} style={styles.templateItem}>
              <View>
                <Text style={styles.tempDay}>
                  {DAYS.find((d) => d.value === item.dateInWeek)?.label} hàng
                  tuần
                </Text>
                <Text style={styles.tempTime}>
                  {item.slotStart.substring(0, 5)} -{" "}
                  {item.slotEnd.substring(0, 5)}
                </Text>
              </View>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 20 }}
              >
                <Text style={styles.tempPrice}>
                  {item.price.toLocaleString()}đ
                </Text>

                {/* NÚT SỬA */}
                <TouchableOpacity onPress={() => handleEditPress(item)}>
                  <Ionicons name="create-outline" size={22} color="#FF9500" />
                </TouchableOpacity>

                {/* NÚT XÓA - MỚI THÊM */}
                <TouchableOpacity
                  onPress={() => confirmDelete(item.id)}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending &&
                  deleteMutation.variables === item.id ? (
                    <ActivityIndicator size="small" color="#FF3B30" />
                  ) : (
                    <Ionicons name="trash-outline" size={22} color="#FF3B30" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
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
  headerTitle: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  card: { backgroundColor: "#1C1C1E", padding: 20, borderRadius: 16 },
  cardHighlight: { borderWidth: 1, borderColor: "#5856D6" },
  label: { color: "#888", marginBottom: 8, fontSize: 12 },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dayBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2C2C2E",
    justifyContent: "center",
    alignItems: "center",
  },
  dayBtnActive: { backgroundColor: "#FF9500" },
  dayText: { color: "#888", fontSize: 12, fontWeight: "bold" },
  dayTextActive: { color: "#000" },
  row: { flexDirection: "row" },
  input: {
    backgroundColor: "#2C2C2E",
    color: "#FFF",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  submitBtn: {
    backgroundColor: "#FF9500",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  submitText: { color: "#000", fontWeight: "bold", fontSize: 16 },
  sectionTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 15,
  },
  templateItem: {
    backgroundColor: "#1C1C1E",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  tempDay: { color: "#888", fontSize: 12 },
  tempTime: { color: "#FFF", fontSize: 17, fontWeight: "bold" },
  tempPrice: { color: "#FF9500", fontWeight: "bold" },
});
