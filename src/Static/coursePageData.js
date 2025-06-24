// coursePageData.js - Updated with dynamic data structure

import React from "react";
import Box from "../View/Components/Dashboard/Content/Box";
import PieChart from "../View/Components/Charts/pieCharts";
import BarChart from "../View/Components/Charts/barChart";
import CourseDetails from "../View/Components/CoursePage/CourseDetails";

// Course-specific data - each course has its own data
export const courseSpecificData = {
  // Certificate IT - Computer Fundamentals
  101: {
    courseDetails: {
      courseCode: "CERT101",
      courseType: "Lecture",
      courseTitle: "Computer Fundamentals",
      instructor: "Dr. Ahmad Hassan",
      minPassingGrade: "50",
      enrolledStudents: 30,
      classTiming: "Monday 09:00 - 11:00",
      location: "Room 101, IT Building",
      faculty: "Certificate Program",
      language: "English",
      assignments: 4,
      practicalType: "Computer Lab",
      finalExam: "Included",
      prerequisite: "None",
    },
    chartData: {
      attendance: [
        { id: "Attended", label: "Attended", value: 85 },
        { id: "Missed", label: "Missed", value: 15 },
      ],
      progress: [
        { id: "attendant", value: 45 },
        { id: "not attendant", value: 35 },
        { id: "approved", value: 20 },
      ],
      barChartData: [
        {
          Group: "Week 1",
          Attended: 28,
          AttendedColor: "hsl(167, 70%, 50%)",
          Missed: 2,
          MissedColor: "hsl(0, 70%, 50%)",
        },
        {
          Group: "Week 2",
          Attended: 26,
          AttendedColor: "hsl(167, 70%, 50%)",
          Missed: 4,
          MissedColor: "hsl(0, 70%, 50%)",
        },
        {
          Group: "Week 3",
          Attended: 29,
          AttendedColor: "hsl(167, 70%, 50%)",
          Missed: 1,
          MissedColor: "hsl(0, 70%, 50%)",
        },
      ],
    },
    materials: [
      {
        title: "Course Readings",
        files: [
          {
            title: "Introduction to Computers",
            link: "/files/intro-computers.pdf",
          },
          { title: "Hardware Basics", link: "/files/hardware-basics.pdf" },
        ],
      },
      {
        title: "Lecture Files",
        files: [
          {
            title: "Lecture 1 - Computer History",
            link: "/files/lecture1-history.pdf",
          },
          {
            title: "Lecture 2 - Operating Systems",
            link: "/files/lecture2-os.pdf",
          },
        ],
      },
    ],
    announcements: [
      {
        title: "Computer Assembly Lab - March 25, 2025",
        content:
          "Hands-on computer assembly session scheduled. Please bring your lab notebooks.",
      },
      {
        title: "Mid-term Exam - April 5, 2025",
        content:
          "Mid-term examination covers chapters 1-6. Review sessions available on request.",
      },
    ],
  },

  // Business Diploma - Introduction to Business
  201: {
    courseDetails: {
      courseCode: "DIP101",
      courseType: "Lecture",
      courseTitle: "Introduction to Business",
      instructor: "Prof. Sarah Al-Mahmoud",
      minPassingGrade: "55",
      enrolledStudents: 60,
      classTiming: "Tuesday 10:00 - 12:00",
      location: "Room 205, Business Hall",
      faculty: "Business Administration",
      language: "English",
      assignments: 6,
      practicalType: "Case Study Analysis",
      finalExam: "Included",
      prerequisite: "None",
    },
    chartData: {
      attendance: [
        { id: "Attended", label: "Attended", value: 78 },
        { id: "Missed", label: "Missed", value: 22 },
      ],
      progress: [
        { id: "attendant", value: 40 },
        { id: "not attendant", value: 30 },
        { id: "approved", value: 30 },
      ],
      barChartData: [
        {
          Group: "Week 1",
          Attended: 55,
          AttendedColor: "hsl(167, 70%, 50%)",
          Missed: 5,
          MissedColor: "hsl(0, 70%, 50%)",
        },
        {
          Group: "Week 2",
          Attended: 48,
          AttendedColor: "hsl(167, 70%, 50%)",
          Missed: 12,
          MissedColor: "hsl(0, 70%, 50%)",
        },
        {
          Group: "Week 3",
          Attended: 52,
          AttendedColor: "hsl(167, 70%, 50%)",
          Missed: 8,
          MissedColor: "hsl(0, 70%, 50%)",
        },
      ],
    },
    materials: [
      {
        title: "Course Readings",
        files: [
          { title: "Business Environment", link: "/files/business-env.pdf" },
          {
            title: "Types of Business Organizations",
            link: "/files/business-types.pdf",
          },
        ],
      },
      {
        title: "Case Studies",
        files: [
          {
            title: "Case Study 1 - Startup Analysis",
            link: "/files/case1-startup.pdf",
          },
          {
            title: "Case Study 2 - Market Entry",
            link: "/files/case2-market.pdf",
          },
        ],
      },
    ],
    announcements: [
      {
        title: "Business Plan Presentation - April 15, 2025",
        content:
          "Students will present their business plan projects. Each presentation should be 10-15 minutes.",
      },
      {
        title: "Guest Speaker - Entrepreneur Session",
        content:
          "Local entrepreneur will share insights on starting a business. Don't miss this opportunity!",
      },
    ],
  },

  // Information Systems - Programming Fundamentals
  302: {
    courseDetails: {
      courseCode: "CS101",
      courseTitle: "Programming Fundamentals",
      courseType: "Lecture + Lab",
      instructor: "Dr. Omar Khalil",
      minPassingGrade: "60",
      enrolledStudents: 45,
      classTiming: "Wednesday 14:00 - 17:00",
      location: "Room 301, Computer Science Building",
      faculty: "Information Systems",
      language: "English",
      assignments: 8,
      practicalType: "Programming Lab",
      finalExam: "Included + Project",
      prerequisite: "Mathematics for IT",
    },
    chartData: {
      attendance: [
        { id: "Attended", label: "Attended", value: 89 },
        { id: "Missed", label: "Missed", value: 11 },
      ],
      progress: [
        { id: "attendant", value: 55 },
        { id: "not attendant", value: 25 },
        { id: "approved", value: 20 },
      ],
      barChartData: [
        {
          Group: "Week 1",
          Attended: 42,
          AttendedColor: "hsl(167, 70%, 50%)",
          Missed: 3,
          MissedColor: "hsl(0, 70%, 50%)",
        },
        {
          Group: "Week 2",
          Attended: 40,
          AttendedColor: "hsl(167, 70%, 50%)",
          Missed: 5,
          MissedColor: "hsl(0, 70%, 50%)",
        },
        {
          Group: "Week 3",
          Attended: 43,
          AttendedColor: "hsl(167, 70%, 50%)",
          Missed: 2,
          MissedColor: "hsl(0, 70%, 50%)",
        },
        {
          Group: "Week 4",
          Attended: 41,
          AttendedColor: "hsl(167, 70%, 50%)",
          Missed: 4,
          MissedColor: "hsl(0, 70%, 50%)",
        },
      ],
    },
    materials: [
      {
        title: "Course Readings",
        files: [
          {
            title: "Python Programming Basics",
            link: "/files/python-basics.pdf",
          },
          { title: "Algorithm Design", link: "/files/algorithm-design.pdf" },
        ],
      },
      {
        title: "Lab Materials",
        files: [
          {
            title: "Lab 1 - Variables and Data Types",
            link: "/files/lab1-variables.pdf",
          },
          {
            title: "Lab 2 - Control Structures",
            link: "/files/lab2-control.pdf",
          },
          { title: "Programming Examples", link: "/files/code-examples.zip" },
        ],
      },
    ],
    announcements: [
      {
        title: "Programming Contest - April 20, 2025",
        content:
          "Annual programming contest open to all students. Prizes for top 3 winners!",
      },
      {
        title: "Final Project Guidelines Released",
        content:
          "Final project requirements are now available. Projects must be submitted by May 10, 2025.",
      },
    ],
  },

  // Nursing - Fundamentals of Nursing
  401: {
    courseDetails: {
      courseCode: "NUR101",
      courseType: "Lecture + Clinical",
      courseTitle: "Fundamentals of Nursing",
      instructor: "Prof. Dr. Fatima Al-Zahra",
      minPassingGrade: "65",
      enrolledStudents: 65,
      classTiming: "Thursday 08:00 - 12:00",
      location: "Room 401, Nursing Building + Clinical Sites",
      faculty: "Nursing",
      language: "English",
      assignments: 5,
      practicalType: "Clinical Practice",
      finalExam: "Theory + Practical",
      prerequisite: "None",
    },
    chartData: {
      attendance: [
        { id: "Attended", label: "Attended", value: 92 },
        { id: "Missed", label: "Missed", value: 8 },
      ],
      progress: [
        { id: "attendant", value: 60 },
        { id: "not attendant", value: 25 },
        { id: "approved", value: 15 },
      ],
      barChartData: [
        {
          Group: "Week 1",
          Attended: 63,
          AttendedColor: "hsl(167, 70%, 50%)",
          Missed: 2,
          MissedColor: "hsl(0, 70%, 50%)",
        },
        {
          Group: "Week 2",
          Attended: 61,
          AttendedColor: "hsl(167, 70%, 50%)",
          Missed: 4,
          MissedColor: "hsl(0, 70%, 50%)",
        },
        {
          Group: "Week 3",
          Attended: 64,
          AttendedColor: "hsl(167, 70%, 50%)",
          Missed: 1,
          MissedColor: "hsl(0, 70%, 50%)",
        },
      ],
    },
    materials: [
      {
        title: "Course Readings",
        files: [
          {
            title: "Nursing Fundamentals Textbook Ch.1-5",
            link: "/files/nursing-fund-1-5.pdf",
          },
          { title: "Patient Care Guidelines", link: "/files/patient-care.pdf" },
        ],
      },
      {
        title: "Clinical Materials",
        files: [
          {
            title: "Clinical Skills Checklist",
            link: "/files/skills-checklist.pdf",
          },
          {
            title: "Medication Administration Guide",
            link: "/files/medication-guide.pdf",
          },
          {
            title: "Infection Control Protocols",
            link: "/files/infection-control.pdf",
          },
        ],
      },
    ],
    announcements: [
      {
        title: "Clinical Rotation Schedule - Week of March 28, 2025",
        content:
          "Clinical rotations will be at City General Hospital. Please arrive by 7:30 AM in proper uniform.",
      },
      {
        title: "Skills Lab Assessment - April 8, 2025",
        content:
          "Practical skills assessment covering vital signs, patient positioning, and basic care procedures.",
      },
    ],
  },

  // Information Systems - Data Structures & Algorithms
  311: {
    courseDetails: {
      courseCode: "CS201",
      courseType: "Lecture + Lab",
      courseTitle: "Data Structures & Algorithms",
      instructor: "Dr. Rashid Al-Khatib",
      minPassingGrade: "60",
      enrolledStudents: 38,
      classTiming: "Monday 10:00 - 13:00",
      location: "Room 205, Computer Science Building",
      faculty: "Information Systems",
      language: "English",
      assignments: 6,
      practicalType: "Algorithm Implementation Lab",
      finalExam: "Included + Project",
      prerequisite: "Programming Fundamentals",
    },
    chartData: {
      attendance: [
        { id: "Attended", label: "Attended", value: 87 },
        { id: "Missed", label: "Missed", value: 13 },
      ],
      progress: [
        { id: "attendant", value: 50 },
        { id: "not attendant", value: 30 },
        { id: "approved", value: 20 },
      ],
      barChartData: [
        {
          Group: "Week 1",
          Attended: 35,
          AttendedColor: "hsl(167, 70%, 50%)",
          Missed: 3,
          MissedColor: "hsl(0, 70%, 50%)",
        },
        {
          Group: "Week 2",
          Attended: 33,
          AttendedColor: "hsl(167, 70%, 50%)",
          Missed: 5,
          MissedColor: "hsl(0, 70%, 50%)",
        },
        {
          Group: "Week 3",
          Attended: 36,
          AttendedColor: "hsl(167, 70%, 50%)",
          Missed: 2,
          MissedColor: "hsl(0, 70%, 50%)",
        },
      ],
    },
    materials: [
      {
        title: "Course Readings",
        files: [
          {
            title: "Data Structures Fundamentals",
            link: "/files/data-structures.pdf",
          },
          {
            title: "Algorithm Analysis",
            link: "/files/algorithm-analysis.pdf",
          },
        ],
      },
      {
        title: "Lab Materials",
        files: [
          {
            title: "Lab 1 - Arrays and Linked Lists",
            link: "/files/lab1-arrays.pdf",
          },
          {
            title: "Lab 2 - Stacks and Queues",
            link: "/files/lab2-stacks.pdf",
          },
          {
            title: "Algorithm Implementation Examples",
            link: "/files/algo-examples.zip",
          },
        ],
      },
    ],
    announcements: [
      {
        title: "Algorithm Competition - May 1, 2025",
        content:
          "Inter-university algorithm competition. Registration deadline: April 15, 2025.",
      },
      {
        title: "Mid-term Project Submission",
        content:
          "Implement sorting algorithms project due April 12, 2025. Include time complexity analysis.",
      },
    ],
  },
};

