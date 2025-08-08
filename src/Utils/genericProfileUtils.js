// profileUtils.js - Utilities and Configurations
import { 
  Book, 
  Users, 
  Award, 
  TrendingUp, 
  Clock, 
  Star, 
  FileText,
  GraduationCap,
  BookOpen,
  Calendar,
  User
} from "lucide-react";

// Profile configurations for different entity types
export const profileConfigs = {
  student: {
    sections: ["overview", "grades", "enrollments", "schedule", "resources"],
    sectionLabels: {
      overview: "Overview",
      grades: "Academic Records", 
      enrollments: "Enrollments",
      schedule: "Schedule",
      resources: "Resources"
    }
  },
  lecturer: {
    sections: ["overview", "courses", "requests", "schedule", "resources"],
    sectionLabels: {
      overview: "Overview",
      courses: "Courses",
      requests: "Requests", 
      schedule: "Schedule",
      resources: "Profile"
    }
  }
};

// Helper functions for file management
export const getFileInfo = (file) => {
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

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper function to convert numerical grade to letter grade
export const getLetterGrade = (numericGrade) => {
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

// Available courses for dropdowns (this could be fetched from API)
export const getAvailableCoursesOptions = () => [
  { value: 'CS101', label: 'CS101 - Introduction to Computer Science' },
  { value: 'CS201', label: 'CS201 - Data Structures' },
  { value: 'CS301', label: 'CS301 - Algorithms' },
  { value: 'MATH101', label: 'MATH101 - Calculus I' },
  { value: 'MATH201', label: 'MATH201 - Calculus II' },
  { value: 'PHYS101', label: 'PHYS101 - Physics I' },
  { value: 'ENG101', label: 'ENG101 - English Composition' }
];

// Form field configurations
export const getGradeFormFields = (enrolledCourses = []) => [
  { 
    name: 'courseCode', 
    label: 'Course', 
    type: 'select', 
    required: true, 
    options: enrolledCourses 
  },
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
  { 
    name: 'semester', 
    label: 'Semester', 
    type: 'select', 
    required: true, 
    options: getSemesterOptions()
  }
];

export const getEditGradeFormFields = () => [
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

export const getLecturerCourseFormFields = () => [
  { 
    name: 'courseCode', 
    label: 'Course to Assign', 
    type: 'select', 
    required: true, 
    options: getAvailableCoursesOptions() 
  },
  { 
    name: 'semester', 
    label: 'Semester', 
    type: 'select', 
    required: true, 
    options: getSemesterOptions()
  },
  { name: 'classSize', label: 'Expected Class Size', type: 'number', required: true, min: 1, max: 200 },
  { name: 'notes', label: 'Additional Notes', type: 'textarea', required: false }
];

export const getCourseFormFields = () => [
  { 
    name: 'courseCode', 
    label: 'Course Code', 
    type: 'text', 
    required: true, 
    pattern: '[A-Z]{2,4}[0-9]{3}', 
    placeholder: 'e.g., CS101' 
  },
  { name: 'courseName', label: 'Course Name', type: 'text', required: true },
  { name: 'credits', label: 'Credits', type: 'number', required: true, min: 1, max: 6 },
  { 
    name: 'semester', 
    label: 'Semester', 
    type: 'select', 
    required: true, 
    options: getSemesterOptions()
  },
  { name: 'department', label: 'Department', type: 'text', required: true },
  { name: 'description', label: 'Description', type: 'textarea', required: false }
];

export const getEnrollmentFormFields = () => [
  { 
    name: 'courseCode', 
    label: 'Course Code', 
    type: 'select', 
    required: true, 
    options: getAvailableCoursesOptions() 
  },
  { 
    name: 'semester', 
    label: 'Semester', 
    type: 'select', 
    required: true, 
    options: getSemesterOptions()
  },
  { name: 'instructor', label: 'Instructor', type: 'text', required: true },
  { 
    name: 'status', 
    label: 'Status', 
    type: 'select', 
    required: true, 
    options: [
      { value: 'enrolled', label: 'Enrolled' },
      { value: 'pending', label: 'Pending' },
      { value: 'dropped', label: 'Dropped' }
    ]
  }
];

export const getScheduleFormFields = () => [
  { 
    name: 'day', 
    label: 'Day', 
    type: 'select', 
    required: true, 
    options: [
      { value: 'Monday', label: 'Monday' },
      { value: 'Tuesday', label: 'Tuesday' },
      { value: 'Wednesday', label: 'Wednesday' },
      { value: 'Thursday', label: 'Thursday' },
      { value: 'Friday', label: 'Friday' },
      { value: 'Saturday', label: 'Saturday' }
    ]
  },
  { name: 'startTime', label: 'Start Time', type: 'time', required: true },
  { name: 'endTime', label: 'End Time', type: 'time', required: true },
  { 
    name: 'availability', 
    label: 'Availability Status', 
    type: 'select', 
    required: true, 
    options: [
      { value: 'available', label: 'Available' },
      { value: 'busy', label: 'Busy' },
      { value: 'preferred', label: 'Preferred Hours' }
    ]
  },
  { name: 'notes', label: 'Notes', type: 'textarea', required: false }
];

export const getResourceFormFields = (isEdit = false) => [
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
    required: !isEdit,
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

// Helper function to get semester options
export const getSemesterOptions = () => [
  { value: 'Fall 2024', label: 'Fall 2024' },
  { value: 'Spring 2025', label: 'Spring 2025' },
  { value: 'Summer 2025', label: 'Summer 2025' },
  { value: 'Fall 2025', label: 'Fall 2025' }
];

// Generate stat cards functions
export const generateWorkingHoursCards = () => [
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

export const generateProfileCards = () => [
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

// Column configurations for different table types
export const getColumnConfigs = (tableType) => {
  const configs = {
    'academic-records': {
      courseCode: { displayName: "Course Code", sortable: true },
      courseName: { displayName: "Course Name", sortable: true },
      grade: { displayName: "Grade (%)", sortable: true, type: "number" },
      letterGrade: { displayName: "Letter Grade", sortable: true, type: "status" },
      credits: { displayName: "Credits", sortable: true, type: "number" },
      semester: { displayName: "Semester", sortable: true }
    },
    'courses': {
      courseCode: { displayName: "Course Code", sortable: true },
      courseName: { displayName: "Course Name", sortable: true },
      credits: { displayName: "Credits", sortable: true, type: "number" },
      semester: { displayName: "Semester", sortable: true },
      department: { displayName: "Department", sortable: true },
      classSize: { displayName: "Class Size", sortable: true, type: "number" },
      status: { displayName: "Status", sortable: true, type: "status" }
    },
    'student-requests': {
      student: { displayName: "Student", sortable: true },
      sender: { displayName: "From", sortable: true },
      type: { displayName: "Type", sortable: true },
      requestType: { displayName: "Request Type", sortable: true },
      subject: { displayName: "Subject", sortable: true },
      date: { displayName: "Date", sortable: true, type: "date" },
      time: { displayName: "Time", sortable: true },
      priority: { displayName: "Priority", sortable: true, type: "status" },
      status: { displayName: "Status", sortable: true, type: "status" }
    },
    'enrollments': {
      courseCode: { displayName: "Course Code", sortable: true },
      courseName: { displayName: "Course Name", sortable: true },
      credits: { displayName: "Credits", sortable: true, type: "number" },
      semester: { displayName: "Semester", sortable: true },
      instructor: { displayName: "Instructor", sortable: true },
      status: { displayName: "Status", sortable: true, type: "status" }
    },
    'weekly-schedule': {
      day: { displayName: "Day", sortable: true },
      startTime: { displayName: "Start Time", sortable: true },
      endTime: { displayName: "End Time", sortable: true },
      availability: { displayName: "Status", sortable: true, type: "status" },
      notes: { displayName: "Notes", sortable: false }
    },
    'schedules': {
      courseCode: { displayName: "Course", sortable: true },
      day: { displayName: "Day", sortable: true },
      time: { displayName: "Time", sortable: true },
      room: { displayName: "Room", sortable: true },
      students: { displayName: "Students", sortable: true, type: "number" }
    },
    'documents': {
      title: { displayName: "Document Title", sortable: true },
      type: { displayName: "Type", sortable: true, type: "status" },
      institution: { displayName: "Institution", sortable: true },
      date: { displayName: "Date", sortable: true, type: "date" },
      downloads: { displayName: "Downloads", sortable: true, type: "number" },
      rating: { displayName: "Rating", sortable: true, type: "number" },
      size: { displayName: "Size", sortable: true }
    },
    'files': {
      title: { displayName: "Resource Title", sortable: true },
      type: { displayName: "Type", sortable: true },
      course: { displayName: "Course", sortable: true },
      uploadDate: { displayName: "Upload Date", sortable: true, type: "date" },
      size: { displayName: "Size", sortable: true },
      downloads: { displayName: "Downloads", sortable: true, type: "number" },
      rating: { displayName: "Rating", sortable: true, type: "number" }
    }
  };

  return configs[tableType] || {};
};

// Get hidden columns for different table types
export const getHiddenColumns = (tableType) => {
  const hiddenColumns = {
    'academic-records': ["id"],
    'courses': ["id", "notes"],
    'student-requests': ["id", "description", "message", "response", "responseDate"],
    'enrollments': ["id"],
    'weekly-schedule': ["id"],
    'schedules': ["id"],
    'documents': ["id", "description", "url", "tags", "uploadDate"],
    'files': ["id", "url", "description"]
  };

  return hiddenColumns[tableType] || ["id"];
};

// Utility functions for data processing
export const processScheduleData = (enrollments = []) => {
  const schedule = enrollments.map((enrollment, index) => ({
    id: index + 1,
    courseCode: enrollment.courseCode,
    day: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][index % 5],
    time: `${9 + index}:00 - ${10 + index}:00`,
    room: `Room ${100 + index}`,
    students: Math.floor(Math.random() * 30) + 15
  }));

  const summary = {
    weeklyHours: schedule.length,
    totalStudents: schedule.reduce((sum, item) => sum + item.students, 0),
    uniqueCourses: new Set(schedule.map(item => item.courseCode)).size,
    totalClasses: schedule.length
  };

  return { schedule, summary };
};

export const processResourcesData = (enrollments = []) => {
  const courseMaterials = enrollments.map((enrollment, index) => ({
    id: index + 1,
    title: `${enrollment.courseName} - Course Materials`,
    type: 'Course Material',
    course: enrollment.courseCode,
    uploadDate: '2024-01-15',
    size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
    downloads: Math.floor(Math.random() * 50) + 10,
    rating: (Math.random() * 1 + 4).toFixed(1),
    url: '#'
  }));

  return { courseMaterials };
};

// Error handling utilities
export const handleAPIError = (error, defaultMessage = 'An error occurred') => {
  console.error('API Error:', error);
  
  if (error.message) {
    return error.message;
  }
  
  if (error.response) {
    return error.response.data?.message || defaultMessage;
  }
  
  return defaultMessage;
};

// Validation utilities
export const validateGrade = (grade) => {
  const numericGrade = parseFloat(grade);
  return !isNaN(numericGrade) && numericGrade >= 0 && numericGrade <= 100;
};

export const validateTimeRange = (startTime, endTime) => {
  return startTime < endTime;
};

export const validateFileSize = (file, maxSizeMB = 10) => {
  return file.size <= maxSizeMB * 1024 * 1024;
};

export const validateFileType = (file, allowedTypes = ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png', '.ppt', '.pptx']) => {
  const extension = '.' + file.name.split('.').pop().toLowerCase();
  return allowedTypes.includes(extension);
};

// Export default object with all utilities
export default {
  profileConfigs,
  getFileInfo,
  formatFileSize,
  getLetterGrade,
  getAvailableCoursesOptions,
  getGradeFormFields,
  getEditGradeFormFields,
  getLecturerCourseFormFields,
  getCourseFormFields,
  getEnrollmentFormFields,
  getScheduleFormFields,
  getResourceFormFields,
  getSemesterOptions,
  generateWorkingHoursCards,
  generateProfileCards,
  getColumnConfigs,
  getHiddenColumns,
  processScheduleData,
  processResourcesData,
  handleAPIError,
  validateGrade,
  validateTimeRange,
  validateFileSize,
  validateFileType
};