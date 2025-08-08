// hooks/useGenericDashboard.js (CORRECTED)
import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as genericDashboardAPI from "../Api/GenericDashboard";
import { getGenericDashboardConfig, getPrimaryOptions, getFilterOptions } from "../Utils/genericDashboardUtils";

const useGenericDashboard = (entityType) => {
  const config = getGenericDashboardConfig(entityType);
  const navigate = useNavigate();
  
  // State management
  const [data, setData] = useState([]);
  const [primaryFilter, setPrimaryFilter] = useState("All");
  const [filterValues, setFilterValues] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoized fetch function to prevent infinite re-renders
  const fetchData = useCallback(async () => {
    if (!config) {
      navigate("/students");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const result = await genericDashboardAPI.getData(entityType);
      
      // Ensure we always have an array
      const validData = Array.isArray(result) ? result : [];
      setData(validData);
      
      if (validData.length === 0) {
        console.warn(`⚠️ No data available for ${entityType}`);
      }
    } catch (err) {
      console.error(`Failed to load ${entityType}:`, err);
      setError(err.message || `Failed to load ${entityType} data`);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [entityType, config, navigate]);

  // Load data on mount or entity type change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Initialize filter values when config changes (not data)
  useEffect(() => {
    if (!config) return;

    const initialValues = {};
    config.secondaryFilters?.forEach((filter) => {
      initialValues[filter.name] = "all";
    });
    setFilterValues(initialValues);
    setPrimaryFilter("All");
  }, [config, entityType]); // Remove data dependency

  // Apply filters with better error handling
  useEffect(() => {
    if (!data.length || !config) {
      setFilteredData([]);
      return;
    }

    try {
      let temp = [...data];

      // Apply primary filter with safety checks
      if (primaryFilter !== "All" && config.primaryFilter) {
        temp = temp.filter((item) => {
          const itemValue = item?.[config.primaryFilter];
          return itemValue === primaryFilter;
        });
      }

      // Apply secondary filters with safety checks
      Object.entries(filterValues).forEach(([key, value]) => {
        if (value !== "all" && value !== undefined && value !== null) {
          temp = temp.filter((item) => {
            const itemValue = item?.[key];
            return itemValue === value;
          });
        }
      });

      setFilteredData(temp);
    } catch (error) {
      console.error("Filter error:", error);
      setFilteredData(data); // Fallback to unfiltered data
    }
  }, [primaryFilter, filterValues, data, config]);

  // Handle filter changes
  const handleFilterChange = useCallback((name, value) => {
    setFilterValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleButtonFilterChange = useCallback((filterName, value) => {
    setFilterValues((prev) => ({
      ...prev,
      [filterName]: prev[filterName] === value ? "all" : value,
    }));
  }, []);

  // Calculate stats with better error handling
  const stats = useMemo(() => {
    if (!config?.stats || !filteredData.length) return {};

    try {
      return Object.entries(config.stats).reduce((acc, [key, calculator]) => {
        try {
          if (typeof calculator === 'function') {
            acc[key] = calculator(filteredData);
          } else {
            acc[key] = 0;
          }
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
  }, [filteredData, config?.stats]);

  // Generate dashboard cards
  const dashboardCards = useMemo(() => {
    if (!config?.cards) return [];

    return config.cards.map((card) => ({
      ...card,
      value: (stats[card.statKey] ?? 0).toString(),
    }));
  }, [config?.cards, stats]);

  // Navigation function with better error handling
  const goToProfile = useCallback((item) => {
    try {
      if (!item?.id || !config?.entityName) {
        console.warn('Invalid navigation parameters:', { item, entityName: config?.entityName });
        return;
      }

      const sanitizedId = parseInt(item.id);
      if (isNaN(sanitizedId) || sanitizedId <= 0) {
        console.warn('Invalid ID for navigation:', item.id);
        return;
      }

      // Check if entity exists
      const entityExists = data.some((entity) => entity?.id === sanitizedId);
      if (!entityExists) {
        console.warn('Entity not found in data:', sanitizedId);
        return;
      }

      const targetUrl = `/profile/${config.entityName}/${sanitizedId}`;
      console.log("🚀 Secure navigation:", {
        entityType: config.entityName,
        id: sanitizedId,
        targetUrl,
        entityData: { id: item.id, name: item.name },
      });

      navigate(targetUrl);
    } catch (error) {
      console.error('Navigation error:', error);
      alert("Unable to navigate to profile. Please try again.");
    }
  }, [data, config?.entityName, navigate]);

  // Handle card clicks
  const handleCardClick = useCallback((card) => {
    if (!card?.id) return;

    try {
      switch (card.id) {
        case "total-students":
        case "active-lecturers":
          setPrimaryFilter("All");
          setFilterValues({});
          break;
        case "active-students":
          setFilterValues((prev) => ({ ...prev, status: "Active" }));
          break;
        case "graduated":
          setFilterValues((prev) => ({ ...prev, status: "Graduated" }));
          break;
        case "top-performers":
          console.log("🏆 Show top performers filter");
          // Add specific filter logic here
          break;
        default:
          console.log(`📊 Card action not defined for: ${card.id}`);
      }
    } catch (error) {
      console.error("Card click error:", error);
    }
  }, []);

  // Utility functions
  const getFilterTitle = useCallback(() => {
    return entityType === "students" ? "Student Filters" : "Lecturer Filters";
  }, [entityType]);

  const dynamicFilters = useMemo(() => {
    if (!config?.secondaryFilters || !data.length) return [];
    
    return config.secondaryFilters
      .filter((filter) => filter.type === "select")
      .map((filter) => ({
        label: filter.label,
        name: filter.name,
        title: filter.name,
        options: getFilterOptions(filter.name, data),
      }));
  }, [config?.secondaryFilters, data]);

  const buttonFilters = useMemo(() => {
    return config?.secondaryFilters?.filter((filter) => filter.type === "buttons") || [];
  }, [config?.secondaryFilters]);

  // Refresh data function
  const refreshData = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    // Data
    data,
    filteredData,
    isLoading,
    error,
    
    // Config
    config: config ? {
      ...config,
      getPrimaryOptions: () => getPrimaryOptions(data, config.primaryFilter),
      getFilterOptions: (fieldName) => getFilterOptions(fieldName, data),
    } : null,
    
    // State
    primaryFilter,
    setPrimaryFilter,
    filterValues,
    
    // Computed
    stats,
    dashboardCards,
    dynamicFilters,
    buttonFilters,
    
    // Functions
    handleFilterChange,
    handleButtonFilterChange,
    goToProfile,
    handleCardClick,
    getFilterTitle,
    refreshData
  };
};

export default useGenericDashboard;