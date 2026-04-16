import React, { useMemo } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";

// Import Screens
import PtDashboardScreen from "@/screens/main/pt/PtDashboardScreen";
import ProfileScreen from "@/screens/main/profile/ProfileScreen";
import PtScheduleScreen from "@/screens/main/pt/PtScheduleScreen";
import PtMyBookingsScreen from "@/screens/main/pt/PtMyBookingsScreen";

// Import API
import { bookingRequest } from "@/api/booking";

const Tab = createBottomTabNavigator();

export default function PtMainTab() {
  const insets = useSafeAreaInsets();

  // 1. Lấy danh sách lịch tập của PT từ Cache hoặc API
  const { data: res } = useQuery({
    queryKey: ["pt-my-bookings"],
    queryFn: () => bookingRequest.getPtBookings(),
    // Tùy chọn: Tự động refetch mỗi 30s để cập nhật đơn mới mà không cần load lại app
    refetchInterval: 30000,
  });

  // 2. Tính toán số lượng đơn đang ở trạng thái "Confirmed" (Chờ dạy)
  const confirmedCount = useMemo(() => {
    const bookings = res?.data?.data || [];
    return bookings.filter((item: any) => item.status === "Confirmed").length;
  }, [res]);

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
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={PtDashboardScreen}
        options={{
          tabBarLabel: "Thống kê",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chart-line" size={26} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Schedule"
        component={PtScheduleScreen}
        options={{
          tabBarLabel: "Lịch trống",
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar-outline" size={24} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="MyBookings"
        component={PtMyBookingsScreen}
        options={{
          tabBarLabel: "Lịch dạy",
          tabBarIcon: ({ color }) => (
            <Ionicons name="notifications-outline" size={26} color={color} />
          ),
          // 🚀 HIỂN THỊ SỐ LƯỢNG ĐƠN "CONFIRMED"
          tabBarBadge: confirmedCount > 0 ? confirmedCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: "#FF3B30", // Màu đỏ cảnh báo
            color: "#FFF",
            fontSize: 10,
            fontWeight: "bold",
            lineHeight: 15,
          },
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Cá nhân",
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
    borderTopWidth: 1,
    borderTopColor: "#1C1C1E",
    paddingTop: 4,
    elevation: 0, // Xóa shadow trên Android
  },
});
