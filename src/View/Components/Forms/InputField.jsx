// InputField.jsx
import React, { useState } from 'react';
import './inputField.css';

const InputField = ({
  label,
  type = 'text',
  name,
  value,
  checked,
  onChange,
  placeholder,
  required = false,
  error,
  disabled = false,
  accept,
  options = [], // For select fields
  className = ''
}) => {
  const [focused, setFocused] = useState(false);

  const renderInput = () => {
    const baseClass = `input ${type} ${error ? 'error' : ''} ${focused ? 'focused' : ''} ${disabled ? 'disabled' : ''}`;

    switch (type) {
      case 'select':
        return (
          <select
            name={name}
            value={value || ''}
            onChange={onChange}
            required={required}
            disabled={disabled}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={baseClass}
          >
            <option value="">{placeholder || `Select ${label}`}</option>
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={baseClass}
            rows={4}
          />
        );

      case 'checkbox':
        return (
          <input
            type="checkbox"
            name={name}
            checked={checked || false}
            onChange={onChange}
            required={required}
            disabled={disabled}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`${baseClass} checkbox-input`}
          />
        );

      case 'radio':
        return (
          <div className="radio-group">
            {options.map((option, index) => (
              <label key={index} className="radio-label">
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={checked}
                  onChange={onChange}
                  required={required}
                  disabled={disabled}
                  className={`${baseClass} radio-input`}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'file':
        return (
          <input
            type="file"
            name={name}
            onChange={onChange}
            accept={accept}
            required={required}
            disabled={disabled}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={baseClass}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={baseClass}
            min="0"
            step="0.1"
          />
        );

      default:
        return (
          <input
            type={type}
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={baseClass}
          />
        );
    }
  };

  return (
    <div className={`input-field ${className}`}>
      {label && (
        <label className={`input-label ${error ? 'error' : ''} ${focused ? 'focused' : ''}`}>
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}

      <div className="input-wrapper">
        {renderInput()}

        {focused && !error && type !== 'checkbox' && type !== 'radio' && (
          <div className={`input-glow glow-${type}`} />
        )}
      </div>

      {error && (
        <p className="error-message">
          <svg className="error-icon" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;