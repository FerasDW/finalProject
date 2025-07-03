import React, { useState } from "react";
import MidPageNavbar from "./MidPageNavBar";
import Box from "../../Dashboard/Content/Box";
import CourseDetails from "../CourseDetails";
import PieChart from "../../Charts/pieCharts";
import BarChart from "../../Charts/barChart";
import LineChart from "../../Charts/lineChart";
import StudentTable from "../../Tables/Table";
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
  const gradeDistributionData = courseId ? getCourseChartData(courseId, "gradeDistribution", selectedYear) : [];
  const assignmentProgressData = courseId ? getCourseChartData(courseId, "assignmentProgress", selectedYear) : [];
  const courseMaterials = courseId ? getCourseMaterials(courseId) : [];
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [students, setStudents] = useState(studentsData);

  // FIXED: Fallback data that matches your BarChart structure
  const fallbackGradeData = [
    {
      Group: "A (90-100)",
      "First year": 8,
      "Second year": 0,
      "Third year": 0
    },
    {
      Group: "B (80-89)",
      "First year": 15,
      "Second year": 0,
      "Third year": 0
    },
    {
      Group: "C (70-79)",
      "First year": 10,
      "Second year": 0,
      "Third year": 0
    },
    {
      Group: "D (60-69)",
      "First year": 3,
      "Second year": 0,
      "Third year": 0
    },
    {
      Group: "F (<60)",
      "First year": 1,
      "Second year": 0,
      "Third year": 0
    }
  ];

  const fallbackAssignmentData = [
    {
      id: "Completed",
      color: "hsl(167, 70%, 50%)",
      data: [
        { x: "Assignment 1", y: 25 },
        { x: "Assignment 2", y: 28 },
        { x: "Assignment 3", y: 30 },
        { x: "Assignment 4", y: 27 }
      ]
    },
    {
      id: "On Time",
      color: "hsl(210, 70%, 50%)",
      data: [
        { x: "Assignment 1", y: 22 },
        { x: "Assignment 2", y: 25 },
        { x: "Assignment 3", y: 28 },
        { x: "Assignment 4", y: 25 }
      ]
    }
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
              {/* Grade Distribution Bar Chart */}
              <Box
                title="Grade Distribution"
                chart={
                  <BarChart
                    data={
                      gradeDistributionData.length > 0
                        ? gradeDistributionData
                        : fallbackGradeData
                    }
                  />
                }
                gridRow="span 4"
                gridColumn="span 6"
              />
              
              {/* Assignment Progress Line Chart */}
              <Box
                title="Assignment Progress Timeline"
                chart={
                  <LineChart
                    data={
                      assignmentProgressData.length > 0
                        ? assignmentProgressData
                        : fallbackAssignmentData
                    }
                  />
                }
                gridRow="span 4"
                gridColumn="span 6"
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