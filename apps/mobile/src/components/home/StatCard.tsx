// src/components/home/StatCard.tsx
import { View, Text, StyleSheet } from "react-native";

export const StatCard = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) => (
  <View style={styles.card}>
    <Text style={[styles.value, { color }]}>{value}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1E1E1E",
    padding: 15,
    borderRadius: 16,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  value: { fontSize: 20, fontWeight: "bold" },
  label: { color: "#999", fontSize: 12, marginTop: 4 },
});
