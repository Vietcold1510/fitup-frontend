import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useNavigation } from "@react-navigation/native";
import { aiChatRequest } from "@/api/aiChat";
import { handleErrorApi } from "@/lib/errors";
import { AiChatConversation } from "@/types/aiChat";

export default function AiChatConversationsScreen() {
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [conversationTitleInput, setConversationTitleInput] = useState("AI Chat");

  const {
    data: conversations = [],
    isLoading,
    isRefetching,
    refetch,
  } = useQuery<AiChatConversation[]>({
    queryKey: ["ai-chat-conversations"],
    queryFn: async () => {
      const res = await aiChatRequest.getConversations();
      return res.data.data || [];
    },
  });

  const createConversationMutation = useMutation({
    mutationFn: (title: string) => aiChatRequest.createConversation({ title }),
    onSuccess: (res) => {
      const createdConversation = res.data.data;
      setCreateModalVisible(false);
      queryClient.invalidateQueries({ queryKey: ["ai-chat-conversations"] });
      navigation.navigate("AiChatDetail", {
        conversationId: createdConversation.id,
        title: createdConversation.title,
      });
    },
    onError: (error) => handleErrorApi({ error }),
  });

  const deleteConversationMutation = useMutation({
    mutationFn: (conversationId: string) =>
      aiChatRequest.deleteConversation(conversationId),
    onSuccess: (_, conversationId) => {
      queryClient.invalidateQueries({ queryKey: ["ai-chat-conversations"] });
      queryClient.removeQueries({
        queryKey: ["ai-chat-conversation", conversationId],
      });
    },
    onError: (error) => handleErrorApi({ error }),
  });

  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) => {
      const timeA = new Date(a.lastMessageAt || a.createdAt).getTime();
      const timeB = new Date(b.lastMessageAt || b.createdAt).getTime();
      return timeB - timeA;
    });
  }, [conversations]);

  const onCreateConversation = () => {
    if (createConversationMutation.isPending) return;
    setConversationTitleInput("AI Chat");
    setCreateModalVisible(true);
  };

  const onCloseCreateModal = () => {
    if (createConversationMutation.isPending) return;
    setCreateModalVisible(false);
  };

  const onConfirmCreateConversation = () => {
    if (createConversationMutation.isPending) return;
    const finalTitle = conversationTitleInput.trim() || "AI Chat";
    createConversationMutation.mutate(finalTitle);
  };

  const onDeleteConversation = (conversation: AiChatConversation) => {
    Alert.alert(
      "Delete conversation",
      "Do you want to remove this conversation?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteConversationMutation.mutate(conversation.id),
        },
      ],
    );
  };

  const getConversationTime = (conversation: AiChatConversation) => {
    const latestTime = conversation.lastMessageAt || conversation.createdAt;
    return dayjs(latestTime).format("HH:mm - DD/MM/YYYY");
  };

  const renderConversationItem = ({ item }: { item: AiChatConversation }) => (
    <View style={styles.itemRow}>
      <TouchableOpacity
        style={styles.itemMain}
        onPress={() =>
          navigation.navigate("AiChatDetail", {
            conversationId: item.id,
            title: item.title,
          })
        }
      >
        <View style={styles.itemIcon}>
          <Ionicons name="chatbubble-ellipses-outline" size={18} color="#0A84FF" />
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle} numberOfLines={1}>
            {item.title || "AI Chat"}
          </Text>
          <Text style={styles.itemSubtitle} numberOfLines={1}>
            {item.lastMessageAt ? "Updated: " : "Created: "}
            {getConversationTime(item)}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => onDeleteConversation(item)}
        disabled={deleteConversationMutation.isPending}
      >
        <Ionicons name="trash-outline" size={18} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Danh sách hội thoại</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={() => refetch()}>
          {isRefetching ? (
            <ActivityIndicator size="small" color="#FF9500" />
          ) : (
            <Ionicons name="refresh" size={20} color="#FF9500" />
          )}
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#FF9500" />
        </View>
      ) : (
        <FlatList
          data={sortedConversations}
          keyExtractor={(item) => item.id}
          renderItem={renderConversationItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="chatbubbles-outline" size={34} color="#555" />
              <Text style={styles.emptyTitle}>No conversation yet</Text>
              <Text style={styles.emptySub}>
                Create a new conversation to start chatting with AI.
              </Text>
            </View>
          }
        />
      )}

      <Modal
        transparent
        visible={isCreateModalVisible}
        animationType="fade"
        onRequestClose={onCloseCreateModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Create New Chat</Text>
            <Text style={styles.modalSubTitle}>
              Default title is AI Chat. You can change it below.
            </Text>

            <TextInput
              value={conversationTitleInput}
              onChangeText={setConversationTitleInput}
              placeholder="AI Chat"
              placeholderTextColor="#888"
              style={styles.modalInput}
              autoFocus
              maxLength={100}
            />

            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={onCloseCreateModal}
                disabled={createConversationMutation.isPending}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.createBtn,
                  createConversationMutation.isPending && styles.createBtnDisabled,
                ]}
                onPress={onConfirmCreateConversation}
                disabled={createConversationMutation.isPending}
              >
                {createConversationMutation.isPending ? (
                  <ActivityIndicator size="small" color="#121212" />
                ) : (
                  <Text style={styles.createBtnText}>Create</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={[
          styles.createFab,
          createConversationMutation.isPending && styles.createFabDisabled,
        ]}
        onPress={onCreateConversation}
        disabled={createConversationMutation.isPending}
      >
        {createConversationMutation.isPending ? (
          <ActivityIndicator size="small" color="#121212" />
        ) : (
          <>
            <Ionicons name="add" size={20} color="#121212" />
            <Text style={styles.createFabText}>New Chat</Text>
          </>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#1C1C1E",
    borderWidth: 1,
    borderColor: "#2C2C2E",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { color: "#FFF", fontSize: 18, fontWeight: "800" },
  centerBox: { flex: 1, alignItems: "center", justifyContent: "center" },
  listContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 120 },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  itemMain: {
    flex: 1,
    backgroundColor: "#1C1C1E",
    borderWidth: 1,
    borderColor: "#2C2C2E",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  itemIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#0A84FF1A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  itemContent: { flex: 1 },
  itemTitle: { color: "#FFF", fontSize: 15, fontWeight: "700" },
  itemSubtitle: { color: "#8F8F8F", fontSize: 12, marginTop: 4 },
  deleteBtn: {
    width: 40,
    height: 40,
    marginLeft: 10,
    borderRadius: 12,
    backgroundColor: "#2A1515",
    borderWidth: 1,
    borderColor: "#FF3B3030",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyBox: {
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 18,
  },
  emptyTitle: {
    marginTop: 14,
    color: "#D1D1D1",
    fontSize: 17,
    fontWeight: "700",
  },
  emptySub: {
    marginTop: 8,
    color: "#777",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
  createFab: {
    position: "absolute",
    right: 20,
    bottom: 28,
    backgroundColor: "#FF9500",
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  createFabDisabled: {
    opacity: 0.8,
  },
  createFabText: {
    color: "#121212",
    fontWeight: "800",
    fontSize: 14,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#1C1C1E",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#2C2C2E",
    padding: 16,
  },
  modalTitle: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "800",
  },
  modalSubTitle: {
    color: "#A0A0A0",
    fontSize: 13,
    marginTop: 6,
    marginBottom: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#2C2C2E",
    borderRadius: 12,
    backgroundColor: "#121212",
    color: "#FFF",
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  modalActionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 14,
  },
  cancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: "#2C2C2E",
    marginRight: 8,
  },
  cancelBtnText: {
    color: "#DDD",
    fontSize: 13,
    fontWeight: "700",
  },
  createBtn: {
    minWidth: 88,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: "#FF9500",
    alignItems: "center",
  },
  createBtnDisabled: {
    opacity: 0.8,
  },
  createBtnText: {
    color: "#121212",
    fontSize: 13,
    fontWeight: "800",
  },
});
