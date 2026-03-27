import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/hooks/useAuth";
import * as DocumentPicker from "expo-document-picker";
import * as Print from "expo-print";
import { File } from "expo-file-system";
interface CertificationFile {
  fileName: string;
  fileUrl: string;
  contentType: string;
  fileSize: number;
}

export default function PtRegisterScreen() {
  const navigation = useNavigation();
  const { registerPtMutation } = useAuth();

  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    experienceYears: 1,
    hourlyPointRate: 200000,
    location: "",
    certifications: [] as string[],
    specialties: [] as string[],
    languages: [] as string[],
    certificationFiles: [] as CertificationFile[],
  });

  const [currentCert, setCurrentCert] = useState("");
  const [currentLang, setCurrentLang] = useState("");

  const specialtiesList = [
    "Weight Loss",
    "Muscle Gain",
    "Injury Rehab",
    "Yoga",
    "Sports Training",
  ];

  // HÀM XỬ LÝ GỬI HỒ SƠ
  const handleRegister = () => {
    if (!formData.displayName || !formData.location || !formData.bio) {
      Alert.alert(
        "Thiếu thông tin",
        "Vui lòng điền đầy đủ Tên, Bio và Địa chỉ.",
      );
      return;
    }

    if (formData.specialties.length === 0) {
      Alert.alert("Lỗi", "Vui lòng chọn ít nhất một chuyên môn.");
      return;
    }

    // Gọi Mutation từ useAuth
    registerPtMutation.mutate(formData, {
      onSuccess: () => {
        Alert.alert(
          "Thành công",
          "Hồ sơ của bạn đã được gửi đi. Vui lòng chờ quản trị viên phê duyệt!",
          [{ text: "OK", onPress: () => navigation.goBack() }],
        );
      },
      onError: (err: any) => {
        // 🔥 CHIẾN THUẬT LOG MỚI:
        console.log("--- ❌ LỖI ĐĂNG KÝ PT ---");
        console.log("Status:", err.response?.status); // Ví dụ: 400, 401, 500
        console.log(
          "Message từ Server:",
          JSON.stringify(err.response?.data, null, 2),
        );
        console.log(
          "Dữ liệu bạn đã gửi đi:",
          JSON.stringify(formData, null, 2),
        );

        Alert.alert("Lỗi", err.response?.data?.msg || "Gửi hồ sơ thất bại.");
      },
    });
  };

  // Helper xóa phần tử trong mảng
  const removeItem = (field: "languages" | "certifications", value: string) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((i) => i !== value),
    });
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"], // Chỉ cho phép PDF và Ảnh
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const file = result.assets[0];

        // 2. Map dữ liệu từ Expo Picker sang interface của Hàn
        const newFile: CertificationFile = {
          fileName: file.name,
          fileUrl: file.uri, // Đây là Local URI, dùng để upload lên server sau này
          contentType: file.mimeType || "application/octet-stream",
          fileSize: file.size || 0,
        };

        // 3. Cập nhật vào danh sách file trong formData
        setFormData((prev) => ({
          ...prev,
          certificationFiles: [...prev.certificationFiles, newFile],
        }));

        console.log("✅ Đã chọn file:", file.name);
      }
    } catch (err) {
      console.error("❌ Lỗi chọn file:", err);
      Alert.alert("Lỗi", "Không thể chọn tài liệu lúc này.");
    }
  };

  const createMockPDF = async () => {
    try {
      // 1. Tạo HTML (giữ nguyên)
      const html = `...`;

      // 2. Chuyển thành PDF (giữ nguyên)
      const { uri } = await Print.printToFileAsync({ html });

      // 3. CÁCH MỚI: Dùng class File để lấy thông tin
      const file = new File(uri);

      // Lấy kích thước file (size là một property có sẵn trong class File mới)
      const fileSize = await file.size;

      const mockFile: CertificationFile = {
        fileName: `Cert_Mock_${Date.now()}.pdf`,
        fileUrl: uri,
        contentType: "application/pdf",
        fileSize: fileSize || 0,
      };

      // 4. Đẩy vào state (giữ nguyên)
      setFormData((prev) => ({
        ...prev,
        certificationFiles: [...prev.certificationFiles, mockFile],
      }));

      Alert.alert("Thành công", "Đã tạo chứng chỉ giả lập bằng API mới!");
    } catch (error) {
      console.error("❌ Lỗi tạo PDF:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>HỒ SƠ PT</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollBody}
        >
          <Text style={styles.title}>Đăng ký Trở thành PT</Text>

          {/* 1. THÔNG TIN CƠ BẢN */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>1. Thông tin cơ bản</Text>
            <Text style={styles.label}>Tên hiển thị *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ví dụ: PT 6-paks"
              placeholderTextColor="#555"
              onChangeText={(v) => setFormData({ ...formData, displayName: v })}
            />

            <Text style={styles.label}>Giới thiệu bản thân (Bio) *</Text>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: "top" }]}
              multiline
              placeholder="Kinh nghiệm, phong cách huấn luyện..."
              placeholderTextColor="#555"
              onChangeText={(v) => setFormData({ ...formData, bio: v })}
            />

            <Text style={styles.label}>Khu vực làm việc (Location) *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ví dụ: Dĩ An, Bình Dương"
              placeholderTextColor="#555"
              onChangeText={(v) => setFormData({ ...formData, location: v })}
            />
          </View>

          {/* 2. KINH NGHIỆM & CHI PHÍ */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>2. Kinh nghiệm & Chi phí</Text>
            <View style={styles.rowBetween}>
              <View style={{ width: "45%" }}>
                <Text style={styles.label}>Số năm KN</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="1"
                  placeholderTextColor="#555"
                  onChangeText={(v) =>
                    setFormData({
                      ...formData,
                      experienceYears: Number(v) || 0,
                    })
                  }
                />
              </View>
              <View style={{ width: "50%" }}>
                <Text style={styles.label}>Giá/Giờ (Points)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="200,000"
                  placeholderTextColor="#555"
                  onChangeText={(v) =>
                    setFormData({
                      ...formData,
                      hourlyPointRate: Number(v) || 0,
                    })
                  }
                />
              </View>
            </View>

            <Text style={styles.label}>Ngôn ngữ (Nhập rồi bấm Enter)</Text>
            <TextInput
              style={styles.input}
              placeholder="Tiếng Việt, Tiếng Anh..."
              placeholderTextColor="#555"
              value={currentLang}
              onChangeText={setCurrentLang}
              onSubmitEditing={() => {
                if (currentLang.trim()) {
                  setFormData({
                    ...formData,
                    languages: [...formData.languages, currentLang.trim()],
                  });
                  setCurrentLang("");
                }
              }}
            />
            <View style={styles.tagRow}>
              {formData.languages.map((l) => (
                <TouchableOpacity
                  key={l}
                  style={styles.tag}
                  onPress={() => removeItem("languages", l)}
                >
                  <Text style={styles.tagText}>{l} ✕</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 3. CHUYÊN MÔN & CHỨNG CHỈ */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>3. Chuyên môn & Chứng chỉ</Text>
            <Text style={styles.label}>Chuyên môn (Chọn nhiều)</Text>
            <View style={styles.checkboxGrid}>
              {specialtiesList.map((item) => {
                const isSelected = formData.specialties.includes(item);
                return (
                  <TouchableOpacity
                    key={item}
                    style={styles.checkItem}
                    onPress={() => {
                      setFormData({
                        ...formData,
                        specialties: isSelected
                          ? formData.specialties.filter((i) => i !== item)
                          : [...formData.specialties, item],
                      });
                    }}
                  >
                    <Ionicons
                      name={isSelected ? "checkbox" : "square-outline"}
                      size={22}
                      color={isSelected ? "#FF9500" : "#555"}
                    />
                    <Text
                      style={[
                        styles.checkLabel,
                        isSelected && { color: "#FFF" },
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.label}>
              Bằng cấp/Chứng chỉ (Nhập rồi bấm Enter)
            </Text>
            <TextInput
              style={styles.input}
              placeholder="NASM, ACE, Bằng cử nhân TDTT..."
              placeholderTextColor="#555"
              value={currentCert}
              onChangeText={setCurrentCert}
              onSubmitEditing={() => {
                if (currentCert.trim()) {
                  setFormData({
                    ...formData,
                    certifications: [
                      ...formData.certifications,
                      currentCert.trim(),
                    ],
                  });
                  setCurrentCert("");
                }
              }}
            />
            <View style={styles.tagRow}>
              {formData.certifications.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.tag, { backgroundColor: "#5856D620" }]}
                  onPress={() => removeItem("certifications", c)}
                >
                  <Text style={[styles.tagText, { color: "#AF52DE" }]}>
                    {c} ✕
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 4. FILE ĐÍNH KÈM */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>4. Hồ sơ đính kèm</Text>
            <TouchableOpacity
              style={styles.uploadBtn}
              onPress={pickDocument} // <-- Thay bằng hàm vừa viết
            >
              <Ionicons name="cloud-upload-outline" size={28} color="#FF9500" />
              <Text style={styles.uploadText}>
                Tải lên CMND hoặc Bằng cấp (PDF/Ảnh)
              </Text>
            </TouchableOpacity>

            {formData.certificationFiles.map((f, i) => (
              <View key={i} style={styles.fileRow}>
                <Ionicons name="document-attach" size={18} color="#4CD964" />
                <Text style={styles.fileText} numberOfLines={1}>
                  {f.fileName}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setFormData({
                      ...formData,
                      certificationFiles: formData.certificationFiles.filter(
                        (_, idx) => idx !== i,
                      ),
                    });
                  }}
                >
                  <Ionicons name="close-circle" size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.uploadBtn, { borderColor: "#4CD964" }]}
            onPress={createMockPDF}
          >
            <Ionicons name="construct-outline" size={28} color="#4CD964" />
            <Text style={[styles.uploadText, { color: "#4CD964" }]}>
              [DEBUG] Tự tạo PDF giả lập để Test
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.submitBtn,
              registerPtMutation.isPending && { opacity: 0.6 },
            ]}
            onPress={handleRegister}
            disabled={registerPtMutation.isPending}
          >
            {registerPtMutation.isPending ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.submitText}>GỬI HỒ SƠ DUYỆT</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    height: 50,
  },
  headerTitle: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1.2,
  },
  scrollBody: { padding: 20 },
  title: {
    color: "#FF9500",
    fontSize: 26,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 25,
  },
  card: {
    backgroundColor: "#1C1C1E",
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#FF9500",
    paddingLeft: 10,
  },
  label: {
    color: "#888",
    fontSize: 13,
    marginTop: 12,
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    padding: 14,
    color: "#FFF",
    fontSize: 15,
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between" },
  tagRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 12 },
  tag: {
    backgroundColor: "#FF950020",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  tagText: { color: "#FF9500", fontSize: 13, fontWeight: "600" },
  checkboxGrid: { flexDirection: "row", flexWrap: "wrap", marginTop: 5 },
  checkItem: {
    flexDirection: "row",
    width: "50%",
    alignItems: "center",
    marginBottom: 15,
  },
  checkLabel: { color: "#888", marginLeft: 10, fontSize: 14 },
  uploadBtn: {
    borderStyle: "dashed",
    borderWidth: 1.5,
    borderColor: "#333",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#121212",
  },
  uploadText: {
    color: "#666",
    marginTop: 10,
    fontSize: 13,
    textAlign: "center",
  },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#2C2C2E",
    padding: 12,
    borderRadius: 10,
  },
  fileText: { color: "#4CD964", flex: 1, marginLeft: 10, fontSize: 13 },
  submitBtn: {
    backgroundColor: "#FF9500",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 50,
    shadowColor: "#FF9500",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  submitText: {
    color: "#121212",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 1,
  },
});