// Mock data for course materials
export const mockCourseCategories = [
  {
    id: 1,
    name: "Presentations",
    description: "Lecture slides and presentation materials",
    color: "#3b82f6",
    files: [
      {
        id: 1,
        name: "Week 1 - Introduction.pptx",
        size: "2.5 MB",
        uploadDate: "2024-01-15",
        type: "presentation",
        url: "/files/presentations/week1-introduction.pptx"
      },
      {
        id: 2,
        name: "Week 2 - Fundamentals.pptx",
        size: "3.2 MB",
        uploadDate: "2024-01-22",
        type: "presentation",
        url: "/files/presentations/week2-fundamentals.pptx"
      },
    ],
  },
  {
    id: 2,
    name: "Syllabus",
    description: "Course syllabus and curriculum",
    color: "#10b981",
    files: [
      {
        id: 3,
        name: "Course Syllabus 2024.pdf",
        size: "1.2 MB",
        uploadDate: "2024-01-10",
        type: "document",
        url: "/files/syllabus/course-syllabus-2024.pdf"
      },
    ],
  },
  {
    id: 3,
    name: "Assignments",
    description: "Homework and assignment files",
    color: "#f59e0b",
    files: [
      {
        id: 4,
        name: "Assignment 1 - Research Paper.pdf",
        size: "800 KB",
        uploadDate: "2024-01-20",
        type: "document",
        url: "/files/assignments/assignment1-research-paper.pdf"
      },
      {
        id: 5,
        name: "Assignment Template.docx",
        size: "150 KB",
        uploadDate: "2024-01-18",
        type: "document",
        url: "/files/assignments/assignment-template.docx"
      },
    ],
  },
];






