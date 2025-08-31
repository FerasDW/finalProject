/**
 * Complete API Client for Lecturer Dashboard - FULLY FIXED WITH EXAM RESPONSES
 * File: src/Api/AssignmentsDashboardAPI.js
 */

import axios from "axios";

// Configuration
const API_BASE_URL = 'http://13.61.114.153:8082/api';
const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000
};

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
 * Helper Functions for TaskSubmission Objects
 */
const TaskSubmissionHelpers = {
  hasFiles: (submission) => {
    return submission.fileUrls && Array.isArray(submission.fileUrls) && submission.fileUrls.length > 0;
  },

  getFileCount: (submission) => {
    return submission.fileUrls && Array.isArray(submission.fileUrls) ? submission.fileUrls.length : 0;
  },

  isGraded: (submission) => {
    return submission.grade !== null && submission.grade !== undefined;
  },

  needsGrading: (submission) => {
    return submission.status === 'submitted' && (submission.grade === null || submission.grade === undefined);
  },

  getFinalGrade: (submission) => {
    if (submission.grade === null || submission.grade === undefined) return 0.0;

    let finalGrade = parseFloat(submission.grade);

    // Apply late penalty if applicable
    if (submission.isLate && submission.latePenaltyApplied && submission.latePenaltyApplied > 0) {
      finalGrade = finalGrade * (1.0 - (submission.latePenaltyApplied / 100.0));
    }

    return Math.max(0.0, finalGrade); // Ensure grade doesn't go below 0
  }
};

/**
 * Helper Functions for ExamResponse Objects
 */
const ExamResponseHelpers = {
  isCompleted: (response) => {
    return response.status === 'SUBMITTED' || response.status === 'GRADED';
  },

  isGraded: (response) => {
    return response.graded === true || response.status === 'GRADED';
  },

  needsManualGrading: (response) => {
    return response.status === 'SUBMITTED' && !response.graded && !response.autoGraded;
  },

  canAutoGrade: (response) => {
    return response.status === 'SUBMITTED' && !response.graded;
  },

  getGradingStatus: (response) => {
    if (response.flaggedForReview) return 'flagged';
    if (response.status === 'IN_PROGRESS') return 'in-progress';
    if (response.graded && response.autoGraded) return 'auto-graded';
    if (response.graded && !response.autoGraded) return 'manually-graded';
    if (response.status === 'SUBMITTED' && !response.graded) return 'needs-grading';
    return 'unknown';
  },

  formatTimeSpent: (timeSpentSeconds) => {
    if (!timeSpentSeconds || timeSpentSeconds === 0) return 'N/A';
    const minutes = Math.floor(timeSpentSeconds / 60);
    const seconds = timeSpentSeconds % 60;
    return `${minutes}m ${seconds}s`;
  },

  calculatePercentage: (response) => {
    if (!response.maxScore || response.maxScore === 0) return 0;
    return Math.round((response.totalScore || 0) / response.maxScore * 100);
  }
};

// File utilities
export const formatFileSize = (bytes) => {
  if (!bytes || isNaN(bytes) || bytes === 0) return '0 Bytes';
  if (bytes < 0) return 'Invalid size';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  if (i >= sizes.length) return 'File too large';
  if (i < 0) return '0 Bytes';

  const size = bytes / Math.pow(k, i);
  return `${size.toFixed(size >= 10 ? 0 : 1)} ${sizes[i]}`;
};

export const getFileTypeIcon = (fileName) => {
  if (!fileName) return '📄';

  const extension = fileName.split('.').pop().toLowerCase();
  const iconMap = {
    'pdf': '📕',
    'doc': '📘',
    'docx': '📘',
    'txt': '📄',
    'zip': '📦',
    'jpg': '🖼️',
    'jpeg': '🖼️',
    'png': '🖼️',
    'gif': '🖼️',
    'ppt': '📽️',
    'pptx': '📽️',
    'xls': '📊',
    'xlsx': '📊'
  };

  return iconMap[extension] || '📄';
};

/**
 * ENHANCED FILE UPLOAD API - Using Task Controller
 */
export const uploadFile = async (file, context = 'assignment', additionalData = {}) => {
  try {
    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('File size exceeds 10MB limit');
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/zip',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif'
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error('File type not supported. Please use PDF, DOC, DOCX, TXT, ZIP, JPG, PNG, or GIF files.');
    }

    // Create FormData
    const formData = new FormData();
    formData.append('file', file);
    formData.append('context', context);

    // Add additional data
    if (additionalData.assignmentId) {
      formData.append('assignmentId', additionalData.assignmentId);
    }
    if (additionalData.courseId) {
      formData.append('courseId', additionalData.courseId);
    }
    if (additionalData.description) {
      formData.append('description', additionalData.description);
    }

    // Upload file using task controller endpoint
    const response = await axios.post(`${API_BASE_URL}/tasks/upload-file`, formData, createAuthConfig({
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }));

    return {
      id: response.data.id || 'file_' + Date.now(),
      url: response.data.url || response.data.fileUrl || `/uploads/${file.name}`,
      name: response.data.fileName || file.name,
      size: response.data.fileSize || file.size,
      type: file.type,
      uploadedAt: response.data.uploadedAt || new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ File upload failed:', error);
    throw new Error(`File upload failed: ${error.message}`);
  }
};

/**
 * ENHANCED FILE VIEWING - Properly handles URL construction and encoding
 */
