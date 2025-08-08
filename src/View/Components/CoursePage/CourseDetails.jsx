import React from "react";
import "../../../CSS/Pages/CoursePage/CourseDetails.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserGroup,
  faClock,
  faStar,
  faChalkboardUser,
  faBuilding,
  faLanguage,
  faTasks,
  faFlask,
  faPencilAlt,
  faLink,
} from "@fortawesome/free-solid-svg-icons";
import CourseDetailRow from "./Content/courseDetailRow";
import ProgressBar from "../Charts/Bar";

// --- CHANGE 1: Accept the new 'totalStudents' prop ---
const CourseDetails = ({ courseData, totalStudents }) => {
  if (!courseData) {
    return <div>Course details are not available.</div>;
  }

  // Map backend data to variables for easier use.
  const courseTitle = courseData.name || "Untitled Course";
  const courseCode = courseData.code || "N/A";
  const department = courseData.department || "Unknown Department";
  const credits = courseData.credits || 0;
  const instructorName = courseData.lecturerId || "Not Assigned";

  return (
    <div className="course-details-container">
      <div className="course-description">
        <div className="course-header-section">
          <div className="course-main-info">
            <h3 className="course-title">{courseTitle}</h3>
            <div className="course-meta">
              <span className="course-code">{courseCode}</span>
              <div className="course-rating">
                <FontAwesomeIcon icon={faStar} className="star-icon" />
                <span>4.5</span>
              </div>
            </div>
          </div>
        </div>

        <div className="course-description-text">
          <p>
            {courseData.description || `This comprehensive course covers essential concepts and practical applications in ${courseTitle.toLowerCase()}.`}
          </p>
        </div>

        <div className="progress-section">
          <div className="progress-header">
            <span className="progress-label">Course Progress</span>
          </div>
          <div className="progress-bar">
            {/* Note: This progress is still static. We can build a feature for it later. */}
            <ProgressBar progress={80} />
          </div>
        </div>
      </div>

      <div className="course-data">
        <div className="course-details-grid">
          <div className="details-column">
            <CourseDetailRow
              icon={<FontAwesomeIcon icon={faUserGroup} />}
              // --- CHANGE 2: Use the 'totalStudents' prop for the correct total count ---
              title={`${totalStudents} Total Students`}
            />
            <CourseDetailRow
              icon={<FontAwesomeIcon icon={faClock} />}
              title={"TBD"}
            />
            <CourseDetailRow
              icon={<FontAwesomeIcon icon={faStar} />}
              title={`${credits} Credits`}
            />
            <CourseDetailRow
              icon={<FontAwesomeIcon icon={faChalkboardUser} />}
              title={`Instructor: ${instructorName}`}
            />
            <CourseDetailRow
              icon={<FontAwesomeIcon icon={faBuilding} />}
              title={department}
            />
          </div>

          <div className="details-column">
            <CourseDetailRow
              icon={<FontAwesomeIcon icon={faLanguage} />}
              title={"Language: English"}
            />
            <CourseDetailRow
              icon={<FontAwesomeIcon icon={faTasks} />}
              title={"Assignments: 4 total"}
            />
            <CourseDetailRow
              icon={<FontAwesomeIcon icon={faFlask} />}
              title={`Type: ${courseData.selectable ? 'Elective' : 'Mandatory'}`}
            />
            <CourseDetailRow
              icon={<FontAwesomeIcon icon={faPencilAlt} />}
              title={"Final Exam: TBD"}
            />
            <CourseDetailRow
              icon={<FontAwesomeIcon icon={faLink} />}
              title={"Prerequisite: None"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;