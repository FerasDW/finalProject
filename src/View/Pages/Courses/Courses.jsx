import React, { useState, useEffect } from "react";
import coursesList from "../../../Static/coursesData";
import CoursesContent from "../../Components/Courses/Content/CoursesContent";

export default function Courses() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // The actual search query after clicking the button
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [allCourses, setAllCourses] = useState(coursesList); // Editable full list
  const [filteredCourses, setFilteredCourses] = useState(coursesList);
  const [useFilters, setUseFilters] = useState(true); // Determines whether filters or search is used

  // Update course list based on filters or search
  useEffect(() => {
    if (!useFilters) {
      // If there is a search query, ignore filters and display search results only
      setFilteredCourses(
        allCourses.filter(
          (course) =>
            course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.code.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      // Apply filters only and ignore the search query
      setFilteredCourses(
        allCourses.filter(
          (course) =>
            (selectedYear === "all" || course.year === selectedYear) &&
            (selectedSemester === "all" || course.semester === selectedSemester) &&
            (selectedGroup === "all" || course.group === selectedGroup)
        )
      );
    }
  }, [searchQuery, selectedYear, selectedSemester, selectedGroup, useFilters, allCourses]);

  // When the search button is clicked, update the search query and disable filters
  const handleSearch = () => {
    setSearchQuery(searchInput);
    setUseFilters(false); // Disable filters when searching
  };

  // When any filter is changed, cancel the search query and enable filters
  useEffect(() => {
    setUseFilters(true);
    setSearchQuery(""); // Reset search when filters change
  }, [selectedYear, selectedSemester, selectedGroup]);

  // Handle course deletion
  const handleDeleteCourse = (id) => {
    // TODO: Replace this logic with API call to delete course from backend
    // Example:
    // fetch(`/api/courses/${id}`, { method: 'DELETE' })
    //   .then(res => res.json())
    //   .then(() => {
    //     const updatedCourses = allCourses.filter(course => course.id !== id);
    //     setAllCourses(updatedCourses);
    //   });

    const updatedCourses = allCourses.filter(course => course.id !== id);
    setAllCourses(updatedCourses);
  };

  return (
    <div className="courses-header">
      <div className="header-content">
        <div className="header-title">
          <h2>Course Management</h2>
        </div>

        {/* Filters */}
        <div className="filter-container">
          <div className="filter-group">
            <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} className="filter-select">
              <option value="all">All Groups</option>
              <option value="A">Group A</option>
              <option value="B">Group B</option>
              <option value="C">Group C</option>
            </select>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="filter-select">
              <option value="all">All Years</option>
              <option value="1">First Year</option>
              <option value="2">Second Year</option>
              <option value="3">Third Year</option>
            </select>
            <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} className="filter-select">
              <option value="all">All Semesters</option>
              <option value="1">First Semester</option>
              <option value="2">Second Semester</option>
            </select>
          </div>

          {/* Search */}
          <div className="right-side" style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
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

      {/* Display filtered courses */}
      <CoursesContent courses={filteredCourses} onDeleteCourse={handleDeleteCourse} />
    </div>
  );
}