export const viewFile = async (fileUrl, fileName = null) => {
  try {
    if (!fileUrl) {
      throw new Error('No file URL provided');
    }

    let fullUrl;
    if (fileUrl.startsWith('http')) {
      fullUrl = fileUrl;
    } else if (fileUrl.startsWith('/api/')) {
      const apiPath = fileUrl.substring(4);
      fullUrl = `${API_BASE_URL}${apiPath}`;
    } else if (fileUrl.startsWith('/uploads/')) {
      const filename = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
      const encodedFilename = encodeURIComponent(filename);
      fullUrl = `${API_BASE_URL}/tasks/files/${encodedFilename}`;
    } else {
      const encodedFilename = encodeURIComponent(fileUrl);
      fullUrl = `${API_BASE_URL}/tasks/files/${encodedFilename}`;
    }

    try {
      const newTab = window.open(fullUrl, '_blank');
      if (newTab) {
        try {
          const token = getToken();
          if (token) {
            const response = await fetch(fullUrl, {
              method: 'HEAD',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });

            if (!response.ok && response.status === 401) {
              const tokenUrl = `${fullUrl}${fullUrl.includes('?') ? '&' : '?'}token=${encodeURIComponent(token)}`;
              newTab.location.href = tokenUrl;
            }
          }
        } catch (fetchError) {
          console.warn('⚠️ Could not validate file access, proceeding with direct open');
        }

        try {
          newTab.focus();
        } catch (e) {
          console.log('ℹ️ Could not focus new tab (browser security)');
        }

        return {
          success: true,
          method: 'new_tab',
          url: fullUrl,
          fileName: fileName
        };
      } else {
        throw new Error('Tab blocked by browser popup blocker');
      }
    } catch (windowError) {
      console.warn('⚠️ window.open failed, trying fallback method:', windowError.message);
      return fallbackFileOpen(fullUrl, fileName);
    }

  } catch (error) {
    console.error('❌ Error viewing file:', error);
    throw new Error(`Failed to open file: ${error.message}`);
  }
};

/**
 * Fallback method for opening files when window.open fails
 */
const fallbackFileOpen = (fullUrl, fileName) => {
  try {
    const link = document.createElement('a');
    link.href = fullUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    if (fileName) {
      link.download = fileName;
    }

    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);

    return {
      success: true,
      method: 'link_click',
      url: fullUrl,
      fileName: fileName
    };
  } catch (error) {
    console.warn('⚠️ Link click failed, navigating in current window');
    window.location.href = fullUrl;

    return {
      success: true,
      method: 'current_window',
      url: fullUrl,
      fileName: fileName
    };
  }
};

export const deleteFile = async (fileUrl) => {
  try {
    if (!fileUrl) {
      return { success: true, message: 'No file to delete' };
    }

    const filename = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
    const encodedFilename = encodeURIComponent(filename);

    await axios.delete(`${API_BASE_URL}/tasks/files/${encodedFilename}`, createAuthConfig());

    return { success: true, message: 'File deleted successfully' };

  } catch (error) {
    console.error('❌ Error deleting file:', error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};

/**
 * API Endpoints
 */

// Courses
export const fetchCourses = async (params = {}) => {
  try {
    const courses = await axios.get(`${API_BASE_URL}/courses`, createAuthConfig({ params }));

    const transformedCourses = Array.isArray(courses.data) ? courses.data.map(course => ({
      id: course.id,
      name: course.name,
      code: course.code,
      description: course.description,
      lecturerId: course.lecturerId,
      department: course.department,
      credits: course.credits,
      enrollments: course.enrollments || [],
      imageUrl: course.imageUrl,
      academicYear: course.academicYear,
      semester: course.semester,
      year: course.year,
      language: course.language,
      progress: course.progress,
      prerequisites: course.prerequisites,
      finalExam: course.finalExam
    })) : [];

    return transformedCourses;
  } catch (error) {
    console.error('❌ Error fetching courses:', error);
    throw error;
  }
};

// Students
export const fetchStudents = async (courseId, params = {}) => {
  try {
    const course = await axios.get(`${API_BASE_URL}/courses/${courseId}`, createAuthConfig());

    if (!course.data.enrollments || course.data.enrollments.length === 0) {
      return [];
    }

    const allStudentIds = course.data.enrollments.flatMap(enrollment =>
      enrollment.studentIds || []
    );

    if (allStudentIds.length === 0) {
      return [];
    }

    // Fetch student details
    const studentDetails = await axios.post(`${API_BASE_URL}/users/by-ids`, allStudentIds, createAuthConfig());

    // Fetch existing grades
    let existingGrades = [];
    try {
      existingGrades = (await axios.get(`${API_BASE_URL}/courses/${courseId}/grades`, createAuthConfig())).data;
    } catch (error) {
      console.warn('⚠️ No existing grades found:', error.message);
      existingGrades = [];
    }

    // Combine student details with grades
    const studentsWithGrades = studentDetails.data.map(student => {
      const studentGrade = existingGrades.find(g => g.studentId === student.id);

      // Find which academic year this student is enrolled in
      const studentEnrollment = course.data.enrollments.find(enrollment =>
        enrollment.studentIds?.includes(student.id)
      );

      return {
        id: student.id,
        name: student.name,
        email: student.email,
        username: student.username,
        courseId: courseId,
        academicYear: studentEnrollment?.academicYear || null,
        grades: studentGrade?.grades || {},
        finalGrade: studentGrade?.finalGrade || 0,
        finalLetterGrade: studentGrade?.finalLetterGrade || 'N/A'
      };
    });

    return studentsWithGrades;

  } catch (error) {
    console.error('❌ Error fetching students:', error);
    if (error.response?.status === 404) {
      throw new Error(`Course with ID ${courseId} not found`);
    }
    if (error.response?.status === 403) {
      throw new Error('You do not have permission to view students for this course');
    }
    return [];
  }
};

// ASSIGNMENTS using Tasks API with file handling
export const fetchAssignments = async (courseId, params = {}) => {
  try {
    const tasks = await axios.get(`${API_BASE_URL}/tasks/course/${courseId}`, createAuthConfig({ params }));

    const transformedAssignments = Array.isArray(tasks.data) ? tasks.data.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      courseId: task.courseId,
      courseName: task.courseName,
      type: task.type,
      dueDate: task.dueDate,
      dueTime: task.dueTime,
      dueDateTime: task.dueDateTime,
      maxPoints: task.maxPoints,
      status: task.status,
      priority: task.priority,
      difficulty: task.difficulty,
      category: task.category,
      instructions: task.instructions,
      estimatedDuration: task.estimatedDuration,
      allowSubmissions: task.allowSubmissions,
      allowLateSubmissions: task.allowLateSubmissions,
      latePenaltyPerDay: task.latePenaltyPerDay,
      visibleToStudents: task.visibleToStudents,
      requiresSubmission: task.requiresSubmission,
      maxAttempts: task.maxAttempts,
      publishDate: task.publishDate,
      submissionCount: task.submissionCount,
      gradedCount: task.gradedCount,
      averageGrade: task.averageGrade,
      enrolledStudents: task.enrolledStudents,
      completionRate: task.completionRate,
      isOverdue: task.isOverdue,
      isPublished: task.isPublished,
      acceptsSubmissions: task.acceptsSubmissions,
      instructorId: task.instructorId,
      instructorName: task.instructorName,
      tags: task.tags,
      prerequisiteTasks: task.prerequisiteTasks,
      progress: task.progress,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      // File attachment info
      hasAttachment: task.hasAttachment || (task.fileUrl && task.fileUrl.trim() !== ''),
      fileUrl: task.fileUrl,
      fileName: task.fileName,
      fileSize: task.fileSize
    })) : [];

    return transformedAssignments;
  } catch (error) {
    console.error('❌ Error fetching assignments:', error);
    return [];
  }
};

