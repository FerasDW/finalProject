import React from "react";
import CoursePageContent from "../Components/CoursePage/Content/CoursePageContent.js";

import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext.js";

const CoursePage = () => {

  const { authData, loading } = useContext(AuthContext);
  if (loading) return <p>Loading...</p>;
  // if (!authData) return <p>You must be logged in to view this page.</p>;


  return (
    <div className="CoursePageContent">
        {/* <CoursePageContent userRole={authData.role} /> */}
        <CoursePageContent userRole={"1100"}/>
    </div>
  );
};

export default CoursePage;
