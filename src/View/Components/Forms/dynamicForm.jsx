import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  CheckCircle2, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  FileText, 
  Type, 
  Hash, 
  ToggleLeft,
  Upload,
  ChevronDown,
  AlertCircle,
  Eye,
  EyeOff,
  BookOpen,
  Users,
  GraduationCap,
  MapPin
} from 'lucide-react';

// Enhanced field icon mapping with more specific icons
const getFieldIcon = (fieldName, fieldType) => {
  // Name-based icon mapping (more specific)
  const nameIconMap = {
    'title': FileText,
    'coursetitle': BookOpen,
    'name': User,
    'fullname': User,
    'firstname': User,
    'lastname': User,
    'course': BookOpen,
    'subject': BookOpen,
    'instructor': Users,
    'teacher': Users,
    'professor': Users,
    'lecturer': Users,
    'program': GraduationCap,
    'group': GraduationCap,
    'department': GraduationCap,
    'academicyear': GraduationCap,
    'programyear': GraduationCap,
    'year': Calendar,
    'semester': Calendar,
    'duedate': Calendar,
    'duetime': Clock,
    'startdate': Calendar,
    'enddate': Calendar,
    'starttime': Clock,
    'endtime': Clock,
    'priority': AlertCircle,
    'type': GraduationCap,
    'category': GraduationCap,
    'email': Mail,
    'phone': Phone,
    'tel': Phone,
    'address': MapPin,
    'location': MapPin,
    'city': MapPin,
    'message': FileText,
    'description': FileText,
    'notes': FileText,
    'content': FileText,
    'details': FileText,
    'password': Eye,
    'url': Type,
    'website': Type,
    'grade': Hash,
    'score': Hash,
    'points': Hash,
    'students': Users,
    'lessons': BookOpen,
    'credits': Hash,
    'coursecode': Type
  };
  
  // Type-based icon mapping
  const typeIconMap = {
    'text': Type,
    'email': Mail,
    'tel': Phone,
    'phone': Phone,
    'number': Hash,
    'date': Calendar,
    'time': Clock,
    'datetime-local': Calendar,
    'textarea': FileText,
    'select': ChevronDown,
    'checkbox': ToggleLeft,
    'radio': ToggleLeft,
    'file': Upload,
    'password': Eye,
    'url': Type,
    'search': Type
  };
  
  // First check field name, then field type, then default
  const fieldNameKey = fieldName?.toLowerCase().replace(/[^a-z]/g, '');
  return nameIconMap[fieldNameKey] || typeIconMap[fieldType] || FileText;
};

