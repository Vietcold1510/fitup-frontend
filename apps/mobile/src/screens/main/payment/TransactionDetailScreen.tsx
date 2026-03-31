import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { servicePaymentRequest } from "@/api/servicePayment";
import { PaymentStatus, ServiceType } from "@/utils/enum";

export default function TransactionDetailScreen({ route, navigation }: any) {
  const { paymentId } = route.params || {};

  // 1. GỌI API CHI TIẾT
  const {
    data: detail,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["payment-detail", paymentId],
    queryFn: () => servicePaymentRequest.getPaymentDetail(paymentId),
    enabled: !!paymentId,
  });

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator color="#FF9500" size="large" />
      </View>
    );
  }

  if (error || !detail) {
    return (
      <View style={[styles.container, styles.center]}>
        <Ionicons name="alert-circle-outline" size={48} color="#444" />
        <Text style={styles.errorText}>Không tìm thấy thông tin hóa đơn.</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backLink}
        >
          <Text style={{ color: "#FF9500", fontWeight: "bold" }}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 2. PHÂN TÁCH DỮ LIỆU
  const isBooking = detail.serviceType === ServiceType.BookingPT;
  const isSuccess = detail.status === PaymentStatus.Success;
  const booking = detail.bookingPaymentDetail;
  const premium = detail.premiumPaymentDetail;

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeBtn}
        >
          <Ionicons name="close" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết giao dịch</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* PHẦN 1: TỔNG QUAN HÓA ĐƠN */}
        <View style={styles.receiptHeader}>
          <View
            style={[
              styles.iconCircle,
              { borderColor: isSuccess ? "#4CD964" : "#FF3B30" },
            ]}
          >
            <Ionicons
              name={isSuccess ? "checkmark-sharp" : "close-sharp"}
              size={40}
              color={isSuccess ? "#4CD964" : "#FF3B30"}
            />
          </View>
          <Text style={styles.amountText}>
            -{detail.amount.toLocaleString()}đ
          </Text>
          <Text
            style={[
              styles.statusLabel,
              { color: isSuccess ? "#4CD964" : "#FF3B30" },
            ]}
          >
            {isSuccess ? "Thanh toán thành công" : "Giao dịch thất bại"}
          </Text>
        </View>

        {/* PHẦN 2: THÔNG TIN CHI TIẾT (INVOICE CARD) */}
        <View style={styles.invoiceCard}>
          <Text style={styles.sectionTitle}>THÔNG TIN THANH TOÁN</Text>

          <DetailRow
            label="Dịch vụ"
            value={isBooking ? "Thuê PT Cá nhân" : "Gói Hội viên Premium"}
          />
          <DetailRow
            label="Thời gian"
            value={dayjs(detail.paymentDate).format("HH:mm - DD/MM/YYYY")}
          />
          <DetailRow
            label="Mã giao dịch"
            value={detail.servicePaymentId}
            isId
          />
          <DetailRow label="Phương thức" value="Ví FitUp Points" />

          <View style={styles.dashLine} />

          {/* HIỂN THỊ THEO LOẠI DỊCH VỤ */}
          {isBooking && booking ? (
            <>
              <Text style={styles.sectionTitle}>CHI TIẾT LỊCH TẬP</Text>
              <DetailRow
                label="Giá mỗi buổi"
                value={booking.price.toLocaleString() + "đ"}
              />
              <DetailRow
                label="Ghi chú"
                value={booking.note || "Không có ghi chú"}
              />
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Tổng tiền</Text>
                <Text style={styles.totalValue}>
                  {booking.total.toLocaleString()}đ
                </Text>
              </View>
            </>
          ) : premium ? (
            <>
              <Text style={styles.sectionTitle}>CHI TIẾT GÓI CƯỚC</Text>
              <DetailRow
                label="Ngày bắt đầu"
                value={dayjs(premium.startDate).format("DD/MM/YYYY")}
              />
              <DetailRow
                label="Ngày kết thúc"
                value={dayjs(premium.endDate).format("DD/MM/YYYY")}
              />
              <DetailRow
                label="Trạng thái gói"
                value={
                  premium.premiumStatus === 0 ? "Chờ kích hoạt" : "Đã kích hoạt"
                }
              />
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Giá gói</Text>
                <Text style={styles.totalValue}>
                  {premium.price.toLocaleString()}đ
                </Text>
              </View>
            </>
          ) : null}
        </View>

        {/* NÚT HỖ TRỢ */}
        <TouchableOpacity style={styles.helpBtn}>
          <Ionicons name="help-circle-outline" size={20} color="#888" />
          <Text style={styles.helpText}>Bạn gặp vấn đề với giao dịch này?</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * COMPONENT CON: HIỂN THỊ DÒNG THÔNG TIN
 */
const DetailRow = ({
  label,
  value,
  isId,
}: {
  label: string;
  value: string;
  isId?: boolean;
}) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text
      style={[styles.value, isId && styles.idValue]}
      numberOfLines={isId ? 1 : 2}
    >
      {value}
    </Text>
  </View>
);

/**
 * HỆ THỐNG STYLES (DARK MODE)
 */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: { justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 50,
  },
  headerTitle: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  closeBtn: { padding: 5 },

  scrollContent: { alignItems: "center", paddingBottom: 20 },

  receiptHeader: { alignItems: "center", marginVertical: 30 },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderStyle: "dashed",
  },
  amountText: { color: "#FFF", fontSize: 34, fontWeight: "900" },
  statusLabel: { fontSize: 15, fontWeight: "600", marginTop: 8 },

  invoiceCard: {
    backgroundColor: "#1C1C1E",
    width: "90%",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  sectionTitle: {
    color: "#555",
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 18,
    letterSpacing: 1,
    marginTop: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  label: { color: "#888", fontSize: 14 },
  value: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "right",
    flex: 1,
    marginLeft: 20,
  },
  idValue: { fontSize: 10, color: "#444" },

  dashLine: {
    height: 1,
    width: "100%",
    borderWidth: 1,
    borderColor: "#333",
    borderStyle: "dashed",
    marginVertical: 15,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    alignItems: "center",
  },
  totalLabel: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  totalValue: { color: "#FF9500", fontSize: 20, fontWeight: "900" },

  errorText: { color: "#666", marginTop: 10 },
  backLink: { marginTop: 15 },
  helpBtn: { flexDirection: "row", alignItems: "center", marginTop: 30 },
  helpText: {
    color: "#666",
    fontSize: 13,
    marginLeft: 8,
    textDecorationLine: "underline",
  },
});
