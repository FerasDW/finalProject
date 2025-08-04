// Complete GenericProfile.jsx with Enhanced Resource Management
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Edit, 
  Eye, 
  Check, 
  X, 
  Plus, 
  Download, 
  FileText,
  Book,
  Calendar,
  Users,
  Award,
  TrendingUp,
  Clock,
  Star,
  MapPin,
  Phone,
  Mail,
  GraduationCap,
  Briefcase,
  Target,
  BookOpen,
  User,
  Building,
  Globe,
  AlertCircle
} from "lucide-react";

import ProfileHeader from "../Components/StudentProfile/profileHeader";
import ProfileInfoCard from "../Components/StudentProfile/profileInfoCard";
import QuickActions from "../Components/StudentProfile/QuickActions";
import RequestsList from "../Components/StudentProfile/RequestsList";
import StatCardsContainer from "../Components/Cards/StatCardsContainer";
import MidPageNavbar from "../Components/CoursePage/Content/MidPageNavBar";
import DynamicTable from "../Components/Tables/Table";
import Modal from "../Components/Modal/Modal.jsx";
import PopUp from "../Components/Cards/PopUp.jsx";
import DynamicForm from "../Components/Forms/dynamicForm.jsx";

import { profileConfigs } from "../../Static/GenericProfile/profileConfig";
import { ActionButtons, SummaryCards } from "../../Static/GenericProfile/UIHelper";
import { generateScheduleData, generateResourcesData } from "../../Static/GenericProfile/dataUtils";

import "./GenericProfile.css";

