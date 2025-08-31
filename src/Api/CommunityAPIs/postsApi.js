import axios from 'axios';
import { processImageForPost } from '../Common/fileUploadApi';

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
 * Get the main feed posts
 * @returns {Promise<Array>} Array of posts for the feed
 */
export const getFeed = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/feed`, createAuthConfig());
        return response.data || [];
    } catch (error) {
        return [];
    }
};

/**
 * Get posts by a specific user
 * @param {string} userId - ID of the user
 * @returns {Promise<Array>} Array of user's posts
 */
export const getUserPosts = async (userId) => {
    try {
        const response = await axios.get(`${BASE_URL}/user/${userId}`, createAuthConfig());
        return response.data || [];
    } catch (error) {
        return [];
    }
};

/**
 * Create a new post with automatic image upload handling
 * @param {Object} postData - Post data including desc, img, file, etc.
 * @returns {Promise<Object>} Created post object
 */
export const createPost = async (postData) => {
    try {
        // Process image if it exists - convert blob URLs to server URLs
        let processedImageUrl = null;
        if (postData.img) {
            processedImageUrl = await processImageForPost(postData.img, 'community');
        }

        const requestData = {
            desc: postData.desc,
            img: processedImageUrl,
            file: postData.file || null,
            groupId: postData.groupId || null,
            groupName: postData.groupName || null,
        };

        const response = await axios.post(BASE_URL, requestData, createAuthConfig());
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Toggle like on a post
 * @param {string} postId - ID of the post
 * @param {string} userId - ID of the user liking/unliking
 * @returns {Promise<Object>} Updated likes data
 */
export const togglePostLike = async (postId, userId) => {
    try {
        const response = await axios.put(
            `${BASE_URL}/${postId}/like`,
            null,
            createAuthConfig({
                params: { userId },
            })
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Save a post
 * @param {string} postId - ID of the post to save
 * @returns {Promise<Object>} Save response
 */
export const savePost = async (postId) => {
    try {
        const response = await axios.post(`${BASE_URL}/${postId}/save`, {}, createAuthConfig());
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Unsave a post
 * @param {string} postId - ID of the post to unsave
 * @returns {Promise<Object>} Unsave response
 */
export const unsavePost = async (postId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${postId}/save`, createAuthConfig());
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Get saved posts for the current user
 * @returns {Promise<Array>} Array of saved posts
 */
export const getSavedPosts = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/saved`, createAuthConfig());
        return response.data || [];
    } catch (error) {
        return [];
    }
};

/**
 * Get comments for a specific post
 * @param {string} postId - ID of the post
 * @returns {Promise<Array>} Array of comments
 */
export const getPostComments = async (postId) => {
    try {
        const response = await axios.get(`${BASE_URL}/${postId}/comments`, createAuthConfig());
        return response.data || [];
    } catch (error) {
        return [];
    }
};

/**
 * Create a new comment on a post
 * @param {string} postId - ID of the post
 * @param {Object} commentData - Comment data (userId, username, text)
 * @returns {Promise<Object>} Comment creation response
 */
export const createComment = async (postId, commentData) => {
    try {
        const response = await axios.post(`${BASE_URL}/${postId}/comments`, commentData, createAuthConfig());
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Upload an image for a post (if separate endpoint needed)
 * @param {File} imageFile - Image file to upload
 * @returns {Promise<Object>} Upload response with image URL
 */
export const uploadPostImage = async (imageFile) => {
    try {
        const formData = new FormData();
        formData.append('image', imageFile);
        
        const response = await axios.post(`${BASE_URL}/upload-image`, formData, createAuthConfig({
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }));
        
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Upload a file for a post (if separate endpoint needed)
 * @param {File} file - File to upload
 * @returns {Promise<Object>} Upload response with file URL
 */
export const uploadPostFile = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await axios.post(`${BASE_URL}/upload-file`, formData, createAuthConfig({
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }));
        
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Delete a post (if user is owner)
 * @param {string} postId - ID of the post to delete
 * @returns {Promise<Object>} Delete response
 */
export const deletePost = async (postId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${postId}`, createAuthConfig());
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Report a post
 * @param {string} postId - ID of the post to report
 * @param {Object} reportData - Report details (reason, description)
 * @returns {Promise<Object>} Report response
 */
export const reportPost = async (postId, reportData) => {
    try {
        const response = await axios.post(`${BASE_URL}/${postId}/report`, reportData, createAuthConfig());
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Test connection to posts API
 * @returns {Promise<boolean>} True if connection successful
 */
export const testPostsApiConnection = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/test`, createAuthConfig());
        return true;
    } catch (error) {
        return false;
    }
};

/**
 * Helper function to handle posts API errors consistently
 * @param {Error} error - The error object
 * @param {string} operation - Description of the operation that failed
 */
export const handlePostsApiError = (error, operation) => {
    if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
            case 400:
                throw new Error(data.message || 'Bad request - please check your input');
            case 401:
                throw new Error('Unauthorized - please log in again');
            case 403:
                throw new Error('Forbidden - you do not have permission');
            case 404:
                throw new Error('Post not found');
            case 500:
                throw new Error('Server error - please try again later');
            default:
                throw new Error(data.message || 'An unexpected error occurred');
        }
    } else if (error.request) {
        throw new Error('Network error - please check your connection');
    } else {
        throw new Error('Request failed - please try again');
    }
};

// Export all functions as default for easy importing
export default {
    getFeed,
    getUserPosts,
    createPost,
    togglePostLike,
    savePost,
    unsavePost,
    getSavedPosts,
    getPostComments,
    createComment,
    uploadPostImage,
    uploadPostFile,
    deletePost,
    reportPost,
    testPostsApiConnection,
    handlePostsApiError
};