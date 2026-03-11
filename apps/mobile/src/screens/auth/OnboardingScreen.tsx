import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useOnboarding } from "@/hooks/useOnboarding";

const { width } = Dimensions.get("window");

// ĐỊNH NGHĨA ENUM CHO UI
const GOAL_OPTIONS = [
  { l: "Giảm mỡ", v: 1 },
  { l: "Tăng cơ", v: 2 },
  { l: "Duy trì", v: 3 },
];
const LEVEL_OPTIONS = [
  { l: "Người mới", v: 1 },
  { l: "Trung bình", v: 2 },
  { l: "Nâng cao", v: 3 },
];
const EQUIP_OPTIONS = [
  { l: "Tay không (Bodyweight)", v: 1 },
  { l: "Dụng cụ cơ bản", v: 2 },
  { l: "Gym đầy đủ", v: 3 },
];
const FOCUS_OPTIONS = [
  { l: "Toàn thân", v: "Full Body" },
  { l: "Ngực", v: "Chest" },
  { l: "Lưng", v: "Back" },
  { l: "Bụng", v: "Abs" },
  { l: "Chân", v: "Legs" },
];

export default function OnboardingScreen() {
  const { submitOnboarding, isLoading } = useOnboarding();
  const [currentStep, setCurrentStep] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Khởi tạo đúng 8 trường dữ liệu Hàn yêu cầu
  const [formData, setFormData] = useState({
    goalType: 1,
    experienceLevel: 1,
    weeks: 4,
    daysPerWeek: 3,
    minutesPerSession: 30,
    equipment: 1,
    focusAreas: "Full Body",
    limitations: "Không có",
  });

  const steps = [
    { id: 0, title: "Mục tiêu & Trình độ" },
    { id: 1, title: "Thời gian tập luyện" },
    { id: 2, title: "Trang thiết bị & Vùng tập" },
    { id: 3, title: "Lưu ý sức khỏe" },
  ];

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
    } else {
      // Gửi đúng bộ JSON Hàn đã cung cấp
      console.log("🚀 Submit JSON:", JSON.stringify(formData, null, 2));
      submitOnboarding(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      flatListRef.current?.scrollToIndex({ index: prev, animated: true });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={{ opacity: currentStep === 0 ? 0 : 1 }}
          disabled={currentStep === 0}
        >
          <Ionicons name="chevron-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${((currentStep + 1) / steps.length) * 100}%` },
            ]}
          />
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={steps}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.page}>
            <Text style={styles.stepTitle}>{item.title}</Text>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 40 }}
            >
              {item.id === 0 && (
                <>
                  <Label text="Mục tiêu của bạn" />
                  <Selector
                    options={GOAL_OPTIONS}
                    current={formData.goalType}
                    onSelect={(v) => updateField("goalType", v)}
                  />
                  <Label text="Trình độ hiện tại" />
                  <Selector
                    options={LEVEL_OPTIONS}
                    current={formData.experienceLevel}
                    onSelect={(v) => updateField("experienceLevel", v)}
                  />
                </>
              )}

              {item.id === 1 && (
                <>
                  <Counter
                    label="Tổng số tuần"
                    value={formData.weeks}
                    onAdd={() => updateField("weeks", formData.weeks + 1)}
                    onSub={() =>
                      updateField("weeks", Math.max(1, formData.weeks - 1))
                    }
                  />
                  <Counter
                    label="Số buổi mỗi tuần"
                    value={formData.daysPerWeek}
                    onAdd={() =>
                      updateField(
                        "daysPerWeek",
                        Math.min(7, formData.daysPerWeek + 1),
                      )
                    }
                    onSub={() =>
                      updateField(
                        "daysPerWeek",
                        Math.max(1, formData.daysPerWeek - 1),
                      )
                    }
                  />
                  <Counter
                    label="Số phút mỗi buổi"
                    step={5}
                    value={formData.minutesPerSession}
                    onAdd={() =>
                      updateField(
                        "minutesPerSession",
                        formData.minutesPerSession + 5,
                      )
                    }
                    onSub={() =>
                      updateField(
                        "minutesPerSession",
                        Math.max(10, formData.minutesPerSession - 5),
                      )
                    }
                  />
                </>
              )}

              {item.id === 2 && (
                <>
                  <Label text="Dụng cụ có sẵn" />
                  <Selector
                    options={EQUIP_OPTIONS}
                    current={formData.equipment}
                    onSelect={(v) => updateField("equipment", v)}
                  />
                  <Label text="Vùng muốn tập trung" />
                  <Selector
                    options={FOCUS_OPTIONS}
                    current={formData.focusAreas}
                    onSelect={(v) => updateField("focusAreas", v)}
                  />
                </>
              )}

              {item.id === 3 && (
                <>
                  <Label text="Lưu ý về chấn thương / sức khỏe" />
                  <TextInput
                    style={styles.input}
                    multiline
                    placeholder="Ví dụ: Đau lưng dưới, thoát vị, mới phẫu thuật..."
                    placeholderTextColor="#555"
                    value={formData.limitations}
                    onChangeText={(t) => updateField("limitations", t)}
                  />
                  <Text style={styles.tipText}>
                    * AI sẽ điều chỉnh bài tập để tránh các vùng chấn thương của
                    bạn.
                  </Text>
                </>
              )}
            </ScrollView>
          </View>
        )}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.btn}
          onPress={handleNext}
          disabled={isLoading}
        >
          <LinearGradient
            colors={["#FF9500", "#F47100"]}
            style={styles.gradient}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.btnText}>
                {currentStep === steps.length - 1 ? "HOÀN TẤT" : "TIẾP THEO"}
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// COMPONENTS CON
const Label = ({ text }: any) => <Text style={styles.label}>{text}</Text>;

