import React from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTopupHistory } from "@/hooks/useTopup";

const { width } = Dimensions.get("window");

// 1. Định nghĩa kiểu dữ liệu để "khóa" lỗi paymentId
interface TopupTransaction {
  paymentId: string;
  amount: number;
  status: number;
  orderCode: number;
  checkoutUrl: string;
  createdAt: string;
}

// 2. Helper mapping trạng thái giao dịch
const getStatusConfig = (status: number) => {
  switch (status) {
    case 1:
      return {
        label: "Thành công",
        color: "#4CD964",
        icon: "checkmark-circle",
      };
    case 0:
      return { label: "Chờ thanh toán", color: "#FF9500", icon: "time" };
    case 2:
      return { label: "Đã hủy", color: "#8F8F8F", icon: "close-circle" };
    case 3:
      return { label: "Hết hạn", color: "#FF3B30", icon: "alert-circle" };
    default:
      return { label: "Không xác định", color: "#FFF", icon: "help-circle" };
  }
};

export default function TopUpHistoryScreen() {
  const navigation = useNavigation<any>();

  // 3. Ép kiểu dữ liệu trả về từ Hook
  const { data, isLoading, refetch } = useTopupHistory() as {
    data: TopupTransaction[] | undefined;
    isLoading: boolean;
    refetch: () => void;
  };

  // 4. Hàm vẽ từng dòng giao dịch (Tách riêng cho sạch)
  const renderTransaction = ({ item }: { item: TopupTransaction }) => {
    const config = getStatusConfig(item.status);
    const date = new Date(item.createdAt).toLocaleDateString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    });

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: config.color + "20" },
            ]}
          >
            <Ionicons
              name={config.icon as any}
              size={14}
              color={config.color}
            />
            <Text style={[styles.statusText, { color: config.color }]}>
              {config.label}
            </Text>
          </View>
          <Text style={styles.orderCode}>#{item.orderCode}</Text>
        </View>

        <View style={styles.cardBody}>
          <View>
            <Text style={styles.amountText}>
              +{item.amount.toLocaleString()} VNĐ
            </Text>
            <Text style={styles.dateText}>{date}</Text>
          </View>

          {item.status === 0 && item.checkoutUrl && (
            <TouchableOpacity
              style={styles.payBtn}
              onPress={() =>
                navigation.navigate("PaymentWebView", {
                  checkoutUrl: item.checkoutUrl,
                })
              }
            >
              <Text style={styles.payBtnText}>Nạp ngay</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch sử nạp điểm</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Danh sách */}
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FF9500" />
        </View>
      ) : (
        <FlatList
          data={data || []}
          keyExtractor={(item) => item.paymentId}
          renderItem={renderTransaction}
          contentContainerStyle={styles.listContent}
          onRefresh={refetch}
          refreshing={isLoading}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>Bạn chưa có giao dịch nào!</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    height: 60,
  },
  headerTitle: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  backBtn: { padding: 5 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  listContent: { padding: 20 },
  card: {
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#2C2C2E",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: { fontSize: 11, fontWeight: "bold", marginLeft: 4 },
  orderCode: { color: "#666", fontSize: 12 },
  cardBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  amountText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  dateText: { color: "#666", fontSize: 12, marginTop: 4 },
  payBtn: {
    backgroundColor: "#FF9500",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  payBtnText: { color: "#121212", fontWeight: "bold", fontSize: 12 },
  emptyText: { color: "#444", fontSize: 16, marginTop: 20 },
});
