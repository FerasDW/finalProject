import axios from "axios";

const API_URL = "http://13.61.114.153:8082/api/users";

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

const getUsersByRole = async (role) => {
    try {
        const res = await axios.get(`${API_URL}/role/${role}`, createAuthConfig());
        return res.data || [];
    } catch (error) {
        console.error(`Error fetching users with role ${role}:`, error);
        return [];
    }
};

export const fetchStudents = () => {
    return getUsersByRole("1300");
};

export const fetchLecturers = () => {
    return getUsersByRole("1200");
};

export const fetchAdmins = () => {
    return getUsersByRole("1100");
};

export const getUsersByIds = async (userIds) => {
    if (!userIds || userIds.length === 0) {
        return [];
    }
    try {
        const response = await axios.post(`${API_URL}/by-ids`, userIds, createAuthConfig());
        return response.data || [];
    } catch (error) {
        console.error("Error fetching users by IDs:", error);
        return [];
    }
};