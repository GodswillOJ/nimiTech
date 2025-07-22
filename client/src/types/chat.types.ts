export interface IChatMessage {
  _id: string;
  conversationId: string;
  sender: 'user' | 'ai' | 'agent';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  metadata?: {
    confidence?: number;
    knowledgeBaseRefs?: string[];
    handoffTrigger?: boolean;
    attachments?: Array<{
      type: string;
      url: string;
      size: number;
    }>;
    nameInput?: boolean;
    isLoading?: boolean;
    isError?: boolean;
    ticketId?: string;
    emailSent?: boolean;
  };
}

export interface IConversation {
  _id: string;
  sessionId: string;
  websiteId: string;
  userId?: string;
  status: 'active' | 'closed' | 'transferred';
  assignedAgent?: string;
  startTime: Date;
  endTime?: Date;
  metadata?: {
    userAgent?: string;
    ip?: string;
    referrer?: string;
    deviceType?: string;
  };
}

export interface IChatState {
  isOpen: boolean;
  isMinimized: boolean;
  isLoading: boolean;
  isTyping: boolean;
  sessionId: string | null;
  conversationId: string | null;
  messages: IChatMessage[];
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
  handoffSuggested: boolean;
  userName?: string | null;
}

export interface IChatConfig {
  primaryColor?: string;
  secondaryColor?: string;
  borderRadius?: string;
  fontFamily?: string;
  position?: 'bottom-right' | 'bottom-left';
  apiBaseUrl?: string;
  websiteId?: string;
}

export interface ITypingIndicator {
  typing: boolean;
  sender?: 'ai' | 'agent';
}

export interface IHandoffRequest {
  sessionId: string;
  reason?: string;
}