// Individual Field Component
const FormField = ({ field, value, error, onChange, disabled, dynamicOptions }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const IconComponent = getFieldIcon(field.name, field.type);
  
  const fieldId = `field-${field.name}`;
  const hasError = Boolean(error);
  const isDisabled = disabled || field.disabled;

  // Use dynamic options if available, otherwise use field options
  const fieldOptions = dynamicOptions || field.options || [];

  // Ensure fieldOptions is always an array of strings or simple objects
  const safeOptions = Array.isArray(fieldOptions) ? fieldOptions : [];

  const baseInputStyles = {
    width: '100%',
    padding: '16px 20px 16px 52px',
    border: `2px solid ${hasError ? '#ef4444' : isFocused ? '#3b82f6' : '#e2e8f0'}`,
    borderRadius: '16px',
    fontSize: '15px',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
    backgroundColor: isDisabled ? '#f8fafc' : 'white',
    outline: 'none',
    boxSizing: 'border-box',
    color: isDisabled ? '#9ca3af' : '#1f2937',
    lineHeight: '1.5',
    boxShadow: isFocused && !isDisabled ? `0 0 0 4px ${hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'}` : 'none',
    cursor: isDisabled ? 'not-allowed' : 'auto'
  };

  const labelStyles = {
    display: 'block',
    marginBottom: '12px',
    fontSize: '15px',
    fontWeight: '600',
    color: hasError ? '#ef4444' : isDisabled ? '#9ca3af' : '#374151',
    letterSpacing: '-0.025em'
  };

  const renderField = () => {
    
    switch (field.type) {
      case 'textarea':
        return (
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              zIndex: 2,
              color: hasError ? '#ef4444' : isFocused && !isDisabled ? '#3b82f6' : '#9ca3af',
              transition: 'color 0.2s ease'
            }}>
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
              style={{
                ...baseInputStyles,
                paddingTop: '20px',
                paddingBottom: '20px',
                resize: 'vertical',
                minHeight: '140px',
                lineHeight: '1.6'
              }}
            />
          </div>
        );

      case 'select':
        return (
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '20px',
              transform: 'translateY(-50%)',
              zIndex: 2,
              color: hasError ? '#ef4444' : isFocused && !isDisabled ? '#3b82f6' : '#9ca3af',
              transition: 'color 0.2s ease'
            }}>
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
              style={{
                ...baseInputStyles,
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='${isFocused && !isDisabled ? '%233b82f6' : '%236b7280'}' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 20px center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '20px',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                paddingRight: '56px'
              }}
            >
              <option value="">{field.placeholder || 'Select an option'}</option>
              {safeOptions.map((option, index) => {
                // Handle both string options and object options
                const optionValue = typeof option === 'object' ? option.value : option;
                const optionLabel = typeof option === 'object' ? option.label : option;
                
                return (
                  <option key={index} value={optionValue}>
                    {optionLabel}
                  </option>
                );
              })}
            </select>
          </div>
        );

      case 'radio':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {safeOptions.map((option, index) => {
              // Handle both string options and object options
              const optionValue = typeof option === 'object' ? option.value : option;
              const optionLabel = typeof option === 'object' ? option.label : option;
              
              return (
                <label 
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px 20px',
                    border: `2px solid ${value === optionValue ? '#3b82f6' : '#e2e8f0'}`,
                    borderRadius: '16px',
                    backgroundColor: value === optionValue ? '#eff6ff' : 'white',
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: value === optionValue ? '0 0 0 4px rgba(59, 130, 246, 0.1)' : 'none',
                    opacity: isDisabled ? 0.6 : 1
                  }}
                  onMouseOver={(e) => {
                    if (!isDisabled && value !== optionValue) {
                      e.target.style.backgroundColor = '#f8fafc';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (value !== optionValue) {
                      e.target.style.backgroundColor = 'white';
                    }
                  }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: `2px solid ${value === optionValue ? '#3b82f6' : '#d1d5db'}`,
                    backgroundColor: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}>
                    {value === optionValue && (
                      <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: '#3b82f6'
                      }} />
                    )}
                  </div>
                  <input
                    type="radio"
                    name={field.name}
                    value={optionValue}
                    checked={value === optionValue}
                    onChange={onChange}
                    disabled={isDisabled}
                    style={{ display: 'none' }}
                  />
                  <span style={{ 
                    fontSize: '15px', 
                    color: isDisabled ? '#9ca3af' : '#374151',
                    fontWeight: value === optionValue ? '600' : '400'
                  }}>
                    {optionLabel}
                  </span>
                </label>
              );
            })}
          </div>
        );

      case 'checkbox':
        return (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
            padding: '20px',
            border: `2px solid ${hasError ? '#ef4444' : value ? '#3b82f6' : '#e2e8f0'}`,
            borderRadius: '16px',
            backgroundColor: isDisabled ? '#f8fafc' : value ? '#eff6ff' : 'white',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: value ? '0 0 0 4px rgba(59, 130, 246, 0.1)' : 'none',
            opacity: isDisabled ? 0.6 : 1
          }}>
            <div style={{
              position: 'relative',
              width: '24px',
              height: '24px'
            }}>
              <input
                type="checkbox"
                id={fieldId}
                name={field.name}
                checked={value || false}
                onChange={onChange}
                disabled={isDisabled}
                style={{
                  position: 'absolute',
                  width: '24px',
                  height: '24px',
                  margin: 0,
                  opacity: 0,
                  cursor: isDisabled ? 'not-allowed' : 'pointer'
                }}
              />
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '8px',
                border: `2px solid ${value ? '#3b82f6' : '#d1d5db'}`,
                backgroundColor: value ? '#3b82f6' : 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}>
                {value && (
                  <CheckCircle2 size={14} style={{ color: 'white' }} />
                )}
              </div>
            </div>
            <label 
              htmlFor={fieldId}
              style={{
                fontSize: '15px',
                color: isDisabled ? '#9ca3af' : '#374151',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                userSelect: 'none',
                fontWeight: '500'
              }}
            >
              {field.label}
            </label>
          </div>
        );

      case 'file':
        return (
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '20px',
              transform: 'translateY(-50%)',
              zIndex: 2,
              color: hasError ? '#ef4444' : isFocused && !isDisabled ? '#3b82f6' : '#9ca3af',
              transition: 'color 0.2s ease'
            }}>
              <Upload size={20} />
            </div>
            <input
              type="file"
              id={fieldId}
              name={field.name}
              onChange={onChange}
              onFocus={() => !isDisabled && setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              required={field.required}
              disabled={isDisabled}
              accept={field.accept}
              style={{
                ...baseInputStyles,
                cursor: isDisabled ? 'not-allowed' : 'pointer'
              }}
            />
          </div>
        );

      case 'password':
        return (
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '20px',
              transform: 'translateY(-50%)',
              zIndex: 2,
              color: hasError ? '#ef4444' : isFocused && !isDisabled ? '#3b82f6' : '#9ca3af',
              transition: 'color 0.2s ease'
            }}>
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
              style={{
                ...baseInputStyles,
                paddingRight: '56px'
              }}
            />
            {!isDisabled && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '20px',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9ca3af',
                  padding: '8px',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.color = '#6b7280';
                  e.target.style.backgroundColor = '#f3f4f6';
                }}
                onMouseOut={(e) => {
                  e.target.style.color = '#9ca3af';
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            )}
          </div>
        );

      case 'hidden': 
        return null;

      default:  
        return (
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '20px',
              transform: 'translateY(-50%)',
              zIndex: 2,
              color: hasError ? '#ef4444' : isFocused && !isDisabled ? '#3b82f6' : '#9ca3af',
              transition: 'color 0.2s ease'
            }}>
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
              style={baseInputStyles}
            />
          </div>
        );
    }
  };

  return (
    <div style={{ marginBottom: '28px' }}>
      {field.type !== 'checkbox' && field.type !== 'hidden' && (
        <label 
          htmlFor={fieldId}
          style={labelStyles}
        >
          {field.label}
          {field.required && (
            <span style={{ color: '#ef4444', marginLeft: '4px', fontSize: '16px' }}>*</span>
          )}
          {isDisabled && (
            <span style={{ 
              color: '#9ca3af', 
              marginLeft: '8px', 
              fontSize: '12px',
              fontWeight: '400',
              fontStyle: 'italic'
            }}>
              (Disabled)
            </span>
          )}
        </label>
      )}
      
      {renderField()}
      
      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '12px',
          padding: '12px 16px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '12px',
          color: '#dc2626',
          fontSize: '13px',
          fontWeight: '500'
        }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
      
      {field.helperText && !error && (
        <div style={{
          marginTop: '8px',
          fontSize: '13px',
          color: '#6b7280',
          fontStyle: 'italic',
          lineHeight: '1.4'
        }}>
          {field.helperText}
        </div>
      )}
    </div>
  );
};

