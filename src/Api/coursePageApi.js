import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';
const COURSES_URL = `${API_BASE_URL}/courses`;
const DEPARTMENTS_URL = `${API_BASE_URL}/departments`;
const ANALYTICS_URL = `${API_BASE_URL}/analytics`;
const CATEGORIES_URL = `${API_BASE_URL}/categories`;
const FILES_URL = `${API_BASE_URL}/files`;

axios.defaults.withCredentials = true;

/* ==================================================================
                            COURSES
   ================================================================== */

export const getAllCourses = async () => {
    try {
        const response = await axios.get(COURSES_URL);
        return response.data || [];
    } catch (error) {
        console.error("Error fetching courses:", error);
        return [];
    }
};

export const getCourseById = async (courseId) => {
    try {
        const response = await axios.get(`${COURSES_URL}/${courseId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching course with id ${courseId}:`, error);
        throw error;
    }
};

export const createCourse = async (courseData) => {
    try {
        const response = await axios.post(COURSES_URL, courseData);
        return response.data;
    } catch (error) {
        console.error("Error creating course:", error);
        throw error;
    }
};

export const updateCourse = async (courseId, courseData) => {
    try {
        const response = await axios.put(`${COURSES_URL}/${courseId}`, courseData);
        return response.data;
    } catch (error) {
        console.error("Error updating course:", error);
        throw error;
    }
};

export const deleteCourse = async (courseId) => {
    try {
        await axios.delete(`${COURSES_URL}/${courseId}`);
    } catch (error) {
        console.error("Error deleting course:", error);
        throw error;
    }
};

export const enrollStudent = async (courseId, enrollmentData) => {
    try {
        const response = await axios.post(`${COURSES_URL}/${courseId}/enroll`, enrollmentData);
        return response.data;
    } catch (error) {
        console.error("Error enrolling student:", error);
        throw error;
    }
};


/* ==================================================================
                            DEPARTMENTS
   ================================================================== */

export const getAllDepartments = async () => {
    try {
        const response = await axios.get(DEPARTMENTS_URL);
        return response.data || [];
    } catch (error) {
        console.error("Error fetching departments:", error);
        return [];
    }
};

export const createDepartment = async (departmentData) => {
    try {
        const response = await axios.post(DEPARTMENTS_URL, departmentData);
        return response.data;
    } catch (error) {
        console.error("Error creating department:", error);
        throw error;
    }
};


/* ==================================================================
                            ANALYTICS
   ================================================================== */

// --- UPDATED: Added 'year' parameter ---
export const getCourseAnalytics = async (courseId, year) => {
    try {
        const response = await axios.get(`${ANALYTICS_URL}/course/${courseId}`, {
            params: { year } // This adds "?year=..." to the URL
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching course analytics:", error);
        throw error;
    }
};


/* ==================================================================
                            CATEGORIES
   ================================================================== */

// --- UPDATED: Added 'year' parameter ---
export const getCategoriesByCourse = async (courseId, year) => {
    try {
        const response = await axios.get(`${CATEGORIES_URL}/by-course/${courseId}`, {
            params: { year } // This adds "?year=..." to the URL
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching categories by course:", error);
        throw error;
    }
};

// --- UPDATED: Signature now includes courseId and year ---
export const createCategory = async (courseId, year, categoryData) => {
    try {
        const response = await axios.post(CATEGORIES_URL, categoryData, {
            params: { courseId, year } // Adds "?courseId=...&year=..."
        });
        return response.data;
    } catch (error) {
        console.error("Error creating category:", error);
        throw error;
    }
};

export const updateCategory = async (categoryId, categoryData) => {
    try {
        const response = await axios.put(`${CATEGORIES_URL}/${categoryId}`, categoryData);
        return response.data;
    } catch (error) {
        console.error("Error updating category:", error);
        throw error;
    }
};

export const deleteCategory = async (categoryId) => {
    try {
        await axios.delete(`${CATEGORIES_URL}/${categoryId}`);
    } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
    }
};


/* ==================================================================
                            FILES
   ================================================================== */

export const uploadFile = async (categoryId, file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post(`${FILES_URL}/upload/${categoryId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
};

export const deleteFile = async (fileId) => {
    try {
        await axios.delete(`${FILES_URL}/${fileId}`);
    } catch (error) {
        console.error("Error deleting file:", error);
        throw error;
    }
};

export const getFilesByCategory = async (categoryId) => {
    const response = await fetch(`${API_BASE_URL}/files/by-category/${categoryId}`);
    if (!response.ok) throw new Error("Failed to fetch files for category.");
    return response.json();
};

export const getAssignmentTimeline = async (courseId, year) => {
    try {
        const response = await axios.get(`${ANALYTICS_URL}/assignment-timeline/${courseId}`, {
            params: { year }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching assignment timeline:", error);
        throw error;
    }
};