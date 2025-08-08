// GenericDashboard.jsx - Clean UI Component
import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// Styles
import styles from "./GenericDashboard.module.scss";

// Error Page Component
import NotFoundPage from "./Errors/404";

// Components
import StudentTable from "../Components/Tables/Table";
import StatCardsContainer from "../Components/Cards/StatCardsContainer";
import DynamicFilter from "../Components/DynamicFilter";
import DynamicForm from "../Components/Forms/dynamicForm";
import PopUp from "../Components/Cards/PopUp";

// Custom Hooks
import useGenericDashboard from "../../Hooks/useGenericDashboard";
import { useGenericDashboardPopup } from "../../Hooks/usePopupForm";

// Utils
import { getGenericDashboardFormConfig } from "../../Utils/genericDashboardUtils";

export default function GenericDashboard({ entityType = "students" }) {
  // Get all dashboard logic from custom hook
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
    refreshData
  } = useGenericDashboard(entityType);

  // Get popup form logic from custom hook
  const {
    isPopupOpen,
    isFormLoading,
    formError,
    handleAddRecord,
    handleFormSubmit,
    handleFormCancel
  } = useGenericDashboardPopup(entityType, refreshData);

  // Get form configuration
  const formConfig = getGenericDashboardFormConfig(entityType);

  // Early return if no config - Show 404 style error
 

  // Error state - Show 404 style error
  

  // Loading state - Show custom loader
  

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.dashboardContainer}>
        {/* Sidebar */}
        <aside className={styles.studentSidebar}>
          <h3>{config.primaryFilterLabel}</h3>
          {config.getPrimaryOptions().map((option) => (
            <button
              key={option}
              className={`${styles.sidebarButton} ${primaryFilter === option ? styles.activeTab : ""}`}
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
                    className={`${styles.gradBtn} ${filterValues[filter.name] === "all" ? styles.selected : ""}`}
                    onClick={() => handleButtonFilterChange(filter.name, "all")}
                    disabled={isLoading}
                  >
                    All
                  </button>
                  {config.getFilterOptions(filter.name).map((option) => (
                    <button
                      key={option}
                      className={`${styles.gradBtn} ${filterValues[filter.name] === option ? styles.selected : ""}`}
                      onClick={() => handleButtonFilterChange(filter.name, option)}
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
            <h1>{config.title}</h1>
            <p>{config.subtitle}</p>
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
            <div className={styles.tableContainer} style={{ position: 'relative' }}>
              {/* Subtle Loading Overlay for Data Refresh */}
              {isLoading && data.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  color: '#3b82f6',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    border: '2px solid rgba(59, 130, 246, 0.3)',
                    borderTop: '2px solid #3b82f6',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <span>Refreshing...</span>
                </div>
              )}
              
              <StudentTable
                entityType={entityType}
                icon={entityType}
                data={filteredData}
                showAddButton={true}
                onAddClick={handleAddRecord}
                actionButtons={[
                  (item) => (
                    <button
                      onClick={() => goToProfile(item)}
                      className={styles.profileButton}
                      title={`View ${config.entityName} Profile`}
                      disabled={!item.id}
                    >
                      <ArrowRight size={16} />
                    </button>
                  )
                ]}
              />
            </div>
            
            {/* Add spin animation styles */}
            <style jsx>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </main>
      </div>

      {/* Add Record Popup */}
      <PopUp
        isOpen={isPopupOpen}
        onClose={handleFormCancel}
        size="large"
        closeOnOverlay={true}
      >
        <DynamicForm
          title={formConfig?.title}
          subtitle={formConfig?.subtitle}
          icon={formConfig?.icon}
          fields={formConfig?.fields || []}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          submitText="Add Record"
          cancelText="Cancel"
          loading={isFormLoading}
          showHeader={true}
          showFooter={true}
        />
        {formError && (
          <div style={{ color: 'red', padding: '1rem', textAlign: 'center' }}>
            Error: {formError}
          </div>
        )}
      </PopUp>
    </div>
  );
}