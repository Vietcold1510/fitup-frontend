import React, { useState, useMemo, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useConversionRates, useCreateTopup } from "@/hooks/useTopup";
import { usePointAmount } from "@/hooks/usePointAmount";

const { width } = Dimensions.get("window");
const PRESET_AMOUNTS = [10000, 20000, 50000, 100000, 200000, 500000];

export default function TopUpPointScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // 1. Khai báo State & Params
  const { suggestedAmount } = route.params || {};
  const [amount, setAmount] = useState<string>(
    suggestedAmount ? suggestedAmount.toString() : "",
  );

  const { data: pointAmount = 0 } = usePointAmount();
  const { data: rates, isLoading: isLoadingRates } = useConversionRates();
  const createTopupMutation = useCreateTopup();

  // 2. Logic useEffect (Cập nhật khi suggestedAmount thay đổi)
  useEffect(() => {
    if (suggestedAmount) {
      setAmount(suggestedAmount.toString());
    }
  }, [suggestedAmount]);

  // 3. Logic useMemo (Sắp xếp đúng thứ tự để không lỗi)
  const topupRate = useMemo(
    () => rates?.find((r: any) => r.type === 1),
    [rates],
  );

  const calculatedPoints = useMemo(() => {
    const numAmount = parseInt(amount) || 0;
    return Math.floor(numAmount / (topupRate?.rate || 1));
  }, [amount, topupRate]);

  const totalAfterTopup = useMemo(() => {
    return pointAmount + calculatedPoints;
  }, [pointAmount, calculatedPoints]);

  // 4. Hàm xử lý nạp tiền
  const handleTopUp = async () => {
    const numAmount = parseInt(amount);
    if (!numAmount || numAmount < 1000) {
      Alert.alert("Thông báo", "Số tiền nạp tối thiểu là 1.000 VNĐ");
      return;
    }

    try {
      const appScheme = "fitup://payment-result";
      const res = await createTopupMutation.mutateAsync({
        amountVnd: numAmount,
        conversionRateId: topupRate?.id,
        returnUrl: appScheme,
        cancelUrl: appScheme,
      } as any);

      const checkoutUrl = res.data.data.checkoutUrl;
      if (checkoutUrl) {
        navigation.navigate("PaymentWebView", { checkoutUrl: checkoutUrl });
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tạo liên kết thanh toán. Thử lại sau!");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nạp điểm</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Số dư hiện tại</Text>
          <Text style={styles.balanceValue}>
            {pointAmount.toLocaleString()}P
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Nhập số tiền muốn nạp</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="0"
            placeholderTextColor="#444"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <Text style={styles.currency}>VNĐ</Text>
        </View>

        <View style={styles.presetGrid}>
          {PRESET_AMOUNTS.map((val) => (
            <TouchableOpacity
              key={val}
              style={[
                styles.presetItem,
                amount === val.toString() && styles.activePreset,
              ]}
              onPress={() => setAmount(val.toString())}
            >
              <Text style={styles.presetText}>{val / 1000}k</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Hiển thị Tổng cộng */}
        {parseInt(amount) > 0 && (
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.infoText}>Số điểm nạp thêm:</Text>
              <Text style={styles.infoValue}>
                + {calculatedPoints.toLocaleString()}P
              </Text>
            </View>

            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Tổng điểm sau nạp:</Text>
              <Text style={styles.totalValue}>
                {totalAfterTopup.toLocaleString()}P
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.payBtn, !amount && styles.disabledBtn]}
          onPress={handleTopUp}
          disabled={!amount || createTopupMutation.isPending}
        >
          {createTopupMutation.isPending ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.payBtnText}>Tiếp tục thanh toán</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  headerTitle: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  scrollContent: { padding: 20 },
  balanceCard: {
    backgroundColor: "#1C1C1E",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  balanceLabel: { color: "#8F8F8F", fontSize: 14 },
  balanceValue: {
    color: "#FF9500",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 5,
  },
  suggestedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF950020",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  suggestedText: {
    color: "#FF9500",
    fontSize: 12,
    marginLeft: 6,
    fontWeight: "500",
  },
  sectionTitle: { color: "#FFF", fontSize: 16, marginBottom: 15 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    paddingBottom: 10,
    marginBottom: 25,
  },
  input: { flex: 1, color: "#FFF", fontSize: 32, fontWeight: "bold" },
  currency: { color: "#666", fontSize: 18 },
  presetGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  presetItem: {
    width: (width - 60) / 3,
    backgroundColor: "#1C1C1E",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  activePreset: { borderWidth: 1, borderColor: "#FF9500" },
  presetText: { color: "#FFF", fontWeight: "600" },
  summaryContainer: {
    marginTop: 25,
    padding: 20,
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2C2C2E",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  infoText: { color: "#8F8F8F", fontSize: 14 },
  infoValue: { color: "#4CD964", fontWeight: "bold", fontSize: 16 },
  totalLabel: { color: "#FFF", fontSize: 15, fontWeight: "600" },
  totalValue: { color: "#FF9500", fontWeight: "900", fontSize: 20 },
  noteText: {
    color: "#444",
    fontSize: 11,
    fontStyle: "italic",
    marginTop: 10,
    textAlign: "right",
  },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: "#1C1C1E" },
  payBtn: {
    backgroundColor: "#FF9500",
    height: 55,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledBtn: { backgroundColor: "#333", opacity: 0.5 },
  payBtnText: { color: "#000", fontWeight: "bold", fontSize: 16 },
});
