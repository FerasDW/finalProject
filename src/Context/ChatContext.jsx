import React, { createContext, useContext, useEffect, useState } from "react";
import {
  connectWebSocket,
  sendMessage as sendSocketMessage,
} from "../websocket/chatSocket";
import { fetchChatMessages } from "../Api/chatApi";
import { AuthContext } from "../Context/AuthContext";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { authData } = useContext(AuthContext);
  const [messagesMap, setMessagesMap] = useState({});
  const [unreadMessages, setUnreadMessages] = useState({});
  const [activeChatId, setActiveChatId] = useState(null); // ID of the user you're currently chatting with

  useEffect(() => {
    if (!authData?.id) return;

    connectWebSocket(authData.id, (incomingMessage) => {
      const otherId =
        incomingMessage.senderId === authData.id
          ? incomingMessage.receiverId
          : incomingMessage.senderId;

      setMessagesMap((prev) => ({
        ...prev,
        [otherId]: [...(prev[otherId] || []), incomingMessage],
      }));

      if (
        incomingMessage.receiverId === authData.id &&
        otherId !== activeChatId
      ) {
        setUnreadMessages((prev) => ({
          ...prev,
          [otherId]: (prev[otherId] || 0) + 1,
        }));
      }
    });
  }, [authData?.id]);

  const loadMessages = async (contactId) => {
    if (!authData?.id || !contactId || messagesMap[contactId]) return;

    const data = await fetchChatMessages(authData.id, contactId);
    setMessagesMap((prev) => ({
      ...prev,
      [contactId]: data,
    }));
  };

  const sendMessage = (receiverId, content) => {
    const msg = {
      senderId: authData.id,
      receiverId,
      content,
    };

    sendSocketMessage(msg);

    setMessagesMap((prev) => ({
      ...prev,
      [receiverId]: [
        ...(prev[receiverId] || []),
        { ...msg, timestamp: new Date().toISOString() },
      ],
    }));
  };

  const getMessagesForContact = (contactId) => {
    return messagesMap[contactId] || [];
  };

  const markMessagesAsRead = (contactId) => {
    setUnreadMessages((prev) => {
      const updated = { ...prev };
      delete updated[contactId];
      return updated;
    });
    setActiveChatId(contactId);
  };

  return (
    <ChatContext.Provider
      value={{
        messagesMap,
        loadMessages,
        sendMessage,
        getMessagesForContact,
        unreadMessages,
        markMessagesAsRead,
        activeChatId,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
