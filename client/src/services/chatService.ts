import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { IChatMessage, IConversation, ITypingIndicator } from '../types/chat.types';

class ChatService {
  private socket: Socket | null = null;
  private apiBaseUrl: string;
  private sessionId: string | null = null;

  constructor(apiBaseUrl = 'http://localhost:10000') {
    this.apiBaseUrl = apiBaseUrl;
  }

  // Initialize Socket.IO connection
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(this.apiBaseUrl, {
          transports: ['websocket', 'polling'],
          withCredentials: true,
        });

        this.socket.on('connect', () => {
          console.log('Connected to chat server');
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          console.error('Connection error:', error);
          reject(error);
        });

        this.socket.on('disconnect', () => {
          console.log('Disconnected from chat server');
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // Disconnect from server
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Start a new conversation
  async startConversation(): Promise<{ sessionId: string; conversationId: string }> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/chat/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          deviceType: this.getDeviceType(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        this.sessionId = data.data.sessionId;

        // Join the conversation room for real-time updates
        if (this.socket) {
          this.socket.emit('join_conversation', this.sessionId);
        }

        return {
          sessionId: data.data.sessionId,
          conversationId: data.data.conversationId,
        };
      } else {
        throw new Error(data.message || 'Failed to start conversation');
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      throw error;
    }
  }

  // Send a message
  async sendMessage(
    sessionId: string,
    content: string
  ): Promise<{ userMessage: IChatMessage; aiMessage: IChatMessage; handoffSuggested: boolean }> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          sessionId,
          content,
          sender: 'user',
        }),
      });

      const data = await response.json();

      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Get conversation history
  async getConversationHistory(
    sessionId: string
  ): Promise<{ conversation: IConversation; messages: IChatMessage[] }> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/chat/history/${sessionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to get conversation history');
      }
    } catch (error) {
      console.error('Error getting conversation history:', error);
      throw error;
    }
  }

  // Request human handoff
  async requestHandoff(sessionId: string, reason?: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/chat/handoff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          sessionId,
          reason,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to request handoff');
      }
    } catch (error) {
      console.error('Error requesting handoff:', error);
      throw error;
    }
  }

  // End conversation
  async endConversation(sessionId: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/chat/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          sessionId,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to end conversation');
      }
    } catch (error) {
      console.error('Error ending conversation:', error);
      throw error;
    }
  }

  // Socket event listeners
  onNewMessage(callback: (data: { message: IChatMessage; handoffSuggested: boolean }) => void) {
    if (this.socket) {
      this.socket.on('new_message', callback);
    }
  }

  onTypingIndicator(callback: (data: ITypingIndicator) => void) {
    if (this.socket) {
      this.socket.on('user_typing', callback);
    }
  }

  onHandoffInitiated(callback: (data: { message: string; estimatedWaitTime: string }) => void) {
    if (this.socket) {
      this.socket.on('handoff_initiated', callback);
    }
  }

  onAgentJoined(callback: (data: { agentName: string; message: string }) => void) {
    if (this.socket) {
      this.socket.on('agent_joined', callback);
    }
  }

  // Send typing indicators
  sendTypingStart(sessionId: string) {
    if (this.socket) {
      this.socket.emit('typing_start', { sessionId });
    }
  }

  sendTypingStop(sessionId: string) {
    if (this.socket) {
      this.socket.emit('typing_stop', { sessionId });
    }
  }

  // Utility methods
  private getDeviceType(): string {
    const userAgent = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      return 'tablet';
    }
    if (
      /mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(
        userAgent
      )
    ) {
      return 'mobile';
    }
    return 'desktop';
  }

  // Get connection status
  getConnectionStatus(): 'connected' | 'disconnected' | 'connecting' {
    if (!this.socket) return 'disconnected';
    if (this.socket.connected) return 'connected';
    return 'connecting';
  }

  // Check if session exists in localStorage
  getStoredSessionId(): string | null {
    return localStorage.getItem('nimitech_chat_session');
  }

  // Store session in localStorage
  storeSessionId(sessionId: string) {
    localStorage.setItem('nimitech_chat_session', sessionId);
  }

  // Clear stored session
  clearStoredSession() {
    localStorage.removeItem('nimitech_chat_session');
  }
}

export default new ChatService();
