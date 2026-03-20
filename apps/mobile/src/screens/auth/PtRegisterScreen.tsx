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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth";

interface CertificationFile {
  fileName: string;
  fileUrl: string;
  contentType: string;
  fileSize: number;
}

export default function PtRegisterScreen() {
  const { registerPtMutation } = useAuth();

  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    experienceYears: 1, // Mặc định 1 năm
    hourlyPointRate: 200000,
    location: "",
    certifications: [] as string[],
    specialties: [] as string[],
    languages: [] as string[],
    certificationFiles: [] as CertificationFile[],
  });

  const [currentCert, setCurrentCert] = useState(""); // Để nhập text certifications
  const [currentLang, setCurrentLang] = useState(""); // Để nhập text languages

  const specialtiesList = [
    "Weight Loss",
    "Muscle Gain",
    "Injury Rehab",
    "Yoga",
    "Sports Training",
  ];

  const handleRegister = () => {
    if (!formData.displayName || !formData.location) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ các trường bắt buộc (*)");
      return;
    }
    registerPtMutation.mutate(formData);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollBody}
      >
        <Text style={styles.title}>Đăng ký Trở thành PT</Text>

        {/* SECTION 1: THÔNG TIN CƠ BẢN */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>1. Thông tin cơ bản</Text>

          <Text style={styles.label}>Tên hiển thị *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ví dụ: PT Hàn 6-paks"
            placeholderTextColor="#555"
            onChangeText={(v) => setFormData({ ...formData, displayName: v })}
          />

          <Text style={styles.label}>Giới thiệu bản thân (Bio) *</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
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

        {/* SECTION 2: KINH NGHIỆM & CHI PHÍ */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>2. Kinh nghiệm & Chi phí</Text>

          <View style={styles.rowBetween}>
            <View style={{ width: "48%" }}>
              <Text style={styles.label}>Số năm KN</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="60"
                onChangeText={(v) =>
                  setFormData({ ...formData, experienceYears: Number(v) })
                }
              />
            </View>
            <View style={{ width: "48%" }}>
              <Text style={styles.label}>Giá/Giờ (Points)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="200000"
                onChangeText={(v) =>
                  setFormData({ ...formData, hourlyPointRate: Number(v) })
                }
              />
            </View>
          </View>

          <Text style={styles.label}>Ngôn ngữ (Bấm Enter để thêm)</Text>
          <TextInput
            style={styles.input}
            placeholder="English, Vietnamese..."
            value={currentLang}
            onChangeText={setCurrentLang}
            onSubmitEditing={() => {
              if (currentLang) {
                setFormData({
                  ...formData,
                  languages: [...formData.languages, currentLang],
                });
                setCurrentLang("");
              }
            }}
          />
          <View style={styles.tagRow}>
            {formData.languages.map((l) => (
              <Text key={l} style={styles.tag}>
                {l}
              </Text>
            ))}
          </View>
        </View>

        {/* SECTION 3: CHUYÊN MÔN & BẰNG CẤP */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>3. Chuyên môn & Chứng chỉ</Text>

          <Text style={styles.label}>Chuyên môn (Specialties)</Text>
          <View style={styles.checkboxGrid}>
            {specialtiesList.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.checkItem}
                onPress={() => {
                  const exists = formData.specialties.includes(item);
                  setFormData({
                    ...formData,
                    specialties: exists
                      ? formData.specialties.filter((i) => i !== item)
                      : [...formData.specialties, item],
                  });
                }}
              >
                <Ionicons
                  name={
                    formData.specialties.includes(item)
                      ? "checkbox"
                      : "square-outline"
                  }
                  size={20}
                  color="#FF9500"
                />
                <Text style={styles.checkLabel}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Chứng chỉ (Tên bằng cấp)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ví dụ: NASM, ACE..."
            value={currentCert}
            onChangeText={setCurrentCert}
            onSubmitEditing={() => {
              if (currentCert) {
                setFormData({
                  ...formData,
                  certifications: [...formData.certifications, currentCert],
                });
                setCurrentCert("");
              }
            }}
          />
        </View>

        {/* SECTION 4: FILE ĐÍNH KÈM */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>4. Hồ sơ đính kèm (Files)</Text>
          <TouchableOpacity
            style={styles.uploadBtn}
            onPress={() => {
              // Giả lập thêm file đúng cấu trúc API
              const mockFile = {
                fileName: "cert_6paks.pdf",
                fileUrl: "string",
                contentType: "application/pdf",
                fileSize: 1024,
              };
              setFormData({
                ...formData,
                certificationFiles: [...formData.certificationFiles, mockFile],
              });
            }}
          >
            <Ionicons name="cloud-upload-outline" size={24} color="#888" />
            <Text style={{ color: "#888", marginTop: 5 }}>
              Tải lên CMND/CCCD hoặc Bằng cấp
            </Text>
          </TouchableOpacity>

          {formData.certificationFiles.map((f, i) => (
            <View key={i} style={styles.fileRow}>
              <Ionicons name="document-text" size={16} color="#4CD964" />
              <Text style={styles.fileText}>
                {f.fileName} ({(f.fileSize / 1024).toFixed(1)}KB)
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.submitBtn,
            registerPtMutation.isPending && { opacity: 0.7 },
          ]}
          onPress={handleRegister}
          disabled={registerPtMutation.isPending}
        >
          {registerPtMutation.isPending ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitText}>Gửi hồ sơ duyệt</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  scrollBody: { padding: 20 },
  title: {
    color: "#FF9500",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#1C1C1E",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    paddingBottom: 5,
  },
  label: { color: "#888", fontSize: 13, marginTop: 10, marginBottom: 5 },
  input: {
    backgroundColor: "#2C2C2E",
    borderRadius: 8,
    padding: 12,
    color: "#FFF",
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between" },
  tagRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 10 },
  tag: {
    backgroundColor: "#FF950020",
    color: "#FF9500",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginRight: 8,
    marginBottom: 5,
    fontSize: 12,
  },
  checkboxGrid: { flexDirection: "row", flexWrap: "wrap", marginTop: 10 },
  checkItem: {
    flexDirection: "row",
    width: "50%",
    alignItems: "center",
    marginBottom: 10,
  },
  checkLabel: { color: "#CCC", marginLeft: 8, fontSize: 14 },
  uploadBtn: {
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    marginTop: 10,
  },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: "#000",
    padding: 8,
    borderRadius: 5,
  },
  fileText: { color: "#4CD964", marginLeft: 8, fontSize: 12 },
  submitBtn: {
    backgroundColor: "#A65E1F",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 40,
  },
  submitText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});
