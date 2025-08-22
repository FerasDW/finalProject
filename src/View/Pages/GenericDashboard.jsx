// src/View/Pages/GenericDashboard.jsx

import React, { useState, useEffect, useCallback } from "react";
import { ArrowRight, User, UserCheck, Edit, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import * as genericDashboardAPI from "../../Api/GenericDashboardApi";

// Styles
import styles from "./GenericDashboard.module.scss";

// Components
import StudentTable from "../Components/Tables/Table";
import StatCardsContainer from "../Components/Cards/StatCardsContainer";
import DynamicFilter from "../Components/DynamicFilter";

// Custom Hooks
import useGenericDashboard from "../../Hooks/useGenericDashboard";
import { useGenericDashboardPopup } from "../../Hooks/useGenericDashboardPopup";

// Utils
import { getGenericDashboardFormConfig } from "../../Utils/genericDashboardUtils";

export default function GenericDashboard({ entityType = "students" }) {
  const navigate = useNavigate(); // Add navigation hook

  const {
    data,
    filteredData,
    isLoading,
    error,
    config,
    primaryFilter,
    setPrimaryFilter,
    filterValues,
    stats,
    dashboardCards,
    dynamicFilters,
    buttonFilters,
    handleFilterChange,
    handleButtonFilterChange,
    goToProfile, // This might not be implemented in the hook
    handleCardClick,
    getFilterTitle,
    refreshData,
  } = useGenericDashboard(entityType);

  const {
    isPopupOpen,
    isFormLoading,
    formError,
    handleAddRecord,
    handleEditRecord,
    handleFormSubmit,
    editingRecord,
    handleFormCancel,
  } = useGenericDashboardPopup(entityType, refreshData);

  // State for the form's input values, based on entityType
  const [formData, setFormData] = useState({});
  const [departments, setDepartments] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);

  // Custom navigation function for profile
  const handleGoToProfile = useCallback((item) => {
    if (!item || !item.id) {
      console.error('No valid item or ID provided for navigation');
      return;
    }

    // Determine the route based on entity type
    const entityRoute = entityType === "students" ? "student" : "lecturer";
    const profileRoute = `/profile/${entityRoute}/${item.id}`;
    
    console.log(`Navigating to: ${profileRoute}`);
    navigate(profileRoute);
  }, [navigate, entityType]);

  // Define columns to hide based on entity type
  const getHiddenColumns = (entityType) => {
    const commonHiddenColumns = [
      "id",
      "password",
      "profilePic",
      "coverPic",
      "title",
      "university",
      "bio",
      "website",
      "location",
      "createdAt",
      "updatedAt",
      "role",
      "enabled",
      "authorities",
      "accountNonLocked",
      "credentialsNonExpired",
      "accountNonExpired",
    ];

    if (entityType === "students") {
      return [
        ...commonHiddenColumns,
        "specialization",
        "employmentType",
        "experience",
        "rating",
      ];
    } else if (entityType === "lecturers") {
      return [...commonHiddenColumns, "academicYear"];
    }

    return commonHiddenColumns;
  };

  // Dynamic form configuration - memoize to prevent recreation
  const formConfig = React.useMemo(() => {
    return getGenericDashboardFormConfig(entityType, {
      departments,
      academicYears,
    });
  }, [entityType, departments, academicYears]);

  // Effect to initialize form data and fetch departments when popup opens
  useEffect(() => {
    if (isPopupOpen) {
      // Initialize form data based on the entity type
      if (formConfig?.fields) {
        const initialFormState = formConfig.fields.reduce((acc, field) => {
          acc[field.name] = "";
          return acc;
        }, {});
        setFormData(initialFormState);
      }

      // Fetch departments for both students and lecturers
      const fetchDepartments = async () => {
        try {
          const fetchedDepartments =
            await genericDashboardAPI.getAllDepartments();
          setDepartments(fetchedDepartments);
        } catch (error) {
          console.error("Failed to fetch departments:", error);
          setDepartments([]);
        }
      };
      fetchDepartments();
    }
  }, [isPopupOpen, entityType]); // Remove formConfig.fields dependency

  // Handle form input changes
  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => {
        const newData = { ...prevData, [name]: value };

        // Dynamic logic for student academic year
        if (entityType === "students" && name === "department") {
          const selectedDepartment = departments.find((d) => d.name === value);
          if (selectedDepartment) {
            const years = Array.from(
              { length: selectedDepartment.totalAcademicYears },
              (_, i) => `${i + 1}`
            );
            setAcademicYears(years);
          } else {
            setAcademicYears([]);
          }
          newData.academicYear = ""; // Reset academic year when department changes
        }
        return newData;
      });
    },
    [entityType, departments]
  );

  // Handle form submission
  const handleStaticFormSubmit = useCallback(
    (e) => {
      e.preventDefault();
      handleFormSubmit({
        ...formData,
        role: entityType === "students" ? "1300" : "1200",
      });
    },
    [formData, entityType, handleFormSubmit]
  );

  // Handle form cancellation and reset form data
  const handleStaticFormCancel = useCallback(() => {
    setFormData({});
    setAcademicYears([]);
    handleFormCancel();
  }, [handleFormCancel]);

  // Handle modal overlay click
  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      handleStaticFormCancel();
    }
  }, [handleStaticFormCancel]);

  // Handle escape key
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isPopupOpen) {
        handleStaticFormCancel();
      }
    };

    if (isPopupOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isPopupOpen, handleStaticFormCancel]);

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.dashboardContainer}>
        {/* Sidebar and Main Content remain unchanged */}
        <aside className={styles.studentSidebar}>
          <h3>{config?.primaryFilterLabel}</h3>
          {config?.getPrimaryOptions().map((option) => (
            <button
              key={option}
              className={`${styles.sidebarButton} ${
                primaryFilter === option ? styles.activeTab : ""
              }`}
              onClick={() => setPrimaryFilter(option)}
              disabled={isLoading}
            >
              {option}
            </button>
          ))}

          {/* Filters Section */}
          <div className={styles.filters}>
            {/* Dynamic Select Filters */}
            <DynamicFilter
              title={getFilterTitle()}
              filters={dynamicFilters}
              values={filterValues}
              onChange={handleFilterChange}
              showtitle={true}
            />

            {/* Button Filters */}
            {buttonFilters.map((filter) => (
              <div key={filter.name}>
                <label className={styles.filterLabel}>{filter.label}</label>
                <div className={styles.gradButtons}>
                  <button
                    className={`${styles.gradBtn} ${
                      filterValues[filter.name] === "all" ? styles.selected : ""
                    }`}
                    onClick={() => handleButtonFilterChange(filter.name, "all")}
                    disabled={isLoading}
                  >
                    All
                  </button>
                  {config?.getFilterOptions(filter.name).map((option) => (
                    <button
                      key={option}
                      className={`${styles.gradBtn} ${
                        filterValues[filter.name] === option
                          ? styles.selected
                          : ""
                      }`}
                      onClick={() =>
                        handleButtonFilterChange(filter.name, option)
                      }
                      disabled={isLoading}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className={styles.mainContent}>
          {/* Header */}
          <header className={styles.dashboardHeader}>
            <h1>{config?.title}</h1>
            <p>{config?.subtitle}</p>
          </header>

          {/* Stats Cards */}
          <div className={styles.cardsSection}>
            <StatCardsContainer
              cards={dashboardCards}
              columns={4}
              size="default"
              gap="1.5rem"
              onCardClick={handleCardClick}
              className={styles.dashboardCards}
            />
          </div>

          {/* Data Table */}
          <div className={styles.tableSection}>
            <div
              className={styles.tableContainer}
              style={{ position: "relative" }}
            >
              {isLoading && data.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    zIndex: 10,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    backdropFilter: "blur(4px)",
                    border: "1px solid rgba(59, 130, 246, 0.2)",
                    borderRadius: "20px",
                    padding: "8px 16px",
                    fontSize: "12px",
                    color: "#3b82f6",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      border: "2px solid rgba(59, 130, 246, 0.3)",
                      borderTop: "2px solid #3b82f6",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  ></div>
                  <span>Refreshing...</span>
                </div>
              )}

              <StudentTable
                entityType={entityType}
                icon={entityType}
                data={filteredData}
                showAddButton={true}
                onAddClick={handleAddRecord}
                hiddenColumns={getHiddenColumns(entityType)}
                actionButtons={[
                  (item) => (
                    <button
                      onClick={() => handleGoToProfile(item)} // Use our custom navigation function
                      className={styles.profileButton}
                      title={`View ${config?.entityName} Profile`}
                      disabled={!item.id}
                      style={{
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: item.id ? 'pointer' : 'not-allowed',
                        fontSize: '12px',
                        marginRight: '4px',
                        opacity: item.id ? 1 : 0.5,
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (item.id) {
                          e.target.style.transform = 'translateY(-1px)';
                          e.target.style.boxShadow = '0 4px 8px rgba(16, 185, 129, 0.3)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <ArrowRight size={16} />
                      View Profile
                    </button>
                  ),
                  (item) => (
                    <button
                      onClick={() => handleEditRecord(item)}
                      className={styles.profileButton}
                      title={`Edit ${config?.entityName}`}
                      disabled={!item.id}
                      style={{
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: item.id ? 'pointer' : 'not-allowed',
                        fontSize: '12px',
                        opacity: item.id ? 1 : 0.5,
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (item.id) {
                          e.target.style.transform = 'translateY(-1px)';
                          e.target.style.boxShadow = '0 4px 8px rgba(59, 130, 246, 0.3)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                  ),
                ]}
              />
            </div>

            <style jsx>{`
              @keyframes spin {
                0% {
                  transform: rotate(0deg);
                }
                100% {
                  transform: rotate(360deg);
                }
              }
            `}</style>
          </div>
        </main>
      </div>

      {/* Direct Modal Implementation - No PopUp Component */}
      {isPopupOpen && (
        <div className={styles.formModalOverlay} onClick={handleOverlayClick}>
          <div className={styles.formContainer} onClick={(e) => e.stopPropagation()}>
            {/* Form Header - Fixed at top */}
            <div className={styles.formHeader}>
              {entityType === "students" ? (
                <User size={32} />
              ) : (
                <UserCheck size={32} />
              )}
              <div className={styles.headerContent}>
                <h2>{formConfig?.title}</h2>
                <p>{formConfig?.subtitle}</p>
              </div>
              <button
                onClick={handleStaticFormCancel}
                className={styles.closeButton}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Error Message - Fixed position */}
            {formError && (
              <div className={styles.formErrorMessage}>
                <span className={styles.errorIcon}>⚠️</span>
                <span>Error: {formError}</span>
              </div>
            )}

            {/* Form Body - Scrollable Content */}
            <div className={styles.formBody}>
              <form onSubmit={handleStaticFormSubmit} className={styles.formContent}>
                <div className={styles.fieldsContainer}>
                  {formConfig?.fields.map((field, index) => (
                    <div 
                      className={styles.formField} 
                      key={field.name}
                      style={{
                        animationDelay: `${index * 0.05}s`
                      }}
                    >
                      <label htmlFor={field.name} className={styles.fieldLabel}>
                        {field.label}
                        {field.required && <span className={styles.requiredStar}>*</span>}
                      </label>
                      {field.type === "select" ? (
                        <select
                          id={field.name}
                          name={field.name}
                          value={formData[field.name] || ""}
                          onChange={handleInputChange}
                          required={field.required}
                          className={styles.fieldSelect}
                        >
                          <option value="" disabled>{field.placeholder}</option>
                          {(field.name === "department"
                            ? departments
                            : field.name === "academicYear"
                            ? academicYears.map(year => ({ name: year, id: year }))
                            : field.options
                          ).map((option) => (
                            <option
                              key={option.id || option}
                              value={option.name || option}
                            >
                              {option.name || option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          id={field.name}
                          name={field.name}
                          value={formData[field.name] || ""}
                          onChange={handleInputChange}
                          placeholder={field.placeholder}
                          required={field.required}
                          className={styles.fieldInput}
                          autoComplete={field.type === "email" ? "email" : field.type === "tel" ? "tel" : "off"}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </form>
            </div>
            
            {/* Form Footer - Fixed at bottom */}
            <div className={styles.formFooter}>
              <button
                type="button"
                onClick={handleStaticFormCancel}
                className={styles.cancelButton}
                disabled={isFormLoading}
              >
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                onClick={handleStaticFormSubmit}
                disabled={isFormLoading}
                className={`${styles.submitButton} ${isFormLoading ? styles.loading : ''}`}
              >
                {isFormLoading ? (
                  <>
                    <div className={styles.loadingSpinner}></div>
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <span>Add {entityType === "students" ? "Student" : "Lecturer"}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}