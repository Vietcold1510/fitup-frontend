import React, { useEffect, useMemo, useState } from "react";
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

type PlanInfo = {
  headline: string;
  subHeadline: string;
  bonusLines: string[];
  savingsNote?: string;
};

const BASE_PREMIUM_FEATURES = [
  "Tạo workout thông minh bằng AI",
  "AI check động tác và gợi ý sửa",
  "Theo dõi tiến độ nâng cao theo tuần",
];

const PLAN_INFOS: PlanInfo[] = [
  {
    headline: "Gói linh hoạt",
    subHeadline: "Trải nghiệm đầy đủ quyền lợi Premium trong thời gian ngắn.",
    bonusLines: [
      "Kho bài tập chuyên sâu và video mẫu không giới hạn",
      "Lưu lịch sử luyện tập, đo nhịp tiến bộ theo ngày",
    ],
  },
  {
    headline: "Gói tiết kiệm",
    subHeadline: "Phù hợp nếu bạn muốn duy trì thói quen tập luyện đều đặn.",
    bonusLines: [
      "Ưu tiên gợi ý lộ trình theo mục tiêu giảm mỡ, tăng cơ",
      "Tối ưu chi phí so với gói linh hoạt khi dùng dài hơn",
    ],
    savingsNote: "Tiết kiệm 16% so với gói linh hoạt.",
  },
  {
    headline: "Gói tối ưu",
    subHeadline: "Lựa chọn tốt cho người tập nghiêm túc trong dài hạn.",
    bonusLines: [
      "AI theo sát tiến độ và tinh chỉnh cường độ tập mỗi tuần",
      "Mở khóa trọn bộ tính năng nâng cao để bứt tốc kết quả",
    ],
    savingsNote: "Tiết kiệm 30% so với gói linh hoạt.",
  },
];

const getDiscountPercentByIndex = (index: number) => {
  if (index === 1) return 16;
  if (index === 2) return 30;
  return 0;
};

const getPlanInfoByIndex = (index: number): PlanInfo =>
  PLAN_INFOS[index] || PLAN_INFOS[0];

const getPlanFeaturesByIndex = (index: number) => [
  ...BASE_PREMIUM_FEATURES,
  ...getPlanInfoByIndex(index).bonusLines,
];

