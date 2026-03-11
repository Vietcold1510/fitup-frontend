import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import màn hình
import LoginScreen from "./src/screens/auth/LoginScreen";
import RegisterScreen from "./src/screens/auth/RegisterScreen";
import VerifyOtpScreen from "@/screens/auth/VerifyOtpScreen";
import ResetPasswordScreen from "@/screens/auth/ResetPasswordScreen";
import ForgotPasswordScreen from "@/screens/auth/ForgotPasswordScreen";
import MainTab from "@/navigations/MainTab";
import OnboardingScreen from "@/screens/auth/OnboardingScreen";
import GeneratingPlanScreen from "@/screens/auth/GeneratingPlanScreen";
import PlanOverviewScreen from "@/screens/main/workouts/PlanOverviewScreen";
import PlanDetailScreen from "@/screens/main/workouts/PlanDetailScreen";
import WorkoutPlayerScreen from "@/screens/main/workouts/WorkoutPlayerScreen";
import PtRegisterScreen from "@/screens/auth/PtRegisterScreen";

// 1. Khởi tạo Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // 2. Bao bọc bằng QueryClientProvider
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{ headerShown: false }}
          >
            {/* Nhóm màn hình Auth */}
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
            />
            <Stack.Screen
              name="ResetPassword"
              component={ResetPasswordScreen}
            />
            <Stack.Screen name="PtRegister" component={PtRegisterScreen} />
            {/* Nhóm màn hình chính sau khi Login */}
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen
              name="GeneratingPlan"
              component={GeneratingPlanScreen}
            />
            <Stack.Screen name="Main" component={MainTab} />
            <Stack.Screen
              name="PlanOverview"
              component={PlanOverviewScreen}
              options={{ title: "Chi tiết lộ trình", headerShown: false }}
            />
            <Stack.Screen name="PlanDetail" component={PlanDetailScreen} />
            <Stack.Screen
              name="WorkoutPlayer"
              component={WorkoutPlayerScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
