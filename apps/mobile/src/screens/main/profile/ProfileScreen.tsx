import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthContext } from "@/context/AuthContext"; // Lấy Role từ đây

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { userRole, logout } = useAuthContext();

  return (
    <ScrollView style={styles.container}>
      {/* ... Các phần thông tin cá nhân của Hàn ở trên ... */}

      <View style={styles.content}>
        {/* CHỈ HIỆN NÚT ĐĂNG KÝ NẾU CHƯA LÀ PT */}
        {userRole !== "PT" && (
          <TouchableOpacity
            style={styles.ptCard}
            onPress={() => navigation.navigate("PtRegister")}
          >
            <LinearGradient
              colors={["#5856D6", "#AF52DE"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ptGradient}
            >
              <View style={styles.ptInfo}>
                <Text style={styles.ptTitle}>Trở thành PT chuyên nghiệp</Text>
                <Text style={styles.ptSub}>
                  Chia sẻ kinh nghiệm và gia tăng thu nhập ngay hôm nay!
                </Text>
              </View>
              <View style={styles.ptIconBox}>
                <Ionicons name="chevron-forward" size={20} color="#FFF" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* CÁC MENU KHÁC */}
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="settings-outline" size={22} color="#FFF" />
          <Text style={styles.menuText}>Cài đặt tài khoản</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, { marginTop: 40 }]}
          onPress={logout}
        >
          <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
          <Text style={[styles.menuText, { color: "#FF3B30" }]}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  content: { padding: 20, marginTop: 30 },
  ptCard: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 30,
    elevation: 5,
    shadowColor: "#AF52DE",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  ptGradient: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  ptInfo: { flex: 1 },
  ptTitle: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  ptSub: { color: "#EEE", fontSize: 12, marginTop: 4, opacity: 0.8 },
  ptIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#1C1C1E",
  },
  menuText: { color: "#FFF", fontSize: 16, marginLeft: 15 },
});