// Main Dynamic Form Component
const DynamicForm = ({
  title = 'Form',
  subtitle,
  fields = [],
  onSubmit,
  onCancel,
  submitText = "Submit",
  cancelText = "Cancel",
  showCancel = true,
  showHeader = true,
  showFooter = true,
  loading = false,
  className = "",
  initialData = {},
  validationRules = {},
  icon: CustomIcon,
  onFieldChange,
  getAcademicYearOptions,
  errors: externalErrors = {},
  ...props
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [dynamicFieldOptions, setDynamicFieldOptions] = useState({});

  // Initialize form data when initialData changes or component mounts
  useEffect(() => {
    console.log("DynamicForm: initialData changed:", initialData);
    
    if (initialData && Object.keys(initialData).length > 0) {
      // EDIT mode - use provided data
      setFormData(initialData);
      
      // Set dynamic options for academicYear if group is present
      if (initialData.group && getAcademicYearOptions) {
        const academicYearOptions = getAcademicYearOptions(initialData.group);
        setDynamicFieldOptions(prev => ({
          ...prev,
          academicYear: academicYearOptions
        }));
      }
    } else {
      // ADD mode - initialize with defaults
      const defaultData = {};
      fields.forEach(field => {
        if (field.disabled && field.name === 'year') {
          defaultData[field.name] = new Date().getFullYear().toString();
        } else if (field.type === 'checkbox') {
          defaultData[field.name] = false;
        } else {
          defaultData[field.name] = '';
        }
      });
      setFormData(defaultData);
    }
    
    // Clear errors when data changes
    setErrors({});
  }, [initialData, fields, getAcademicYearOptions]);

  // Update academic year options when group changes
  useEffect(() => {
    if (getAcademicYearOptions && formData.group) {
      const academicYearOptions = getAcademicYearOptions(formData.group);
      setDynamicFieldOptions(prev => ({
        ...prev,
        academicYear: academicYearOptions
      }));
    }
  }, [formData.group, getAcademicYearOptions]);

  // Update errors from external source
  useEffect(() => {
    if (externalErrors && Object.keys(externalErrors).length > 0) {
      setErrors(externalErrors);
    }
  }, [externalErrors]);

  const handleInputChange = (e) => {
    const { name, type, value, checked, files } = e.target;
    console.log("DynamicForm: Input changed:", name, "Value:", type === 'checkbox' ? checked : value);

    // Don't allow changes to disabled fields
    const field = fields.find(f => f.name === name);
    if (field && field.disabled) {
      console.log("Field is disabled, ignoring change");
      return;
    }

    let finalValue;
    if (type === "checkbox") {
      finalValue = checked;
    } else if (type === "radio") {
      finalValue = value;
    } else if (type === "file") {
      finalValue = files?.[0] ?? null;
    } else {
      finalValue = value;
    }

    const newFormData = {
      ...formData,
      [name]: finalValue,
    };

    // If group changed, reset academic year
    if (name === 'group' && formData.academicYear) {
      newFormData.academicYear = '';
      console.log("Group changed, clearing academicYear");
    }

    // Ensure year field always stays as current year for disabled fields
    if (name === 'year' && field && field.disabled) {
      return; // Prevent year field changes if disabled
    }
    
    console.log("DynamicForm: Setting new form data:", newFormData);
    setFormData(newFormData);

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Call external field change handler
    if (onFieldChange) {
      console.log("DynamicForm: Calling onFieldChange");
      onFieldChange(name, finalValue, newFormData);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    fields.forEach((field) => {
      // Skip validation for disabled fields
      if (field.disabled) {
        return;
      }

      const value = formData[field.name];

      // Required field validation
      if (field.required) {
        let isEmpty = false;

        if (field.type === "file") {
          isEmpty = !value;
        } else if (field.type === "checkbox") {
          isEmpty = !value;
        } else if (field.type === "select") {
          isEmpty = !value || value === "";
        } else if (field.type === "radio") {
          isEmpty = !value || value === "";
        } else {
          isEmpty =
            !value || (typeof value === "string" && value.trim() === "");
        }

        if (isEmpty) {
          newErrors[field.name] = `${field.label || field.name} is required`;
        }
      }

      // Custom validation rules
      if (value && validationRules[field.name]) {
        const rule = validationRules[field.name];
        if (typeof rule === "function") {
          const error = rule(value, formData);
          if (error) {
            newErrors[field.name] = error;
          }
        } else if (rule.pattern && !rule.pattern.test(value)) {
          newErrors[field.name] =
            rule.message || `Invalid ${field.label || field.name}`;
        }
      }

      // Built-in email validation
      if (field.type === "email" && value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
          newErrors[field.name] = "Please enter a valid email address";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("DynamicForm: Form submitted with data:", formData);
    
    if (validateForm()) {
      // Ensure current year is always set for year field
      const currentYear = new Date().getFullYear();
      const finalFormData = {
        ...formData,
        year: formData.year || currentYear.toString()
      };
      console.log("DynamicForm: Calling onSubmit with:", finalFormData);
      onSubmit?.(finalFormData);
    } else {
      console.log("DynamicForm: Validation failed");
    }
  };

  const handleCancel = () => {
    console.log("DynamicForm: Cancel clicked");
    setFormData({});
    setErrors({});
    setDynamicFieldOptions({});
    onCancel?.();
  };

  return (
    <div className={className} style={{ padding: '20px' }} {...props}>
      {/* Header */}
      {showHeader && (
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '32px',
          color: 'white',
          margin: '-24px -24px 0 -24px',
          borderRadius: '16px 16px 0 0'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: subtitle ? '12px' : '0'
          }}>
            {CustomIcon ? (
              <CustomIcon size={28} />
            ) : (
              <Plus size={28} />
            )}
            <h2 style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: '700',
              letterSpacing: '-0.025em'
            }}>
              {title}
            </h2>
          </div>
          {subtitle && (
            <p style={{
              margin: 0,
              fontSize: '16px',
              opacity: 0.9,
              fontWeight: '400',
              lineHeight: '1.5'
            }}>
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Content */}
      <div style={{ 
        padding: showHeader ? '32px 0 0 0' : '0'
      }}>
        <form onSubmit={handleSubmit}>
          {fields.map((field, index) => (
            <FormField
              key={`${field.name}-${index}`}
              field={field}
              value={formData[field.name]}
              error={errors[field.name]}
              onChange={handleInputChange}
              disabled={loading}
              dynamicOptions={dynamicFieldOptions[field.name]}
            />
          ))}
        </form>
      </div>

      {/* Footer */}
      {showFooter && (
        <div style={{
          padding: '32px 0 0 0',
          marginTop: '16px',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          gap: '16px',
          justifyContent: 'flex-end'
        }}>
          {showCancel && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              style={{
                padding: '14px 28px',
                backgroundColor: 'white',
                color: '#6b7280',
                border: '2px solid #e5e7eb',
                borderRadius: '14px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                opacity: loading ? 0.6 : 1
              }}
              onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#f9fafb')}
              onMouseOut={(e) => (e.target.style.backgroundColor = 'white')}
            >
              <X size={18} />
              {cancelText}
            </button>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: '14px 32px',
              background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '14px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              minWidth: '140px',
              justifyContent: 'center',
              boxShadow: loading ? 'none' : '0 8px 20px rgba(102, 126, 234, 0.4)'
            }}
            onMouseOver={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
            onMouseOut={(e) => (e.target.style.transform = 'translateY(0)')}
          >
            {loading ? (
              <>
                <div style={{
                  width: '18px',
                  height: '18px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Loading...
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />
                {submitText}
              </>
            )}
          </button>
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default DynamicForm;