
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import ProfileHeader from "../Components/StudentProfile/profileHeader";
import ProfileInfoCard from "../Components/StudentProfile/profileInfoCard";
import QuickActions from "../Components/StudentProfile/QuickActions";
import RequestsList from "../Components/StudentProfile/RequestsList";
import StatCardsContainer from "../Components/Cards/StatCardsContainer";
import MidPageNavbar from "../Components/CoursePage/Content/MidPageNavBar";
import Table from "../Components/Tables/Table";

import { profileConfigs } from "../../Static/GenericProfile/profileConfig";
import { ActionButtons, SummaryCards, TableSection } from "../../Static/GenericProfile/UIHelper";
import { generateScheduleData, generateResourcesData } from "../../Static/GenericProfile/dataUtils";

import "./GenericProfile.css";

const GenericProfile = ({ cardSize = "default", initialSection = "overview" }) => {
  const { entityType, id } = useParams();
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState(null);
  const [stats, setStats] = useState({});
  const [statCards, setStatCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(initialSection);
  const [selectedYear, setSelectedYear] = useState("");
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const validEntityTypes = ['student', 'lecturer'];
        if (!entityType || !validEntityTypes.includes(entityType)) {
          throw new Error(`Invalid entity type: "${entityType}"`);
        }

        const sanitizedId = parseInt(id);
        if (isNaN(sanitizedId) || sanitizedId <= 0) {
          throw new Error(`Invalid ID: "${id}"`);
        }

        const config = profileConfigs[entityType];
        if (!config || !config.dataSource?.length) {
          throw new Error(`No data available for ${entityType}`);
        }

        // Backend placeholder
        /*
        const response = await fetch(`/api/${entityType}/${sanitizedId}`);
        if (!response.ok) throw new Error(`Failed to fetch ${entityType} data`);
        const data = await response.json();
        */
        const data = config.getProfileData(sanitizedId);

        const mainEntity = entityType === "student" ? data.student : data.lecturer;
        if (!mainEntity) {
          throw new Error(`${entityType} with ID ${sanitizedId} not found`);
        }

        const calculatedStats = config.getStats(data);
        const cards = config.getStatCards(calculatedStats);

        setProfileData(data);
        setStats(calculatedStats);
        setStatCards(cards);

      } catch (err) {
        console.error('Profile loading error:', err.message);
        setError(err.message);
        setTimeout(() => {
          const dashboardRoute = entityType === 'student' ? '/students' : '/lecturers';
          navigate(dashboardRoute, { replace: true });
        }, 5000);
      } finally {
        setLoading(false);
      }
    };

    if (entityType && id) {
      loadProfile();
    } else {
      setError('Missing required parameters');
      setLoading(false);
    }
  }, [entityType, id, navigate]);

  const handleEdit = (row) => {
    console.log("✏️ Edit:", row);
    // Backend placeholder
    /*
    fetch(`/api/${entityType}/${row.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row)
    }).then(response => {
      if (!response.ok) throw new Error('Failed to update record');
      console.log('Record updated:', row);
    }).catch(err => console.error('Edit error:', err));
    */
  };

  const handleDelete = (row) => {
    if (window.confirm("Are you sure?")) {
      console.log("🗑️ Delete:", row);
      // Backend placeholder
      /*
      fetch(`/api/${entityType}/${row.id}`, {
        method: 'DELETE'
      }).then(response => {
        if (!response.ok) throw new Error('Failed to delete record');
        console.log('Record deleted:', row);
      }).catch(err => console.error('Delete error:', err));
      */
    }
  };

  const handleCardClick = (card) => {
    const sectionMap = {
      "completed-courses": "grades",
      "active-courses": "courses",
      "pending-requests": "requests",
      "current-enrollments": "enrollments",
      "avg-rating": "resources",
      "total-students": "resources",
      "weekly-hours": "schedule"
    };
    
    if (sectionMap[card.id]) {
      setActiveSection(sectionMap[card.id]);
    }
  };

  const renderSection = () => {
    if (!profileData) return <div>No data available</div>;

    const actionButtons = ActionButtons({ onEdit: handleEdit, onDelete: handleDelete });

    switch (activeSection) {
      case "grades":
        return (
          <TableSection 
            title="Academic Records" 
            description="Student grades and academic performance"
            data={profileData.grades}
            actionButtons={actionButtons}
          />
        );

      case "courses":
        return (
          <TableSection 
            title="Teaching Courses" 
            description="Current and past courses taught"
            data={profileData.courses}
            actionButtons={actionButtons}
          />
        );

      case "requests":
        return <RequestsList requests={profileData.requests || []} />;

      case "enrollments":
        return (
          <TableSection 
            title="Current Enrollments" 
            description="Courses currently enrolled for the academic term"
            data={profileData.enrollments}
            actionButtons={actionButtons}
            customColumns={[
              { key: 'courseCode', label: 'Course Code', sortable: true },
              { key: 'courseName', label: 'Course Name', sortable: true },
              { key: 'credits', label: 'Credits', sortable: true },
              { key: 'semester', label: 'Semester', sortable: true },
              { key: 'instructor', label: 'Instructor', sortable: true }
            ]}
          />
        );

      case "schedule":
        const scheduleData = generateScheduleData(profileData);
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
            actionButtons={actionButtons}
          >
            <SummaryCards data={summaryData} colorScheme={colorScheme} />
          </TableSection>
        );

      case "resources":
        const resourcesData = generateResourcesData();
        return (
          <TableSection 
            title="Resources & Materials" 
            description="Course materials, digital library, and educational resources"
            data={resourcesData.courseMaterials}
            actionButtons={[
              (row) => <button title="Download"><Download size={14} /></button>,
              (row) => <button title="Preview"><Eye size={14} /></button>,
              ...actionButtons
            ]}
          />
        );

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
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading {entityType} profile...</p>
      </div>
    );
  }

  if (!profileData || error) {
    return (
      <div className="error-container">
        <h2>Profile Not Found</h2>
        <p>{error}</p>
        <p>Redirecting to dashboard in 5 seconds...</p>
      </div>
    );
  }

  const mainEntity = entityType === "student" ? profileData.student : profileData.lecturer;
  const config = profileConfigs[entityType];

  return (
    <div className="student-profile-container">
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
    </div>
  );
};

export default GenericProfile;
