// hooks/useCourses.js
import { useState, useEffect, useMemo, useCallback } from 'react';
import { filterCourses, getFilterOptions, calculateCourseStats, validateCourseData, isCourseCodeExists, COURSES_PER_PAGE, DEFAULT_FILTERS } from '../Utils/courseUtils.js';
import { transformCourseForForm, transformFormToCourse, handleFieldDependencies, getUpdatedCourseFields } from '../Utils/courseUtils.js';
import { getYearOptionsForGroup } from '../Static/FIxed/coursesData.js';
import {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getAllDepartments,
} from '../Api/coursePageApi.js';

// Default state for new course form
const DEFAULT_COURSE_FORM_DATA = {
  courseTitle: '',
  courseCode: '',
  description: '',
  department: 'Certificate IT',
  academicYear: '',
  semester: '1',
  year: new Date().getFullYear(),
  credits: 3,
  selectable: false,
  img: '',
};

const useCourses = () => {
  // API-related state
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  
  // Original state variables preserved
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [displayedCourses, setDisplayedCourses] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true); // Changed initial state to true for API loading
  const [hasMore, setHasMore] = useState(true);
  const [isCoursePopupOpen, setCoursePopupOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null); // Store original course object
  const [editingCourseId, setEditingCourseId] = useState(null); // Store ID separately
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [filterFields, setFilterFields] = useState([]);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(DEFAULT_COURSE_FORM_DATA);

  // API fetch function
  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const [backendCourses, backendDepartments] = await Promise.all([
        getAllCourses(),
        getAllDepartments()
      ]);
      setCourses(backendCourses);
      setDepartments(backendDepartments);
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load initial data on mount
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Filter courses and reset pagination when filters or search change
  useEffect(() => {
    const filtered = filterCourses(courses, filters, searchInput);
    setFilteredCourses(filtered);
    setPage(1);
    
    // Reset displayed courses to show first page
    const firstPage = filtered.slice(0, COURSES_PER_PAGE);
    setDisplayedCourses(firstPage);
    setHasMore(filtered.length > COURSES_PER_PAGE);
  }, [courses, filters, searchInput]);

  // Load more courses when page changes
  useEffect(() => {
    if (page > 1) {
      const startIndex = 0;
      const endIndex = page * COURSES_PER_PAGE;
      const newDisplayedCourses = filteredCourses.slice(startIndex, endIndex);
      setDisplayedCourses(newDisplayedCourses);
      setHasMore(filteredCourses.length > endIndex);
    }
  }, [page, filteredCourses]);

  // Set up filter fields with API data
  useEffect(() => {
    if (courses.length > 0) {
      const options = getFilterOptions(courses);
      
      // Use departments from API if available, otherwise fall back to options.groups
      const groupOptions = departments.length > 0 
        ? departments.map(d => d.name)
        : (options.groups || []);
      
      // Handle academic year options based on selected department
      let academicYearOptions = [];
      if (filters.department && departments.length > 0) {
        const selectedDept = departments.find(d => d.name === filters.department);
        if (selectedDept && selectedDept.totalAcademicYears) {
          academicYearOptions = Array.from(
            { length: selectedDept.totalAcademicYears }, 
            (_, i) => String(i + 1)
          );
        }
      } else {
        academicYearOptions = options.academicYears || [];
      }

      setFilterFields([
        { name: "department", label: "Department", type: "select", options: departmentOptions },
        { name: "academicYear", label: "Academic Year", type: "select", options: academicYearOptions },
        { name: "semester", label: "Semester", type: "select", options: options.semesters || [] },
        { name: "year", label: "Year", type: "select", options: options.years || [] },
        { name: "selectable", label: "Elective", type: "select", options: ["yes", "no"] },
      ]);
    }
  }, [courses, departments, filters.department]);

  const loadMoreCourses = useCallback(() => {
    if (loading || !hasMore) {
      console.log("Cannot load more:", { loading, hasMore });
      return;
    }
    
    console.log("Loading more courses, current page:", page, "total filtered:", filteredCourses.length);
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      setPage(prev => {
        const nextPage = prev + 1;
        console.log("Moving to page:", nextPage);
        return nextPage;
      });
      setLoading(false);
    }, 500);
  }, [loading, hasMore, page, filteredCourses.length]);

  const handleFilterChange = (name, value) => {
    if (name === 'department') {
      // When department changes, clear academic year since it depends on department
      setFilters(prev => ({ ...prev, [name]: value, academicYear: '' }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSearch = () => {
    // This will trigger the useEffect that filters courses
    const filtered = filterCourses(courses, filters, searchInput);
    setFilteredCourses(filtered);
    setPage(1);
    const firstPage = filtered.slice(0, COURSES_PER_PAGE);
    setDisplayedCourses(firstPage);
    setHasMore(filtered.length > COURSES_PER_PAGE);
  };

  const handleAddCourse = () => {
    console.log("Adding new course");
    setEditingCourse(null);
    setEditingCourseId(null);
    setFormData(DEFAULT_COURSE_FORM_DATA);
    setErrors({});
    setCoursePopupOpen(true);
  };

  const handleEditCourse = (course) => {
    // Store the original course object AND its ID
    setEditingCourse(course);
    setEditingCourseId(course.id);
    
    // Transform course data for the form
    const formInitialData = transformCourseForForm(course);
    setFormData(formInitialData);
    setErrors({});
    setCoursePopupOpen(true);
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteCourse(id);
        // Refresh data after successful deletion
        await fetchInitialData();
      } catch (error) {
        console.error("Failed to delete course:", error);
        // You might want to show an error message to the user here
      }
    }
  };

  const handleSubmit = async (submittedFormData) => {
    // Validate the form data
    const newErrors = validateCourseData(submittedFormData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Check for duplicate course codes (exclude current course if editing)
    if (isCourseCodeExists(submittedFormData.courseCode, courses, editingCourseId)) {
      console.log("Course code already exists");
      setErrors({ courseCode: "Course code already exists." });
      return;
    }

    try {
      if (editingCourseId) {
        // Update existing course
        const courseToUpdate = transformFormToCourse(submittedFormData, editingCourse);
        await updateCourse(editingCourseId, courseToUpdate);
        console.log("Updated existing course");
      } else {
        // Add new course
        const courseToCreate = transformFormToCourse(submittedFormData, null);
        await createCourse(courseToCreate);
        console.log("Added new course");
      }

      // Refresh data after successful operation
      await fetchInitialData();
      
      // Close popup and reset state
      handlePopupClose();
    } catch (error) {
      console.error("Failed to save course:", error);
      // You might want to show an error message to the user here
    }
  };

  const handleFieldChange = (fieldName, value, newFormData) => {
    // Update our local form data state
    setFormData(prev => {
      const updatedData = { ...prev, [fieldName]: value };
      
      // Handle field dependencies
      if (fieldName === 'department') {
        // When department changes, clear academic year since it depends on department
        updatedData.academicYear = '';
      }
      
      return updatedData;
    });
    
    // Clear validation errors for this field
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleGroupChange = (fieldName, value, allValues) => {
    const updatedValues = handleFieldDependencies(fieldName, value, allValues);
    if (fieldName === 'department') {
      updatedValues.academicYear = '';
    }
    return updatedValues;
  };

  const handlePopupClose = () => {
    console.log("Closing popup");
    setCoursePopupOpen(false);
    setEditingCourse(null);
    setEditingCourseId(null);
    setFormData(DEFAULT_COURSE_FORM_DATA);
    setErrors({});
  };

  const getAcademicYearOptions = (department) => {
    const selectedDepartment = department || formData.department || "Certificate IT";
    
    // Try to get options from departments API first
    if (departments.length > 0) {
      const selectedDept = departments.find(d => d.name === selectedDepartment);
      if (selectedDept && selectedDept.totalAcademicYears) {
        return Array.from(
          { length: selectedDept.totalAcademicYears }, 
          (_, i) => String(i + 1)
        );
      }
    }
    
    // Fall back to original function
    return getYearOptionsForGroup(selectedDepartment);
  };

  return {
    displayedCourses,
    loading,
    hasMore,
    loadMoreCourses,
    isCoursePopupOpen,
    setCoursePopupOpen,
    searchInput,
    setSearchInput,
    filters,
    handleFilterChange,
    handleSearch,
    filterFields,
    handleAddCourse,
    handleEditCourse,
    handleDeleteCourse,
    handleSubmit,
    handleFieldChange,
    handleGroupChange,
    handlePopupClose,
    updatedCourseFields: getUpdatedCourseFields(),
    editingCourse: !!editingCourseId, // Boolean to indicate if editing
    formData,
    errors,
    getAcademicYearOptions,
    courseStats: calculateCourseStats(courses),
    
    // Additional API-related returns
    departments, // In case you need access to departments elsewhere
    fetchInitialData, // In case you need to manually refresh data
  };
};

export default useCourses;