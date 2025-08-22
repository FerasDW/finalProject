// src/View/Pages/Global/shouldMoveToDynamicForm.js
import React, { useState, useEffect } from "react";
import styles from './shouldMoveToDynamicForm.module.css';
import { 
  User, 
  Mail, 
  FileText, 
  AlertCircle,
  Calendar,
  Clock,
  Upload,
  X,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';

// Icon helper function
const getFieldIcon = (fieldName, fieldType) => {
  const nameIconMap = {
    'recipient': User,
    'subject': FileText,
    'content': FileText,
    'priority': AlertCircle,
    'title': FileText,
    'email': Mail,
    'name': User,
    'category': FileText,
    'targetaudience': User,
    'expirydate': Calendar,
    'scheduleddate': Calendar,
    'variables': FileText,
    'status': AlertCircle,
    'description': FileText,
    'file': Upload
  };
  
  const typeIconMap = {
    'text': FileText,
    'email': Mail,
    'textarea': FileText,
    'select': AlertCircle,
    'file': Upload,
    'datetime-local': Calendar
  };
  
  const fieldNameKey = fieldName?.toLowerCase().replace(/[^a-z]/g, '');
  return nameIconMap[fieldNameKey] || typeIconMap[fieldType] || FileText;
};

// Enhanced File Upload Component
const EnhancedFileUpload = ({ field, value, error, onChange, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(value || null);
  
  const fieldId = `field-${field.name}`;
  const hasError = Boolean(error);
  const isDisabled = disabled || field.disabled;

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isDisabled) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (isDisabled) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    setUploadedFile(file);
    
    const syntheticEvent = {
      target: {
        name: field.name,
        type: 'file',
        files: [file]
      }
    };
    onChange(syntheticEvent);
  };

  const handleBrowseClick = () => {
    if (!isDisabled) {
      document.getElementById(fieldId).click();
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setUploadedFile(null);
    document.getElementById(fieldId).value = '';
    
    const syntheticEvent = {
      target: {
        name: field.name,
        type: 'file',
        files: []
      }
    };
    onChange(syntheticEvent);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className={styles.formField}>
      <label htmlFor={fieldId} className={`${styles.formLabel} ${hasError ? styles.errorLabel : ''} ${isDisabled ? styles.disabledLabel : ''}`}>
        {field.label}
        {field.required && <span className={styles.required}>*</span>}
        {isDisabled && <span className={styles.disabledText}>(Disabled)</span>}
      </label>

      <div 
        className={`${styles.fileUploadArea} ${hasError ? styles.fileUploadError : ''} ${isDragging ? styles.fileUploadDragging : ''} ${uploadedFile ? styles.fileUploadSuccess : ''} ${isDisabled ? styles.fileUploadDisabled : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        <input
          type="file"
          id={fieldId}
          name={field.name}
          onChange={handleFileInputChange}
          required={field.required}
          disabled={isDisabled}
          accept={field.accept}
          className={styles.hiddenFileInput}
        />

        {uploadedFile ? (
          <div className={styles.uploadedFileDisplay}>
            <div className={styles.fileInfo}>
              <div className={styles.fileIcon}>📄</div>
              <div className={styles.fileDetails}>
                <div className={styles.fileName}>{uploadedFile.name}</div>
                <div className={styles.fileSize}>{formatFileSize(uploadedFile.size)}</div>
              </div>
              {!isDisabled && (
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className={styles.removeFileBtn}
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <div className={styles.successMessage}>
              <CheckCircle2 size={20} />
              <span>File uploaded successfully</span>
            </div>
          </div>
        ) : (
          <div className={styles.uploadPrompt}>
            <div className={styles.uploadIcon}>
              <Upload size={28} />
            </div>
            <div className={styles.uploadText}>
              <div className={styles.uploadTitle}>
                {isDragging ? 'Drop your file here' : 'Drag your file(s) to start uploading'}
              </div>
              <div className={styles.uploadOr}>OR</div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBrowseClick();
                }}
                disabled={isDisabled}
                className={styles.browseBtn}
              >
                Browse files
              </button>
            </div>
            {field.accept && (
              <div className={styles.acceptedTypes}>
                Accepted file types: {field.accept}
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
      
      {field.helperText && !error && (
        <div className={styles.helperText}>
          {field.helperText}
        </div>
      )}
    </div>
  );
};

// Form Field Component
const FormField = ({ field, value, error, onChange, disabled }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const IconComponent = getFieldIcon(field.name, field.type);
  
  const fieldId = `field-${field.name}`;
  const hasError = Boolean(error);
  const isDisabled = disabled || field.disabled;

  const renderField = () => {
    switch (field.type) {
      case 'textarea':
        return (
          <div className={styles.inputContainer}>
            <div className={`${styles.inputIcon} ${hasError ? styles.iconError : ''} ${isFocused && !isDisabled ? styles.iconFocused : ''}`}>
              <IconComponent size={20} />
            </div>
            <textarea
              id={fieldId}
              name={field.name}
              value={value || ''}
              onChange={onChange}
              onFocus={() => !isDisabled && setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={isDisabled ? (field.placeholder || value || 'Disabled') : field.placeholder}
              required={field.required}
              disabled={isDisabled}
              rows={field.rows || 4}
              className={`${styles.textarea} ${hasError ? styles.inputError : ''} ${isFocused && !isDisabled ? styles.inputFocused : ''} ${isDisabled ? styles.inputDisabled : ''}`}
            />
          </div>
        );

      case 'select':
        return (
          <div className={styles.inputContainer}>
            <div className={`${styles.inputIcon} ${hasError ? styles.iconError : ''} ${isFocused && !isDisabled ? styles.iconFocused : ''}`}>
              <IconComponent size={20} />
            </div>
            <select
              id={fieldId}
              name={field.name}
              value={value || ''} 
              onChange={onChange}
              onFocus={() => !isDisabled && setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              required={field.required}
              disabled={isDisabled}
              className={`${styles.select} ${hasError ? styles.inputError : ''} ${isFocused && !isDisabled ? styles.inputFocused : ''} ${isDisabled ? styles.inputDisabled : ''}`}
            >
              <option value="" disabled>{field.placeholder || `Select ${field.label || 'an option'}`}</option>
              {(field.options || []).map((option, index) => {
                const optionValue = typeof option === 'object' ? option.value || option.name : option;
                const optionLabel = typeof option === 'object' ? option.label || option.name : option;          
                
                return (
                  <option key={`${field.name}-${index}-${optionValue}`} value={optionValue}>
                    {optionLabel}
                  </option>
                );
              })}
            </select>
          </div>
        );

      case 'file':
        return (
          <EnhancedFileUpload 
            field={field}
            value={value}
            error={error}
            onChange={onChange}
            disabled={isDisabled}
          />
        );

      case 'password':
        return (
          <div className={styles.inputContainer}>
            <div className={`${styles.inputIcon} ${hasError ? styles.iconError : ''} ${isFocused && !isDisabled ? styles.iconFocused : ''}`}>
              <IconComponent size={20} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              id={fieldId}
              name={field.name}
              value={value || ''}
              onChange={onChange}
              onFocus={() => !isDisabled && setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={isDisabled ? (field.placeholder || value || 'Disabled') : field.placeholder}
              required={field.required}
              disabled={isDisabled}
              className={`${styles.input} ${hasError ? styles.inputError : ''} ${isFocused && !isDisabled ? styles.inputFocused : ''} ${isDisabled ? styles.inputDisabled : ''}`}
            />
            {!isDisabled && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.passwordToggle}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            )}
          </div>
        );

      default:  
        return (
          <div className={styles.inputContainer}>
            <div className={`${styles.inputIcon} ${hasError ? styles.iconError : ''} ${isFocused && !isDisabled ? styles.iconFocused : ''}`}>
              <IconComponent size={20} />
            </div>
            <input
              type={field.type || 'text'}
              id={fieldId}
              name={field.name}
              value={value || ''}
              onChange={onChange}
              onFocus={() => !isDisabled && setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={isDisabled ? (field.placeholder || value || 'Disabled') : field.placeholder}
              required={field.required}
              disabled={isDisabled}
              className={`${styles.input} ${hasError ? styles.inputError : ''} ${isFocused && !isDisabled ? styles.inputFocused : ''} ${isDisabled ? styles.inputDisabled : ''}`}
            />
          </div>
        );
    }
  };

  if (field.type === 'file') {
    return renderField();
  }

  return (
    <div className={styles.formField}>
      <label 
        htmlFor={fieldId}
        className={`${styles.formLabel} ${hasError ? styles.errorLabel : ''} ${isDisabled ? styles.disabledLabel : ''}`}
      >
        {field.label}
        {field.required && <span className={styles.required}>*</span>}
        {isDisabled && <span className={styles.disabledText}>(Disabled)</span>}
      </label>
      
      {renderField()}
      
      {error && (
        <div className={styles.errorMessage}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
      
      {field.helperText && !error && (
        <div className={styles.helperText}>
          {field.helperText}
        </div>
      )}
    </div>
  );
};

// =======================================================
// Request Form Component
// =======================================================
export const RequestForm = ({
  onSubmit,
  onCancel,
  admins,
  lecturers,
  userRole,
}) => {
  const [formData, setFormData] = useState({
    recipientType: "",
    recipientId: "",
    subject: "",
    content: "",
    priority: "low",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.recipientType)
      newErrors.recipientType = "Recipient type is required";
    if (!formData.recipientId) newErrors.recipientId = "Recipient is required";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.content.trim()) newErrors.content = "Content is required";
    if (!formData.priority) newErrors.priority = "Priority is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const getRecipientOptions = () => {
    if (formData.recipientType === "admin") {
      return admins.map((user) => ({
        value: user.id,
        label: `${user.name} (${user.email})`,
      }));
    }
    if (formData.recipientType === "lecturer") {
      return lecturers.map((user) => ({
        value: user.id,
        label: `${user.name} (${user.email})`,
      }));
    }
    return [];
  };

  const isStudentOrLecturer = userRole === "1300" || userRole === "1200";

  const fields = [
    {
      name: "recipientType",
      label: "Recipient Type",
      type: "select",
      required: true,
      options: isStudentOrLecturer ? [
        { value: "admin", label: "Admin" },
        { value: "lecturer", label: "Lecturer" }
      ] : [],
      placeholder: "Select a recipient type"
    },
    {
      name: "recipientId",
      label: "Recipient",
      type: "select",
      required: true,
      options: getRecipientOptions(),
      disabled: !formData.recipientType,
      placeholder: "Select a recipient"
    },
    {
      name: "subject",
      label: "Subject",
      type: "text",
      required: true,
      placeholder: "Enter subject"
    },
    {
      name: "content",
      label: "Content",
      type: "textarea",
      required: true,
      placeholder: "Write your message content...",
      rows: 5
    },
    {
      name: "priority",
      label: "Priority",
      type: "select",
      required: true,
      options: [
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" }
      ]
    }
  ];

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerTitle}>
            <Mail size={28} />
            <h2>Send Request</h2>
          </div>
          <p className={styles.headerSubtitle}>Send a request to administrators or lecturers</p>
        </div>
      </div>

      <div className={styles.formContent}>
        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <FormField
              key={field.name}
              field={field}
              value={formData[field.name]}
              error={errors[field.name]}
              onChange={handleInputChange}
              disabled={false}
            />
          ))}
        </form>
      </div>

      <div className={styles.formFooter}>
        <button type="button" onClick={onCancel} className={styles.cancelBtn}>
          <X size={18} />
          Cancel
        </button>
        <button type="button" onClick={handleSubmit} className={styles.submitBtn}>
          <CheckCircle2 size={18} />
          Send Request
        </button>
      </div>
    </div>
  );
};

// =======================================================
// Announcement Form Component
// =======================================================
export const AnnouncementForm = ({
  onSave,
  onDuplicate,
  onCancel,
  initialData,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title?.trim()) newErrors.title = "Title is required";
    if (!formData.content?.trim()) newErrors.content = "Content is required";
    if (!formData.targetAudienceType)
      newErrors.targetAudienceType = "Target audience is required";
    if (!formData.priority) newErrors.priority = "Priority is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleDuplicateSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onDuplicate(formData);
    }
  };

  const fields = [
    {
      name: "title",
      label: "Title",
      type: "text",
      required: true,
      placeholder: "Enter announcement title"
    },
    {
      name: "content",
      label: "Content",
      type: "textarea",
      required: true,
      placeholder: "Write your announcement content...",
      rows: 5
    },
    {
      name: "targetAudienceType",
      label: "Target Audience",
      type: "select",
      required: true,
      options: [
        { value: "all", label: "All" },
        { value: "lecturer", label: "Lecturers" },
        { value: "student", label: "Students" }
      ],
      placeholder: "Select target audience"
    },
    {
      name: "priority",
      label: "Priority",
      type: "select",
      required: true,
      options: [
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" }
      ]
    },
    {
      name: "expiryDate",
      label: "Expiry Date",
      type: "datetime-local"
    },
    {
      name: "scheduledDate",
      label: "Scheduled Date",
      type: "datetime-local"
    }
  ];

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerTitle}>
            <FileText size={28} />
            <h2>{initialData?.id ? "Edit Announcement" : "Create New Announcement"}</h2>
          </div>
        </div>
      </div>

      <div className={styles.formContent}>
        <form>
          {fields.map((field) => (
            <FormField
              key={field.name}
              field={field}
              value={formData[field.name] || ""}
              error={errors[field.name]}
              onChange={handleInputChange}
              disabled={false}
            />
          ))}
        </form>
      </div>

      <div className={styles.formFooter}>
        <button type="button" onClick={onCancel} className={styles.cancelBtn}>
          <X size={18} />
          Cancel
        </button>

        {initialData?.id ? (
          <>
            <button type="button" onClick={handleSaveSubmit} className={styles.secondaryBtn}>
              <CheckCircle2 size={18} />
              Save Changes
            </button>
            <button type="button" onClick={handleDuplicateSubmit} className={styles.submitBtn}>
              <CheckCircle2 size={18} />
              Re-send as New
            </button>
          </>
        ) : (
          <button type="button" onClick={handleSaveSubmit} className={styles.submitBtn}>
            <CheckCircle2 size={18} />
            Create Announcement
          </button>
        )}
      </div>
    </div>
  );
};

// =======================================================
// Template Form Component
// =======================================================
export const TemplateForm = ({ formType, onSave, onUse, onCancel, initialData, students, lecturers }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const templateOptions = {
    category: [
      { value: "welcome", label: "Welcome" },
      { value: "notice", label: "Notice" },
      { value: "reminder", label: "Reminder" },
      { value: "other", label: "Other" },
    ],
    targetAudience: [
      { value: "1300", label: "Students" },
      { value: "1200", label: "Lecturers" },
    ],
    status: [
      { value: "active", label: "Active" },
      { value: "draft", label: "Draft" },
    ],
  };

  useEffect(() => {
    if (formType === "use") {
      setFormData({
        recipientType: "",
        recipientIds: [],
      });
    } else {
      setFormData(initialData);
    }
  }, [initialData, formType]);
  
  const handleInputChange = (e) => {
    const { name, value, options } = e.target;
    let finalValue = value;
    
    if (e.target.multiple) {
      finalValue = Array.from(options)
        .filter(option => option.selected)
        .map(option => option.value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  
  const validateForm = () => {
    const newErrors = {};
    if (formType !== "use") {
      if (!formData.name?.trim()) newErrors.name = "Name is required";
      if (!formData.category) newErrors.category = "Category is required";
      if (!formData.targetAudience) newErrors.targetAudience = "Target audience is required";
      if (!formData.variables?.trim()) newErrors.variables = "Variables are required";
    } else {
      if (!formData.recipientType) newErrors.recipientType = "Recipient type is required";
      if (!formData.recipientIds?.length) newErrors.recipientIds = "At least one recipient must be selected";
    }
    if (!formData.subject?.trim()) newErrors.subject = "Subject is required";
    if (!formData.content?.trim()) newErrors.content = "Content is required";
    
    if (formType === "use" && initialData.variables) {
      initialData.variables.forEach(variable => {
        if (!formData[variable]?.trim()) {
          newErrors[variable] = `${variable} is required`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (formType === "use") {
        onUse(formData);
      } else {
        const parsedData = {
          ...formData,
          variables: formData.variables ? formData.variables.split(',').map(s => s.trim()) : [],
        };
        onSave(parsedData);
      }
    }
  };
  
  const recipientOptions = formData.recipientType === "1300" ? students : lecturers;

  const getFields = () => {
    let fields = [];

    if (formType !== "use") {
      fields = [
        {
          name: "name",
          label: "Name",
          type: "text",
          required: true,
          placeholder: "Enter template name"
        },
        {
          name: "category",
          label: "Category",
          type: "select",
          required: true,
          options: templateOptions.category,
          placeholder: "Select Category"
        },
        {
          name: "targetAudience",
          label: "Target Audience",
          type: "select",
          required: true,
          options: templateOptions.targetAudience,
          placeholder: "Select Target Audience"
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: templateOptions.status,
          placeholder: "Select Status"
        },
        {
          name: "variables",
          label: "Variables (e.g., name, gpa)",
          type: "text",
          required: true,
          placeholder: "name, gpa"
        }
      ];
    }

    if (formType === "use") {
      fields.push(
        {
          name: "recipientType",
          label: "Recipient Type",
          type: "select",
          required: true,
          options: templateOptions.targetAudience,
          placeholder: "Select Recipient Type"
        }
      );

      if (formData.recipientType) {
        fields.push({
          name: "recipientIds",
          label: "Recipients",
          type: "select",
          multiple: true,
          required: true,
          options: recipientOptions.map(opt => ({ value: opt.id, label: opt.name }))
        });
      }

      if (initialData?.variables) {
        initialData.variables.forEach(variable => {
          fields.push({
            name: variable,
            label: variable.charAt(0).toUpperCase() + variable.slice(1),
            type: "text",
            required: true,
            placeholder: `Enter value for ${variable}`
          });
        });
      }
    }

    fields.push(
      {
        name: "subject",
        label: "Subject",
        type: "text",
        required: true,
        placeholder: "Enter message subject"
      },
      {
        name: "content",
        label: "Content",
        type: "textarea",
        required: true,
        placeholder: "Write your message content...",
        rows: 5
      }
    );

    return fields;
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerTitle}>
            <FileText size={28} />
            <h2>
              {formType === "create" && "Create New Template"}
              {formType === "edit" && "Edit Template"}
              {formType === "use" && `Use Template: ${initialData?.name}`}
            </h2>
          </div>
        </div>
      </div>

      <div className={styles.formContent}>
        <form onSubmit={handleSubmit}>
          {getFields().map((field) => (
            <FormField
              key={field.name}
              field={field}
              value={formData[field.name] || (field.multiple ? [] : "")}
              error={errors[field.name]}
              onChange={handleInputChange}
              disabled={false}
            />
          ))}
        </form>
      </div>

      <div className={styles.formFooter}>
        <button type="button" onClick={onCancel} className={styles.cancelBtn}>
          <X size={18} />
          Cancel
        </button>
        <button type="button" onClick={handleSubmit} className={styles.submitBtn}>
          <CheckCircle2 size={18} />
          {formType === "create" && "Create Template"}
          {formType === "edit" && "Save Changes"}
          {formType === "use" && "Create Announcements"}
        </button>
      </div>
    </div>
  );
};

// =======================================================
// File Upload Form Component
// =======================================================
export const FileUploadForm = ({ onSave, onCancel, students, lecturers }) => {
  const [formData, setFormData] = useState({
    file: null,
    name: "",
    description: "",
    category: "",
    accessType: "personal",
    recipientIds: [],
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (name === "file") {
      setFormData((prev) => ({ ...prev, file: files[0] }));
    } else if (name === "recipientIds") {
      const selectedOptions = Array.from(e.target.options)
        .filter(option => option.selected)
        .map(option => option.value);
      setFormData((prev) => ({ ...prev, [name]: selectedOptions }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.file) newErrors.file = "File is required";
    if (!formData.name?.trim()) newErrors.name = "File name is required";
    if (!formData.description?.trim()) newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (formData.accessType === "personal" && formData.recipientIds.length === 0) {
      newErrors.recipientIds = "At least one recipient must be selected";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };
  
  const recipientOptions = formData.accessType === "personal" ? [...students, ...lecturers] : [];

  const fields = [
    {
      name: "file",
      label: "File",
      type: "file",
      required: true
    },
    {
      name: "name",
      label: "File Name",
      type: "text",
      required: true,
      placeholder: "Enter file name"
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
      ],
      placeholder: "Select Category"
    },
    {
      name: "accessType",
      label: "Access Control",
      type: "select",
      options: [
        { value: "personal", label: "Specific Users" }
      ]
    }
  ];

  if (formData.accessType === "personal") {
    fields.push({
      name: "recipientIds",
      label: "Recipients",
      type: "select",
      multiple: true,
      required: true,
      options: recipientOptions.map(user => ({ value: user.id, label: user.name }))
    });
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerTitle}>
            <Upload size={28} />
            <h2>Upload New File</h2>
          </div>
        </div>
      </div>

      <div className={styles.formContent}>
        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <FormField
              key={field.name}
              field={field}
              value={formData[field.name] || (field.multiple ? [] : "")}
              error={errors[field.name]}
              onChange={handleInputChange}
              disabled={false}
            />
          ))}
        </form>
      </div>

      <div className={styles.formFooter}>
        <button type="button" onClick={onCancel} className={styles.cancelBtn}>
          <X size={18} />
          Cancel
        </button>
        <button type="button" onClick={handleSubmit} className={styles.submitBtn}>
          <Upload size={18} />
          Upload File
        </button>
      </div>
    </div>
  );
};