const GenericProfile = ({ cardSize = "default", initialSection = "overview" }) => {
  const { entityType, id } = useParams();
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState(null);
  const [stats, setStats] = useState({});
  const [statCards, setStatCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
  
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formData, setFormData] = useState({});
  const [requestResponse, setRequestResponse] = useState("");

  // Mock data for available courses
  const availableCourses = [
    { value: 'CS101', label: 'CS101 - Introduction to Computer Science' },
    { value: 'CS201', label: 'CS201 - Data Structures' },
    { value: 'CS301', label: 'CS301 - Algorithms' },
    { value: 'MATH101', label: 'MATH101 - Calculus I' },
    { value: 'MATH201', label: 'MATH201 - Calculus II' },
    { value: 'PHYS101', label: 'PHYS101 - Physics I' },
    { value: 'ENG101', label: 'ENG101 - English Composition' }
  ];

  // Helper functions for file management
  const getFileInfo = (file) => {
    if (!file) return { extension: '', mimeType: '', category: 'unknown' };
    
    const extension = file.name.split('.').pop().toLowerCase();
    const mimeType = file.type;
    
    let category = 'document';
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension)) {
      category = 'image';
    } else if (['pdf'].includes(extension)) {
      category = 'pdf';
    } else if (['doc', 'docx'].includes(extension)) {
      category = 'word';
    } else if (['ppt', 'pptx'].includes(extension)) {
      category = 'presentation';
    }
    
    return { extension, mimeType, category };
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Helper function to convert numerical grade to letter grade
  const getLetterGrade = (numericGrade) => {
    if (numericGrade >= 97) return 'A+';
    if (numericGrade >= 93) return 'A';
    if (numericGrade >= 90) return 'A-';
    if (numericGrade >= 87) return 'B+';
    if (numericGrade >= 83) return 'B';
    if (numericGrade >= 80) return 'B-';
    if (numericGrade >= 77) return 'C+';
    if (numericGrade >= 73) return 'C';
    if (numericGrade >= 70) return 'C-';
    if (numericGrade >= 67) return 'D+';
    if (numericGrade >= 60) return 'D';
    return 'F';
  };

  // Get student's enrolled courses for grade form
  const getStudentEnrolledCourses = () => {
    if (!profileData || !profileData.enrollments) return [];
    return profileData.enrollments.map(enrollment => ({
      value: enrollment.courseCode,
      label: `${enrollment.courseCode} - ${enrollment.courseName}`
    }));
  };

  // Form field configurations
  const gradeFormFields = [
    { name: 'courseCode', label: 'Course', type: 'select', required: true, 
      options: getStudentEnrolledCourses() },
    { 
      name: 'grade', 
      label: 'Grade (0-100)', 
      type: 'number', 
      required: true,
      min: 0,
      max: 100,
      step: 0.1,
      placeholder: 'Enter grade between 0 and 100'
    },
    { name: 'credits', label: 'Credits', type: 'number', required: true, min: 1, max: 6 },
    { name: 'semester', label: 'Semester', type: 'select', required: true, options: [
      { value: 'Fall 2024', label: 'Fall 2024' },
      { value: 'Spring 2025', label: 'Spring 2025' },
      { value: 'Summer 2025', label: 'Summer 2025' },
      { value: 'Fall 2025', label: 'Fall 2025' }
    ]}
  ];

  const editGradeFormFields = [
    { name: 'courseCode', label: 'Course Code', type: 'text', required: true, disabled: true },
    { name: 'courseName', label: 'Course Name', type: 'text', required: true, disabled: true },
    { 
      name: 'grade', 
      label: 'Grade (0-100)', 
      type: 'number', 
      required: true,
      min: 0,
      max: 100,
      step: 0.1,
      placeholder: 'Enter grade between 0 and 100'
    },
    { name: 'credits', label: 'Credits', type: 'number', required: true, min: 1, max: 6 },
    { name: 'semester', label: 'Semester', type: 'text', required: true, disabled: true }
  ];

  const lecturerCourseFormFields = [
    { name: 'courseCode', label: 'Course to Assign', type: 'select', required: true, 
      options: availableCourses },
    { name: 'semester', label: 'Semester', type: 'select', required: true, options: [
      { value: 'Fall 2024', label: 'Fall 2024' },
      { value: 'Spring 2025', label: 'Spring 2025' },
      { value: 'Summer 2025', label: 'Summer 2025' },
      { value: 'Fall 2025', label: 'Fall 2025' }
    ]},
    { name: 'classSize', label: 'Expected Class Size', type: 'number', required: true, min: 1, max: 200 },
    { name: 'notes', label: 'Additional Notes', type: 'textarea', required: false }
  ];

  const courseFormFields = [
    { name: 'courseCode', label: 'Course Code', type: 'text', required: true, 
      pattern: '[A-Z]{2,4}[0-9]{3}', placeholder: 'e.g., CS101' },
    { name: 'courseName', label: 'Course Name', type: 'text', required: true },
    { name: 'credits', label: 'Credits', type: 'number', required: true, min: 1, max: 6 },
    { name: 'semester', label: 'Semester', type: 'select', required: true, options: [
      { value: 'Fall 2024', label: 'Fall 2024' },
      { value: 'Spring 2025', label: 'Spring 2025' },
      { value: 'Summer 2025', label: 'Summer 2025' },
      { value: 'Fall 2025', label: 'Fall 2025' }
    ]},
    { name: 'department', label: 'Department', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: false }
  ];

  const enrollmentFormFields = [
    { name: 'courseCode', label: 'Course Code', type: 'select', required: true, 
      options: availableCourses },
    { name: 'semester', label: 'Semester', type: 'select', required: true, options: [
      { value: 'Fall 2024', label: 'Fall 2024' },
      { value: 'Spring 2025', label: 'Spring 2025' },
      { value: 'Summer 2025', label: 'Summer 2025' },
      { value: 'Fall 2025', label: 'Fall 2025' }
    ]},
    { name: 'instructor', label: 'Instructor', type: 'text', required: true },
    { name: 'status', label: 'Status', type: 'select', required: true, options: [
      { value: 'enrolled', label: 'Enrolled' },
      { value: 'pending', label: 'Pending' },
      { value: 'dropped', label: 'Dropped' }
    ]}
  ];

  const scheduleFormFields = [
    { name: 'day', label: 'Day', type: 'select', required: true, options: [
      { value: 'Monday', label: 'Monday' },
      { value: 'Tuesday', label: 'Tuesday' },
      { value: 'Wednesday', label: 'Wednesday' },
      { value: 'Thursday', label: 'Thursday' },
      { value: 'Friday', label: 'Friday' },
      { value: 'Saturday', label: 'Saturday' }
    ]},
    { name: 'startTime', label: 'Start Time', type: 'time', required: true },
    { name: 'endTime', label: 'End Time', type: 'time', required: true },
    { name: 'availability', label: 'Availability Status', type: 'select', required: true, options: [
      { value: 'available', label: 'Available' },
      { value: 'busy', label: 'Busy' },
      { value: 'preferred', label: 'Preferred Hours' }
    ]},
    { name: 'notes', label: 'Notes', type: 'textarea', required: false }
  ];

  // Enhanced resource form fields with file upload
  const resourceFormFields = [
    { 
      name: 'type', 
      label: 'Document Type', 
      type: 'select', 
      required: true, 
      options: [
        { value: 'cv', label: 'CV/Resume' },
        { value: 'education', label: 'Educational Background' },
        { value: 'research', label: 'Research Work' },
        { value: 'milestone', label: 'Career Milestone' },
        { value: 'publication', label: 'Publication' },
        { value: 'award', label: 'Award/Recognition' }
      ]
    },
    { 
      name: 'title', 
      label: 'Document Title', 
      type: 'text', 
      required: true,
      placeholder: 'Enter a descriptive title for your document'
    },
    { 
      name: 'description', 
      label: 'Description', 
      type: 'textarea', 
      required: true,
      placeholder: 'Provide a detailed description of the document content',
      rows: 4
    },
    { 
      name: 'file', 
      label: 'Upload File', 
      type: 'file', 
      required: !selectedRecord, // Only required for new resources
      accept: '.pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.ppt,.pptx',
      helperText: 'Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG, PPT, PPTX (Max 10MB)'
    },
    { 
      name: 'date', 
      label: 'Document Date', 
      type: 'date', 
      required: false,
      helperText: 'Date when this document was created or published'
    },
    { 
      name: 'institution', 
      label: 'Institution/Organization', 
      type: 'text', 
      required: false,
      placeholder: 'Associated institution or organization'
    },
    { 
      name: 'url', 
      label: 'External URL/Link', 
      type: 'url', 
      required: false,
      placeholder: 'https://example.com/document-link'
    },
    { 
      name: 'tags', 
      label: 'Tags', 
      type: 'text', 
      required: false,
      placeholder: 'research, machine learning, AI (comma separated)',
      helperText: 'Add relevant tags separated by commas'
    }
  ];

  // File Upload Progress Component
  const FileUploadProgress = ({ progress }) => {
    if (!progress.status) return null;
    
    return (
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'white',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 10000,
        minWidth: '200px'
      }}>
        <div style={{ marginBottom: '8px', fontWeight: '600' }}>
          {progress.status === 'uploading' && 'Uploading...'}
          {progress.status === 'completed' && 'Upload Complete!'}
          {progress.status === 'error' && 'Upload Failed'}
        </div>
        <div style={{
          width: '100%',
          height: '4px',
          background: '#e5e7eb',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progress.progress}%`,
            height: '100%',
            background: progress.status === 'error' ? '#ef4444' : '#10b981',
            transition: 'width 0.3s ease'
          }} />
        </div>
        <div style={{ 
          fontSize: '12px', 
          color: '#666', 
          marginTop: '4px' 
        }}>
          {progress.progress}%
        </div>
      </div>
    );
  };

  // Load profile data
  useEffect(() => {
    const loadProfile = async () => {
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

        const config = profileConfigs[entityType];
        if (!config || !config.dataSource?.length) {
          throw new Error(`No data available for ${entityType}`);
        }

        const data = config.getProfileData(sanitizedId);
        const mainEntity = entityType === "student" ? data.student : data.lecturer;
        if (!mainEntity) {
          throw new Error(`${entityType} with ID ${sanitizedId} not found`);
        }

        const calculatedStats = config.getStats(data);
        const cards = config.getStatCards(calculatedStats);

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
    };

    if (entityType && id) {
      loadProfile();
    } else {
      setError('Missing required parameters');
      setLoading(false);
    }
  }, [entityType, id, navigate]);

  // Grade handlers
  const handleEditGrade = (row) => {
    setSelectedRecord(row);
    setFormData({
      courseCode: row.courseCode,
      courseName: row.courseName,
      grade: row.grade,
      credits: row.credits,
      semester: row.semester
    });
    setEditGradeModalOpen(true);
  };

  const handleAddGrade = () => {
    setSelectedRecord(null);
    setFormData({});
    setAddGradeModalOpen(true);
  };

  const handleGradeSubmit = (formData) => {
    if (formData.grade < 0 || formData.grade > 100) {
      alert('Grade must be between 0 and 100');
      return;
    }

    if (selectedRecord) {
      const updatedGrades = profileData.grades.map(grade => 
        grade.id === selectedRecord.id ? { 
          ...grade, 
          ...formData,
          letterGrade: getLetterGrade(formData.grade)
        } : grade
      );
      setProfileData({ ...profileData, grades: updatedGrades });
      setEditGradeModalOpen(false);
    } else {
      const selectedCourse = getStudentEnrolledCourses().find(course => course.value === formData.courseCode);
      const courseName = selectedCourse ? selectedCourse.label.split(' - ')[1] : '';
      
      const newId = Math.max(...(profileData.grades?.map(g => g.id) || [0])) + 1;
      const newGrade = { 
        id: newId, 
        courseCode: formData.courseCode,
        courseName: courseName,
        grade: formData.grade,
        letterGrade: getLetterGrade(formData.grade),
        credits: formData.credits,
        semester: formData.semester
      };
      setProfileData({ 
        ...profileData, 
        grades: [...(profileData.grades || []), newGrade] 
      });
      setAddGradeModalOpen(false);
    }
    setSelectedRecord(null);
    setFormData({});
  };

  // Course handlers
  const handleEditCourse = (row) => {
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
  };

  const handleAddCourse = () => {
    setSelectedRecord(null);
    setFormData({});
    setAddCourseModalOpen(true);
  };

  const handleCourseSubmit = (formData) => {
    if (entityType === 'lecturer') {
      if (selectedRecord) {
        const updatedCourses = profileData.courses.map(course => 
          course.id === selectedRecord.id ? { ...course, ...formData } : course
        );
        setProfileData({ ...profileData, courses: updatedCourses });
        setEditCourseModalOpen(false);
      } else {
        const selectedCourse = availableCourses.find(course => course.value === formData.courseCode);
        const courseName = selectedCourse ? selectedCourse.label.split(' - ')[1] : '';
        
        const newId = Math.max(...(profileData.courses?.map(c => c.id) || [0])) + 1;
        const newCourseAssignment = { 
          id: newId, 
          courseCode: formData.courseCode,
          courseName: courseName,
          semester: formData.semester,
          classSize: formData.classSize,
          notes: formData.notes || '',
          status: 'active'
        };
        setProfileData({ 
          ...profileData, 
          courses: [...(profileData.courses || []), newCourseAssignment] 
        });
        setAddCourseModalOpen(false);
      }
    } else {
      if (selectedRecord) {
        const updatedCourses = profileData.courses.map(course => 
          course.id === selectedRecord.id ? { ...course, ...formData } : course
        );
        setProfileData({ ...profileData, courses: updatedCourses });
        setEditCourseModalOpen(false);
      } else {
        const newId = Math.max(...(profileData.courses?.map(c => c.id) || [0])) + 1;
        const newCourse = { id: newId, ...formData };
        setProfileData({ 
          ...profileData, 
          courses: [...(profileData.courses || []), newCourse] 
        });
        setAddCourseModalOpen(false);
      }
    }
    setSelectedRecord(null);
    setFormData({});
  };

  // Enrollment handlers
  const handleEditEnrollment = (row) => {
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
  };

  const handleAddEnrollment = () => {
    setSelectedRecord(null);
    setFormData({});
    setAddEnrollmentModalOpen(true);
  };

  const handleEnrollmentSubmit = (formData) => {
    if (selectedRecord) {
      const updatedEnrollments = profileData.enrollments.map(enrollment => 
        enrollment.id === selectedRecord.id ? { ...enrollment, ...formData } : enrollment
      );
      setProfileData({ ...profileData, enrollments: updatedEnrollments });
      setEditEnrollmentModalOpen(false);
    } else {
      const selectedCourse = availableCourses.find(course => course.value === formData.courseCode);
      const courseName = selectedCourse ? selectedCourse.label.split(' - ')[1] : formData.courseCode;
      
      const newId = Math.max(...(profileData.enrollments?.map(e => e.id) || [0])) + 1;
      const newEnrollment = { 
        id: newId, 
        ...formData,
        courseName: courseName,
        credits: 3
      };
      setProfileData({ 
        ...profileData, 
        enrollments: [...(profileData.enrollments || []), newEnrollment] 
      });
      setAddEnrollmentModalOpen(false);
    }
    setSelectedRecord(null);
    setFormData({});
  };

  // Schedule handlers
  const handleEditSchedule = (row) => {
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
  };

  const handleAddSchedule = () => {
    setSelectedRecord(null);
    setFormData({});
    setAddScheduleModalOpen(true);
  };

  const handleScheduleSubmit = (formData) => {
    if (formData.startTime >= formData.endTime) {
      alert('End time must be after start time');
      return;
    }

    if (selectedRecord) {
      if (entityType === 'lecturer') {
        console.log("Updating lecturer schedule:", formData);
      } else {
        const updatedSchedule = profileData.schedule?.map(item => 
          item.id === selectedRecord.id ? { ...item, ...formData } : item
        ) || [];
        setProfileData({ ...profileData, schedule: updatedSchedule });
      }
      setEditScheduleModalOpen(false);
    } else {
      const newId = Math.max(...(profileData.schedule?.map(s => s.id) || [0])) + 1;
      const newScheduleEntry = { id: newId, ...formData };
      setProfileData({ 
        ...profileData, 
        schedule: [...(profileData.schedule || []), newScheduleEntry] 
      });
      setAddScheduleModalOpen(false);
    }
    setSelectedRecord(null);
    setFormData({});
  };

  // Enhanced Resource handlers with file upload
  const handleEditResource = (row) => {
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
  };

  const handleAddResource = () => {
    setSelectedRecord(null);
    setFormData({});
    setAddResourceModalOpen(true);
  };

  const handleResourceSubmit = async (formData) => {
    try {
      // Validate file upload for new resources
      if (!selectedRecord && !formData.file) {
        alert('Please select a file to upload');
        return;
      }

      // Validate file size (10MB limit)
      if (formData.file && formData.file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      setFileUploadProgress({ status: 'uploading', progress: 0 });

      if (selectedRecord) {
        // Edit existing resource
        const updatedResources = profileData.resources?.map(resource => 
          resource.id === selectedRecord.id ? { 
            ...resource, 
            ...formData,
            // Keep existing file info if no new file uploaded
            ...(formData.file ? {
              fileName: formData.file.name,
              fileSize: formatFileSize(formData.file.size),
              ...getFileInfo(formData.file)
            } : {})
          } : resource
        ) || [];
        
        // Store file object if new file uploaded
        if (formData.file) {
          setUploadedFiles(prev => new Map(prev.set(selectedRecord.id, formData.file)));
        }
        
        setProfileData({ ...profileData, resources: updatedResources });
        setEditResourceModalOpen(false);
      } else {
        // Add new resource
        const newId = Math.max(...(profileData.resources?.map(r => r.id) || [0])) + 1;
        const fileInfo = getFileInfo(formData.file);
        
        const newResource = { 
          id: newId, 
          ...formData,
          fileName: formData.file.name,
          fileSize: formatFileSize(formData.file.size),
          uploadDate: new Date().toISOString().split('T')[0],
          downloads: 0,
          rating: 0,
          size: formatFileSize(formData.file.size),
          ...fileInfo
        };
        
        // Store file object
        setUploadedFiles(prev => new Map(prev.set(newId, formData.file)));
        
        setProfileData({ 
          ...profileData, 
          resources: [...(profileData.resources || []), newResource] 
        });
        setAddResourceModalOpen(false);
      }

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

    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
      setFileUploadProgress({ status: 'error', progress: 0 });
    } finally {
      setSelectedRecord(null);
      setFormData({});
    }
  };

  const handleDownloadResource = (row) => {
    try {
      console.log("Downloading resource:", row.title);
      
      // Update download count first
      const updatedResources = profileData.resources?.map(resource => 
        resource.id === row.id ? { ...resource, downloads: resource.downloads + 1 } : resource
      ) || [];
      setProfileData({ ...profileData, resources: updatedResources });
      
      // Check if we have the actual file
      const fileObject = uploadedFiles.get(row.id);
      
      if (fileObject) {
        // Download actual uploaded file
        const url = URL.createObjectURL(fileObject);
        const link = document.createElement('a');
        link.href = url;
        link.download = row.fileName || row.title;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the URL object
        setTimeout(() => URL.revokeObjectURL(url), 100);
        
        // Show success message
        const toast = document.createElement('div');
        toast.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #10b981;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          z-index: 10000;
          font-weight: 500;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        toast.textContent = `Downloaded: ${row.title}`;
        document.body.appendChild(toast);
        
        setTimeout(() => document.body.removeChild(toast), 3000);
      } else {
        // Fallback for demo/existing files
        alert(`Downloading: ${row.title}\n\nIn a real application, this would download the file from the server.`);
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Error downloading file. Please try again.');
    }
  };

  const handlePreviewResource = (row) => {
    try {
      console.log("Previewing resource:", row.title);
      
      const fileObject = uploadedFiles.get(row.id);
      
      if (fileObject) {
        // Preview actual uploaded file
        const fileInfo = getFileInfo(fileObject);
        const url = URL.createObjectURL(fileObject);
        
        if (fileInfo.category === 'image') {
          // Open image in new tab
          const newWindow = window.open('', '_blank');
          newWindow.document.write(`
            <html>
              <head>
                <title>${row.title} - Preview</title>
                <style>
                  body { 
                    margin: 0; 
                    padding: 20px; 
                    background: #f5f5f5; 
                    display: flex; 
                    justify-content: center; 
                    align-items: center; 
                    min-height: 100vh;
                    font-family: Arial, sans-serif;
                  }
                  .container {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    text-align: center;
                  }
                  img { 
                    max-width: 100%; 
                    max-height: 80vh; 
                    border-radius: 4px;
                  }
                  h2 { margin-top: 0; color: #333; }
                  .info { color: #666; margin-bottom: 20px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <h2>${row.title}</h2>
                  <div class="info">${row.description || 'No description available'}</div>
                  <img src="${url}" alt="${row.title}" />
                </div>
              </body>
            </html>
          `);
        } else if (fileInfo.category === 'pdf' || fileInfo.mimeType === 'application/pdf') {
          // Open PDF in new tab
          window.open(url, '_blank');
        } else {
          // For other file types, show preview modal
          const previewWindow = window.open('', '_blank', 'width=800,height=600');
          previewWindow.document.write(`
            <html>
              <head>
                <title>${row.title} - Preview</title>
                <style>
                  body { 
                    font-family: Arial, sans-serif; 
                    margin: 0; 
                    padding: 20px; 
                    background: #f5f5f5;
                  }
                  .header {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                  }
                  .content {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    text-align: center;
                  }
                  .download-btn {
                    background: #3b82f6;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    margin-top: 20px;
                  }
                  .download-btn:hover { background: #2563eb; }
                </style>
              </head>
              <body>
                <div class="header">
                  <h1>${row.title}</h1>
                  <p><strong>Type:</strong> ${row.type}</p>
                  <p><strong>Size:</strong> ${row.fileSize || row.size}</p>
                  <p><strong>Institution:</strong> ${row.institution || 'N/A'}</p>
                </div>
                <div class="content">
                  <p>${row.description || 'No description available'}</p>
                  <p><em>This file type cannot be previewed in the browser.</em></p>
                  <button class="download-btn" onclick="alert('Download functionality would be implemented here')">
                    Download File
                  </button>
                </div>
              </body>
            </html>
          `);
        }
        
        // Clean up URL after some time
        setTimeout(() => URL.revokeObjectURL(url), 10000);
      } else {
        // Fallback preview for demo/existing files
        const previewWindow = window.open('', '_blank', 'width=800,height=600');
        previewWindow.document.write(`
          <html>
            <head>
              <title>${row.title} - Preview</title>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  margin: 0; 
                  padding: 20px; 
                  background: #f5f5f5;
                }
                .container {
                  background: white;
                  padding: 30px;
                  border-radius: 8px;
                  max-width: 600px;
                  margin: 0 auto;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                h1 { color: #333; margin-bottom: 10px; }
                .meta { color: #666; margin-bottom: 20px; }
                .description { line-height: 1.6; color: #444; }
                .tags { 
                  margin-top: 20px; 
                  padding-top: 20px; 
                  border-top: 1px solid #eee; 
                }
                .tag {
                  display: inline-block;
                  background: #e5e7eb;
                  padding: 4px 8px;
                  border-radius: 4px;
                  margin-right: 8px;
                  font-size: 12px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>${row.title}</h1>
                <div class="meta">
                  <strong>Type:</strong> ${row.type} | 
                  <strong>Institution:</strong> ${row.institution || 'N/A'} | 
                  <strong>Date:</strong> ${row.date || 'N/A'}
                </div>
                <div class="description">
                  <h3>Description:</h3>
                  <p>${row.description || 'No description available'}</p>
                </div>
                ${row.tags ? `
                  <div class="tags">
                    <strong>Tags:</strong><br>
                    ${row.tags.split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('')}
                  </div>
                ` : ''}
              </div>
            </body>
          </html>
        `);
      }
    } catch (error) {
      console.error('Preview error:', error);
      alert('Error previewing file. Please try again.');
    }
  };

  // Request handlers
  const handleViewRequest = (row) => {
    setSelectedRecord(row);
    setViewRequestModalOpen(true);
  };

  const handleResponseRequest = (row) => {
    setSelectedRecord(row);
    setRequestResponse("");
    setResponseRequestModalOpen(true);
  };

  const handleApproveRequest = (row) => {
    const updatedRequests = profileData.requests?.map(request => 
      request.id === row.id ? { ...request, status: 'approved' } : request
    ) || [];
    setProfileData({ ...profileData, requests: updatedRequests });
  };

  const handleRejectRequest = (row) => {
    const updatedRequests = profileData.requests?.map(request => 
      request.id === row.id ? { ...request, status: 'rejected' } : request
    ) || [];
    setProfileData({ ...profileData, requests: updatedRequests });
  };

  const handleSubmitResponse = () => {
    if (!requestResponse.trim()) {
      alert('Please enter a response');
      return;
    }

    const updatedRequests = profileData.requests?.map(request => 
      request.id === selectedRecord.id ? { 
        ...request, 
        status: 'responded',
        response: requestResponse,
        responseDate: new Date().toISOString().split('T')[0]
      } : request
    ) || [];
    
    setProfileData({ ...profileData, requests: updatedRequests });
    setResponseRequestModalOpen(false);
    setRequestResponse("");
    setSelectedRecord(null);
  };

  // Card click handler
  const handleCardClick = (card) => {
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
  };

  // Generate stat cards functions
  const generateWorkingHoursCards = () => {
    return [
      {
        id: "weekly-hours",
        title: "Weekly Hours",
        value: "40",
        icon: <Clock />,
        trend: { value: "5%", isPositive: true },
        description: "Total working hours per week",
        backgroundColor: "#6366f1"
      },
      {
        id: "available-days",
        title: "Available Days",
        value: "5",
        icon: <Calendar />,
        trend: { value: "2", isPositive: true },
        description: "Days available for teaching",
        backgroundColor: "#ec4899"
      },
      {
        id: "office-hours",
        title: "Office Hours",
        value: "12",
        icon: <Users />,
        trend: { value: "3", isPositive: true },
        description: "Weekly office hours",
        backgroundColor: "#06b6d4"
      },
      {
        id: "preferred-slots",
        title: "Preferred Slots",
        value: "8",
        icon: <Star />,
        trend: { value: "2", isPositive: true },
        description: "Preferred teaching time slots",
        backgroundColor: "#10b981"
      }
    ];
  };

  const generateProfileCards = () => {
    return [
      {
        id: "cv-status",
        title: "CV Status",
        value: "Updated",
        icon: <FileText />,
        trend: { value: "Jan 2024", isPositive: true },
        description: "Last CV update",
        backgroundColor: "#f59e0b"
      },
      {
        id: "education-records",
        title: "Education",
        value: "3",
        icon: <GraduationCap />,
        trend: { value: "Degrees", isPositive: true },
        description: "Educational qualifications",
        backgroundColor: "#8b5cf6"
      },
      {
        id: "research-projects",
        title: "Research",
        value: "5",
        icon: <BookOpen />,
        trend: { value: "Active", isPositive: true },
        description: "Research projects",
        backgroundColor: "#3b82f6"
      },
      {
        id: "career-milestones",
        title: "Milestones",
        value: "12",
        icon: <Award />,
        trend: { value: "Achievements", isPositive: true },
        description: "Career achievements",
        backgroundColor: "#ef4444"
      }
    ];
  };

  // Helper function to create a TableSection with DynamicTable
  const TableSection = ({ 
    title, 
    description, 
    data, 
    showAddButton = true, 
    onAddClick, 
    actionButtons = [],
    customColumns = [],
    entityType: tableEntityType = "weekly-schedule",
    icon = "default",
    columnConfig = {},
    hiddenColumns = [],
    children 
  }) => {
    return (
      <div className="table-section">
        {children}
        <DynamicTable
          data={data}
          title={title}
          entityType={tableEntityType}
          icon={icon}
          searchPlaceholder={`Search ${tableEntityType}...`}
          addButtonText={`Add ${tableEntityType.slice(0, -1)}`}
          showAddButton={showAddButton}
          onAddClick={onAddClick}
          actionButtons={actionButtons}
          columnConfig={columnConfig}
          hiddenColumns={hiddenColumns}
          rowsPerPage={10}
          compact={false}
        />
      </div>
    );
  };

  const renderSection = () => {
    if (!profileData) return <div>No data available</div>;

    switch (activeSection) {
      case "grades":
        return (
          <TableSection 
            title="Academic Records" 
            description="Student grades and academic performance"
            data={profileData.grades || []}
            entityType="academic-records"
            icon="award"
            showAddButton={true}
            onAddClick={handleAddGrade}
            columnConfig={{
              courseCode: { displayName: "Course Code", sortable: true },
              courseName: { displayName: "Course Name", sortable: true },
              grade: { displayName: "Grade (%)", sortable: true, type: "number" },
              letterGrade: { displayName: "Letter Grade", sortable: true, type: "status" },
              credits: { displayName: "Credits", sortable: true, type: "number" },
              semester: { displayName: "Semester", sortable: true }
            }}
            hiddenColumns={["id"]}
            actionButtons={[
              (row) => (
                <button 
                  onClick={() => handleEditGrade(row)} 
                  className="action-btn edit-btn"
                  title="Edit Grade"
                >
                  <Edit size={14} />
                  Edit
                </button>
              )
            ]}
          />
        );

      case "courses":
        return (
          <TableSection 
            title={entityType === 'lecturer' ? "Course Assignments" : "Teaching Courses"}
            description={entityType === 'lecturer' ? "Assign lecturer to existing courses" : "Current and past courses taught"}
            data={profileData.courses || []}
            entityType="courses"
            icon="courses"
            showAddButton={true}
            onAddClick={handleAddCourse}
            columnConfig={{
              courseCode: { displayName: "Course Code", sortable: true },
              courseName: { displayName: "Course Name", sortable: true },
              credits: { displayName: "Credits", sortable: true, type: "number" },
              semester: { displayName: "Semester", sortable: true },
              department: { displayName: "Department", sortable: true },
              classSize: { displayName: "Class Size", sortable: true, type: "number" },
              status: { displayName: "Status", sortable: true, type: "status" }
            }}
            hiddenColumns={["id", "notes"]}
            actionButtons={[
              (row) => (
                <button 
                  style={{backgroundColor: '#3b82f6', color: '#fff', borderRadius: '5px'}}
                  onClick={() => handleEditCourse(row)} 
                  className="action-btn edit-btn"
                  title="Edit Course"
                >
                  <Edit size={14} />
                  Edit
                </button>
              )
            ]}
          />
        );

      case "requests":
        return (
          <TableSection
            title="Student Requests"
            description="Manage student requests and communications"
            data={profileData.requests || []}
            entityType="student-requests"
            icon="mail"
            showAddButton={false}
            columnConfig={{
              student: { displayName: "Student", sortable: true },
              sender: { displayName: "From", sortable: true },
              type: { displayName: "Type", sortable: true },
              requestType: { displayName: "Request Type", sortable: true },
              subject: { displayName: "Subject", sortable: true },
              date: { displayName: "Date", sortable: true, type: "date" },
              time: { displayName: "Time", sortable: true },
              priority: { displayName: "Priority", sortable: true, type: "status" },
              status: { displayName: "Status", sortable: true, type: "status" }
            }}
            hiddenColumns={["id", "description", "message", "response", "responseDate"]}
            actionButtons={[
              (row) => (
                <button 
                  onClick={() => handleViewRequest(row)} 
                  className="action-btn view-btn"
                  title="View Request"
                >
                  <Eye size={14} />
                  View
                </button>
              ),
              (row) => (
                <button 
                  onClick={() => handleResponseRequest(row)} 
                  className="action-btn response-btn"
                  title="Respond"
                >
                  <FileText size={14} />
                  Respond
                </button>
              ),
              (row) => (
                <button 
                  onClick={() => handleApproveRequest(row)} 
                  className="action-btn approve-btn"
                  title="Approve"
                  disabled={row.status === 'approved'}
                >
                  <Check size={14} />
                  Approve
                </button>
              ),
              (row) => (
                <button 
                  onClick={() => handleRejectRequest(row)} 
                  className="action-btn reject-btn"
                  title="Reject"
                  disabled={row.status === 'rejected'}
                >
                  <X size={14} />
                  Reject
                </button>
              )
            ]}
          />
        );

      case "enrollments":
        return (
          <TableSection 
            title="Current Enrollments" 
            description="Courses currently enrolled for the academic term"
            data={profileData.enrollments || []}
            entityType="enrollments"
            icon="users"
            showAddButton={true}
            onAddClick={handleAddEnrollment}
            columnConfig={{
              courseCode: { displayName: "Course Code", sortable: true },
              courseName: { displayName: "Course Name", sortable: true },
              credits: { displayName: "Credits", sortable: true, type: "number" },
              semester: { displayName: "Semester", sortable: true },
              instructor: { displayName: "Instructor", sortable: true },
              status: { displayName: "Status", sortable: true, type: "status" }
            }}
            hiddenColumns={["id"]}
            actionButtons={[
              (row) => (
                <button 
                  onClick={() => handleEditEnrollment(row)} 
                  className="action-btn edit-btn"
                  title="Edit Enrollment"
                >
                  <Edit size={14} />
                  Edit
                </button>
              )
            ]}
          />
        );

      case "schedule":
        if (entityType === 'lecturer') {
          const workingHoursCards = generateWorkingHoursCards();
          const workingHoursData = [
            {
              id: 1,
              day: "Monday",
              startTime: "09:00",
              endTime: "17:00",
              availability: "available",
              notes: "Regular office hours"
            },
            {
              id: 2,
              day: "Tuesday",
              startTime: "10:00",
              endTime: "16:00",
              availability: "preferred",
              notes: "Preferred teaching hours"
            },
            {
              id: 3,
              day: "Wednesday",
              startTime: "09:00",
              endTime: "15:00",
              availability: "busy",
              notes: "Research time"
            },
            {
              id: 4,
              day: "Thursday",
              startTime: "10:00",
              endTime: "17:00",
              availability: "available",
              notes: "Teaching and consultations"
            },
            {
              id: 5,
              day: "Friday",
              startTime: "09:00",
              endTime: "14:00",
              availability: "preferred",
              notes: "Lectures only"
            }
          ];
          
          return (
            <div className="working-hours-section">
              <div className="section-header">
                <h3>
                  <Clock className="section-icon" />
                  Working Hours & Availability
                </h3>
                <p>Manage your weekly schedule and availability for teaching and office hours</p>
              </div>

              <StatCardsContainer
                cards={workingHoursCards}
                size={cardSize}
                onCardClick={handleCardClick}
                columns={4}
              />

              <TableSection 
                title="Weekly Schedule" 
                description="Set your working hours and availability"
                data={workingHoursData}
                entityType="weekly-schedule"
                icon="calendar"
                showAddButton={true}
                onAddClick={handleAddSchedule}
                columnConfig={{
                  day: { displayName: "Day", sortable: true },
                  startTime: { displayName: "Start Time", sortable: true },
                  endTime: { displayName: "End Time", sortable: true },
                  availability: { displayName: "Status", sortable: true, type: "status" },
                  notes: { displayName: "Notes", sortable: false }
                }}
                hiddenColumns={["id"]}
                actionButtons={[
                  (row) => (
                    <button 
                      onClick={() => handleEditSchedule(row)} 
                      className="action-btn edit-btn"
                      title="Edit Hours"
                    >
                      <Edit size={14} />
                      Edit
                    </button>
                  )
                ]}
              />
            </div>
          );
        } else {
          const scheduleData = generateScheduleData(profileData);
          const summaryData = [
            { value: scheduleData.summary.weeklyHours, label: 'Weekly Hours' },
            { value: scheduleData.summary.totalStudents, label: 'Total Students' },
            { value: scheduleData.summary.uniqueCourses, label: 'Unique Courses' },
            { value: scheduleData.summary.totalClasses, label: 'Total Classes' }
          ];
          const colorScheme = [
            'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            'linear-gradient(135deg, #10b981 0%, #047857 100%)',
            'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)'
          ];

          return (
            <TableSection 
              title="Teaching Schedule" 
              description="Current semester teaching schedule and class details"
              data={scheduleData.schedule}
              entityType="schedules"
              icon="calendar"
              showAddButton={true}
              onAddClick={handleAddSchedule}
              columnConfig={{
                courseCode: { displayName: "Course", sortable: true },
                day: { displayName: "Day", sortable: true },
                time: { displayName: "Time", sortable: true },
                room: { displayName: "Room", sortable: true },
                students: { displayName: "Students", sortable: true, type: "number" }
              }}
              hiddenColumns={["id"]}
              actionButtons={[
                (row) => (
                  <button 
                    onClick={() => handleEditSchedule(row)} 
                    className="action-btn edit-btn"
                    title="Edit Schedule"
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                )
              ]}
            >
              <SummaryCards data={summaryData} colorScheme={colorScheme} />
            </TableSection>
          );
        }

      case "resources":
        if (entityType === 'lecturer') {
          const profileCards = generateProfileCards();
          const lecturerResources = [
            {
              id: 1,
              type: 'cv',
              title: 'Academic CV',
              description: 'Complete academic curriculum vitae with research experience and publications',
              date: '2024-01-15',
              institution: 'University',
              fileName: 'Academic_CV_2024.pdf',
              fileSize: '2.3 MB',
              tags: 'cv, academic, professional',
              uploadDate: '2024-01-15',
              downloads: 45,
              rating: 4.8,
              size: '2.3 MB',
              extension: 'pdf',
              category: 'pdf'
            },
            {
              id: 2,
              type: 'research',
              title: 'Machine Learning Research',
              description: 'Current research on deep learning applications in computer vision and natural language processing',
              date: '2024-02-01',
              institution: 'Research Lab',
              fileName: 'ML_Research_Paper_2024.pdf',
              fileSize: '5.1 MB',
              tags: 'research, machine learning, AI',
              uploadDate: '2024-02-01',
              downloads: 78,
              rating: 4.9,
              size: '5.1 MB',
              extension: 'pdf',
              category: 'pdf'
            },
            {
              id: 3,
              type: 'publication',
              title: 'Neural Networks Optimization Paper',
              description: 'Published paper on neural network optimization techniques for improved training efficiency',
              date: '2023-12-15',
              institution: 'IEEE Conference',
              fileName: 'Neural_Networks_IEEE_2023.pdf',
              fileSize: '3.8 MB',
              tags: 'publication, neural networks, optimization',
              uploadDate: '2023-12-15',
              downloads: 156,
              rating: 4.7,
              size: '3.8 MB',
              extension: 'pdf',
              category: 'pdf'
            }
          ];
          
          return (
            <div className="lecturer-profile-section">
              <div className="section-header">
                <h3>
                  <User className="section-icon" />
                  Professional Profile
                </h3>
                <p>Manage your academic profile, CV, research, and career milestones</p>
              </div>

              <StatCardsContainer
                cards={profileCards}
                size={cardSize}
                onCardClick={handleCardClick}
                columns={4}
              />

              <TableSection 
                title="Professional Documents" 
                description="Manage CV, research papers, and academic documents"
                data={lecturerResources}
                entityType="documents"
                icon="documents"
                showAddButton={true}
                onAddClick={handleAddResource}
                columnConfig={{
                  title: { displayName: "Document Title", sortable: true },
                  type: { displayName: "Type", sortable: true, type: "status" },
                  institution: { displayName: "Institution", sortable: true },
                  date: { displayName: "Date", sortable: true, type: "date" },
                  downloads: { displayName: "Downloads", sortable: true, type: "number" },
                  rating: { displayName: "Rating", sortable: true, type: "number" },
                  size: { displayName: "Size", sortable: true }
                }}
                hiddenColumns={["id", "description", "url", "tags", "uploadDate"]}
                actionButtons={[
                  (row) => (
                    <button 
                      onClick={() => handleDownloadResource(row)} 
                      className="action-btn download-btn"
                      title="Download"
                    >
                      <Download size={14} />
                      Download
                    </button>
                  ),
                  (row) => (
                    <button 
                      onClick={() => handlePreviewResource(row)} 
                      className="action-btn view-btn"
                      title="Preview"
                    >
                      <Eye size={14} />
                      Preview
                    </button>
                  ),
                  (row) => (
                    <button 
                      onClick={() => handleEditResource(row)} 
                      className="action-btn edit-btn"
                      title="Edit"
                    >
                      <Edit size={14} />
                      Edit
                    </button>
                  )
                ]}
              />
            </div>
          );
        } else {
          const resourcesData = generateResourcesData();
          return (
            <div className="resources-section">
              <div className="section-header">
                <h3>
                  <Book className="section-icon" />
                  Resources & Course Materials
                </h3>
                <p>Digital library, course materials, and educational resources</p>
              </div>

              <div className="resources-stats">
                <div className="stat-card">
                  <FileText className="stat-icon" />
                  <div className="stat-content">
                    <span className="stat-number">{resourcesData.courseMaterials?.length || 0}</span>
                    <span className="stat-label">Total Resources</span>
                  </div>
                </div>
                <div className="stat-card">
                  <Download className="stat-icon" />
                  <div className="stat-content">
                    <span className="stat-number">127</span>
                    <span className="stat-label">Downloads</span>
                  </div>
                </div>
                <div className="stat-card">
                  <Users className="stat-icon" />
                  <div className="stat-content">
                    <span className="stat-number">89</span>
                    <span className="stat-label">Active Users</span>
                  </div>
                </div>
                <div className="stat-card">
                  <TrendingUp className="stat-icon" />
                  <div className="stat-content">
                    <span className="stat-number">4.8</span>
                    <span className="stat-label">Avg Rating</span>
                  </div>
                </div>
              </div>

              <TableSection 
                title="Course Materials" 
                description="Upload and manage course resources"
                data={resourcesData.courseMaterials || []}
                entityType="files"
                icon="documents"
                showAddButton={true}
                onAddClick={handleAddResource}
                columnConfig={{
                  title: { displayName: "Resource Title", sortable: true },
                  type: { displayName: "Type", sortable: true },
                  course: { displayName: "Course", sortable: true },
                  uploadDate: { displayName: "Upload Date", sortable: true, type: "date" },
                  size: { displayName: "Size", sortable: true },
                  downloads: { displayName: "Downloads", sortable: true, type: "number" },
                  rating: { displayName: "Rating", sortable: true, type: "number" }
                }}
                hiddenColumns={["id", "url", "description"]}
                actionButtons={[
                  (row) => (
                    <button 
                      onClick={() => handleDownloadResource(row)} 
                      className="action-btn download-btn"
                      title="Download"
                    >
                      <Download size={14} />
                      Download
                    </button>
                  ),
                  (row) => (
                    <button 
                      onClick={() => handlePreviewResource(row)} 
                      className="action-btn view-btn"
                      title="Preview"
                    >
                      <Eye size={14} />
                      Preview
                    </button>
                  ),
                  (row) => (
                    <button 
                      onClick={() => handleEditResource(row)} 
                      className="action-btn edit-btn"
                      title="Edit"
                    >
                      <Edit size={14} />
                      Edit
                    </button>
                  )
                ]}
              />
            </div>
          );
        }

      default:
        return (
          <StatCardsContainer
            cards={statCards}
            size={cardSize}
            onCardClick={handleCardClick}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading {entityType} profile...</p>
      </div>
    );
  }

  if (!profileData || error) {
    return (
      <div className="error-container">
        <h2>Profile Not Found</h2>
        <p>{error}</p>
        <p>Redirecting to dashboard in 5 seconds...</p>
      </div>
    );
  }

  const mainEntity = entityType === "student" ? profileData.student : profileData.lecturer;
  const config = profileConfigs[entityType];

  return (
    <div className="student-profile-container">
      <ProfileHeader 
        entity={mainEntity}
        entityType={entityType}
        onActionsToggle={() => setShowActions(!showActions)} 
      />

      <div className="main-container">
        <div className="content-wrapper">
          <ProfileInfoCard 
            entity={mainEntity}
            entityType={entityType}
          />

          <div className="main-content">
            <div className="navbar-wrapper">
              <MidPageNavbar
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                sections={config.sections}
                sectionLabels={config.sectionLabels}
              />
            </div>
            <div className="tab-content">{renderSection()}</div>
          </div>
        </div>
      </div>

      <QuickActions 
        show={showActions} 
        entityType={entityType}
        entity={mainEntity}
      />

      {/* File Upload Progress Indicator */}
      <FileUploadProgress progress={fileUploadProgress} />

      {/* Grade Edit Modal */}
      <PopUp
        isOpen={editGradeModalOpen}
        onClose={() => setEditGradeModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <DynamicForm
          title="Edit Grade"
          fields={editGradeFormFields}
          onSubmit={handleGradeSubmit}
          onCancel={() => setEditGradeModalOpen(false)}
          submitText="Save Changes"
          initialData={formData}
        />
      </PopUp>

      {/* Add Grade Modal */}
      <PopUp
        isOpen={addGradeModalOpen}
        onClose={() => setAddGradeModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <DynamicForm
          title="Add New Grade"
          fields={gradeFormFields}
          onSubmit={handleGradeSubmit}
          onCancel={() => setAddGradeModalOpen(false)}
          submitText="Add Grade"
          initialData={formData}
        />
      </PopUp>

      {/* Course Edit Modal */}
      <PopUp
        isOpen={editCourseModalOpen}
        onClose={() => setEditCourseModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <DynamicForm
          title={entityType === 'lecturer' ? "Edit Course Assignment" : "Edit Course"}
          fields={entityType === 'lecturer' ? lecturerCourseFormFields : courseFormFields}
          onSubmit={handleCourseSubmit}
          onCancel={() => setEditCourseModalOpen(false)}
          submitText="Save Changes"
          initialData={formData}
        />
      </PopUp>

      {/* Add Course Modal */}
      <PopUp
        isOpen={addCourseModalOpen}
        onClose={() => setAddCourseModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <DynamicForm
          title={entityType === 'lecturer' ? "Assign Course" : "Add Course"}
          fields={entityType === 'lecturer' ? lecturerCourseFormFields : courseFormFields}
          onSubmit={handleCourseSubmit}
          onCancel={() => setAddCourseModalOpen(false)}
          submitText={entityType === 'lecturer' ? "Assign Course" : "Add Course"}
          initialData={formData}
        />
      </PopUp>

      {/* Enrollment Edit Modal */}
      <PopUp
        isOpen={editEnrollmentModalOpen}
        onClose={() => setEditEnrollmentModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <DynamicForm
          title="Edit Enrollment"
          fields={enrollmentFormFields}
          onSubmit={handleEnrollmentSubmit}
          onCancel={() => setEditEnrollmentModalOpen(false)}
          submitText="Save Changes"
          initialData={formData}
        />
      </PopUp>

      {/* Add Enrollment Modal */}
      <PopUp
        isOpen={addEnrollmentModalOpen}
        onClose={() => setAddEnrollmentModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <DynamicForm
          title="Add Enrollment"
          fields={enrollmentFormFields}
          onSubmit={handleEnrollmentSubmit}
          onCancel={() => setAddEnrollmentModalOpen(false)}
          submitText="Add Enrollment"
          initialData={formData}
        />
      </PopUp>

      {/* Schedule Edit Modal */}
      <PopUp
        isOpen={editScheduleModalOpen}
        onClose={() => setEditScheduleModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <DynamicForm
          title="Edit Schedule"
          fields={scheduleFormFields}
          onSubmit={handleScheduleSubmit}
          onCancel={() => setEditScheduleModalOpen(false)}
          submitText="Save Changes"
          initialData={formData}
        />
      </PopUp>

      {/* Add Schedule Modal */}
      <PopUp
        isOpen={addScheduleModalOpen}
        onClose={() => setAddScheduleModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <DynamicForm
          title="Add Schedule Entry"
          fields={scheduleFormFields}
          onSubmit={handleScheduleSubmit}
          onCancel={() => setAddScheduleModalOpen(false)}
          submitText="Add Schedule"
          initialData={formData}
        />
      </PopUp>

      {/* Resource Edit Modal */}
      <PopUp
        isOpen={editResourceModalOpen}
        onClose={() => setEditResourceModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <DynamicForm
          title="Edit Resource"
          fields={resourceFormFields}
          onSubmit={handleResourceSubmit}
          onCancel={() => setEditResourceModalOpen(false)}
          submitText="Save Changes"
          initialData={formData}
        />
      </PopUp>

      {/* Add Resource Modal */}
      <PopUp
        isOpen={addResourceModalOpen}
        onClose={() => setAddResourceModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <DynamicForm
          title="Add Resource"
          fields={resourceFormFields}
          onSubmit={handleResourceSubmit}
          onCancel={() => setAddResourceModalOpen(false)}
          submitText="Add Resource"
          initialData={formData}
        />
      </PopUp>

      {/* View Request Modal */}
      <PopUp
        isOpen={viewRequestModalOpen}
        onClose={() => setViewRequestModalOpen(false)}
        size="large"
        showCloseButton={true}
      >
        {selectedRecord && (
          <div className="request-details">
            <h3>Request Details</h3>
            <div className="request-info">
              <div className="info-row">
                <strong>From:</strong> {selectedRecord.sender || selectedRecord.student}
              </div>
              <div className="info-row">
                <strong>Type:</strong> {selectedRecord.type || selectedRecord.requestType}
              </div>
              <div className="info-row">
                <strong>Subject:</strong> {selectedRecord.subject}
              </div>
              <div className="info-row">
                <strong>Date:</strong> {selectedRecord.date}
              </div>
              {selectedRecord.time && (
                <div className="info-row">
                  <strong>Time:</strong> {selectedRecord.time}
                </div>
              )}
              <div className="info-row">
                <strong>Priority:</strong> {selectedRecord.priority}
              </div>
              <div className="info-row">
                <strong>Status:</strong> {selectedRecord.status}
              </div>
              <div className="info-row">
                <strong>Message:</strong>
                <p className="message-content">{selectedRecord.message || selectedRecord.description}</p>
              </div>
              {selectedRecord.response && (
                <div className="info-row">
                  <strong>Response:</strong>
                  <p className="response-content">{selectedRecord.response}</p>
                  <small>Responded on: {selectedRecord.responseDate}</small>
                </div>
              )}
            </div>
          </div>
        )}
      </PopUp>

      {/* Response Request Modal */}
      <PopUp
        isOpen={responseRequestModalOpen}
        onClose={() => setResponseRequestModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        {selectedRecord && (
          <div className="response-request">
            <h3>Respond to Request</h3>
            <div className="request-summary">
              <div className="summary-row">
                <strong>From:</strong> {selectedRecord.sender || selectedRecord.student}
              </div>
              <div className="summary-row">
                <strong>Subject:</strong> {selectedRecord.subject}
              </div>
              <div className="summary-row">
                <strong>Original Message:</strong>
                <p className="original-message">{selectedRecord.message || selectedRecord.description}</p>
              </div>
            </div>
            <div className="response-form">
              <label htmlFor="response-textarea">Your Response:</label>
              <textarea
                id="response-textarea"
                value={requestResponse}
                onChange={(e) => setRequestResponse(e.target.value)}
                placeholder="Type your response here..."
                rows={6}
                className="response-textarea"
              />
              <div className="response-actions">
                <button 
                  onClick={() => setResponseRequestModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmitResponse}
                  className="btn btn-primary"
                  disabled={!requestResponse.trim()}
                >
                  Send Response
                </button>
              </div>
            </div>
          </div>
        )}
      </PopUp>
    </div>
  );
};

export default GenericProfile;