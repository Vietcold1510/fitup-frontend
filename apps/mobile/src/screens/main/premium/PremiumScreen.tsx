import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { premiumRequest } from "@/api/premium";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { usePointAmount } from "@/hooks/usePointAmount";

type PremiumType = {
  id: string;
  describe: string;
  duration: number;
  price: number;
  status: number;
};

type MyPremiumStatus = {
  hasPremium: boolean;
  isActive: boolean;
  premiumId: string;
  premiumTypeId: string;
  startDate: string;
  endDate: string;
  remainingDays: number;
};

export default function PremiumScreen() {
  const navigation = useNavigation<any>();

  const {
    data: typesRes,
    isLoading,
    refetch: refetchTypes,
  } = useQuery({
    queryKey: ["premium-types"],
    queryFn: () => premiumRequest.getTypes(),
    staleTime: 0,
  });

  const {
    data: myStatusRes,
    isLoading: isStatusLoading,
    refetch: refetchMyStatus,
  } = useQuery({
    queryKey: ["premium-my-status"],
    queryFn: () => premiumRequest.getMyStatus(),
    staleTime: 0,
  });
  const { refetch: refetchPointAmount } = usePointAmount();

  useFocusEffect(
    React.useCallback(() => {
      refetchTypes();
      refetchMyStatus();
      refetchPointAmount();
    }, [refetchPointAmount, refetchTypes, refetchMyStatus]),
  );

  const types: PremiumType[] = typesRes?.data?.data || [];
  const premiumStatus: MyPremiumStatus | undefined = myStatusRes?.data?.data;
  const activeEndDate = premiumStatus?.endDate;
  const isPremiumActive =
    !!premiumStatus?.hasPremium && !!premiumStatus?.isActive;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <LinearGradient
          colors={["#FFB347", "#FF9500", "#D97706"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroTop}>
            <Ionicons name="diamond" size={28} color="#111" />
            <Text style={styles.heroBadge}>FITUP PREMIUM</Text>
          </View>
          <Text style={styles.heroTitle}>Tập Luyện Thông Minh Hơn</Text>
          <Text style={styles.heroSub}>
            AI cá nhân hóa lộ trình, theo dõi tiến độ và hỗ trợ kỹ thuật tập.
          </Text>
        </LinearGradient>

        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>Trạng thái hiện tại</Text>
          {isStatusLoading ? (
            <ActivityIndicator color="#FF9500" />
          ) : isPremiumActive ? (
            <>
              <Text style={styles.statusActive}>Premium đang hoạt động</Text>
              {!!activeEndDate && (
                <Text style={styles.statusDate}>
                  <Text style={styles.statusDateLabel}>Hết hạn: </Text>
                  <Text style={styles.statusDateValue}>
                    {dayjs(activeEndDate).format("DD/MM/YYYY")}
                  </Text>
                </Text>
              )}
              <Text style={styles.statusDate}>
                <Text style={styles.statusDateLabel}>Còn lại: </Text>
                <Text style={styles.statusDateValue}>
                  {premiumStatus?.remainingDays ?? 0}
                </Text>
                <Text style={styles.statusDateLabel}> ngày</Text>
              </Text>
            </>
          ) : (
            <Text style={styles.statusInactive}>Bạn chưa có gói premium.</Text>
          )}
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>Bạn nhận được gì với Premium?</Text>
          <View style={styles.featureItem}>
            <Ionicons name="sparkles-outline" size={18} color="#FF9500" />
            <Text style={styles.featureText}>
              Tạo workout thông minh bằng AI
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="body-outline" size={18} color="#FF9500" />
            <Text style={styles.featureText}>
              AI check động tác và gợi ý sửa
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="analytics-outline" size={18} color="#FF9500" />
            <Text style={styles.featureText}>
              Theo dõi tiến độ nâng cao theo tuần
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Các gói hiện có</Text>
        {isLoading ? (
          <ActivityIndicator color="#FF9500" style={{ marginTop: 20 }} />
        ) : (
          types.map((item) => (
            <View key={item.id} style={styles.planCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.planName}>{item.describe}</Text>
                <Text style={styles.planMeta}>{item.duration} ngày</Text>
                <Text style={styles.planPrice}>
                  {item.price.toLocaleString()}p
                </Text>
              </View>
              <TouchableOpacity
                style={styles.buyBtn}
                onPress={() =>
                  navigation.navigate("PremiumDetail", {
                    premiumTypeId: item.id,
                    describe: item.describe,
                    duration: item.duration,
                    price: item.price,
                  })
                }
              >
                <Text style={styles.buyText}>Xem chi tiết</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  content: { padding: 20, paddingBottom: 40 },
  hero: {
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
  },
  heroTop: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  heroBadge: { color: "#111", fontWeight: "800", marginLeft: 8, fontSize: 12 },
  heroTitle: { color: "#111", fontSize: 26, fontWeight: "900" },
  heroSub: {
    color: "#1f1f1f",
    marginTop: 8,
    fontWeight: "600",
    lineHeight: 20,
  },
  statusCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#2C2C2E",
  },
  statusTitle: { color: "#AAA", marginBottom: 8, fontSize: 13 },
  statusActive: { color: "#4CD964", fontWeight: "bold", fontSize: 16 },
  statusInactive: { color: "#FF9500", fontWeight: "bold", fontSize: 16 },
  statusDate: { color: "#CCC", marginTop: 6 },
  statusDateLabel: { color: "#BDBDBD" },
  statusDateValue: { color: "#FF9500", fontWeight: "800" },
  featureCard: {
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#2B2B2B",
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  featureTitle: { color: "#FFF", fontWeight: "bold", marginBottom: 10 },
  featureItem: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  featureText: { color: "#CFCFCF", marginLeft: 8 },
  sectionTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  planCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2C2C2E",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  planName: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  planMeta: { color: "#888", marginTop: 4 },
  planPrice: { color: "#FF9500", marginTop: 6, fontWeight: "bold" },
  buyBtn: {
    backgroundColor: "#FF9500",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  buyText: { color: "#000", fontWeight: "bold" },
});
