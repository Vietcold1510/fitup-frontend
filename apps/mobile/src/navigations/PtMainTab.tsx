import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import PtDashboardScreen from "@/screens/main/pt/PtDashboardScreen";
import ProfileScreen from "@/screens/main/profile/ProfileScreen";
import { View, Text, StyleSheet } from "react-native";
import PtScheduleScreen from "@/screens/main/pt/PtScheduleScreen";
import PtBookingRequestsScreen from "@/screens/main/pt/PtBookingRequestsScreen";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Tab = createBottomTabNavigator();

export default function PtMainTab() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [
          styles.tabBar,
          {
            height: 58 + insets.bottom,
            paddingBottom: Math.max(insets.bottom, 10),
          },
        ],
        tabBarActiveTintColor: "#FF9500",
        tabBarInactiveTintColor: "#888",
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={PtDashboardScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chart-line" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={PtScheduleScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar-outline" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Requests"
        component={PtBookingRequestsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <View>
              <Ionicons name="notifications-outline" size={24} color={color} />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>5</Text>
              </View>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Available"
        component={PtDashboardScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="help-circle-outline" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#121212",
    borderTopWidth: 0,
    paddingTop: 4,
  },
  badge: {
    position: "absolute",
    right: -6,
    top: -2,
    backgroundColor: "#FF9500",
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { color: "#000", fontSize: 10, fontWeight: "bold" },
});
