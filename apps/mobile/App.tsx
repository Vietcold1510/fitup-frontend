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
      const role = decoded[MS_ROLE_KEY];
      login(role); // Cập nhật vào Context
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: "fade" }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Login">
          {(props) => (
            <LoginScreen {...props} onLoginSuccess={onLoginSuccess} />
          )}
        </Stack.Screen>
      ) : (
        <Stack.Group>
          {userRole === "PT" ? (
            <Stack.Screen name="PtMain" component={PtMainTab} />
          ) : (
            <>
              <Stack.Screen name="Main" component={MainTab} />
              <Stack.Screen name="PtPublicDetail" component={PtPublicDetail} />
              <Stack.Screen name="MyBookings" component={MyBookingsScreen} />
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
