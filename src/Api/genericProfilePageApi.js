// profileAPI.js - API Layer for Profile Management using Real Backend
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';
const STUDENTS_URL = `${API_BASE_URL}/students`;
const LECTURERS_URL = `${API_BASE_URL}/lecturers`;
const GRADES_URL = `${API_BASE_URL}/grades`;
const COURSES_URL = `${API_BASE_URL}/courses`;
const ENROLLMENTS_URL = `${API_BASE_URL}/enrollments`;
const SCHEDULES_URL = `${API_BASE_URL}/schedules`;
const RESOURCES_URL = `${API_BASE_URL}/resources`;
const REQUESTS_URL = `${API_BASE_URL}/requests`;
const ANALYTICS_URL = `${API_BASE_URL}/analytics`;
const FILES_URL = `${API_BASE_URL}/files`;

axios.defaults.withCredentials = true;

/* ==================================================================
                            PROFILE DATA
   ================================================================== */

export const getProfileData = async (entityType, id) => {
  try {
    const baseUrl = entityType === 'student' ? STUDENTS_URL : LECTURERS_URL;
    const response = await axios.get(`${baseUrl}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${entityType} profile:`, error);
    throw error;
  }
};

export const getProfileStats = async (entityType, id) => {
  try {
    const response = await axios.get(`${ANALYTICS_URL}/${entityType}/${id}/stats`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${entityType} stats:`, error);
    throw error;
  }
};

export const getStatCards = async (entityType, stats) => {
  try {
    const response = await axios.post(`${ANALYTICS_URL}/${entityType}/stat-cards`, { stats });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${entityType} stat cards:`, error);
    throw error;
  }
};

export const getEntityProfile = async (entityType, id) => {
  try {
    const baseUrl = entityType === 'student' ? STUDENTS_URL : LECTURERS_URL;
    const response = await axios.get(`${baseUrl}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${entityType} entity profile:`, error);
    throw error;
  }
};

export const updateEntityProfile = async (entityType, id, profileData) => {
  try {
    const baseUrl = entityType === 'student' ? STUDENTS_URL : LECTURERS_URL;
    const response = await axios.put(`${baseUrl}/${id}`, profileData);
    return response.data;
  } catch (error) {
    console.error(`Error updating ${entityType} profile:`, error);
    throw error;
  }
};

/* ==================================================================
                            GRADES
   ================================================================== */

export const getGrades = async (entityType, id) => {
  try {
    const response = await axios.get(`${GRADES_URL}/by-${entityType}/${id}`);
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching grades for ${entityType}:`, error);
    return [];
  }
};

export const addGrade = async (entityType, id, gradeData) => {
  try {
    const response = await axios.post(GRADES_URL, {
      ...gradeData,
      [`${entityType}Id`]: id
    });
    return response.data;
  } catch (error) {
    console.error("Error adding grade:", error);
    throw error;
  }
};

export const updateGrade = async (entityType, id, gradeId, gradeData) => {
  try {
    const response = await axios.put(`${GRADES_URL}/${gradeId}`, {
      ...gradeData,
      [`${entityType}Id`]: id
    });
    return response.data;
  } catch (error) {
    console.error("Error updating grade:", error);
    throw error;
  }
};

export const deleteGrade = async (entityType, id, gradeId) => {
  try {
    await axios.delete(`${GRADES_URL}/${gradeId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting grade:", error);
    throw error;
  }
};

/* ==================================================================
                            COURSES
   ================================================================== */

export const getCourses = async (entityType, id) => {
  try {
    const response = await axios.get(`${COURSES_URL}/by-${entityType}/${id}`);
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching courses for ${entityType}:`, error);
    return [];
  }
};

export const getAvailableCourses = async () => {
  try {
    const response = await axios.get(`${COURSES_URL}/available`);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching available courses:", error);
    return [];
  }
};

export const addCourse = async (entityType, id, courseData) => {
  try {
    if (entityType === 'lecturer') {
      // For lecturers, assign existing course
      const response = await axios.post(`${COURSES_URL}/assign`, {
        lecturerId: id,
        ...courseData
      });
      return response.data;
    } else {
      // For students, create new course
      const response = await axios.post(COURSES_URL, {
        ...courseData,
        createdBy: id
      });
      return response.data;
    }
  } catch (error) {
    console.error("Error adding course:", error);
    throw error;
  }
};

export const updateCourse = async (entityType, id, courseId, courseData) => {
  try {
    const response = await axios.put(`${COURSES_URL}/${courseId}`, courseData);
    return response.data;
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
};

export const deleteCourse = async (entityType, id, courseId) => {
  try {
    if (entityType === 'lecturer') {
      // For lecturers, unassign course
      await axios.delete(`${COURSES_URL}/unassign/${courseId}/${id}`);
    } else {
      // For students, delete course
      await axios.delete(`${COURSES_URL}/${courseId}`);
    }
    return { success: true };
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
};

/* ==================================================================
                            ENROLLMENTS
   ================================================================== */

export const getEnrollments = async (entityType, id) => {
  try {
    const response = await axios.get(`${ENROLLMENTS_URL}/by-${entityType}/${id}`);
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching enrollments for ${entityType}:`, error);
    return [];
  }
};

