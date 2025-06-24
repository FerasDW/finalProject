// dynamicForm.jsx
import React, { useState, useEffect } from "react";
import { X, Plus, CheckCircle2 } from "lucide-react";
import InputField from "./InputField";
import styles from "./dynamicForm.module.css";

const DynamicForm = ({
  title = "Form",
  fields = [],
  onSubmit,
  onCancel,
  submitText = "Submit",
  cancelText = "Cancel",
  showCancel = true,
  loading = false,
  className = "",
  initialData = {},
  validationRules = {},
  ...props
}) => {
  const [formData, setFormData] = useState(initialData || {});
  const [errors, setErrors] = useState({});

  // Update formData when initialData changes
  useEffect(() => {
    setFormData(initialData || {});
  }, []);

  const handleInputChange = (e) => {
    const { name, type, value, checked, files } = e.target;

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

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    fields.forEach((field) => {
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
    <div className={`${styles.formContainer} ${className}`} {...props}>
      <div className={styles.formModal}>
        {/* Header */}
        <div className={styles.formHeader}>
          <div className={styles.headerContent}>
            <h2 className={styles.formTitle}>
              <Plus
                style={{ width: "20px", height: "20px", color: "#4f46e5" }}
              />
              {title}
            </h2>

            <button
              onClick={handleCancel}
              className={styles.closeButton}
              type="button"
            >
              <X style={{ width: "18px", height: "18px", color: "#6b7280" }} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={styles.formContent}>
          <div onSubmit={handleSubmit}>
            <div className={styles.fieldsContainer}>
              {fields.map((field, index) => (
                <InputField
                  key={field.name || index}
                  label={field.label}
                  type={field.type || "text"}
                  name={field.name}
                  value={
                    field.type === "checkbox" || field.type === "file"
                      ? undefined
                      : formData[field.name] || ""
                  }
                  checked={
                    field.type === "checkbox"
                      ? formData[field.name] === true
                      : undefined
                  }
                  onChange={handleInputChange}
                  placeholder={field.placeholder}
                  required={field.required}
                  error={errors[field.name]}
                  disabled={loading}
                  accept={field.accept}
                  options={field.options}
                  rows={field.rows}
                  {...field.props}
                />
              ))}
            </div>

            {/* Buttons */}
            <div className={styles.formButtons}>
              {showCancel && (
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className={`${styles.btn} ${styles.btnCancel}`}
                >
                  <X style={{ width: "16px", height: "16px" }} />
                  {cancelText}
                </button>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className={`${styles.btn} ${styles.btnSubmit}`}
              >
                {loading ? (
                  <>
                    <div className={styles.loadingSpinner} />
                    <span className={styles.loadingText}>Loading...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 style={{ width: "16px", height: "16px" }} />
                    {submitText}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicForm;