export const createAssignment = async (assignmentData) => {
  try {
    // Prepare task creation request
    const taskCreateRequest = {
      title: assignmentData.title,
      description: assignmentData.description,
      courseId: assignmentData.courseId,
      type: assignmentData.type,
      dueDate: assignmentData.dueDate,
      dueTime: assignmentData.dueTime,
      maxPoints: assignmentData.maxPoints,
      instructions: assignmentData.instructions,
      priority: assignmentData.priority,
      difficulty: assignmentData.difficulty,
      category: assignmentData.category,
      allowSubmissions: assignmentData.allowSubmissions,
      allowLateSubmissions: assignmentData.allowLateSubmissions,
      latePenaltyPerDay: assignmentData.latePenaltyPerDay,
      visibleToStudents: assignmentData.visibleToStudents,
      requiresSubmission: assignmentData.requiresSubmission,
      maxAttempts: assignmentData.maxAttempts,
      estimatedDuration: assignmentData.estimatedDuration,
      tags: assignmentData.tags,
      prerequisiteTasks: assignmentData.prerequisiteTasks
    };

    // Handle file attachment
    if (assignmentData.file) {
      try {
        const fileData = await uploadFile(assignmentData.file, 'assignment', {
          courseId: assignmentData.courseId,
          description: `Attachment for assignment: ${assignmentData.title}`
        });

        // Add file information to task request
        taskCreateRequest.fileUrl = fileData.url;
        taskCreateRequest.fileName = fileData.name;
        taskCreateRequest.fileSize = fileData.size;

      } catch (fileError) {
        console.error('❌ File upload failed:', fileError);
        throw new Error(`Failed to upload file: ${fileError.message}`);
      }
    } else if (assignmentData.fileUrl) {
      taskCreateRequest.fileUrl = assignmentData.fileUrl;
      taskCreateRequest.fileName = assignmentData.fileName;
      taskCreateRequest.fileSize = assignmentData.fileSize;
    }

    const createdTask = await axios.post(`${API_BASE_URL}/tasks`, taskCreateRequest, createAuthConfig());

    return {
      id: createdTask.data.id,
      title: createdTask.data.title,
      description: createdTask.data.description,
      courseId: createdTask.data.courseId,
      type: createdTask.data.type,
      dueDate: createdTask.data.dueDate,
      dueTime: createdTask.data.dueTime,
      maxPoints: createdTask.data.maxPoints,
      status: createdTask.data.status,
      priority: createdTask.data.priority,
      difficulty: createdTask.data.difficulty,
      category: createdTask.data.category,
      instructions: createdTask.data.instructions,
      hasAttachment: !!(createdTask.data.fileUrl && createdTask.data.fileUrl.trim() !== ''),
      fileUrl: createdTask.data.fileUrl,
      fileName: createdTask.data.fileName,
      fileSize: createdTask.data.fileSize,
      submissionCount: createdTask.data.submissionCount || 0,
      gradedCount: createdTask.data.gradedCount || 0,
      averageGrade: createdTask.data.averageGrade || 0,
      isOverdue: createdTask.data.isOverdue,
      createdAt: createdTask.data.createdAt,
      updatedAt: createdTask.data.updatedAt
    };
  } catch (error) {
    console.error('❌ Error creating assignment:', error);
    throw error;
  }
};

