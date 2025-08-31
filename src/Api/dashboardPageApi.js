import axios from 'axios';

const BASE_URL = 'http://13.61.114.153:8082/api/dashboard';
const COURSES_URL = 'http://13.61.114.153:8082/api/courses';
const USERS_URL = 'http://13.61.114.153:8082/api/users';

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

/* ==================================================================
                      PRIMARY DASHBOARD LOADER
   ================================================================== */

export const getDashboardData = async (userRole) => {
  try {
    const response = await axios.get(`${BASE_URL}/complete/${userRole}`, createAuthConfig());
    return response.data || {
      stats: {},
      charts: {},
      assignments: [],
    };
  } catch (error) {
    console.error(`Error fetching complete dashboard data for role ${userRole}:`, error);
    return {
      stats: { userCount: 0, departmentCount: 0, systemLoad: '0%' },
      charts: { departmentEnrollment: [], systemUsage: [], annualEnrollment: [] },
      assignments: [],
    };
  }
};

/* ==================================================================
                        ASSIGNMENTS (CRUD)
   ================================================================== */

export const addAssignment = async (assignmentData) => {
  try {
    const response = await axios.post(`${BASE_URL}/assignments`, assignmentData, createAuthConfig());
    return response.data;
  } catch (error) {
    console.error("Error adding assignment:", error);
    throw error;
  }
};

export const updateAssignment = async (assignmentId, assignmentData) => {
  try {
    const response = await axios.put(`${BASE_URL}/assignments/${assignmentId}`, assignmentData, createAuthConfig());
    return response.data;
  } catch (error) {
    console.error("Error updating assignment:", error);
    throw error;
  }
};

export const deleteAssignment = async (assignmentId) => {
  try {
    await axios.delete(`${BASE_URL}/assignments/${assignmentId}`, createAuthConfig());
  } catch (error) {
    console.error("Error deleting assignment:", error);
    throw error;
  }
};

/* ==================================================================
                            FORM DATA
   ================================================================== */

export const getAllCourses = async () => {
    try {
        const response = await axios.get(COURSES_URL, createAuthConfig());
        return response.data || [];
    } catch (error) {
        console.error("Error fetching courses:", error);
        return [];
    }
}

/**
 * --- NEW ---
 * Fetches the list of all available lecturers (users with role '1200').
 * This will be used to populate the 'Instructor' dropdown in the assignment form.
 * @returns {Promise<Array>} An array of lecturer user objects.
 */
export const getAllLecturers = async () => {
    try {
        // Assuming '1200' is the role code for lecturers
        const response = await axios.get(`${USERS_URL}/role/1200`, createAuthConfig());
        return response.data || [];
    } catch (error) {
        console.error("Error fetching lecturers:", error);
        return [];
    }
}

/**
 * Fetches all data needed for the assignment form's select/dropdown fields.
 * @returns {Promise<Object>} An object containing arrays for 'courses' and 'instructors'.
 */
export const getAssignmentFormOptions = async () => {
    try {
        // We can fetch both lists in parallel for better performance
        const [coursesResponse, lecturersResponse] = await Promise.all([
            getAllCourses(),
            getAllLecturers()
        ]);
        
        return {
            courses: coursesResponse,
            instructors: lecturersResponse
        };
    } catch (error) {
        console.error("Error fetching form options:", error);
        return { courses: [], instructors: [] };
    }
}