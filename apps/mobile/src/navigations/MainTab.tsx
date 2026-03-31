import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Import các màn hình (Hàn có thể tạo file trống cho các màn chưa có)
import HomeScreen from "@/screens/auth/HomeScreen";
import ProfileScreen from "@/screens/main/profile/ProfileScreen";
import UserExploreScreen from "@/screens/main/trainer/UserExploreScreen";
import PremiumScreen from "@/screens/main/premium/PremiumScreen";
const Placeholder = () => <HomeScreen />;
const Tab = createBottomTabNavigator();

export default function MainTab() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#1A1A1A",
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: "#FF9500",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;
          if (route.name === "Home")
            iconName = focused ? "home" : "home-outline";
          else if (route.name === "Workouts")
            iconName = focused ? "barbell" : "barbell-outline";
          else if (route.name === "Premium")
            iconName = focused ? "diamond" : "diamond-outline";
          else if (route.name === "Trainers")
            iconName = focused ? "people" : "people-outline";
          else if (route.name === "Profile")
            iconName = focused ? "person" : "person-outline";

          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Workouts" component={Placeholder} />
      <Tab.Screen name="Premium" component={PremiumScreen} />
      <Tab.Screen name="Trainers" component={UserExploreScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
