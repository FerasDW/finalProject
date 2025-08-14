import React, { useState, useEffect, useMemo } from "react";
import MidPageNavbar from "./MidPageNavBar";
import Box from "../../Dashboard/Content/Box";
import CourseDetails from "../CourseDetails";
import PieChart from "../../Charts/pieCharts";
import BarChart from "../../Charts/barChart";
import LineChart from "../../Charts/lineChart";
import StudentTable from "../../Tables/Table";
import MyResponsiveBar from "../../Charts/barChart";
import CourseFilesManager from "./CourseFilesManager.jsx";
import DynamicForm from "../../Forms/dynamicForm.jsx";
import Popup from "../../Cards/PopUp.jsx";
import { Users, Calendar, CheckSquare, Award } from "lucide-react";

import { getAcademicYearOptionsForDepartment } from "../../../../Utils/courseUtils.js";

import { getUsersByIds, fetchStudents } from "../../../../Api/userAPI.js";
import { enrollStudent, getCourseAnalytics, getAssignmentTimeline, unenrollStudents } from "../../../../Api/coursePageApi.js";
import { parse } from "url";

const CoursePageContent = ({ courseData, userRole, departments = [], onStudentEnrolled }) => {
  console.log("courseData:", courseData);
  const isAdmin = userRole === "1100";
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
  const [timelineData, setTimelineData] = useState(null);

  // UI state
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);

  const emptyInitialData = useMemo(() => ({}), []);

  const studentTableHiddenColumns = [
    'id',
    '_id',
    'username',
    'password',
    'imageUrl',
    'profilePic',
    'coverPic',
    'website',
    'socialLinks',
    'role',
    'bio',
    'location',
    'linkedin',
    'github',
    'createdAt',
    'updatedAt',
    '_class'
  ];

  // Fetch enrolled students based on selected year
  useEffect(() => {
    const fetchEnrolledStudents = async () => {
      setLoadingStudents(true);
      if (courseData && courseData.enrollments && selectedYear) {
        const yearlyEnrollment = courseData.enrollments.find(e => e.academicYear === selectedYear);
        const studentIdsForYear = yearlyEnrollment ? yearlyEnrollment.studentIds : [];
        if (studentIdsForYear.length > 0) {
          try {
            const studentDetails = await getUsersByIds(studentIdsForYear);
            setStudents(studentDetails);
          } catch (error) {
            console.error("Failed to fetch student details for year:", error); setStudents([]);
          }
        } else {
          setStudents([]);
        }
      } else {
        setStudents([]);
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
        setTimelineData(null);
        try {
          // Fetch both sets of data in parallel
          const [analytics, timeline] = await Promise.all([
            getCourseAnalytics(courseData.id, selectedYear),
            getAssignmentTimeline(courseData.id, selectedYear)
          ]);
          setAnalyticsData(analytics);
          setTimelineData(timeline);
        } catch (error) {
          console.error("Error setting analytics data:", error);
        } finally {
          setLoadingCharts(false);
        }
      }
    };
    fetchAnalytics();
  }, [activeSection, courseData?.id, selectedYear]);

  // Fallback data for charts
  const fallbackGradeData = [{ name: "Sample A", value: 5 }, { name: "Sample B", value: 10 }];
  const fallbackAssignmentData = [{ id: "Sample", data: [{ x: "Sample 1", y: 10 }] }];

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
    const { studentId, academicYear, learningGroup, status, enrollmentNotes } = formData;
    
    if (!studentId || !academicYear || !learningGroup || !status) {
      alert("Please fill in all required fields");
      return;
    }

    setEnrolling(true);
    try {
      const enrollmentData = {
        studentId,
        academicYear: parseInt(academicYear), 
        learningGroup, 
        status, 
        enrollmentNotes: enrollmentNotes || '', 
        // We can optionally still send the student's year of study if your backend needs it
        // studentYearOfStudy: parseInt(academicYear) 
      };

      await enrollStudent(courseData.id, enrollmentData);
      
      alert(`Student enrolled successfully!`);
      setShowAddStudentForm(false);
      
      if (onStudentEnrolled) {
        onStudentEnrolled(); 
      }
      
    } catch (error) {
      console.error("Failed to enroll student:", error);
      alert("Failed to enroll student. Please try again.");
    } finally {
      setEnrolling(false);
    }
  };

// In your CoursePageContent.jsx, update the handleDeleteStudents function:

