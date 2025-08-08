// utils/genericDashboardUtils.js
import { 
  Users, BookOpen, GraduationCap, CalendarDays, UserCheck, 
  Star, Award, Building, User 
} from "lucide-react";

// Form field configurations
export const genericDashboardFormConfigs = {
  students: {
    title: "Add New Student",
    subtitle: "Enter student information",
    icon: User,
    fields: [
      {
        name: "name",
        label: "Full Name",
        type: "text",
        placeholder: "Enter student's full name",
        required: true
      },
      {
        name: "email",
        label: "Email Address",
        type: "email",
        placeholder: "student@example.com",
        required: true
      },
      {
        name: "gender",
        label: "Gender",
        type: "radio",
        required: true,
        options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
        ]
      },
      {
        name: "department",
        label: "Department",
        type: "select",
        placeholder: "Select department",
        options: ["Engineering", "Science", "Arts", "Business"],
        required: true
      },
      {
        name: "academicYear",
        label: "Academic Year",
        type: "select",
        placeholder: "Select academic year",
        options: ["First Year", "Second Year", "Third Year", "Fourth Year"],
        required: true
      },
      {
        name: "learningGroup",
        label: "Learning Group",
        type: "select",
        placeholder: "Select learning group",
        options: ["Group A", "Group B", "Group C"],
        required: true
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        placeholder: "Select status",
        options: ["Active", "Inactive", "Graduated"],
        required: true
      }
    ]
  },
  lecturers: {
    title: "Add New Lecturer",
    subtitle: "Enter lecturer information",
    icon: User,
    fields: [
      {
        name: "name",
        label: "Full Name",
        type: "text",
        placeholder: "Enter lecturer's full name",
        required: true
      },
      {
        name: "email",
        label: "Email Address",
        type: "email",
        placeholder: "lecturer@university.edu",
        required: true
      },
      {
        name: "department",
        label: "Department",
        type: "select",
        placeholder: "Select department",
        options: ["computer-science", "mathematics", "physics", "chemistry", "biology"],
        required: true
      },
      {
        name: "specialization",
        label: "Specialization",
        type: "select",
        placeholder: "Select specialization",
        options: ["artificial-intelligence", "machine-learning", "software-engineering", "data-science"],
        required: true
      },
      {
        name: "employmentType",
        label: "Employment Type",
        type: "select",
        placeholder: "Select employment type",
        options: ["Full-time", "Part-time", "Contract"],
        required: true
      },
      {
        name: "experience",
        label: "Years of Experience",
        type: "number",
        placeholder: "Enter years of experience",
        required: true
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        placeholder: "Select status",
        options: ["Active", "Inactive"],
        required: true
      },
      {
        name: "rating",
        label: "Rating",
        type: "number",
        placeholder: "Enter rating (1-5)",
        min: 1,
        max: 5,
        step: 0.1
      },
      {
        name: "activeCourses",
        label: "Active Courses",
        type: "number",
        placeholder: "Number of active courses",
        min: 0
      }
    ]
  }
};

