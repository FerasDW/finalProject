// src/Api/coursePageApi.js
import axios from 'axios';

const API_BASE_URL = 'http://13.61.114.153:8082/api';

const COURSES_URL = `${API_BASE_URL}/courses`;
const DEPARTMENTS_URL = `${API_BASE_URL}/departments`;
const ANALYTICS_URL = `${API_BASE_URL}/analytics`;
const CATEGORIES_URL = `${API_BASE_URL}/course-content/categories`;
const FILES_URL = `${API_BASE_URL}/course-content/files`;

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
                            COURSES
   ================================================================== */

export const getAllCourses = async () => {
    try {
        const response = await axios.get(COURSES_URL, createAuthConfig());
        return response.data || [];
    } catch (error) {
        console.error("Error fetching courses:", error);
        return [];
    }
};

export const getCourseById = async (courseId) => {
    try {
        const response = await axios.get(`${COURSES_URL}/${courseId}`, createAuthConfig());
        return response.data;
    } catch (error) {
        console.error(`Error fetching course with id ${courseId}:`, error);
        throw error;
    }
};

export const createCourse = async (courseData) => {
    try {
        const response = await axios.post(COURSES_URL, courseData, createAuthConfig());
        return response.data;
    } catch (error) {
        console.error("Error creating course:", error);
        throw error;
    }
};

export const updateCourse = async (courseId, courseData) => {
    try {
        const response = await axios.put(`${COURSES_URL}/${courseId}`, courseData, createAuthConfig());
        return response.data;
    } catch (error) {
        console.error("Error updating course:", error);
        throw error;
    }
};

export const deleteCourse = async (courseId) => {
    try {
        await axios.delete(`${COURSES_URL}/${courseId}`, createAuthConfig());
    } catch (error) {
        console.error("Error deleting course:", error);
        throw error;
    }
};

export const enrollStudent = async (courseId, enrollmentData) => {
    try {
        const response = await axios.post(`${COURSES_URL}/${courseId}/enroll`, enrollmentData, createAuthConfig());
        return response.data;
    } catch (error) {
        console.error("Error enrolling student:", error);
        throw error;
    }
};

export const unenrollStudents = async (courseId, studentIds) => {
    try {
        const response = await axios.delete(`${COURSES_URL}/${courseId}/enrollments`, createAuthConfig({
            data: { studentIds }
        }));
        return response.data;
    } catch (error) {
        console.error("Error unenrolling students:", error);
        throw error;
    }
};

/* ==================================================================
                            DEPARTMENTS
   ================================================================== */

export const getAllDepartments = async () => {
    try {
        const response = await axios.get(DEPARTMENTS_URL, createAuthConfig());
        return response.data || [];
    } catch (error) {
        console.error("Error fetching departments:", error);
        return [];
    }
};

export const createDepartment = async (departmentData) => {
    try {
        const response = await axios.post(DEPARTMENTS_URL, departmentData, createAuthConfig());
        return response.data;
    } catch (error) {
        console.error("Error creating department:", error);
        throw error;
    }
};

/* ==================================================================
                            ANALYTICS
   ================================================================== */

export const getCourseAnalytics = async (courseId, year) => {
    try {
        const response = await axios.get(`${ANALYTICS_URL}/course/${courseId}`, createAuthConfig({
            params: { year }
        }));
        return response.data;
    } catch (error) {
        console.error("Error fetching course analytics:", error);
        throw error;
    }
};

export const getAssignmentTimeline = async (courseId, year) => {
    try {
        const response = await axios.get(`${ANALYTICS_URL}/assignment-timeline/${courseId}`, createAuthConfig({
            params: { year }
        }));
        return response.data;
    } catch (error) {
        console.error("Error fetching assignment timeline:", error);
        throw error;
    }
};

/* ==================================================================
                            CATEGORIES
   ================================================================== */

