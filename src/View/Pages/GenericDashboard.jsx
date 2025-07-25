// GenericDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./GenericDashboard.module.scss";
import studentsData from "../../Static/students";
import lecturersData from "../../Static/lecturers"; // You'll need to create this
import StudentTable from "../Components/Tables/Table";
import StatCardsContainer from "../Components/Cards/StatCardsContainer";
import DynamicFilter from "../Components/DynamicFilter"; // Import your dynamic filter
import { Users, BookOpen, GraduationCap, CalendarDays, UserCheck, Clock, Calendar, ArrowRight, Star, Award, TrendingUp, Building } from "lucide-react";

// Dashboard configurations
const dashboardConfigs = {
  students: {
    title: "Student Management System",
    subtitle: "Manage students across divisions, academic years, and learning groups",
    data: studentsData || [],
    entityName: "student",
    primaryFilter: "division",
    primaryFilterLabel: "Divisions",
    secondaryFilters: [
      { label: "Academic Years", name: "academicYear", type: "select" },
      { label: "Learning Groups", name: "learningGroup", type: "select" },
      { label: "Graduation Years", name: "graduationYear", type: "buttons" }
    ],
    stats: {
      total: (data) => data.length,
      active: (data) => data.filter(item => item.status === "Active").length,
      graduated: (data) => data.filter(item => item.status === "Graduated").length,
      upcoming: () => 10
    },
    cards: [
      {
        id: 'total-students',
        title: 'Total Students',
        statKey: 'total',
        icon: <Users />,
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
      },
      {
        id: 'active-students',
        title: 'Active Students',
        statKey: 'active',
        icon: <BookOpen />,
        gradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)'
      },
      {
        id: 'graduated',
        title: 'Graduated',
        statKey: 'graduated',
        icon: <GraduationCap />,
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
      },
      {
        id: 'upcoming-events',
        title: 'Upcoming Events',
        statKey: 'upcoming',
        icon: <CalendarDays />,
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)'
      }
    ]
  },
  lecturers: {
    title: "Lecturer Management System",
    subtitle: "Manage lecturers across departments, specializations, and employment status",
    data: lecturersData || [],
    entityName: "lecturer",
    primaryFilter: "department",
    primaryFilterLabel: "Departments",
    secondaryFilters: [
      { label: "Specializations", name: "specialization", type: "select" },
      { label: "Employment Types", name: "employmentType", type: "select" },
      { label: "Experience Years", name: "experience", type: "buttons" }
    ],
    stats: {
      totalActive: (data) => data.filter(item => item.status === "Active").length,
      avgRating: (data) => {
        const ratings = data.filter(item => item.rating && item.status === "Active").map(item => item.rating);
        return ratings.length > 0 ? (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1) : "N/A";
      },
      topPerformers: (data) => data.filter(item => item.rating >= 4.5 && item.status === "Active").length,
      departmentCount: (data) => new Set(data.filter(item => item.status === "Active").map(item => item.department)).size
    },
    cards: [
      {
        id: 'active-lecturers',
        title: 'Active Lecturers',
        statKey: 'totalActive',
        icon: <UserCheck />,
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
      },
      {
        id: 'avg-rating',
        title: 'Average Rating',
        statKey: 'avgRating',
        icon: <Star />,
        gradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)'
      },
      {
        id: 'top-performers',
        title: 'Top Performers (4.5+)',
        statKey: 'topPerformers',
        icon: <Award />,
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
      },
      {
        id: 'active-departments',
        title: 'Active Departments',
        statKey: 'departmentCount',
        icon: <Building />,
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)'
      }
    ]
  }
};

