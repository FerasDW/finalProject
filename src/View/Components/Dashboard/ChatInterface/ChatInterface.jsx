import React, { useState } from 'react';
import { Send } from 'react-feather';
import '../../../../CSS/Dashboard/ChatInterface.css';
const ChatInterface = ({ contact, onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello!", sender: "user" },
    { id: 2, text: "Hi there!", sender: "contact" },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          text: newMessage,
          sender: 'user'
        }
      ]);
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
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-message ${
              message.sender === 'user' ? 'sent' : 'received'
            }`}
          >
            <div className="message-content">{message.text}</div>
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