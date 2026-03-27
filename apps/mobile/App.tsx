import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { AuthProvider, useAuthContext } from "./src/context/AuthContext";

import LoginScreen from "./src/screens/auth/LoginScreen";
import MainTab from "@/navigations/MainTab";
import PtMainTab from "@/navigations/PtMainTab";
import PtPublicDetail from "@/screens/main/trainer/PtPublicDetail";
import MyBookingsScreen from "@/screens/main/booking/MyBookingsScreen";
import OnboardingScreen from "@/screens/auth/OnboardingScreen";
import PlanDetailScreen from "@/screens/main/workouts/PlanDetailScreen";
import GeneratingPlanScreen from "@/screens/auth/GeneratingPlanScreen";
import WorkoutPlayerScreen from "@/screens/main/workouts/WorkoutPlayerScreen";
import PtRegisterScreen from "@/screens/auth/PtRegisterScreen";
import RegisterScreen from "@/screens/auth/RegisterScreen";
import VerifyOtpScreen from "@/screens/auth/VerifyOtpScreen";
import ResetPasswordScreen from "@/screens/auth/ResetPasswordScreen";
import ForgotPasswordScreen from "@/screens/auth/ForgotPasswordScreen";
import PtScheduleScreen from "@/screens/main/pt/PtScheduleScreen";
import PtSetAvailabilityScreen from "@/screens/main/pt/PtSetAvailabilityScreen";
import PtBookingRequestsScreen from "@/screens/main/pt/PtBookingRequestsScreen";
import PtBookingDetailScreen from "@/screens/main/pt/PtBookingDetailScreen";

const MS_ROLE_KEY =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});
const Stack = createNativeStackNavigator();

function RootNavigation() {
  const { isAuthenticated, userRole, login } = useAuthContext();

  const onLoginSuccess = (token: string) => {
    try {
      const decoded: any = jwtDecode(token);
      const role =
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      // 🔥 LẤY ID TỪ TRƯỜNG "sub"
      const userId = decoded["sub"];

      // Cập nhật vào Context (Hàn nhớ sửa hàm login trong Context để nhận 2 tham số nhé)
      login(role, userId);
      console.log("--- Role & UserId sent to Context ---");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: "fade" }}>
      {!isAuthenticated ? (
        //  NHÓM MÀN HÌNH KHI CHƯA ĐĂNG NHẬP
        <>
          <Stack.Screen name="Login">
            {(props) => (
              <LoginScreen {...props} onLoginSuccess={onLoginSuccess} />
            )}
          </Stack.Screen>
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
          />
        </>
      ) : (
        // BÊN TRONG FILE App.tsx

        <Stack.Group>
          {/* 1. ĐƯA MAIN LÊN ĐẦU TIÊN ĐỂ LÀM MẶC ĐỊNH */}
          {userRole === "PT" ? (
            <>
              <Stack.Screen name="PtMain" component={PtMainTab} />
              <Stack.Screen name="PtSchedule" component={PtScheduleScreen} />
              <Stack.Screen
                name="PtSetAvailability"
                component={PtSetAvailabilityScreen}
              />
              <Stack.Screen
                name="PtBookingRequests"
                component={PtBookingRequestsScreen}
              />
              <Stack.Screen
                name="PtBookingDetail"
                component={PtBookingDetailScreen}
              />
            </>
          ) : (
            <Stack.Screen name="Main" component={MainTab} />
          )}

          {/* 2. CÁC MÀN HÌNH KHÁC ĐỂ XUỐNG DƯỚI */}
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="PlanDetail" component={PlanDetailScreen} />
          <Stack.Screen
            name="GeneratingPlan"
            component={GeneratingPlanScreen}
          />
          <Stack.Screen name="WorkoutPlayer" component={WorkoutPlayerScreen} />

          {/* 3. CÁC MÀN HÌNH PHỤ CỦA USER */}
          {userRole !== "PT" && (
            <>
              <Stack.Screen name="PtPublicDetail" component={PtPublicDetail} />
              <Stack.Screen name="MyBookings" component={MyBookingsScreen} />
              <Stack.Screen name="PtRegister" component={PtRegisterScreen} />
            </>
          )}
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <RootNavigation />
          </NavigationContainer>
        </SafeAreaProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
