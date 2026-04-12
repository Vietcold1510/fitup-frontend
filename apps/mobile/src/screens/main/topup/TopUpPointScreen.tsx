import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  Linking,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useConversionRates, useCreateTopup } from "@/hooks/useTopup";
import { usePointAmount } from "@/hooks/usePointAmount";

const { width } = Dimensions.get("window");
const PRESET_AMOUNTS = [10000, 20000, 50000, 100000, 200000, 500000];

export default function TopUpPointScreen() {
  const navigation = useNavigation<any>();
  const [amount, setAmount] = useState<string>("");

  const { data: pointAmount = 0 } = usePointAmount();
  const { data: rates, isLoading: isLoadingRates } = useConversionRates();
  const createTopupMutation = useCreateTopup();

  // Lấy tỉ giá nạp tiền (Type 1)
  const topupRate = useMemo(
    () => rates?.find((r: any) => r.type === 1),
    [rates],
  );

  const calculatedPoints = useMemo(() => {
    const numAmount = parseInt(amount) || 0;
    return Math.floor(numAmount / (topupRate?.rate || 1));
  }, [amount, topupRate]);

  const handleTopUp = async () => {
    const numAmount = parseInt(amount);
    if (!numAmount || numAmount < 1000) {
      Alert.alert("Thông báo", "Số tiền nạp tối thiểu là 1.000 VNĐ");
      return;
    }

    try {
      // 💡 ĐƯỜNG VỀ APP: Khi PayOS xong, nó sẽ gọi link này để mở lại App
      const appScheme = "fitup://payment-result";

      const res = await createTopupMutation.mutateAsync({
        amountVnd: numAmount,
        conversionRateId: topupRate?.id,
        returnUrl: appScheme, // Backend cần nhận tham số này
        cancelUrl: appScheme, // Backend cần nhận tham số này
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
            {pointAmount.toLocaleString()} Pts
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

        {parseInt(amount) > 0 && (
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>Bạn sẽ nhận được:</Text>
            <Text style={styles.infoValue}>
              {calculatedPoints.toLocaleString()} Pts
            </Text>
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
    marginBottom: 30,
  },
  balanceLabel: { color: "#8F8F8F", fontSize: 14 },
  balanceValue: {
    color: "#FF9500",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 5,
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
  infoBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#4CD96410",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoText: { color: "#8F8F8F" },
  infoValue: { color: "#4CD964", fontWeight: "bold" },
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
