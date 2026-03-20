import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuthContext } from "@/context/AuthContext";
import { useAuth } from "@/hooks/useAuth";

export default function ProfileScreen() {
  const { logout: clearToken } = useAuth(); // Xóa storage
  const { logout: setLogoutState } = useAuthContext(); // Đổi Navigator

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn thoát?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          await clearToken();
          setLogoutState(); // Navigator tự nhảy về Login ngay lập tức
        },
      },
    ]);
  };

  const MenuItem = ({ icon, title, color = "#FFF" }: any) => (
    <TouchableOpacity style={styles.menuItem}>
      <View style={styles.menuLeft}>
        <Ionicons name={icon} size={22} color={color} />
        <Text style={[styles.menuText, { color }]}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#444" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150" }}
            style={styles.avatar}
          />
          <Text style={styles.name}>Phạm Việt Hàn</Text>
          <Text style={styles.email}>hanphamviet6@gmail.com</Text>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editBtnText}>Chỉnh sửa hồ sơ</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tài khoản</Text>
          <MenuItem icon="person-outline" title="Thông tin cá nhân" />
          <MenuItem icon="shield-checkmark-outline" title="Bảo mật" />
          <MenuItem icon="notifications-outline" title="Thông báo" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hỗ trợ</Text>
          <MenuItem icon="help-circle-outline" title="Trung tâm trợ giúp" />
          <MenuItem icon="settings-outline" title="Cài đặt" />
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: { alignItems: "center", padding: 30 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#FF9500",
  },
  name: { color: "#FFF", fontSize: 22, fontWeight: "bold", marginTop: 15 },
  email: { color: "#888", fontSize: 14 },
  editBtn: {
    backgroundColor: "#1C1C1E",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 15,
  },
  editBtnText: { color: "#FF9500", fontWeight: "bold" },
  section: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: {
    color: "#555",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#1A1A1A",
  },
  menuLeft: { flexDirection: "row", alignItems: "center" },
  menuText: { color: "#FFF", fontSize: 16, marginLeft: 15 },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
    padding: 16,
    backgroundColor: "#1A1A1A",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#330000",
  },
  logoutText: {
    color: "#FF3B30",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
});
