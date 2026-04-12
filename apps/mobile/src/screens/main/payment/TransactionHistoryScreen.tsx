import React from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { servicePaymentRequest } from "@/api/servicePayment";
import { PaymentStatus, ServiceType } from "@/utils/enum";

export default function TransactionHistoryScreen({ navigation }: any) {
  const { data: history, isLoading } = useQuery({
    queryKey: ["payment-history"],
    queryFn: servicePaymentRequest.getMyHistory,
  });
  const formatPoints = (amount: number) => `${amount.toLocaleString("vi-VN")} Pts`;

  const getStatusInfo = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.Success:
        return { label: "Thành công", color: "#4CD964" };
      case PaymentStatus.Cancelled:
        return { label: "Đã hủy", color: "#FF3B30" };
      case PaymentStatus.Pending:
        return { label: "Chờ xử lý", color: "#FF9500" };
      default:
        return { label: "Thất bại", color: "#8E8E93" };
    }
  };

  const renderItem = ({ item }: any) => {
    const status = getStatusInfo(item.status);
    const isBooking = item.serviceType === ServiceType.BookingPT;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("TransactionDetail", {
            paymentId: item.servicePaymentId,
          })
        }
      >
        <View
          style={[
            styles.iconBox,
            { backgroundColor: isBooking ? "#FF950020" : "#AF52DE20" },
          ]}
        >
          <Ionicons
            name={isBooking ? "calendar" : "ribbon"}
            size={22}
            color={isBooking ? "#FF9500" : "#AF52DE"}
          />
        </View>

        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={styles.serviceName}>
            {isBooking ? "Thuê PT Cá nhân" : "Gói Premium"}
          </Text>
          <Text style={styles.dateText}>
            {dayjs(item.paymentDate).format("HH:mm - DD/MM/YYYY")}
          </Text>
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.amountText}>
            -{formatPoints(item.amount)}
          </Text>
          <Text style={[styles.statusText, { color: status.color }]}>
            {status.label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch sử giao dịch</Text>
        <View style={{ width: 24 }} />
      </View>

      {isLoading ? (
        <ActivityIndicator color="#FF9500" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.servicePaymentId}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 20 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Chưa có giao dịch nào!</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  headerTitle: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  card: {
    backgroundColor: "#1C1C1E",
    padding: 15,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  serviceName: { color: "#FFF", fontWeight: "bold", fontSize: 15 },
  dateText: { color: "#666", fontSize: 12, marginTop: 4 },
  amountText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  statusText: { fontSize: 11, marginTop: 4, fontWeight: "600" },
  emptyText: { color: "#444", textAlign: "center", marginTop: 100 },

  invoiceContainer: { padding: 25, alignItems: "center" },
  invoiceHeader: { alignItems: "center", marginBottom: 30 },
  successIcon: { marginBottom: 15 },
  invoiceAmount: { color: "#FFF", fontSize: 32, fontWeight: "900" },
  invoiceStatus: {
    color: "#4CD964",
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  infoBox: {
    backgroundColor: "#1C1C1E",
    width: "100%",
    borderRadius: 24,
    padding: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  label: { color: "#888", fontSize: 14 },
  value: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "right",
    flex: 1,
    marginLeft: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#2C2C2E",
    marginVertical: 10,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#333",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  totalLabel: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  totalValue: { color: "#FF9500", fontSize: 18, fontWeight: "900" },
  supportBtn: { marginTop: 40, padding: 15 },
  supportText: { color: "#888", textDecorationLine: "underline" },
});
