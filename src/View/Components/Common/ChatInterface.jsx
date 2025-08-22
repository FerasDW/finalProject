import styles from '../../../CSS/Components/Global/ChatInterface.module.css';
import { useChat } from '../../../Context/ChatContext';
import React, { useEffect, useState, useRef } from 'react';
import { Send } from 'react-feather';

const ChatInterface = ({ contact, onClose, currentUserId, context = 'eduSphere' }) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const {
    getMessagesForContact,
    sendMessage,
    loadMessages,
    markMessagesAsRead,
  } = useChat ? useChat() : {
    getMessagesForContact: () => [],
    sendMessage: () => {},
    loadMessages: () => {},
    markMessagesAsRead: () => {},
  };

  // Load messages from API when contact changes
  useEffect(() => {
    if (!contact?.id) return;

    // Load messages and mark them as read    
    loadMessages(contact.id, context);
    markMessagesAsRead(contact.id, context);
  }, [contact?.id, context]);

  // Update displayed messages when context or contact changes
  useEffect(() => {
    if (!contact?.id) return;
    const updatedMessages = getMessagesForContact(contact.id, context);
    setMessages(updatedMessages);
  }, [contact?.id, context, getMessagesForContact]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(contact.id, newMessage, context);
      setNewMessage('');
      
      // Simulate typing indicator
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 2000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const getContextDisplay = () => {
    return context === 'community' ? 'Community Chat' : 'EduSphere Chat';
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Minimize view
  if (isMinimized) {
    return (
      <div className={styles.chatInterfaceMinimized}>
        <div className={styles.chatHeaderMinimized} onClick={() => setIsMinimized(false)}>
          <div className={styles.chatContactInfo}>
            <div className={styles.chatContactAvatar}>
              {contact?.title?.[0] || 'U'}
            </div>
            <div className={styles.chatContactDetails}>
              <span className={styles.chatContactName}>{contact?.title}</span>
              <span className={styles.chatStatusIndicator}>●</span>
            </div>
          </div>
          <button className={styles.chatCloseButton} onClick={(e) => { e.stopPropagation(); onClose(); }}>×</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chatInterface}>
      <div className={styles.chatHeader}>
        <div className={styles.chatContactInfo}>
          <div className={styles.chatContactAvatar}>
            {contact?.title?.[0] || 'U'}
          </div>
          <div className={styles.chatContactDetails}>
            <span className={styles.chatContactName}>{contact?.title}</span>
            <span className={`${styles.chatContext} ${isTyping ? styles.typing : ''}`}>
              {isTyping ? 'typing...' : getContextDisplay()}
            </span>
          </div>
        </div>
        <div className={styles.chatHeaderButtons}>
          <button className={styles.chatMinimizeButton} onClick={() => setIsMinimized(true)}>−</button>
          <button className={styles.chatCloseButton} onClick={onClose}>×</button>
        </div>
      </div>

      <div className={styles.chatMessages}>
        {messages.length === 0 ? (
          <div className={styles.noMessages}>
            <div className={styles.noMessagesIcon}>💬</div>
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`${styles.chatMessage} ${
                message.senderId === currentUserId ? styles.sent : styles.received
              }`}
            >
              <div className={styles.messageContent}>{message.content}</div>
              <div className={styles.messageTimestamp}>
                {formatTimestamp(message.timestamp)}
                {message.senderId === currentUserId && (
                  <span className={styles.messageStatus}>
                    {message.status === 'read' ? '✓✓' : '✓'}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.chatInputContainer}>
        <input
          ref={inputRef}
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={`Type a message in ${getContextDisplay()}...`}
          className={styles.chatInput}
        />
        <button 
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
          className={styles.chatSendButton}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;