export const getCategoriesByCourse = async (courseId, year) => {
    try {
        const response = await axios.get(`${CATEGORIES_URL}/by-course/${courseId}`, createAuthConfig({
            params: { year }
        }));
        return response.data;
    } catch (error) {
        console.error("Error fetching categories by course:", error);
        
        if (error.response) {
            const status = error.response.status;
            const errorMessage = error.response.data?.error || error.response.data?.message || 'Unknown error';
            
            if (status === 403) {
                throw new Error(`Access denied: ${errorMessage}`);
            } else if (status === 401) {
                throw new Error("You need to be logged in to view categories.");
            } else if (status === 404) {
                throw new Error("Course not found.");
            } else {
                throw new Error(`Server error (${status}): ${errorMessage}`);
            }
        } else if (error.request) {
            throw new Error("Network error: Could not connect to server.");
        } else {
            throw new Error(`Request error: ${error.message}`);
        }
    }
};

export const createCategory = async (courseId, year, categoryData) => {
    try {
        const response = await axios.post(CATEGORIES_URL, categoryData, createAuthConfig({
            params: { courseId, year }
        }));
        return response.data;
    } catch (error) {
        console.error("Error creating category:", error);
        
        if (error.response) {
            const status = error.response.status;
            const errorMessage = error.response.data?.error || error.response.data?.message || 'Unknown error';
            
            if (status === 403) {
                throw new Error(`Access denied: ${errorMessage}`);
            } else if (status === 400) {
                throw new Error(`Invalid data: ${errorMessage}`);
            } else {
                throw new Error(`Server error (${status}): ${errorMessage}`);
            }
        }
        throw new Error("Failed to create category.");
    }
};

export const updateCategory = async (categoryId, categoryData) => {
    try {
        const response = await axios.put(`${CATEGORIES_URL}/${categoryId}`, categoryData, createAuthConfig());
        return response.data;
    } catch (error) {
        console.error("Error updating category:", error);
        
        if (error.response) {
            const status = error.response.status;
            const errorMessage = error.response.data?.error || error.response.data?.message || 'Unknown error';
            
            if (status === 403) {
                throw new Error(`Access denied: ${errorMessage}`);
            } else if (status === 400) {
                throw new Error(`Invalid data: ${errorMessage}`);
            } else {
                throw new Error(`Server error (${status}): ${errorMessage}`);
            }
        }
        throw new Error("Failed to update category.");
    }
};

export const deleteCategory = async (categoryId) => {
    try {
        await axios.delete(`${CATEGORIES_URL}/${categoryId}`, createAuthConfig());
        return true;
    } catch (error) {
        console.error("Error deleting category:", error);
        
        if (error.response) {
            const status = error.response.status;
            const errorMessage = error.response.data?.error || error.response.data?.message || 'Unknown error';
            
            if (status === 403) {
                throw new Error(`Access denied: ${errorMessage}`);
            } else {
                throw new Error(`Server error (${status}): ${errorMessage}`);
            }
        }
        throw new Error("Failed to delete category.");
    }
};

/* ==================================================================
                            FILES
   ================================================================== */

export const uploadFile = async (categoryId, file, metadata = {}) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        
        if (metadata.description) {
            formData.append('description', metadata.description);
        }
        
        const response = await axios.post(`${FILES_URL}/upload/${categoryId}`, formData, createAuthConfig({
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }));
        return response.data;
    } catch (error) {
        console.error("Error uploading file:", error);
        
        if (error.response) {
            const status = error.response.status;
            const errorMessage = error.response.data?.error || error.response.data?.message || 'Unknown error';
            
            if (status === 403) {
                throw new Error(`Access denied: ${errorMessage}`);
            } else if (status === 400) {
                throw new Error(`Upload error: ${errorMessage}`);
            } else {
                throw new Error(`Server error (${status}): ${errorMessage}`);
            }
        }
        throw new Error("Failed to upload file.");
    }
};

export const deleteFile = async (fileId) => {
    try {
        await axios.delete(`${FILES_URL}/${fileId}`, createAuthConfig());
        return true;
    } catch (error) {
        console.error("❌ Delete failed:", error);
        console.error("❌ Response data:", error.response?.data);
        console.error("❌ Response status:", error.response?.status);
        
        if (error.response) {
            const status = error.response.status;
            const errorMessage = error.response.data?.error || error.response.data?.message || 'Unknown error';
            
            if (status === 403) {
                throw new Error(`Access denied: ${errorMessage}`);
            } else if (status === 404) {
                throw new Error("File not found.");
            } else {
                throw new Error(`Server error (${status}): ${errorMessage}`);
            }
        }
        throw new Error("Failed to delete file.");
    }
};

