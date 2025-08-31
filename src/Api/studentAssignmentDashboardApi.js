// api/studentAssignmentDashboardApi.js - Fixed to match backend endpoints
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://13.61.114.153:8082/api';

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
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      localStorage.removeItem('jwtToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const studentApi = {
  // ====================================
  // ASSIGNMENTS API (Tasks for Students)
  // ====================================

  getAssignmentsByCourse: async (courseId, filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.category) params.append('category', filters.category);
    if (filters.priority) params.append('priority', filters.priority);
    const url = `/courses/${courseId}/tasks${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiClient.get(url, createAuthConfig());
    return response.data;
  },

  getAssignmentsForStudent: async (studentId, courseId, status = null) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    const url = `/tasks/student/${studentId}/course/${courseId}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiClient.get(url, createAuthConfig());
    return response.data;
  },

  getAssignment: async (assignmentId) => {
    const response = await apiClient.get(`/tasks/${assignmentId}`, createAuthConfig());
    return response.data;
  },

  getUpcomingAssignments: async (studentId, courseId = null, daysAhead = 7) => {
    const params = new URLSearchParams();
    if (courseId) params.append('courseId', courseId);
    params.append('daysAhead', daysAhead);
    const url = `/tasks/student/${studentId}/upcoming${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiClient.get(url, createAuthConfig());
    return response.data;
  },

  getOverdueAssignments: async (studentId, courseId = null) => {
    const params = new URLSearchParams();
    if (courseId) params.append('courseId', courseId);
    const url = `/tasks/student/${studentId}/overdue${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiClient.get(url, createAuthConfig());
    return response.data;
  },

  searchAssignments: async (courseId, query) => {
    const response = await apiClient.get(`/tasks/search?courseId=${courseId}&query=${encodeURIComponent(query)}`, createAuthConfig());
    return response.data;
  },

  downloadAssignmentFile: async (assignmentId) => {
    try {
      const response = await apiClient.get(`/tasks/${assignmentId}/download`, createAuthConfig({
        responseType: 'blob'
      }));
      if (response.data instanceof Blob) {
        return response.data;
      } else {
        return response.data;
      }
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  },

  // ====================================
  // SUBMISSIONS API
  // ====================================

  createSubmission: async (submissionData) => {
    const response = await apiClient.post('/tasksubmissions/simple', submissionData, createAuthConfig());
    return response.data;
  },

  submitAssignment: async (assignmentId, submissionData) => {
    const formData = new FormData();
    formData.append('taskId', assignmentId);
    formData.append('content', submissionData.content || '');
    formData.append('notes', submissionData.notes || '');
    if (submissionData.files && submissionData.files.length > 0) {
      submissionData.files.forEach((file) => {
        formData.append('files', file);
      });
    }

    const response = await apiClient.post('/tasksubmissions', formData, createAuthConfig({
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }));
    return response.data;
  },

  updateSubmission: async (submissionId, updates) => {
    const response = await apiClient.put(`/tasksubmissions/${submissionId}/student`, updates, createAuthConfig());
    return response.data;
  },

  deleteSubmission: async (submissionId) => {
    try {
      const response = await apiClient.delete(`/tasksubmissions/${submissionId}`, createAuthConfig());
      return response.data;
    } catch (error) {
      console.error('❌ Delete submission error:', error);
      throw error;
    }
  },

  canDeleteSubmission: async (submissionId) => {
    try {
      const response = await apiClient.get(`/tasksubmissions/${submissionId}/can-delete`, createAuthConfig());
      return response.data;
    } catch (error) {
      console.error('❌ Error checking delete permission:', error);
      return { canDelete: false, reason: 'Unknown error' };
    }
  },

  getSubmission: async (submissionId) => {
    const response = await apiClient.get(`/tasksubmissions/${submissionId}`, createAuthConfig());
    return response.data;
  },

  getStudentSubmissions: async (studentId, courseId) => {
    const url = courseId
      ? `/tasksubmissions/student/${studentId}?courseId=${courseId}`
      : `/tasksubmissions/student/${studentId}`;
    const response = await apiClient.get(url, createAuthConfig());
    return response.data;
  },

  getStudentSubmissionForTask: async (studentId, taskId) => {
    const response = await apiClient.get(`/tasksubmissions/student/${studentId}/task/${taskId}`, createAuthConfig());
    return response.data;
  },

  getSubmissionsByTask: async (taskId) => {
    const response = await apiClient.get(`/tasksubmissions/task/${taskId}`, createAuthConfig());
    return response.data;
  },

  canStudentSubmit: async (taskId, studentId) => {
    const response = await apiClient.get(`/tasks/${taskId}/can-submit/${studentId}`, createAuthConfig());
    return response.data;
  },

  getStudentSubmissionStats: async (studentId, courseId) => {
    const url = courseId
      ? `/tasksubmissions/student/${studentId}/stats?courseId=${courseId}`
      : `/tasksubmissions/student/${studentId}/stats`;
    const response = await apiClient.get(url, createAuthConfig());
    return response.data;
  },

  // ====================================
  // COURSES API
  // ====================================

  getEnrolledCourses: async (studentId) => {
    try {
      const response = await apiClient.get('/courses', createAuthConfig());
      return response.data;
    } catch (err) {
      console.error('Error fetching enrolled courses:', err);
      return [];
    }
  },

  getCourse: async (courseId) => {
    try {
      const response = await apiClient.get(`/courses/${courseId}`, createAuthConfig());
      return response.data;
    } catch (err) {
      console.error('Error fetching course:', err);
      return null;
    }
  },

  // ====================================
  // GRADES API - FIXED TO MATCH BACKEND
  // ====================================

  getCourseGrades: async (courseId) => {
    try {
      const response = await apiClient.get(`/courses/${courseId}/grades`, createAuthConfig());
      return response.data || [];
    } catch (err) {
      console.error('❌ Error fetching course grades:', err);
      return [];
    }
  },

  getGradeColumns: async (courseId) => {
    try {
      const response = await apiClient.get(`/courses/${courseId}/grade-columns`, createAuthConfig());
      return response.data || [];
    } catch (err) {
      console.error('❌ Error fetching grade columns:', err);
      return [];
    }
  },

  getFinalGrade: async (studentId, courseId) => {
    try {
      const response = await apiClient.get(`/students/${studentId}/final-grade/${courseId}`, createAuthConfig());
      return response.data;
    } catch (err) {
      console.error('❌ Error fetching final grade:', err);
      return null;
    }
  },

  getMyGrades: async (courseId = null) => {
    try {
      const url = courseId ? `/grades/course/${courseId}` : '/grades';
      const response = await apiClient.get(url, createAuthConfig());
      return response.data || [];
    } catch (err) {
      console.error('❌ Error fetching my grades:', err);
      return [];
    }
  },

  getMyGradeColumns: async (courseId) => {
    try {
      const response = await apiClient.get(`/gradecolumns/course/${courseId}`, createAuthConfig());
      return response.data || [];
    } catch (err) {
      console.error('❌ Error fetching my grade columns:', err);
      return [];
    }
  },

  // ====================================
  // STUDENT EXAM API - FIXED TO MATCH BACKEND
  // ====================================

  getExamsByCourse: async (courseId) => {
    try {
      const response = await apiClient.get(`/student/courses/${courseId}/exams`, createAuthConfig());
      return response.data || [];
    } catch (err) {
      console.error('❌ Error fetching exams:', err);
      return [];
    }
  },

  getExam: async (examId) => {
    try {
      const response = await apiClient.get(`/student/exams/${examId}`, createAuthConfig());
      return response.data;
    } catch (err) {
      console.error('❌ Error fetching exam:', err);
      throw err;
    }
  },

  checkExamEligibility: async (examId) => {
    try {
      const response = await apiClient.get(`/student/exams/${examId}/eligibility`, createAuthConfig());
      return response.data;
    } catch (err) {
      console.error('❌ Error checking exam eligibility:', err);
      return { canTake: false, reason: 'Error checking eligibility' };
    }
  },

  startExam: async (examId) => {
    try {
      const response = await apiClient.post(`/student/exams/${examId}/start`, {}, createAuthConfig());
      return response.data;
    } catch (err) {
      console.error('❌ Error starting exam:', err);
      throw err;
    }
  },

  saveExamProgress: async (progressData) => {
    try {
      const response = await apiClient.put(`/student/exams/${progressData.examId}/save-progress`, progressData, createAuthConfig());
      return response.data;
    } catch (err) {
      console.error('❌ Error saving progress:', err);
      throw err;
    }
  },

  submitExam: async (submissionData) => {
    try {
      const response = await apiClient.post(`/student/exams/${submissionData.examId}/submit`, submissionData, createAuthConfig());
      return response.data;
    } catch (err) {
      console.error('❌ Error submitting exam:', err);
      throw err;
    }
  },

  resumeExamAttempt: async (examId) => {
    try {
      const response = await apiClient.post(`/student/exams/${examId}/resume`, {}, createAuthConfig());
      return response.data;
    } catch (err) {
      console.error('❌ Error resuming exam:', err);
      throw err;
    }
  },

  getExamAttemptHistory: async (examId) => {
    try {
      const response = await apiClient.get(`/student/exams/${examId}/attempts`, createAuthConfig());
      return response.data || [];
    } catch (err) {
      console.error('❌ Error fetching attempt history:', err);
      return [];
    }
  },

  checkActiveAttempt: async (examId) => {
    try {
      const response = await apiClient.get(`/student/exams/${examId}/active-attempt`, createAuthConfig());
      return response.data;
    } catch (err) {
      console.error('❌ Error checking active attempt:', err);
      return { hasActiveAttempt: false };
    }
  },

  getStudentExamResults: async (responseId) => {
    try {
      const response = await apiClient.get(`/student/exam-responses/${responseId}/results`, createAuthConfig());
      return response.data;
    } catch (err) {
      console.error('❌ Error fetching exam results:', err);
      throw err;
    }
  },

  getDetailedExamResults: async (responseId) => {
    try {
      const response = await apiClient.get(`/student/exam-responses/${responseId}/detailed`, createAuthConfig());
      return response.data;
    } catch (err) {
      console.error('❌ Error fetching detailed exam results:', err);
      throw err;
    }
  },

  getStudentExamStats: async (courseId) => {
    try {
      const response = await apiClient.get(`/student/courses/${courseId}/exam-stats`, createAuthConfig());
      return response.data;
    } catch (err) {
      console.error('❌ Error fetching exam stats:', err);
      return null;
    }
  },

  getExamDashboardSummary: async () => {
    try {
      const response = await apiClient.get('/student/dashboard/exam-summary', createAuthConfig());
      return response.data;
    } catch (err) {
      console.error('❌ Error fetching dashboard summary:', err);
      return {
        inProgressExams: 0,
        completedExams: 0,
        gradedExams: 0,
        passedExams: 0,
        overallAverage: 0,
        overallPassRate: 0,
        hasActiveAttempts: false
      };
    }
  },

  getExamResponse: async (responseId) => {
    return studentApi.getStudentExamResults(responseId);
  },

  getDetailedExamResponse: async (responseId) => {
    return studentApi.getDetailedExamResults(responseId);
  },

  canTakeExam: async (examId) => {
    return studentApi.checkExamEligibility(examId);
  },

  getExamResponseHistory: async (examId, studentId) => {
    return studentApi.getExamAttemptHistory(examId);
  },

  hasActiveExamAttempt: async (examId, studentId) => {
    return studentApi.checkActiveAttempt(examId);
  },

  getExamAttemptCount: async (examId, studentId) => {
    const history = await studentApi.getExamAttemptHistory(examId);
    return { attemptCount: history.length };
  },

  // ====================================
  // DASHBOARD ANALYTICS (Enhanced implementations)
  // ====================================

  getDashboardAnalytics: async (studentId, courseId) => {
    try {
      const [submissions, upcomingTasks, overdueTasks] = await Promise.all([
        studentApi.getStudentSubmissions(studentId, courseId).catch(() => []),
        studentApi.getUpcomingAssignments(studentId, courseId, 7).catch(() => []),
        studentApi.getOverdueAssignments(studentId, courseId).catch(() => [])
      ]);

      const totalAssignments = submissions.length + upcomingTasks.length + overdueTasks.length;
      const completedAssignments = submissions.filter(sub => sub.grade !== null).length;
      const averageGrade = submissions.length > 0
        ? submissions.reduce((sum, sub) => sum + (sub.grade || 0), 0) / submissions.length
        : 0;

      return {
        totalAssignments,
        completedAssignments,
        pendingAssignments: totalAssignments - completedAssignments,
        averageGrade: Math.round(averageGrade * 100) / 100,
        upcomingDeadlines: upcomingTasks.length,
        overdueAssignments: overdueTasks.length
      };
    } catch (err) {
      console.error('Error fetching dashboard analytics:', err);
      return {
        totalAssignments: 0,
        completedAssignments: 0,
        pendingAssignments: 0,
        averageGrade: 0,
        upcomingDeadlines: 0,
        overdueAssignments: 0
      };
    }
  },

  getRecentActivity: async (studentId, limit = 10) => {
    try {
      const submissions = await studentApi.getStudentSubmissions(studentId, null);
      const recentSubmissions = submissions
        .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
        .slice(0, limit);

      return recentSubmissions.map(submission => ({
        id: submission.id,
        type: 'submission',
        title: `Submitted assignment`,
        description: submission.notes || 'Assignment submitted',
        date: submission.submittedAt,
        status: submission.grade ? 'graded' : 'pending'
      }));
    } catch (err) {
      console.error('Error fetching recent activity:', err);
      return [];
    }
  },

  getUpcomingDeadlines: async (studentId, days = 7) => {
    try {
      const upcomingTasks = await studentApi.getUpcomingAssignments(studentId, null, days);
      return upcomingTasks.map(task => ({
        id: task.id,
        title: task.title,
        dueDate: task.dueDateTime || task.dueDate,
        course: task.courseName,
        priority: task.priority,
        hasSubmission: task.hasSubmission || false
      }));
    } catch (err) {
      console.error('Error fetching upcoming deadlines:', err);
      return [];
    }
  },

  // ====================================
  // FILE MANAGEMENT
  // ====================================

  uploadFile: async (file, context = 'submission') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('context', context);

    try {
      const response = await apiClient.post('/files/upload', formData, createAuthConfig({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }));
      return response.data;
    } catch (err) {
      console.error('File upload failed:', err);
      throw new Error('File upload failed: ' + err.message);
    }
  },

  downloadFile: async (fileId) => {
    try {
      const response = await apiClient.get(`/files/${fileId}/download`, createAuthConfig({
        responseType: 'blob'
      }));
      return response.data;
    } catch (err) {
      console.error('File download failed:', err);
      throw new Error('File download failed: ' + err.message);
    }
  },

  addFileToSubmission: async (submissionId, fileData) => {
    const response = await apiClient.post(`/tasksubmissions/${submissionId}/add-file`, fileData, createAuthConfig());
    return response.data;
  },

  removeFileFromSubmission: async (submissionId, fileIndex) => {
    const response = await apiClient.delete(`/tasksubmissions/${submissionId}/file/${fileIndex}`, createAuthConfig());
    return response.data;
  },

  // ====================================
  // NOTIFICATIONS
  // ====================================

  getNotifications: async (studentId, unreadOnly = false) => {
    try {
      const params = unreadOnly ? '?unread=true' : '';
      const response = await apiClient.get(`/notifications/user/${studentId}${params}`, createAuthConfig());
      return response.data;
    } catch (err) {
      console.error('Error fetching notifications:', err);
      return [];
    }
  },

  markNotificationRead: async (notificationId) => {
    try {
      const response = await apiClient.put(`/notifications/${notificationId}/read`, {}, createAuthConfig());
      return response.data;
    } catch (err) {
      console.error('Error marking notification as read:', err);
      return { success: false };
    }
  },

  markAllNotificationsRead: async (studentId) => {
    try {
      const response = await apiClient.put(`/notifications/user/${studentId}/read-all`, {}, createAuthConfig());
      return response.data;
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      return { success: false };
    }
  },

  // ====================================
  // ADDITIONAL UTILITY METHODS
  // ====================================

  getSubmissionStats: async (courseId) => {
    try {
      const response = await apiClient.get(`/tasksubmissions/course/${courseId}/stats`, createAuthConfig());
      return response.data;
    } catch (err) {
      console.error('Error fetching submission stats:', err);
      return null;
    }
  },

  getAssignmentsNeedingGrading: async (courseId) => {
    try {
      const response = await apiClient.get(`/tasksubmissions/course/${courseId}/needing-grading`, createAuthConfig());
      return response.data;
    } catch (err) {
      console.error('Error fetching assignments needing grading:', err);
      return [];
    }
  }
};

export default studentApi;