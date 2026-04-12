import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function PtDashboardScreen() {
  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trainer Dashboard</Text>
        <View style={styles.headerRight}>
          <View style={styles.incomeBadge}>
            <Text style={styles.incomeText}>đ2.4M</Text>
          </View>
          <View style={styles.avatarMini} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
      >
        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            title="Today's Sessions"
            value="8"
            sub="Next: 14:30"
            color="#FF9500"
          />
          <StatCard title="Pending Requests" value="5" badge="3" color="#FFF" />
          <StatCard
            title="This Week"
            value="đ2.4M"
            sub="+12%"
            color="#4CD964"
            isPrice
          />
        </View>

        {/* Next Session Card */}
        <Text style={styles.sectionTitle}>Next Session</Text>
        <View style={styles.nextSessionCard}>
          <View style={styles.userRow}>
            <View style={styles.userAvatar} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.userName}>Username</Text>
              <Text style={styles.programName}>Weight Loss Program</Text>
            </View>
            <View style={styles.premiumLabel}>
              <Text style={styles.premiumText}>Premium</Text>
            </View>
          </View>
          <View style={styles.timeRow}>
            <Ionicons name="time-outline" size={18} color="#FF9500" />
            <Text style={styles.timeText}>Today, 2:30 PM - 3:30 PM</Text>
          </View>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.btnSecondary}>
              <Ionicons name="chatbubble-outline" size={18} color="#FFF" />
              <Text style={styles.btnText}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSecondary}>
              <Ionicons name="call-outline" size={18} color="#FFF" />
              <Text style={styles.btnText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnPrimary}>
              <Text style={styles.btnTextBlack}>Open Details</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Pending Requests List */}
        <Text style={styles.sectionTitle}>Pending Booking Requests</Text>
        {[1, 2, 3].map((item) => (
          <View key={item} style={styles.requestCard}>
            <View style={styles.userRow}>
              <View style={styles.userAvatar} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.userName}>Username</Text>
                <Text style={styles.programName}>Tomorrow, 10:00 AM</Text>
              </View>
              <View style={styles.newLabel}>
                <Text style={styles.newText}>New</Text>
              </View>
            </View>
            <Text style={styles.priceRequest}>đ350,000 per session</Text>
            <View style={styles.requestActionRow}>
              <TouchableOpacity style={styles.acceptBtn}>
                <Text style={styles.btnTextBlack}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.declineBtn}>
                <Text style={styles.btnText}>Decline</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Quick Actions Grid */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <ActionButton icon="calendar" title="Set Availability" />
          <ActionButton icon="cash-outline" title="Update Pricing" />
          <ActionButton icon="person-outline" title="Edit Profile" />
          <ActionButton icon="wallet-outline" title="Payouts" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Sub-components
const StatCard = ({ title, value, sub, badge, color, isPrice }: any) => (
  <View style={styles.statCard}>
    {badge && (
      <View style={styles.statBadge}>
        <Text style={styles.badgeText}>{badge}</Text>
      </View>
    )}
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
    {sub && (
      <Text
        style={[styles.statSub, { color: isPrice ? "#4CD964" : "#FF9500" }]}
      >
        {sub}
      </Text>
    )}
  </View>
);

const ActionButton = ({ icon, title }: any) => (
  <TouchableOpacity style={styles.actionBtn}>
    <Ionicons name={icon} size={20} color="#FF9500" />
    <Text style={styles.actionBtnText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  headerTitle: { color: "#FFF", fontSize: 20, fontWeight: "bold" },
  headerRight: { flexDirection: "row", alignItems: "center" },
  incomeBadge: {
    backgroundColor: "#FF9500",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 12,
  },
  incomeText: { fontWeight: "bold", fontSize: 14 },
  avatarMini: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#333",
  },

  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  statCard: {
    width: "31%",
    backgroundColor: "#2C2C2E",
    padding: 15,
    borderRadius: 16,
    position: "relative",
  },
  statBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FF9500",
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  badgeText: {
    color: "#121212", // Màu chữ tối trên nền cam
    fontSize: 10,
    fontWeight: "bold",
  },
  statValue: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  statTitle: { color: "#888", fontSize: 11, marginTop: 4 },
  statSub: { fontSize: 11, fontWeight: "bold", marginTop: 4 },

  sectionTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 10,
  },
  nextSessionCard: {
    backgroundColor: "#2C2C2E",
    padding: 20,
    borderRadius: 24,
    marginBottom: 25,
  },
  userRow: { flexDirection: "row", alignItems: "center" },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#555",
  },
  userName: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  programName: { color: "#888", fontSize: 13, marginTop: 2 },
  premiumLabel: {
    backgroundColor: "#FF9500",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  premiumText: { fontSize: 11, fontWeight: "bold" },
  timeRow: { flexDirection: "row", alignItems: "center", marginTop: 15 },
  timeText: { color: "#CCC", marginLeft: 8, fontSize: 14 },
  actionRow: { flexDirection: "row", marginTop: 20, gap: 10 },
  btnSecondary: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#3A3A3C",
    padding: 12,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  btnPrimary: {
    flex: 1.5,
    backgroundColor: "#FF9500",
    padding: 12,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: { color: "#FFF", fontWeight: "bold", fontSize: 14 },
  btnTextBlack: { color: "#000", fontWeight: "bold", fontSize: 14 },

  requestCard: {
    backgroundColor: "#2C2C2E",
    padding: 16,
    borderRadius: 20,
    marginBottom: 15,
  },
  newLabel: {
    backgroundColor: "#FF9500",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  newText: { fontSize: 10, fontWeight: "bold" },
  priceRequest: { color: "#CCC", marginTop: 12, fontSize: 14 },
  requestActionRow: { flexDirection: "row", gap: 12, marginTop: 15 },
  acceptBtn: {
    flex: 1,
    backgroundColor: "#FF9500",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  declineBtn: {
    flex: 1,
    backgroundColor: "#3A3A3C",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#444",
  },

  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 30,
  },
  actionBtn: {
    width: "48%",
    backgroundColor: "#2C2C2E",
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  actionBtnText: { color: "#FFF", fontWeight: "600", fontSize: 13 },
});
