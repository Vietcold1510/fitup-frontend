import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useQuery } from "@tanstack/react-query";
import { ptPublicRequest } from "@/api/pt";
import { debounce } from "lodash";

export default function UserExploreScreen({ navigation }: any) {
  const [search, setSearch] = useState("");
  const [dbSearch, setDbSearch] = useState("");
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [tempMinPrice, setTempMinPrice] = useState(0);
  const [tempMaxPrice, setTempMaxPrice] = useState(1000000);

  const [filterPrice, setFilterPrice] = useState({ min: 0, max: 1000000 });

  // 1. LOGIC: Debounce Search
  const changeSearch = useMemo(
    () => debounce((text: string) => setDbSearch(text), 500),
    [],
  );

  const handleChangeSearch = (text: string) => {
    setSearch(text);
    changeSearch(text);
  };

  // 2. API: Lấy danh sách PT
  const {
    data: ptsRes,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["public-pts", dbSearch, filterPrice],
    queryFn: () =>
      ptPublicRequest.getAllPts({
        Name: dbSearch || undefined,
        MinPrice: filterPrice.min > 0 ? filterPrice.min : undefined,
        MaxPrice: filterPrice.max < 1000000 ? filterPrice.max : undefined,
      }),
  });

  const ptList = ptsRes?.data?.data || [];

  // 3. LOGIC: Filter Modal
  const applyFilter = () => {
    setFilterPrice({ min: tempMinPrice, max: tempMaxPrice });
    setFilterModalVisible(false);
  };

  const resetFilter = () => {
    setTempMinPrice(0);
    setTempMaxPrice(1000000);
    setFilterPrice({ min: 0, max: 1000000 });
    setFilterModalVisible(false);
  };

  const renderPtItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.ptCard}
      onPress={() => {
        navigation.navigate("PtPublicDetail", { ptId: item.id });
      }}
    >
      <View style={styles.avatarWrapper}>
        <Image
          source={{
            uri: `https://ui-avatars.com/api/?name=${item.displayName}&background=random`,
          }}
          style={styles.avatar}
        />
        {item.rating > 0 && (
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={10} color="#000" />
            <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
          </View>
        )}
      </View>

      <View style={styles.infoWrapper}>
        <View style={styles.nameRow}>
          <Text style={styles.ptName}>{item.displayName}</Text>
          {item.verificationStatus === "Verified" && (
            <Ionicons
              name="checkmark-circle"
              size={16}
              color="#007AFF"
              style={{ marginLeft: 4 }}
            />
          )}
        </View>

        <Text style={styles.bioText} numberOfLines={1}>
          {item.bio || "Huấn luyện viên chuyên nghiệp"}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.priceValue}>
            {item.pricePerHour.toLocaleString()}p
          </Text>
          <Text style={styles.priceUnit}> /giờ</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#444" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER SECTION */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Huấn luyện viên</Text>

          {/* NÚT ĐIỀU HƯỚNG TỚI LỊCH TẬP (MY BOOKINGS) */}
          <TouchableOpacity
            style={styles.myBookingBtn}
            onPress={() => navigation.navigate("MyBookings")}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="calendar-outline" size={26} color="#FF9500" />
              <View style={styles.activeDot} />
            </View>
            <Text style={styles.myBookingText}>Lịch của tôi</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#888" />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm theo tên PT..."
              placeholderTextColor="#888"
              value={search}
              onChangeText={handleChangeSearch}
            />
          </View>
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => setFilterModalVisible(true)}
          >
            <Ionicons name="options-outline" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* FLATLIST */}
      {isLoading ? (
        <ActivityIndicator color="#FF9500" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={ptList}
          keyExtractor={(item) => item.id}
          renderItem={renderPtItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyView}>
              <Ionicons name="search-outline" size={50} color="#444" />
              <Text style={styles.emptyText}>
                Không tìm thấy huấn luyện viên nào phù hợp.
              </Text>
            </View>
          }
          refreshing={isLoading}
          onRefresh={refetch}
        />
      )}

      {/* MODAL FILTER */}
      <Modal visible={isFilterModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Lọc kết quả</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            <Text style={styles.filterLabel}>Giá tối thiểu</Text>
            <View style={styles.priceValueRow}>
              <Text style={styles.priceText}>
                {tempMinPrice.toLocaleString()}p
              </Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1000000}
                step={10000}
                value={tempMinPrice}
                onValueChange={setTempMinPrice}
                minimumTrackTintColor="#FF9500"
                thumbTintColor="#FF9500"
              />
            </View>

            <Text style={styles.filterLabel}>Giá tối đa</Text>
            <View style={styles.priceValueRow}>
              <Text style={styles.priceText}>
                {tempMaxPrice.toLocaleString()}đ
              </Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1000000}
                step={10000}
                value={tempMaxPrice}
                onValueChange={setTempMaxPrice}
                minimumTrackTintColor="#FF9500"
                thumbTintColor="#FF9500"
              />
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.resetBtn} onPress={resetFilter}>
                <Text style={styles.resetText}>Thiết lập lại</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyBtn} onPress={applyFilter}>
                <Text style={styles.applyText}>ÁP DỤNG</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: { padding: 16 },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: { color: "#FFF", fontSize: 24, fontWeight: "bold" },

  // MY BOOKING BUTTON STYLES
  myBookingBtn: { alignItems: "center" },
  iconContainer: { position: "relative" },
  activeDot: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF3B30",
    borderWidth: 1,
    borderColor: "#000",
  },
  myBookingText: {
    color: "#FF9500",
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 2,
  },

  searchRow: { flexDirection: "row", alignItems: "center" },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#1C1C1E",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  searchInput: { color: "#FFF", marginLeft: 10, flex: 1, fontSize: 16 },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#FF9500",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },

  listContent: { padding: 16, paddingBottom: 30 },
  ptCard: {
    flexDirection: "row",
    backgroundColor: "#1C1C1E",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  avatarWrapper: { position: "relative" },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  ratingBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#FF9500",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#1C1C1E",
  },
  ratingText: {
    fontSize: 10,
    fontWeight: "bold",
    marginLeft: 2,
    color: "#000",
  },
  infoWrapper: { flex: 1, marginLeft: 16 },
  nameRow: { flexDirection: "row", alignItems: "center" },
  ptName: { color: "#FFF", fontSize: 17, fontWeight: "bold" },
  bioText: { color: "#888", fontSize: 13, marginTop: 2 },
  priceRow: { flexDirection: "row", alignItems: "baseline", marginTop: 6 },
  priceValue: { color: "#FF9500", fontSize: 16, fontWeight: "bold" },
  priceUnit: { color: "#888", fontSize: 12 },
  emptyView: { flex: 1, alignItems: "center", marginTop: 50 },
  emptyText: {
    color: "#444",
    textAlign: "center",
    marginTop: 15,
    fontSize: 14,
    fontStyle: "italic",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1C1C1E",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  modalTitle: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  filterLabel: {
    color: "#888",
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "bold",
  },
  priceValueRow: { marginBottom: 25 },
  priceText: {
    color: "#FF9500",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  slider: { width: "100%", height: 40 },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  resetBtn: { padding: 15 },
  resetText: { color: "#FF3B30", fontWeight: "bold" },
  applyBtn: {
    backgroundColor: "#FF9500",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  applyText: { color: "#000", fontWeight: "bold", fontSize: 15 },
});