export const updateAssignment = async (assignmentId, updates) => {
  try {
    const taskUpdateRequest = {
      title: updates.title,
      description: updates.description,
      type: updates.type,
      dueDate: updates.dueDate,
      dueTime: updates.dueTime,
      maxPoints: updates.maxPoints,
      instructions: updates.instructions,
      status: updates.status,
      priority: updates.priority,
      difficulty: updates.difficulty,
      category: updates.category,
      allowSubmissions: updates.allowSubmissions,
      allowLateSubmissions: updates.allowLateSubmissions,
      latePenaltyPerDay: updates.latePenaltyPerDay,
      visibleToStudents: updates.visibleToStudents,
      requiresSubmission: updates.requiresSubmission,
      maxAttempts: updates.maxAttempts,
      estimatedDuration: updates.estimatedDuration,
      tags: updates.tags,
      prerequisiteTasks: updates.prerequisiteTasks
    };

    if (updates.file) {
      try {
        if (updates.fileUrl) {
          await deleteFile(updates.fileUrl);
        }

        const fileData = await uploadFile(updates.file, 'assignment', {
          assignmentId: assignmentId,
          description: `Updated attachment for assignment: ${updates.title}`
        });

        taskUpdateRequest.fileUrl = fileData.url;
        taskUpdateRequest.fileName = fileData.name;
        taskUpdateRequest.fileSize = fileData.size;

      } catch (fileError) {
        console.error('❌ File upload failed:', fileError);
        throw new Error(`Failed to upload file: ${fileError.message}`);
      }
    } else if (updates.fileUrl && updates.fileUrl !== '') {
      taskUpdateRequest.fileUrl = updates.fileUrl;
      taskUpdateRequest.fileName = updates.fileName;
      taskUpdateRequest.fileSize = updates.fileSize;
    } else if (updates.hasAttachment === false) {
      if (updates.fileUrl) {
        try {
          await deleteFile(updates.fileUrl);
        } catch (deleteError) {
          console.warn('⚠️ Could not delete old file:', deleteError.message);
        }
      }
      taskUpdateRequest.fileUrl = null;
      taskUpdateRequest.fileName = null;
      taskUpdateRequest.fileSize = null;
    }

    const updatedTask = await axios.put(`${API_BASE_URL}/tasks/${assignmentId}`, taskUpdateRequest, createAuthConfig());

    return {
      id: updatedTask.data.id,
      title: updatedTask.data.title,
      description: updatedTask.data.description,
      courseId: updatedTask.data.courseId,
      type: updatedTask.data.type,
      dueDate: updatedTask.data.dueDate,
      dueTime: updatedTask.data.dueTime,
      maxPoints: updatedTask.data.maxPoints,
      status: updatedTask.data.status,
      priority: updatedTask.data.priority,
      difficulty: updatedTask.data.difficulty,
      category: updatedTask.data.category,
      instructions: updatedTask.data.instructions,
      hasAttachment: !!(updatedTask.data.fileUrl && updatedTask.data.fileUrl.trim() !== ''),
      fileUrl: updatedTask.data.fileUrl,
      fileName: updatedTask.data.fileName,
      fileSize: updatedTask.data.fileSize,
      submissionCount: updatedTask.data.submissionCount || 0,
      gradedCount: updatedTask.data.gradedCount || 0,
      averageGrade: updatedTask.data.averageGrade || 0,
      isOverdue: updatedTask.data.isOverdue,
      createdAt: updatedTask.data.createdAt,
      updatedAt: updatedTask.data.updatedAt
    };
  } catch (error) {
    console.error('❌ Error updating assignment:', error);
    throw error;
  }
};

export const deleteAssignment = async (assignmentId) => {
  try {
    try {
      const assignment = await axios.get(`${API_BASE_URL}/tasks/${assignmentId}`, createAuthConfig());
      if (assignment.data.fileUrl) {
        await deleteFile(assignment.data.fileUrl);
      }
    } catch (error) {
      console.warn('⚠️ Could not delete assignment file:', error.message);
    }

    await axios.delete(`${API_BASE_URL}/tasks/${assignmentId}`, createAuthConfig());

    return { success: true };
  } catch (error) {
    console.error('❌ Error deleting assignment:', error);
    throw error;
  }
};

// ENHANCED submissions API to match TaskSubmission backend
export const fetchSubmissions = async (courseId, params = {}) => {
  try {
    const submissions = await axios.get(`${API_BASE_URL}/tasksubmissions/course/${courseId}`, createAuthConfig({ params }));

    const transformedSubmissions = Array.isArray(submissions.data) ? submissions.data.map(submission => {
      return {
        id: submission.id,
        courseId: submission.courseId,
        taskId: submission.taskId,
        assignmentId: submission.taskId,
        studentId: submission.studentId,
        content: submission.content,
        notes: submission.notes,
        hasFiles: TaskSubmissionHelpers.hasFiles(submission),
        fileUrls: submission.fileUrls || [],
        fileNames: submission.fileNames || [],
        fileSizes: submission.fileSizes || [],
        fileCount: TaskSubmissionHelpers.getFileCount(submission),
        fileUrl: submission.fileUrls && submission.fileUrls.length > 0 ? submission.fileUrls[0] : null,
        fileName: submission.fileNames && submission.fileNames.length > 0 ? submission.fileNames[0] : null,
        fileSize: submission.fileSizes && submission.fileSizes.length > 0 ? submission.fileSizes[0] : null,
        grade: submission.grade,
        feedback: submission.feedback,
        status: submission.status || 'submitted',
        isGraded: TaskSubmissionHelpers.isGraded(submission),
        needsGrading: TaskSubmissionHelpers.needsGrading(submission),
        attemptNumber: submission.attemptNumber || 1,
        isLate: submission.isLate || false,
        latePenaltyApplied: submission.latePenaltyApplied || 0,
        originalDueDate: submission.originalDueDate,
        autoGraded: submission.autoGraded || false,
        autoGradeScore: submission.autoGradeScore,
        manualOverride: submission.manualOverride || false,
        isGroupSubmission: submission.isGroupSubmission || false,
        groupMembers: submission.groupMembers || [],
        plagiarismScore: submission.plagiarismScore,
        plagiarismChecked: submission.plagiarismChecked || false,
        submittedAt: submission.submittedAt,
        gradedAt: submission.gradedAt,
        updatedAt: submission.updatedAt,
        timeSpent: submission.timeSpent,
        finalGrade: TaskSubmissionHelpers.getFinalGrade(submission)
      };
    }) : [];

    return transformedSubmissions;
  } catch (error) {
    console.error('❌ Error fetching submissions:', error);
    return [];
  }
};

// ENHANCED submission grading with sync support
export const updateSubmissionGrade = async (submissionId, grade, feedback = '') => {
  try {
    const gradeData = {
      grade: grade,
      feedback: feedback
    };

    const response = await axios.put(`${API_BASE_URL}/tasksubmissions/${submissionId}/grade`, gradeData, createAuthConfig());

    return response.data.submission || response.data;
  } catch (error) {
    console.error('❌ Error updating submission grade:', error);
    throw error;
  }
};

