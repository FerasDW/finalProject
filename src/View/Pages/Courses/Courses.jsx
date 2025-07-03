import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import coursesList, { getYearOptionsForGroup } from "../../../Static/coursesData";
import CoursesContent from "../../Components/Courses/Content/CoursesContent";
import DynamicForm from "../../Components/Forms/dynamicForm.jsx";
import DynamicFilter from "../../Components/DynamicFilter.jsx";
import { courseFields } from "../../../Static/formsInputs";
import "../../../CSS/Pages/Courses/courses.css";
import Popup from "../../Components/Cards/PopUp.jsx";

// TODO: Consider moving these constants to a separate constants file
const COURSES_PER_PAGE = 4;
const DEFAULT_FILTERS = {
  group: "all",
  year: "all",
  semester: "all",
  academicYear: new Date().getFullYear().toString(),
};

// TODO: Consider moving utility functions to a separate utils file
const sortCoursesByYear = (courses) =>
  [...courses].sort((a, b) => (b.academicYear || 0) - (a.academicYear || 0));

const getUniqueValues = (array, key) =>
  [...new Set(array.map(item => item[key]).filter(value => value != null))];

const convertToNumbers = (formData, numericFields) => {
  const result = { ...formData };
  numericFields.forEach(field => {
    result[field] = parseInt(formData[field]) || (field === 'credits' ? 0 : 1);
  });
  return result;
};