export const addEnrollment = async (entityType, id, enrollmentData) => {
  try {
    const response = await axios.post(ENROLLMENTS_URL, {
      ...enrollmentData,
      [`${entityType}Id`]: id
    });
    return response.data;
  } catch (error) {
    console.error("Error adding enrollment:", error);
    throw error;
  }
};

export const updateEnrollment = async (entityType, id, enrollmentId, enrollmentData) => {
  try {
    const response = await axios.put(`${ENROLLMENTS_URL}/${enrollmentId}`, {
      ...enrollmentData,
      [`${entityType}Id`]: id
    });
    return response.data;
  } catch (error) {
    console.error("Error updating enrollment:", error);
    throw error;
  }
};

export const deleteEnrollment = async (entityType, id, enrollmentId) => {
  try {
    await axios.delete(`${ENROLLMENTS_URL}/${enrollmentId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting enrollment:", error);
    throw error;
  }
};

/* ==================================================================
                            SCHEDULES
   ================================================================== */

export const getSchedule = async (entityType, id) => {
  try {
    const response = await axios.get(`${SCHEDULES_URL}/by-${entityType}/${id}`);
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching schedule for ${entityType}:`, error);
    return [];
  }
};

export const addSchedule = async (entityType, id, scheduleData) => {
  try {
    const response = await axios.post(SCHEDULES_URL, {
      ...scheduleData,
      [`${entityType}Id`]: id
    });
    return response.data;
  } catch (error) {
    console.error("Error adding schedule:", error);
    throw error;
  }
};

export const updateSchedule = async (entityType, id, scheduleId, scheduleData) => {
  try {
    const response = await axios.put(`${SCHEDULES_URL}/${scheduleId}`, {
      ...scheduleData,
      [`${entityType}Id`]: id
    });
    return response.data;
  } catch (error) {
    console.error("Error updating schedule:", error);
    throw error;
  }
};

export const deleteSchedule = async (entityType, id, scheduleId) => {
  try {
    await axios.delete(`${SCHEDULES_URL}/${scheduleId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting schedule:", error);
    throw error;
  }
};

/* ==================================================================
                            RESOURCES
   ================================================================== */

export const getResources = async (entityType, id) => {
  try {
    const response = await axios.get(`${RESOURCES_URL}/by-${entityType}/${id}`);
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching resources for ${entityType}:`, error);
    return [];
  }
};

