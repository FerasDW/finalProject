import React, { useEffect, useState } from 'react';
import { Send } from 'react-feather';
import '../../../../CSS/Components/Global/ChatInterface.css';
import { useChat } from '../../../../Context/ChatContext';

const ChatInterface = ({ contact, onClose, currentUserId }) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const {
    messagesMap,
    getMessagesForContact,
    sendMessage,
    loadMessages,
    markMessagesAsRead,
  } = useChat();

  // Load messages from API when contact changes
  useEffect(() => {
    if (!contact?.id) return;

    // Load messages and mark them as read    
    loadMessages(contact.id);
    markMessagesAsRead(contact.id);
  }, [contact?.id]);

  // Update displayed messages when messagesMap updates
  useEffect(() => {
    if (!contact?.id) return;
    const updatedMessages = getMessagesForContact(contact.id);
    setMessages(updatedMessages);
  }, [messagesMap, contact?.id]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(contact.id, newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <div className="chat-contact-info">
          {contact.icon}
          <span className="chat-contact-name">{contact.title}</span>
        </div>
        <button className="chat-close-button" onClick={onClose}>×</button>
      </div>

      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat-message ${
              message.senderId === currentUserId ? 'sent' : 'received'
            }`}
          >
            <div className="message-content">{message.content}</div>
          </div>
        ))}
      </div>

      <form className="chat-input-container" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="chat-input"
        />
        <button type="submit" className="chat-send-button">
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