const handleDeleteStudents = async (selectedStudentObjects) => {
  if (!selectedStudentObjects || selectedStudentObjects.length === 0) {
    alert("Please select students to unenroll.");
    return;
  }

  // Extract just the IDs from the selected student objects
  const selectedStudentIds = selectedStudentObjects.map(student => {
    // Handle both cases: if it's already an ID string, or if it's an object with an 'id' property
    if (typeof student === 'string') {
      return student;
    } else if (student && student.id) {
      return student.id;
    } else {
      return null;
    }
  }).filter(id => id !== null); // Remove any null values

  if (selectedStudentIds.length === 0) {
    alert("No valid student IDs found.");
    return;
  }

  const confirmDelete = window.confirm(
    `Are you sure you want to unenroll ${selectedStudentIds.length} student(s)? This cannot be undone.`
  );

  if (confirmDelete) {
    try {
      await unenrollStudents(courseData.id, selectedStudentIds);
      alert("Student(s) unenrolled successfully!");
      // Call the refetch function to update the list
      if (onStudentEnrolled) {
        onStudentEnrolled();
      }
    } catch (error) {
      alert("Failed to unenroll students. Please try again.");
    }
  }
};

const handleCancelAddStudent = () => { setShowAddStudentForm(false); setAllStudents([]); };
console.log("Academic Year Options:", getAcademicYearOptionsForDepartment(courseData?.department, departments));
const enrollmentFormFields = useMemo(() => {
    const studentOptions = allStudents.map(student => ({
      value: student.id,
      label: `${student.name} (${student.email}) - ${student.department || 'No Department'}`
    }));

    let academicYearOptions = [];
    const currentDepartment = departments.find(d => d.name === courseData?.department);

    if (currentDepartment && currentDepartment.totalAcademicYears) {
      academicYearOptions = Array.from(
        { length: currentDepartment.totalAcademicYears },
        (_, i) => ({ value: `${i + 1}`, label: `Year ${i + 1}` })
      );
    }
    
    // ✅ Generate academic year options using utility
    const yearOptions = getAcademicYearOptionsForDepartment(courseData?.department, departments).map(year => ({
      value: year,
      label: `Year ${year}`
    }));

    return [
      { name: "studentId", label: "Select Student to Enroll", type: "select", placeholder: loadingAllStudents ? "Loading students..." : "Choose a student", required: true, options: studentOptions, disabled: loadingAllStudents },
      {
        name: "department",
        label: "Department (Debug)",
        type: "text",
        disabled: true,
        value: courseData?.department || "No Department"
      },
      {
        name: "academicYear",
        label: "Academic Year",
        type: "select",
        required: true,
        options: getAcademicYearOptionsForDepartment(courseData?.department, departments).map(year => ({
          value: year,
          label: `Year ${year}`
        })),
        placeholder: "Select academic year"
      },
      { name: "learningGroup", label: "Learning Group", type: "select", required: true, options: ["Group A", "Group B", "Group C"], placeholder: "Assign to learning group" },
      { name: "status", label: "Enrollment Status", type: "select", required: true, options: ["Active", "Inactive", "Graduated", "Suspended"], placeholder: "Set enrollment status" },
      { name: "enrollmentNotes", label: "Enrollment Notes (Optional)", type: "textarea", placeholder: "Any additional notes...", required: false, rows: 3 }
    ];
  }, [allStudents, loadingAllStudents, courseData.department, departments]);

  const getTotalStudentCount = () => {
    if (!courseData || !courseData.enrollments) return 0;
    return courseData.enrollments.reduce((total, enrollment) => total + (enrollment.studentIds?.length || 0), 0);
  };

  const renderDynamicContent = () => {
    // ... (This function now uses real data for the stat cards)
    return (
      <div style={{ padding: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px", height: "450px", marginTop: "10px" }}>
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)", overflow: "hidden", height: "100%" }}>
            <CourseDetails courseData={courseData} totalStudents={getTotalStudentCount()} />
          </div>
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)", overflow: "hidden", height: "100%", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", flex: "1" }}>
              <div style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", borderRadius: "12px", padding: "16px", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: "white" }}>
                  <Users size={24} style={{ marginBottom: "8px" }} />
                  <div style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", marginBottom: "4px" }}>Enrolled This Year</div>
                  <div style={{ fontSize: "20px", fontWeight: "700" }}>{students.length}</div>
              </div>
              <div style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", borderRadius: "12px", padding: "16px", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: "white" }}>
                  <Calendar size={24} style={{ marginBottom: "8px" }} />
                  <div style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", marginBottom: "4px" }}>Academic Year</div>
                  <div style={{ fontSize: "20px", fontWeight: "700" }}>{selectedYear}</div>
              </div>
              <div style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)", borderRadius: "12px", padding: "16px", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: "white" }}>
                  <CheckSquare size={24} style={{ marginBottom: "8px" }} />
                  <div style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", marginBottom: "4px" }}>Average Grade</div>
                  <div style={{ fontSize: "20px", fontWeight: "700" }}>{analyticsData?.averageGrade || "N/A"}</div>
              </div>
              <div style={{ background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)", borderRadius: "12px", padding: "16px", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: "white" }}>
                  <Award size={24} style={{ marginBottom: "8px" }} />
                  <div style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", marginBottom: "4px" }}>Submissions</div>
                  <div style={{ fontSize: "20px", fontWeight: "700" }}>{analyticsData?.totalSubmissions || "0"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- FIX: This function is completely refactored to handle real and fallback data gracefully ---
  const renderSection = () => {
    switch (activeSection) {
      case "charts":
        if (loadingCharts) return <div style={{ padding: "20px", textAlign: "center" }}>Loading chart data for {selectedYear}...</div>;
        
        const hasRealGradeData = analyticsData && analyticsData.totalSubmissions > 0;
        const gradeChartData = hasRealGradeData
          ? analyticsData.gradeDistribution.labels.map((label, index) => ({ name: label, value: analyticsData.gradeDistribution.data[index] }))
          : fallbackGradeData;
        
        // --- FIX: The data formatting logic now lives here ---
        const hasRealTimelineData = timelineData && timelineData.some(d => d.value > 0);
        let timelineChartData;

        if (hasRealTimelineData) {
          // If we have real data, transform it into the format Nivo expects.
          // Your real timelineData is simple: [{ name: '...', value: ... }]
          timelineChartData = [{
              id: 'timeline',
              data: timelineData.map(item => ({ x: item.name, y: item.value }))
          }];
        } else {
          // Otherwise, use the fallback data, which is already in the correct format.
          timelineChartData = fallbackAssignmentData;
        }

        return (
          <>
            <div className="row">
              <Box title={`Grade Distribution (${selectedYear})${hasRealGradeData ? '' : ' - Sample Data'}`} chart={<BarChart data={gradeChartData} />} gridRow="span 4" gridColumn="span 6" />
              <Box title={`Assignment Progress (${selectedYear})${hasRealTimelineData ? '' : ' - Sample Data'}`} chart={<LineChart data={timelineChartData} />} gridRow="span 4" gridColumn="span 6" />
            </div>
          </>
        );

      case "students":
        return (
          <>
            {loadingStudents ? (<div style={{ padding: "20px", textAlign: "center" }}>Loading enrolled students for {selectedYear}...</div>) : (
              <StudentTable 
                icon="students" 
                title={`Enrolled Students for ${selectedYear}`} 
                subtitle={`Manage students enrolled in ${courseData?.name || 'this course'}`} 
                addButtonText="Enroll Student" 
                data={students} 
                showAddButton={isAdmin} 
                onAddClick={handleShowEnrollmentForm} 
                hiddenColumns={studentTableHiddenColumns} 
                isSelectable={isAdmin}
                onDelete={handleDeleteStudents}
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
                initialData={{ 
                  department: courseData?.department,
                  academicYear: "",
                }} 
              />
            </Popup>
          </>
        );

      case "files":
        return <CourseFilesManager courseId={courseData?.id} userRole={userRole} academicYear={selectedYear} />;

      default:
        return null;
    }
  };

  if (!courseData) return <div style={{ padding: "20px", textAlign: "center" }}><h2>Course Data Not Available</h2></div>;

  return (
    <>
      {renderDynamicContent()}
      <div className="navbar" style={{ display: "flex", width: "95%", justifyContent: "center", marginTop: "30px" }}>
        <MidPageNavbar activeSection={activeSection} setActiveSection={setActiveSection} selectedYear={selectedYear} setSelectedYear={setSelectedYear} sections={["charts", "students", "files"]} isYearSelectorDisabled={!isAdmin} />
      </div>
      <div className="dynamic-section" style={{ padding: "20px" }}>
        {renderSection()}
      </div>
    </>
  );
};

export default CoursePageContent;