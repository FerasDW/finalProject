// GenericProfile.jsx - Main Component
import React from "react";
import { 
  Edit, 
  Eye, 
  Check, 
  X, 
  Download,
  Clock,
  User,
  Book,
  FileText,
  Users,
  TrendingUp
} from "lucide-react";

import ProfileHeader from "../Components/StudentProfile/profileHeader";
import ProfileInfoCard from "../Components/StudentProfile/profileInfoCard";
import QuickActions from "../Components/StudentProfile/QuickActions";
import StatCardsContainer from "../Components/Cards/StatCardsContainer";
import MidPageNavbar from "../Components/CoursePage/Content/MidPageNavBar";
import DynamicTable from "../Components/Tables/Table";
import PopUp from "../Components/Cards/PopUp.jsx";
import DynamicForm from "../Components/Forms/dynamicForm.jsx";

import { useGenericProfile } from "../../Hooks/useGenericProfile";
import { 
  profileConfigs,
  generateWorkingHoursCards,
  generateProfileCards,
  getColumnConfigs,
  getHiddenColumns,
  processScheduleData,
  processResourcesData,
  getGradeFormFields,
  getEditGradeFormFields,
  getLecturerCourseFormFields,
  getCourseFormFields,
  getEnrollmentFormFields,
  getScheduleFormFields,
  getResourceFormFields
} from "../../Utils/genericProfileUtils.js";

import "./GenericProfile.css";

