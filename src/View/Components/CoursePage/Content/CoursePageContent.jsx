import React, { useState } from "react";
import MidPageNavbar from "./MidPageNavBar";
import Box from "../../Dashboard/Content/Box";
import CourseDetails from "../CourseDetails";
import PieChart from "../../Charts/pieCharts";
import BarChart from "../../Charts/barChart";
import StudentTable from "../../Tables/Table";
import Card from "./CourseMaterialCards";
import studentsData from "../../../../Static/students.js";
import {
  getContentConfig,
  getCourseChartData,
  getCourseMaterials,
  getCourseAnnouncements,
} from "../../../../Static/coursePageData";
import CourseFilesManager from "./CourseFilesManager.jsx";
import DynamicForm from "../../Forms/dynamicForm.jsx";
import {
  studentFormFields,
  studentValidationRules,
} from "../../../../Static/formsInputs.js";

const CoursePageContent = ({ courseData, userRole = "1100" }) => {
  const [activeSection, setActiveSection] = useState("charts");
  const [selectedYear, setSelectedYear] = useState("");

  // Get course-specific data
  const courseId = courseData?.id;
  const contentConfig = courseId ? getContentConfig(courseId, userRole) : null;
  const attendanceData = courseId
    ? getCourseChartData(courseId, "attendance")
    : [];
  const barChartData = courseId ? getCourseChartData(courseId, "bar") : [];
  const courseMaterials = courseId ? getCourseMaterials(courseId) : [];
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [students, setStudents] = useState(studentsData);

  // Fallback data if course not found or no specific data
  const fallbackAttendanceData = [
    { id: "Attended", label: "Attended", value: 75 },
    { id: "Missed", label: "Missed", value: 25 },
  ];

  const fallbackBarData = [
    {
      Group: "General",
      Attended: 70,
      AttendedColor: "hsl(167, 70%, 50%)",
      Missed: 30,
      MissedColor: "hsl(112, 70.20%, 50.00%)",
    },
  ];

  const handleAddStudent = (studentData) => {
    const newStudent = {
      ...studentData,
      id: Math.max(...students.map((s) => s.id)) + 1,
      photo:
        studentData.photo || "https://randomuser.me/api/portraits/lego/1.jpg",
    };

    setStudents((prev) => [...prev, newStudent]);
    setShowAddStudentForm(false);

    // Optional: Show success message
    console.log("Student added successfully:", newStudent);
  };

  const handleCancelAddStudent = () => {
    setShowAddStudentForm(false);
  };

  // Render the dynamic content based on course and user role
  const renderDynamicContent = () => {
    if (!contentConfig) return null;

    if (userRole === "1100") {
      return (
        <div style={{ padding: "20px" }}>
          <div className="row" style={{ marginTop: "10px" }}>
            {contentConfig.showCourseDetails && (
              <Box
                contentBox={
                  <CourseDetails courseData={contentConfig.courseDetails} />
                }
                gridRow="span 1"
                gridColumn="span 8"
              />
            )}
            {contentConfig.showAcademicProgress && (
              <Box
                title="Academic Progress"
                chart={<PieChart data={contentConfig.progressData} />}
                contentBox={
                  <div className="chart-additional-content">
                    {/* Main Progress Overview */}
                    <div className="progress-overview">
                      <div className="progress-main-stat">
                        <span className="progress-main-label">
                          Overall Progress
                        </span>
                        <span className="progress-main-value">
                          {contentConfig.stats.overallProgress}%
                        </span>
                      </div>
                      <div className="progress-status">
                        <div className="status-indicator"></div>
                        <span className="status-text">
                          {contentConfig.stats.progressStatus}
                        </span>
                      </div>
                    </div>
                    
                    {/* Course Statistics Grid */}
                    <div className="course-stats">
                      <div className="Course-stat-item">
                        <span className="stat-label">Attendance Rate</span>
                        <span className="stat-value success">
                          {contentConfig.stats.attendanceRate}%
                        </span>
                      </div>
                      <div className="Course-stat-item">
                        <span className="stat-label">Next Assignment</span>
                        <span className="stat-value primary">
                          {contentConfig.stats.nextAssignmentDays} Days
                        </span>
                      </div>
                      <div className="Course-stat-item">
                        <span className="stat-label">Completed Tasks</span>
                        <span className="stat-value primary">
                          {contentConfig.stats.completedTasks.completed}/
                          {contentConfig.stats.completedTasks.total}
                        </span>
                      </div>
                      <div className="Course-stat-item">
                        <span className="stat-label">Current GPA</span>
                        <span className="stat-value success">
                          {contentConfig.stats.currentGPA}
                        </span>
                      </div>
                    </div>
                  </div>
                }
                gridRow="span 1"
                gridColumn="span 4"
              />
            )}
          </div>
        </div>
      );
    }
    
    return null;
  };

  const renderSection = () => {
    switch (activeSection) {
      case "charts":
        return (
          <>
            <div className="row">
              <Box
                title="Course attendance percentage"
                chart={
                  <PieChart
                    data={
                      attendanceData.length > 0
                        ? attendanceData
                        : fallbackAttendanceData
                    }
                  />
                }
                gridRow="span 4"
                gridColumn="span 3"
              />
              <Box
                title="Weekly Attendance Trends"
                chart={
                  <BarChart
                    data={
                      barChartData.length > 0 ? barChartData : fallbackBarData
                    }
                  />
                }
                gridRow="span 4"
                gridColumn="span 9"
              />
            </div>
          </>
        );
      case "students":
        return (
          <>
            <StudentTable
              data={students}
              showAddButton={true}
              onAddClick={() => setShowAddStudentForm(true)}
            />
            {showAddStudentForm && (
              <DynamicForm
                title="Add New Student"
                fields={studentFormFields}
                onSubmit={handleAddStudent}
                onCancel={handleCancelAddStudent}
                submitText="Add Student"
                validationRules={studentValidationRules}
              />
            )}
          </>
        );
      case "files":
        return <CourseFilesManager courseId={courseId} />;
      // return <Card materials={courseMaterials} />;
      default:
        return null;
    }
  };

  // Handle case where course data is not found
  if (!courseData) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Course Data Not Available</h2>
        <p>Unable to load course information.</p>
      </div>
    );
  }

  return (
    <>
      {/* Render the dynamic content based on course and user role */}
      {renderDynamicContent()}

      <div
        className="navbar"
        style={{
          display: "flex",
          width: "95%",
          justifyContent: "center",
          marginTop: "30px",
        }}
      >
        <MidPageNavbar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          sections={["charts", "students", "files"]}
        />
      </div>

      <div className="dynamic-section" style={{ padding: "20px" }}>
        {renderSection()}
      </div>
    </>
  );
};

export default CoursePageContent;