const Selector = ({ options, current, onSelect }: any) => (
  <View style={styles.selectorRow}>
    {options.map((opt: any) => (
      <TouchableOpacity
        key={opt.v}
        onPress={() => onSelect(opt.v)}
        style={[styles.optBtn, current === opt.v && styles.optBtnActive]}
      >
        <Text
          style={[styles.optText, current === opt.v && styles.optTextActive]}
        >
          {opt.l}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

const Counter = ({ label, value, onAdd, onSub }: any) => (
  <View style={styles.counterRow}>
    <Text style={styles.counterLabel}>{label}</Text>
    <View style={styles.counterActions}>
      <TouchableOpacity onPress={onSub} style={styles.circleBtn}>
        <Ionicons name="remove" size={20} color="#FFF" />
      </TouchableOpacity>
      <Text style={styles.counterValue}>{value}</Text>
      <TouchableOpacity onPress={onAdd} style={styles.circleBtn}>
        <Ionicons name="add" size={20} color="#FFF" />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  progressContainer: {
    flex: 1,
    height: 4,
    backgroundColor: "#222",
    borderRadius: 2,
    marginLeft: 15,
  },
  progressBar: { height: "100%", backgroundColor: "#FF9500", borderRadius: 2 },
  page: { width: width, padding: 25 },
  stepTitle: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    color: "#888",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 25,
    marginBottom: 12,
  },
  selectorRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  optBtn: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 15,
    backgroundColor: "#1C1C1E",
    borderWidth: 1,
    borderColor: "#333",
  },
  optBtnActive: { borderColor: "#FF9500", backgroundColor: "#261C12" },
  optText: { color: "#666", fontWeight: "bold" },
  optTextActive: { color: "#FF9500" },
  counterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
  },
  counterLabel: { color: "#FFF", fontSize: 16 },
  counterActions: { flexDirection: "row", alignItems: "center" },
  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  counterValue: {
    color: "#FF9500",
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 20,
  },
  input: {
    backgroundColor: "#1C1C1E",
    borderRadius: 15,
    padding: 20,
    color: "#FFF",
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: "top",
  },
  tipText: { color: "#444", fontSize: 12, marginTop: 10 },
  footer: { padding: 25 },
  btn: { height: 60, borderRadius: 20, overflow: "hidden" },
  gradient: { flex: 1, justifyContent: "center", alignItems: "center" },
  btnText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 1,
  },
});