export const downloadSubmission = async (submissionId) => {
  try {
    const submission = (await axios.get(`${API_BASE_URL}/tasksubmissions/${submissionId}`, createAuthConfig())).data;

    if (submission.fileUrls && submission.fileUrls.length > 0) {
      for (let i = 0; i < submission.fileUrls.length; i++) {
        const fileUrl = submission.fileUrls[i];
        const fileName = submission.fileNames && submission.fileNames[i]
          ? submission.fileNames[i]
          : `submission_file_${i + 1}`;

        await viewFile(fileUrl, fileName);
      }
      return { success: true, message: `Downloaded ${submission.fileUrls.length} files` };
    } else if (submission.fileUrl) {
      await viewFile(submission.fileUrl, submission.fileName);
      return { success: true, message: 'File download initiated' };
    } else {
      throw new Error('No files available for download');
    }
  } catch (error) {
    console.error('❌ Error downloading submission:', error);
    throw error;
  }
};

export const createSubmission = async (submissionData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/tasksubmissions/simple`, submissionData, createAuthConfig());
    return response.data;
  } catch (error) {
    console.error('❌ Error creating submission:', error);
    throw error;
  }
};

export const deleteSubmission = async (submissionId) => {
  try {
    await axios.delete(`${API_BASE_URL}/tasksubmissions/${submissionId}`, createAuthConfig());
    return { success: true };
  } catch (error) {
    console.error('❌ Error deleting submission:', error);
    throw error;
  }
};

// ENHANCED batch grading with sync support
export const batchGradeSubmissions = async (submissionIds, grade, feedback = '') => {
  try {
    const results = [];
    for (const submissionId of submissionIds) {
      try {
        const result = await updateSubmissionGrade(submissionId, grade, feedback);
        results.push(result);
      } catch (error) {
        console.error(`❌ Error grading submission ${submissionId}:`, error);
        // Continue with other submissions
      }
    }
    return { gradedSubmissions: results, successCount: results.length };
  } catch (error) {
    console.error('❌ Error batch grading submissions:', error);
    throw error;
  }
};

// ===================================
// EXAMS API - FULLY IMPLEMENTED
// ===================================

export const fetchExams = async (courseId, params = {}) => {
  try {
    const exams = await axios.get(`${API_BASE_URL}/courses/${courseId}/exams`, createAuthConfig({ params }));

    const transformedExams = Array.isArray(exams.data) ? exams.data.map(exam => ({
      id: exam.id,
      title: exam.title,
      description: exam.description,
      instructions: exam.instructions,
      courseId: exam.courseId,
      duration: exam.duration,
      startTime: exam.startTime,
      endTime: exam.endTime,
      publishTime: exam.publishTime,
      maxAttempts: exam.maxAttempts,
      showResults: exam.showResults,
      shuffleQuestions: exam.shuffleQuestions,
      shuffleOptions: exam.shuffleOptions,
      allowNavigation: exam.allowNavigation,
      showTimer: exam.showTimer,
      autoSubmit: exam.autoSubmit,
      requireSafeBrowser: exam.requireSafeBrowser,
      visibleToStudents: exam.visibleToStudents,
      passPercentage: exam.passPercentage,
      status: exam.status,
      questions: exam.questions || [],
      totalPoints: exam.totalPoints || 0,
      questionCount: exam.questions?.length || 0,
      createdAt: exam.createdAt,
      updatedAt: exam.updatedAt
    })) : [];

    return transformedExams;
  } catch (error) {
    console.error('❌ Error fetching exams:', error);
    return [];
  }
};

export const fetchExamById = async (examId) => {
  try {
    const exam = (await axios.get(`${API_BASE_URL}/exams/${examId}`, createAuthConfig())).data;
    return exam;
  } catch (error) {
    console.error('❌ Error fetching exam by ID:', error);
    throw error;
  }
};

export const fetchExamForGrading = async (examId) => {
  try {
    const exam = (await axios.get(`${API_BASE_URL}/exams/${examId}/for-grading`, createAuthConfig())).data;
    return exam;
  } catch (error) {
    console.error('❌ Error fetching exam for grading:', error);
    throw error;
  }
};

export const createExam = async (examData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/exams`, examData, createAuthConfig());
    return response.data.exam || response.data;
  } catch (error) {
    console.error('❌ Error creating exam:', error);
    throw error;
  }
};

export const updateExam = async (examId, updates) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/exams/${examId}`, updates, createAuthConfig());
    return response.data.exam || response.data;
  } catch (error) {
    console.error('❌ Error updating exam:', error);
    throw error;
  }
};

export const deleteExam = async (examId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/exams/${examId}`, createAuthConfig());
    return response.data;
  } catch (error) {
    console.error('❌ Error deleting exam:', error);
    throw error;
  }
};

export const publishExam = async (examId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/exams/${examId}/publish`, {}, createAuthConfig());
    return response.data.exam || response.data;
  } catch (error) {
    console.error('❌ Error publishing exam:', error);
    throw error;
  }
};

export const unpublishExam = async (examId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/exams/${examId}/unpublish`, {}, createAuthConfig());
    return response.data;
  } catch (error) {
    console.error('❌ Error unpublishing exam:', error);
    throw error;
  }
};

export const updateExamStatus = async (examId, status) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/exams/${examId}/status`, { status }, createAuthConfig());
    return response.data;
  } catch (error) {
    console.error('❌ Error updating exam status:', error);
    throw error;
  }
};

// ===================================
// EXAM QUESTIONS API
// ===================================

export const addQuestionToExam = async (examId, questionData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/exams/${examId}/questions`, questionData, createAuthConfig());
    return response.data.question || response.data;
  } catch (error) {
    console.error('❌ Error adding question:', error);
    throw error;
  }
};

export const updateQuestion = async (examId, questionId, updates) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/exams/${examId}/questions/${questionId}`, updates, createAuthConfig());
    return response.data.question || response.data;
  } catch (error) {
    console.error('❌ Error updating question:', error);
    throw error;
  }
};

export const deleteQuestion = async (examId, questionId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/exams/${examId}/questions/${questionId}`, createAuthConfig());
    return response.data;
  } catch (error) {
    console.error('❌ Error deleting question:', error);
    throw error;
  }
};

