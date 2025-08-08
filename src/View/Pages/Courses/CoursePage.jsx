// pages/CoursePage.jsx
import React, { useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import CoursePageContent from "../../Components/CoursePage/Content/CoursePageContent.jsx";
import { AuthContext } from "../../../Context/AuthContext.jsx";
import useCourseData from "../../../Hooks/useCourseData.js";
import styles from "../../../CSS/Pages/CoursePage/CoursePage.module.css";
import Loader from "../Global/Loading.jsx";
import NotFoundPage from "../Errors/404.jsx";

const CoursePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const { authData, loading: authLoading } = useContext(AuthContext);
  const { courseData, error, loading: courseLoading } = useCourseData(id, location.state);

  if (authLoading || courseLoading) return <Loader />;
  if (error) return <NotFoundPage />;
  if (id && !courseData) {
    return (
      <div className={styles.errorContainer}>
        <h2>Course Not Found</h2>
        <p>The course with ID {id} could not be found.</p>
        <p>Please verify the course ID is correct.</p>
      </div>
    );
  }

  return (
    <div className={styles.coursePageContent}>
      <CoursePageContent userRole={authData?.role} courseData={courseData} />
    </div>
  );
};

export default CoursePage;