export default function PremiumScreen() {
  const navigation = useNavigation<any>();
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);

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

  const allTypes: PremiumType[] = typesRes?.data?.data || [];
  const types: PremiumType[] = useMemo(() => allTypes.slice(0, 3), [allTypes]);

  const premiumStatus: MyPremiumStatus | undefined = myStatusRes?.data?.data;
  const activeEndDate = premiumStatus?.endDate;
  const isPremiumActive =
    !!premiumStatus?.hasPremium &&
    !!premiumStatus?.isActive &&
    (premiumStatus?.remainingDays ?? 0) > 0;

  const selectedType = types.find((item) => item.id === selectedTypeId) || null;
  const selectedIndex = selectedType
    ? types.findIndex((item) => item.id === selectedType.id)
    : -1;
  const selectedDiscount =
    selectedIndex >= 0 ? getDiscountPercentByIndex(selectedIndex) : 0;
  const selectedPlanInfo =
    selectedIndex >= 0 ? getPlanInfoByIndex(selectedIndex) : PLAN_INFOS[0];

  useEffect(() => {
    if (!types.length) {
      setSelectedTypeId(null);
      return;
    }

    const hasSelected = types.some((item) => item.id === selectedTypeId);
    if (!hasSelected) {
      setSelectedTypeId(types[0].id);
    }
  }, [types, selectedTypeId]);

  const handleGoToCheckout = () => {
    if (!selectedType) {
      Alert.alert("Thông báo", "Không tìm thấy gói Premium để thanh toán.");
      return;
    }

    navigation.navigate("PremiumDetail", {
      premiumTypeId: selectedType.id,
      describe: selectedType.describe,
      duration: selectedType.duration,
      price: selectedType.price,
      discountPercent: selectedDiscount,
      planSubtitle: selectedPlanInfo.subHeadline,
      savingsNote: selectedPlanInfo.savingsNote,
      features: getPlanFeaturesByIndex(selectedIndex),
    });
  };

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
            <Ionicons name="diamond" size={28} color="#FFF" />
            <Text style={styles.heroBadge}>FITUP PREMIUM</Text>
          </View>
          <Text style={styles.heroTitle}>Tập luyện thông minh hơn</Text>
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
            <Text style={styles.statusInactive}>Bạn chưa có gói Premium.</Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>Các gói hiện có</Text>
        {isLoading ? (
          <ActivityIndicator color="#FF9500" style={{ marginTop: 20 }} />
        ) : (
          <>
            {types.map((item, index) => {
              const isSelected = selectedTypeId === item.id;
              const discountPercent = getDiscountPercentByIndex(index);
              const planInfo = getPlanInfoByIndex(index);
              const planFeatures = getPlanFeaturesByIndex(index);

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.planCard, isSelected && styles.planCardSelected]}
                  activeOpacity={0.9}
                  onPress={() => setSelectedTypeId(item.id)}
                >
                  <View
                    style={[
                      styles.selectedTick,
                      isSelected
                        ? styles.selectedTickActive
                        : styles.selectedTickInactive,
                    ]}
                  >
                    {isSelected && <Ionicons name="checkmark" size={14} color="#111" />}
                  </View>

                  {discountPercent > 0 && (
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>Giảm {discountPercent}%</Text>
                    </View>
                  )}

                  <Text style={styles.planName}>{item.describe || planInfo.headline}</Text>
                  <Text style={styles.planMeta}>{item.duration} ngày</Text>
                  <Text style={styles.planPrice}>{item.price.toLocaleString()} Pts</Text>
                  <Text style={styles.planLabel}>{planInfo.headline}</Text>
                  <Text style={styles.planSubtitle}>{planInfo.subHeadline}</Text>
                  {!!planInfo.savingsNote && (
                    <Text style={styles.planSavings}>{planInfo.savingsNote}</Text>
                  )}

                  <View style={styles.planFeatureList}>
                    {planFeatures.map((feature) => (
                      <View key={`${item.id}-${feature}`} style={styles.planFeatureItem}>
                        <Ionicons name="checkmark" size={14} color="#FF9500" />
                        <Text style={styles.planFeatureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              );
            })}

          </>
        )}
      </ScrollView>
      <View style={styles.checkoutSticky}>
        <TouchableOpacity
          style={[styles.checkoutBtn, !selectedType && { opacity: 0.5 }]}
          disabled={!selectedType}
          onPress={handleGoToCheckout}
        >
          <Text style={styles.checkoutText}>Đi tới thanh toán</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  content: { padding: 20, paddingBottom: 120 },

  hero: {
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
  },
  heroTop: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  heroBadge: { color: "#FFF", fontWeight: "800", marginLeft: 8, fontSize: 12 },
  heroTitle: { color: "#FFF", fontSize: 26, fontWeight: "900" },
  heroSub: {
    color: "#1f1f1f",
    marginTop: 8,
    fontWeight: "700",
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

  sectionTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
  },

  planCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2C2C2E",
    marginBottom: 12,
    position: "relative",
    overflow: "hidden",
  },
  planCardSelected: {
    borderColor: "#FF9500",
    backgroundColor: "#21170E",
  },
  selectedTick: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  selectedTickActive: {
    backgroundColor: "#FFB347",
    borderWidth: 1,
    borderColor: "#FFB347",
  },
  selectedTickInactive: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#5A5A5E",
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
  planName: { color: "#FFF", fontSize: 17, fontWeight: "800", marginTop: 2 },
  planMeta: { color: "#A7A7A7", marginTop: 4, fontSize: 13 },
  planPrice: { color: "#FF9500", marginTop: 8, fontWeight: "900", fontSize: 18 },
  planLabel: {
    color: "#F8C88A",
    marginTop: 8,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  planSubtitle: {
    color: "#E3E3E3",
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
  },
  planSavings: {
    color: "#FFB347",
    marginTop: 6,
    fontWeight: "700",
    fontSize: 13,
  },

  planFeatureList: { marginTop: 12 },
  planFeatureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 7,
  },
  planFeatureText: { color: "#D0D0D0", marginLeft: 8, fontSize: 13, flex: 1 },

  checkoutSticky: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: "#121212",
    borderTopWidth: 1,
    borderTopColor: "#232323",
  },
  checkoutBtn: {
    backgroundColor: "#FF9500",
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  checkoutText: { color: "#111", fontWeight: "900", fontSize: 16 },
});
