import axios from 'axios';

const BASE_URL = 'http://13.61.114.153:8081/api/groups';

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
 * Get all available groups
 * @returns {Promise<Array>} Array of all groups
 */
export const getAllGroups = async () => {
    try {
        const response = await axios.get(BASE_URL, createAuthConfig());
        return response.data || [];
    } catch (error) {
        return [];
    }
};

/**
 * Get user's joined groups
 * @returns {Promise<Array>} Array of user's groups
 */
export const getMyGroups = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/my-groups`, createAuthConfig());
        return response.data || [];
    } catch (error) {
        return [];
    }
};

/**
 * Get group details by ID
 * @param {string} groupId - ID of the group
 * @returns {Promise<Object>} Group details
 */
export const getGroupDetails = async (groupId) => {
    try {
        const response = await axios.get(`${BASE_URL}/${groupId}`, createAuthConfig());
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Create a new group
 * @param {Object} groupData - Group data (name, description, type, img)
 * @returns {Promise<Object>} Created group
 */
export const createGroup = async (groupData) => {
    try {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('name', groupData.name);
        formData.append('description', groupData.description);
        formData.append('type', groupData.type);
        
        if (groupData.img) {
            formData.append('img', groupData.img);
        }

        const response = await axios.post(BASE_URL, formData, createAuthConfig({
            headers: { 'Content-Type': 'multipart/form-data' }
        }));
        
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Update group details
 * @param {string} groupId - ID of the group
 * @param {Object} groupData - Updated group data
 * @returns {Promise<Object>} Updated group
 */
export const updateGroup = async (groupId, groupData) => {
    try {
        const response = await axios.put(`${BASE_URL}/${groupId}`, groupData, createAuthConfig());
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Delete a group
 * @param {string} groupId - ID of the group to delete
 * @returns {Promise<Object>} Delete response
 */
export const deleteGroup = async (groupId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${groupId}`, createAuthConfig());
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Join a group
 * @param {string} groupId - ID of the group to join
 * @returns {Promise<Object>} Join response
 */
