// CourseDetails.jsx - Updated to use dynamic course data

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

const CourseDetails = ({ courseData }) => {
  // Use courseData prop or fallback to default values
  const details = courseData || {
    courseCode: "N/A",
    courseTitle: "Course Title Not Available",
    instructor: "Unknown Instructor",
    enrolledStudents: 0,
    classTiming: "TBD",
    faculty: "Unknown Faculty",
    language: "English",
    assignments: 0,
    practicalType: "General Course",
    finalExam: "TBD",
    prerequisite: "None",
  };

  return (
    <div className="course-details-container">
      <div className="course-description">
        {/* Enhanced Course Header */}
        <div className="course-header-section">
          <div className="course-main-info">
            <h3 className="course-title">{details.courseTitle}</h3>
            <div className="course-meta">
              <span className="course-code">{details.courseCode}</span>
              <div className="course-rating">
                <FontAwesomeIcon icon={faStar} className="star-icon" />
                <span>4.5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Course Description */}
        <div className="course-description-text">
          <p>
            This comprehensive course covers essential concepts and practical
            applications in {details.courseTitle.toLowerCase()}. Students will
            engage in hands-on learning experiences and develop critical skills
            necessary for success in this field. The course combines theoretical
            foundations with practical implementation to ensure a well-rounded
            educational experience.
          </p>
        </div>

        {/* Enhanced Progress Section */}
        <div className="progress-section">
          <div className="progress-header">
            <span className="progress-label">Course Progress</span>
            <span className="progress-percentage">80%</span>
          </div>
          <div className="progress-bar">
            <ProgressBar progress={80} />
          </div>
          <div className="progress-milestones">
            <span className="milestone completed">Enrolled</span>
            <span className="milestone completed">In Progress</span>
            <span className="milestone">Completed</span>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      <div className="course-data">
        <div className="course-details-grid">
          <div className="details-column">
            <CourseDetailRow
              icon={<FontAwesomeIcon icon={faUserGroup} />}
              title={`${details.enrolledStudents} Students`}
            />
            <CourseDetailRow
              icon={<FontAwesomeIcon icon={faClock} />}
              title={details.classTiming}
            />
            <CourseDetailRow
              icon={<FontAwesomeIcon icon={faStar} />}
              title="3 points"
            />
            <CourseDetailRow
              icon={<FontAwesomeIcon icon={faChalkboardUser} />}
              title={`Instructor: ${details.instructor}`}
            />
            <CourseDetailRow
              icon={<FontAwesomeIcon icon={faBuilding} />}
              title={details.faculty}
            />
          </div>

          <div className="details-column">
            <CourseDetailRow
              icon={<FontAwesomeIcon icon={faLanguage} />}
              title={`Language: ${details.language}`}
            />
            <CourseDetailRow
              icon={<FontAwesomeIcon icon={faTasks} />}
              title={`Assignments: ${details.assignments} total`}
            />
            <CourseDetailRow
              icon={<FontAwesomeIcon icon={faFlask} />}
              title={`Type: ${details.practicalType}`}
            />
            <CourseDetailRow
              icon={<FontAwesomeIcon icon={faPencilAlt} />}
              title={`Final Exam: ${details.finalExam}`}
            />
            <CourseDetailRow
              icon={<FontAwesomeIcon icon={faLink} />}
              title={`Prerequisite: ${details.prerequisite}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
