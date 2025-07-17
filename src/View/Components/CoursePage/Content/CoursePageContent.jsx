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
} from "../../../../Static/FIxed/coursePageData.js";
import CourseFilesManager from "./CourseFilesManager.jsx";
import DynamicForm from "../../Forms/dynamicForm.jsx";
import {
  studentFormFields,
  studentValidationRules,
} from "../../../../Static/FIxed/formsInputs.js";
import Popup from "../../Cards/PopUp.jsx";
import { Users, Calendar, CheckSquare, Award } from "lucide-react";

const CoursePageContent = ({ courseData, userRole = "1100" }) => {
  const [activeSection, setActiveSection] = useState("charts");
  const [selectedYear, setSelectedYear] = useState("");

  // Get course-specific data
  const courseId = courseData?.id;
  const contentConfig = courseId ? getContentConfig(courseId, userRole) : null;
  const gradeDistributionData = courseId
    ? getCourseChartData(courseId, "gradeDistribution", selectedYear)
    : [];
  const assignmentProgressData = courseId
    ? getCourseChartData(courseId, "assignmentProgress", selectedYear)
    : [];
  const courseMaterials = courseId ? getCourseMaterials(courseId) : [];
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [students, setStudents] = useState(studentsData || []);

  // FIXED: Fallback data that matches your BarChart structure
  const fallbackGradeData = [
    {
      Group: "A (90-100)",
      "First year": 8,
      "Second year": 0,
      "Third year": 0,
    },
    {
      Group: "B (80-89)",
      "First year": 15,
      "Second year": 0,
      "Third year": 0,
    },
    {
      Group: "C (70-79)",
      "First year": 10,
      "Second year": 0,
      "Third year": 0,
    },
    {
      Group: "D (60-69)",
      "First year": 3,
      "Second year": 0,
      "Third year": 0,
    },
    {
      Group: "F (<60)",
      "First year": 1,
      "Second year": 0,
      "Third year": 0,
    },
  ];

  const fallbackAssignmentData = [
    {
      id: "Completed",
      color: "hsl(167, 70%, 50%)",
      data: [
        { x: "Assignment 1", y: 25 },
        { x: "Assignment 2", y: 28 },
        { x: "Assignment 3", y: 30 },
        { x: "Assignment 4", y: 27 },
      ],
    },
    {
      id: "On Time",
      color: "hsl(210, 70%, 50%)",
      data: [
        { x: "Assignment 1", y: 22 },
        { x: "Assignment 2", y: 25 },
        { x: "Assignment 3", y: 28 },
        { x: "Assignment 4", y: 25 },
      ],
    },
  ];

  const handleAddStudent = (studentData) => {
    try {
      const newStudent = {
        ...studentData,
        id: students && students.length > 0 ? Math.max(...students.map((s) => s.id || 0)) + 1 : 1,
        photo: studentData.photo || "https://randomuser.me/api/portraits/lego/1.jpg",
        enrollmentDate: new Date().toISOString().split('T')[0],
        status: "Active"
      };

      setStudents((prev) => Array.isArray(prev) ? [...prev, newStudent] : [newStudent]);
      setShowAddStudentForm(false);

      // Optional: Show success message
      console.log("Student added successfully:", newStudent);
    } catch (error) {
      console.error("Error adding student:", error);
    }
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: "20px",
              height: "450px",
              marginTop: "10px",
            }}
          >
            {/* Course Details Section */}
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e0e0e0",
                borderRadius: "12px",
                padding: "24px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)",
                overflow: "hidden",
                height: "100%",
              }}
            >
              <CourseDetails courseData={contentConfig.courseDetails || courseData} />
            </div>

            {/* Academic Progress Section */}
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                overflow: "hidden",
                height: "100%",
                display: "flex",
                flexDirection: "column"
              }}
            >
              {/* Pie Chart Container - Larger and centered */}
              <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "32px",
                height: "240px"
              }}>
                <PieChart
                  data={contentConfig.progressData || [
                    { id: "attendant", value: 45, color: "#8b5cf6" },
                    { id: "not attendant", value: 35, color: "#ef4444" },
                    { id: "approved", value: 20, color: "#f59e0b" }
                  ]}
                  style={{
                    width: "240px",
                    height: "240px",
                  }}
                />
              </div>

              {/* Stats Grid - 2x2 layout with icons */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  flex: "1"
                }}
              >
                {/* Attendance Rate */}
                <div
                  style={{
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    borderRadius: "12px",
                    padding: "16px",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)",
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  <div style={{
                    position: "absolute",
                    top: "-10px",
                    right: "-10px",
                    width: "30px",
                    height: "30px",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "50%"
                  }}></div>
                  <Users size={24} style={{ marginBottom: "8px", opacity: 0.9 }} />
                  <div style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "rgba(255, 255, 255, 0.9)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "4px"
                  }}>
                    Attendance Rate
                  </div>
                  <div style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    textShadow: "0 1px 2px rgba(0,0,0,0.2)"
                  }}>
                    {contentConfig?.stats?.attendanceRate || "85"}%
                  </div>
                </div>

                {/* Next Assignment */}
                <div
                  style={{
                    background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                    borderRadius: "12px",
                    padding: "16px",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                    boxShadow: "0 4px 12px rgba(245, 158, 11, 0.25)",
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  <div style={{
                    position: "absolute",
                    top: "-10px",
                    right: "-10px",
                    width: "30px",
                    height: "30px",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "50%"
                  }}></div>
                  <Calendar size={24} style={{ marginBottom: "8px", opacity: 0.9 }} />
                  <div style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "rgba(255, 255, 255, 0.9)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "4px"
                  }}>
                    Next Assignment
                  </div>
                  <div style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    textShadow: "0 1px 2px rgba(0,0,0,0.2)"
                  }}>
                    {contentConfig?.stats?.nextAssignmentDays || "7"} Days
                  </div>
                </div>

                {/* Completed Tasks */}
                <div
                  style={{
                    background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                    borderRadius: "12px",
                    padding: "16px",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                    boxShadow: "0 4px 12px rgba(139, 92, 246, 0.25)",
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  <div style={{
                    position: "absolute",
                    top: "-10px",
                    right: "-10px",
                    width: "30px",
                    height: "30px",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "50%"
                  }}></div>
                  <CheckSquare size={24} style={{ marginBottom: "8px", opacity: 0.9 }} />
                  <div style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "rgba(255, 255, 255, 0.9)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "4px"
                  }}>
                    Completed Tasks
                  </div>
                  <div style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    textShadow: "0 1px 2px rgba(0,0,0,0.2)"
                  }}>
                    {contentConfig?.stats?.completedTasks?.completed || "2"}/{contentConfig?.stats?.completedTasks?.total || "4"}
                  </div>
                </div>

                {/* Current GPA */}
                <div
                  style={{
                    background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
                    borderRadius: "12px",
                    padding: "16px",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                    boxShadow: "0 4px 12px rgba(6, 182, 212, 0.25)",
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  <div style={{
                    position: "absolute",
                    top: "-10px",
                    right: "-10px",
                    width: "30px",
                    height: "30px",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "50%"
                  }}></div>
                  <Award size={24} style={{ marginBottom: "8px", opacity: 0.9 }} />
                  <div style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "rgba(255, 255, 255, 0.9)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "4px"
                  }}>
                    Current GPA
                  </div>
                  <div style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    textShadow: "0 1px 2px rgba(0,0,0,0.2)"
                  }}>
                    {contentConfig?.stats?.currentGPA || "3.2"}
                  </div>
                </div>
              </div>
            </div>
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
              icon="students"
              title="Students List"
              subtitle="Manage your students"
              addButtonText="Add Student"
              data={students}
              showAddButton={true}
              onAddClick={() => setShowAddStudentForm(true)}
            />
            <Popup isOpen={showAddStudentForm} onClose={handleCancelAddStudent}>
              <DynamicForm
                title="Add New Student"
                fields={studentFormFields || [
                  {
                    name: "firstName",
                    label: "First Name",
                    type: "text",
                    required: true,
                    placeholder: "Enter first name"
                  },
                  {
                    name: "lastName",
                    label: "Last Name", 
                    type: "text",
                    required: true,
                    placeholder: "Enter last name"
                  },
                  {
                    name: "email",
                    label: "Email",
                    type: "email",
                    required: true,
                    placeholder: "Enter email address"
                  },
                  {
                    name: "studentId",
                    label: "Student ID",
                    type: "text",
                    required: true,
                    placeholder: "Enter student ID"
                  },
                  {
                    name: "phone",
                    label: "Phone Number",
                    type: "tel",
                    required: false,
                    placeholder: "Enter phone number"
                  },
                  {
                    name: "yearOfStudy",
                    label: "Year of Study",
                    type: "select",
                    required: true,
                    options: [
                      { value: "", label: "Select year" },
                      { value: "1", label: "First Year" },
                      { value: "2", label: "Second Year" },
                      { value: "3", label: "Third Year" },
                      { value: "4", label: "Fourth Year" }
                    ]
                  },
                  {
                    name: "major",
                    label: "Major",
                    type: "text",
                    required: true,
                    placeholder: "Enter major/specialization"
                  }
                ]}
                initialData={{
                  firstName: "",
                  lastName: "",
                  email: "",
                  studentId: "",
                  phone: "",
                  yearOfStudy: "",
                  major: ""
                }}
                onSubmit={handleAddStudent}
                onCancel={handleCancelAddStudent}
                submitText="Add Student"
                cancelText="Cancel"
                validationRules={studentValidationRules || {
                  firstName: { required: true, minLength: 2 },
                  lastName: { required: true, minLength: 2 },
                  email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
                  studentId: { required: true, minLength: 3 },
                  yearOfStudy: { required: true },
                  major: { required: true, minLength: 2 }
                }}
              />
            </Popup>
          </>
        );
      case "files":
        return <CourseFilesManager courseId={courseId} userRole={userRole} />;
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