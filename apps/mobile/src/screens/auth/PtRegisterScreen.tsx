import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth"; //

export default function PtRegisterScreen() {
  const { registerPtMutation } = useAuth(); //

  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    experienceYears: 0,
    hourlyPointRate: 200000,
    location: "Dĩ An",
    specialties: [] as string[],
    languages: ["Vietnamese"],
    certificationFiles: [],
  });

  const specialtiesList = [
    "Weight Loss",
    "Muscle Gain",
    "Injury Rehab",
    "Yoga",
    "Post-Natal",
    "Sports Training",
  ];

  const toggleSpecialty = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(item)
        ? prev.specialties.filter((i) => i !== item)
        : [...prev.specialties, item],
    }));
  };

  const handleRegister = () => {
    // Gọi API đăng ký PT đã tạo
    registerPtMutation.mutate(formData);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollBody}
      >
        <Text style={styles.title}>Apply to Become a Trainer</Text>
        <Text style={styles.subtitle}>
          Provide your info and certifications for verification.
        </Text>

        {/* SECTION 1: BASIC INFO */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNum}>1</Text>
            </View>
            <Text style={styles.sectionTitle}>Basic Information</Text>
          </View>

          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#555"
            onChangeText={(v) => setFormData({ ...formData, displayName: v })}
          />

          <Text style={styles.label}>Bio *</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            multiline
            placeholder="Introduce yourself..."
            placeholderTextColor="#555"
            onChangeText={(v) => setFormData({ ...formData, bio: v })}
          />
        </View>

        {/* SECTION 2: VERIFICATION */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNum}>2</Text>
            </View>
            <Text style={styles.sectionTitle}>Mandatory Verification</Text>
          </View>
          <View style={styles.alertBox}>
            <Ionicons name="warning-outline" size={16} color="#FF9500" />
            <Text style={styles.alertText}>
              Certification is Mandatory for Approval
            </Text>
          </View>

          <TouchableOpacity style={styles.uploadBox}>
            <Ionicons name="card-outline" size={32} color="#888" />
            <Text style={styles.uploadTitle}>Government ID (CMND/CCCD)</Text>
            <Text style={styles.uploadSub}>PDF, JPG, PNG (Max 5MB)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.uploadBox}>
            <Ionicons name="ribbon-outline" size={32} color="#888" />
            <Text style={styles.uploadTitle}>PT Certification *</Text>
            <Text style={styles.uploadSub}>Multiple files allowed</Text>
          </TouchableOpacity>
        </View>

        {/* SECTION 3: SPECIALIZATION */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNum}>3</Text>
            </View>
            <Text style={styles.sectionTitle}>Specialization & Experience</Text>
          </View>

          <Text style={styles.label}>Areas of Expertise</Text>
          <View style={styles.checkboxGrid}>
            {specialtiesList.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.checkboxItem}
                onPress={() => toggleSpecialty(item)}
              >
                <Ionicons
                  name={
                    formData.specialties.includes(item)
                      ? "checkbox"
                      : "square-outline"
                  }
                  size={20}
                  color={
                    formData.specialties.includes(item) ? "#FF9500" : "#888"
                  }
                />
                <Text style={styles.checkboxLabel}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
            <Text style={styles.submitText}>Submit for Review</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  scrollBody: { padding: 20 },
  title: {
    color: "#FFF",
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    color: "#888",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#1C1C1E",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FF9500",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  stepNum: { fontWeight: "bold", fontSize: 14 },
  sectionTitle: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  label: { color: "#FFF", marginTop: 15, marginBottom: 8, fontWeight: "600" },
  input: {
    backgroundColor: "#2C2C2E",
    borderRadius: 10,
    padding: 15,
    color: "#FFF",
  },
  alertBox: {
    flexDirection: "row",
    backgroundColor: "#261C12",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  alertText: { color: "#FF9500", marginLeft: 8, fontSize: 12 },
  uploadBox: {
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    marginBottom: 15,
  },
  uploadTitle: { color: "#FFF", marginTop: 10, fontWeight: "600" },
  uploadSub: { color: "#666", fontSize: 11, marginTop: 4 },
  checkboxGrid: { flexDirection: "row", flexWrap: "wrap" },
  checkboxItem: {
    flexDirection: "row",
    width: "50%",
    alignItems: "center",
    marginBottom: 15,
  },
  checkboxLabel: { color: "#CCC", marginLeft: 10, fontSize: 14 },
  submitBtn: {
    backgroundColor: "#A65E1F",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  submitText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
});