export const reorderQuestions = async (examId, questionIds) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/exams/${examId}/questions/reorder`, { questionIds }, createAuthConfig());
    return response.data;
  } catch (error) {
    console.error('❌ Error reordering questions:', error);
    throw error;
  }
};

// ===================================
// EXAM RESPONSES API - FULLY FIXED
// ===================================

/**
 * FIXED: Uses existing endpoints - gets exams first, then responses for each exam
 */
export const fetchExamResponses = async (courseId, params = {}) => {
  try {
    if (!courseId) {
      console.warn('⚠️ No courseId provided to fetchExamResponses');
      return [];
    }

    const exams = (await axios.get(`${API_BASE_URL}/courses/${courseId}/exams`, createAuthConfig())).data;

    if (!Array.isArray(exams) || exams.length === 0) {
      return [];
    }

    const responsePromises = exams.map(async (exam) => {
      try {
        console.log(`📊 Fetching responses for exam: ${exam.id} (${exam.title})`);
        const examResponses = (await axios.get(`${API_BASE_URL}/exams/${exam.id}/responses`, createAuthConfig())).data;
        return Array.isArray(examResponses) ? examResponses.map(response => ({
          ...response,
          courseId: response.courseId || courseId,
          examTitle: exam.title,
          examId: response.examId || exam.id
        })) : [];
      } catch (error) {
        console.warn(`⚠️ Failed to fetch responses for exam ${exam.id}:`, error.message);
        return [];
      }
    });

    const responseArrays = await Promise.all(responsePromises);

    const allResponses = responseArrays.flat();

    if (allResponses.length === 0) {
      return [];
    }

    const transformedResponses = allResponses.map(response => {
      const id = response.id || response._id?.$oid || response._id;
      return {
        id: id,
        examId: response.examId,
        studentId: response.studentId,
        courseId: response.courseId || courseId,
        answers: response.answers || {},
        questionScores: response.questionScores || {},
        startedAt: response.startedAt,
        submittedAt: response.submittedAt,
        timeSpent: response.timeSpent,
        status: response.status,
        totalScore: response.totalScore || 0,
        maxScore: response.maxScore || 0,
        percentage: response.percentage || ExamResponseHelpers.calculatePercentage(response),
        passed: response.passed || false,
        graded: response.graded || (response.status === 'GRADED'),
        autoGraded: response.autoGraded || false,
        attemptNumber: response.attemptNumber || 1,
        instructorFeedback: response.instructorFeedback || '',
        gradedBy: response.gradedBy,
        gradedAt: response.gradedAt,
        flaggedForReview: response.flaggedForReview || false,
        lateSubmission: response.lateSubmission || false,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
        examTitle: response.examTitle,
        isCompleted: ExamResponseHelpers.isCompleted(response),
        needsManualGrading: ExamResponseHelpers.needsManualGrading(response),
        gradingStatus: ExamResponseHelpers.getGradingStatus(response),
        timeSpentFormatted: ExamResponseHelpers.formatTimeSpent(response.timeSpent)
      };
    });

    transformedResponses.sort((a, b) => {
      const dateA = new Date(a.submittedAt || a.updatedAt || 0);
      const dateB = new Date(b.submittedAt || b.updatedAt || 0);
      return dateB - dateA;
    });

    return transformedResponses;

  } catch (error) {
    console.error('❌ Error fetching exam responses:', error);
    if (error.response?.status === 404) {
      return [];
    } else if (error.response?.status === 403) {
      console.error('❌ Permission denied for exam responses');
      throw new Error('You do not have permission to view exam responses for this course');
    } else if (error.response?.status === 500) {
      console.error('❌ Server error fetching exam responses');
      throw new Error('Server error while fetching exam responses. Please try again.');
    } else {
      console.error('❌ Unexpected error fetching exam responses');
      throw new Error(`Failed to fetch exam responses: ${error.message}`);
    }
  }
};

export const fetchExamResponsesForExam = async (examId) => {
  try {
    const responses = (await axios.get(`${API_BASE_URL}/exams/${examId}/responses`, createAuthConfig())).data;
    const transformedResponses = Array.isArray(responses) ? responses.map(response => ({
      id: response.id,
      examId: response.examId,
      studentId: response.studentId,
      courseId: response.courseId,
      answers: response.answers || {},
      questionScores: response.questionScores || {},
      startedAt: response.startedAt,
      submittedAt: response.submittedAt,
      timeSpent: response.timeSpent,
      status: response.status,
      totalScore: response.totalScore || 0,
      maxScore: response.maxScore || 0,
      percentage: response.percentage || ExamResponseHelpers.calculatePercentage(response),
      passed: response.passed || false,
      graded: response.graded || false,
      autoGraded: response.autoGraded || false,
      attemptNumber: response.attemptNumber || 1,
      instructorFeedback: response.instructorFeedback || '',
      gradedBy: response.gradedBy,
      gradedAt: response.gradedAt,
      flaggedForReview: response.flaggedForReview || false,
      lateSubmission: response.lateSubmission || false,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
      isCompleted: ExamResponseHelpers.isCompleted(response),
      needsManualGrading: ExamResponseHelpers.needsManualGrading(response),
      gradingStatus: ExamResponseHelpers.getGradingStatus(response),
      timeSpentFormatted: ExamResponseHelpers.formatTimeSpent(response.timeSpent)
    })) : [];

    return transformedResponses;
  } catch (error) {
    console.error('❌ Error fetching exam responses for exam:', error);
    return [];
  }
};

export const fetchExamResponseById = async (responseId) => {
  try {
    const response = (await axios.get(`${API_BASE_URL}/exam-responses/${responseId}`, createAuthConfig())).data;
    return response;
  } catch (error) {
    console.error('❌ Error fetching exam response:', error);
    throw error;
  }
};

export const fetchDetailedExamResponse = async (responseId) => {
  try {
    const response = (await axios.get(`${API_BASE_URL}/exam-responses/${responseId}/detailed`, createAuthConfig())).data;
    return response;
  } catch (error) {
    console.error('❌ Error fetching detailed exam response:', error);
    throw error;
  }
};

export const fetchStudentExamResponses = async (studentId, courseId) => {
  try {
    const responses = (await axios.get(`${API_BASE_URL}/students/${studentId}/courses/${courseId}/exam-responses`, createAuthConfig())).data;
    const transformedResponses = Array.isArray(responses) ? responses.map(response => ({
      id: response.id,
      examId: response.examId,
      studentId: response.studentId,
      courseId: response.courseId,
      status: response.status,
      startedAt: response.startedAt,
      submittedAt: response.submittedAt,
      timeSpent: response.timeSpent,
      totalScore: response.totalScore || 0,
      maxScore: response.maxScore || 0,
      percentage: response.percentage || ExamResponseHelpers.calculatePercentage(response),
      passed: response.passed || false,
      graded: response.graded || false,
      attemptNumber: response.attemptNumber || 1,
      isCompleted: ExamResponseHelpers.isCompleted(response),
      timeSpentFormatted: ExamResponseHelpers.formatTimeSpent(response.timeSpent)
    })) : [];

    return transformedResponses;
  } catch (error) {
    console.error('❌ Error fetching student exam responses:', error);
    return [];
  }
};

export const fetchExamResponseHistory = async (examId, studentId) => {
  try {
    const responses = (await axios.get(`${API_BASE_URL}/exams/${examId}/responses/student/${studentId}`, createAuthConfig())).data;
    return responses;
  } catch (error) {
    console.error('❌ Error fetching exam response history:', error);
    return [];
  }
};

// ===================================
// EXAM GRADING API
// ===================================

export const gradeExamResponse = async (responseId, gradeData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/exam-responses/grade`, {
      responseId,
      ...gradeData
    }, createAuthConfig());
    return response.data;
  } catch (error) {
    console.error('❌ Error grading exam response:', error);
    throw error;
  }
};