const GenericProfile = ({ cardSize = "default", initialSection = "overview" }) => {
  const {
    // State
    profileData,
    stats,
    statCards,
    loading,
    error,
    activeSection,
    selectedYear,
    showActions,
    uploadedFiles,
    fileUploadProgress,
    
    // Modal states
    editGradeModalOpen,
    addGradeModalOpen,
    editCourseModalOpen,
    addCourseModalOpen,
    editEnrollmentModalOpen,
    addEnrollmentModalOpen,
    editScheduleModalOpen,
    addScheduleModalOpen,
    editResourceModalOpen,
    addResourceModalOpen,
    viewRequestModalOpen,
    responseRequestModalOpen,
    
    // Form state
    selectedRecord,
    formData,
    requestResponse,
    
    // Setters
    setActiveSection,
    setSelectedYear,
    setShowActions,
    setEditGradeModalOpen,
    setAddGradeModalOpen,
    setEditCourseModalOpen,
    setAddCourseModalOpen,
    setEditEnrollmentModalOpen,
    setAddEnrollmentModalOpen,
    setEditScheduleModalOpen,
    setAddScheduleModalOpen,
    setEditResourceModalOpen,
    setAddResourceModalOpen,
    setViewRequestModalOpen,
    setResponseRequestModalOpen,
    setRequestResponse,
    
    // Handlers
    handleEditGrade,
    handleAddGrade,
    handleGradeSubmit,
    handleEditCourse,
    handleAddCourse,
    handleCourseSubmit,
    handleEditEnrollment,
    handleAddEnrollment,
    handleEnrollmentSubmit,
    handleEditSchedule,
    handleAddSchedule,
    handleScheduleSubmit,
    handleEditResource,
    handleAddResource,
    handleResourceSubmit,
    handleDownloadResource,
    handlePreviewResource,
    handleViewRequest,
    handleResponseRequest,
    handleApproveRequest,
    handleRejectRequest,
    handleSubmitResponse,
    handleCardClick,
    
    // Derived data
    entityType,
    id,
    mainEntity
  } = useGenericProfile(initialSection);

  // Get enrolled courses for grade form
  const getStudentEnrolledCourses = () => {
    if (!profileData || !profileData.enrollments) return [];
    return profileData.enrollments.map(enrollment => ({
      value: enrollment.courseCode,
      label: `${enrollment.courseCode} - ${enrollment.courseName}`
    }));
  };

  // File Upload Progress Component
  const FileUploadProgress = ({ progress }) => {
    if (!progress.status) return null;
    
    return (
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'white',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 10000,
        minWidth: '200px'
      }}>
        <div style={{ marginBottom: '8px', fontWeight: '600' }}>
          {progress.status === 'uploading' && 'Uploading...'}
          {progress.status === 'completed' && 'Upload Complete!'}
          {progress.status === 'error' && 'Upload Failed'}
        </div>
        <div style={{
          width: '100%',
          height: '4px',
          background: '#e5e7eb',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progress.progress}%`,
            height: '100%',
            background: progress.status === 'error' ? '#ef4444' : '#10b981',
            transition: 'width 0.3s ease'
          }} />
        </div>
        <div style={{ 
          fontSize: '12px', 
          color: '#666', 
          marginTop: '4px' 
        }}>
          {progress.progress}%
        </div>
      </div>
    );
  };

  // Summary Cards Component
  const SummaryCards = ({ data, colorScheme }) => {
    return (
      <div className="summary-cards-container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        {data.map((item, index) => (
          <div 
            key={index}
            className="summary-card"
            style={{
              background: colorScheme[index] || '#3b82f6',
              borderRadius: '12px',
              padding: '20px',
              color: 'white',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s ease'
            }}
          >
            <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
              {item.value}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Resources Stats Component
  const ResourcesStats = ({ data }) => {
    const stats = [
      {
        icon: <FileText className="stat-icon" />,
        number: data?.length || 0,
        label: "Total Resources"
      },
      {
        icon: <Download className="stat-icon" />,
        number: "127",
        label: "Downloads"
      },
      {
        icon: <Users className="stat-icon" />,
        number: "89",
        label: "Active Users"
      },
      {
        icon: <TrendingUp className="stat-icon" />,
        number: "4.8",
        label: "Avg Rating"
      }
    ];

    return (
      <div className="resources-stats" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        {stats.map((stat, index) => (
          <div key={index} className="stat-card" style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ 
              color: '#3b82f6', 
              background: '#eff6ff', 
              borderRadius: '8px', 
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <span style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#1f2937',
                display: 'block'
              }}>
                {stat.number}
              </span>
              <span style={{ 
                fontSize: '14px', 
                color: '#6b7280'
              }}>
                {stat.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Section Header Component
  const SectionHeader = ({ icon, title, description }) => (
    <div className="section-header" style={{
      marginBottom: '24px',
      paddingBottom: '16px',
      borderBottom: '1px solid #e5e7eb'
    }}>
      <h3 style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '20px',
        fontWeight: '600',
        color: '#1f2937',
        margin: '0 0 8px 0'
      }}>
        <span style={{ color: '#3b82f6' }}>{icon}</span>
        {title}
      </h3>
      <p style={{
        color: '#6b7280',
        margin: 0,
        fontSize: '14px'
      }}>
        {description}
      </p>
    </div>
  );

  // Table Section Wrapper Component
  const TableSection = ({ 
    title, 
    description, 
    data, 
    showAddButton = true, 
    onAddClick, 
    actionButtons = [],
    entityType = "weekly-schedule",
    icon = "default",
    columnConfig = {},
    hiddenColumns = [],
    children
  }) => {
    return (
      <div className="table-section">
        {children}
        <DynamicTable
          data={data}
          title={title}
          entityType={entityType}
          icon={icon}
          searchPlaceholder={`Search ${entityType}...`}
          addButtonText={`Add ${entityType.slice(0, -1)}`}
          showAddButton={showAddButton}
          onAddClick={onAddClick}
          actionButtons={actionButtons}
          columnConfig={columnConfig}
          hiddenColumns={hiddenColumns}
          rowsPerPage={10}
          compact={false}
        />
      </div>
    );
  };

  const renderSection = () => {
    if (!profileData) return <div>No data available</div>;

    switch (activeSection) {
      case "grades":
        return (
          <TableSection 
            title="Academic Records" 
            description="Student grades and academic performance"
            data={profileData.grades || []}
            entityType="academic-records"
            icon="award"
            showAddButton={true}
            onAddClick={handleAddGrade}
            columnConfig={getColumnConfigs('academic-records')}
            hiddenColumns={getHiddenColumns('academic-records')}
            actionButtons={[
              (row) => (
                <button 
                  onClick={() => handleEditGrade(row)} 
                  className="action-btn edit-btn"
                  title="Edit Grade"
                  style={{
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  <Edit size={14} />
                  Edit
                </button>
              )
            ]}
          />
        );

      case "courses":
        return (
          <TableSection 
            title={entityType === 'lecturer' ? "Course Assignments" : "Teaching Courses"}
            description={entityType === 'lecturer' ? "Assign lecturer to existing courses" : "Current and past courses taught"}
            data={profileData.courses || []}
            entityType="courses"
            icon="courses"
            showAddButton={true}
            onAddClick={handleAddCourse}
            columnConfig={getColumnConfigs('courses')}
            hiddenColumns={getHiddenColumns('courses')}
            actionButtons={[
              (row) => (
                <button 
                  onClick={() => handleEditCourse(row)} 
                  className="action-btn edit-btn"
                  title="Edit Course"
                  style={{
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  <Edit size={14} />
                  Edit
                </button>
              )
            ]}
          />
        );

      case "requests":
        return (
          <TableSection
            title="Student Requests"
            description="Manage student requests and communications"
            data={profileData.requests || []}
            entityType="student-requests"
            icon="mail"
            showAddButton={false}
            columnConfig={getColumnConfigs('student-requests')}
            hiddenColumns={getHiddenColumns('student-requests')}
            actionButtons={[
              (row) => (
                <button 
                  onClick={() => handleViewRequest(row)} 
                  className="action-btn view-btn"
                  title="View Request"
                  style={{
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    marginRight: '4px'
                  }}
                >
                  <Eye size={14} />
                  View
                </button>
              ),
              (row) => (
                <button 
                  onClick={() => handleResponseRequest(row)} 
                  className="action-btn response-btn"
                  title="Respond"
                  style={{
                    background: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    marginRight: '4px'
                  }}
                >
                  <FileText size={14} />
                  Respond
                </button>
              ),
              (row) => (
                <button 
                  onClick={() => handleApproveRequest(row)} 
                  className="action-btn approve-btn"
                  title="Approve"
                  disabled={row.status === 'approved'}
                  style={{
                    background: row.status === 'approved' ? '#d1d5db' : '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: row.status === 'approved' ? 'not-allowed' : 'pointer',
                    fontSize: '12px',
                    marginRight: '4px'
                  }}
                >
                  <Check size={14} />
                  Approve
                </button>
              ),
              (row) => (
                <button 
                  onClick={() => handleRejectRequest(row)} 
                  className="action-btn reject-btn"
                  title="Reject"
                  disabled={row.status === 'rejected'}
                  style={{
                    background: row.status === 'rejected' ? '#d1d5db' : '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: row.status === 'rejected' ? 'not-allowed' : 'pointer',
                    fontSize: '12px'
                  }}
                >
                  <X size={14} />
                  Reject
                </button>
              )
            ]}
          />
        );

      case "enrollments":
        return (
          <TableSection 
            title="Current Enrollments" 
            description="Courses currently enrolled for the academic term"
            data={profileData.enrollments || []}
            entityType="enrollments"
            icon="users"
            showAddButton={true}
            onAddClick={handleAddEnrollment}
            columnConfig={getColumnConfigs('enrollments')}
            hiddenColumns={getHiddenColumns('enrollments')}
            actionButtons={[
              (row) => (
                <button 
                  onClick={() => handleEditEnrollment(row)} 
                  className="action-btn edit-btn"
                  title="Edit Enrollment"
                  style={{
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  <Edit size={14} />
                  Edit
                </button>
              )
            ]}
          />
        );

      case "schedule":
        if (entityType === 'lecturer') {
          const workingHoursCards = generateWorkingHoursCards();
          const workingHoursData = [
            {
              id: 1,
              day: "Monday",
              startTime: "09:00",
              endTime: "17:00",
              availability: "available",
              notes: "Regular office hours"
            },
            {
              id: 2,
              day: "Tuesday",
              startTime: "10:00",
              endTime: "16:00",
              availability: "preferred",
              notes: "Preferred teaching hours"
            },
            {
              id: 3,
              day: "Wednesday",
              startTime: "09:00",
              endTime: "15:00",
              availability: "busy",
              notes: "Research time"
            },
            {
              id: 4,
              day: "Thursday",
              startTime: "10:00",
              endTime: "17:00",
              availability: "available",
              notes: "Teaching and consultations"
            },
            {
              id: 5,
              day: "Friday",
              startTime: "09:00",
              endTime: "14:00",
              availability: "preferred",
              notes: "Lectures only"
            }
          ];
          
          return (
            <div className="working-hours-section">
              <SectionHeader
                icon={<Clock />}
                title="Working Hours & Availability"
                description="Manage your weekly schedule and availability for teaching and office hours"
              />

              <StatCardsContainer
                cards={workingHoursCards}
                size={cardSize}
                onCardClick={handleCardClick}
                columns={4}
              />

              <TableSection 
                title="Weekly Schedule" 
                description="Set your working hours and availability"
                data={workingHoursData}
                entityType="weekly-schedule"
                icon="calendar"
                showAddButton={true}
                onAddClick={handleAddSchedule}
                columnConfig={getColumnConfigs('weekly-schedule')}
                hiddenColumns={getHiddenColumns('weekly-schedule')}
                actionButtons={[
                  (row) => (
                    <button 
                      onClick={() => handleEditSchedule(row)} 
                      className="action-btn edit-btn"
                      title="Edit Hours"
                      style={{
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      <Edit size={14} />
                      Edit
                    </button>
                  )
                ]}
              />
            </div>
          );
        } else {
          const scheduleData = processScheduleData(profileData.enrollments);
          const summaryData = [
            { value: scheduleData.summary.weeklyHours, label: 'Weekly Hours' },
            { value: scheduleData.summary.totalStudents, label: 'Total Students' },
            { value: scheduleData.summary.uniqueCourses, label: 'Unique Courses' },
            { value: scheduleData.summary.totalClasses, label: 'Total Classes' }
          ];
          const colorScheme = [
            'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            'linear-gradient(135deg, #10b981 0%, #047857 100%)',
            'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)'
          ];

          return (
            <TableSection 
              title="Teaching Schedule" 
              description="Current semester teaching schedule and class details"
              data={scheduleData.schedule}
              entityType="schedules"
              icon="calendar"
              showAddButton={true}
              onAddClick={handleAddSchedule}
              columnConfig={getColumnConfigs('schedules')}
              hiddenColumns={getHiddenColumns('schedules')}
              actionButtons={[
                (row) => (
                  <button 
                    onClick={() => handleEditSchedule(row)} 
                    className="action-btn edit-btn"
                    title="Edit Schedule"
                    style={{
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                )
              ]}
            >
              <SummaryCards data={summaryData} colorScheme={colorScheme} />
            </TableSection>
          );
        }

      case "resources":
        if (entityType === 'lecturer') {
          const profileCards = generateProfileCards();
          
          return (
            <div className="lecturer-profile-section">
              <SectionHeader
                icon={<User />}
                title="Professional Profile"
                description="Manage your academic profile, CV, research, and career milestones"
              />

              <StatCardsContainer
                cards={profileCards}
                size={cardSize}
                onCardClick={handleCardClick}
                columns={4}
              />

              <TableSection 
                title="Professional Documents" 
                description="Manage CV, research papers, and academic documents"
                data={profileData.resources || []}
                entityType="documents"
                icon="documents"
                showAddButton={true}
                onAddClick={handleAddResource}
                columnConfig={getColumnConfigs('documents')}
                hiddenColumns={getHiddenColumns('documents')}
                actionButtons={[
                  (row) => (
                    <button 
                      onClick={() => handleDownloadResource(row)} 
                      className="action-btn download-btn"
                      title="Download"
                      style={{
                        background: '#8b5cf6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        marginRight: '4px'
                      }}
                    >
                      <Download size={14} />
                      Download
                    </button>
                  ),
                  (row) => (
                    <button 
                      onClick={() => handlePreviewResource(row)} 
                      className="action-btn view-btn"
                      title="Preview"
                      style={{
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        marginRight: '4px'
                      }}
                    >
                      <Eye size={14} />
                      Preview
                    </button>
                  ),
                  (row) => (
                    <button 
                      onClick={() => handleEditResource(row)} 
                      className="action-btn edit-btn"
                      title="Edit"
                      style={{
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      <Edit size={14} />
                      Edit
                    </button>
                  )
                ]}
              />
            </div>
          );
        } else {
          const resourcesData = processResourcesData(profileData.enrollments);
          return (
            <div className="resources-section">
              <SectionHeader
                icon={<Book />}
                title="Resources & Course Materials"
                description="Digital library, course materials, and educational resources"
              />

              <ResourcesStats data={resourcesData.courseMaterials} />

              <TableSection 
                title="Course Materials" 
                description="Upload and manage course resources"
                data={resourcesData.courseMaterials || []}
                entityType="files"
                icon="documents"
                showAddButton={true}
                onAddClick={handleAddResource}
                columnConfig={getColumnConfigs('files')}
                hiddenColumns={getHiddenColumns('files')}
                actionButtons={[
                  (row) => (
                    <button 
                      onClick={() => handleDownloadResource(row)} 
                      className="action-btn download-btn"
                      title="Download"
                      style={{
                        background: '#8b5cf6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        marginRight: '4px'
                      }}
                    >
                      <Download size={14} />
                      Download
                    </button>
                  ),
                  (row) => (
                    <button 
                      onClick={() => handlePreviewResource(row)} 
                      className="action-btn view-btn"
                      title="Preview"
                      style={{
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        marginRight: '4px'
                      }}
                    >
                      <Eye size={14} />
                      Preview
                    </button>
                  ),
                  (row) => (
                    <button 
                      onClick={() => handleEditResource(row)} 
                      className="action-btn edit-btn"
                      title="Edit"
                      style={{
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      <Edit size={14} />
                      Edit
                    </button>
                  )
                ]}
              />
            </div>
          );
        }

      default:
        return (
          <StatCardsContainer
            cards={statCards}
            size={cardSize}
            onCardClick={handleCardClick}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="loading-container" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        gap: '16px'
      }}>
        <div className="loading-spinner" style={{
          width: '40px',
          height: '40px',
          border: '4px solid #e5e7eb',
          borderTop: '4px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#6b7280', margin: 0 }}>Loading {entityType} profile...</p>
      </div>
    );
  }

  if (!profileData || error) {
    return (
      <div className="error-container" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        gap: '16px',
        padding: '20px',
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '8px',
        margin: '20px'
      }}>
        <h2 style={{ color: '#dc2626', margin: 0 }}>Profile Not Found</h2>
        <p style={{ color: '#7f1d1d', margin: 0, textAlign: 'center' }}>{error}</p>
        <p style={{ color: '#7f1d1d', margin: 0 }}>Redirecting to dashboard in 5 seconds...</p>
      </div>
    );
  }

  const config = profileConfigs[entityType];

  return (
    <div className="student-profile-container">
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .action-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          }
          
          .stat-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }
          
          .summary-card:hover {
            transform: translateY(-2px);
          }
        `}
      </style>
      
      <ProfileHeader 
        entity={mainEntity}
        entityType={entityType}
        onActionsToggle={() => setShowActions(!showActions)} 
      />

      <div className="main-container">
        <div className="content-wrapper">
          <ProfileInfoCard 
            entity={mainEntity}
            entityType={entityType}
          />

          <div className="main-content">
            <div className="navbar-wrapper">
              <MidPageNavbar
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                sections={config.sections}
                sectionLabels={config.sectionLabels}
              />
            </div>
            <div className="tab-content">{renderSection()}</div>
          </div>
        </div>
      </div>

      <QuickActions 
        show={showActions} 
        entityType={entityType}
        entity={mainEntity}
      />

      {/* File Upload Progress Indicator */}
      <FileUploadProgress progress={fileUploadProgress} />

      {/* Grade Edit Modal */}
      <PopUp
        isOpen={editGradeModalOpen}
        onClose={() => setEditGradeModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <DynamicForm
          title="Edit Grade"
          fields={getEditGradeFormFields()}
          onSubmit={handleGradeSubmit}
          onCancel={() => setEditGradeModalOpen(false)}
          submitText="Save Changes"
          initialData={formData}
        />
      </PopUp>

      {/* Add Grade Modal */}
      <PopUp
        isOpen={addGradeModalOpen}
        onClose={() => setAddGradeModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <DynamicForm
          title="Add New Grade"
          fields={getGradeFormFields(getStudentEnrolledCourses())}
          onSubmit={handleGradeSubmit}
          onCancel={() => setAddGradeModalOpen(false)}
          submitText="Add Grade"
          initialData={formData}
        />
      </PopUp>

      {/* Course Edit Modal */}
      <PopUp
        isOpen={editCourseModalOpen}
        onClose={() => setEditCourseModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <DynamicForm
          title={entityType === 'lecturer' ? "Edit Course Assignment" : "Edit Course"}
          fields={entityType === 'lecturer' ? getLecturerCourseFormFields() : getCourseFormFields()}
          onSubmit={handleCourseSubmit}
          onCancel={() => setEditCourseModalOpen(false)}
          submitText="Save Changes"
          initialData={formData}
        />
      </PopUp>

      {/* Add Course Modal */}
      <PopUp
        isOpen={addCourseModalOpen}
        onClose={() => setAddCourseModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <DynamicForm
          title={entityType === 'lecturer' ? "Assign Course" : "Add Course"}
          fields={entityType === 'lecturer' ? getLecturerCourseFormFields() : getCourseFormFields()}
          onSubmit={handleCourseSubmit}
          onCancel={() => setAddCourseModalOpen(false)}
          submitText={entityType === 'lecturer' ? "Assign Course" : "Add Course"}
          initialData={formData}
        />
      </PopUp>

      {/* Enrollment Edit Modal */}
      <PopUp
        isOpen={editEnrollmentModalOpen}
        onClose={() => setEditEnrollmentModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <DynamicForm
          title="Edit Enrollment"
          fields={getEnrollmentFormFields()}
          onSubmit={handleEnrollmentSubmit}
          onCancel={() => setEditEnrollmentModalOpen(false)}
          submitText="Save Changes"
          initialData={formData}
        />
      </PopUp>

      {/* Add Enrollment Modal */}
      <PopUp
        isOpen={addEnrollmentModalOpen}
        onClose={() => setAddEnrollmentModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <DynamicForm
          title="Add Enrollment"
          fields={getEnrollmentFormFields()}
          onSubmit={handleEnrollmentSubmit}
          onCancel={() => setAddEnrollmentModalOpen(false)}
          submitText="Add Enrollment"
          initialData={formData}
        />
      </PopUp>

      {/* Schedule Edit Modal */}
      <PopUp
        isOpen={editScheduleModalOpen}
        onClose={() => setEditScheduleModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <DynamicForm
          title="Edit Schedule"
          fields={getScheduleFormFields()}
          onSubmit={handleScheduleSubmit}
          onCancel={() => setEditScheduleModalOpen(false)}
          submitText="Save Changes"
          initialData={formData}
        />
      </PopUp>

      {/* Add Schedule Modal */}
      <PopUp
        isOpen={addScheduleModalOpen}
        onClose={() => setAddScheduleModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <DynamicForm
          title="Add Schedule Entry"
          fields={getScheduleFormFields()}
          onSubmit={handleScheduleSubmit}
          onCancel={() => setAddScheduleModalOpen(false)}
          submitText="Add Schedule"
          initialData={formData}
        />
      </PopUp>

      {/* Resource Edit Modal */}
      <PopUp
        isOpen={editResourceModalOpen}
        onClose={() => setEditResourceModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <DynamicForm
          title="Edit Resource"
          fields={getResourceFormFields(true)}
          onSubmit={handleResourceSubmit}
          onCancel={() => setEditResourceModalOpen(false)}
          submitText="Save Changes"
          initialData={formData}
        />
      </PopUp>

      {/* Add Resource Modal */}
      <PopUp
        isOpen={addResourceModalOpen}
        onClose={() => setAddResourceModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <DynamicForm
          title="Add Resource"
          fields={getResourceFormFields(false)}
          onSubmit={handleResourceSubmit}
          onCancel={() => setAddResourceModalOpen(false)}
          submitText="Add Resource"
          initialData={formData}
        />
      </PopUp>

      {/* View Request Modal */}
      <PopUp
        isOpen={viewRequestModalOpen}
        onClose={() => setViewRequestModalOpen(false)}
        size="large"
        showCloseButton={true}
      >
        {selectedRecord && (
          <div className="request-details">
            <h3>Request Details</h3>
            <div className="request-info" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div className="info-row">
                <strong>From:</strong> {selectedRecord.sender || selectedRecord.student}
              </div>
              <div className="info-row">
                <strong>Type:</strong> {selectedRecord.type || selectedRecord.requestType}
              </div>
              <div className="info-row">
                <strong>Subject:</strong> {selectedRecord.subject}
              </div>
              <div className="info-row">
                <strong>Date:</strong> {selectedRecord.date}
              </div>
              {selectedRecord.time && (
                <div className="info-row">
                  <strong>Time:</strong> {selectedRecord.time}
                </div>
              )}
              <div className="info-row">
                <strong>Priority:</strong> {selectedRecord.priority}
              </div>
              <div className="info-row">
                <strong>Status:</strong> {selectedRecord.status}
              </div>
              <div className="info-row">
                <strong>Message:</strong>
                <p className="message-content" style={{
                  background: '#f9fafb',
                  padding: '12px',
                  borderRadius: '6px',
                  margin: '8px 0 0 0',
                  border: '1px solid #e5e7eb'
                }}>
                  {selectedRecord.message || selectedRecord.description}
                </p>
              </div>
              {selectedRecord.response && (
                <div className="info-row">
                  <strong>Response:</strong>
                  <p className="response-content" style={{
                    background: '#f0f9ff',
                    padding: '12px',
                    borderRadius: '6px',
                    margin: '8px 0 0 0',
                    border: '1px solid #bae6fd'
                  }}>
                    {selectedRecord.response}
                  </p>
                  <small style={{ color: '#6b7280' }}>
                    Responded on: {selectedRecord.responseDate}
                  </small>
                </div>
              )}
            </div>
          </div>
        )}
      </PopUp>

      {/* Response Request Modal */}
      <PopUp
        isOpen={responseRequestModalOpen}
        onClose={() => setResponseRequestModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        {selectedRecord && (
          <div className="response-request">
            <h3>Respond to Request</h3>
            <div className="request-summary" style={{
              background: '#f9fafb',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #e5e7eb'
            }}>
              <div className="summary-row" style={{ marginBottom: '8px' }}>
                <strong>From:</strong> {selectedRecord.sender || selectedRecord.student}
              </div>
              <div className="summary-row" style={{ marginBottom: '8px' }}>
                <strong>Subject:</strong> {selectedRecord.subject}
              </div>
              <div className="summary-row">
                <strong>Original Message:</strong>
                <p className="original-message" style={{
                  margin: '8px 0 0 0',
                  padding: '8px',
                  background: 'white',
                  borderRadius: '4px',
                  border: '1px solid #d1d5db'
                }}>
                  {selectedRecord.message || selectedRecord.description}
                </p>
              </div>
            </div>
            <div className="response-form">
              <label htmlFor="response-textarea" style={{
                display: 'block',
                fontWeight: '500',
                marginBottom: '8px',
                color: '#374151'
              }}>
                Your Response:
              </label>
              <textarea
                id="response-textarea"
                value={requestResponse}
                onChange={(e) => setRequestResponse(e.target.value)}
                placeholder="Type your response here..."
                rows={6}
                className="response-textarea"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
              <div className="response-actions" style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
                marginTop: '16px'
              }}>
                <button 
                  onClick={() => setResponseRequestModalOpen(false)}
                  className="btn btn-secondary"
                  style={{
                    background: '#f3f4f6',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmitResponse}
                  className="btn btn-primary"
                  disabled={!requestResponse.trim()}
                  style={{
                    background: requestResponse.trim() ? '#3b82f6' : '#d1d5db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    cursor: requestResponse.trim() ? 'pointer' : 'not-allowed',
                    fontSize: '14px'
                  }}
                >
                  Send Response
                </button>
              </div>
            </div>
          </div>
        )}
      </PopUp>
    </div>
  );
};

export default GenericProfile;