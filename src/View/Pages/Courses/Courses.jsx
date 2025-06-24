import React, { useState, useEffect, useRef, useMemo } from "react";
import coursesList from "../../../Static/coursesData";
import CoursesContent from "../../Components/Courses/Content/CoursesContent";
import DynamicForm from "../../Components/Forms/dynamicForm.jsx";
import DynamicFilter from "../../Components/DynamicFilter.jsx";
import { courseFields } from "../../../Static/formsInputs";
import "../../../CSS/Pages/Courses/courses.css"; // Assuming you have a CSS file for styles
import Popup from "../../Components/Cards/PopUp.jsx";
export default function Courses() {
  const currentYear = new Date().getFullYear().toString();
  const [isCoursePopupOpen, setCoursePopupOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    group: "all",
    year: "all",
    semester: "all",
    academicYear: currentYear,
  });
  const [allCourses, setAllCourses] = useState(
    [...coursesList].sort((a, b) => {
      const yearA = a.academicYear || 0;
      const yearB = b.academicYear || 0;
      return yearB - yearA;
    })
  );
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [visibleCourses, setVisibleCourses] = useState([]);
  const [useFilters, setUseFilters] = useState(true);
  const [editingCourse, setEditingCourse] = useState(null);
  const observer = useRef();
  const loadMoreRef = useRef();

  // Fixed useMemo with null/undefined checks
  const courseYears = useMemo(() => {
    const years = allCourses
      .map(c => c.academicYear)
      .filter(year => year !== null && year !== undefined)
      .map(year => year.toString());
    return [...new Set(years)];
  }, [allCourses]);

  const groupOptions = useMemo(() => {
    const groups = allCourses
      .map(c => c.group)
      .filter(group => group !== null && group !== undefined);
    return [...new Set(groups)];
  }, [allCourses]);

  useEffect(() => {
    const filtered = allCourses.filter(course => {
      if (!useFilters) {
        return (
          course.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
          course.code?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      return (
        (filters.group === "all" || course.group === filters.group) &&
        (filters.year === "all" || course.year?.toString() === filters.year) &&
        (filters.semester === "all" || course.semester?.toString() === filters.semester) &&
        (filters.academicYear === "all" || course.academicYear?.toString() === filters.academicYear)
      );
    });
    
    setFilteredCourses(filtered);
    setVisibleCourses(filtered.slice(0, 4));
  }, [filters, searchQuery, useFilters, allCourses]);

  const handleSearch = () => {
    setUseFilters(false);
    setSearchQuery(searchInput);
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setUseFilters(true);
    setSearchQuery("");
  };

  const loadMore = () => {
    setVisibleCourses(prev => [
      ...prev,
      ...filteredCourses.slice(prev.length, prev.length + 4),
    ]);
  };

  useEffect(() => {
    if (!loadMoreRef.current) return;
    observer.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && visibleCourses.length < filteredCourses.length) {
        loadMore();
      }
    });
    observer.current.observe(loadMoreRef.current);
    return () => observer.current.disconnect();
  }, [visibleCourses, filteredCourses]);

  const handleAddCourse = () => {
    setEditingCourse(null);
    setCoursePopupOpen(true);
  };

  const handleEditCourse = (course) => {
    console.log("Editing course:", course);
    // Create a properly formatted course object for editing
    const courseToEdit = {
      ...course,
      // Ensure all fields have proper values for the form
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
      // Add any other fields that your form expects
    };
    
    setEditingCourse(courseToEdit);
    setCoursePopupOpen(true);
  };

  const handleDeleteCourse = (id) => {
    const updatedCourses = allCourses.filter(course => course.id !== id);
    setAllCourses(updatedCourses);
  };

  const handleSubmit = (formData) => {
    if (editingCourse) {
      // Update existing course
      const updatedList = allCourses.map(c =>
        c.id === editingCourse.id ? { 
          ...c, 
          ...formData,
          // Ensure numeric fields are properly converted
          year: parseInt(formData.year) || 1,
          semester: parseInt(formData.semester) || 1,
          academicYear: parseInt(formData.academicYear) || parseInt(currentYear),
          credits: parseInt(formData.credits) || 0
        } : c
      );
      setAllCourses(updatedList);
    } else {
      // Add new course
      const newCourse = {
        ...formData,
        id: Date.now(),
        students: 0,
        rating: 0,
        lessons: 0,
        img: "",
        // Ensure numeric fields are properly converted
        year: parseInt(formData.year) || 1,
        semester: parseInt(formData.semester) || 1,
        academicYear: parseInt(formData.academicYear) || parseInt(currentYear),
        credits: parseInt(formData.credits) || 0
      };
      setAllCourses([newCourse, ...allCourses]);
    }
    setCoursePopupOpen(false);
    setEditingCourse(null);
  };

  const filterFields = [
    { 
      label: "Group", 
      name: "group", 
      options: [ ...groupOptions]
    },
    { 
      label: "Year", 
      name: "year", 
      options: ["1", "2", "3", "4"] 
    },
    { 
      label: "Semester", 
      name: "semester", 
      options: [ "1", "2"] 
    },
    { 
      label: "Academic Year", 
      name: "academicYear", 
      options: [ ...courseYears.sort((a, b) => b - a)]
    },
  ];

  return (
    <div className="courses-header">
      <div className="header-content">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Course Management</h2>
          {/* Add Course Button */}
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

        <div className="filter-container">
          <DynamicFilter filters={filterFields} values={filters} onChange={handleFilterChange} />
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Search by course name or code..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="filter-select"
              style={{ width: "220px" }}
            />
            <button className="search-btn" onClick={handleSearch}>Search</button>
          </div>
        </div>
      </div>

      <CoursesContent
        courses={visibleCourses}
        onDeleteCourse={handleDeleteCourse}
        onEditCourse={handleEditCourse}
      />

      <div ref={loadMoreRef} style={{ height: "30px" }}></div>

      {isCoursePopupOpen &&  <Popup 
        isOpen={isCoursePopupOpen} 
        onClose={() => setCoursePopupOpen(false)}
      >
        <DynamicForm
              fields={courseFields}
              onSubmit={handleSubmit}
              onCancel={() => setCoursePopupOpen(false)}
              submitText={editingCourse ? "Update Course" : "Add Course"}
              initialData={editingCourse}
            />
      </Popup>}
    </div>
  );
}
