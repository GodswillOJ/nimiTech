import React, { useState, useEffect, useRef } from 'react';
import styles from './ChatWidget.module.scss';
import { IChatMessage, IChatState, ITypingIndicator } from '../../types/chat.types';
import chatService from '../../services/chatService';
import { BotImage } from '../../assets/blog/svgComponents/BotImage';

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

const BotIcon = () => <BotImage className={styles['chat-widget__message__avatar__icon']} />;

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
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [nameInput, setNameInput] = useState<string>('');
  const [emailInput, setEmailInput] = useState<string>('');
  const [showUserInfoInput, setShowUserInfoInput] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Utility functions for user info management
  const getUserInfo = (): { name: string; email: string } => {
    const stored = localStorage.getItem('nimitech_chat_userinfo');
    if (stored) {
      const data = JSON.parse(stored);
      const oneWeek = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
      if (Date.now() - data.timestamp < oneWeek) {
        return { name: data.name || '', email: data.email || '' };
      } else {
        localStorage.removeItem('nimitech_chat_userinfo');
      }
    }
    return { name: '', email: '' };
  };

  const saveUserInfo = (name: string, email: string) => {
    const data = {
      name: name.trim(),
      email: email.trim(),
      timestamp: Date.now(),
    };
    localStorage.setItem('nimitech_chat_userinfo', JSON.stringify(data));
    setUserName(name.trim());
    setUserEmail(email.trim());
  };

  const createKenGreeting = (withName: boolean = false, customName?: string): IChatMessage => {
    const nameToUse = customName || userName;
    const greeting =
      withName && nameToUse
        ? `Hi, ${nameToUse} 👋, I'm Ken, your virtual AI assistant for Nimitech IT LLC. How can I help you today?`
        : "Hi 👋, my name is Ken, I'm a virtual AI assistant for Nimitech IT LLC and I'm glad to help you through.\n\nYou could type in your name so I would be able to properly address you.";

    return {
      _id: `ken-greeting-${Date.now()}`,
      conversationId: chatState.conversationId || '',
      sender: 'ai',
      content: greeting,
      timestamp: new Date(),
    };
  };

  // Initialize user info on component mount
  useEffect(() => {
    const storedInfo = getUserInfo();
    if (storedInfo.name) {
      setUserName(storedInfo.name);
    }
    if (storedInfo.email) {
      setUserEmail(storedInfo.email);
    }
  }, []);

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
    if (!chatState.isOpen || chatState.isMinimized) {
      // Opening chat or restoring from minimized state
      setChatState((prev) => ({ ...prev, isOpen: true, isMinimized: false, isLoading: true }));

      try {
        // Check for existing session
        const storedSessionId = chatService.getStoredSessionId();

        if (storedSessionId && !chatState.sessionId) {
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
            // If restoration fails, clear session and start new conversation
            chatService.clearStoredSession?.();
            await startNewConversationWithGreeting();
          }
        } else if (!chatState.sessionId) {
          // Start new conversation with Ken's instant greeting
          await startNewConversationWithGreeting();
        } else {
          // Just restore the UI state if session already exists in component state
          setChatState((prev) => ({ ...prev, isLoading: false }));
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
        if (!sessionId) {
          console.error('Session ID is required for loading initial messages');
          return;
        }
        const history = await chatService.getConversationHistory(sessionId);
        setChatState((prev) => ({
          ...prev,
          messages: history.messages,
        }));
      } catch (error) {
        console.error('Failed to load initial messages:', error);
      }
    }, 1);
    // } catch (error) {
    //   throw error;
    // }
  };

  const startNewConversationWithGreeting = async () => {
    try {
      const { sessionId, conversationId } = await chatService.startConversation();
      chatService.storeSessionId(sessionId);

      // Create Ken's instant greeting
      const kenGreeting = createKenGreeting(!!userName);

      setChatState((prev) => ({
        ...prev,
        sessionId,
        conversationId,
        messages: [kenGreeting],
        isLoading: false,
      }));

      // Show user info input if user name is not stored
      if (!userName) {
        setShowUserInfoInput(true);
        // Focus on name input after a short delay
        setTimeout(() => {
          nameInputRef.current?.focus();
        }, 100);
      }
    } catch (error) {
      console.error('Error starting new conversation:', error);
      setError('Failed to start conversation');
      setChatState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleUserInfoSubmit = () => {
    if (nameInput.trim() && emailInput.trim()) {
      const submittedName = nameInput.trim();
      const submittedEmail = emailInput.trim();

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(submittedEmail)) {
        setError('Please enter a valid email address');
        return;
      }

      saveUserInfo(submittedName, submittedEmail);
      setShowUserInfoInput(false);
      setNameInput('');
      setEmailInput('');
      setError(null);

      // Add a personalized greeting from Ken using the submitted name
      const personalizedGreeting = createKenGreeting(true, submittedName);
      setChatState((prev) => ({
        ...prev,
        messages: [...prev.messages, personalizedGreeting],
      }));
    }
  };

  const handleNameInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Move focus to email input
      emailInputRef.current?.focus();
    }
  };

  const handleEmailInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleUserInfoSubmit();
    }
  };

  const closeChat = () => {
    // When closing/minimizing, preserve session data but hide the chat
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

      // Only add AI response if not already handled by socket event listener
      // The onNewMessage listener should handle adding the AI response
      setChatState((prev) => ({
        ...prev,
        handoffSuggested: response.handoffSuggested || false,
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
                <h3>Ken</h3>
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

          {/* User Info Input */}
          {showUserInfoInput && (
            <div className={styles['chat-widget__user-info-input']}>
              <div className={styles['chat-widget__user-info-input__container']}>
                <div className={styles['chat-widget__user-info-input__fields']}>
                  <input
                    ref={nameInputRef}
                    type="text"
                    className={styles['chat-widget__user-info-input__field']}
                    placeholder="name"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyPress={handleNameInputKeyPress}
                    maxLength={50}
                  />
                  <input
                    ref={emailInputRef}
                    type="email"
                    className={styles['chat-widget__user-info-input__field']}
                    placeholder="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyPress={handleEmailInputKeyPress}
                    maxLength={100}
                  />
                </div>
                <button
                  className={styles['chat-widget__user-info-input__button']}
                  onClick={handleUserInfoSubmit}
                  disabled={!nameInput.trim() || !emailInput.trim()}
                >
                  Submit
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
