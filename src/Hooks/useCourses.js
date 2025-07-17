// hooks/useCourses.js
import { useState, useEffect, useMemo, useCallback } from 'react';
import { filterCourses, getFilterOptions, calculateCourseStats, validateCourseData, isCourseCodeExists, COURSES_PER_PAGE, DEFAULT_FILTERS } from '../Utils/courseUtils.js';
import { coursesList } from '../Static/FIxed/coursesData.js';
import { transformCourseForForm, transformFormToCourse, handleFieldDependencies, getUpdatedCourseFields } from '../Utils/courseUtils.js';
import { getYearOptionsForGroup } from '../Static/FIxed/coursesData.js';

const useCourses = () => {
  const [courses, setCourses] = useState(coursesList);
  const [filteredCourses, setFilteredCourses] = useState(coursesList);
  const [displayedCourses, setDisplayedCourses] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isCoursePopupOpen, setCoursePopupOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null); // Store original course object
  const [editingCourseId, setEditingCourseId] = useState(null); // Store ID separately
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [filterFields, setFilterFields] = useState([]);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({});

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

  // Set up filter fields
  useEffect(() => {
    const options = getFilterOptions(courses);
    setFilterFields([
      { name: "group", label: "Program Group", type: "select", options: [ ...options.groups] },
      { name: "academicYear", label: "Academic Year", type: "select", options: [ ...options.academicYears] },
      { name: "semester", label: "Semester", type: "select", options: [ ...options.semesters] },
      { name: "year", label: "Year", type: "select", options: [ ...options.years] },
      { name: "selectable", label: "Elective", type: "select", options: [ "yes", "no"] },
    ]);
  }, [courses]);

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
    setFilters(prev => ({ ...prev, [name]: value }));
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
    setFormData({});
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

  const handleDeleteCourse = (id) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  const handleSubmit = (submittedFormData) => {
    
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

    // Create the course object
    const courseToSave = transformFormToCourse(submittedFormData, editingCourse);

    setCourses(prev => {
      let updated;
      if (editingCourseId) {
        // Update existing course
        updated = prev.map(c => c.id === editingCourseId ? courseToSave : c);
        console.log("Updated existing course");
      } else {
        // Add new course
        updated = [...prev, courseToSave];
        console.log("Added new course");
      }
      return updated;
    });

    // Close popup and reset state
    setCoursePopupOpen(false);
    setEditingCourse(null);
    setEditingCourseId(null);
    setFormData({});
    setErrors({});
  };

  const handleFieldChange = (fieldName, value, newFormData) => {
    
    // Update our local form data state
    setFormData(prev => {
      const updatedData = { ...prev, [fieldName]: value };
      
      // Handle field dependencies
      if (fieldName === 'group') {
        // When group changes, clear academic year since it depends on group
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
    if (fieldName === 'group') {
      updatedValues.academicYear = '';
    }
    return updatedValues;
  };

  const handlePopupClose = () => {
    console.log("Closing popup");
    setCoursePopupOpen(false);
    setEditingCourse(null);
    setEditingCourseId(null);
    setFormData({});
    setErrors({});
  };

  const getAcademicYearOptions = (group) => {
    const selectedGroup = group || formData.group || "Certificate IT";
    return getYearOptionsForGroup(selectedGroup);
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
  };
};

export default useCourses;