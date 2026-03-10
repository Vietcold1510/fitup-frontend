import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useHomeScreen } from "./useHomeScreen";

export default function HomeScreen() {
  const { homeData, isLoading, refetch } = useHomeScreen();

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#FF9500" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={refetch}
            tintColor="#FF9500"
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brand}>FitUp</Text>
          <View style={styles.userInfo}>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.userName}>{homeData.user.name}</Text>
              <Text style={styles.userPoints}>
                🔥 Point: {homeData.user.points}
              </Text>
            </View>
            <View style={styles.avatarWrapper}>
              <Image
                source={{ uri: "https://i.pravatar.cc/150?u=han" }}
                style={styles.avatar}
              />
              <View style={styles.crownBadge}>
                <Ionicons name="ribbon" size={10} color="white" />
              </View>
            </View>
          </View>
        </View>

        {/* Hero Banner */}
        <LinearGradient
          colors={["#FF9500", "#A65E1F"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.heroCard}
        >
          <Text style={styles.heroTitle}>Ready to Transform?</Text>
          <Text style={styles.heroSub}>
            Your AI-powered fitness journey starts here
          </Text>
          <TouchableOpacity style={styles.heroBtn}>
            <Text style={styles.heroBtnText}>Start Training</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatBox
            label="Workouts"
            value={homeData.stats.workouts}
            color="#FF9500"
          />
          <StatBox
            label="Day streaks"
            value={homeData.stats.streaks}
            color="#FF9500"
          />
          <StatBox
            label="Calories"
            value={homeData.stats.calories}
            color="#FF453A"
          />
        </View>

        {/* Today's Plan */}
        <Text style={styles.sectionTitle}>Today's Plan</Text>
        <View style={styles.planCard}>
          <View style={styles.planHeader}>
            <View>
              <Text style={styles.planTitle}>{homeData.todayPlan.title}</Text>
              <Text style={styles.planSub}>
                {homeData.todayPlan.duration} • {homeData.todayPlan.level}
              </Text>
            </View>
            <View style={styles.workoutIcon}>
              <Ionicons name="barbell" size={20} color="#FF9500" />
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${(homeData.todayPlan.progress / homeData.todayPlan.totalExercises) * 100}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              Progress {homeData.todayPlan.progress}/
              {homeData.todayPlan.totalExercises} exercises
            </Text>
          </View>

          <TouchableOpacity>
            <LinearGradient
              colors={["#FF9500", "#F47100"]}
              style={styles.continueBtn}
            >
              <Text style={styles.continueText}>Continue Workout</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Features Grid */}
        <Text style={styles.sectionTitle}>Features</Text>
        <View style={styles.featureGrid}>
          <FeatureCard
            title="Exercise Videos"
            sub="HD workout tutorials"
            icon="play-circle"
          />
          <FeatureCard
            title="Workout Log"
            sub="Track your progress"
            icon="clipboard"
          />
          <FeatureCard
            title="Meal Plans"
            sub="Nutrition guidance"
            icon="restaurant"
          />
          <FeatureCard
            title="AI Coach"
            sub="Personal training AI"
            icon="chatbubble-ellipses"
            isPro
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Các Component phụ bổ trợ
const StatBox = ({ label, value, color }: any) => (
  <View style={styles.statBox}>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const FeatureCard = ({ title, sub, icon, isPro }: any) => (
  <TouchableOpacity style={styles.featureCard}>
    <View style={styles.featureIcon}>
      <Ionicons name={icon} size={24} color="#FF9500" />
    </View>
    <Text style={styles.featureTitle}>{title}</Text>
    <Text style={styles.featureSub}>{sub}</Text>
    {isPro && (
      <View style={styles.proBadge}>
        <Text style={styles.proText}>PRO</Text>
      </View>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  center: { justifyContent: "center", alignItems: "center" },
  scrollContent: { padding: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  brand: { fontSize: 28, fontWeight: "bold", color: "#FFF" },
  userInfo: { flexDirection: "row", alignItems: "center" },
  userName: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  userPoints: { color: "#FF9500", fontSize: 12 },
  avatarWrapper: { marginLeft: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#333" },
  crownBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#FF9500",
    borderRadius: 10,
    padding: 2,
    borderWidth: 2,
    borderColor: "#121212",
  },
  heroCard: { padding: 25, borderRadius: 24, marginBottom: 20 },
  heroTitle: { color: "#FFF", fontSize: 24, fontWeight: "bold" },
  heroSub: { color: "#FFF", opacity: 0.8, marginVertical: 10 },
  heroBtn: {
    backgroundColor: "#FFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  heroBtnText: { color: "#A65E1F", fontWeight: "bold" },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  statBox: {
    backgroundColor: "#1E1E1E",
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 16,
    alignItems: "center",
  },
  statValue: { fontSize: 22, fontWeight: "bold" },
  statLabel: { color: "#999", fontSize: 12, marginTop: 4 },
  sectionTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  planCard: {
    backgroundColor: "#1E1E1E",
    padding: 20,
    borderRadius: 24,
    marginBottom: 25,
  },
  planHeader: { flexDirection: "row", justifyContent: "space-between" },
  planTitle: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  planSub: { color: "#999", fontSize: 13 },
  workoutIcon: { backgroundColor: "#2A2A2A", padding: 10, borderRadius: 12 },
  progressContainer: { marginVertical: 15 },
  progressBar: { height: 6, backgroundColor: "#333", borderRadius: 3 },
  progressFill: { height: "100%", backgroundColor: "#FF9500", borderRadius: 3 },
  progressText: { color: "#666", fontSize: 12, marginTop: 8 },
  continueBtn: {
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  continueText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    backgroundColor: "#1E1E1E",
    width: "48%",
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
  },
  featureIcon: {
    backgroundColor: "#2A2A2A",
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  featureTitle: { color: "#FFF", fontWeight: "bold", marginTop: 12 },
  featureSub: { color: "#666", fontSize: 11, marginTop: 4 },
  proBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#FF9500",
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  proText: { fontSize: 10, fontWeight: "bold", color: "#FFF" },
});
