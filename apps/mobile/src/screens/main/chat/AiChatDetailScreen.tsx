import React, { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
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
import { useNavigation, useRoute } from "@react-navigation/native";
import { aiChatRequest } from "@/api/aiChat";
import { handleErrorApi } from "@/lib/errors";
import { AiChatConversationDetail, AiChatMessage } from "@/types/aiChat";

const aiAssistantLogo = require("../../../../assets/Fitness_Logo__1_-removebg-preview.png");

export default function AiChatDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const queryClient = useQueryClient();
  const listRef = useRef<FlatList<AiChatMessage>>(null);
  const [inputMessage, setInputMessage] = useState("");

  const conversationId: string | undefined = route.params?.conversationId;
  const title: string = route.params?.title || "AI Chat";

  const {
    data: conversation,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery<AiChatConversationDetail>({
    queryKey: ["ai-chat-conversation", conversationId],
    queryFn: async () => {
      const res = await aiChatRequest.getConversationById(conversationId as string);
      return res.data.data;
    },
    enabled: !!conversationId,
  });

  const messages = useMemo<AiChatMessage[]>(
    () => conversation?.messages || [],
    [conversation?.messages],
  );

  const sendMessageMutation = useMutation({
    mutationFn: (message: string) =>
      aiChatRequest.sendMessage(conversationId as string, {
        message,
        includeLiveContext: true,
      }),
    onSuccess: (res) => {
      const result = res.data.data;
      setInputMessage("");

      queryClient.setQueryData(
        ["ai-chat-conversation", conversationId],
        (currentData: AiChatConversationDetail | undefined) => {
          if (!currentData) return currentData;

          return {
            ...currentData,
            lastMessageAt: result.assistantMessage.createdAt,
            messages: [
              ...currentData.messages,
              result.userMessage,
              result.assistantMessage,
            ],
          };
        },
      );

      queryClient.invalidateQueries({ queryKey: ["ai-chat-conversations"] });
      queryClient.invalidateQueries({
        queryKey: ["ai-chat-conversation", conversationId],
      });
    },
    onError: (error) => handleErrorApi({ error }),
  });

  const onSendMessage = () => {
    const trimmedMessage = inputMessage.trim();
    if (!trimmedMessage || sendMessageMutation.isPending || !conversationId) return;
    sendMessageMutation.mutate(trimmedMessage);
  };

  const normalizeSingleAsteriskBullets = (rawContent: string) => {
    return rawContent
      .split("\n")
      .map((line) => {
        const bulletMatch = line.match(/^(\s*)\*\s+(.*)$/);
        if (!bulletMatch) return line;

        const leadingSpaceCount = bulletMatch[1].replace(/\t/g, "    ").length;
        const indentLevel = Math.floor(leadingSpaceCount / 2);
        const indent = "  ".repeat(indentLevel);

        return `${indent}\u2022 ${bulletMatch[2]}`;
      })
      .join("\n");
  };

  const renderFormattedContent = (content: string, isUserMessage: boolean) => {
    const nodes: React.ReactNode[] = [];
    const normalizedContent = normalizeSingleAsteriskBullets(content);
    const boldPattern = /\*\*([\s\S]+?)\*\*/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let key = 0;

    while ((match = boldPattern.exec(normalizedContent)) !== null) {
      if (match.index > lastIndex) {
        nodes.push(
          <Text key={`plain-${key++}`}>
            {normalizedContent.slice(lastIndex, match.index)}
          </Text>,
        );
      }

      nodes.push(
        <Text
          key={`bold-${key++}`}
          style={isUserMessage ? styles.userHighlightText : styles.assistantHighlightText}
        >
          {match[1]}
        </Text>,
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < normalizedContent.length) {
      nodes.push(
        <Text key={`plain-${key++}`}>{normalizedContent.slice(lastIndex)}</Text>,
      );
    }

    return nodes.length > 0 ? nodes : normalizedContent;
  };

  const renderMessage = ({ item }: { item: AiChatMessage }) => {
    const isUserMessage = item.role === "User";

    return (
      <View
        style={[
          styles.messageRow,
          isUserMessage ? styles.messageRowRight : styles.messageRowLeft,
        ]}
      >
        {!isUserMessage && (
          <View style={styles.assistantAvatarWrap}>
            <Image
              source={aiAssistantLogo}
              style={styles.assistantAvatar}
              resizeMode="contain"
            />
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            isUserMessage ? styles.userBubble : styles.assistantBubble,
          ]}
        >
          <Text style={styles.messageText}>
            {renderFormattedContent(item.content, isUserMessage)}
          </Text>
          <Text style={styles.messageTime}>
            {dayjs(item.createdAt).format("HH:mm DD/MM")}
          </Text>
        </View>
      </View>
    );
  };

  if (!conversationId) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerBox}>
          <Ionicons name="alert-circle-outline" size={48} color="#666" />
          <Text style={styles.errorText}>Conversation not found.</Text>
          <TouchableOpacity style={styles.backBtnFallback} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {conversation?.title || title}
          </Text>
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
            ref={listRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.messagesContainer}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="sparkles-outline" size={30} color="#555" />
                <Text style={styles.emptyTitle}>Bắt đầu tin nhắn</Text>
                <Text style={styles.emptySub}>
                  Trợ lý Fitup sẽ trả lời thắc mắc của bạn
                </Text>
              </View>
            }
            onContentSizeChange={() => {
              requestAnimationFrame(() => {
                listRef.current?.scrollToEnd({ animated: true });
              });
            }}
          />
        )}

        {sendMessageMutation.isPending && (
          <Text style={styles.thinkingText}>AI is thinking...</Text>
        )}

        <View style={styles.inputBar}>
          <TextInput
            value={inputMessage}
            onChangeText={setInputMessage}
            placeholder="Nhập tin nhắn..."
            placeholderTextColor="#777"
            style={styles.input}
            multiline
            maxLength={2000}
          />
          <TouchableOpacity
            style={[
              styles.sendBtn,
              (!inputMessage.trim() || sendMessageMutation.isPending) &&
                styles.sendBtnDisabled,
            ]}
            onPress={onSendMessage}
            disabled={!inputMessage.trim() || sendMessageMutation.isPending}
          >
            {sendMessageMutation.isPending ? (
              <ActivityIndicator size="small" color="#121212" />
            ) : (
              <Ionicons name="send" size={18} color="#121212" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  flex: { flex: 1 },
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
  headerTitle: {
    flex: 1,
    marginHorizontal: 12,
    color: "#FFF",
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
  },
  centerBox: { flex: 1, alignItems: "center", justifyContent: "center" },
  messagesContainer: {
    paddingHorizontal: 14,
    paddingTop: 6,
    paddingBottom: 16,
  },
  messageRow: { marginBottom: 10, flexDirection: "row" },
  messageRowLeft: { justifyContent: "flex-start", alignItems: "flex-end" },
  messageRowRight: { justifyContent: "flex-end", alignItems: "flex-end" },
  assistantAvatarWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#1C1C1E",
    borderWidth: 1,
    borderColor: "#2C2C2E",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    marginBottom: 2,
  },
  assistantAvatar: {
    width: 22,
    height: 22,
  },
  messageBubble: {
    maxWidth: "86%",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  userBubble: {
    backgroundColor: "#FF9500",
    borderTopRightRadius: 6,
  },
  assistantBubble: {
    backgroundColor: "#1C1C1E",
    borderTopLeftRadius: 6,
    borderWidth: 1,
    borderColor: "#2C2C2E",
  },
  messageText: {
    color: "#FFF",
    fontSize: 14,
    lineHeight: 20,
  },
  assistantHighlightText: {
    color: "#FF9500",
    fontWeight: "800",
  },
  userHighlightText: {
    color: "#121212",
    fontWeight: "800",
  },
  messageTime: {
    color: "#FFFFFF99",
    fontSize: 10,
    marginTop: 6,
    textAlign: "right",
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#2C2C2E",
    backgroundColor: "#121212",
  },
  input: {
    flex: 1,
    maxHeight: 120,
    minHeight: 42,
    backgroundColor: "#1C1C1E",
    borderWidth: 1,
    borderColor: "#2C2C2E",
    borderRadius: 14,
    color: "#FFF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  sendBtn: {
    marginLeft: 8,
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#FF9500",
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
  thinkingText: {
    color: "#999",
    fontSize: 12,
    marginHorizontal: 14,
    marginBottom: 8,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    marginTop: 12,
    color: "#D1D1D1",
    fontSize: 16,
    fontWeight: "700",
  },
  emptySub: {
    marginTop: 6,
    color: "#777",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
  errorText: { color: "#888", fontSize: 15, marginTop: 12 },
  backBtnFallback: {
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#1C1C1E",
  },
  backBtnText: { color: "#FF9500", fontWeight: "700" },
});
