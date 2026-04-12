import React, { useMemo } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import { buildLoopingVideoHtml, getWorkoutVideoSources } from "@/utils/workoutVideo";

type WorkoutVideoParams = {
  workoutName?: string;
  videoUrl?: string | null;
};

export default function WorkoutVideoScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { workoutName }: WorkoutVideoParams = route.params || {};
  const videoSources = useMemo(() => getWorkoutVideoSources(), []);

  const html = useMemo(() => buildLoopingVideoHtml(videoSources), [videoSources]);

  if (videoSources.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Video bài tập</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.center}>
          <Text style={styles.emptyText}>Không tìm thấy video để phát.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text numberOfLines={1} style={styles.headerTitle}>
          {workoutName || "Video bài tập"}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <WebView
        source={{ html }}
        originWhitelist={["*"]}
        allowFileAccess
        allowFileAccessFromFileURLs
        allowUniversalAccessFromFileURLs
        javaScriptEnabled
        domStorageEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#FF9500" />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    height: 60,
  },
  backBtn: { width: 40, height: 40, justifyContent: "center" },
  headerTitle: { color: "#FFF", fontSize: 18, fontWeight: "bold", maxWidth: "80%" },
  loading: {
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#121212",
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { color: "#9A9A9A" },
});