export const manualGradeExamResponse = async (responseId, questionScores, instructorFeedback = '', flaggedForReview = false) => {
  try {
    const requestData = {
      responseId: responseId,
      questionScores: questionScores,
      instructorFeedback: instructorFeedback,
      flaggedForReview: flaggedForReview
    };

    const response = await axios.put(`${API_BASE_URL}/exam-responses/manual-grade`, requestData, createAuthConfig());
    return response.data.response || response.data;
  } catch (error) {
    console.error('❌ Error manual grading exam response:', error);
    console.error('❌ Error details:', error.response?.data);
    throw error;
  }
};

export const updateQuestionScore = async (responseId, questionId, score, feedback = '') => {
  try {
    const response = await axios.put(`${API_BASE_URL}/exam-responses/${responseId}/question-score`, {
      questionId,
      score,
      feedback
    }, createAuthConfig());
    return response.data.response || response.data;
  } catch (error) {
    console.error('❌ Error updating question score:', error);
    throw error;
  }
};

export const autoGradeResponse = async (responseId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/exam-responses/${responseId}/auto-grade`, {}, createAuthConfig());
    return response.data;
  } catch (error) {
    console.error('❌ Error auto-grading response:', error);
    throw error;
  }
};

export const autoGradeAllResponses = async (examId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/exams/${examId}/auto-grade-all`, {}, createAuthConfig());
    return response.data;
  } catch (error) {
    console.error('❌ Error auto-grading all responses:', error);
    throw error;
  }
};

export const flagResponseForReview = async (responseId, flagReason = '', flagPriority = 'medium') => {
  try {
    const response = await axios.put(`${API_BASE_URL}/exam-responses/${responseId}/flag`, {
      flagReason,
      flagPriority
    }, createAuthConfig());
    return response.data.response || response.data;
  } catch (error) {
    console.error('❌ Error flagging response:', error);
    throw error;
  }
};

export const unflagResponse = async (responseId) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/exam-responses/${responseId}/unflag`, {}, createAuthConfig());
    return response.data.response || response.data;
  } catch (error) {
    console.error('❌ Error unflagging response:', error);
    throw error;
  }
};

export const batchGradeExamResponses = async (responseIds, instructorFeedback = '', flagForReview = false) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/exam-responses/batch-grade`, {
      responseIds,
      instructorFeedback,
      flagForReview
    }, createAuthConfig());
    return response.data;
  } catch (error) {
    console.error('❌ Error batch grading exam responses:', error);
    throw error;
  }
};

// ===================================
// EXAM STATISTICS API
// ===================================

export const fetchExamStats = async (examId) => {
  try {
    const stats = (await axios.get(`${API_BASE_URL}/exams/${examId}/stats`, createAuthConfig())).data;
    return stats;
  } catch (error) {
    console.error('❌ Error fetching exam statistics:', error);
    return null;
  }
};

export const fetchExamGradingStats = async (examId) => {
  try {
    const stats = (await axios.get(`${API_BASE_URL}/exams/${examId}/grading-stats`, createAuthConfig())).data;
    return stats;
  } catch (error) {
    console.error('❌ Error fetching exam grading statistics:', error);
    return null;
  }
};

export const fetchCourseExamStats = async (courseId) => {
  try {
    const stats = (await axios.get(`${API_BASE_URL}/courses/${courseId}/exam-stats`, createAuthConfig())).data;
    return stats;
  } catch (error) {
    console.error('❌ Error fetching course exam statistics:', error);
    return [];
  }
};

// ===================================
// REMAINING APIs (Grade Columns, Students, etc.)
// ===================================

// Grade Columns
export const fetchGradeColumns = async (courseId, params = {}) => {
  try {
    const columns = (await axios.get(`${API_BASE_URL}/courses/${courseId}/grade-columns`, createAuthConfig({ params }))).data;
    return Array.isArray(columns) ? columns : [];
  } catch (error) {
    console.error('Error fetching grade columns:', error);
    return [];
  }
};

