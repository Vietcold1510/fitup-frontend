export interface AiChatApiResponse<T> {
  status: number;
  msg: string;
  data: T;
}

export type AiChatRole = "User" | "Assistant";

export interface AiChatMessage {
  id: string;
  role: AiChatRole;
  content: string;
  createdAt: string;
  inputTokens: number | null;
  outputTokens: number | null;
  totalTokens: number | null;
}

export interface AiChatConversation {
  id: string;
  title: string;
  createdAt: string;
  lastMessageAt: string | null;
}

export interface AiChatConversationDetail extends AiChatConversation {
  messages: AiChatMessage[];
}

export interface CreateAiChatConversationPayload {
  title: string;
}

export interface SendAiChatMessagePayload {
  message: string;
  includeLiveContext: boolean;
}

export interface SendAiChatMessageData {
  conversationId: string;
  userMessage: AiChatMessage;
  assistantMessage: AiChatMessage;
}

export interface DeleteAiChatConversationData {
  message: string;
}
