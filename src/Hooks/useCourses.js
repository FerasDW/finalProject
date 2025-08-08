// hooks/useCourses.js

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { 
  filterCourses, 
  getFilterOptions, 
  calculateCourseStats, 
  validateCourseData, 
  isCourseCodeExists, 
  COURSES_PER_PAGE, 
  DEFAULT_FILTERS,
  getAcademicYearOptionsForDepartment,
  generateAcademicYearOptions
} from '../Utils/courseUtils.js';
import { 
  transformCourseForForm, 
  transformFormToCourse, 
  handleFieldDependencies, 
  getUpdatedCourseFields 
} from '../Utils/courseUtils.js';
import {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getAllDepartments,
} from '../Api/coursePageApi.js';
import { getAllLecturers } from '../Api/dashboardPageApi.js';

const DEFAULT_COURSE_FORM_DATA = {
  courseTitle: '',
  courseCode: '',
  description: '',
  department: '',
  academicYear: '',
  semester: '1',
  year: new Date().getFullYear(),
  credits: 3,
  selectable: false,
  img: '',
  lecturer: ''
};

const useCourses = () => {
  console.log("🔧 useCourses hook initialized");
  
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [displayedCourses, setDisplayedCourses] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [hasMore, setHasMore] = useState(true);
  const [isCoursePopupOpen, setCoursePopupOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [filterFields, setFilterFields] = useState([]);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState(DEFAULT_COURSE_FORM_DATA);
  const [updatedCourseFields, setUpdatedCourseFields] = useState([]);

  // Use ref to prevent duplicate API calls
  const fetchInProgressRef = useRef(false);
  const initialDataFetchedRef = useRef(false);

  const fetchInitialData = useCallback(async () => {
    console.log("🔧 fetchInitialData called");
    
    // Prevent duplicate fetches
    if (fetchInProgressRef.current) {
      console.log("🔄 Fetch already in progress, skipping...");
      return;
    }

    // If we already have data and this isn't a forced refetch, skip
    if (initialDataFetchedRef.current && courses.length > 0) {
      console.log("📋 Initial data already fetched, skipping...");
      setLoading(false);
      return;
    }
    
    try {
      fetchInProgressRef.current = true;
      setLoading(true);
      console.log("📡 Fetching initial data...");
      
      const [backendCourses, backendDepartments, backendUsers] = await Promise.all([
        getAllCourses(),
        getAllDepartments(),
        getAllLecturers()
      ]);
      
      console.log("📡 API responses:");
      console.log("- Courses:", backendCourses?.length || 0);
      console.log("- Departments:", backendDepartments?.length || 0);
      console.log("- All users:", backendUsers?.length || 0);
      
      // Filter lecturers
      const filteredLecturers = backendUsers?.filter(user => user.role === "1200") || [];
      console.log("👨‍🏫 Filtered lecturers:", filteredLecturers.length);
      
      // Enhance courses with lecturer information
      const enhancedCourses = backendCourses?.map(course => {
        const lecturer = filteredLecturers.find(l => l.id === course.lecturerId);
        return {
          ...course,
          lecturerName: lecturer ? lecturer.name : 'Unknown Lecturer',
          lecturer: lecturer
        };
      }) || [];
      
      console.log("✅ Enhanced courses with lecturer info:", enhancedCourses.length);
      
      setCourses(enhancedCourses);
      setDepartments(backendDepartments || []);
      setLecturers(filteredLecturers);
      
      // Set default department if available and form doesn't have one
      if (backendDepartments?.length > 0) {
        setFormData(prev => ({
          ...prev,
          department: prev.department || backendDepartments[0].name
        }));
        console.log("🔄 Set default department:", backendDepartments[0].name);
      }

      initialDataFetchedRef.current = true;
    } catch (error) {
      console.error("❌ Failed to fetch initial data:", error);
    } finally {
      setLoading(false);
      fetchInProgressRef.current = false;
      console.log("✅ fetchInitialData completed");
    }
  }, []); // Remove formData.department dependency to prevent infinite loops

  useEffect(() => {
    if (!initialDataFetchedRef.current) {
      console.log("🚀 Component mounted, calling fetchInitialData");
      fetchInitialData();
    }
  }, [fetchInitialData]);


  // Update course fields when departments change
  useEffect(() => {
    const updateCourseFields = async () => {
      console.log("🔧 updateCourseFields effect triggered");
      console.log("- Departments:", departments.length);
      console.log("- Lecturers:", lecturers.length);
      
      if (departments.length > 0) {
        console.log("📝 Calling getUpdatedCourseFields");
        try {
          const fields = await getUpdatedCourseFields(departments);
          console.log("✅ Course fields updated, count:", fields.length);
          setUpdatedCourseFields(fields);
        } catch (error) {
          console.error("❌ Error updating course fields:", error);
          setUpdatedCourseFields([]);
        }
      } else {
        console.log("⏳ Waiting for departments...");
      }
    };

    updateCourseFields();
  }, [departments.length, lecturers.length]);

  useEffect(() => {
    console.log("🔧 Filter courses effect triggered");
    const filtered = filterCourses(courses, filters, searchInput);
    setFilteredCourses(filtered);
    setPage(1);
    
    const firstPage = filtered.slice(0, COURSES_PER_PAGE);
    setDisplayedCourses(firstPage);
    setHasMore(filtered.length > COURSES_PER_PAGE);
    console.log("✅ Courses filtered and displayed");
  }, [courses, filters, searchInput]);

  useEffect(() => {
    if (page > 1) {
      console.log("📄 Loading more courses, page:", page);
      const startIndex = 0;
      const endIndex = page * COURSES_PER_PAGE;
      const newDisplayedCourses = filteredCourses.slice(startIndex, endIndex);
      setDisplayedCourses(newDisplayedCourses);
      setHasMore(filteredCourses.length > endIndex);
    }
  }, [page, filteredCourses]);


  useEffect(() => {
    console.log("🔧 Setup filter fields effect triggered");
    console.log("Available data - courses:", courses.length, "departments:", departments.length);
    
    if (courses.length > 0 && departments.length > 0) {
      console.log("📋 Setting up filter fields");
      const options = getFilterOptions(courses, departments);
      
      let academicYearOptions = [];
      if (filters.department && filters.department !== "all") {
        console.log("🔍 Getting academic year options for department:", filters.department);
        academicYearOptions = getAcademicYearOptionsForDepartment(filters.department, departments);
      } else {
        console.log("📚 Using all academic year options");
        academicYearOptions = options.academicYears || [];
      }

      const newFilterFields = [
        { name: "department", label: "Department", type: "select", options: options.departments },
        { name: "academicYear", label: "Academic Year", type: "select", options: academicYearOptions },
        { name: "semester", label: "Semester", type: "select", options: options.semesters || [] },
        { name: "year", label: "Year", type: "select", options: options.years || [] },
        { name: "selectable", label: "Elective", type: "select", options: ["yes", "no"] },
      ];
      
      setFilterFields(newFilterFields);
      console.log("✅ Filter fields updated");
    } else {
      console.log("⏳ Waiting for courses and departments data...");
    }
  }, [courses.length, departments.length, filters.department]);


  const loadMoreCourses = useCallback(() => {
    if (loading || !hasMore) {
      console.log("Cannot load more:", { loading, hasMore });
      return;
    }
    
    console.log("Loading more courses, current page:", page);
    setLoading(true);
    
    setTimeout(() => {
      setPage(prev => prev + 1);
      setLoading(false);
    }, 500);
  }, [loading, hasMore, page]);


  const handleFilterChange = useCallback((name, value) => {
    console.log("🔧 handleFilterChange called:", { name, value });
    
    if (name === 'department') {
      console.log("🔄 Department filter changed, clearing academic year");
      setFilters(prev => ({ ...prev, [name]: value, academicYear: 'all' }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  }, []);


  const handleSearch = useCallback(() => {
    console.log("🔧 handleSearch called");
    const filtered = filterCourses(courses, filters, searchInput);
    setFilteredCourses(filtered);
    setPage(1);
    const firstPage = filtered.slice(0, COURSES_PER_PAGE);
    setDisplayedCourses(firstPage);
    setHasMore(filtered.length > COURSES_PER_PAGE);
  }, [courses, filters, searchInput]);

  const handleAddCourse = useCallback(() => {
    console.log("🔧 handleAddCourse called");
    setEditingCourse(null);
    setEditingCourseId(null);

    const defaultFormData = { ...DEFAULT_COURSE_FORM_DATA };
    if (departments.length > 0) {
      defaultFormData.department = departments[0].name;
      console.log("🔄 Set default department:", departments[0].name);
    }
    
    setFormData(defaultFormData);

    setErrors({});
    setCoursePopupOpen(true);
    console.log("✅ Add course popup opened");
  }, [departments]);

  const handleEditCourse = useCallback((course) => {
    console.log("🔧 handleEditCourse called with:", course?.name);
    setEditingCourse(course);
    setEditingCourseId(course.id);
    
    const formInitialData = transformCourseForForm(course, lecturers);
    console.log("📝 Transformed form data for:", formInitialData.courseTitle);
    setFormData(formInitialData);
    setErrors({});
    setCoursePopupOpen(true);
    console.log("✅ Edit course popup opened");
  }, [lecturers]);


  const handleDeleteCourse = useCallback(async (id) => {
    console.log("🔧 handleDeleteCourse called for ID:", id);
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteCourse(id);
        console.log("✅ Course deleted successfully");
        // Force a fresh fetch by resetting the ref
        initialDataFetchedRef.current = false;
        await fetchInitialData();
      } catch (error) {
        console.error("❌ Failed to delete course:", error);
        alert("Failed to delete course. Please try again.");
      }
    }
  }, [fetchInitialData]);

  const handleSubmit = useCallback(async (submittedFormData) => {
    console.log("🔧 handleSubmit called with:", submittedFormData.courseTitle);
    

    const newErrors = validateCourseData(submittedFormData);
    if (Object.keys(newErrors).length > 0) {
      console.log("❌ Validation errors:", newErrors);
      setErrors(newErrors);
      return;
    }

    if (isCourseCodeExists(submittedFormData.courseCode, courses, editingCourseId)) {
      console.log("❌ Course code already exists");
      setErrors({ courseCode: "Course code already exists." });
      return;
    }

    // Create the course object
    const courseToSave = transformFormToCourse(submittedFormData, editingCourse);

    setCourses(prev => {
      let updated;
      if (editingCourseId) {

        console.log("📝 Updating existing course");
        const courseToUpdate = transformFormToCourse(submittedFormData, editingCourse);
        await updateCourse(editingCourseId, courseToUpdate);
        console.log("✅ Course updated successfully");
      } else {
        console.log("➕ Creating new course");
        const courseToCreate = transformFormToCourse(submittedFormData, null);
        await createCourse(courseToCreate);
        console.log("✅ Course created successfully");

      }
      return updated;
    });

      // Force a fresh fetch
      initialDataFetchedRef.current = false;
      await fetchInitialData();
      handlePopupClose();
    } catch (error) {
      console.error("❌ Failed to save course:", error);
      alert("Failed to save course. Please try again.");
    }
  }, [courses, editingCourseId, editingCourse, fetchInitialData]);

  const handleFieldChange = useCallback((fieldName, value) => {
    console.log("🔧 handleFieldChange called:", { fieldName, value });
    
    setFormData(prev => {
      const updatedData = { ...prev, [fieldName]: value };
      
      if (fieldName === 'department') {
        console.log("🔄 Department field changed, clearing academic year");

        updatedData.academicYear = '';
      }
      
      return updatedData;
    });
    
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  }, [errors]);

  const handleGroupChange = useCallback((fieldName, value, allValues) => {
    console.log("🔧 handleGroupChange called:", { fieldName, value });
    const updatedValues = handleFieldDependencies(fieldName, value, allValues);
    if (fieldName === 'group') {
      updatedValues.academicYear = '';
    }
    return updatedValues;
  }, []);

  const handlePopupClose = useCallback(() => {
    console.log("🔧 handlePopupClose called");
    setCoursePopupOpen(false);
    setEditingCourse(null);
    setEditingCourseId(null);

    
    const defaultFormData = { ...DEFAULT_COURSE_FORM_DATA };
    if (departments.length > 0) {
      defaultFormData.department = departments[0].name;
    }
    setFormData(defaultFormData);

    setErrors({});
    console.log("✅ Popup closed and state reset");
  }, [departments]);


  const getAcademicYearOptions = useCallback((department) => {
    console.log("🔧 getAcademicYearOptions called with department:", department);
    
    const selectedDepartment = department || formData.department;
    
    if (!selectedDepartment || !departments || departments.length === 0) {
      console.log("❌ No department selected or no departments available");
      return [];
    }
    
    const dept = departments.find(d => d.name === selectedDepartment);
    console.log("🔍 Found department object:", dept?.name);
    
    if (!dept || !dept.totalAcademicYears) {
      console.log("❌ Department not found or no totalAcademicYears");
      return [];
    }
    
    const options = generateAcademicYearOptions(dept.totalAcademicYears);
    console.log("✅ getAcademicYearOptions returning:", options);
    return options;
  }, [formData.department, departments]);

  console.log("🔧 useCourses hook rendering, returning functions and state");


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
    updatedCourseFields: Array.isArray(updatedCourseFields) ? updatedCourseFields : [],
    editingCourse: !!editingCourseId,
    formData,
    errors,
    getAcademicYearOptions,
    courseStats: calculateCourseStats(courses),

    departments,
    lecturers,
    fetchInitialData,

  };
};

export default useCourses;