export const getFilesByCategory = async (categoryId) => {
    try {
        const response = await axios.get(`${FILES_URL}/by-category/${categoryId}/simple`, createAuthConfig());
        return response.data;
    } catch (error) {
        console.error("Error fetching files by category:", error);
        
        if (error.response) {
            const status = error.response.status;
            const errorMessage = error.response.data?.error || error.response.data?.message || 'Unknown error';
            
            if (status === 403) {
                throw new Error(`Access denied: ${errorMessage}`);
            } else if (status === 401) {
                throw new Error("You need to be logged in to view files.");
            } else if (status === 404) {
                throw new Error("Category not found.");
            } else {
                throw new Error(`Server error (${status}): ${errorMessage}`);
            }
        } else if (error.request) {
            throw new Error("Network error: Could not connect to server.");
        } else {
            throw new Error(`Request error: ${error.message}`);
        }
    }
};

export const getFilesByCategoryPaginated = async (categoryId, page = 0, size = 20, sortBy = 'uploadDate', sortDir = 'desc') => {
    try {
        const response = await axios.get(`${FILES_URL}/by-category/${categoryId}`, createAuthConfig({
            params: { page, size, sortBy, sortDir }
        }));
        return response.data;
    } catch (error) {
        console.error("Error fetching paginated files:", error);
        
        if (error.response) {
            const status = error.response.status;
            const errorMessage = error.response.data?.error || error.response.data?.message || 'Unknown error';
            
            if (status === 403) {
                throw new Error(`Access denied: ${errorMessage}`);
            } else {
                throw new Error(`Server error (${status}): ${errorMessage}`);
            }
        }
        throw new Error("Failed to fetch files for category.");
    }
};

export const downloadFile = async (fileId, fileName) => {
    try {
        const response = await axios.get(`${FILES_URL}/${fileId}/download`, createAuthConfig({
            responseType: 'blob'
        }));
        
        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
        return true;
    } catch (error) {
        console.error("❌ Download failed:", error);
        
        if (error.response) {
            const status = error.response.status;
            const errorMessage = error.response.data?.error || 'Unknown error';
            
            if (status === 403) {
                throw new Error(`Access denied: ${errorMessage}`);
            } else if (status === 404) {
                throw new Error("File not found.");
            } else {
                throw new Error(`Server error (${status}): ${errorMessage}`);
            }
        }
        throw new Error("Failed to download file.");
    }
};

export const getFileInfo = async (fileId) => {
    try {
        const response = await axios.get(`${FILES_URL}/${fileId}/info`, createAuthConfig());
        return response.data;
    } catch (error) {
        console.error("Error fetching file info:", error);
        
        if (error.response) {
            const status = error.response.status;
            const errorMessage = error.response.data?.error || 'Unknown error';
            
            if (status === 403) {
                throw new Error(`Access denied: ${errorMessage}`);
            } else if (status === 404) {
                throw new Error("File not found.");
            } else {
                throw new Error(`Server error (${status}): ${errorMessage}`);
            }
        }
        throw new Error("Failed to fetch file info.");
    }
};

export const getFilesCountByCategory = async (categoryId) => {
    try {
        const response = await axios.get(`${FILES_URL}/category/${categoryId}/count`, createAuthConfig());
        return response.data.count;
    } catch (error) {
        console.error("Error fetching file count:", error);
        
        if (error.response) {
            const status = error.response.status;
            const errorMessage = error.response.data?.error || 'Unknown error';
            
            if (status === 403) {
                throw new Error(`Access denied: ${errorMessage}`);
            } else {
                throw new Error(`Server error (${status}): ${errorMessage}`);
            }
        }
        throw new Error("Failed to fetch file count.");
    }
};