export default function GenericDashboard({ entityType = "students" }) {
  const config = dashboardConfigs[entityType];
  const navigate = useNavigate();
  
  // State management
  const [primaryFilter, setPrimaryFilter] = useState("All");
  const [filterValues, setFilterValues] = useState({});
  const [filteredData, setFilteredData] = useState(config?.data || []);
  const [isLoading, setIsLoading] = useState(false);

  // Validation on mount
  useEffect(() => {
    if (!config) {
      navigate('/students');
      return;
    }

    if (!config.data || config.data.length === 0) {
      console.warn(`⚠️ No data available for ${entityType}`);
    }
  }, [entityType, config, navigate]);

  // Initialize filter values
  useEffect(() => {
    if (!config) return;
    
    const initialValues = {};
    config.secondaryFilters.forEach(filter => {
      initialValues[filter.name] = "all";
    });
    setFilterValues(initialValues);
    setPrimaryFilter("All");
  }, [entityType, config]);

  // Generate filter options with validation
  const getPrimaryOptions = () => {
    if (!config?.data) return ["All"];
    try {
      const values = Array.from(new Set(config.data.map((item) => item[config.primaryFilter]))).filter(Boolean).sort();// Ensure unique and sorted values
      return ["All", ...values];
    } catch (error) {
      return ["All"];
    }
  };

  const getFilterOptions = (fieldName) => {
    if (!config?.data) return [];
    try {
      return Array.from(new Set(config.data.map((item) => item[fieldName]))).filter(Boolean).sort();
    } catch (error) {
      return [];
    }
  };

  // Prepare filters for DynamicFilter component
  const dynamicFilters = config?.secondaryFilters
    ?.filter(filter => filter.type === "select")
    ?.map(filter => ({
      label: filter.label,
      name: filter.name,
      title: filter.name,
      options: getFilterOptions(filter.name)
    })) || [];

  // Get button filters
  const buttonFilters = config?.secondaryFilters?.filter(filter => filter.type === "buttons") || [];

  // Apply filters with error handling
  useEffect(() => {
    if (!config?.data) {
      setFilteredData([]);
      return;
    }

    try {
      setIsLoading(true);
      let temp = [...config.data];
      
      // Apply primary filter
      if (primaryFilter !== "All") {
        temp = temp.filter((item) => item[config.primaryFilter] === primaryFilter);
      }
      
      // Apply secondary filters
      Object.entries(filterValues).forEach(([key, value]) => {
        if (value !== "all" && value !== undefined) {
          temp = temp.filter((item) => item[key] === value);
        }
      });
      
      setFilteredData(temp);
    } catch (error) {
      setFilteredData(config.data);
    } finally {
      setIsLoading(false);
    }
  }, [primaryFilter, filterValues, config]);

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilterValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleButtonFilterChange = (filterName, value) => {
    setFilterValues(prev => ({
      ...prev,
      [filterName]: prev[filterName] === value ? "all" : value
    }));
  };

  // Calculate stats with error handling
  const stats = React.useMemo(() => {
    if (!config?.stats || !filteredData) return {};
    
    try {
      return Object.entries(config.stats).reduce((acc, [key, calculator]) => {
        try {
          acc[key] = calculator(filteredData);
        } catch (error) {
          acc[key] = 0;
        }
        return acc;
      }, {});
    } catch (error) {
      return {};
    }
  }, [filteredData, config]);

  // Generate dashboard cards
  const dashboardCards = React.useMemo(() => {
    if (!config?.cards) return [];
    
    return config.cards.map(card => ({
      ...card,
      value: (stats[card.statKey] ?? 0).toString()
    }));
  }, [config, stats]);

  // Secure navigation function
  const goToProfile = (item) => {
    try {
      // Comprehensive validation
      if (!item) {
        return;
      }

      if (!item.id || (typeof item.id !== 'number' && typeof item.id !== 'string')) {
        return;
      }

      if (!config?.entityName) {
        return;
      }

      // Sanitize and validate ID
      const sanitizedId = parseInt(item.id);
      if (isNaN(sanitizedId) || sanitizedId <= 0) {
        return;
      }

      // Verify entity exists in data
      const entityExists = config.data?.some(entity => entity.id === sanitizedId);
      if (!entityExists) {
        return;
      }

      // Build secure URL with path parameters
      const targetUrl = `/profile/${config.entityName}/${sanitizedId}`;
      
      console.log('🚀 Secure navigation:', {
        entityType: config.entityName,
        id: sanitizedId,
        targetUrl,
        entityData: { id: item.id, name: item.name }
      });

      // Navigate with error boundary
      navigate(targetUrl);
      
    } catch (error) {
      // Optional: Show user-friendly error message
      alert('Unable to navigate to profile. Please try again.');
    }
  };

  // Handle card clicks
  const handleCardClick = (card, index) => {
    if (!card?.id) return;
    
    
    try {
      switch (card.id) {
        case 'total-students':
        case 'active-lecturers':
          setPrimaryFilter("All");
          setFilterValues({});
          break;
        case 'active-students':
          setFilterValues(prev => ({ ...prev, status: 'Active' }));
          break;
        case 'graduated':
          setFilterValues(prev => ({ ...prev, status: 'Graduated' }));
          break;
        case 'top-performers':
          console.log('🏆 Show top performers filter');
          break;
        default:
          console.log(`📊 Card action not defined for: ${card.id}`);
      }
    } catch (error) {
    }
  };

  // Loading state
  if (!config) {
    return (
      <div className={styles.dashboardPage}>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Invalid Dashboard Configuration</h2>
          <p>Redirecting to students dashboard...</p>
        </div>
      </div>
    );
  }

  // Get dynamic title for filters
  const getFilterTitle = () => {
    return entityType === "students" ? "Student Filters" : "Lecturer Filters";
  };

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.dashboardContainer}>
        <aside className={styles.studentSidebar}>
          <h3>{config.primaryFilterLabel}</h3>
          {getPrimaryOptions().map((option) => (
            <button
              key={option}
              className={`${styles.sidebarButton} ${primaryFilter === option ? styles.activeTab : ""}`}
              onClick={() => setPrimaryFilter(option)}
              disabled={isLoading}
            >
              {option}
            </button>
          ))}

          <div className={styles.filters}>
            <DynamicFilter
              title={getFilterTitle()}
              filters={dynamicFilters}
              values={filterValues}
              onChange={handleFilterChange}
              showtitle={true}
            />

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
                  {getFilterOptions(filter.name).map((option) => (
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

        <main className={styles.mainContent}>
          <header className={styles.dashboardHeader}>
            <h1>{config.title}</h1>
            <p>{config.subtitle}</p>
          </header>

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

          <div className={styles.tableSection}>
            <div className={styles.tableContainer}>
              {isLoading ? (
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  <p>Loading...</p>
                </div>
              ) : (
                <StudentTable
                entityType="students"
                icon="students"
                  data={filteredData}
                  showAddButton={true}
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
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
