import React from "react";
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
import { usePointAmount } from "@/hooks/usePointAmount";

type PremiumDetailParams = {
  premiumTypeId?: string;
  describe?: string;
  duration?: number;
  price?: number;
  discountPercent?: number;
  planSubtitle?: string;
  savingsNote?: string;
  features?: string[];
};

const DEFAULT_FEATURES = [
  "Tạo workout thông minh bằng AI",
  "AI check động tác và gợi ý sửa",
  "Theo dõi tiến độ nâng cao theo tuần",
];

export default function PremiumDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const queryClient = useQueryClient();

  const {
    premiumTypeId,
    describe,
    duration,
    price,
    discountPercent,
    planSubtitle,
    savingsNote,
    features,
  }: PremiumDetailParams = route.params || {};

  const featureList = features?.length ? features : DEFAULT_FEATURES;
  const finalPrice = Number(price || 0);
  const finalDuration = Number(duration || 0);
  const finalDiscount = Number(discountPercent || 0);

  const { data: pointAmount = 0 } = usePointAmount();

  const purchaseMutation = useMutation({
    mutationFn: () => premiumRequest.purchase({ premiumTypeId: premiumTypeId || "" }),
    onSuccess: (res) => {
      const msg = res.data?.data?.message || "Mua gói Premium thành công.";
      Alert.alert("Thành công", msg, [
        {
          text: "OK",
          onPress: () => {
            queryClient.invalidateQueries({ queryKey: ["premium-my-status"] });
            queryClient.invalidateQueries({ queryKey: ["point-amount"] });
            navigation.goBack();
          },
        },
      ]);
    },
    onError: (error) => handleErrorApi({ error }),
  });

  const handleConfirm = () => {
    if (!premiumTypeId) {
      Alert.alert("Lỗi", "Không tìm thấy gói Premium để thanh toán.");
      return;
    }

    if (pointAmount < finalPrice) {
      const neededAmount = finalPrice - pointAmount;
      Alert.alert(
        "Số dư không đủ",
        `Số điểm hiện tại (${pointAmount.toLocaleString()} Pts) không đủ. Bạn cần nạp thêm ít nhất ${neededAmount.toLocaleString()} Pts.`,
        [
          { text: "Hủy", style: "cancel" },
          {
            text: "Nạp thêm",
            onPress: () =>
              navigation.navigate("TopUpPoint", {
                suggestedAmount: neededAmount,
              }),
          },
        ],
      );
      return;
    }

    Alert.alert("Xác nhận thanh toán", "Bạn đồng ý mua gói Premium này chứ?", [
      { text: "Hủy", style: "cancel" },
      { text: "Đồng ý", onPress: () => purchaseMutation.mutate() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Xác nhận Premium</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <LinearGradient
          colors={["#FFB347", "#FF9500", "#D97706"]}
          style={styles.planCard}
        >
          {finalDiscount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>Giảm {finalDiscount}%</Text>
            </View>
          )}

          <Text style={styles.planName}>{describe || "Premium"}</Text>
          <Text style={styles.planMeta}>{finalDuration} ngày</Text>
          <Text style={styles.planPrice}>{finalPrice.toLocaleString()} Pts</Text>
          {!!planSubtitle && <Text style={styles.planSubtitle}>{planSubtitle}</Text>}
          {!!savingsNote && <Text style={styles.planSavings}>{savingsNote}</Text>}
        </LinearGradient>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Bạn nhận được gì</Text>
          <Text style={styles.sectionSubTitle}>
            Toàn bộ quyền lợi dưới đây sẽ được mở ngay sau khi thanh toán thành công.
          </Text>
          {featureList.map((feature) => (
            <View key={feature} style={styles.row}>
              <Ionicons name="checkmark" size={18} color="#FF9500" />
              <Text style={styles.rowText}>{feature}</Text>
            </View>
          ))}
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Số dư hiện tại</Text>
          <Text style={styles.balanceValue}>{pointAmount.toLocaleString()} Pts</Text>
        </View>

        <TouchableOpacity
          style={[styles.confirmBtn, purchaseMutation.isPending && { opacity: 0.6 }]}
          disabled={purchaseMutation.isPending}
          onPress={handleConfirm}
        >
          {purchaseMutation.isPending ? (
            <ActivityIndicator color="#111" />
          ) : (
            <Text style={styles.confirmBtnText}>Xác nhận</Text>
          )}
        </TouchableOpacity>
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
  headerTitle: { color: "#FFF", fontSize: 18, fontWeight: "800" },
  content: { padding: 20, paddingBottom: 40 },

  planCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    position: "relative",
    overflow: "hidden",
  },
  discountBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#FF6D2D",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  discountText: { color: "#FFF", fontSize: 11, fontWeight: "800" },
  planName: { color: "#111", fontSize: 24, fontWeight: "900" },
  planMeta: { color: "#222", marginTop: 4, fontWeight: "700" },
  planPrice: { color: "#111", marginTop: 12, fontSize: 22, fontWeight: "900" },
  planSubtitle: {
    color: "#1F1F1F",
    marginTop: 8,
    lineHeight: 20,
    fontWeight: "600",
  },
  planSavings: {
    color: "#3B1D00",
    marginTop: 6,
    fontWeight: "800",
  },

  infoCard: {
    backgroundColor: "#1C1C1E",
    borderWidth: 1,
    borderColor: "#2C2C2E",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 6,
  },
  sectionSubTitle: {
    color: "#AFAFAF",
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },
  row: { flexDirection: "row", alignItems: "flex-start", marginBottom: 10 },
  rowText: { color: "#D0D0D0", marginLeft: 8, flex: 1, lineHeight: 20 },

  balanceCard: {
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#2B2B2B",
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
  },
  balanceLabel: { color: "#A3A3A3", fontSize: 13 },
  balanceValue: { color: "#FF9500", fontSize: 18, fontWeight: "900", marginTop: 4 },

  confirmBtn: {
    backgroundColor: "#FF9500",
    borderRadius: 14,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmBtnText: { color: "#111", fontWeight: "900", fontSize: 16 },
});
