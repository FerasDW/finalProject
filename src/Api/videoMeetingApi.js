import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://13.61.114.153:8082/api';

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

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    console.error(`API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${message}`);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    return Promise.reject(new Error(message));
  }
);

export const meetingApi = {
  createMeeting: async (meetingData) => {
    try {
      const response = await apiClient.post('/meetings', {
        ...meetingData,
        createdAt: new Date().toISOString()
      }, createAuthConfig());
      return response;
    } catch (error) {
      console.error('ERROR: Failed to create meeting:', error);
      throw new Error(`Failed to create meeting: ${error.message}`);
    }
  },

  getUserMeetings: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });
      const endpoint = `/meetings/user${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get(endpoint, createAuthConfig());
      if (!Array.isArray(response)) {
        console.warn('WARN: Expected array but got:', typeof response, response);
        return [];
      }
      return response;
    } catch (error) {
      console.error('ERROR: Failed to fetch user meetings:', error);
      return [];
    }
  },

  getMeetingById: async (meetingId) => {
    try {
      const response = await apiClient.get(`/meetings/${meetingId}`, createAuthConfig());
      return response;
    } catch (error) {
      console.error('ERROR: Failed to fetch meeting:', error);
      throw new Error(`Failed to fetch meeting: ${error.message}`);
    }
  },

  getMeetingInvitation: async (meetingId) => {
    try {
      const response = await apiClient.get(`/meetings/${meetingId}/invitation`, createAuthConfig());
      return response;
    } catch (error) {
      console.error('ERROR: Failed to fetch meeting invitation:', error);
      throw new Error(`Failed to fetch meeting invitation: ${error.message}`);
    }
  },

  updateMeeting: async (meetingId, updateData) => {
    try {
      const response = await apiClient.put(`/meetings/${meetingId}`, {
        ...updateData,
        updatedAt: new Date().toISOString()
      }, createAuthConfig());
      return response;
    } catch (error) {
      console.error('ERROR: Failed to update meeting:', error);
      throw new Error(`Failed to update meeting: ${error.message}`);
    }
  },

  deleteMeeting: async (meetingId) => {
    try {
      await apiClient.delete(`/meetings/${meetingId}`, createAuthConfig());
    } catch (error) {
      console.error('ERROR: Failed to delete meeting:', error);
      throw new Error(`Failed to delete meeting: ${error.message}`);
    }
  },

  checkRecentSession: async (meetingId, userId) => {
    try {
      const response = await apiClient.post(`/meetings/${meetingId}/check-recent-session`, {
        userId,
        checkTime: new Date().toISOString()
      }, createAuthConfig());
      return response;
    } catch (error) {
      console.warn('WARN: Recent session check failed:', error.message);
      return { canResume: false };
    }
  },

  resumeSession: async (meetingId, sessionId) => {
    try {
      const response = await apiClient.post(`/meetings/${meetingId}/resume-session`, {
        sessionId,
        resumeTime: new Date().toISOString()
      }, createAuthConfig());
      return response;
    } catch (error) {
      console.error('ERROR: Failed to resume session:', error);
      throw new Error(`Failed to resume session: ${error.message}`);
    }
  },

  joinMeeting: async (meetingId, joinData = {}) => {
    try {
      const response = await apiClient.post(`/meetings/${meetingId}/join`, {
        ...joinData,
        joinTime: new Date().toISOString()
      }, createAuthConfig());
      return response;
    } catch (error) {
      console.error('ERROR: Failed to join meeting:', error);
      throw new Error(`Failed to join meeting: ${error.message}`);
    }
  },

  leaveMeeting: async (meetingId, sessionId) => {
    const leaveData = {
      sessionId,
      leaveTime: new Date().toISOString()
    };

    try {
      const response = await apiClient.post(`/meetings/${meetingId}/leave`, leaveData, createAuthConfig());
      return response;
    } catch (error) {
      console.error('ERROR: Primary leave API failed:', error.message);
      try {
        const fallbackResponse = await fetch(`${API_BASE_URL}/meetings/${meetingId}/leave`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
          },
          body: JSON.stringify(leaveData)
        });
        if (fallbackResponse.ok) {
          const result = await fallbackResponse.json();
          return result;
        }
        throw new Error(`Fallback failed: ${fallbackResponse.status}`);
      } catch (fetchError) {
        console.error('ERROR: Fallback leave API failed:', fetchError.message);
        try {
          const beaconData = new Blob([JSON.stringify({
            ...leaveData,
            reason: 'api_fallback'
          })], { type: 'application/json' });

          const beaconSent = navigator.sendBeacon(
            `${API_BASE_URL}/meetings/${meetingId}/leave`,
            beaconData
          );
          if (beaconSent) {
            return { status: 'left', method: 'beacon' };
          }
        } catch (beaconError) {
          console.error('ERROR: Beacon fallback failed:', beaconError.message);
        }
        throw new Error(`Failed to leave meeting: ${error.message}`);
      }
    }
  },

  getMeetingAttendance: async (meetingId) => {
    try {
      const response = await apiClient.get(`/meetings/${meetingId}/attendance`, createAuthConfig());
      if (!Array.isArray(response)) {
        console.warn('WARN: Expected array but got:', typeof response, response);
        return [];
      }
      return response;
    } catch (error) {
      console.error('ERROR: Failed to fetch meeting attendance:', error);
      return [];
    }
  },

  startMeeting: async (meetingId) => {
    try {
      const response = await apiClient.post(`/meetings/${meetingId}/start`, {
        startTime: new Date().toISOString()
      }, createAuthConfig());
      return response;
    } catch (error) {
      console.error('ERROR: Failed to start meeting:', error);
      throw new Error(`Failed to start meeting: ${error.message}`);
    }
  },

  endMeeting: async (meetingId) => {
    try {
      const response = await apiClient.post(`/meetings/${meetingId}/end`, {
        endTime: new Date().toISOString()
      }, createAuthConfig());
      return response;
    } catch (error) {
      console.error('ERROR: Failed to end meeting:', error);
      throw new Error(`Failed to end meeting: ${error.message}`);
    }
  },

  getActiveSessions: async (meetingId) => {
    try {
      const response = await apiClient.get(`/meetings/${meetingId}/active-sessions`, createAuthConfig());
      if (!Array.isArray(response)) {
        console.warn('WARN: Expected array but got:', typeof response, response);
        return [];
      }
      return response;
    } catch (error) {
      console.error('ERROR: Failed to fetch active sessions:', error);
      return [];
    }
  },

  sendHeartbeat: async (meetingId, sessionId) => {
    try {
      const response = await apiClient.post(`/meetings/${meetingId}/heartbeat`, {
        sessionId,
        timestamp: new Date().toISOString()
      }, createAuthConfig());
      return response;
    } catch (error) {
      console.warn('WARN: Heartbeat failed:', error.message);
      return { status: 'failed' };
    }
  }
};

export const courseApi = {
  getLecturerCourses: async () => {
    try {
      const response = await apiClient.get('/courses/lecturer', createAuthConfig());
      if (!Array.isArray(response)) {
        console.warn('WARN: Expected array but got:', typeof response, response);
        return [];
      }
      return response;
    } catch (error) {
      console.error('ERROR: Failed to fetch lecturer courses:', error);
      return [];
    }
  },

  getStudentCourses: async () => {
    try {
      const response = await apiClient.get('/courses/student', createAuthConfig());
      if (!Array.isArray(response)) {
        console.warn('WARN: Expected array but got:', typeof response, response);
        return [];
      }
      return response;
    } catch (error) {
      console.error('ERROR: Failed to fetch student courses:', error);
      return [];
    }
  },

  getCourseMeetings: async (courseId) => {
    try {
      const response = await apiClient.get(`/courses/${courseId}/meetings`, createAuthConfig());
      if (!Array.isArray(response)) {
        console.warn('WARN: Expected array but got:', typeof response, response);
        return [];
      }
      return response;
    } catch (error) {
      console.error('ERROR: Failed to fetch course meetings:', error);
      return [];
    }
  },

  getCourseStudents: async (courseId) => {
    try {
      const response = await apiClient.get(`/courses/${courseId}/students`, createAuthConfig());
      if (!Array.isArray(response)) {
        console.warn('WARN: Expected array but got:', typeof response, response);
        return [];
      }
      return response;
    } catch (error) {
      console.error('ERROR: Failed to fetch course students:', error);
      return [];
    }
  },

  getCourseAnalytics: async (courseId, filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });
      const endpoint = `/analytics/course/${courseId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get(endpoint, createAuthConfig());
      return response;
    } catch (error) {
      console.error('ERROR: Failed to fetch course analytics:', error);
      return {};
    }
  }
};

