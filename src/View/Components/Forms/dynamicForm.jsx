import React, { useState, useEffect } from 'react';
import InputField from './InputField';
import './dynamicForm.css';

const DynamicForm = ({
  title = 'Form',
  fields = [],
  onSubmit,
  onCancel,
  submitText = 'Submit',
  cancelText = 'Cancel',
  showCancel = true,
  loading = false,
  className = '',
  initialData = {} // Add this prop
}) => {
  const [formData, setFormData] = useState(initialData || {});
  const [errors, setErrors] = useState({});

  // Update formData when initialData changes
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

      if (field.required) {
        const isEmpty =
          (field.type === 'file' && !value) ||
          (typeof value === 'string' && value.trim() === '') ||
          (typeof value === 'undefined') ||
          (typeof value === 'boolean' && !value);

        if (isEmpty) {
          newErrors[field.name] = `${field.label || field.name} is required`;
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
    setFormData({});
    setErrors({});
    onCancel?.();
  };

  return (
    <div className={`dynamic-form-container ${className}`}>
      <div className="dynamic-form">
        {/* Header */}
        <div className="form-header">
          <h2 className="form-title">{title}</h2>
        </div>

        {/* Content */}
        <div className="form-content">
          <div className="fields-container">
            {fields.map((field, index) => (
              <InputField
                key={field.name || index}
                label={field.label}
                type={field.type || 'text'}
                name={field.name}
                value={
                  field.type === 'checkbox' || field.type === 'radio' || field.type === 'file'
                    ? undefined
                    : formData[field.name] || ''
                }
                checked={
                  field.type === 'checkbox'
                    ? formData[field.name] === true
                    : field.type === 'radio'
                    ? formData[field.name] === field.value
                    : undefined
                }
                onChange={handleInputChange}
                placeholder={field.placeholder}
                required={field.required}
                error={errors[field.name]}
                disabled={loading}
                accept={field.accept}
                options={field.options}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="form-buttons">
            {showCancel && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="btn btn-cancel"
              >
                {cancelText}
              </button>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="btn btn-submit"
            >
              {loading && (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                </div>
              )}
              <span className={loading ? 'loading-text' : ''}>{submitText}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicForm;