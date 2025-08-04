import { useState } from "react";
import { 
  Eye, 
  Reply, 
  Edit, 
  Download, 
  Trash2, 
  Plus, 
  ExternalLink,
  FileText,
  Image,
  Archive,
  File,
  Music,
  Video,
  Code,
  BookOpen
} from "lucide-react";

// Components
import MidPageNavbar from "../../Components/CoursePage/Content/MidPageNavBar";
import Table from "../../Components/Tables/Table";
import Modal from "../../Components/Modal/Modal.jsx";
import PopUp from "../../Components/Cards/PopUp.jsx";
import DynamicForm from "../../Components/Forms/dynamicForm.jsx";

// Static Data
import {
  messagesData,
  getFullMessageById,
  announcementsData,
  fullAnnouncementsData,
  getFullAnnouncementById,
  targetAudienceOptions,
  priorityOptions,
  templatesData,
  fullTemplatesData,
  getFullTemplateById,
  templateCategoryOptions,
  templateTargetAudienceOptions,
  templateStatusOptions,
} from "../../../Static/messagesData.js";
import {
  templateFormFields,
  announcementFormFields,
} from "../../../Static/FIxed/formsInputs.js";

// Styles
import "../../../CSS/Pages/Messages/messages.css";

// Sample files data - you can replace this with your actual data source
const filesData = [
  {
    id: 1,
    name: "Course_Syllabus_2024.pdf",
    type: "PDF",
    size: "2.5 MB",
    category: "Academic",
    uploadedBy: "Dr. Smith",
    uploadDate: "2024-08-01",
    status: "Active",
    description: "Computer Science course syllabus for 2024"
  },
  {
    id: 2,
    name: "Assignment_Guidelines.docx",
    type: "Word Document",
    size: "1.2 MB",
    category: "Academic",
    uploadedBy: "Prof. Johnson",
    uploadDate: "2024-07-28",
    status: "Active",
    description: "Guidelines for semester assignments"
  },
  {
    id: 3,
    name: "Student_Handbook.pdf",
    type: "PDF",
    size: "4.8 MB",
    category: "Administrative",
    uploadedBy: "Admin Office",
    uploadDate: "2024-07-25",
    status: "Active",
    description: "Complete student handbook for academic year 2024"
  }
];

const fullFilesData = [
  {
    id: 1,
    name: "Course_Syllabus_2024.pdf",
    type: "PDF",
    size: "2.5 MB",
    category: "Academic",
    uploadedBy: "Dr. Smith",
    uploadDate: "2024-08-01",
    uploadTime: "14:30",
    status: "Active",
    description: "Computer Science course syllabus for 2024",
    downloadCount: 45,
    lastAccessed: "2024-08-02",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    tags: ["syllabus", "computer-science", "2024"],
    accessType: "students",
    accessBy: "Academic Year",
    accessValue: "1st Year"
  },
  {
    id: 2,
    name: "Assignment_Guidelines.docx",
    type: "Word Document",
    size: "1.2 MB",
    category: "Academic",
    uploadedBy: "Prof. Johnson",
    uploadDate: "2024-07-28",
    uploadTime: "10:15",
    status: "Active",
    description: "Guidelines for semester assignments",
    downloadCount: 23,
    lastAccessed: "2024-08-01",
    fileUrl: "https://file-examples.com/storage/fe86259b0f4760c8da36c0a/2017/10/file_example_DOC_100kB.doc",
    tags: ["assignment", "guidelines"],
    accessType: "lecturers",
    accessBy: "Department",
    accessValue: "Computer Science"
  },
  {
    id: 3,
    name: "Student_Handbook.pdf",
    type: "PDF",
    size: "4.8 MB",
    category: "Administrative",
    uploadedBy: "Admin Office",
    uploadDate: "2024-07-25",
    uploadTime: "09:00",
    status: "Active",
    description: "Complete student handbook for academic year 2024",
    downloadCount: 78,
    lastAccessed: "2024-08-03",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    tags: ["handbook", "administrative", "student-info"],
    accessType: "public",
    accessBy: "all",
    accessValue: "all-users"
  }
];

// File form fields configuration
const fileFormFields = [
  {
    name: "name",
    label: "File Name",
    type: "text",
    required: true,
    placeholder: "Enter file name"
  },
  {
    name: "file",
    label: "File",
    type: "file",
    required: true,
    accept: ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.zip,.rar",
    helperText: "Supported formats: PDF, Word, Excel, PowerPoint, Images, Archives"
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    required: true,
    placeholder: "Enter file description",
    rows: 3
  },
  {
    name: "category",
    label: "Category",
    type: "select",
    required: true,
    options: [
      { value: "Academic", label: "Academic" },
      { value: "Administrative", label: "Administrative" },
      { value: "Resources", label: "Resources" },
      { value: "Assignments", label: "Assignments" },
      { value: "Exams", label: "Exams" },
      { value: "Other", label: "Other" }
    ]
  },
  {
    name: "accessType",
    label: "Access Control",
    type: "select",
    required: true,
    options: [
      { value: "students", label: "Students" },
      { value: "lecturers", label: "Lecturers" },
      { value: "public", label: "Public Access" }
    ]
  },
  {
    name: "accessBy",
    label: "Access By",
    type: "select",
    required: true,
    options: [
      // These will be populated dynamically based on accessType
    ]
  },
  {
    name: "accessValue",
    label: "Access Assignment",
    type: "select",
    required: true,
    options: [
      // These will be populated dynamically based on accessBy
    ]
  }
];

// Utility function to get file icon based on type
const getFileIcon = (fileName, fileType) => {
  const extension = fileName?.split('.').pop()?.toLowerCase();
  
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension)) {
    return Image;
  } else if (['pdf'].includes(extension)) {
    return FileText;
  } else if (['doc', 'docx'].includes(extension)) {
    return BookOpen;
  } else if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
    return Archive;
  } else if (['mp3', 'wav', 'flac', 'aac'].includes(extension)) {
    return Music;
  } else if (['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(extension)) {
    return Video;
  } else if (['js', 'html', 'css', 'php', 'py', 'java', 'cpp'].includes(extension)) {
    return Code;
  }
  
  return File;
};