export default function Courses() {
  const currentYear = new Date().getFullYear().toString();
  
  // State management
  const [isCoursePopupOpen, setCoursePopupOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [allCourses, setAllCourses] = useState(() => sortCoursesByYear(coursesList));
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [visibleCourses, setVisibleCourses] = useState([]);
  const [useFilters, setUseFilters] = useState(true);
  const [editingCourse, setEditingCourse] = useState(null);
  const [dynamicYearOptions, setDynamicYearOptions] = useState([]);

  // Refs for intersection observer
  const observer = useRef();
  const loadMoreRef = useRef();

  // Memoized computed values
  const courseYears = useMemo(() => 
    getUniqueValues(allCourses, 'academicYear').map(String), 
    [allCourses]
  );

  const groupOptions = useMemo(() => 
    getUniqueValues(allCourses, 'group'), 
    [allCourses]
  );

  const filterFields = useMemo(() => [
    {
      label: "Group",
      name: "group",
      options: [...groupOptions],
    },
    {
      label: "Year",
      name: "year",
      options: ["1", "2", "3", "4"],
    },
    {
      label: "Semester",
      name: "semester",
      options: ["1", "2"],
    },
    {
      label: "Academic Year",
      name: "academicYear",
      options: [...courseYears.sort((a, b) => b - a)],
    },
  ], [groupOptions, courseYears]);

  // Course filtering logic
  const applyFilters = useCallback((courses, currentFilters, query, shouldUseFilters) => {
    return courses.filter(course => {
      if (!shouldUseFilters) {
        const searchTerm = query.toLowerCase();
        return (
          course.title?.toLowerCase().includes(searchTerm) ||
          course.code?.toLowerCase().includes(searchTerm)
        );
      }

      return (
        (currentFilters.group === "all" || course.group === currentFilters.group) &&
        (currentFilters.year === "all" || course.year?.toString() === currentFilters.year) &&
        (currentFilters.semester === "all" || course.semester?.toString() === currentFilters.semester) &&
        (currentFilters.academicYear === "all" || course.academicYear?.toString() === currentFilters.academicYear)
      );
    });
  }, []);

  // Filter courses whenever dependencies change
  useEffect(() => {
    const filtered = applyFilters(allCourses, filters, searchQuery, useFilters);
    setFilteredCourses(filtered);
    setVisibleCourses(filtered.slice(0, COURSES_PER_PAGE));
  }, [filters, searchQuery, useFilters, allCourses, applyFilters]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const currentObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && visibleCourses.length < filteredCourses.length) {
        setVisibleCourses(prev => [
          ...prev,
          ...filteredCourses.slice(prev.length, prev.length + COURSES_PER_PAGE),
        ]);
      }
    });

    currentObserver.observe(loadMoreRef.current);
    observer.current = currentObserver;

    return () => currentObserver.disconnect();
  }, [visibleCourses.length, filteredCourses.length, filteredCourses]);

  // Event handlers
  const handleSearch = useCallback(() => {
    setUseFilters(false);
    setSearchQuery(searchInput);
  }, [searchInput]);

  const handleFilterChange = useCallback((name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setUseFilters(true);
    setSearchQuery("");
  }, []);

  const handleAddCourse = useCallback(() => {
    setEditingCourse(null);
    setDynamicYearOptions([]);
    setCoursePopupOpen(true);
  }, []);

  const handleEditCourse = useCallback((course) => {
    const courseToEdit = {
      ...course,
      id: course.id,
      title: course.title || "",
      code: course.code || "",
      group: course.group || "",
      year: course.year?.toString() || "1",
      semester: course.semester?.toString() || "1",
      academicYear: course.academicYear?.toString() || currentYear,
      description: course.description || "",
      credits: course.credits || 0,
      instructor: course.instructor || "",
    };

    const yearOptions = getYearOptionsForGroup(course.group);
    setDynamicYearOptions(yearOptions);
    setEditingCourse(courseToEdit);
    setCoursePopupOpen(true);
  }, [currentYear]);

  const handleDeleteCourse = useCallback((id) => {
    setAllCourses(prev => prev.filter(course => course.id !== id));
  }, []);

  const handleSubmit = useCallback((formData) => {
    const numericFields = ['year', 'semester', 'academicYear', 'credits'];
    const processedData = convertToNumbers(formData, numericFields);

    if (editingCourse) {
      // Update existing course
      setAllCourses(prev => prev.map(course =>
        course.id === editingCourse.id
          ? { ...course, ...processedData }
          : course
      ));
    } else {
      // Add new course
      const newCourse = {
        ...processedData,
        id: Date.now(),
        students: 0,
        rating: 0,
        lessons: 0,
        img: "",
      };
      setAllCourses(prev => [newCourse, ...prev]);
    }

    setCoursePopupOpen(false);
    setEditingCourse(null);
  }, [editingCourse]);

  const handleGroupChange = useCallback((selectedGroup) => {
    const yearOptions = getYearOptionsForGroup(selectedGroup);
    setDynamicYearOptions(yearOptions);
  }, []);

  const handlePopupClose = useCallback(() => {
    setCoursePopupOpen(false);
  }, []);

  // Update course fields with dynamic year options
  const updatedCourseFields = useMemo(() =>
    courseFields.map(field =>
      field.name === "year"
        ? { ...field, options: dynamicYearOptions }
        : field
    ), [dynamicYearOptions]
  );

  return (
    <div className="courses-header">
      <div className="header-content">
        {/* Header section */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <h2>Course Management</h2>
          <button
            className="add-course-btn"
            onClick={handleAddCourse}
            style={{
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
              marginLeft: "20px",
              fontSize: "16px",
            }}
          >
            Add Course
          </button>
        </div>

        {/* Filter and search section */}
        //TODO: add a filter for selectable course or not (yes or no)
        <div className="filter-container">
          <DynamicFilter
            filters={filterFields}
            values={filters}
            onChange={handleFilterChange}
          />
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Search by course name or code..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="filter-select"
              style={{ width: "220px" }}
            />
            <button className="search-btn" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Courses content */}
      <CoursesContent
        courses={visibleCourses}
        onDeleteCourse={handleDeleteCourse}
        onEditCourse={handleEditCourse}
      />

      {/* Infinite scroll trigger */}
      <div ref={loadMoreRef} style={{ height: "30px" }} />

      {/* Course form popup */}
      {isCoursePopupOpen && (
        <Popup isOpen={isCoursePopupOpen} onClose={handlePopupClose}>
          <DynamicForm
            fields={updatedCourseFields}
            onSubmit={handleSubmit}
            onCancel={handlePopupClose}
            submitText={editingCourse ? "Update Course" : "Add Course"}
            initialData={editingCourse}
            onFieldChange={handleGroupChange}
          />
        </Popup>
      )}
    </div>
  );
}