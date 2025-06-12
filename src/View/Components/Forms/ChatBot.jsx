import React, { useState } from "react";
import "../../../CSS/Forms/chatBot.css";

const ChatUI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [inputFocused, setInputFocused] = useState(false); // 👈 handles opacity

  const handleSend = () => {
    if (!message.trim()) return;

    const newMsg = {
      sender: "user",
      text: message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChatLog([...chatLog, newMsg]);
    setMessage("");

    setTimeout(() => {
      setChatLog((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Thanks for your message! I'm here to help you.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }, 800);

    if (!isOpen) setIsOpen(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <>
      {/* Chat Popup */}
      <div className={`chat-ui-container ${isOpen ? "open" : ""}`}>
        {/* Chat Header */}
        <div className="chat-header">
          <img
            src="https://img.icons8.com/?size=100&id=uZrQP6cYos2I&format=png&color=000000"
            alt="bot"
            className="chat-avatar"
          />
          <div className="chat-info">
            <h4>WappGPT</h4>
            <span className="status">🟢 Online</span>
          </div>
          <button
            className="close-btn"
            onClick={() => (setIsOpen(false), setInputFocused(false))}
          >
            ✕
          </button>
        </div>

        {/* Chat Body */}
        <div className="chat-body">
          {chatLog.map((msg, i) => (
            <div key={i} className={`chat-bubble ${msg.sender}`}>
              <p>{msg.text}</p>
              <div className="meta">
                <span className="time">{msg.time}</span>
                {msg.sender === "user" && <span className="check">✔</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Floating Bot */}
        <img
          className="floating-bot"
          src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnVsbHFoOTU4bnM2M21uNmtpaGlmY21mYWExNTdvZ2hqMW8xc214NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/7ni5vUVSDW17DXyxrz/giphy.gif"
          alt="Floating Bot"
        />

        {/* Chat Footer */}
        <div className="chat-footer">
          <input
            type="text"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSend}>➤</button>
        </div>
      </div>

      {/* Floating Input Bar */}
      {!isOpen && (
        <div className={`chat-input-bar ${inputFocused ? "focused" : ""}`}>
          <img
            src="https://img.icons8.com/?size=100&id=uZrQP6cYos2I&format=png&color=000000"
            alt="bot"
            className="chat-icon"
          />
          <input
            type="text"
            placeholder="Ask me anything..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setInputFocused(true)} // 👈 Set to 1 on focus
            onBlur={() => setInputFocused(false)} // 👈 Return to 0.3 on blur
          />
          <button onClick={handleSend}>Send</button>
        </div>
      )}
    </>
  );
};

export default ChatUI;