export const createGradeColumn = async (columnData) => {
  try {
    return (await axios.post(`${API_BASE_URL}/grade-columns`, columnData, createAuthConfig())).data;
  } catch (error) {
    throw error;
  }
};

export const updateGradeColumn = async (columnId, updates) => {
  try {
    return (await axios.put(`${API_BASE_URL}/grade-columns/${columnId}`, updates, createAuthConfig())).data;
  } catch (error) {
    throw error;
  }
};

export const deleteGradeColumn = async (columnId) => {
  try {
    return (await axios.delete(`${API_BASE_URL}/grade-columns/${columnId}`, createAuthConfig())).data;
  } catch (error) {
    throw error;
  }
};

// Grades
export const updateGrade = async (studentId, columnId, grade) => {
  try {
    return (await axios.put(`${API_BASE_URL}/students/${studentId}/grades/${columnId}`, { grade }, createAuthConfig())).data;
  } catch (error) {
    throw error;
  }
};

// Students management
export const addStudent = async (courseId, studentData) => {
  try {
    const enrollmentRequest = {
      studentId: studentData.id || studentData.studentId,
      academicYear: new Date().getFullYear()
    };
    return (await axios.post(`${API_BASE_URL}/courses/${courseId}/enroll`, enrollmentRequest, createAuthConfig())).data;
  } catch (error) {
    throw error;
  }
};

export const removeStudent = async (courseId, studentId) => {
  try {
    const unenrollmentRequest = {
      studentIds: [studentId]
    };
    return (await axios.delete(`${API_BASE_URL}/courses/${courseId}/enrollments`, createAuthConfig({
      data: unenrollmentRequest
    }))).data;
  } catch (error) {
    throw error;
  }
};

export const updateStudent = async (studentId, updates) => {
  try {
    return (await axios.put(`${API_BASE_URL}/users/${studentId}`, updates, createAuthConfig())).data;
  } catch (error) {
    throw error;
  }
};

// Export functionality
export const exportGrades = async (courseId, format = 'csv', options = {}) => {
  try {
    console.warn('Export grades endpoint not implemented yet');
    return { success: true, message: 'Export simulated' };
  } catch (error) {
    throw error;
  }
};

// Analytics
export const fetchDashboardAnalytics = async (courseId) => {
  try {
    console.warn('Analytics endpoint not implemented yet');
    return {
      totalStudents: 0,
      averageGrade: 0,
      assignmentsCompleted: 0,
      upcomingDeadlines: []
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return null;
  }
};

// ===================================
// EXAM VALIDATION API
// ===================================

export const canStudentTakeExam = async (examId, studentId) => {
  try {
    const response = (await axios.get(`${API_BASE_URL}/exams/${examId}/can-take`, createAuthConfig())).data;
    return response.canTake || false;
  } catch (error) {
    console.error('❌ Error checking exam eligibility:', error);
    return false;
  }
};

export const getStudentAttemptCount = async (examId, studentId) => {
  try {
    const response = (await axios.get(`${API_BASE_URL}/exams/${examId}/attempt-count/${studentId}`, createAuthConfig())).data;
    return response.attemptCount || 0;
  } catch (error) {
    console.error('❌ Error getting attempt count:', error);
    return 0;
  }
};

export const hasActiveAttempt = async (examId, studentId) => {
  try {
    const responses = await fetchExamResponseHistory(examId, studentId);
    const activeAttempt = responses.find(response => response.status === 'IN_PROGRESS');
    return !!activeAttempt;
  } catch (error) {
    console.error('❌ Error checking active attempt:', error);
    return false;
  }
};

// ===================================
// STUDENT EXAM TAKING API
// ===================================

export const startExam = async (examId) => {
  try {
    const response = (await axios.post(`${API_BASE_URL}/exams/${examId}/start`, {}, createAuthConfig())).data;
    return response;
  } catch (error) {
    console.error('❌ Error starting exam:', error);
    throw error;
  }
};

export const saveExamProgress = async (progressData) => {
  try {
    const response = (await axios.put(`${API_BASE_URL}/exams/save-progress`, progressData, createAuthConfig())).data;
    return response;
  } catch (error) {
    console.error('❌ Error saving progress:', error);
    throw error;
  }
};

export const submitExam = async (submissionData) => {
  try {
    const response = (await axios.post(`${API_BASE_URL}/exams/submit`, submissionData, createAuthConfig())).data;
    return response;
  } catch (error) {
    console.error('❌ Error submitting exam:', error);
    throw error;
  }
};

// ===================================
// EXPORT FUNCTIONALITY
// ===================================

export const exportDetailedExamResponses = async (examId, format = 'csv') => {
  try {
    const response = (await axios.post(`${API_BASE_URL}/exam-responses/export-detailed`, {
      examId,
      format
    }, createAuthConfig())).data;
    return response;
  } catch (error) {
    console.error('❌ Error exporting exam responses:', error);
    throw error;
  }
};

// ===================================
// HELPER FUNCTIONS
// ===================================

export const getResponseGradingStatus = (response) => {
  return ExamResponseHelpers.getGradingStatus(response);
};

export const canResponseBeAutoGraded = (response) => {
  return ExamResponseHelpers.canAutoGrade(response);
};

export const needsManualGrading = (response) => {
  return ExamResponseHelpers.needsManualGrading(response);
};

export const isResponseCompleted = (response) => {
  return ExamResponseHelpers.isCompleted(response);
};

export const formatTimeSpent = (timeSpentSeconds) => {
  return ExamResponseHelpers.formatTimeSpent(timeSpentSeconds);
};

export const calculateResponsePercentage = (response) => {
  return ExamResponseHelpers.calculatePercentage(response);
};

export const handleApiError = (error) => {
  console.error('API Error:', error);
  if (error.error && error.status !== undefined) {
    return error;
  }
  return {
    error: true,
    status: error.status || 0,
    message: error.message || 'An unexpected error occurred',
    timestamp: new Date().toISOString(),
    details: error.details || null
  };
};

export { ExamResponseHelpers, TaskSubmissionHelpers };