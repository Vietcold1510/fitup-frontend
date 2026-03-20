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

export default function PtBookingDetailScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER BAR */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <View style={styles.avatarSmall} />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.headerName}>Username</Text>
            <Text style={styles.headerSub}>Customer</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name="chatbubble-ellipses" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
      >
        {/* MAIN INFO CARD */}
        <View style={styles.mainCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.tagPrimary}>
              <Text style={styles.tagText}>Personal Training</Text>
            </View>
            <Text style={styles.bookingId}>#BK2024001</Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="calendar" size={20} color="#FF9500" />
            <View style={{ marginLeft: 15 }}>
              <Text style={styles.infoLabel}>March 15, 2024</Text>
              <Text style={styles.infoSub}>2:00 PM - 3:00 PM</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="time" size={20} color="#FF9500" />
            <Text style={[styles.infoLabel, { marginLeft: 15 }]}>
              60 minutes
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="cash" size={20} color="#FF9500" />
            <Text style={[styles.infoLabel, { marginLeft: 15 }]}>$85.00</Text>
          </View>
        </View>

        {/* NOTES FROM CLIENT */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="bookmark" size={18} color="#FF9500" />
            <Text style={styles.sectionTitle}>Notes from Client</Text>
          </View>
          <Text style={styles.noteContent}>
            "Hi! I'm looking forward to our session. I have a minor knee issue
            from last week's run, so please keep that in mind. Also, I prefer
            high-intensity workouts. Thanks!"
          </Text>
        </View>

        {/* CANCELLATION POLICY */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle" size={18} color="#FF9500" />
            <Text style={styles.sectionTitle}>Cancellation Policy</Text>
          </View>
          <Text style={styles.policyContent}>
            Free cancellation up to 24 hours before the session. Cancellations
            within 24 hours are subject to a 50% fee. No-shows will be charged
            the full amount.
          </Text>
        </View>

        {/* PREVIOUS SESSIONS */}
        <Text style={styles.listTitle}>Previous Sessions</Text>
        <HistoryCard
          date="March 1, 2024"
          type="Personal Training • Completed"
        />
        <HistoryCard
          date="February 15, 2024"
          type="Personal Training • Completed"
        />

        {/* QUICK MESSAGES */}
        <Text style={styles.listTitle}>Quick Messages</Text>
        <View style={styles.quickMsgContainer}>
          {[
            "Running late",
            "Bring water & towel",
            "On my way",
            "See you soon",
          ].map((msg) => (
            <TouchableOpacity key={msg} style={styles.msgBtn}>
              <Text style={styles.msgText}>{msg}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* BOTTOM ACTIONS */}
      <View style={styles.bottomBar}>
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.acceptBtn}>
            <Text style={styles.acceptText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.declineBtn}>
            <Text style={styles.declineText}>Decline</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.proposeBtn}>
          <Text style={styles.proposeText}>Propose New Time</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Component phụ cho lịch sử tập
const HistoryCard = ({ date, type }: any) => (
  <View style={styles.historyCard}>
    <View>
      <Text style={styles.historyDate}>{date}</Text>
      <Text style={styles.historyType}>{type}</Text>
    </View>
    <Ionicons name="checkmark-circle" size={22} color="#4CD964" />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#1C1C1E",
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 15,
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#555",
  },
  headerName: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  headerSub: { color: "#888", fontSize: 12 },

  mainCard: {
    backgroundColor: "#2C2C2E",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  tagPrimary: {
    backgroundColor: "#FF9500",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  tagText: { color: "#FFF", fontWeight: "bold", fontSize: 12 },
  bookingId: { color: "#666", fontSize: 13 },
  infoItem: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  infoLabel: { color: "#FFF", fontSize: 16, fontWeight: "500" },
  infoSub: { color: "#888", fontSize: 14, marginTop: 2 },

  sectionCard: {
    backgroundColor: "#2C2C2E",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  sectionTitle: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  noteContent: {
    color: "#CCC",
    fontSize: 14,
    lineHeight: 22,
    fontStyle: "italic",
  },
  policyContent: { color: "#888", fontSize: 13, lineHeight: 20 },

  listTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 15,
  },
  historyCard: {
    backgroundColor: "#2C2C2E",
    borderRadius: 15,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  historyDate: { color: "#FFF", fontSize: 15, fontWeight: "600" },
  historyType: { color: "#666", fontSize: 13, marginTop: 4 },

  quickMsgContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 100,
  },
  msgBtn: {
    backgroundColor: "#2C2C2E",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#444",
  },
  msgText: { color: "#AAA", fontSize: 13 },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1C1C1E",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  btnRow: { flexDirection: "row", gap: 12 },
  acceptBtn: {
    flex: 1,
    backgroundColor: "#FF9500",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  declineBtn: {
    flex: 1,
    backgroundColor: "#2C2C2E",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#444",
  },
  acceptText: { color: "#000", fontWeight: "bold", fontSize: 16 },
  declineText: { color: "#AAA", fontWeight: "bold", fontSize: 16 },
  proposeBtn: { alignSelf: "center", marginTop: 15 },
  proposeText: { color: "#FF9500", fontSize: 14, fontWeight: "bold" },
});
