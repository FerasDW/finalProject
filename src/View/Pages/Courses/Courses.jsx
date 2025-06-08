import React, { useState, useEffect } from "react";
import coursesList from "../../../Static/coursesData";
import CoursesContent from "../../Components/Courses/Content/CoursesContent";
import DynamicForm from "../../Components/Forms/DynamicForm.jsx";
import { courseFields } from "../../../Static/formsInputs";
import "../../../CSS/Courses/courses.css";

export default function Courses() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [allCourses, setAllCourses] = useState(coursesList);
  const [filteredCourses, setFilteredCourses] = useState(coursesList);
  const [useFilters, setUseFilters] = useState(true);

  // Popup state
  const [showPopup, setShowPopup] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  // Open popup for adding new course
  const handleAddCourse = () => {
    setEditingCourse(null);
    setShowPopup(true);
  };

  // Open popup for editing existing course
  const handleEditCourse = (course) => {
    const courseForForm = {
      id: course.id, // 🔥 ADD THIS LINE - This was missing!
      title: course.title || "",
      code: course.code || "",
      year: course.year || "1",
      semester: course.semester || "1",
      group: course.group || "No group",
      students: course.students || 0,
      lessons: course.lessons || 0,
      rating: course.rating || 0,
      img: course.img?.default || "",
    };

    setEditingCourse(courseForForm);
    setShowPopup(true);
  };

  // Submit handler for DynamicForm
  const handleSubmit = (formData) => {
    let updatedCourse;

    if (editingCourse) {
      // Edit mode
      updatedCourse = {
        ...editingCourse,
        ...formData,
      };

      const updatedList = allCourses.map(
        (c) => (c.id === editingCourse.id ? updatedCourse : c)
      );
      setAllCourses(updatedList);
      alert("Course updated successfully!");
    } else {
      // Add mode
      updatedCourse = {
        id: Date.now(),
        students: 0,
        rating: 0,
        lessons: 0,
        img: "", // You can assign a default image if needed
        ...formData,
      };
      setAllCourses([updatedCourse, ...allCourses]);
      alert("Course added successfully!");
    }

    setShowPopup(false);
    setEditingCourse(null);
  };

  // Handle course deletion
  const handleDeleteCourse = (id) => {
    const updatedCourses = allCourses.filter((course) => course.id !== id);
    setAllCourses(updatedCourses);
  };

  // Reset filters/search
  useEffect(() => {
    setUseFilters(true);
    setSearchQuery("");
  }, [selectedYear, selectedSemester, selectedGroup]);

  // Update course list based on filters or search
  useEffect(() => {
    if (!useFilters) {
      setFilteredCourses(
        allCourses.filter(
          (course) =>
            course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.code.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredCourses(
        allCourses.filter(
          (course) =>
            (selectedYear === "all" || course.year === selectedYear) &&
            (selectedSemester === "all" ||
              course.semester === selectedSemester) &&
            (selectedGroup === "all" || course.group === selectedGroup)
        )
      );
    }
  }, [
    searchQuery,
    selectedYear,
    selectedSemester,
    selectedGroup,
    useFilters,
    allCourses,
  ]);

  // Get unique groups
  const getUniqueGroups = () => {
    const groups = [...new Set(allCourses.map((course) => course.group))];
    return groups.sort();
  };

  // Get available years based on group
  const getAvailableYears = () => {
    if (selectedGroup === "all") {
      const allYears = [...new Set(allCourses.map((course) => course.year))];
      return allYears.sort();
    } else {
      const groupCourses = allCourses.filter(
        (course) => course.group === selectedGroup
      );
      const availableYears = [
        ...new Set(groupCourses.map((course) => course.year)),
      ];
      return availableYears.sort();
    }
  };

  // Reset year when group changes
  useEffect(() => {
    if (selectedGroup !== "all") {
      const availableYears = getAvailableYears();
      if (selectedYear !== "all" && !availableYears.includes(selectedYear)) {
        setSelectedYear("all");
        setSelectedSemester("all");
      }
    }
  }, [selectedGroup]);

  return (
    <div className="courses-header">
      <div className="header-content">
        <div className="header-title">
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

        {/* Filters */}
        <div className="filter-container">
          <div className="filter-group">
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Programs</option>
              {getUniqueGroups().map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Years</option>
              {getAvailableYears().map((year) => (
                <option key={year} value={year}>
                  {["1", "2", "3", "4"].includes(year) ? `Year ${year}` : year}
                </option>
              ))}
            </select>

            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Semesters</option>
              <option value="1">First Semester</option>
              <option value="2">Second Semester</option>
            </select>
          </div>

          {/* Search */}
          <div
            className="right-side"
            style={{ display: "flex", flexDirection: "row", gap: "10px" }}
          >
            <input
              type="text"
              placeholder="Search by course name or code..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="filter-select"
            />
            <button
              className="search-btn"
              onClick={() => {
                setSearchQuery(searchInput);
                setUseFilters(false);
              }}
            >
              Search
            </button>
          </div>
        </div>

        {/* Filter Info */}
        {selectedGroup !== "all" && (
          <div style={{ padding: "10px", fontSize: "14px", color: "#666" }}>
            Showing courses for: <strong>{selectedGroup}</strong>
            {selectedGroup === "Certificate IT" && " (1 Year Program)"}
            {selectedGroup === "Business Diploma" && " (2 Year Program)"}
            {selectedGroup === "Information Systems" && " (3 Year Program)"}
            {selectedGroup === "Nursing" && " (4 Year Program)"}
          </div>
        )}
      </div>

      {/* Display filtered courses */}
      <CoursesContent
        courses={filteredCourses}
        onDeleteCourse={handleDeleteCourse}
        onEditCourse={handleEditCourse}
      />

      {/* 💥 Simple Popup Form */}
      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingCourse ? "Edit Course" : "Add New Course"}</h3>
            <DynamicForm
              fields={courseFields}
              onSubmit={handleSubmit}
              onCancel={() => setShowPopup(false)} // Add this line
              submitText={editingCourse ? "Update Course" : "Add Course"}
              initialData={editingCourse}
            />
          </div>
        </div>
      )}
    </div>
  );
}