export const addResource = async (entityType, id, resourceData) => {
  try {
    // Handle file upload
    if (resourceData.file) {
      const formData = new FormData();
      formData.append('file', resourceData.file);
      
      // Append other form fields
      Object.keys(resourceData).forEach(key => {
        if (key !== 'file' && resourceData[key] !== undefined && resourceData[key] !== null) {
          formData.append(key, resourceData[key]);
        }
      });
      
      formData.append(`${entityType}Id`, id);
      
      const response = await axios.post(`${RESOURCES_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // Regular resource without file
      const response = await axios.post(RESOURCES_URL, {
        ...resourceData,
        [`${entityType}Id`]: id
      });
      return response.data;
    }
  } catch (error) {
    console.error("Error adding resource:", error);
    throw error;
  }
};

export const updateResource = async (entityType, id, resourceId, resourceData) => {
  try {
    // Handle file upload update
    if (resourceData.file) {
      const formData = new FormData();
      formData.append('file', resourceData.file);
      
      // Append other form fields
      Object.keys(resourceData).forEach(key => {
        if (key !== 'file' && resourceData[key] !== undefined && resourceData[key] !== null) {
          formData.append(key, resourceData[key]);
        }
      });
      
      formData.append(`${entityType}Id`, id);
      
      const response = await axios.put(`${RESOURCES_URL}/${resourceId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // Regular resource update without file
      const response = await axios.put(`${RESOURCES_URL}/${resourceId}`, {
        ...resourceData,
        [`${entityType}Id`]: id
      });
      return response.data;
    }
  } catch (error) {
    console.error("Error updating resource:", error);
    throw error;
  }
};

export const deleteResource = async (entityType, id, resourceId) => {
  try {
    await axios.delete(`${RESOURCES_URL}/${resourceId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting resource:", error);
    throw error;
  }
};

export const downloadResource = async (entityType, id, resourceId) => {
  try {
    const response = await axios.get(`${RESOURCES_URL}/${resourceId}/download`, {
      responseType: 'blob',
    });
    
    // Get filename from response headers or use default
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'download';
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }
    
    // Create download link and trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    window.URL.revokeObjectURL(url);
    
    return { success: true, filename };
  } catch (error) {
    console.error("Error downloading resource:", error);
    throw error;
  }
};

export const previewResource = async (entityType, id, resourceId) => {
  try {
    const response = await axios.get(`${RESOURCES_URL}/${resourceId}/preview`, {
      responseType: 'blob',
    });
    
    const blob = response.data;
    const previewUrl = window.URL.createObjectURL(blob);
    
    // Get content type from response headers
    const contentType = response.headers['content-type'];
    
    if (contentType?.startsWith('image/')) {
      // Handle image preview
      const newWindow = window.open('', '_blank');
      newWindow.document.write(`
        <html>
          <head>
            <title>Preview</title>
            <style>
              body { margin: 0; padding: 20px; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f5f5f5; }
              img { max-width: 100%; max-height: 90vh; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
            </style>
          </head>
          <body>
            <img src="${previewUrl}" alt="Preview" />
          </body>
        </html>
      `);
    } else if (contentType === 'application/pdf') {
      // Handle PDF preview
      window.open(previewUrl, '_blank');
    } else {
      // Handle other file types
      window.open(previewUrl, '_blank');
    }
    
    // Clean up URL after some time
    setTimeout(() => window.URL.revokeObjectURL(previewUrl), 10000);
    
    return { success: true, contentType };
  } catch (error) {
    console.error("Error previewing resource:", error);
    throw error;
  }
};

/* ==================================================================
                            REQUESTS
   ================================================================== */

export const getRequests = async (entityType, id) => {
  try {
    const response = await axios.get(`${REQUESTS_URL}/by-${entityType}/${id}`);
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching requests for ${entityType}:`, error);
    return [];
  }
};

export const addRequest = async (entityType, id, requestData) => {
  try {
    const response = await axios.post(REQUESTS_URL, {
      ...requestData,
      [`${entityType}Id`]: id,
      status: 'pending'
    });
    return response.data;
  } catch (error) {
    console.error("Error adding request:", error);
    throw error;
  }
};

export const updateRequest = async (entityType, id, requestId, requestData) => {
  try {
    const response = await axios.put(`${REQUESTS_URL}/${requestId}`, {
      ...requestData,
      [`${entityType}Id`]: id
    });
    return response.data;
  } catch (error) {
    console.error("Error updating request:", error);
    throw error;
  }
};

export const updateRequestStatus = async (entityType, id, requestId, status) => {
  try {
    const response = await axios.patch(`${REQUESTS_URL}/${requestId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating request status:", error);
    throw error;
  }
};

export const submitRequestResponse = async (entityType, id, requestId, response) => {
  try {
    const result = await axios.post(`${REQUESTS_URL}/${requestId}/response`, {
      response,
      responseDate: new Date().toISOString().split('T')[0],
      status: 'responded'
    });
    return result.data;
  } catch (error) {
    console.error("Error submitting request response:", error);
    throw error;
  }
};

export const deleteRequest = async (entityType, id, requestId) => {
  try {
    await axios.delete(`${REQUESTS_URL}/${requestId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting request:", error);
    throw error;
  }
};

/* ==================================================================
                            SEARCH & UTILITIES
   ================================================================== */

export const searchEntities = async (entityType, searchTerm) => {
  try {
    const baseUrl = entityType === 'student' ? STUDENTS_URL : LECTURERS_URL;
    const response = await axios.get(`${baseUrl}/search`, {
      params: { q: searchTerm }
    });
    return response.data || [];
  } catch (error) {
    console.error(`Error searching ${entityType}s:`, error);
    return [];
  }
};

/* ==================================================================
                            ANALYTICS
   ================================================================== */

export const getAnalytics = async (entityType, id, timeframe = '30d') => {
  try {
    const response = await axios.get(`${ANALYTICS_URL}/${entityType}/${id}`, {
      params: { timeframe }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching analytics for ${entityType}:`, error);
    throw error;
  }
};

export const getPerformanceMetrics = async (entityType, id) => {
  try {
    const response = await axios.get(`${ANALYTICS_URL}/${entityType}/${id}/metrics`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching performance metrics for ${entityType}:`, error);
    throw error;
  }
};

/* ==================================================================
                            NOTIFICATIONS
   ================================================================== */

export const getNotifications = async (entityType, id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/notifications/by-${entityType}/${id}`);
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching notifications for ${entityType}:`, error);
    return [];
  }
};

export const markNotificationRead = async (entityType, id, notificationId) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

/* ==================================================================
                            FILES (Additional)
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
    return { success: true };
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

export const getFilesByCategory = async (categoryId) => {
  try {
    const response = await axios.get(`${FILES_URL}/by-category/${categoryId}`);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching files by category:", error);
    return [];
  }
};

// Export all API functions
export default {
  // Profile
  getProfileData,
  getProfileStats,
  getStatCards,
  getEntityProfile,
  updateEntityProfile,
  
  // Grades
  getGrades,
  addGrade,
  updateGrade,
  deleteGrade,
  
  // Courses
  getCourses,
  getAvailableCourses,
  addCourse,
  updateCourse,
  deleteCourse,
  
  // Enrollments
  getEnrollments,
  addEnrollment,
  updateEnrollment,
  deleteEnrollment,
  
  // Schedule
  getSchedule,
  addSchedule,
  updateSchedule,
  deleteSchedule,
  
  // Resources
  getResources,
  addResource,
  updateResource,
  deleteResource,
  downloadResource,
  previewResource,
  
  // Requests
  getRequests,
  addRequest,
  updateRequest,
  updateRequestStatus,
  submitRequestResponse,
  deleteRequest,
  
  // Utilities
  searchEntities,
  getAnalytics,
  getPerformanceMetrics,
  getNotifications,
  markNotificationRead,
  
  // Files
  uploadFile,
  deleteFile,
  getFilesByCategory,
};