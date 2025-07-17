import React, { createContext, useContext, useEffect, useState } from "react";
import {
  connectWebSocket,
  sendMessage as sendSocketMessage,
} from "../websocket/chatSocket";
import { fetchChatMessages } from "../Api/CommunityAPIs/chatApi";
import { 
  fetchCommunityChatMessages, 
  getCommunityUnreadCount,
  markCommunityMessagesAsRead 
} from "../Api/CommunityAPIs/chatApi";
import { AuthContext } from "../Context/AuthContext";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { authData } = useContext(AuthContext);
  
  // Separate state for different contexts
  const [eduSphereMessagesMap, setEduSphereMessagesMap] = useState({});
  const [communityMessagesMap, setCommunityMessagesMap] = useState({});
  
  const [eduSphereUnreadMessages, setEduSphereUnreadMessages] = useState({});
  const [communityUnreadMessages, setCommunityUnreadMessages] = useState({});
  
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeChatContext, setActiveChatContext] = useState('eduSphere');
  
  // Loading states
  const [loadingContacts, setLoadingContacts] = useState({});

  // Initialize WebSocket connections when user is available
  useEffect(() => {
    if (!authData?.id) return;

    // Connect to both WebSocket contexts
    connectWebSocket(authData.id, 'eduSphere', (incomingMessage) => {
      handleIncomingMessage(incomingMessage, 'eduSphere');
    });

    connectWebSocket(authData.id, 'community', (incomingMessage) => {
      handleIncomingMessage(incomingMessage, 'community');
    });

    // Load initial unread counts
    loadUnreadCounts();

  }, [authData?.id]);

  // Load unread counts from server
  const loadUnreadCounts = async () => {
    if (!authData?.id) return;
    
    try {
      // Load community unread count
      const communityUnread = await getCommunityUnreadCount(authData.id);
      
      // You can add eduSphere unread count here if you have that API
      // const eduSphereUnread = await getEduSphereUnreadCount(authData.id);
      
    } catch (error) {
      console.error("Failed to load unread counts:", error);
    }
  };

  const handleIncomingMessage = (incomingMessage, context) => {
    const otherId =
      incomingMessage.senderId === authData.id
        ? incomingMessage.receiverId
        : incomingMessage.senderId;

    if (context === 'eduSphere') {
      setEduSphereMessagesMap((prev) => {
        const updated = {
          ...prev,
          [otherId]: [...(prev[otherId] || []), incomingMessage],
        };
        return updated;
      });

      // Only increment unread if it's for current user and not active chat
      if (
        incomingMessage.receiverId === authData.id &&
        (otherId !== activeChatId || activeChatContext !== 'eduSphere')
      ) {
        setEduSphereUnreadMessages((prev) => ({
          ...prev,
          [otherId]: (prev[otherId] || 0) + 1,
        }));
      }
    } else if (context === 'community') {
      setCommunityMessagesMap((prev) => {
        const updated = {
          ...prev,
          [otherId]: [...(prev[otherId] || []), incomingMessage],
        };
        return updated;
      });

      // Only increment unread if it's for current user and not active chat
      if (
        incomingMessage.receiverId === authData.id &&
        (otherId !== activeChatId || activeChatContext !== 'community')
      ) {
        setCommunityUnreadMessages((prev) => {
          const updated = {
            ...prev,
            [otherId]: (prev[otherId] || 0) + 1,
          };
          return updated;
        });
      }
    }
  };

  const loadMessages = async (contactId, context = 'eduSphere') => {
    if (!authData?.id || !contactId) return;
    
    const messagesMap = context === 'eduSphere' ? eduSphereMessagesMap : communityMessagesMap;
    const setMessagesMap = context === 'eduSphere' ? setEduSphereMessagesMap : setCommunityMessagesMap;
    
    // Don't reload if already loaded and not empty
    if (messagesMap[contactId] && messagesMap[contactId].length > 0) {
      return;
    }

    // Prevent multiple simultaneous loads
    const loadingKey = `${contactId}_${context}`;
    if (loadingContacts[loadingKey]) {
      return;
    }

    setLoadingContacts(prev => ({ ...prev, [loadingKey]: true }));

    try {
      let data;
      if (context === 'eduSphere') {
        data = await fetchChatMessages(authData.id, contactId);
      } else {
        data = await fetchCommunityChatMessages(authData.id, contactId);
      }

      setMessagesMap((prev) => ({
        ...prev,
        [contactId]: data || [],
      }));

    } catch (error) {
      console.error(`Failed to load messages for ${contactId} in ${context}:`, error);
    } finally {
      setLoadingContacts(prev => {
        const updated = { ...prev };
        delete updated[loadingKey];
        return updated;
      });
    }
  };

  const sendMessage = (receiverId, content, context = 'eduSphere') => {
    if (!content.trim()) return;

    const msg = {
      senderId: authData.id,
      receiverId,
      content: content.trim(),
      context
    };

    // Send via WebSocket
    sendSocketMessage(msg, context);

    // Update local state immediately for sender
    const messagesMap = context === 'eduSphere' ? eduSphereMessagesMap : communityMessagesMap;
    const setMessagesMap = context === 'eduSphere' ? setEduSphereMessagesMap : setCommunityMessagesMap;

    const localMessage = { 
      ...msg, 
      timestamp: new Date().toISOString(),
      id: `temp_${Date.now()}` // Temporary ID for local message
    };

    setMessagesMap((prev) => ({
      ...prev,
      [receiverId]: [
        ...(prev[receiverId] || []),
        localMessage,
      ],
    }));
  };

  const getMessagesForContact = (contactId, context = 'eduSphere') => {
    const messagesMap = context === 'eduSphere' ? eduSphereMessagesMap : communityMessagesMap;
    const messages = messagesMap[contactId] || [];
    return messages;
  };

  const markMessagesAsRead = async (contactId, context = 'eduSphere') => {
    const setUnreadMessages = context === 'eduSphere' ? setEduSphereUnreadMessages : setCommunityUnreadMessages;
    
    setUnreadMessages((prev) => {
      const updated = { ...prev };
      delete updated[contactId];
      return updated;
    });
    
    setActiveChatId(contactId);
    setActiveChatContext(context);

    // Call API to mark messages as read on server
    try {
      if (context === 'community') {
        await markCommunityMessagesAsRead(authData.id, contactId);
      }
      // Add eduSphere API call here when available
    } catch (error) {
      console.error('Failed to mark messages as read on server:', error);
    }
  };

  const getUnreadCount = (context = 'eduSphere') => {
    const unreadMessages = context === 'eduSphere' ? eduSphereUnreadMessages : communityUnreadMessages;
    const total = Object.values(unreadMessages).reduce((total, count) => total + count, 0);
    return total;
  };

  const getUnreadCountForContact = (contactId, context = 'eduSphere') => {
    const unreadMessages = context === 'eduSphere' ? eduSphereUnreadMessages : communityUnreadMessages;
    return unreadMessages[contactId] || 0;
  };

  // Get all contacts with messages in a specific context
  const getContactsWithMessages = (context = 'eduSphere') => {
    const messagesMap = context === 'eduSphere' ? eduSphereMessagesMap : communityMessagesMap;
    return Object.keys(messagesMap).filter(contactId => messagesMap[contactId].length > 0);
  };

  return (
    <ChatContext.Provider
      value={{
        // Messages
        eduSphereMessagesMap,
        communityMessagesMap,
        loadMessages,
        sendMessage,
        getMessagesForContact,
        
        // Unread tracking
        eduSphereUnreadMessages,
        communityUnreadMessages,
        markMessagesAsRead,
        getUnreadCount,
        getUnreadCountForContact,
        
        // Active chat
        activeChatId,
        activeChatContext,
        setActiveChatContext,
        
        // Utility functions
        getContactsWithMessages,
        loadingContacts,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);