export const joinGroup = async (groupId) => {
    try {
        const response = await axios.post(`${BASE_URL}/${groupId}/join`, {}, createAuthConfig());
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Leave a group
 * @param {string} groupId - ID of the group to leave
 * @returns {Promise<Object>} Leave response
 */
export const leaveGroup = async (groupId) => {
    try {
        const response = await axios.post(`${BASE_URL}/${groupId}/leave`, {}, createAuthConfig());
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Get group members
 * @param {string} groupId - ID of the group
 * @returns {Promise<Array>} Array of group members
 */
export const getGroupMembers = async (groupId) => {
    try {
        const response = await axios.get(`${BASE_URL}/${groupId}/members`, createAuthConfig());
        return response.data || [];
    } catch (error) {
        return [];
    }
};

/**
 * Promote a member in a group
 * @param {string} groupId - ID of the group
 * @param {Object} memberData - Member data (userId, newRole)
 * @returns {Promise<Object>} Promotion response
 */
export const promoteMember = async (groupId, memberData) => {
    try {
        const response = await axios.post(`${BASE_URL}/${groupId}/promote`, memberData, createAuthConfig());
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Remove a member from a group
 * @param {string} groupId - ID of the group
 * @param {Object} memberData - Member data (userId)
 * @returns {Promise<Object>} Remove response
 */
export const removeMember = async (groupId, memberData) => {
    try {
        const response = await axios.post(`${BASE_URL}/${groupId}/remove`, memberData, createAuthConfig());
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Get posts from a specific group
 * @param {string} groupId - ID of the group
 * @returns {Promise<Array>} Array of group posts
 */
export const getGroupPosts = async (groupId) => {
    try {
        const response = await axios.get(`${BASE_URL}/${groupId}/posts`, createAuthConfig());
        return response.data || [];
    } catch (error) {
        return [];
    }
};

/**
 * Get group feed (posts from all joined groups)
 * @returns {Promise<Array>} Array of posts from user's groups
 */
export const getGroupFeed = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/feed`, createAuthConfig());
        return response.data || [];
    } catch (error) {
        return [];
    }
};

/**
 * Search groups
 * @param {string} searchTerm - Search query
 * @param {Object} filters - Search filters (type, sortBy, page, size)
 * @returns {Promise<Array>} Array of matching groups
 */
export const searchGroups = async (searchTerm = '', filters = {}) => {
    try {
        const params = new URLSearchParams();
        if (searchTerm.trim()) params.append('q', searchTerm.trim());
        if (filters.type && filters.type !== 'all') params.append('type', filters.type);
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        if (filters.page) params.append('page', filters.page);
        if (filters.size) params.append('size', filters.size);
        if (filters.category) params.append('category', filters.category);

        const response = await axios.get(`${BASE_URL}/search?${params.toString()}`, createAuthConfig());
        return response.data || [];
    } catch (error) {
        return [];
    }
};

/**
 * Get recommended groups for the user
 * @returns {Promise<Array>} Array of recommended groups
 */
export const getRecommendedGroups = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/recommendations`, createAuthConfig());
        return response.data || [];
    } catch (error) {
        return [];
    }
};

/**
 * Invite friends to a group
 * @param {string} groupId - ID of the group
 * @param {Object} inviteData - Invitation data (friendIds, message)
 * @returns {Promise<Object>} Invitation response
 */
export const inviteFriendsToGroup = async (groupId, inviteData) => {
    try {
        const response = await axios.post(`${BASE_URL}/${groupId}/invite-friends`, inviteData, createAuthConfig());
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Get group invitations for the current user
 * @param {string} status - Filter by status (PENDING, ACCEPTED, REJECTED)
 * @returns {Promise<Array>} Array of group invitations
 */
export const getGroupInvitations = async (status = 'PENDING') => {
    try {
        const url = status ? `${BASE_URL}/invitations?status=${status}` : `${BASE_URL}/invitations`;
        const response = await axios.get(url, createAuthConfig());
        return response.data || [];
    } catch (error) {
        return [];
    }
};

/**
 * Respond to a group invitation
 * @param {string} invitationId - ID of the invitation
 * @param {Object} responseData - Response data (response: 'ACCEPTED' or 'REJECTED')
 * @returns {Promise<Object>} Response result
 */
export const respondToGroupInvitation = async (invitationId, responseData) => {
    try {
        const response = await axios.post(`${BASE_URL}/invitations/${invitationId}/respond`, responseData, createAuthConfig());
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Get group statistics
 * @returns {Promise<Object>} Group statistics
 */
export const getGroupStats = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/stats`, createAuthConfig());
        return response.data || {};
    } catch (error) {
        return {};
    }
};

/**
 * Get group categories
 * @returns {Promise<Array>} Array of group categories
 */
export const getGroupCategories = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/categories`, createAuthConfig());
        return response.data || [];
    } catch (error) {
        return [];
    }
};

/**
 * Get group activity
 * @param {string} groupId - ID of the group
 * @param {number} page - Page number (default: 0)
 * @param {number} size - Page size (default: 20)
 * @returns {Promise<Array>} Array of group activities
 */
export const getGroupActivity = async (groupId, page = 0, size = 20) => {
    try {
        const response = await axios.get(`${BASE_URL}/${groupId}/activity?page=${page}&size=${size}`, createAuthConfig());
        return response.data || [];
    } catch (error) {
        return [];
    }
};

/**
 * Get trending groups
 * @returns {Promise<Array>} Array of trending groups
 */
export const getTrendingGroups = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/trending`, createAuthConfig());
        return response.data || [];
    } catch (error) {
        return [];
    }
};

/**
 * Pin a post in a group
 * @param {string} groupId - ID of the group
 * @param {string} postId - ID of the post to pin
 * @returns {Promise<Object>} Pin response
 */
export const pinPost = async (groupId, postId) => {
    try {
        const response = await axios.post(`${BASE_URL}/${groupId}/pin-post/${postId}`, {}, createAuthConfig());
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Unpin a post in a group
 * @param {string} groupId - ID of the group
 * @param {string} postId - ID of the post to unpin
 * @returns {Promise<Object>} Unpin response
 */
export const unpinPost = async (groupId, postId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${groupId}/pin-post/${postId}`, createAuthConfig());
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Get pinned posts for a group
 * @param {string} groupId - ID of the group
 * @returns {Promise<Array>} Array of pinned posts
 */
export const getPinnedPosts = async (groupId) => {
    try {
        const response = await axios.get(`${BASE_URL}/${groupId}/pinned-posts`, createAuthConfig());
        return response.data || [];
    } catch (error) {
        return [];
    }
};

/**
 * Update group settings
 * @param {string} groupId - ID of the group
 * @param {Object} settings - Group settings to update
 * @returns {Promise<Object>} Updated settings response
 */
export const updateGroupSettings = async (groupId, settings) => {
    try {
        const response = await axios.put(`${BASE_URL}/${groupId}/settings`, settings, createAuthConfig());
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Report a group
 * @param {string} groupId - ID of the group to report
 * @param {Object} reportData - Report details (reason, description)
 * @returns {Promise<Object>} Report response
 */
export const reportGroup = async (groupId, reportData) => {
    try {
        const response = await axios.post(`${BASE_URL}/${groupId}/report`, reportData, createAuthConfig());
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Test connection to groups API
 * @returns {Promise<boolean>} True if connection successful
 */
export const testGroupsApiConnection = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/test`, createAuthConfig());
        return true;
    } catch (error) {
        return false;
    }
};

/**
 * Helper function to handle groups API errors consistently
 * @param {Error} error - The error object
 * @param {string} operation - Description of the operation that failed
 */
export const handleGroupsApiError = (error, operation) => {
    if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
            case 400:
                throw new Error(data.message || 'Bad request - please check your input');
            case 401:
                throw new Error('Unauthorized - please log in again');
            case 403:
                throw new Error('Forbidden - you do not have permission to perform this action');
            case 404:
                throw new Error('Group not found');
            case 409:
                throw new Error('Conflict - you may already be a member of this group');
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
    getAllGroups,
    getMyGroups,
    getGroupDetails,
    createGroup,
    updateGroup,
    deleteGroup,
    joinGroup,
    leaveGroup,
    getGroupMembers,
    promoteMember,
    removeMember,
    getGroupPosts,
    getGroupFeed,
    searchGroups,
    getRecommendedGroups,
    inviteFriendsToGroup,
    getGroupInvitations,
    respondToGroupInvitation,
    getGroupStats,
    getGroupCategories,
    getGroupActivity,
    getTrendingGroups,
    pinPost,
    unpinPost,
    getPinnedPosts,
    updateGroupSettings,
    reportGroup,
    testGroupsApiConnection,
    handleGroupsApiError
};