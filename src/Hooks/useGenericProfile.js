// useGenericProfile.js - Custom Hook for Generic Profile
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as profileAPI from '../Api/genericProfilePageApi';

export const useGenericProfile = (initialSection = "overview") => {
  const { entityType, id } = useParams();
  const navigate = useNavigate();
  
  // Core state
  const [profileData, setProfileData] = useState(null);
  const [stats, setStats] = useState({});
  const [statCards, setStatCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI state
  const [activeSection, setActiveSection] = useState(initialSection);
  const [selectedYear, setSelectedYear] = useState("");
  const [showActions, setShowActions] = useState(false);
  
  // File upload states
  const [uploadedFiles, setUploadedFiles] = useState(new Map());
  const [fileUploadProgress, setFileUploadProgress] = useState({});
  
  // Modal states
  const [editGradeModalOpen, setEditGradeModalOpen] = useState(false);
  const [addGradeModalOpen, setAddGradeModalOpen] = useState(false);
  const [editCourseModalOpen, setEditCourseModalOpen] = useState(false);
  const [addCourseModalOpen, setAddCourseModalOpen] = useState(false);
  const [editEnrollmentModalOpen, setEditEnrollmentModalOpen] = useState(false);
  const [addEnrollmentModalOpen, setAddEnrollmentModalOpen] = useState(false);
  const [editScheduleModalOpen, setEditScheduleModalOpen] = useState(false);
  const [addScheduleModalOpen, setAddScheduleModalOpen] = useState(false);
  const [editResourceModalOpen, setEditResourceModalOpen] = useState(false);
  const [addResourceModalOpen, setAddResourceModalOpen] = useState(false);
  const [viewRequestModalOpen, setViewRequestModalOpen] = useState(false);
  const [responseRequestModalOpen, setResponseRequestModalOpen] = useState(false);
  
  // Form state
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formData, setFormData] = useState({});
  const [requestResponse, setRequestResponse] = useState("");

  // Load profile data
  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const validEntityTypes = ['student', 'lecturer'];
      if (!entityType || !validEntityTypes.includes(entityType)) {
        throw new Error(`Invalid entity type: "${entityType}"`);
      }

      const sanitizedId = parseInt(id);
      if (isNaN(sanitizedId) || sanitizedId <= 0) {
        throw new Error(`Invalid ID: "${id}"`);
      }

      const data = await profileAPI.getProfileData(entityType, sanitizedId);
      const calculatedStats = await profileAPI.getProfileStats(entityType, sanitizedId);
      const cards = await profileAPI.getStatCards(entityType, calculatedStats);

      setProfileData(data);
      setStats(calculatedStats);
      setStatCards(cards);

    } catch (err) {
      console.error('Profile loading error:', err.message);
      setError(err.message);
      setTimeout(() => {
        const dashboardRoute = entityType === 'student' ? '/students' : '/lecturers';
        navigate(dashboardRoute, { replace: true });
      }, 5000);
    } finally {
      setLoading(false);
    }
  }, [entityType, id, navigate]);

  // Grade handlers
  const handleEditGrade = useCallback((row) => {
    setSelectedRecord(row);
    setFormData({
      courseCode: row.courseCode,
      courseName: row.courseName,
      grade: row.grade,
      credits: row.credits,
      semester: row.semester
    });
    setEditGradeModalOpen(true);
  }, []);

  const handleAddGrade = useCallback(() => {
    setSelectedRecord(null);
    setFormData({});
    setAddGradeModalOpen(true);
  }, []);

  const handleGradeSubmit = useCallback(async (formData) => {
    try {
      if (formData.grade < 0 || formData.grade > 100) {
        throw new Error('Grade must be between 0 and 100');
      }

      if (selectedRecord) {
        await profileAPI.updateGrade(entityType, id, selectedRecord.id, formData);
        setEditGradeModalOpen(false);
      } else {
        await profileAPI.addGrade(entityType, id, formData);
        setAddGradeModalOpen(false);
      }
      
      await loadProfile();
      setSelectedRecord(null);
      setFormData({});
    } catch (error) {
      console.error('Error submitting grade:', error);
      alert(error.message);
    }
  }, [selectedRecord, entityType, id, loadProfile]);

  // Course handlers
  const handleEditCourse = useCallback((row) => {
    setSelectedRecord(row);
    setFormData({
      courseCode: row.courseCode,
      courseName: row.courseName,
      credits: row.credits,
      semester: row.semester,
      department: row.department || '',
      description: row.description || '',
      classSize: row.classSize || '',
      notes: row.notes || ''
    });
    setEditCourseModalOpen(true);
  }, []);

  const handleAddCourse = useCallback(() => {
    setSelectedRecord(null);
    setFormData({});
    setAddCourseModalOpen(true);
  }, []);

  const handleCourseSubmit = useCallback(async (formData) => {
    try {
      if (selectedRecord) {
        await profileAPI.updateCourse(entityType, id, selectedRecord.id, formData);
        setEditCourseModalOpen(false);
      } else {
        await profileAPI.addCourse(entityType, id, formData);
        setAddCourseModalOpen(false);
      }
      
      await loadProfile();
      setSelectedRecord(null);
      setFormData({});
    } catch (error) {
      console.error('Error submitting course:', error);
      alert(error.message);
    }
  }, [selectedRecord, entityType, id, loadProfile]);

  // Enrollment handlers
  const handleEditEnrollment = useCallback((row) => {
    setSelectedRecord(row);
    setFormData({
      courseCode: row.courseCode,
      courseName: row.courseName,
      credits: row.credits,
      semester: row.semester,
      instructor: row.instructor,
      status: row.status || 'enrolled'
    });
    setEditEnrollmentModalOpen(true);
  }, []);

  const handleAddEnrollment = useCallback(() => {
    setSelectedRecord(null);
    setFormData({});
    setAddEnrollmentModalOpen(true);
  }, []);

  const handleEnrollmentSubmit = useCallback(async (formData) => {
    try {
      if (selectedRecord) {
        await profileAPI.updateEnrollment(entityType, id, selectedRecord.id, formData);
        setEditEnrollmentModalOpen(false);
      } else {
        await profileAPI.addEnrollment(entityType, id, formData);
        setAddEnrollmentModalOpen(false);
      }
      
      await loadProfile();
      setSelectedRecord(null);
      setFormData({});
    } catch (error) {
      console.error('Error submitting enrollment:', error);
      alert(error.message);
    }
  }, [selectedRecord, entityType, id, loadProfile]);

  // Schedule handlers
  const handleEditSchedule = useCallback((row) => {
    setSelectedRecord(row);
    setFormData({
      day: row.day,
      startTime: row.startTime,
      endTime: row.endTime,
      availability: row.availability,
      notes: row.notes || '',
      courseCode: row.courseCode || '',
      room: row.room || '',
      students: row.students || ''
    });
    setEditScheduleModalOpen(true);
  }, []);

  const handleAddSchedule = useCallback(() => {
    setSelectedRecord(null);
    setFormData({});
    setAddScheduleModalOpen(true);
  }, []);

  const handleScheduleSubmit = useCallback(async (formData) => {
    try {
      if (formData.startTime >= formData.endTime) {
        throw new Error('End time must be after start time');
      }

      if (selectedRecord) {
        await profileAPI.updateSchedule(entityType, id, selectedRecord.id, formData);
        setEditScheduleModalOpen(false);
      } else {
        await profileAPI.addSchedule(entityType, id, formData);
        setAddScheduleModalOpen(false);
      }
      
      await loadProfile();
      setSelectedRecord(null);
      setFormData({});
    } catch (error) {
      console.error('Error submitting schedule:', error);
      alert(error.message);
    }
  }, [selectedRecord, entityType, id, loadProfile]);

  // Resource handlers
  const handleEditResource = useCallback((row) => {
    setSelectedRecord(row);
    setFormData({
      type: row.type,
      title: row.title,
      description: row.description,
      date: row.date || '',
      institution: row.institution || '',
      url: row.url || '',
      tags: row.tags || ''
    });
    setEditResourceModalOpen(true);
  }, []);

  const handleAddResource = useCallback(() => {
    setSelectedRecord(null);
    setFormData({});
    setAddResourceModalOpen(true);
  }, []);

  const handleResourceSubmit = useCallback(async (formData) => {
    try {
      if (!selectedRecord && !formData.file) {
        throw new Error('Please select a file to upload');
      }

      if (formData.file && formData.file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      setFileUploadProgress({ status: 'uploading', progress: 0 });

      // Simulate upload progress
      const interval = setInterval(() => {
        setFileUploadProgress(prev => {
          if (prev.progress >= 100) {
            clearInterval(interval);
            setTimeout(() => setFileUploadProgress({}), 1000);
            return { status: 'completed', progress: 100 };
          }
          return { ...prev, progress: prev.progress + 10 };
        });
      }, 100);

      if (selectedRecord) {
        await profileAPI.updateResource(entityType, id, selectedRecord.id, formData);
        if (formData.file) {
          setUploadedFiles(prev => new Map(prev.set(selectedRecord.id, formData.file)));
        }
        setEditResourceModalOpen(false);
      } else {
        const newResource = await profileAPI.addResource(entityType, id, formData);
        if (formData.file && newResource.id) {
          setUploadedFiles(prev => new Map(prev.set(newResource.id, formData.file)));
        }
        setAddResourceModalOpen(false);
      }

      await loadProfile();
      setSelectedRecord(null);
      setFormData({});
    } catch (error) {
      console.error('Error uploading resource:', error);
      alert(error.message);
      setFileUploadProgress({ status: 'error', progress: 0 });
    }
  }, [selectedRecord, entityType, id, loadProfile]);

  const handleDownloadResource = useCallback(async (row) => {
    try {
      await profileAPI.downloadResource(entityType, id, row.id);
      await loadProfile(); // Refresh to update download count
    } catch (error) {
      console.error('Download error:', error);
      alert('Error downloading file. Please try again.');
    }
  }, [entityType, id, loadProfile]);

  const handlePreviewResource = useCallback(async (row) => {
    try {
      await profileAPI.previewResource(entityType, id, row.id);
    } catch (error) {
      console.error('Preview error:', error);
      alert('Error previewing file. Please try again.');
    }
  }, [entityType, id]);

  // Request handlers
  const handleViewRequest = useCallback((row) => {
    setSelectedRecord(row);
    setViewRequestModalOpen(true);
  }, []);

  const handleResponseRequest = useCallback((row) => {
    setSelectedRecord(row);
    setRequestResponse("");
    setResponseRequestModalOpen(true);
  }, []);

  const handleApproveRequest = useCallback(async (row) => {
    try {
      await profileAPI.updateRequestStatus(entityType, id, row.id, 'approved');
      await loadProfile();
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Error approving request. Please try again.');
    }
  }, [entityType, id, loadProfile]);

  const handleRejectRequest = useCallback(async (row) => {
    try {
      await profileAPI.updateRequestStatus(entityType, id, row.id, 'rejected');
      await loadProfile();
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Error rejecting request. Please try again.');
    }
  }, [entityType, id, loadProfile]);

  const handleSubmitResponse = useCallback(async () => {
    try {
      if (!requestResponse.trim()) {
        throw new Error('Please enter a response');
      }

      await profileAPI.submitRequestResponse(entityType, id, selectedRecord.id, requestResponse);
      setResponseRequestModalOpen(false);
      setRequestResponse("");
      setSelectedRecord(null);
      await loadProfile();
    } catch (error) {
      console.error('Error submitting response:', error);
      alert(error.message);
    }
  }, [requestResponse, selectedRecord, entityType, id, loadProfile]);

  // Card click handler
  const handleCardClick = useCallback((card) => {
    const sectionMap = {
      "completed-courses": "grades",
      "active-courses": "courses",
      "pending-requests": "requests",
      "current-enrollments": "enrollments",
      "avg-rating": "resources",
      "total-students": "resources",
      "weekly-hours": "schedule",
      "cv-status": "resources",
      "education-records": "resources",
      "research-projects": "resources",
      "career-milestones": "resources"
    };
    
    if (sectionMap[card.id]) {
      setActiveSection(sectionMap[card.id]);
    }
  }, []);

  // Load profile on mount
  useEffect(() => {
    if (entityType && id) {
      loadProfile();
    } else {
      setError('Missing required parameters');
      setLoading(false);
    }
  }, [entityType, id, loadProfile]);

  return {
    // State
    profileData,
    stats,
    statCards,
    loading,
    error,
    activeSection,
    selectedYear,
    showActions,
    uploadedFiles,
    fileUploadProgress,
    
    // Modal states
    editGradeModalOpen,
    addGradeModalOpen,
    editCourseModalOpen,
    addCourseModalOpen,
    editEnrollmentModalOpen,
    addEnrollmentModalOpen,
    editScheduleModalOpen,
    addScheduleModalOpen,
    editResourceModalOpen,
    addResourceModalOpen,
    viewRequestModalOpen,
    responseRequestModalOpen,
    
    // Form state
    selectedRecord,
    formData,
    requestResponse,
    
    // Setters
    setActiveSection,
    setSelectedYear,
    setShowActions,
    setUploadedFiles,
    setEditGradeModalOpen,
    setAddGradeModalOpen,
    setEditCourseModalOpen,
    setAddCourseModalOpen,
    setEditEnrollmentModalOpen,
    setAddEnrollmentModalOpen,
    setEditScheduleModalOpen,
    setAddScheduleModalOpen,
    setEditResourceModalOpen,
    setAddResourceModalOpen,
    setViewRequestModalOpen,
    setResponseRequestModalOpen,
    setRequestResponse,
    
    // Handlers
    handleEditGrade,
    handleAddGrade,
    handleGradeSubmit,
    handleEditCourse,
    handleAddCourse,
    handleCourseSubmit,
    handleEditEnrollment,
    handleAddEnrollment,
    handleEnrollmentSubmit,
    handleEditSchedule,
    handleAddSchedule,
    handleScheduleSubmit,
    handleEditResource,
    handleAddResource,
    handleResourceSubmit,
    handleDownloadResource,
    handlePreviewResource,
    handleViewRequest,
    handleResponseRequest,
    handleApproveRequest,
    handleRejectRequest,
    handleSubmitResponse,
    handleCardClick,
    
    // Derived data
    entityType,
    id,
    mainEntity: profileData ? (entityType === "student" ? profileData.student : profileData.lecturer) : null
  };
};