// //Dynamic content configuration based on course ID
// export const getContentConfig = (courseId, userRole = "1100") => {
//   const courseData = courseSpecificData[courseId];

//   if (!courseData) {
//     return null; // Return null if course not found
//   }

//   if (userRole === "1100") {
//     return (
//       <>
//         <div style={{ padding: "20px" }}>
//           <div className="row" style={{ marginTop: "10px" }}>
//             <Box
//               contentBox={
//                 <CourseDetails courseData={courseData.courseDetails} />
//               }
//               gridRow="span 1"
//               gridColumn="span 8"
//             />
//             <Box
//               title="Academic Progress"
//               chart={<PieChart data={courseData.chartData.progress} />}
//               contentBox={
//                 <div className="chart-additional-content">
//                   {/* Main Progress Overview */}
//                   <div className="progress-overview">
//                     <div className="progress-main-stat">
//                       <span className="progress-main-label">
//                         Overall Progress
//                       </span>
//                       <span className="progress-main-value">74%</span>
//                     </div>
//                     <div className="progress-status">
//                       <div className="status-indicator"></div>
//                       <span className="status-text">On Track</span>
//                     </div>
//                   </div>

//                   {/* Course Statistics Grid */}
//                   <div className="course-stats">
//                     <div className="Course-stat-item">
//                       <span className="stat-label">Attendance Rate</span>
//                       <span className="stat-value success">85%</span>
//                     </div>
//                     <div className="Course-stat-item">
//                       <span className="stat-label">Next Assignment</span>
//                       <span className="stat-value primary">3 Days</span>
//                     </div>
//                     <div className="Course-stat-item">
//                       <span className="stat-label">Completed Tasks</span>
//                       <span className="stat-value primary">12/16</span>
//                     </div>
//                     <div className="Course-stat-item">
//                       <span className="stat-label">Current GPA</span>
//                       <span className="stat-value success">3.7</span>
//                     </div>
//                   </div>
//                 </div>
//               }
//               gridRow="span 1"
//               gridColumn="span 4"
//             />
//           </div>
//         </div>
//       </>
//     );
//   }
//   return null;
// };


