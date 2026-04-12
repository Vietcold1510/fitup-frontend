import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

// MOCK DATA: Hàn sẽ thay mảng này bằng dữ liệu từ API (ví dụ: data từ useQuery)
const MOCK_REQUESTS = [
  {
    id: "1",
    userName: "Username",
    programType: "Personal Training",
    price: 85,
    date: "Dec 15, 2:00 PM",
    duration: "60 min",
    location: "Downtown Gym",
    note: "Looking for strength training focused session",
    tagColor: "#2F80ED", // Màu xanh dương
  },
  {
    id: "2",
    userName: "Username",
    programType: "Yoga Session",
    price: 65,
    date: "Dec 16, 9:00 AM",
    duration: "45 min",
    location: "Online Session",
    isOnline: true,
    note: "Beginner level, focusing on flexibility",
    tagColor: "#27AE60", // Màu xanh lá
  },
  {
    id: "3",
    userName: "Username",
    programType: "HIIT Training",
    price: 95,
    date: "Dec 17, 6:30 PM",
    duration: "90 min",
    location: "Client's Home",
    note: "High intensity workout, have equipment ready",
    tagColor: "#9B51E0", // Màu tím
  },
];

export default function PtBookingRequestsScreen() {
  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Booking Requests</Text>
        <Ionicons name="ellipsis-vertical" size={20} color="#888" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* BANNER THÔNG BÁO */}
        <View style={styles.alertBanner}>
          <Ionicons name="time-outline" size={18} color="#FFF" />
          <Text style={styles.alertText}>
            Respond within 12h to keep your response rate high
          </Text>
        </View>

        {/* SEARCH & FILTERS */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={18} color="#888" />
            <TextInput
              placeholder="Search requests..."
              placeholderTextColor="#888"
              style={styles.searchInput}
            />
          </View>
          <View style={styles.filterRow}>
            <FilterButton icon="calendar-outline" label="Date" />
            <FilterButton icon="pricetag-outline" label="Program" />
            <FilterButton icon="cash-outline" label="Price" />
          </View>
        </View>

        {/* LIST REQUESTS */}
        <View style={{ padding: 16 }}>
          {MOCK_REQUESTS.map((item) => (
            <BookingCard key={item.id} data={item} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Component phụ: Nút Filter
const FilterButton = ({ icon, label }: any) => (
  <TouchableOpacity style={styles.filterBtn}>
    <Ionicons name={icon} size={14} color="#888" />
    <Text style={styles.filterBtnText}>{label}</Text>
  </TouchableOpacity>
);

// Component chính: Card yêu cầu đặt lịch
const BookingCard = ({ data }: any) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.avatar} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.userName}>{data.userName}</Text>
        <Text style={styles.userSub}>Customer</Text>
      </View>
      <View style={styles.newBadge}>
        <Text style={styles.newText}>New</Text>
      </View>
    </View>

    <View style={styles.priceRow}>
      <View style={[styles.programTag, { backgroundColor: data.tagColor }]}>
        <Text style={styles.programText}>{data.programType}</Text>
      </View>
      <Text style={styles.priceText}>${data.price}</Text>
    </View>

    <View style={styles.infoRow}>
      <View style={styles.infoItem}>
        <Ionicons name="calendar-outline" size={16} color="#888" />
        <Text style={styles.infoValue}>{data.date}</Text>
      </View>
      <View style={[styles.infoItem, { marginLeft: 15 }]}>
        <Ionicons name="time-outline" size={16} color="#888" />
        <Text style={styles.infoValue}>{data.duration}</Text>
      </View>
    </View>

    <View style={styles.infoItem}>
      <Ionicons
        name={data.isOnline ? "videocam-outline" : "location-outline"}
        size={16}
        color="#888"
      />
      <Text style={styles.infoValue}>{data.location}</Text>
    </View>

    <View style={styles.noteBox}>
      <Text style={styles.noteText}>"{data.note}"</Text>
    </View>

    <View style={styles.actionRow}>
      <TouchableOpacity style={styles.acceptBtn}>
        <Text style={styles.acceptText}>Accept</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.declineBtn}>
        <Text style={styles.declineText}>Decline</Text>
      </TouchableOpacity>
    </View>

    <TouchableOpacity style={styles.proposeBtn}>
      <Text style={styles.proposeText}>Propose new time</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: { color: "#FFF", fontSize: 18, fontWeight: "bold" },

  alertBanner: {
    backgroundColor: "#F2994A",
    margin: 16,
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  alertText: { color: "#FFF", fontSize: 12, fontWeight: "500", flex: 1 },

  searchSection: { paddingHorizontal: 16 },
  searchBar: {
    backgroundColor: "#2C2C2E",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderRadius: 10,
    height: 45,
  },
  searchInput: { flex: 1, color: "#FFF", marginLeft: 8 },
  filterRow: { flexDirection: "row", marginTop: 12, gap: 10 },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  filterBtnText: { color: "#888", fontSize: 13 },

  card: {
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#555",
  },
  userName: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  userSub: { color: "#888", fontSize: 12 },
  newBadge: {
    backgroundColor: "#F2994A",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  newText: { color: "#000", fontSize: 10, fontWeight: "bold" },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  programTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  programText: { color: "#FFF", fontSize: 12, fontWeight: "600" },
  priceText: { color: "#F2994A", fontSize: 18, fontWeight: "bold" },

  infoRow: { flexDirection: "row", marginBottom: 8 },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  infoValue: { color: "#AAA", fontSize: 13 },

  noteBox: {
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
  },
  noteText: {
    color: "#CCC",
    fontSize: 13,
    fontStyle: "italic",
    textAlign: "center",
  },

  actionRow: { flexDirection: "row", gap: 12, marginTop: 10 },
  acceptBtn: {
    flex: 1,
    backgroundColor: "#FF9500",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  declineBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#444",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  acceptText: { color: "#000", fontWeight: "bold" },
  declineText: { color: "#AAA", fontWeight: "bold" },
  proposeBtn: { alignSelf: "center", marginTop: 15 },
  proposeText: { color: "#FF9500", fontSize: 13, fontWeight: "600" },
});
