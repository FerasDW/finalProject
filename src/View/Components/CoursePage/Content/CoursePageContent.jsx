import React, { useState, useEffect, useMemo } from "react";
import MidPageNavbar from "./MidPageNavBar";
import Box from "../../Dashboard/Content/Box";
import CourseDetails from "../CourseDetails";
import PieChart from "../../Charts/pieCharts";
import BarChart from "../../Charts/barChart";
import LineChart from "../../Charts/lineChart";
import StudentTable from "../../Tables/Table";
import MyResponsiveBar from "../../Charts/barChart";
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

// Import API functions
import { getUsersByIds, fetchStudents } from "../../../../Api/userAPI.js";
import { enrollStudent, getCourseAnalytics } from "../../../../Api/coursePageApi.js";

const CoursePageContent = ({ courseData, userRole = "1100" }) => {
  const [activeSection, setActiveSection] = useState("charts");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // API-related state
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [allStudents, setAllStudents] = useState([]);
  const [loadingAllStudents, setLoadingAllStudents] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loadingCharts, setLoadingCharts] = useState(false);

  // UI state
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);

  const emptyInitialData = useMemo(() => ({}), []);

  // Get course-specific data (keeping your original logic for fallbacks)
  const courseId = courseData?.id;
  const contentConfig = courseId ? getContentConfig(courseId, userRole) : null;
  const courseMaterials = courseId ? getCourseMaterials(courseId) : [];

  // Fetch enrolled students based on selected year
  useEffect(() => {
    const fetchEnrolledStudents = async () => {
      setLoadingStudents(true);
      if (courseData && courseData.enrollments && selectedYear) {
        // Find the enrollment object for the currently selected year
        const yearlyEnrollment = courseData.enrollments.find(
          e => e.academicYear === selectedYear
        );
        // Get the student IDs from that object
        const studentIdsForYear = yearlyEnrollment ? yearlyEnrollment.studentIds : [];

        if (studentIdsForYear.length > 0) {
          try {
            const studentDetails = await getUsersByIds(studentIdsForYear);
            setStudents(studentDetails);
          } catch (error) {
            console.error("Failed to fetch student details for year:", error);
            setStudents([]);
          }
        } else {
          setStudents([]); // No students enrolled for this year
        }
      } else {
        setStudents([]); // No course data or no enrollments array
      }
      setLoadingStudents(false);
    };

    fetchEnrolledStudents();
  }, [courseData, selectedYear]);

  // Fetch analytics based on selected year
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (activeSection === "charts" && courseData?.id && selectedYear) {
        setLoadingCharts(true);
        setAnalyticsData(null);
        try {
          // Pass the selectedYear to the API call
          const data = await getCourseAnalytics(courseData.id, selectedYear);
          setAnalyticsData(data);
        } catch (error) {
          console.error("Error setting analytics data:", error);
        } finally {
          setLoadingCharts(false);
        }
      }
    };

    fetchAnalytics();
  }, [activeSection, courseData?.id, selectedYear]);

  // Fallback data for when API data is not available
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

  const fetchAllStudents = async () => {
    setLoadingAllStudents(true);
    try {
      const allStudentsData = await fetchStudents();
      const enrolledIds = courseData.enrollments?.flatMap(e => e.studentIds) || [];
      const availableStudents = allStudentsData.filter(student => !enrolledIds.includes(student.id));
      setAllStudents(availableStudents);
    } catch (error) {
      console.error("Failed to fetch all students:", error);
      setAllStudents([]);
    } finally {
      setLoadingAllStudents(false);
    }
  };

  const handleShowEnrollmentForm = () => {
    setShowAddStudentForm(true);
    fetchAllStudents();
  };

  const handleEnrollStudent = async (formData) => {
    const { studentId, academicYear, learningGroup, graduationYear, yearGroup, status, enrollmentNotes } = formData;
    if (!studentId || !academicYear || !learningGroup || !graduationYear || !yearGroup || !status) {
      alert("Please fill in all required fields");
      return;
    }
    setEnrolling(true);
    try {
      const enrollmentData = {
        studentId,
        academicYear: parseInt(academicYear.split('-')[0]), // Assuming year is like "2024-25", send "2024"
        learningGroup,
        graduationYear,
        yearGroup,
        status,
        enrollmentNotes: enrollmentNotes || '',
      };
      // Note: This API call needs to trigger a re-fetch of courseData from the parent component
      await enrollStudent(courseData.id, enrollmentData);
      const enrolledStudent = allStudents.find(s => s.id === studentId);
      
      // Optimistically update the UI, but a full data reload is better
      if (parseInt(academicYear.split('-')[0]) === selectedYear) {
        const enrichedStudent = { 
          ...enrolledStudent, 
          academicYear, 
          learningGroup, 
          graduationYear, 
          yearGroup, 
          enrollmentStatus: status, 
          enrollmentNotes, 
          department: courseData.department, 
          enrollmentDate: new Date().toLocaleDateString() 
        };
        setStudents(prev => [...prev, enrichedStudent]);
      }
      
      setShowAddStudentForm(false);
      alert(`Student ${enrolledStudent?.name || 'Unknown'} enrolled successfully!`);
    } catch (error) {
      console.error("Failed to enroll student:", error);
      alert("Failed to enroll student. Please try again.");
    } finally {
      setEnrolling(false);
    }
  };

  const handleCancelAddStudent = () => {
    setShowAddStudentForm(false);
    setAllStudents([]);
  };

  const enrollmentFormFields = useMemo(() => {
    const studentOptions = allStudents.map(student => ({ 
      value: student.id, 
      label: `${student.name} (${student.email}) - ${student.department || 'No Department'}` 
    }));
    return [
      { 
        name: "studentId", 
        label: "Select Student to Enroll", 
        type: "select", 
        placeholder: loadingAllStudents ? "Loading students..." : "Choose a student", 
        required: true, 
        options: studentOptions, 
        disabled: loadingAllStudents 
      },
      { 
        name: "academicYear", 
        label: "Academic Year", 
        type: "select", 
        required: true, 
        options: ["2023-24", "2024-25", "2025-26"], 
        placeholder: "Select academic year" 
      },
      { 
        name: "learningGroup", 
        label: "Learning Group", 
        type: "select", 
        required: true, 
        options: ["group-a", "group-b", "group-c"], 
        placeholder: "Assign to learning group" 
      },
      { 
        name: "graduationYear", 
        label: "Graduation Year", 
        type: "select", 
        required: true, 
        options: ["2024", "2025", "2026", "2027"], 
        placeholder: "Expected graduation year" 
      },
      { 
        name: "yearGroup", 
        label: "Year Group", 
        type: "select", 
        required: true, 
        options: ["First Year", "Second Year", "Third Year", "Fourth Year"], 
        placeholder: "Select year group" 
      },
      { 
        name: "status", 
        label: "Enrollment Status", 
        type: "select", 
        required: true, 
        options: ["Active", "Inactive", "Graduated", "Suspended"], 
        placeholder: "Set enrollment status" 
      },
      { 
        name: "enrollmentNotes", 
        label: "Enrollment Notes (Optional)", 
        type: "textarea", 
        placeholder: "Any additional notes...", 
        required: false, 
        rows: 3 
      }
    ];
  }, [allStudents, loadingAllStudents]);

  // Render the dynamic content based on course and user role (keeping your original design)
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
                    Enrolled Students
                  </div>
                  <div style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    textShadow: "0 1px 2px rgba(0,0,0,0.2)"
                  }}>
                    {students.length}
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
                    Academic Year
                  </div>
                  <div style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    textShadow: "0 1px 2px rgba(0,0,0,0.2)"
                  }}>
                    {selectedYear}
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
                    Average Grade
                  </div>
                  <div style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    textShadow: "0 1px 2px rgba(0,0,0,0.2)"
                  }}>
                    {analyticsData?.averageGrade || "N/A"}
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
                    Submissions
                  </div>
                  <div style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    textShadow: "0 1px 2px rgba(0,0,0,0.2)"
                  }}>
                    {analyticsData?.totalSubmissions || "0"}
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
        if (loadingCharts) {
          return (
            <div style={{ padding: "20px", textAlign: "center" }}>
              Loading chart data for {selectedYear}...
            </div>
          );
        }
        
        if (!analyticsData || analyticsData.totalSubmissions === 0) {
          return (
            <>
              <div className="row">
                {/* Grade Distribution Bar Chart - Fallback */}
                <Box
                  title={`Grade Distribution (${selectedYear}) - Sample Data`}
                  chart={<BarChart data={fallbackGradeData} />}
                  gridRow="span 4"
                  gridColumn="span 6"
                />

                {/* Assignment Progress Line Chart - Fallback */}
                <Box
                  title="Assignment Progress Timeline - Sample Data"
                  chart={<LineChart data={fallbackAssignmentData} />}
                  gridRow="span 4"
                  gridColumn="span 6"
                />
              </div>
              <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
                No analytics data available for this course in {selectedYear}. Showing sample data.
              </div>
            </>
          );
        }

        // Convert API data to chart format
        const nivoBarData = analyticsData.gradeDistribution.labels.map((label, index) => ({
          name: label,
          value: analyticsData.gradeDistribution.data[index],
        }));

        return (
          <>
            <div className="row">
              {/* Real API Data Chart */}
              <Box
                title={`Grade Distribution for ${selectedYear}`}
                chart={
                  <div style={{ height: '350px' }}>
                    <h4 style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
                      Overall Average Grade: {analyticsData.averageGrade}
                    </h4>
                    <MyResponsiveBar data={nivoBarData} />
                  </div>
                }
                gridRow="span 4"
                gridColumn="span 12"
              />
            </div>
          </>
        );

      case "students":
        return (
          <>
            {loadingStudents ? (
              <div style={{ padding: "20px", textAlign: "center" }}>
                Loading enrolled students for {selectedYear}...
              </div>
            ) : (
              <StudentTable
                icon="students"
                title={`Enrolled Students for ${selectedYear}`}
                subtitle={`Manage students enrolled in ${courseData?.name || 'this course'}`}
                addButtonText="Enroll Student"
                data={students}
                showAddButton={true}
                onAddClick={handleShowEnrollmentForm}
              />
            )}
            <Popup isOpen={showAddStudentForm} onClose={handleCancelAddStudent}>
              <DynamicForm
                title={`Enroll Student in ${courseData?.name || 'Course'}`}
                subtitle={`Department: ${courseData?.department || 'Unknown'}`}
                fields={enrollmentFormFields}
                onSubmit={handleEnrollStudent}
                onCancel={handleCancelAddStudent}
                submitText={enrolling ? "Enrolling..." : "Enroll Student"}
                loading={enrolling}
                initialData={emptyInitialData}
              />
            </Popup>
          </>
        );

      case "files":
        return (
          <CourseFilesManager 
            courseId={courseId} 
            userRole={userRole} 
            academicYear={selectedYear} 
          />
        );

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