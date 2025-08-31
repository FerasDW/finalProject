import axios from 'axios';

const BASE_URL = 'http://13.61.114.153:8081/api/chat';

// Helper function to get token from localStorage
const getToken = () => {
    return localStorage.getItem("jwtToken");
};

// Helper function to get authorization headers
const getAuthHeaders = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Create axios config with auth headers
const createAuthConfig = (additionalConfig = {}) => {
    return {
        ...additionalConfig,
        headers: {
            ...getAuthHeaders(),
            ...additionalConfig.headers
        }
    };
};

export const fetchCommunityChatMessages = async (user1Id, user2Id) => {
    try {
        const response = await axios.get(`${BASE_URL}/community/${user1Id}/${user2Id}`, createAuthConfig());
        return response.data || [];
    } catch (error) {
        return [];
    }
};

export const fetchCommunityConversations = async (userId) => {
    try {
        const response = await axios.get(`${BASE_URL}/conversations/${userId}?context=community`, createAuthConfig());
        return response.data || [];
    } catch (error) {
        return [];
    }
};

export const getCommunityUnreadCount = async (userId) => {
    try {
        const response = await axios.get(`${BASE_URL}/unread/${userId}?context=community`, createAuthConfig());
        return response.data.unreadCount || 0;
    } catch (error) {
        return 0;
    }
};

export const markCommunityMessagesAsRead = async (receiverId, senderId) => {
    try {
        const response = await axios.put(`${BASE_URL}/mark-read`, {
            receiverId,
            senderId,
            context: 'community'
        }, createAuthConfig());
        return response.data;
    } catch (error) {
        return { success: false };
    }
};

// Test connection to backend
export const testCommunityApiConnection = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/test`, createAuthConfig());
        return true;
    } catch (error) {
        return false;
    }
};