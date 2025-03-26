import React from "react";
import "../../../../CSS/CoursePage/CoursePage.css";



import { contentConfig } from "../../../../Static/coursePageData";

const CoursePageContent = ({ userRole }) => {
  return (
    <div className="content">
      {contentConfig[userRole] || <p>No content available for this role.</p>}
    </div>
  );
};

export default CoursePageContent;