export const attendanceApi = {
  getAttendanceSummary: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });
      const endpoint = `/attendance/summary${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get(endpoint, createAuthConfig());
      return response;
    } catch (error) {
      console.error('ERROR: Failed to fetch attendance summary:', error);
      return {};
    }
  },

  getCourseAttendance: async (courseId, filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });
      const endpoint = `/attendance/course/${courseId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get(endpoint, createAuthConfig());
      if (!Array.isArray(response)) {
        console.warn('WARN: Expected array but got:', typeof response, response);
        return [];
      }
      return response;
    } catch (error) {
      console.error('ERROR: Failed to fetch course attendance:', error);
      return [];
    }
  },

  getStudentCourseAttendance: async (courseId, studentId) => {
    try {
      const response = await apiClient.get(`/attendance/course/${courseId}/student/${studentId}`, createAuthConfig());
      if (!Array.isArray(response)) {
        console.warn('WARN: Expected array but got:', typeof response, response);
        return [];
      }
      return response;
    } catch (error) {
      console.error('ERROR: Failed to fetch student course attendance:', error);
      return [];
    }
  },

  updateAttendance: async (attendanceId, updateData) => {
    try {
      const response = await apiClient.put(`/attendance/${attendanceId}`, updateData, createAuthConfig());
      return response;
    } catch (error) {
      console.error('ERROR: Failed to update attendance:', error);
      throw new Error(`Failed to update attendance: ${error.message}`);
    }
  }
};

export const testConnection = async () => {
  try {
    const response = await apiClient.get('/health', createAuthConfig({ timeout: 5000 }));
    return true;
  } catch (error) {
    console.warn('WARN: Connection test failed:', error.message);
    return false;
  }
};

export const handleApiError = (error, fallbackMessage = 'An unexpected error occurred') => {
  console.error('API Error Details:', {
    message: error.message,
    stack: error.stack,
    response: error.response?.data,
    status: error.response?.status
  });

  if (error.response) {
    const message = error.response.data?.message || error.response.statusText;
    return new Error(message);
  } else if (error.request) {
    return new Error('Network error. Please check your connection.');
  } else {
    return new Error(error.message || fallbackMessage);
  }
};

export const connectionUtils = {
  isOnline: () => navigator.onLine,

  onConnectionChange: (callback) => {
    const handleOnline = () => callback(true);
    const handleOffline = () => callback(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  },

  testConnection
};

export default {
  meetingApi,
  courseApi,
  attendanceApi,
  handleApiError,
  connectionUtils,
  testConnection
};