const Messages = () => {
  // Main navigation state
  const [activeSection, setActiveSection] = useState("requests");
  const [selectedYear, setSelectedYear] = useState("");

  // Message states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");

  // Announcement states
  const [createAnnouncementModalOpen, setCreateAnnouncementModalOpen] = useState(false);
  const [editAnnouncementModalOpen, setEditAnnouncementModalOpen] = useState(false);
  const [viewAnnouncementModalOpen, setViewAnnouncementModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [announcementFormData, setAnnouncementFormData] = useState({});
  const [currentAnnouncements, setCurrentAnnouncements] = useState(announcementsData);
  const [currentFullAnnouncements, setCurrentFullAnnouncements] = useState(fullAnnouncementsData);

  // Template states
  const [createTemplateModalOpen, setCreateTemplateModalOpen] = useState(false);
  const [editTemplateModalOpen, setEditTemplateModalOpen] = useState(false);
  const [viewTemplateModalOpen, setViewTemplateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateFormData, setTemplateFormData] = useState({});
  const [currentTemplates, setCurrentTemplates] = useState(templatesData);
  const [currentFullTemplates, setCurrentFullTemplates] = useState(fullTemplatesData);
  const [useTemplateModalOpen, setUseTemplateModalOpen] = useState(false);
  const [useTemplateFields, setUseTemplateFields] = useState([]);
  const [useTemplateFormTitle, setUseTemplateFormTitle] = useState("");

  // Files states
  const [uploadFileModalOpen, setUploadFileModalOpen] = useState(false);
  const [editFileModalOpen, setEditFileModalOpen] = useState(false);
  const [viewFileModalOpen, setViewFileModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileFormData, setFileFormData] = useState({});
  const [currentFiles, setCurrentFiles] = useState(filesData);
  const [currentFullFiles, setCurrentFullFiles] = useState(fullFilesData);
  const [dynamicFileFormFields, setDynamicFileFormFields] = useState(fileFormFields);

  // Access control options with hierarchical structure
  const accessControlOptions = {
    students: {
      "Academic Year": [
        { value: "1st Year", label: "1st Year" },
        { value: "2nd Year", label: "2nd Year" },
        { value: "3rd Year", label: "3rd Year" },
        { value: "4th Year", label: "4th Year" },
        { value: "Graduate", label: "Graduate" }
      ],
      "Student Status": [
        { value: "Active", label: "Active Students" },
        { value: "Inactive", label: "Inactive Students" },
        { value: "Graduated", label: "Graduated Students" }
      ],
      "Department": [
        { value: "Computer Science", label: "Computer Science" },
        { value: "Engineering", label: "Engineering" },
        { value: "Business", label: "Business" },
        { value: "Medicine", label: "Medicine" },
        { value: "Arts", label: "Arts" },
        { value: "Science", label: "Science" }
      ]
    },
    lecturers: {
      "Department": [
        { value: "Computer Science", label: "Computer Science" },
        { value: "Engineering", label: "Engineering" },
        { value: "Business", label: "Business" },
        { value: "Medicine", label: "Medicine" },
        { value: "Arts", label: "Arts" },
        { value: "Science", label: "Science" }
      ],
      "Employment Type": [
        { value: "Full-time", label: "Full-time Lecturers" },
        { value: "Part-time", label: "Part-time Lecturers" }
      ]
    }
  };

  // Enhanced styling with modern design
  const styles = {
    viewModalContainer: {
      lineHeight: '1.6',
      color: '#374151'
    },
    viewModalInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '16px',
      padding: '12px 16px',
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      border: '1px solid #e2e8f0'
    },
    viewModalLabel: {
      fontWeight: '600',
      color: '#64748b',
      minWidth: '120px',
      fontSize: '14px'
    },
    viewModalValue: {
      color: '#1e293b',
      fontWeight: '500'
    },
    priorityHigh: {
      color: '#dc2626',
      fontWeight: '700',
      textTransform: 'uppercase',
      fontSize: '12px',
      padding: '4px 8px',
      backgroundColor: '#fee2e2',
      borderRadius: '6px'
    },
    priorityMedium: {
      color: '#d97706',
      fontWeight: '700',
      textTransform: 'uppercase',
      fontSize: '12px',
      padding: '4px 8px',
      backgroundColor: '#fef3c7',
      borderRadius: '6px'
    },
    priorityLow: {
      color: '#059669',
      fontWeight: '700',
      textTransform: 'uppercase',
      fontSize: '12px',
      padding: '4px 8px',
      backgroundColor: '#d1fae5',
      borderRadius: '6px'
    },
    viewModalContentBox: {
      marginTop: '20px',
      padding: '20px',
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      whiteSpace: 'pre-wrap',
      fontSize: '14px',
      lineHeight: '1.6'
    },
    originalMsgBox: {
      padding: '20px',
      backgroundColor: '#eff6ff',
      borderRadius: '12px',
      border: '1px solid #bfdbfe',
      marginBottom: '24px'
    },
    originalMsgText: {
      fontSize: '14px',
      color: '#374151',
      whiteSpace: 'pre-wrap',
      marginTop: '12px'
    },
    replyLabel: {
      display: 'block',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '12px',
      fontSize: '15px'
    },
    replyTextarea: {
      width: '100%',
      minHeight: '120px',
      padding: '16px',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '14px',
      fontFamily: 'inherit',
      resize: 'vertical',
      outline: 'none',
      transition: 'all 0.2s ease',
      backgroundColor: '#ffffff'
    },
    replyFooter: {
      display: 'flex',
      gap: '16px',
      justifyContent: 'flex-end',
      paddingTop: '20px'
    },
    replyCancelBtn: {
      padding: '12px 24px',
      border: '2px solid #e2e8f0',
      borderRadius: '10px',
      backgroundColor: '#ffffff',
      color: '#64748b',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    replySendBtn: {
      padding: '12px 24px',
      border: 'none',
      borderRadius: '10px',
      backgroundColor: '#3b82f6',
      color: 'white',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    actionBtn: {
      padding: '8px 16px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '13px',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    viewBtn: {
      backgroundColor: '#6366f1',
      color: 'white'
    },
    viewBtnMessages: {
      backgroundColor: '#0ea5e9',
      color: 'white'
    },
    replyBtnMessages: {
      backgroundColor: '#10b981',
      color: 'white'
    },
    editBtn: {
      backgroundColor: '#f59e0b',
      color: 'white'
    },
    downloadBtn: {
      backgroundColor: '#10b981',
      color: 'white'
    },
    deleteBtn: {
      backgroundColor: '#ef4444',
      color: 'white'
    },
    replyBtn: {
      backgroundColor: '#8b5cf6',
      color: 'white'
    },
    useBtn: {
      backgroundColor: '#06b6d4',
      color: 'white'
    },
    tagContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginTop: '12px'
    },
    tag: {
      padding: '6px 12px',
      backgroundColor: '#e0e7ff',
      color: '#3730a3',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600'
    },
    fileIcon: {
      marginRight: '8px',
      color: '#6366f1'
    }
  };

  // Message handlers (existing code remains the same)
  const handleViewMessage = (row) => {
    const fullMessage = getFullMessageById(row.id);
    setSelectedMessage(fullMessage);
    setViewModalOpen(true);
  };

  const handleReply = (row) => {
    const fullMessage = getFullMessageById(row.id);
    setSelectedMessage(fullMessage);
    setReplyText("");
    setReplyModalOpen(true);
  };

  const handleSendReply = () => {
    if (!replyText.trim()) {
      alert("Please enter a reply message");
      return;
    }
    
    console.log("Sending reply:", {
      to: selectedMessage?.sender,
      originalSubject: selectedMessage?.subject,
      replyText: replyText
    });
    
    alert("Reply sent successfully!");
    setReplyModalOpen(false);
    setReplyText("");
    setSelectedMessage(null);
  };

  // Announcement handlers (existing code remains the same)
  const handleCreateAnnouncement = () => {
    setSelectedAnnouncement(null);
    setAnnouncementFormData({});
    setCreateAnnouncementModalOpen(true);
  };

  const handleViewAnnouncement = (row) => {
    const fullAnnouncement = currentFullAnnouncements.find((a) => a.id === row.id);
    if (fullAnnouncement) {
      setSelectedAnnouncement(fullAnnouncement);
      setViewAnnouncementModalOpen(true);
    } else {
      console.error("Announcement not found:", row.id);
    }
  };

  const handleEditAnnouncement = (row) => {
    const fullAnnouncement = currentFullAnnouncements.find((a) => a.id === row.id);
    if (fullAnnouncement) {
      setSelectedAnnouncement(fullAnnouncement);
      const formData = {
        title: fullAnnouncement.title,
        content: fullAnnouncement.content,
        targetAudienceType: fullAnnouncement.targetAudienceType,
        priority: fullAnnouncement.priority,
        expiryDate: fullAnnouncement.expiryDate,
        scheduledDate: fullAnnouncement.scheduledDate || "",
      };
      setAnnouncementFormData(formData);
      setEditAnnouncementModalOpen(true);
    } else {
      console.error("Announcement not found for editing:", row.id);
    }
  };

  const handleAnnouncementSubmit = (formData) => {
    console.log("Announcement submitted:", formData);

    if (selectedAnnouncement) {
      // Edit existing announcement
      const updatedFullAnnouncement = {
        ...selectedAnnouncement,
        title: formData.title,
        content: formData.content,
        targetAudience: targetAudienceOptions.find((opt) => opt.value === formData.targetAudienceType)?.label || formData.targetAudienceType,
        targetAudienceType: formData.targetAudienceType,
        priority: formData.priority,
        expiryDate: formData.expiryDate,
        scheduledDate: formData.scheduledDate || null,
        status: formData.scheduledDate ? "scheduled" : "active",
      };

      setCurrentFullAnnouncements((prev) =>
        prev.map((announcement) =>
          announcement.id === selectedAnnouncement.id ? updatedFullAnnouncement : announcement
        )
      );

      setCurrentAnnouncements((prev) =>
        prev.map((announcement) =>
          announcement.id === selectedAnnouncement.id
            ? {
                id: announcement.id,
                title: formData.title,
                targetAudience: targetAudienceOptions.find((opt) => opt.value === formData.targetAudienceType)?.label || formData.targetAudienceType,
                priority: formData.priority,
                status: formData.scheduledDate ? "scheduled" : "active",
                createdDate: announcement.createdDate,
              }
            : announcement
        )
      );
      setEditAnnouncementModalOpen(false);
    } else {
      // Create new announcement
      const newId = Math.max(...currentAnnouncements.map((a) => a.id)) + 1;
      const currentDate = new Date().toISOString().split("T")[0];
      const currentTime = new Date().toTimeString().split(" ")[0].substring(0, 5);

      const newFullAnnouncement = {
        id: newId,
        title: formData.title,
        content: formData.content,
        targetAudience: targetAudienceOptions.find((opt) => opt.value === formData.targetAudienceType)?.label || formData.targetAudienceType,
        targetAudienceType: formData.targetAudienceType,
        priority: formData.priority,
        status: formData.scheduledDate ? "scheduled" : "active",
        createdDate: currentDate,
        createdTime: currentTime,
        expiryDate: formData.expiryDate,
        scheduledDate: formData.scheduledDate || null,
      };

      const newTableAnnouncement = {
        id: newId,
        title: formData.title,
        targetAudience: targetAudienceOptions.find((opt) => opt.value === formData.targetAudienceType)?.label || formData.targetAudienceType,
        priority: formData.priority,
        status: formData.scheduledDate ? "scheduled" : "active",
        createdDate: currentDate,
      };

      setCurrentFullAnnouncements((prev) => [newFullAnnouncement, ...prev]);
      setCurrentAnnouncements((prev) => [newTableAnnouncement, ...prev]);
      setCreateAnnouncementModalOpen(false);
    }

    setAnnouncementFormData({});
    setSelectedAnnouncement(null);
  };

  // Template handlers (existing code remains the same)
  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setTemplateFormData({});
    setCreateTemplateModalOpen(true);
  };

  const handleViewTemplate = (row) => {
    const fullTemplate = currentFullTemplates.find((t) => t.id === row.id);
    if (fullTemplate) {
      setSelectedTemplate(fullTemplate);
      setViewTemplateModalOpen(true);
    }
  };

  const handleEditTemplate = (row) => {
    const fullTemplate = currentFullTemplates.find((t) => t.id === row.id);
    if (fullTemplate) {
      setSelectedTemplate(fullTemplate);
      const formData = {
        name: fullTemplate.name,
        category: fullTemplate.category,
        subject: fullTemplate.subject,
        content: fullTemplate.content,
        variables: fullTemplate.variables.join(", "),
        targetAudience: fullTemplate.targetAudience,
        status: fullTemplate.status,
      };
      setTemplateFormData(formData);
      setEditTemplateModalOpen(true);
    }
  };

  const handleTemplateSubmit = (formData) => {
    const variablesArray = formData.variables
      ? formData.variables.split(",").map((v) => v.trim()).filter((v) => v)
      : [];

    if (selectedTemplate) {
      // Edit existing template
      const updatedFullTemplate = {
        ...selectedTemplate,
        name: formData.name,
        category: formData.category,
        subject: formData.subject,
        content: formData.content,
        variables: variablesArray,
        targetAudience: formData.targetAudience,
        status: formData.status,
        lastModified: new Date().toISOString().split("T")[0],
      };

      setCurrentFullTemplates((prev) =>
        prev.map((template) =>
          template.id === selectedTemplate.id ? updatedFullTemplate : template
        )
      );

      setCurrentTemplates((prev) =>
        prev.map((template) =>
          template.id === selectedTemplate.id
            ? {
                id: template.id,
                name: formData.name,
                category: formData.category,
                targetAudience: formData.targetAudience,
                status: formData.status,
                lastModified: new Date().toISOString().split("T")[0],
              }
            : template
        )
      );
      setEditTemplateModalOpen(false);
    } else {
      // Create new template
      const newId = Math.max(...currentTemplates.map((t) => t.id)) + 1;
      const currentDate = new Date().toISOString().split("T")[0];

      const newFullTemplate = {
        id: newId,
        name: formData.name,
        category: formData.category,
        subject: formData.subject,
        content: formData.content,
        variables: variablesArray,
        targetAudience: formData.targetAudience,
        createdDate: currentDate,
        lastModified: currentDate,
        status: formData.status,
      };

      const newTableTemplate = {
        id: newId,
        name: formData.name,
        category: formData.category,
        targetAudience: formData.targetAudience,
        status: formData.status,
        lastModified: currentDate,
      };

      setCurrentFullTemplates((prev) => [newFullTemplate, ...prev]);
      setCurrentTemplates((prev) => [newTableTemplate, ...prev]);
      setCreateTemplateModalOpen(false);
    }

    setTemplateFormData({});
    setSelectedTemplate(null);
  };

  const handleUseTemplate = (row) => {
    const fullTemplate = currentFullTemplates.find((t) => t.id === row.id);
    if (!fullTemplate) return;

    const content = fullTemplate.content;

    // Extract variables in {curlyBraces}
    const variableMatches = content.match(/\{([^}]+)\}/g) || [];
    const uniqueVariables = [...new Set(variableMatches.map((v) => v.replace(/[{}]/g, "").trim()))];

    // Convert to form field config expected by DynamicForm
    const dynamicFields = uniqueVariables.map((variable) => ({
      name: variable,
      label: variable.charAt(0).toUpperCase() + variable.slice(1),
      placeholder: variable.charAt(0).toUpperCase() + variable.slice(1),
      type: "text",
      required: true,
    }));

    setUseTemplateFormTitle(fullTemplate.name);
    setUseTemplateFields(dynamicFields);
    setUseTemplateModalOpen(true);
  };

  const handleUseTemplateSubmit = (data) => {
    console.log("Template used with data:", data);
    alert("Template processed successfully!");
    setUseTemplateModalOpen(false);
  };

  const handleUploadFile = () => {
    setSelectedFile(null);
    
    // Initialize form data with default values
    const initialFormData = {
      name: '',
      description: '',
      category: '',
      accessType: '',
      accessBy: '',
      accessValue: ''
    };
    setFileFormData(initialFormData);
    
    // Reset dynamic form fields to default
    const resetFields = [...fileFormFields].map(field => {
      if (field.name === 'accessBy') {
        return {
          ...field,
          options: [],
          placeholder: 'Select access type first'
        };
      } else if (field.name === 'accessValue') {
        return {
          ...field,
          options: [],
          placeholder: 'Select access category first'
        };
      }
      return field;
    });
    setDynamicFileFormFields(resetFields);
    
    setUploadFileModalOpen(true);
  };

  const handleFileFieldChange = (fieldName, fieldValue, formData) => {
    console.log("Field changed:", fieldName, "Value:", fieldValue);
    
    if (fieldName === 'accessType') {
      // Update both accessBy and accessValue fields based on accessType selection
      const updatedFields = [...fileFormFields].map(field => {
        if (field.name === 'accessBy') {
          let options = [];
          let placeholder = 'Select access category';
          
          if (fieldValue === 'students') {
            options = Object.keys(accessControlOptions.students).map(key => ({
              value: key,
              label: key
            }));
          } else if (fieldValue === 'lecturers') {
            options = Object.keys(accessControlOptions.lecturers).map(key => ({
              value: key,
              label: key
            }));
          } else if (fieldValue === 'public') {
            options = [{ value: 'all', label: 'All Users' }];
            placeholder = 'Auto-assigned to all users';
          }
          
          return {
            ...field,
            options: options,
            required: true,
            placeholder: placeholder
          };
        } else if (field.name === 'accessValue') {
          return {
            ...field,
            options: [],
            required: true,
            placeholder: 'Select access category first'
          };
        }
        return field;
      });
      
      setDynamicFileFormFields(updatedFields);
      
      // Reset both accessBy and accessValue when accessType changes
      if (formData) {
        const newFormData = { ...formData };
        if (fieldValue === 'public') {
          newFormData.accessBy = 'all';
          newFormData.accessValue = 'all-users';
        } else {
          newFormData.accessBy = '';
          newFormData.accessValue = '';
        }
        setFileFormData(newFormData);
      }
    } else if (fieldName === 'accessBy') {
      // Update accessValue field based on accessBy selection
      const accessType = formData?.accessType;
      
      const updatedFields = [...dynamicFileFormFields].map(field => {
        if (field.name === 'accessValue') {
          let options = [];
          let placeholder = 'Select specific assignment';
          
          if (accessType === 'students' && accessControlOptions.students[fieldValue]) {
            options = accessControlOptions.students[fieldValue];
          } else if (accessType === 'lecturers' && accessControlOptions.lecturers[fieldValue]) {
            options = accessControlOptions.lecturers[fieldValue];
          } else if (accessType === 'public') {
            options = [{ value: 'all-users', label: 'All Users' }];
            placeholder = 'Auto-assigned to all users';
          }
          
          return {
            ...field,
            options: options,
            required: true,
            placeholder: placeholder
          };
        }
        return field;
      });
      
      setDynamicFileFormFields(updatedFields);
      
      // Reset accessValue when accessBy changes
      if (formData) {
        const newFormData = { ...formData };
        if (accessType === 'public') {
          newFormData.accessValue = 'all-users';
        } else {
          newFormData.accessValue = '';
        }
        setFileFormData(newFormData);
      }
    }
  };

  const handleViewFile = (row) => {
    const fullFile = currentFullFiles.find((f) => f.id === row.id);
    if (fullFile && fullFile.fileUrl) {
      // Open file in new tab
      window.open(fullFile.fileUrl, '_blank');
      
      // Update last accessed date
      setCurrentFullFiles((prev) =>
        prev.map((file) =>
          file.id === row.id
            ? { ...file, lastAccessed: new Date().toISOString().split("T")[0] }
            : file
        )
      );
    } else {
      alert("File URL not available");
    }
  };

  const handleViewFileDetails = (row) => {
    const fullFile = currentFullFiles.find((f) => f.id === row.id);
    if (fullFile) {
      setSelectedFile(fullFile);
      setViewFileModalOpen(true);
    }
  };

  const handleEditFile = (row) => {
    const fullFile = currentFullFiles.find((f) => f.id === row.id);
    if (fullFile) {
      setSelectedFile(fullFile);
      
      // Prepare form data with existing values
      const formData = {
        name: fullFile.name,
        description: fullFile.description,
        category: fullFile.category,
        accessType: fullFile.accessType || 'public',
        accessBy: fullFile.accessBy || 'all',
        accessValue: fullFile.accessValue || 'all-users'
      };
      setFileFormData(formData);
      
      // Update dynamic fields based on existing accessType and accessBy
      const updatedFields = [...fileFormFields].map(field => {
        if (field.name === 'accessBy') {
          let options = [];
          let placeholder = 'Select access category';
          
          if (formData.accessType === 'students') {
            options = Object.keys(accessControlOptions.students).map(key => ({
              value: key,
              label: key
            }));
          } else if (formData.accessType === 'lecturers') {
            options = Object.keys(accessControlOptions.lecturers).map(key => ({
              value: key,
              label: key
            }));
          } else if (formData.accessType === 'public') {
            options = [{ value: 'all', label: 'All Users' }];
            placeholder = 'Auto-assigned to all users';
          }
          
          return {
            ...field,
            options: options,
            required: true,
            placeholder: placeholder
          };
        } else if (field.name === 'accessValue') {
          let options = [];
          let placeholder = 'Select specific assignment';
          
          if (formData.accessType === 'students' && accessControlOptions.students[formData.accessBy]) {
            options = accessControlOptions.students[formData.accessBy];
          } else if (formData.accessType === 'lecturers' && accessControlOptions.lecturers[formData.accessBy]) {
            options = accessControlOptions.lecturers[formData.accessBy];
          } else if (formData.accessType === 'public') {
            options = [{ value: 'all-users', label: 'All Users' }];
            placeholder = 'Auto-assigned to all users';
          }
          
          return {
            ...field,
            options: options,
            required: true,
            placeholder: placeholder
          };
        }
        return field;
      });
      
      setDynamicFileFormFields(updatedFields);
      setEditFileModalOpen(true);
    }
  };

  const handleDownloadFile = (row) => {
    const fullFile = currentFullFiles.find((f) => f.id === row.id);
    if (fullFile && fullFile.fileUrl) {
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = fullFile.fileUrl;
      link.download = fullFile.name;
      link.target = '_blank';
      
      // For cross-origin files, this might not work as expected
      // In a real application, you'd have a backend endpoint for file downloads
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Update download count
      setCurrentFullFiles((prev) =>
        prev.map((file) =>
          file.id === row.id
            ? { ...file, downloadCount: file.downloadCount + 1, lastAccessed: new Date().toISOString().split("T")[0] }
            : file
        )
      );
      
      console.log("Downloading file:", fullFile.name);
    } else {
      alert("File URL not available for download");
    }
  };

  const handleDeleteFile = (row) => {
    if (window.confirm(`Are you sure you want to delete "${row.name}"?`)) {
      setCurrentFiles((prev) => prev.filter((file) => file.id !== row.id));
      setCurrentFullFiles((prev) => prev.filter((file) => file.id !== row.id));
      alert("File deleted successfully!");
    }
  };

  const handleFileSubmit = (formData) => {
    console.log("File submitted:", formData);

    // Validate required fields
    if (!formData.accessType || !formData.accessBy || !formData.accessValue) {
      alert("Please complete all access control fields");
      return;
    }

    // Get file size and type from the uploaded file
    const file = formData.file;
    const fileSize = file ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : "0 MB";
    const fileType = file ? file.type || "Unknown" : "Unknown";
    const currentDate = new Date().toISOString().split("T")[0];
    const currentTime = new Date().toTimeString().split(" ")[0].substring(0, 5);

    // Handle access control - normalize the access value
    let accessValue = formData.accessValue;
    let accessBy = formData.accessBy;
    if (formData.accessType === 'public') {
      accessBy = 'all';
      accessValue = 'all-users';
    }

    if (selectedFile) {
      // Edit existing file
      const updatedFullFile = {
        ...selectedFile,
        name: formData.name,
        description: formData.description,
        category: formData.category,
        accessType: formData.accessType,
        accessBy: accessBy,
        accessValue: accessValue,
        // Only update file-related properties if a new file was uploaded
        ...(file && {
          type: fileType,
          size: fileSize,
          fileUrl: URL.createObjectURL(file), // Create object URL for demo
        }),
      };

      setCurrentFullFiles((prev) =>
        prev.map((fileItem) =>
          fileItem.id === selectedFile.id ? updatedFullFile : fileItem
        )
      );

      setCurrentFiles((prev) =>
        prev.map((fileItem) =>
          fileItem.id === selectedFile.id
            ? {
                id: fileItem.id,
                name: formData.name,
                type: file ? fileType : fileItem.type,
                size: file ? fileSize : fileItem.size,
                category: formData.category,
                uploadedBy: fileItem.uploadedBy,
                uploadDate: fileItem.uploadDate,
                status: fileItem.status,
                description: formData.description,
              }
            : fileItem
        )
      );
      setEditFileModalOpen(false);
      alert("File updated successfully!");
    } else {
      // Create new file - file is required for new uploads
      if (!file) {
        alert("Please select a file to upload");
        return;
      }

      const newId = Math.max(...currentFiles.map((f) => f.id), 0) + 1;

      const newFullFile = {
        id: newId,
        name: formData.name,
        type: fileType,
        size: fileSize,
        category: formData.category,
        uploadedBy: "Current User", // Replace with actual user
        uploadDate: currentDate,
        uploadTime: currentTime,
        status: "Active",
        description: formData.description,
        downloadCount: 0,
        lastAccessed: currentDate,
        fileUrl: URL.createObjectURL(file), // Create object URL for demo
        tags: [], // Initialize empty tags array
        accessType: formData.accessType,
        accessBy: accessBy,
        accessValue: accessValue,
      };

      const newTableFile = {
        id: newId,
        name: formData.name,
        type: fileType,
        size: fileSize,
        category: formData.category,
        uploadedBy: "Current User",
        uploadDate: currentDate,
        status: "Active",
        description: formData.description,
      };

      setCurrentFullFiles((prev) => [newFullFile, ...prev]);
      setCurrentFiles((prev) => [newTableFile, ...prev]);
      setUploadFileModalOpen(false);
      alert("File uploaded successfully!");
    }

    // Reset form state
    setFileFormData({});
    setSelectedFile(null);
    setDynamicFileFormFields(fileFormFields); // Reset form fields
  };

  // Section rendering
  const renderSection = () => {
    switch (activeSection) {
      case "requests":
        return (
          <Table
            title="Messages"
            entityType="requests"
            showAddButton={false}
            data={messagesData}
            actionButtons={[
              (row) => (
                <button 
                  onClick={() => handleViewMessage(row)} 
                  style={{...styles.actionBtn, ...styles.viewBtnMessages}}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  <Eye size={16} />
                  View
                </button>
              ),
              (row) => (
                <button 
                  onClick={() => handleReply(row)} 
                  style={{...styles.actionBtn, ...styles.replyBtnMessages}}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  <Reply size={16} />
                  Reply
                </button>
              ),
            ]}
          />
        );
      case "announcement":
        return (
          <Table
            title="Announcements"
            entityType="announcements"
            data={currentAnnouncements}
            showAddButton={true}
            addButtonText="Create Announcement"
            onAddClick={handleCreateAnnouncement}
            actionButtons={[
              (row) => (
                <button 
                  onClick={() => handleViewAnnouncement(row)} 
                  style={{...styles.actionBtn, ...styles.viewBtn}}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  <Eye size={16} />
                  View
                </button>
              ),
              (row) => (
                <button 
                  onClick={() => handleEditAnnouncement(row)} 
                  style={{...styles.actionBtn, ...styles.editBtn}}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  <Edit size={16} />
                  Edit
                </button>
              ),
            ]}
          />
        );
      case "templates":
        return (
          <Table
            title="Templates"
            entityType="templates"
            data={currentTemplates}
            showAddButton={true}
            addButtonText="Create Template"
            onAddClick={handleCreateTemplate}
            actionButtons={[
              (row) => (
                <button 
                  onClick={() => handleUseTemplate(row)} 
                  style={{...styles.actionBtn, ...styles.useBtn}}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  <Plus size={16} />
                  Use
                </button>
              ),
              (row) => (
                <button 
                  onClick={() => handleViewTemplate(row)} 
                  style={{...styles.actionBtn, ...styles.viewBtn}}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  <Eye size={16} />
                  View
                </button>
              ),
              (row) => (
                <button 
                  onClick={() => handleEditTemplate(row)} 
                  style={{...styles.actionBtn, ...styles.editBtn}}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  <Edit size={16} />
                  Edit
                </button>
              ),
            ]}
          />
        );
      case "files":
        return (
          <Table
            title="Files"
            entityType="files"
            data={currentFiles}
            showAddButton={true}
            addButtonText="Upload File"
            onAddClick={handleUploadFile}
            actionButtons={[
              (row) => (
                <button 
                  onClick={() => handleViewFile(row)} 
                  style={{...styles.actionBtn, ...styles.viewBtn}}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                  title="Open file in new tab"
                >
                  <ExternalLink size={16} />
                  Open
                </button>
              ),
              (row) => (
                <button 
                  onClick={() => handleDownloadFile(row)} 
                  style={{...styles.actionBtn, ...styles.downloadBtn}}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  <Download size={16} />
                  Download
                </button>
              ),
              (row) => (
                <button 
                  onClick={() => handleEditFile(row)} 
                  style={{...styles.actionBtn, ...styles.editBtn}}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  <Edit size={16} />
                  Edit
                </button>
              ),
              (row) => (
                <button 
                  onClick={() => handleDeleteFile(row)} 
                  style={{...styles.actionBtn, ...styles.deleteBtn}}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              )
            ]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="mid-navbar-container">
        <MidPageNavbar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          sections={["requests", "announcement", "templates", "files"]}
          showYear={false}
        />
      </div>

      <div className="dynamic-section">{renderSection()}</div>

      {/* Message Modals - Using Modal as in original code */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Message Details"
        size="large"
      >
        {selectedMessage && (
          <div style={styles.viewModalContainer}>
            <div style={styles.viewModalInfo}>
              <span style={styles.viewModalLabel}>From:</span>
              <span style={styles.viewModalValue}>
                {selectedMessage.sender} ({selectedMessage.senderType})
              </span>
            </div>
            <div style={styles.viewModalInfo}>
              <span style={styles.viewModalLabel}>Email:</span>
              <span style={styles.viewModalValue}>{selectedMessage.email}</span>
            </div>
            <div style={styles.viewModalInfo}>
              <span style={styles.viewModalLabel}>Subject:</span>
              <span style={styles.viewModalValue}>{selectedMessage.subject}</span>
            </div>
            <div style={styles.viewModalInfo}>
              <span style={styles.viewModalLabel}>Date:</span>
              <span style={styles.viewModalValue}>
                {selectedMessage.date} at {selectedMessage.time}
              </span>
            </div>
            <div style={styles.viewModalInfo}>
              <span style={styles.viewModalLabel}>Priority:</span>
              <span 
                style={
                  selectedMessage.priority === 'high' ? styles.priorityHigh :
                  selectedMessage.priority === 'medium' ? styles.priorityMedium :
                  styles.priorityLow
                }
              >
                {selectedMessage.priority}
              </span>
            </div>
            <div>
              <strong style={{fontSize: '16px', color: '#1e293b'}}>Message:</strong>
              <div style={styles.viewModalContentBox}>{selectedMessage.message}</div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={replyModalOpen}
        onClose={() => setReplyModalOpen(false)}
        title={`Reply to ${selectedMessage?.sender}`}
        size="large"
        footer={
          <div style={styles.replyFooter}>
            <button 
              onClick={() => setReplyModalOpen(false)} 
              style={styles.replyCancelBtn}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f5f9'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
            >
              Cancel
            </button>
            <button 
              style={styles.replySendBtn}
              onClick={handleSendReply}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
            >
              <Reply size={16} />
              Send Reply
            </button>
          </div>
        }
      >
        {selectedMessage && (
          <div>
            <div style={styles.originalMsgBox}>
              <strong style={{fontSize: '15px'}}>Original Message:</strong>
              <div style={styles.originalMsgText}>{selectedMessage.message}</div>
            </div>
            <div>
              <label style={styles.replyLabel}>Your Reply:</label>
              <textarea
                rows="6"
                style={styles.replyTextarea}
                placeholder="Type your reply here..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Announcement Modals - Using PopUp as in original code */}
      <PopUp
        isOpen={createAnnouncementModalOpen}
        onClose={() => setCreateAnnouncementModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <DynamicForm
          title="Create New Announcement"
          fields={announcementFormFields}
          onSubmit={handleAnnouncementSubmit}
          onCancel={() => setCreateAnnouncementModalOpen(false)}
          submitText="Create Announcement"
          initialData={announcementFormData}
        />
      </PopUp>

      <PopUp
        isOpen={editAnnouncementModalOpen}
        onClose={() => setEditAnnouncementModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <DynamicForm
          title="Edit Announcement"
          fields={announcementFormFields}
          onSubmit={handleAnnouncementSubmit}
          onCancel={() => setEditAnnouncementModalOpen(false)}
          submitText="Save Changes"
          initialData={announcementFormData}
        />
      </PopUp>

      <Modal
        isOpen={viewAnnouncementModalOpen}
        onClose={() => setViewAnnouncementModalOpen(false)}
        title="Announcement Details"
        size="large"
      >
        {selectedAnnouncement && (
          <div style={styles.viewModalContainer}>
            <div style={styles.viewModalInfo}>
              <span style={styles.viewModalLabel}>Title:</span>
              <span style={styles.viewModalValue}>{selectedAnnouncement.title}</span>
            </div>
            <div style={styles.viewModalInfo}>
              <span style={styles.viewModalLabel}>Target Audience:</span>
              <span style={styles.viewModalValue}>{selectedAnnouncement.targetAudience}</span>
            </div>
            <div style={styles.viewModalInfo}>
              <span style={styles.viewModalLabel}>Priority:</span>
              <span 
                style={
                  selectedAnnouncement.priority === 'high' ? styles.priorityHigh :
                  selectedAnnouncement.priority === 'medium' ? styles.priorityMedium :
                  styles.priorityLow
                }
              >
                {selectedAnnouncement.priority}
              </span>
            </div>
            <div style={styles.viewModalInfo}>
              <span style={styles.viewModalLabel}>Status:</span>
              <span style={styles.viewModalValue}>{selectedAnnouncement.status}</span>
            </div>
            <div style={styles.viewModalInfo}>
              <span style={styles.viewModalLabel}>Created:</span>
              <span style={styles.viewModalValue}>
                {selectedAnnouncement.createdDate} at {selectedAnnouncement.createdTime}
              </span>
            </div>
            <div style={styles.viewModalInfo}>
              <span style={styles.viewModalLabel}>Expires:</span>
              <span style={styles.viewModalValue}>{selectedAnnouncement.expiryDate}</span>
            </div>
            <div>
              <strong style={{fontSize: '16px', color: '#1e293b'}}>Content:</strong>
              <div style={styles.viewModalContentBox}>{selectedAnnouncement.content}</div>
            </div>
          </div>
        )}
      </Modal>

      {/* Template Modals - Using PopUp for forms, Modal for viewing as in original */}
      <PopUp
        isOpen={createTemplateModalOpen}
        onClose={() => setCreateTemplateModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <DynamicForm
          title="Create New Template"
          fields={templateFormFields}
          onSubmit={handleTemplateSubmit}
          onCancel={() => setCreateTemplateModalOpen(false)}
          submitText="Create Template"
          initialData={templateFormData}
        />
      </PopUp>

      <PopUp
        isOpen={editTemplateModalOpen}
        onClose={() => setEditTemplateModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <DynamicForm
          title="Edit Template"
          fields={templateFormFields}
          onSubmit={handleTemplateSubmit}
          onCancel={() => setEditTemplateModalOpen(false)}
          submitText="Save Changes"
          initialData={templateFormData}
        />
      </PopUp>

      <Modal
        isOpen={viewTemplateModalOpen}
        onClose={() => setViewTemplateModalOpen(false)}
        title="Template Details"
        size="large"
      >
        {selectedTemplate && (
          <div style={styles.viewModalContainer}>
            <div style={styles.viewModalInfo}>
              <span style={styles.viewModalLabel}>Name:</span>
              <span style={styles.viewModalValue}>{selectedTemplate.name}</span>
            </div>
            <div style={styles.viewModalInfo}>
              <span style={styles.viewModalLabel}>Category:</span>
              <span style={styles.viewModalValue}>{selectedTemplate.category}</span>
            </div>
            <div style={styles.viewModalInfo}>
              <span style={styles.viewModalLabel}>Target Audience:</span>
              <span style={styles.viewModalValue}>{selectedTemplate.targetAudience}</span>
            </div>
            <div style={styles.viewModalInfo}>
              <span style={styles.viewModalLabel}>Status:</span>
              <span style={styles.viewModalValue}>{selectedTemplate.status}</span>
            </div>
            <div style={styles.viewModalInfo}>
              <span style={styles.viewModalLabel}>Created:</span>
              <span style={styles.viewModalValue}>{selectedTemplate.createdDate}</span>
            </div>
            <div style={styles.viewModalInfo}>
              <span style={styles.viewModalLabel}>Last Modified:</span>
              <span style={styles.viewModalValue}>{selectedTemplate.lastModified}</span>
            </div>
            <div style={styles.viewModalInfo}>
              <span style={styles.viewModalLabel}>Variables:</span>
              <span style={styles.viewModalValue}>{selectedTemplate.variables.join(", ")}</span>
            </div>
            <div style={styles.viewModalInfo}>
              <span style={styles.viewModalLabel}>Subject:</span>
              <span style={styles.viewModalValue}>{selectedTemplate.subject}</span>
            </div>
            <div>
              <strong style={{fontSize: '16px', color: '#1e293b'}}>Content:</strong>
              <div style={styles.viewModalContentBox}>{selectedTemplate.content}</div>
            </div>
          </div>
        )}
      </Modal>

      <PopUp
        isOpen={useTemplateModalOpen}
        onClose={() => setUseTemplateModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <DynamicForm
          title={`Use Template: ${useTemplateFormTitle}`}
          fields={useTemplateFields}
          onSubmit={handleUseTemplateSubmit}
          onCancel={() => setUseTemplateModalOpen(false)}
          submitText="Send"
        />
      </PopUp>

      {/* Files Modals */}
      <PopUp
        isOpen={uploadFileModalOpen}
        onClose={() => setUploadFileModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <DynamicForm
          title="Upload New File"
          fields={dynamicFileFormFields}
          onSubmit={handleFileSubmit}
          onCancel={() => setUploadFileModalOpen(false)}
          submitText="Upload File"
          initialData={fileFormData}
          onFieldChange={handleFileFieldChange}
        />
      </PopUp>

      <PopUp
        isOpen={editFileModalOpen}
        onClose={() => setEditFileModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <DynamicForm
          title="Edit File Details"
          fields={dynamicFileFormFields.filter(field => field.name !== 'file')} // Remove file field for editing
          onSubmit={handleFileSubmit}
          onCancel={() => setEditFileModalOpen(false)}
          submitText="Save Changes"
          initialData={fileFormData}
          onFieldChange={handleFileFieldChange}
        />
      </PopUp>

      <Modal
        isOpen={viewFileModalOpen}
        onClose={() => setViewFileModalOpen(false)}
        title="File Details"
        size="large"
      >
        {selectedFile && (
          <div style={styles.viewModalContainer}>
            <div style={styles.viewModalInfo}>
              <span style={styles.viewModalLabel}>Name:</span>
              <div style={{display: 'flex', alignItems: 'center', ...styles.viewModalValue}}>
                {(() => {
                  const IconComponent = getFileIcon(selectedFile.name, selectedFile.type);
                  return <IconComponent size={20} style={styles.fileIcon} />;
                })()}
                {selectedFile.name}
              </div>
            </div>
            <div style={styles.viewModalInfo}>
              <span style={styles.viewModalLabel}>Type:</span>
              <span style={styles.viewModalValue}>{selectedFile.type}</span>
            </div>
            <div style={styles.viewModalInfo}>
              <span style={styles.viewModalLabel}>Size:</span>
              <span style={styles.viewModalValue}>{selectedFile.size}</span>
            </div>
            <div style={styles.viewModalInfo}>
              <span style={styles.viewModalLabel}>Category:</span>
              <span style={styles.viewModalValue}>{selectedFile.category}</span>
            </div>
            <div style={styles.viewModalInfo}>
              <span style={styles.viewModalLabel}>Uploaded By:</span>
              <span style={styles.viewModalValue}>{selectedFile.uploadedBy}</span>
            </div>
            <div style={styles.viewModalInfo}>
              <span style={styles.viewModalLabel}>Upload Date:</span>
              <span style={styles.viewModalValue}>
                {selectedFile.uploadDate} at {selectedFile.uploadTime}
              </span>
            </div>
            <div style={styles.viewModalInfo}>
              <span style={styles.viewModalLabel}>Access Control:</span>
              <span style={styles.viewModalValue}>
                {selectedFile.accessType?.charAt(0).toUpperCase() + selectedFile.accessType?.slice(1)} → {selectedFile.accessBy} → {selectedFile.accessValue}
              </span>
            </div>
            <div style={styles.viewModalInfo}>
              <span style={styles.viewModalLabel}>Downloads:</span>
              <span style={styles.viewModalValue}>{selectedFile.downloadCount}</span>
            </div>
            <div style={styles.viewModalInfo}>
              <span style={styles.viewModalLabel}>Last Accessed:</span>
              <span style={styles.viewModalValue}>{selectedFile.lastAccessed}</span>
            </div>
            <div style={styles.viewModalInfo}>
              <span style={styles.viewModalLabel}>Status:</span>
              <span style={styles.viewModalValue}>{selectedFile.status}</span>
            </div>
            {selectedFile.tags && selectedFile.tags.length > 0 && (
              <div style={styles.viewModalInfo}>
                <span style={styles.viewModalLabel}>Tags:</span>
                <div style={styles.tagContainer}>
                  {selectedFile.tags.map((tag, index) => (
                    <span key={index} style={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div>
              <strong style={{fontSize: '16px', color: '#1e293b'}}>Description:</strong>
              <div style={styles.viewModalContentBox}>{selectedFile.description}</div>
            </div>
            <div style={{ 
              marginTop: '24px', 
              display: 'flex', 
              gap: '16px', 
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button 
                onClick={() => handleViewFile(selectedFile)}
                style={{
                  ...styles.actionBtn,
                  ...styles.viewBtn,
                  fontSize: '14px',
                  padding: '12px 20px'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <ExternalLink size={18} />
                Open File
              </button>
              <button 
                onClick={() => handleDownloadFile(selectedFile)}
                style={{
                  ...styles.actionBtn,
                  ...styles.downloadBtn,
                  fontSize: '14px',
                  padding: '12px 20px'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <Download size={18} />
                Download File
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Messages;