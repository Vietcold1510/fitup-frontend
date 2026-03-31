import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigation, useRoute } from "@react-navigation/native";
import { premiumRequest } from "@/api/premium";
import { handleErrorApi } from "@/lib/errors";

export default function PremiumDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const queryClient = useQueryClient();
  const [showConfirmStep, setShowConfirmStep] = useState(false);

  const { premiumTypeId, describe, duration, price } = route.params || {};

  const purchaseMutation = useMutation({
    mutationFn: () => premiumRequest.purchase({ premiumTypeId }),
    onSuccess: (res) => {
      const msg = res.data?.data?.message || "Mua gói premium thành công.";
      Alert.alert("Thành công", msg, [
        {
          text: "OK",
          onPress: () => {
            queryClient.invalidateQueries({ queryKey: ["premium-my-status"] });
            navigation.goBack();
          },
        },
      ]);
    },
    onError: (error) => handleErrorApi({ error }),
  });

  const handleFinalConfirm = () => {
    Alert.alert(
      "Xác nhận thanh toán",
      "Bạn đồng ý mua gói Premium này chứ?",
      [
        { text: "Hủy", style: "cancel" },
        { text: "Đồng ý", onPress: () => purchaseMutation.mutate() },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết Premium</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <LinearGradient
          colors={["#FFB347", "#FF9500", "#D97706"]}
          style={styles.planCard}
        >
          <Text style={styles.planName}>{describe || "Premium Plan"}</Text>
          <Text style={styles.planMeta}>{duration || 0} ngày</Text>
          <Text style={styles.planPrice}>
            {(price || 0).toLocaleString()}đ
          </Text>
        </LinearGradient>

        <View style={styles.featureCard}>
          <Text style={styles.sectionTitle}>Chức năng nổi bật</Text>
          <View style={styles.row}>
            <Ionicons name="sparkles-outline" size={20} color="#FF9500" />
            <Text style={styles.rowText}>
              Tạo workout một cách thông minh dựa trên mục tiêu cá nhân.
            </Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="body-outline" size={20} color="#FF9500" />
            <Text style={styles.rowText}>
              Sử dụng AI để check động tác và gợi ý sửa kỹ thuật.
            </Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="trending-up-outline" size={20} color="#FF9500" />
            <Text style={styles.rowText}>
              Phân tích tiến độ tập luyện nâng cao theo thời gian.
            </Text>
          </View>
        </View>

        {!showConfirmStep ? (
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => setShowConfirmStep(true)}
          >
            <Text style={styles.primaryText}>Tiếp tục mua gói</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.confirmWrap}>
            <Text style={styles.confirmText}>
              Bạn sắp thanh toán gói này. Vui lòng xác nhận lần cuối.
            </Text>
            <TouchableOpacity
              style={[
                styles.confirmBtn,
                purchaseMutation.isPending && { opacity: 0.6 },
              ]}
              disabled={purchaseMutation.isPending}
              onPress={handleFinalConfirm}
            >
              {purchaseMutation.isPending ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.confirmBtnText}>Confirm mua Premium</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  content: { padding: 20, paddingBottom: 40 },
  planCard: { borderRadius: 20, padding: 18, marginBottom: 16 },
  planName: { color: "#111", fontSize: 24, fontWeight: "900" },
  planMeta: { color: "#222", marginTop: 4, fontWeight: "700" },
  planPrice: { color: "#111", marginTop: 12, fontSize: 22, fontWeight: "900" },
  featureCard: {
    backgroundColor: "#1C1C1E",
    borderWidth: 1,
    borderColor: "#2C2C2E",
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
  },
  sectionTitle: { color: "#FFF", fontSize: 17, fontWeight: "bold", marginBottom: 10 },
  row: { flexDirection: "row", alignItems: "flex-start", marginBottom: 10 },
  rowText: { color: "#D0D0D0", marginLeft: 8, flex: 1, lineHeight: 20 },
  primaryBtn: {
    backgroundColor: "#FF9500",
    borderRadius: 14,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryText: { color: "#111", fontWeight: "900", fontSize: 16 },
  confirmWrap: {
    backgroundColor: "#2B1A12",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#5A2F1F",
    padding: 14,
  },
  confirmText: { color: "#FFD5C4", marginBottom: 10, lineHeight: 20 },
  confirmBtn: {
    backgroundColor: "#D64545",
    borderRadius: 12,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmBtnText: { color: "#FFF", fontWeight: "bold" },
});

