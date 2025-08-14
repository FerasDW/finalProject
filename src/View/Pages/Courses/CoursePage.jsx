// pages/CoursePage.jsx
import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import CoursePageContent from "../../Components/CoursePage/Content/CoursePageContent.jsx";
import { AuthContext } from "../../../Context/AuthContext.jsx";
import useCourseData from "../../../Hooks/useCourseData.js";
import styles from "../../../CSS/Pages/CoursePage/CoursePage.module.css";
import Loader from "../Global/Loading.jsx";
import NotFoundPage from "../Errors/404.jsx";

const CoursePage = () => {
  const { id } = useParams();
  const { authData, loading: authLoading } = useContext(AuthContext);
  const { courseData, departments, error, loading: courseLoading, refetch } = useCourseData(id);

  if (authLoading || courseLoading) return <Loader />;
  if (error) return <NotFoundPage />;

  return (
    <div className={styles.coursePageContent}>
      <CoursePageContent 
        userRole={authData?.role} 
        courseData={courseData} 
        departments={departments}
        onStudentEnrolled={refetch}
      />
    </div>
  );
};

export default CoursePage;