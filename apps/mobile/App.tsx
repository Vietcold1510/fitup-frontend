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
            {/* Nhóm màn hình chính sau khi Login */}
            <Stack.Screen name="Main" component={MainTab} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
