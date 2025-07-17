// pages/Courses.jsx
import React, { useRef, useEffect } from "react";
import CoursesContent from "../../Components/Courses/Content/CoursesContent";
import DynamicForm from "../../Components/Forms/dynamicForm.jsx";
import DynamicFilter from "../../Components/DynamicFilter.jsx";
import Popup from "../../Components/Cards/PopUp.jsx";
import useCourses from "../../../Hooks/useCourses.js";
import styles from "../../../CSS/Pages/Courses/courses.module.css";

export default function Courses() {
  const {
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
    updatedCourseFields,
    editingCourse,
    formData,
    errors,
    getAcademicYearOptions,
  } = useCourses();

  const loadMoreRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          console.log("Intersection detected, loading more..."); // Debug log
          loadMoreCourses();
        }
      },
      { threshold: 0.1 }
    );

    const currentLoadMoreRef = loadMoreRef.current;
    if (currentLoadMoreRef) {
      observer.observe(currentLoadMoreRef);
    }

    return () => {
      if (currentLoadMoreRef) {
        observer.unobserve(currentLoadMoreRef);
      }
    };
  }, [loadMoreCourses, hasMore, loading]);

  return (
    <div className={styles.coursesWrapper}>
      <div className={styles.coursesHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerSection}>
            <h2>Course Management</h2>
            <button className={styles.addCourseBtn} onClick={handleAddCourse}>
              Add Course
            </button>
          </div>
          <div className={styles.filterContainer}>
            <DynamicFilter
              filters={filterFields}
              values={filters}
              onChange={handleFilterChange}
            />
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search by course name or code..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className={styles.filterSelect}
              />
              <button className={styles.searchBtn} onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.cardsSection}>
        <div className={styles.cardsContainer}>
          <CoursesContent
            courses={displayedCourses}
            onDeleteCourse={handleDeleteCourse}
            onEditCourse={handleEditCourse}
          />
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', width: '100%' }}>
              <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </div>
          )}
          <div ref={loadMoreRef} className={styles.loadMoreTrigger} />
          {!hasMore && displayedCourses.length > 0 && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666', width: '100%' }}>
              All courses loaded ({displayedCourses.length} total)
            </div>
          )}
          {!loading && displayedCourses.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666', width: '100%' }}>
              No courses found matching your criteria.
            </div>
          )}
        </div>
      </div>
      {isCoursePopupOpen && (
        <Popup isOpen={isCoursePopupOpen} onClose={handlePopupClose}>
          <DynamicForm
            fields={updatedCourseFields}
            onSubmit={handleSubmit}
            onCancel={handlePopupClose}
            submitText={editingCourse ? "Update Course" : "Add Course"}
            initialData={formData}
            onFieldChange={handleFieldChange}
            getAcademicYearOptions={getAcademicYearOptions}
            errors={errors}
            key={editingCourse ? `edit-${formData.id}` : 'add'} // Force re-render when switching modes
          />
        </Popup>
      )}
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .${styles.loadMoreTrigger} { height: 20px; width: 100%; }
      `}</style>
    </div>
  );
}