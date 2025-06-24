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
    'name': User,
    'fullname': User,
    'firstname': User,
    'lastname': User,
    'course': BookOpen,
    'subject': BookOpen,
    'instructor': Users,
    'teacher': Users,
    'professor': Users,
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
    'points': Hash
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
const FormField = ({ field, value, error, onChange, disabled }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const IconComponent = getFieldIcon(field.name, field.type);
  
  const fieldId = `field-${field.name}`;
  const hasError = Boolean(error);

  const baseInputStyles = {
    width: '100%',
    padding: '16px 20px 16px 52px',
    border: `2px solid ${hasError ? '#ef4444' : isFocused ? '#3b82f6' : '#e2e8f0'}`,
    borderRadius: '16px',
    fontSize: '15px',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
    backgroundColor: disabled ? '#f8fafc' : 'white',
    outline: 'none',
    boxSizing: 'border-box',
    color: '#1f2937',
    lineHeight: '1.5',
    boxShadow: isFocused ? `0 0 0 4px ${hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'}` : 'none'
  };

  const labelStyles = {
    display: 'block',
    marginBottom: '12px',
    fontSize: '15px',
    fontWeight: '600',
    color: hasError ? '#ef4444' : '#374151',
    letterSpacing: '-0.025em'
  };

  const renderField = () => {
    console.log( value);
    switch (field.type) {
      case 'textarea':
        return (
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              zIndex: 2,
              color: hasError ? '#ef4444' : isFocused ? '#3b82f6' : '#9ca3af',
              transition: 'color 0.2s ease'
            }}>
              <IconComponent size={20} />
            </div>
            <textarea
              id={fieldId}
              name={field.name}
              value={value || ''}
              onChange={onChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={field.placeholder}
              required={field.required}
              disabled={disabled}
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
              color: hasError ? '#ef4444' : isFocused ? '#3b82f6' : '#9ca3af',
              transition: 'color 0.2s ease'
            }}>
              <IconComponent size={20} />
            </div>
            <select
            
              id={fieldId}
              name={field.name}
              value={value } 
              onChange={onChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              required={field.required}
              disabled={disabled}
              style={{
                ...baseInputStyles,
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='${isFocused ? '%233b82f6' : '%236b7280'}' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 20px center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '20px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                paddingRight: '56px'
              }}
            >
              <option value="">{field.placeholder || 'Select an option'}</option>
              {field.options?.map((option, index) => (
                <option key={index} value={option.value || option}>
                  {option.label || option}
                </option>
              ))}
            </select>
          </div>
        );

      case 'radio':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {field.options?.map((option, index) => (
              <label 
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px 20px',
                  border: `2px solid ${value === (option.value || option) ? '#3b82f6' : '#e2e8f0'}`,
                  borderRadius: '16px',
                  backgroundColor: value === (option.value || option) ? '#eff6ff' : 'white',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: value === (option.value || option) ? '0 0 0 4px rgba(59, 130, 246, 0.1)' : 'none'
                }}
                onMouseOver={(e) => {
                  if (!disabled && value !== (option.value || option)) {
                    e.target.style.backgroundColor = '#f8fafc';
                  }
                }}
                onMouseOut={(e) => {
                  if (value !== (option.value || option)) {
                    e.target.style.backgroundColor = 'white';
                  }
                }}
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: `2px solid ${value === (option.value || option) ? '#3b82f6' : '#d1d5db'}`,
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}>
                  {value === (option.value || option) && (
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
                  value={option.value || option}
                  checked={value === (option.value || option)}
                  onChange={onChange}
                  disabled={disabled}
                  style={{ display: 'none' }}
                />
                <span style={{ 
                  fontSize: '15px', 
                  color: '#374151',
                  fontWeight: value === (option.value || option) ? '600' : '400'
                }}>
                  {option.label || option}
                </span>
              </label>
            ))}
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
            backgroundColor: disabled ? '#f8fafc' : value ? '#eff6ff' : 'white',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: value ? '0 0 0 4px rgba(59, 130, 246, 0.1)' : 'none'
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
                disabled={disabled}
                style={{
                  position: 'absolute',
                  width: '24px',
                  height: '24px',
                  margin: 0,
                  opacity: 0,
                  cursor: disabled ? 'not-allowed' : 'pointer'
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
                color: '#374151',
                cursor: disabled ? 'not-allowed' : 'pointer',
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
              color: hasError ? '#ef4444' : isFocused ? '#3b82f6' : '#9ca3af',
              transition: 'color 0.2s ease'
            }}>
              <Upload size={20} />
            </div>
            <input
              type="file"
              id={fieldId}
              name={field.name}
              onChange={onChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              required={field.required}
              disabled={disabled}
              accept={field.accept}
              style={{
                ...baseInputStyles,
                cursor: disabled ? 'not-allowed' : 'pointer'
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
              color: hasError ? '#ef4444' : isFocused ? '#3b82f6' : '#9ca3af',
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
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={field.placeholder}
              required={field.required}
              disabled={disabled}
              style={{
                ...baseInputStyles,
                paddingRight: '56px'
              }}
            />
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
          </div>
        );
        case 'hidden': 
  return null;              // דלג על רינדור


      default:  
        return (
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '20px',
              transform: 'translateY(-50%)',
              zIndex: 2,
              color: hasError ? '#ef4444' : isFocused ? '#3b82f6' : '#9ca3af',
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
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={field.placeholder}
              required={field.required}
              disabled={disabled}
              style={baseInputStyles}
            />
          </div>
        );
    }
  };

  return (
    <div style={{ marginBottom: '28px' }}>
      {field.type !== 'checkbox' && (
        <label 
          htmlFor={fieldId}
          style={labelStyles}
        >
          {field.label}
          {field.required && (
            <span style={{ color: '#ef4444', marginLeft: '4px', fontSize: '16px' }}>*</span>
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
  submitText = 'Submit',
  cancelText = 'Cancel',
  showCancel = true,
  showHeader = true,
  showFooter = true,
  loading = false,
  className = '',
  initialData = {},
  validationRules = {},
  icon: CustomIcon,
  ...props
}) => {
  const [formData, setFormData] = useState(initialData || {});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, type, value, checked, files } = e.target;

    let finalValue;
    if (type === 'checkbox') {
      finalValue = checked;
    } else if (type === 'radio') {
      finalValue = value;
    } else if (type === 'file') {
      finalValue = files?.[0] ?? null;
    } else {
      finalValue = value;
    }

    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    fields.forEach(field => {
      const value = formData[field.name];

      // Required field validation
      if (field.required) {
        const isEmpty =
          (field.type === 'file' && !value) ||
          (typeof value === 'string' && value.trim() === '') ||
          (typeof value === 'undefined') ||
          (value === null) ||
          (field.type === 'checkbox' && !value);

        if (isEmpty) {
          newErrors[field.name] = `${field.label || field.name} is required`;
        }
      }

      // Custom validation rules
      if (value && validationRules[field.name]) {
        const rule = validationRules[field.name];
        if (typeof rule === 'function') {
          const error = rule(value, formData);
          if (error) {
            newErrors[field.name] = error;
          }
        } else if (rule.pattern && !rule.pattern.test(value)) {
          newErrors[field.name] = rule.message || `Invalid ${field.label || field.name}`;
        }
      }

      // Built-in email validation
      if (field.type === 'email' && value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
          newErrors[field.name] = 'Please enter a valid email address';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit?.(formData);
    }
  };

  const handleCancel = () => {
    setFormData(initialData || {});
    setErrors({});
    onCancel?.();
  };

  // No container styles - let the popup handle the styling
  return (
    <div className={className}  style={{ padding: '20px'}}  {...props}>
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
            console.log(field),
            <FormField
              key={field.name || index}
              field={field}
              value={formData[field.name]}
              error={errors[field.name]}
              onChange={handleInputChange}
              disabled={loading}
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