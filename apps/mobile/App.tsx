import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { AuthProvider, useAuthContext } from "./src/context/AuthContext";

// --- IMPORTS SCREEN ---
import LoginScreen from "./src/screens/auth/LoginScreen";
import MainTab from "@/navigations/MainTab";
import PtMainTab from "@/navigations/PtMainTab";
import PtPublicDetail from "@/screens/main/trainer/PtPublicDetail";
import MyBookingsScreen from "@/screens/main/booking/MyBookingsScreen";
import OnboardingScreen from "@/screens/auth/OnboardingScreen";
import PlanDetailScreen from "@/screens/main/workouts/PlanDetailScreen";
import GeneratingPlanScreen from "@/screens/auth/GeneratingPlanScreen";
import WorkoutPlayerScreen from "@/screens/main/workouts/WorkoutPlayerScreen";
import WorkoutTypesScreen from "@/screens/main/workouts/WorkoutTypesScreen";
import WorkoutTypeWorkoutsScreen from "@/screens/main/workouts/WorkoutTypeWorkoutsScreen";
import WorkoutVideoScreen from "@/screens/main/workouts/WorkoutVideoScreen";
import PtRegisterScreen from "@/screens/auth/PtRegisterScreen";
import RegisterScreen from "@/screens/auth/RegisterScreen";
import VerifyOtpScreen from "@/screens/auth/VerifyOtpScreen";
import ResetPasswordScreen from "@/screens/auth/ResetPasswordScreen";
import ForgotPasswordScreen from "@/screens/auth/ForgotPasswordScreen";
import PtScheduleScreen from "@/screens/main/pt/PtScheduleScreen";
import PtSetAvailabilityScreen from "@/screens/main/pt/PtSetAvailabilityScreen";
import PtBookingRequestsScreen from "@/screens/main/pt/PtBookingRequestsScreen";
import PtBookingDetailScreen from "@/screens/main/pt/PtBookingDetailScreen";
import PremiumDetailScreen from "@/screens/main/premium/PremiumDetailScreen";
import TransactionHistoryScreen from "@/screens/main/payment/TransactionHistoryScreen";
import TransactionDetailScreen from "@/screens/main/payment/TransactionDetailScreen";
import AiChatConversationsScreen from "@/screens/main/chat/AiChatConversationsScreen";
import AiChatDetailScreen from "@/screens/main/chat/AiChatDetailScreen";
import TopUpPointScreen from "@/screens/main/topup/TopUpPointScreen";
import PaymentResultScreen from "@/screens/main/topup/PaymentResultScreen"; // 👈 THÊM MỚI
import PaymentWebViewScreen from "@/screens/main/topup/PaymentWebViewScreen";
import TopUpHistoryScreen from "@/screens/main/topup/TopUpHistoryScreen";

// 🛠️ CẤU HÌNH LINKING ĐỂ BẮT ĐƯỜNG DẪN fitup://payment-result
const linking = {
  prefixes: ["fitup://"],
  config: {
    screens: {
      PaymentResult: "payment-result",
    },
  },
};

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
      const userId = decoded["sub"];
      login(role, userId);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: "fade" }}>
      {!isAuthenticated ? (
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
        <Stack.Group>
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

          {/* CÁC MÀN HÌNH CHUNG CHẤP NHẬN CẢ USER & PT */}
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="PlanDetail" component={PlanDetailScreen} />
          <Stack.Screen
            name="GeneratingPlan"
            component={GeneratingPlanScreen}
          />
          <Stack.Screen name="WorkoutPlayer" component={WorkoutPlayerScreen} />
          <Stack.Screen name="WorkoutTypes" component={WorkoutTypesScreen} />
          <Stack.Screen
            name="WorkoutTypeWorkouts"
            component={WorkoutTypeWorkoutsScreen}
          />
          <Stack.Screen name="WorkoutVideo" component={WorkoutVideoScreen} />
          <Stack.Screen name="PremiumDetail" component={PremiumDetailScreen} />
          <Stack.Screen
            name="TransactionHistory"
            component={TransactionHistoryScreen}
          />
          <Stack.Screen
            name="TransactionDetail"
            component={TransactionDetailScreen}
          />
          
          <Stack.Screen
            name="AiChatConversations"
            component={AiChatConversationsScreen}
          />
          <Stack.Screen name="AiChatDetail" component={AiChatDetailScreen} />
          <Stack.Screen name="TopUpPoint" component={TopUpPointScreen} />

          {/* 👈 MÀN HÌNH KẾT QUẢ THANH TOÁN */}
          <Stack.Screen name="PaymentResult" component={PaymentResultScreen} />
          <Stack.Screen
            name="PaymentWebView"
            component={PaymentWebViewScreen}
            options={{ title: "Thanh toán PayOS" }}
          />
          <Stack.Screen name="TopUpHistory" component={TopUpHistoryScreen} />

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
          {/* 💡 THÊM linkling VÀO ĐÂY */}
          <NavigationContainer linking={linking}>
            <RootNavigation />
          </NavigationContainer>
        </SafeAreaProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
