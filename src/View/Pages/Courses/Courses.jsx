import React, { useState, useEffect, useRef, useMemo } from "react";
import coursesList from "../../../Static/coursesData";
import CoursesContent from "../../Components/Courses/Content/CoursesContent";
import DynamicForm from "../../Components/Forms/dynamicForm.jsx";
import DynamicFilter from "../../Components/DynamicFilter.jsx";
import { courseFields } from "../../../Static/formsInputs";
import "../../../CSS/Pages/Courses/courses.css"; // Assuming you have a CSS file for styles

export default function Courses() {
  const currentYear = new Date().getFullYear().toString();
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
  const [showPopup, setShowPopup] = useState(false);
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
    setShowPopup(true);
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
    setShowPopup(true);
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
    setShowPopup(false);
    setEditingCourse(null);
  };

  const filterFields = [
    { 
      label: "Group", 
      name: "group", 
      options: ["all", ...groupOptions]
    },
    { 
      label: "Year", 
      name: "year", 
      options: ["all", "1", "2", "3", "4"] 
    },
    { 
      label: "Semester", 
      name: "semester", 
      options: ["all", "1", "2"] 
    },
    { 
      label: "Academic Year", 
      name: "academicYear", 
      options: ["all", ...courseYears.sort((a, b) => b - a)]
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

      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingCourse ? "Edit Course" : "Add New Course"}</h3>
            <DynamicForm
              fields={courseFields}
              onSubmit={handleSubmit}
              onCancel={() => setShowPopup(false)}
              submitText={editingCourse ? "Update Course" : "Add Course"}
              initialData={editingCourse}
            />
          </div>
        </div>
      )}
    </div>
  );
}