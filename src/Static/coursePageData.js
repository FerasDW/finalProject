// coursePageData.js - Updated with dynamic data structure

import React from "react";
import Box from "../View/Components/Dashboard/Content/Box";
import PieChart from "../View/Components/Charts/pieCharts";
import BarChart from "../View/Components/Charts/barChart";
import CourseDetails from "../View/Components/CoursePage/CourseDetails";

// Course-specific data - each course has its own data
export const courseSpecificData = {
  // Certificate IT - Computer Fundamentals (Year 1, Semester 1)
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
      year: 1,
      semester: 1,
      group: "Certificate IT",
      academicYear: 2015,
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

  // Certificate IT - Microsoft Office Suite (Year 1, Semester 1)
  102: {
    courseDetails: {
      courseCode: "CERT102",
      courseType: "Lecture + Lab",
      courseTitle: "Microsoft Office Suite",
      instructor: "Ms. Layla Mahmoud",
      minPassingGrade: "50",
      enrolledStudents: 30,
      classTiming: "Tuesday 10:00 - 12:00",
      location: "Room 102, IT Building",
      faculty: "Certificate Program",
      language: "English",
      assignments: 5,
      practicalType: "Computer Lab",
      finalExam: "Practical Assessment",
      prerequisite: "Computer Fundamentals",
      year: 1,
      semester: 1,
      group: "Certificate IT",
      academicYear: 2023,
    },
    chartData: {
      attendance: [
        { id: "Attended", label: "Attended", value: 88 },
        { id: "Missed", label: "Missed", value: 12 },
      ],
      progress: [
        { id: "attendant", value: 52 },
        { id: "not attendant", value: 28 },
        { id: "approved", value: 20 },
      ],
      barChartData: [
        {
          Group: "Week 1",
          Attended: 27,
          AttendedColor: "hsl(167, 70%, 50%)",
          Missed: 3,
          MissedColor: "hsl(0, 70%, 50%)",
        },
        {
          Group: "Week 2",
          Attended: 29,
          AttendedColor: "hsl(167, 70%, 50%)",
          Missed: 1,
          MissedColor: "hsl(0, 70%, 50%)",
        },
      ],
    },
    materials: [
      {
        title: "Course Materials",
        files: [
          { title: "Word Processing Basics", link: "/files/word-basics.pdf" },
          { title: "Excel Fundamentals", link: "/files/excel-basics.pdf" },
        ],
      },
    ],
    announcements: [
      {
        title: "Practical Exam - April 10, 2025",
        content: "Hands-on exam covering Word, Excel, and PowerPoint skills.",
      },
    ],
  },

  // Business Diploma - Introduction to Business (Year 1, Semester 1)
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
      year: 1,
      semester: 1,
      group: "Business Diploma",
      academicYear: 2019,
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

  // Information Systems - Programming Fundamentals (Year 1, Semester 1)
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
      year: 1,
      semester: 1,
      group: "Information Systems",
      academicYear: 2023,
    },
    chartData: {
      attendance: [
        { id: "Attended", label: "Attended", value: 89 },
        { id: "Missed", label: "Missed", value: 11 },
      ],
      progress: [
        { id: "attendant", value: 65 },
        { id: "not attendant", value: 20 },
        { id: "approved", value: 15 },
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

  // Nursing - Fundamentals of Nursing (Year 1, Semester 1)
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
      year: 1,
      semester: 1,
      group: "Nursing",
      academicYear: 2019,
    },
    chartData: {
      attendance: [
        { id: "Attended", label: "Attended", value: 92 },
        { id: "Missed", label: "Missed", value: 8 },
      ],
      progress: [
        { id: "attendant", value: 70 },
        { id: "not attendant", value: 20 },
        { id: "approved", value: 10 },
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

  // Information Systems - Data Structures & Algorithms (Year 2, Semester 1)
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
      year: 2,
      semester: 1,
      group: "Information Systems",
      academicYear: 2025,
    },
    chartData: {
      attendance: [
        { id: "Attended", label: "Attended", value: 87 },
        { id: "Missed", label: "Missed", value: 13 },
      ],
      progress: [
        { id: "attendant", value: 58 },
        { id: "not attendant", value: 25 },
        { id: "approved", value: 17 },
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

  // Business Diploma - Marketing Fundamentals (Year 1, Semester 2)
  205: {
    courseDetails: {
      courseCode: "DIP105",
      courseType: "Lecture + Workshop",
      courseTitle: "Marketing Fundamentals",
      instructor: "Dr. Nadia Al-Rashid",
      minPassingGrade: "55",
      enrolledStudents: 55,
      classTiming: "Monday 14:00 - 16:00",
      location: "Room 210, Business Hall",
      faculty: "Business Administration",
      language: "English",
      assignments: 5,
      practicalType: "Marketing Campaign Project",
      finalExam: "Included + Presentation",
      prerequisite: "Introduction to Business",
      year: 1,
      semester: 2,
      group: "Business Diploma",
      academicYear: 2020,
    },
    chartData: {
      attendance: [
        { id: "Attended", label: "Attended", value: 82 },
        { id: "Missed", label: "Missed", value: 18 },
      ],
      progress: [
        { id: "attendant", value: 48 },
        { id: "not attendant", value: 32 },
        { id: "approved", value: 20 },
      ],
      barChartData: [
        {
          Group: "Week 1",
          Attended: 52,
          AttendedColor: "hsl(167, 70%, 50%)",
          Missed: 3,
          MissedColor: "hsl(0, 70%, 50%)",
        },
        {
          Group: "Week 2",
          Attended: 49,
          AttendedColor: "hsl(167, 70%, 50%)",
          Missed: 6,
          MissedColor: "hsl(0, 70%, 50%)",
        },
      ],
    },
    materials: [
      {
        title: "Course Materials",
        files: [
          {
            title: "Marketing Principles",
            link: "/files/marketing-principles.pdf",
          },
          { title: "Consumer Behavior", link: "/files/consumer-behavior.pdf" },
        ],
      },
    ],
    announcements: [
      {
        title: "Marketing Campaign Presentations - May 15, 2025",
        content:
          "Final marketing campaign presentations. Each team has 20 minutes.",
      },
    ],
  },

  // Nursing - Advanced Nursing Care (Year 2, Semester 1)
  411: {
    courseDetails: {
      courseCode: "NUR201",
      courseType: "Lecture + Clinical",
      courseTitle: "Advanced Nursing Care",
      instructor: "Dr. Amina Hassan",
      minPassingGrade: "65",
      enrolledStudents: 58,
      classTiming: "Tuesday 08:00 - 14:00",
      location: "Room 402, Nursing Building + Advanced Clinical Sites",
      faculty: "Nursing",
      language: "English",
      assignments: 6,
      practicalType: "Advanced Clinical Practice",
      finalExam: "Theory + Advanced Practical",
      prerequisite: "Fundamentals of Nursing",
      year: 2,
      semester: 1,
      group: "Nursing",
      academicYear: 2025,
    },
    chartData: {
      attendance: [
        { id: "Attended", label: "Attended", value: 94 },
        { id: "Missed", label: "Missed", value: 6 },
      ],
      progress: [
        { id: "attendant", value: 72 },
        { id: "not attendant", value: 18 },
        { id: "approved", value: 10 },
      ],
      barChartData: [
        {
          Group: "Week 1",
          Attended: 56,
          AttendedColor: "hsl(167, 70%, 50%)",
          Missed: 2,
          MissedColor: "hsl(0, 70%, 50%)",
        },
        {
          Group: "Week 2",
          Attended: 55,
          AttendedColor: "hsl(167, 70%, 50%)",
          Missed: 3,
          MissedColor: "hsl(0, 70%, 50%)",
        },
      ],
    },
    materials: [
      {
        title: "Advanced Materials",
        files: [
          {
            title: "Advanced Nursing Procedures",
            link: "/files/advanced-procedures.pdf",
          },
          {
            title: "Critical Care Guidelines",
            link: "/files/critical-care.pdf",
          },
        ],
      },
    ],
    announcements: [
      {
        title: "Advanced Clinical Rotation - April 1, 2025",
        content:
          "Advanced clinical rotation at University Hospital ICU. Prepare for intensive training.",
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
        url: "/files/presentations/week1-introduction.pptx",
      },
      {
        id: 2,
        name: "Week 2 - Fundamentals.pptx",
        size: "3.2 MB",
        uploadDate: "2024-01-22",
        type: "presentation",
        url: "/files/presentations/week2-fundamentals.pptx",
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
        url: "/files/syllabus/course-syllabus-2024.pdf",
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
        url: "/files/assignments/assignment1-research-paper.pdf",
      },
      {
        id: 5,
        name: "Assignment Template.docx",
        size: "150 KB",
        uploadDate: "2024-01-18",
        type: "document",
        url: "/files/assignments/assignment-template.docx",
      },
    ],
  },
];

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
        overallProgress: Math.floor(Math.random() * 30) + 65, // Random between 65-95
        progressStatus: ["On Track", "Ahead", "Behind", "Excellent"][
          Math.floor(Math.random() * 4)
        ],
        attendanceRate: courseData.chartData.attendance[0].value,
        nextAssignmentDays: Math.floor(Math.random() * 7) + 1, // Random 1-7 days
        completedTasks: {
          completed: Math.floor(Math.random() * 8) + 8, // Random 8-15
          total: Math.floor(Math.random() * 5) + 16, // Random 16-20
        },
        currentGPA: (Math.random() * 1.5 + 2.5).toFixed(1), // Random 2.5-4.0
      },
    };
  }

  return null;
};

