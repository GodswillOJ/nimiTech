import React, { useState, useEffect, useRef } from 'react';
import styles from './ChatWidget.module.scss';
import { IChatMessage, IChatState, ITypingIndicator } from '../../types/chat.types';
import chatService from '../../services/chatService';

// Simple icons (you can replace with react-icons or custom SVGs)
const ChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={styles['chat-widget__bubble__icon']}>
    <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
  </svg>
);

const MinimizeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={styles['chat-widget__header__button__icon']}
  >
    <path d="M19 13H5v-2h14v2z" />
  </svg>
);

const CloseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={styles['chat-widget__header__button__icon']}
  >
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={styles['chat-widget__input__send__icon']}>
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

const BotIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={styles['chat-widget__message__avatar__icon']}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

const UserIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={styles['chat-widget__message__avatar__icon']}
  >
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

const AgentIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={styles['chat-widget__message__avatar__icon']}
  >
    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.83 0-1.54.5-1.85 1.22l-1.92 5.78H9c-.83 0-1.5.67-1.5 1.5S8.17 18 9 18h3v4h8z" />
  </svg>
);

interface ChatWidgetProps {
  config?: {
    primaryColor?: string;
    secondaryColor?: string;
    position?: 'bottom-right' | 'bottom-left';
    apiBaseUrl?: string;
  };
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ config }) => {
  const [chatState, setChatState] = useState<IChatState>({
    isOpen: false,
    isMinimized: true,
    isLoading: false,
    isTyping: false,
    sessionId: null,
    conversationId: null,
    messages: [],
    connectionStatus: 'disconnected',
    handoffSuggested: false,
  });

  const [inputValue, setInputValue] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initialize chat service
  useEffect(() => {
    const initializeChat = async () => {
      try {
        await chatService.connect();
        setChatState((prev) => ({ ...prev, connectionStatus: 'connected' }));

        // Set up event listeners
        chatService.onNewMessage((data) => {
          setChatState((prev) => ({
            ...prev,
            messages: [...prev.messages, data.message],
            handoffSuggested: data.handoffSuggested,
          }));
        });

        chatService.onTypingIndicator((data: ITypingIndicator) => {
          setChatState((prev) => ({ ...prev, isTyping: data.typing }));
        });

        chatService.onHandoffInitiated((data) => {
          setChatState((prev) => ({
            ...prev,
            messages: [
              ...prev.messages,
              {
                _id: Date.now().toString(),
                conversationId: prev.conversationId || '',
                sender: 'ai',
                content: data.message,
                timestamp: new Date(),
                metadata: { handoffTrigger: true },
              },
            ],
          }));
        });

        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize chat:', error);
        setError('Failed to connect to chat service');
      }
    };

    initializeChat();

    return () => {
      chatService.disconnect();
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = async () => {
    if (!chatState.isOpen) {
      // Opening chat
      setChatState((prev) => ({ ...prev, isOpen: true, isMinimized: false, isLoading: true }));

      try {
        // Check for existing session
        const storedSessionId = chatService.getStoredSessionId();

        if (storedSessionId) {
          // Try to restore existing conversation
          try {
            const history = await chatService.getConversationHistory(storedSessionId);
            setChatState((prev) => ({
              ...prev,
              sessionId: storedSessionId,
              conversationId: history.conversation._id,
              messages: history.messages,
              isLoading: false,
            }));
          } catch (error) {
            // If restoration fails, start new conversation
            await startNewConversation();
          }
        } else {
          // Start new conversation
          await startNewConversation();
        }
      } catch (error) {
        console.error('Error opening chat:', error);
        setError('Failed to start conversation');
        setChatState((prev) => ({ ...prev, isLoading: false }));
      }
    } else {
      // Minimizing chat
      setChatState((prev) => ({ ...prev, isMinimized: true }));
    }
  };

  const startNewConversation = async () => {
    // try {
    const { sessionId, conversationId } = await chatService.startConversation();
    chatService.storeSessionId(sessionId);

    setChatState((prev) => ({
      ...prev,
      sessionId,
      conversationId,
      isLoading: false,
    }));

    // Load initial messages (welcome message should be created by backend)
    setTimeout(async () => {
      try {
        const history = await chatService.getConversationHistory(sessionId);
        setChatState((prev) => ({
          ...prev,
          messages: history.messages,
        }));
      } catch (error) {
        console.error('Failed to load initial messages:', error);
      }
    }, 500);
    // } catch (error) {
    //   throw error;
    // }
  };

  const closeChat = () => {
    setChatState((prev) => ({ ...prev, isOpen: false, isMinimized: true }));
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || !chatState.sessionId || chatState.isLoading) return;

    const messageContent = inputValue.trim();
    setInputValue('');

    // Add user message immediately to UI
    const userMessage: IChatMessage = {
      _id: Date.now().toString(),
      conversationId: chatState.conversationId || '',
      sender: 'user',
      content: messageContent,
      timestamp: new Date(),
    };

    setChatState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
    }));

    try {
      const response = await chatService.sendMessage(chatState.sessionId, messageContent);

      // Update messages with server response (remove the temporary user message)
      setChatState((prev) => ({
        ...prev,
        messages: [...prev.messages.slice(0, -1), response.userMessage, response.aiMessage],
        handoffSuggested: response.aiMessage?.metadata?.handoffTrigger || false,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error sending message:', error);
      setChatState((prev) => ({ ...prev, isLoading: false }));
      setError('Failed to send message');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const requestHandoff = async () => {
    if (!chatState.sessionId) return;

    try {
      await chatService.requestHandoff(chatState.sessionId, 'User requested human agent');
      setChatState((prev) => ({ ...prev, handoffSuggested: false }));
    } catch (error) {
      console.error('Error requesting handoff:', error);
      setError('Failed to request human agent');
    }
  };

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (message: IChatMessage, index: number) => (
    <div
      key={`${message._id}-${index}`}
      className={`${styles['chat-widget__message']} ${styles[`chat-widget__message--${message.sender}`]}`}
    >
      <div className={styles['chat-widget__message__avatar']}>
        {message.sender === 'user' ? (
          <UserIcon />
        ) : message.sender === 'agent' ? (
          <AgentIcon />
        ) : (
          <BotIcon />
        )}
      </div>
      <div
        className={`${styles['chat-widget__message__bubble']} ${
          message.metadata?.handoffTrigger ? styles['chat-widget__message__bubble--handoff'] : ''
        }`}
      >
        {message.content}
      </div>
      <div className={styles['chat-widget__message__time']}>{formatTime(message.timestamp)}</div>
    </div>
  );

  const renderTypingIndicator = () => (
    <div className={styles['chat-widget__typing']}>
      <div className={styles['chat-widget__typing__avatar']}>
        <BotIcon />
      </div>
      <div className={styles['chat-widget__typing__indicator']}>
        <div className={styles['chat-widget__typing__indicator__dot']}></div>
        <div className={styles['chat-widget__typing__indicator__dot']}></div>
        <div className={styles['chat-widget__typing__indicator__dot']}></div>
      </div>
    </div>
  );

  if (!isInitialized) {
    return null; // Don't render until initialized
  }

  return (
    <div className={styles['chat-widget']}>
      {/* Chat Bubble */}
      {(chatState.isMinimized || !chatState.isOpen) && (
        <div
          className={`${styles['chat-widget__bubble']} ${!chatState.isOpen ? styles['chat-widget__bubble--pulse'] : ''}`}
          onClick={toggleChat}
        >
          <ChatIcon />
          {chatState.messages.length > 0 && chatState.isMinimized && (
            <div className={styles['chat-widget__bubble__notification']}>
              {chatState.messages.filter((m) => m.sender !== 'user').length}
            </div>
          )}
        </div>
      )}

      {/* Chat Window */}
      {chatState.isOpen && (
        <div
          className={`${styles['chat-widget__window']} ${
            chatState.isMinimized
              ? styles['chat-widget__window--minimized']
              : styles['chat-widget__window--expanded']
          }`}
        >
          {/* Header */}
          <div className={styles['chat-widget__header']}>
            <div className={styles['chat-widget__header__info']}>
              <div className={styles['chat-widget__header__avatar']}>
                <BotIcon />
              </div>
              <div
                className={`${styles['chat-widget__header__text']} ${chatState.isTyping ? styles['chat-widget__header__text--typing'] : ''}`}
              >
                <h3>NimiTech Assistant</h3>
                <p>{chatState.isTyping ? 'Typing...' : 'Online • We reply instantly'}</p>
              </div>
            </div>
            <div className={styles['chat-widget__header__actions']}>
              <button
                className={styles['chat-widget__header__button']}
                onClick={toggleChat}
                title="Minimize"
              >
                <MinimizeIcon />
              </button>
              <button
                className={styles['chat-widget__header__button']}
                onClick={closeChat}
                title="Close"
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className={styles['chat-widget__messages']}>
            {chatState.isLoading && chatState.messages.length === 0 ? (
              <div className={styles['chat-widget__loading']}>
                <div className={styles['chat-widget__loading__spinner']}></div>
                Connecting...
              </div>
            ) : error ? (
              <div className={styles['chat-widget__error']}>
                {error}
                <button
                  className={styles['chat-widget__error__button']}
                  onClick={() => {
                    setError(null);
                    startNewConversation();
                  }}
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                {chatState.messages.map(renderMessage)}
                {chatState.isTyping && renderTypingIndicator()}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Handoff Banner */}
          {chatState.handoffSuggested && (
            <div className={styles['chat-widget__handoff']}>
              <div className={styles['chat-widget__handoff__content']}>
                <div className={styles['chat-widget__handoff__text']}>
                  Would you like to speak with a human agent?
                </div>
                <button className={styles['chat-widget__handoff__button']} onClick={requestHandoff}>
                  Connect
                </button>
              </div>
            </div>
          )}

          {/* Input */}
          <div className={styles['chat-widget__input']}>
            <div className={styles['chat-widget__input__container']}>
              <textarea
                ref={inputRef}
                className={styles['chat-widget__input__field']}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                rows={1}
                disabled={chatState.isLoading}
              />
              <button
                className={styles['chat-widget__input__send']}
                onClick={sendMessage}
                disabled={!inputValue.trim() || chatState.isLoading}
                title="Send message"
              >
                <SendIcon />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