// // Helper function to get course-specific chart data
// export const getCourseChartData = (courseId, chartType = "attendance") => {
//   const courseData = courseSpecificData[courseId];
//   if (!courseData) return [];

//   switch (chartType) {
//     case "attendance":
//       return courseData.chartData.attendance;
//     case "progress":
//       return courseData.chartData.progress;
//     case "bar":
//       return courseData.chartData.barChartData;
//     default:
//       return [];
//   }
// };

// // Helper function to get course materials
// export const getCourseMaterials = (courseId) => {
//   const courseData = courseSpecificData[courseId];
//   return courseData ? courseData.materials : [];
// };

// // Helper function to get course announcements
// export const getCourseAnnouncements = (courseId) => {
//   const courseData = courseSpecificData[courseId];
//   return courseData ? courseData.announcements : [];
// };

// Dynamic content configuration based on course ID - Returns data only
export const getContentConfig = (courseId, userRole = "1100") => {
  const courseData = courseSpecificData[courseId];
  
  if (!courseData) {
    return null; // Return null if course not found
  }
  
  if (userRole === "1100") {
    return {
      showCourseDetails: true,
      showAcademicProgress: true,
      courseDetails: courseData.courseDetails,
      progressData: courseData.chartData.progress,
      stats: {
        overallProgress: 74,
        progressStatus: "On Track",
        attendanceRate: 85,
        nextAssignmentDays: 3,
        completedTasks: { completed: 12, total: 16 },
        currentGPA: 3.7
      }
    };
  }
  
  return null;
};

export const getCourseChartData = (courseId, chartType) => {
  // Your existing implementation
  const courseData = courseSpecificData[courseId];
  if (!courseData) return [];
  
  switch (chartType) {
    case "attendance":
      return courseData.chartData?.attendance || [];
    case "bar":
      return courseData.chartData?.bar || [];
    default:
      return [];
  }
};

export const getCourseMaterials = (courseId) => {
  // Your existing implementation
  const courseData = courseSpecificData[courseId];
  return courseData?.materials || [];
};

export const getCourseAnnouncements = (courseId) => {
  // Your existing implementation
  const courseData = courseSpecificData[courseId];
  return courseData?.announcements || [];
};