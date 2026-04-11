import { http } from "@/lib/http";
import {
  AiChatApiResponse,
  AiChatConversation,
  AiChatConversationDetail,
  CreateAiChatConversationPayload,
  DeleteAiChatConversationData,
  SendAiChatMessageData,
  SendAiChatMessagePayload,
} from "@/types/aiChat";

export const aiChatRequest = {
  createConversation: (payload: CreateAiChatConversationPayload) =>
    http.post<AiChatApiResponse<AiChatConversation>>(
      "/api/ai-chat/conversations",
      payload,
    ),

  getConversations: () =>
    http.get<AiChatApiResponse<AiChatConversation[]>>(
      "/api/ai-chat/conversations",
    ),

  getConversationById: (conversationId: string) =>
    http.get<AiChatApiResponse<AiChatConversationDetail>>(
      `/api/ai-chat/conversations/${conversationId}`,
    ),

  sendMessage: (conversationId: string, payload: SendAiChatMessagePayload) =>
    http.post<AiChatApiResponse<SendAiChatMessageData>>(
      `/api/ai-chat/conversations/${conversationId}/messages`,
      payload,
    ),

  deleteConversation: (conversationId: string) =>
    http.delete<AiChatApiResponse<DeleteAiChatConversationData>>(
      `/api/ai-chat/conversations/${conversationId}`,
    ),
};
