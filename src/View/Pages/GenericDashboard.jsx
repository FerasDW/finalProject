// src/View/Pages/GenericDashboard.jsx

import React, { useState, useEffect, useCallback } from "react";
import { ArrowRight, User, UserCheck, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import * as genericDashboardAPI from "../../Api/GenericDashboardApi";

// Styles
import styles from "./GenericDashboard.module.scss";

// Components
import StudentTable from "../Components/Tables/Table";
import StatCardsContainer from "../Components/Cards/StatCardsContainer";
import DynamicFilter from "../Components/DynamicFilter";
import PopUp from "../Components/Cards/PopUp";

// Custom Hooks
import useGenericDashboard from "../../Hooks/useGenericDashboard";
import { useGenericDashboardPopup } from "../../Hooks/useGenericDashboardPopup";

// Utils
import { getGenericDashboardFormConfig } from "../../Utils/genericDashboardUtils";

export default function GenericDashboard({ entityType = "students" }) {
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
    goToProfile,
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
                hiddenColumns={getHiddenColumns(entityType)} // 🆕 Add hidden columns
                actionButtons={[
                  (item) => (
                    <button
                      onClick={() => goToProfile(item)}
                      className={styles.profileButton}
                      title={`View ${config?.entityName} Profile`}
                      disabled={!item.id}
                    >
                      <ArrowRight size={16} />
                    </button>
                  ),
                  (item) => (
                    <button
                      onClick={() => handleEditRecord(item)}
                      className={styles.profileButton}
                      title={`Edit ${config?.entityName}`}
                      disabled={!item.id}
                    >
                      <Edit size={16} />
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

      {/* Add Record Popup - now with a single dynamic form */}
      <PopUp
        isOpen={isPopupOpen}
        onClose={handleStaticFormCancel}
        size="large"
        closeOnOverlay={true}
      >
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            {entityType === "students" ? (
              <User size={32} />
            ) : (
              <UserCheck size={32} />
            )}
            <h2>{formConfig?.title}</h2>
            <p>{formConfig?.subtitle}</p>
          </div>
          <form onSubmit={handleStaticFormSubmit}>
            {formConfig?.fields.map((field) => (
              <div className={styles.formField} key={field.name}>
                <label htmlFor={field.name}>{field.label}</label>
                {field.type === "select" ? (
                  <select
                    id={field.name}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleInputChange}
                    required={field.required}
                  >
                    <option value="">{field.placeholder}</option>
                    {(field.name === "department"
                      ? departments
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
                  />
                )}
              </div>
            ))}
            <div className={styles.formFooter}>
              <button
                type="button"
                onClick={handleStaticFormCancel}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isFormLoading}
                className={styles.submitButton}
              >
                {isFormLoading ? "Adding..." : "Add Record"}
              </button>
            </div>
          </form>
          {formError && (
            <div style={{ color: "red", padding: "1rem", textAlign: "center" }}>
              Error: {formError}
            </div>
          )}
        </div>
      </PopUp>
    </div>
  );
}
