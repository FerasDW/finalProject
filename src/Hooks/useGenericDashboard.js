import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { genericDashboardConfigs } from "../Static/genericDashboardPageData.js";
import { getPrimaryOptions, getFilterOptions } from "../Utils/genericDashboardUtils.js";

const useGenericDashboard = (entityType) => {
  const config = genericDashboardConfigs[entityType];
  const navigate = useNavigate();
  const [primaryFilter, setPrimaryFilter] = useState("All");
  const [filterValues, setFilterValues] = useState({});
  const [filteredData, setFilteredData] = useState(config?.data || []);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!config) {
      navigate("/students");
      return;
    }

    if (!config.data || config.data.length === 0) {
      console.warn(`⚠️ No data available for ${entityType}`);
    }
  }, [entityType, config, navigate]);

  useEffect(() => {
    if (!config) return;

    const initialValues = {};
    config.secondaryFilters.forEach((filter) => {
      initialValues[filter.name] = "all";
    });
    setFilterValues(initialValues);
    setPrimaryFilter("All");
  }, [entityType, config]);

  useEffect(() => {
    if (!config?.data) {
      setFilteredData([]);
      return;
    }

    try {
      setIsLoading(true);
      let temp = [...config.data];

      if (primaryFilter !== "All") {
        temp = temp.filter((item) => item[config.primaryFilter] === primaryFilter);
      }

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

  const handleFilterChange = (name, value) => {
    setFilterValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleButtonFilterChange = (filterName, value) => {
    setFilterValues((prev) => ({
      ...prev,
      [filterName]: prev[filterName] === value ? "all" : value,
    }));
  };

  const stats = useMemo(() => {
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

  const dashboardCards = useMemo(() => {
    if (!config?.cards) return [];

    return config.cards.map((card) => ({
      ...card,
      value: (stats[card.statKey] ?? 0).toString(),
    }));
  }, [config, stats]);

  const goToProfile = (item) => {
    try {
      if (!item || !item.id || (typeof item.id !== "number" && typeof item.id !== "string") || !config?.entityName) {
        return;
      }

      const sanitizedId = parseInt(item.id);
      if (isNaN(sanitizedId) || sanitizedId <= 0) {
        return;
      }

      const entityExists = config.data?.some((entity) => entity.id === sanitizedId);
      if (!entityExists) {
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
      alert("Unable to navigate to profile. Please try again.");
    }
  };

  const handleCardClick = (card, index) => {
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
          break;
        default:
          console.log(`📊 Card action not defined for: ${card.id}`);
      }
    } catch (error) {}
  };

  const getFilterTitle = () => {
    return entityType === "students" ? "Student Filters" : "Lecturer Filters";
  };

  const dynamicFilters = config?.secondaryFilters
    ?.filter((filter) => filter.type === "select")
    ?.map((filter) => ({
      label: filter.label,
      name: filter.name,
      title: filter.name,
      options: getFilterOptions(filter.name, config.data),
    })) || [];

  const buttonFilters = config?.secondaryFilters?.filter((filter) => filter.type === "buttons") || [];

  return {
    config: {
      ...config,
      getPrimaryOptions: () => getPrimaryOptions(config.data, config.primaryFilter),
      getFilterOptions: (fieldName) => getFilterOptions(fieldName, config.data),
    },
    primaryFilter,
    setPrimaryFilter,
    filterValues,
    filteredData,
    isLoading,
    dynamicFilters,
    buttonFilters,
    dashboardCards,
    getFilterTitle,
    handleFilterChange,
    handleButtonFilterChange,
    goToProfile,
    handleCardClick,
  };
};

export default useGenericDashboard;