export const getCourseChartData = (courseId, chartType, selectedYear = "") => {
  const courseData = courseSpecificData[courseId];
  if (!courseData) return [];
  
  switch (chartType) {
    case "attendance":
      return courseData.chartData?.attendance || [];
    case "bar":
      return courseData.chartData?.barChartData || [];
    case "gradeDistribution":
      return getGradeDistributionData(courseId, selectedYear);
    case "assignmentProgress":
      return getAssignmentProgressData(courseId, selectedYear);
    default:
      return [];
  }
};

export const getCourseMaterials = (courseId) => {
  const courseData = courseSpecificData[courseId];
  return courseData?.materials || [];
};

export const getCourseAnnouncements = (courseId) => {
  const courseData = courseSpecificData[courseId];
  return courseData?.announcements || [];
};

// 📊 Different Grade Distribution Data for Each Course
export const getGradeDistributionData = (courseId, selectedYear = "") => {
  const gradeDataByYear = {
    // Certificate IT - Computer Fundamentals (Course 101)
    101: { 
      "1": [
        { Group: "A (90-100)", "First year": 8, "Second year": 0, "Third year": 0 },
        { Group: "B (80-89)", "First year": 12, "Second year": 0, "Third year": 0 },
        { Group: "C (70-79)", "First year": 7, "Second year": 0, "Third year": 0 },
        { Group: "D (60-69)", "First year": 2, "Second year": 0, "Third year": 0 },
        { Group: "F (<60)", "First year": 1, "Second year": 0, "Third year": 0 }
      ]
    },
    
    // Certificate IT - Microsoft Office Suite (Course 102)
    102: { 
      "1": [
        { Group: "A (90-100)", "First year": 10, "Second year": 0, "Third year": 0 },
        { Group: "B (80-89)", "First year": 11, "Second year": 0, "Third year": 0 },
        { Group: "C (70-79)", "First year": 6, "Second year": 0, "Third year": 0 },
        { Group: "D (60-69)", "First year": 2, "Second year": 0, "Third year": 0 },
        { Group: "F (<60)", "First year": 1, "Second year": 0, "Third year": 0 }
      ]
    },

    // Business Diploma - Introduction to Business (Course 201)
    201: { 
      "1": [
        { Group: "A (90-100)", "First year": 15, "Second year": 0, "Third year": 0 },
        { Group: "B (80-89)", "First year": 25, "Second year": 0, "Third year": 0 },
        { Group: "C (70-79)", "First year": 14, "Second year": 0, "Third year": 0 },
        { Group: "D (60-69)", "First year": 4, "Second year": 0, "Third year": 0 },
        { Group: "F (<60)", "First year": 2, "Second year": 0, "Third year": 0 }
      ],
      "2": [
        { Group: "A (90-100)", "First year": 0, "Second year": 12, "Third year": 0 },
        { Group: "B (80-89)", "First year": 0, "Second year": 20, "Third year": 0 },
        { Group: "C (70-79)", "First year": 0, "Second year": 15, "Third year": 0 },
        { Group: "D (60-69)", "First year": 0, "Second year": 3, "Third year": 0 },
        { Group: "F (<60)", "First year": 0, "Second year": 1, "Third year": 0 }
      ]
    },

    // Information Systems - Programming Fundamentals (Course 302)
    302: { 
      "1": [
        { Group: "A (90-100)", "First year": 12, "Second year": 0, "Third year": 0 },
        { Group: "B (80-89)", "First year": 18, "Second year": 0, "Third year": 0 },
        { Group: "C (70-79)", "First year": 11, "Second year": 0, "Third year": 0 },
        { Group: "D (60-69)", "First year": 3, "Second year": 0, "Third year": 0 },
        { Group: "F (<60)", "First year": 1, "Second year": 0, "Third year": 0 }
      ],
      "2": [
        { Group: "A (90-100)", "First year": 0, "Second year": 10, "Third year": 0 },
        { Group: "B (80-89)", "First year": 0, "Second year": 16, "Third year": 0 },
        { Group: "C (70-79)", "First year": 0, "Second year": 13, "Third year": 0 },
        { Group: "D (60-69)", "First year": 0, "Second year": 4, "Third year": 0 },
        { Group: "F (<60)", "First year": 0, "Second year": 2, "Third year": 0 }
      ],
      "3": [
        { Group: "A (90-100)", "First year": 0, "Second year": 0, "Third year": 8 },
        { Group: "B (80-89)", "First year": 0, "Second year": 0, "Third year": 14 },
        { Group: "C (70-79)", "First year": 0, "Second year": 0, "Third year": 12 },
        { Group: "D (60-69)", "First year": 0, "Second year": 0, "Third year": 5 },
        { Group: "F (<60)", "First year": 0, "Second year": 0, "Third year": 1 }
      ]
    },

    // Nursing - Fundamentals of Nursing (Course 401)
    401: { 
      "1": [
        { Group: "A (90-100)", "First year": 20, "Second year": 0, "Third year": 0 },
        { Group: "B (80-89)", "First year": 28, "Second year": 0, "Third year": 0 },
        { Group: "C (70-79)", "First year": 12, "Second year": 0, "Third year": 0 },
        { Group: "D (60-69)", "First year": 4, "Second year": 0, "Third year": 0 },
        { Group: "F (<60)", "First year": 1, "Second year": 0, "Third year": 0 }
      ],
      "2": [
        { Group: "A (90-100)", "First year": 0, "Second year": 18, "Third year": 0 },
        { Group: "B (80-89)", "First year": 0, "Second year": 24, "Third year": 0 },
        { Group: "C (70-79)", "First year": 0, "Second year": 12, "Third year": 0 },
        { Group: "D (60-69)", "First year": 0, "Second year": 3, "Third year": 0 },
        { Group: "F (<60)", "First year": 0, "Second year": 1, "Third year": 0 }
      ],
      "3": [
        { Group: "A (90-100)", "First year": 0, "Second year": 0, "Third year": 16 },
        { Group: "B (80-89)", "First year": 0, "Second year": 0, "Third year": 22 },
        { Group: "C (70-79)", "First year": 0, "Second year": 0, "Third year": 10 },
        { Group: "D (60-69)", "First year": 0, "Second year": 0, "Third year": 3 },
        { Group: "F (<60)", "First year": 0, "Second year": 0, "Third year": 1 }
      ],
      "4": [
        { Group: "A (90-100)", "First year": 0, "Second year": 0, "Third year": 14 },
        { Group: "B (80-89)", "First year": 0, "Second year": 0, "Third year": 20 },
        { Group: "C (70-79)", "First year": 0, "Second year": 0, "Third year": 8 },
        { Group: "D (60-69)", "First year": 0, "Second year": 0, "Third year": 2 },
        { Group: "F (<60)", "First year": 0, "Second year": 0, "Third year": 1 }
      ]
    },

    // Information Systems - Data Structures & Algorithms (Course 311)
    311: { 
      "1": [
        { Group: "A (90-100)", "First year": 9, "Second year": 0, "Third year": 0 },
        { Group: "B (80-89)", "First year": 15, "Second year": 0, "Third year": 0 },
        { Group: "C (70-79)", "First year": 10, "Second year": 0, "Third year": 0 },
        { Group: "D (60-69)", "First year": 3, "Second year": 0, "Third year": 0 },
        { Group: "F (<60)", "First year": 1, "Second year": 0, "Third year": 0 }
      ],
      "2": [
        { Group: "A (90-100)", "First year": 0, "Second year": 11, "Third year": 0 },
        { Group: "B (80-89)", "First year": 0, "Second year": 17, "Third year": 0 },
        { Group: "C (70-79)", "First year": 0, "Second year": 8, "Third year": 0 },
        { Group: "D (60-69)", "First year": 0, "Second year": 2, "Third year": 0 },
        { Group: "F (<60)", "First year": 0, "Second year": 0, "Third year": 0 }
      ]
    },

    // Business Diploma - Marketing Fundamentals (Course 205)
    205: { 
      "1": [
        { Group: "A (90-100)", "First year": 13, "Second year": 0, "Third year": 0 },
        { Group: "B (80-89)", "First year": 22, "Second year": 0, "Third year": 0 },
        { Group: "C (70-79)", "First year": 15, "Second year": 0, "Third year": 0 },
        { Group: "D (60-69)", "First year": 4, "Second year": 0, "Third year": 0 },
        { Group: "F (<60)", "First year": 1, "Second year": 0, "Third year": 0 }
      ],
      "2": [
        { Group: "A (90-100)", "First year": 0, "Second year": 16, "Third year": 0 },
        { Group: "B (80-89)", "First year": 0, "Second year": 24, "Third year": 0 },
        { Group: "C (70-79)", "First year": 0, "Second year": 12, "Third year": 0 },
        { Group: "D (60-69)", "First year": 0, "Second year": 2, "Third year": 0 },
        { Group: "F (<60)", "First year": 0, "Second year": 1, "Third year": 0 }
      ]
    },

    // Nursing - Advanced Nursing Care (Course 411)
    411: { 
      "1": [
        { Group: "A (90-100)", "First year": 18, "Second year": 0, "Third year": 0 },
        { Group: "B (80-89)", "First year": 24, "Second year": 0, "Third year": 0 },
        { Group: "C (70-79)", "First year": 12, "Second year": 0, "Third year": 0 },
        { Group: "D (60-69)", "First year": 3, "Second year": 0, "Third year": 0 },
        { Group: "F (<60)", "First year": 1, "Second year": 0, "Third year": 0 }
      ],
      "2": [
        { Group: "A (90-100)", "First year": 0, "Second year": 20, "Third year": 0 },
        { Group: "B (80-89)", "First year": 0, "Second year": 26, "Third year": 0 },
        { Group: "C (70-79)", "First year": 0, "Second year": 10, "Third year": 0 },
        { Group: "D (60-69)", "First year": 0, "Second year": 2, "Third year": 0 },
        { Group: "F (<60)", "First year": 0, "Second year": 0, "Third year": 0 }
      ]
    }
  };

  const courseData = gradeDataByYear[courseId];
  if (!courseData) {
    // Default fallback for any course without specific data
    return [
      { Group: "A (90-100)", "First year": 8, "Second year": 0, "Third year": 0 },
      { Group: "B (80-89)", "First year": 15, "Second year": 0, "Third year": 0 },
      { Group: "C (70-79)", "First year": 10, "Second year": 0, "Third year": 0 },
      { Group: "D (60-69)", "First year": 3, "Second year": 0, "Third year": 0 },
      { Group: "F (<60)", "First year": 1, "Second year": 0, "Third year": 0 }
    ];
  }
  
  // If no year selected, return year 1 data by default
  const yearToUse = (!selectedYear || selectedYear === "") ? "1" : selectedYear.toString();
  return courseData[yearToUse] || courseData["1"] || [];
};

