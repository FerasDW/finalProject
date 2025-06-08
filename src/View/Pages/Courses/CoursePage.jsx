// CoursePage.jsx - Updated to properly pass course data

import React, { useState, useEffect, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import CoursePageContent from "../../Components/CoursePage/Content/CoursePageContent.jsx";
import coursesList from "../../../Static/coursesData";
import { AuthContext } from "../../../Context/AuthContext.jsx";

const CoursePage = () => {
  const { id } = useParams(); // Get course ID from URL
  const location = useLocation();
  const { authData, loading } = useContext(AuthContext);
  const [courseData, setCourseData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset error state
    setError(null);
    
    // First, check if course data was passed via navigation state (legacy support)
    if (location.state?.courseData) {
      setCourseData(location.state.courseData);
      return;
    }

    // If we have an ID from URL params, find the course by ID
    if (id) {
      const courseId = parseInt(id);
      const course = coursesList.find(course => course.id === courseId);
      
      if (course) {
        setCourseData(course);
      } else {
        // Course not found in coursesList
        setError(`Course with ID ${id} not found`);
        setCourseData(null);
      }
    } else {
      setError("No course ID provided");
      setCourseData(null);
    }
  }, [id, location.state]);

  // Loading state
  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }

  // Authentication check (uncomment if needed)
  // if (!authData) {
  //   return (
  //     <div style={{ padding: '20px', textAlign: 'center' }}>
  //       <p>You must be logged in to view this page.</p>
  //     </div>
  //   );
  // }

  // Error state
  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Course Not Found</h2>
        <p>{error}</p>
        <p>Please check the course ID and try again.</p>
      </div>
    );
  }

  // Course not found state
  if (id && !courseData) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Course Not Found</h2>
        <p>The course with ID {id} could not be found.</p>
        <p>Please verify the course ID is correct.</p>
      </div>
    );
  }

  return (
    <div className="CoursePageContent">
      <CoursePageContent 
        userRole={authData?.role || "1100"} 
        courseData={courseData} 
      />
    </div>
  );
};

export default CoursePage;