// src/Api/CommunityAPIs/chatApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/chat';

// Set default axios configuration
axios.defaults.withCredentials = true;

/**
 * Fetch chat messages between two users (EduSphere context)
 * @param {string} userId - Current user ID
 * @param {string} contactId - Contact user ID
 * @returns {Promise<Array>} Array of chat messages
 */
export const fetchChatMessages = async (userId, contactId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${userId}/${contactId}`, { 
      withCredentials: true 
    });
    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch chat messages:', error);
    return [];
  }
};

/**
 * Fetch community chat messages between two users
 * @param {string} userId - Current user ID
 * @param {string} contactId - Contact user ID
 * @returns {Promise<Array>} Array of community chat messages
 */
export const fetchCommunityChatMessages = async (userId, contactId) => {
  try {
    const response = await axios.get(`${BASE_URL}/community/${userId}/${contactId}`, { 
      withCredentials: true 
    });
    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch community chat messages:', error);
    return [];
  }
};

/**
 * Get unread message count for community chats
 * @param {string} userId - Current user ID
 * @returns {Promise<Object>} Unread count data
 */
export const getCommunityUnreadCount = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/unread/${userId}?context=community`, { 
      withCredentials: true 
    });
    return response.data || {};
  } catch (error) {
    console.error('Failed to get community unread count:', error);
    return {};
  }
};

/**
 * Mark community messages as read
 * @param {string} userId - Current user ID
 * @param {string} contactId - Contact user ID
 * @returns {Promise<Object>} Response data
 */
export const markCommunityMessagesAsRead = async (userId, contactId) => {
  try {
    const response = await axios.post(`${BASE_URL}/mark-read`, { 
      userId,
      contactId,
      context: 'community'
    }, { 
      withCredentials: true 
    });
    return response.data;
  } catch (error) {
    console.error('Failed to mark community messages as read:', error);
    throw error;
  }
};

/**
 * Send a chat message
 * @param {Object} message - Message object with senderId, receiverId, content, context
 * @returns {Promise<Object>} Response data
 */
export const sendChatMessage = async (message) => {
  try {
    const response = await axios.post(`${BASE_URL}/send`, message, { 
      withCredentials: true 
    });
    return response.data;
  } catch (error) {
    console.error('Failed to send chat message:', error);
    throw error;
  }
};

/**
 * Get chat history for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of chat conversations
 */
export const getChatHistory = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/history/${userId}`, { 
      withCredentials: true 
    });
    return response.data || [];
  } catch (error) {
    console.error('Failed to get chat history:', error);
    return [];
  }
};

/**
 * Delete a chat message
 * @param {string} messageId - Message ID to delete
 * @returns {Promise<Object>} Response data
 */
export const deleteChatMessage = async (messageId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/message/${messageId}`, { 
      withCredentials: true 
    });
    return response.data;
  } catch (error) {
    console.error('Failed to delete chat message:', error);
    throw error;
  }
};

export default {
  fetchChatMessages,
  fetchCommunityChatMessages,
  getCommunityUnreadCount,
  markCommunityMessagesAsRead,
  sendChatMessage,
  getChatHistory,
  deleteChatMessage
};