// 📈 Different Assignment Progress Data for Each Course
export const getAssignmentProgressData = (courseId, selectedYear = "") => {
  const assignmentDataByYear = {
    // Certificate IT - Computer Fundamentals (Course 101)
    101: { 
      "1": [
        {
          id: "Completed",
          color: "hsl(167, 70%, 50%)",
          data: [
            { x: "Assignment 1", y: 28 },
            { x: "Assignment 2", y: 26 },
            { x: "Assignment 3", y: 29 },
            { x: "Assignment 4", y: 30 }
          ]
        },
        {
          id: "On Time",
          color: "hsl(210, 70%, 50%)",
          data: [
            { x: "Assignment 1", y: 25 },
            { x: "Assignment 2", y: 24 },
            { x: "Assignment 3", y: 27 },
            { x: "Assignment 4", y: 28 }
          ]
        }
      ]
    },

    // Certificate IT - Microsoft Office Suite (Course 102)
    102: { 
      "1": [
        {
          id: "Completed",
          color: "hsl(167, 70%, 50%)",
          data: [
            { x: "Word Basics", y: 29 },
            { x: "Excel Project", y: 28 },
            { x: "PowerPoint", y: 30 },
            { x: "Integration Task", y: 29 },
            { x: "Final Practical", y: 30 }
          ]
        },
        {
          id: "On Time",
          color: "hsl(210, 70%, 50%)",
          data: [
            { x: "Word Basics", y: 27 },
            { x: "Excel Project", y: 26 },
            { x: "PowerPoint", y: 28 },
            { x: "Integration Task", y: 27 },
            { x: "Final Practical", y: 29 }
          ]
        }
      ]
    },

    // Business Diploma - Introduction to Business (Course 201)
    201: { 
      "1": [
        {
          id: "Completed",
          color: "hsl(167, 70%, 50%)",
          data: [
            { x: "Business Plan", y: 58 },
            { x: "Market Research", y: 55 },
            { x: "Case Study 1", y: 57 },
            { x: "Case Study 2", y: 59 },
            { x: "Group Project", y: 56 },
            { x: "Final Report", y: 60 }
          ]
        },
        {
          id: "On Time",
          color: "hsl(210, 70%, 50%)",
          data: [
            { x: "Business Plan", y: 52 },
            { x: "Market Research", y: 48 },
            { x: "Case Study 1", y: 54 },
            { x: "Case Study 2", y: 56 },
            { x: "Group Project", y: 53 },
            { x: "Final Report", y: 58 }
          ]
        }
      ],
      "2": [
        {
          id: "Completed",
          color: "hsl(167, 70%, 50%)",
          data: [
            { x: "Strategic Analysis", y: 48 },
            { x: "Financial Project", y: 46 },
            { x: "Leadership Case", y: 49 },
            { x: "Internship Report", y: 50 },
            { x: "Capstone", y: 47 }
          ]
        },
        {
          id: "On Time",
          color: "hsl(210, 70%, 50%)",
          data: [
            { x: "Strategic Analysis", y: 44 },
            { x: "Financial Project", y: 42 },
            { x: "Leadership Case", y: 46 },
            { x: "Internship Report", y: 48 },
            { x: "Capstone", y: 45 }
          ]
        }
      ]
    },

    // Information Systems - Programming Fundamentals (Course 302)
    302: { 
      "1": [
        {
          id: "Completed",
          color: "hsl(167, 70%, 50%)",
          data: [
            { x: "Python Basics", y: 43 },
            { x: "Control Structures", y: 41 },
            { x: "Functions", y: 44 },
            { x: "OOP Concepts", y: 42 },
            { x: "Data Structures", y: 45 },
            { x: "File Handling", y: 44 },
            { x: "Web Scraping", y: 43 },
            { x: "Final Project", y: 45 }
          ]
        },
        {
          id: "On Time",
          color: "hsl(210, 70%, 50%)",
          data: [
            { x: "Python Basics", y: 38 },
            { x: "Control Structures", y: 36 },
            { x: "Functions", y: 41 },
            { x: "OOP Concepts", y: 39 },
            { x: "Data Structures", y: 42 },
            { x: "File Handling", y: 41 },
            { x: "Web Scraping", y: 40 },
            { x: "Final Project", y: 43 }
          ]
        }
      ]
    },

    // Nursing - Fundamentals of Nursing (Course 401)
    401: { 
      "1": [
        {
          id: "Completed",
          color: "hsl(167, 70%, 50%)",
          data: [
            { x: "Patient Assessment", y: 64 },
            { x: "Vital Signs", y: 62 },
            { x: "Medication Admin", y: 63 },
            { x: "Care Planning", y: 65 },
            { x: "Clinical Skills", y: 64 }
          ]
        },
        {
          id: "On Time",
          color: "hsl(210, 70%, 50%)",
          data: [
            { x: "Patient Assessment", y: 60 },
            { x: "Vital Signs", y: 58 },
            { x: "Medication Admin", y: 61 },
            { x: "Care Planning", y: 63 },
            { x: "Clinical Skills", y: 62 }
          ]
        }
      ]
    },

    // Information Systems - Data Structures & Algorithms (Course 311)
    311: { 
      "2": [
        {
          id: "Completed",
          color: "hsl(167, 70%, 50%)",
          data: [
            { x: "Arrays & Lists", y: 36 },
            { x: "Stacks & Queues", y: 35 },
            { x: "Trees", y: 37 },
            { x: "Graphs", y: 36 },
            { x: "Sorting Algorithms", y: 38 },
            { x: "Final Algorithm", y: 37 }
          ]
        },
        {
          id: "On Time",
          color: "hsl(210, 70%, 50%)",
          data: [
            { x: "Arrays & Lists", y: 32 },
            { x: "Stacks & Queues", y: 30 },
            { x: "Trees", y: 34 },
            { x: "Graphs", y: 33 },
            { x: "Sorting Algorithms", y: 35 },
            { x: "Final Algorithm", y: 34 }
          ]
        }
      ]
    },

    // Business Diploma - Marketing Fundamentals (Course 205)
    205: { 
      "1": [
        {
          id: "Completed",
          color: "hsl(167, 70%, 50%)",
          data: [
            { x: "Market Analysis", y: 53 },
            { x: "Consumer Survey", y: 52 },
            { x: "Brand Strategy", y: 54 },
            { x: "Campaign Design", y: 55 },
            { x: "Presentation", y: 54 }
          ]
        },
        {
          id: "On Time",
          color: "hsl(210, 70%, 50%)",
          data: [
            { x: "Market Analysis", y: 48 },
            { x: "Consumer Survey", y: 46 },
            { x: "Brand Strategy", y: 51 },
            { x: "Campaign Design", y: 52 },
            { x: "Presentation", y: 50 }
          ]
        }
      ]
    },

    // Nursing - Advanced Nursing Care (Course 411)
    411: { 
      "2": [
        {
          id: "Completed",
          color: "hsl(167, 70%, 50%)",
          data: [
            { x: "Advanced Assessment", y: 56 },
            { x: "Critical Care", y: 55 },
            { x: "Emergency Response", y: 57 },
            { x: "Patient Education", y: 58 },
            { x: "Clinical Research", y: 57 },
            { x: "Case Presentation", y: 58 }
          ]
        },
        {
          id: "On Time",
          color: "hsl(210, 70%, 50%)",
          data: [
            { x: "Advanced Assessment", y: 52 },
            { x: "Critical Care", y: 51 },
            { x: "Emergency Response", y: 54 },
            { x: "Patient Education", y: 55 },
            { x: "Clinical Research", y: 53 },
            { x: "Case Presentation", y: 56 }
          ]
        }
      ]
    }
  };

  const courseData = assignmentDataByYear[courseId];
  if (!courseData) {
    // Default fallback for any course without specific data
    return [
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
  }
  
  // If no year selected, return year 1 data by default
  const yearToUse = (!selectedYear || selectedYear === "") ? "1" : selectedYear.toString();
  return courseData[yearToUse] || courseData["1"] || [];
};