// Dashboard configurations
export const genericDashboardConfigs = {
  students: {
    title: "Student Management System",
    subtitle: "Manage students across divisions, academic years, and learning groups",
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

/**
 * Get dashboard configuration for entity type
 */
export const getGenericDashboardConfig = (entityType) => {
  return genericDashboardConfigs[entityType];
};

/**
 * Get form configuration for entity type
 */
export const getGenericDashboardFormConfig = (entityType) => {
  return genericDashboardFormConfigs[entityType];
};

/**
 * Generate primary filter options from data
 */
export const getPrimaryOptions = (data, primaryFilterKey) => {
  if (!data || !Array.isArray(data)) return ["All"];
  
  try {
    const values = Array.from(
      new Set(data.map(item => item[primaryFilterKey]))
    ).filter(Boolean).sort();
    
    return ["All", ...values];
  } catch (error) {
    console.error('Error generating primary options:', error);
    return ["All"];
  }
};

/**
 * Generate filter options for a specific field
 */
export const getFilterOptions = (fieldName, data) => {
  if (!data || !Array.isArray(data)) return [];
  
  try {
    return Array.from(
      new Set(data.map(item => item[fieldName]))
    ).filter(Boolean).sort();
  } catch (error) {
    console.error(`Error generating options for ${fieldName}:`, error);
    return [];
  }
};

/**
 * Prepare filters for DynamicFilter component
 */
export const prepareGenericDashboardDynamicFilters = (data, secondaryFilters) => {
  if (!secondaryFilters || !Array.isArray(secondaryFilters)) return [];
  
  return secondaryFilters
    .filter(filter => filter.type === "select")
    .map(filter => ({
      label: filter.label,
      name: filter.name,
      title: filter.name,
      options: getFilterOptions(filter.name, data)
    }));
};

/**
 * Get button filters from configuration
 */
export const getGenericDashboardButtonFilters = (secondaryFilters) => {
  if (!secondaryFilters || !Array.isArray(secondaryFilters)) return [];
  
  return secondaryFilters.filter(filter => filter.type === "buttons");
};

/**
 * Generate dashboard cards with calculated stats
 */
export const generateGenericDashboardCards = (cards, stats) => {
  if (!cards || !Array.isArray(cards)) return [];
  
  return cards.map(card => ({
    ...card,
    value: (stats[card.statKey] ?? 0).toString()
  }));
};

/**
 * Secure navigation to profile
 */
export const navigateGenericDashboardToProfile = (item, entityName, data, navigate) => {
  try {
    // Comprehensive validation
    if (!item || !item.id || !entityName || !data || !navigate) {
      console.warn('Invalid navigation parameters');
      return false;
    }

    // Sanitize and validate ID
    const sanitizedId = parseInt(item.id);
    if (isNaN(sanitizedId) || sanitizedId <= 0) {
      console.warn('Invalid ID for navigation');
      return false;
    }

    // Verify entity exists in data
    const entityExists = data.some(entity => entity.id === sanitizedId);
    if (!entityExists) {
      console.warn('Entity not found in data');
      return false;
    }

    // Build secure URL
    const targetUrl = `/profile/${entityName}/${sanitizedId}`;
    
    console.log('🚀 Secure navigation:', {
      entityType: entityName,
      id: sanitizedId,
      targetUrl,
      entityData: { id: item.id, name: item.name }
    });

    navigate(targetUrl);
    return true;
    
  } catch (error) {
    console.error('Navigation error:', error);
    return false;
  }
};

/**
 * Handle card click actions
 */
export const handleGenericDashboardCardAction = (card, setPrimaryFilter, setFilterValues) => {
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
        // Add specific filter logic here
        break;
      default:
        console.log(`📊 Card action not defined for: ${card.id}`);
    }
  } catch (error) {
    console.error('Card action error:', error);
  }
};

/**
 * Get dynamic title for filters based on entity type
 */
export const getGenericDashboardFilterTitle = (entityType) => {
  const titles = {
    students: "Student Filters",
    lecturers: "Lecturer Filters"
  };
  
  return titles[entityType] || "Filters";
};

/**
 * Apply filters to data
 */
export const applyGenericDashboardFilters = (data, primaryFilter, primaryFilterKey, filterValues) => {
  if (!data || !Array.isArray(data)) return [];
  
  try {
    let filtered = [...data];
    
    // Apply primary filter
    if (primaryFilter && primaryFilter !== "All") {
      filtered = filtered.filter(item => item[primaryFilterKey] === primaryFilter);
    }
    
    // Apply secondary filters
    Object.entries(filterValues || {}).forEach(([key, value]) => {
      if (value && value !== "all" && value !== undefined) {
        filtered = filtered.filter(item => item[key] === value);
      }
    });
    
    return filtered;
  } catch (error) {
    console.error('Filter application error:', error);
    return data;
  }
};

/**
 * Calculate statistics from filtered data
 */
export const calculateGenericDashboardStats = (data, statsConfig) => {
  if (!data || !Array.isArray(data) || !statsConfig) return {};
  
  try {
    return Object.entries(statsConfig).reduce((acc, [key, calculator]) => {
      try {
        acc[key] = calculator(data);
      } catch (error) {
        console.error(`Error calculating stat ${key}:`, error);
        acc[key] = 0;
      }
      return acc;
    }, {});
  } catch (error) {
    console.error('Stats calculation error:', error);
    return {};
  }
};

/**
 * Validate entity data structure
 */
export const validateGenericDashboardEntityData = (data, requiredFields = ['id']) => {
  if (!data || !Array.isArray(data)) return false;
  
  return data.every(item => {
    return requiredFields.every(field => 
      item.hasOwnProperty(field) && item[field] !== undefined && item[field] !== null
    );
  });
};

/**
 * Format display value for UI
 */
export const formatGenericDashboardDisplayValue = (value, type = 'default') => {
  if (value === null || value === undefined) return 'N/A';
  
  switch (type) {
    case 'number':
      return typeof value === 'number' ? value.toLocaleString() : value;
    case 'percentage':
      return typeof value === 'number' ? `${value}%` : value;
    case 'currency':
      return typeof value === 'number' ? `$${value.toLocaleString()}` : value;
    default:
      return value.toString();
  }
};