import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function PaymentWebViewScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { checkoutUrl } = route.params || {};

  // Hàm kiểm tra và điều hướng
  const handleNavigationStateChange = (navState: any) => {
    const { url } = navState;

    // 🔍 LOG ĐỂ HÀN KIỂM TRA TRONG TERMINAL
    console.log("🔗 WebView đang ở URL:", url);

    // Kiểm tra nếu URL chứa đường dẫn trả về của Render
    // Lưu ý: Hàn hãy kiểm tra kỹ dấu "/" ở cuối URL trong console.log
    if (url.includes("fitupproject.onrender.com/api/topups/payos/return")) {
      console.log("🎯 Đã bắt được URL trả về! Đang chuyển hướng...");

      // Tách params thủ công (an toàn hơn URLSearchParams trong React Native)
      const params: any = {};
      const queryString = url.split("?")[1];
      if (queryString) {
        queryString.split("&").forEach((pair: string) => {
          const [key, value] = pair.split("=");
          params[key] = decodeURIComponent(value);
        });
      }

      // Quay về màn hình kết quả và truyền params
      navigation.replace("PaymentResult", params);
    }
  };

  if (!checkoutUrl) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#FFF" }}>Không tìm thấy link thanh toán</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: checkoutUrl }}
        onNavigationStateChange={handleNavigationStateChange}
        // Thêm cái này để hỗ trợ các App ngân hàng gọi Deep Link
        setSupportMultipleWindows={false}
        originWhitelist={["*"]}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#FF9500" />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loading: {
    position: "absolute",
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
});
