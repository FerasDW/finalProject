import axios from 'axios';

const BASE_URL = 'http://13.61.114.153:8081/api/community/posts';

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

/**
 * Get all saved posts for the current user
 * @returns {Promise<Array>} Array of saved posts
 */
export const getSavedPosts = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/saved`, createAuthConfig());
        return response.data || [];
    } catch (error) {
        console.error('Failed to get saved posts:', error);
        return [];
    }
};

/**
 * Save a post
 * @param {string} postId - ID of the post to save
 * @returns {Promise<Object>} Response data
 */
export const savePost = async (postId) => {
    try {
        const response = await axios.post(`${BASE_URL}/${postId}/save`, {}, createAuthConfig());
        return response.data;
    } catch (error) {
        console.error('Failed to save post:', error);
        throw error;
    }
};

/**
 * Unsave a post
 * @param {string} postId - ID of the post to unsave
 * @returns {Promise<Object>} Response data
 */
export const unsavePost = async (postId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${postId}/save`, createAuthConfig());
        return response.data;
    } catch (error) {
        console.error('Failed to unsave post:', error);
        throw error;
    }
};

/**
 * Check if a post is saved
 * @param {string} postId - ID of the post to check
 * @returns {Promise<boolean>} True if post is saved
 */
export const isPostSaved = async (postId) => {
    try {
        const response = await axios.get(`${BASE_URL}/check/${postId}`, createAuthConfig());
        return response.data.saved || false;
    } catch (error) {
        console.error('Failed to check if post is saved:', error);
        return false;
    }
};

/**
 * Get saved posts count
 * @returns {Promise<number>} Number of saved posts
 */
export const getSavedPostsCount = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/count`, createAuthConfig());
        return response.data.count || 0;
    } catch (error) {
        console.error('Failed to get saved posts count:', error);
        return 0;
    }
};

/**
 * Clear all saved posts
 * @returns {Promise<Object>} Response data
 */
export const clearAllSavedPosts = async () => {
    try {
        const response = await axios.delete(`${BASE_URL}/clear`, createAuthConfig());
        return response.data;
    } catch (error) {
        console.error('Failed to clear saved posts:', error);
        throw error;
    }
};

export default {
    getSavedPosts,
    savePost,
    unsavePost,
    isPostSaved,
    getSavedPostsCount,
    clearAllSavedPosts
};