import React, { useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useVerifyTopup } from "@/hooks/useTopup";
import { useAuthContext } from "@/context/AuthContext";

export default function PaymentResultScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  // 1. Lấy dữ liệu từ URL params (fitup://payment-result?code=...&status=...)
  const params = route.params || {};
  const { code, status, cancel, orderCode } = params;

  // 2. Gọi Hook để Backend xác thực và cập nhật số dư
  const queryString = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  const { isLoading } = useVerifyTopup(queryString);

  // 3. Phân loại trạng thái để hiển thị UI
  const isCancelled = cancel === "true" || status === "CANCELLED";
  const isSuccess = code === "00" && status === "PAID" && !isCancelled;
  const { userRole } = useAuthContext();
  const config = useMemo(() => {
    if (isSuccess)
      return {
        icon: "checkmark-circle",
        color: "#4CD964",
        title: "Nạp tiền thành công!",
        desc: "Điểm đã được cộng vào ví của Hàn.",
      };
    if (isCancelled)
      return {
        icon: "remove-circle",
        color: "#FF9500",
        title: "Đã hủy giao dịch",
        desc: "Yêu cầu nạp tiền đã được hủy bỏ theo ý bạn.",
      };
    return {
      icon: "close-circle",
      color: "#FF3B30",
      title: "Giao dịch thất bại",
      desc: "Có lỗi xảy ra. Vui lòng thử lại sau ít phút.",
    };
  }, [isSuccess, isCancelled]);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#FF9500" />
        <Text style={{ color: "#FFF", marginTop: 15 }}>
          Đang xác thực giao dịch...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Ionicons name={config.icon as any} size={100} color={config.color} />
        <Text style={[styles.title, { color: config.color }]}>
          {config.title}
        </Text>
        <Text style={styles.desc}>{config.desc}</Text>

        <View style={styles.orderInfo}>
          <Text style={styles.orderLabel}>
            Mã đơn hàng: <Text style={styles.orderValue}>#{orderCode}</Text>
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: config.color }]}
          onPress={() => {
            // 🎯 Phải khớp với name trong App.tsx của Hàn
            const targetNavigator = userRole === "PT" ? "PtMain" : "Main";

            navigation.navigate(targetNavigator, { screen: "Profile" });
          }}
        >
          <Text style={styles.btnText}>Quay lại trang cá nhân</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  loading: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  title: { fontSize: 24, fontWeight: "bold", marginTop: 20 },
  desc: {
    color: "#8F8F8F",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22,
  },
  orderInfo: {
    marginTop: 30,
    backgroundColor: "#1C1C1E",
    padding: 12,
    borderRadius: 10,
  },
  orderLabel: { color: "#666" },
  orderValue: { color: "#FFF", fontWeight: "bold" },
  footer: { padding: 20 },
  btn: {
    height: 55,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: { color: "#000", fontWeight: "bold", fontSize: 16 },
});
