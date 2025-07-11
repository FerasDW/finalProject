import coursesImg from "../Assets/Images/Logo/PNG/courses.png";
import gradeImg from "../Assets/Images/Logo/PNG/grade.png";
import notificationImg from "../Assets/Images/Logo/PNG/notification.png";
import logoImg from "../Assets/Images/Logo/PNG/LogoMonogram.png";
import statImg from "../Assets/Images/Logo/PNG/statistic.png";

export const upcomingAssignments = [
  {
      id: 1,
      title: 'Calculus Integration Project',
      description: 'Complete advanced integration techniques including substitution, integration by parts, and partial fractions.',
      course: 'math',
      type: 'assignment',
      dueDate: '2025-06-25',
      dueTime: '23:59',
      progress: 75,
      status: 'in-progress',
      priority: 'high',
      instructor: 'Dr. Sarah Chen',
      difficulty: 'Advanced',
      credits: 4,
      semester: 'Fall 2024'
    },{
    id: 19,
      title: 'feras',
      description: 'Complete advanced integration techniques including substitution, integration by parts, and partial fractions.',
      course: 'art',
      type: 'test',
      dueDate: '2025-06-25',
      dueTime: '23:59',
      progress: 75,
      status: 'in-progress',
      priority: 'high',
      instructor: 'other',
      difficulty: 'Advanced',
      credits: 4,
      semester: 'Fall 2024'
    },
  { id: 7, title: "1", date: "2025-03-15" },
  { id: 2, title: "2", date: "2025-03-12" },
  { id: 3, title: "3", date: "2025-03-10" },
  { id: 4, title: "4", date: "2025-03-15" },
  { id: 5, title: "5", date: "2025-03-12" },
  { id: 6, title: "6", date: "2025-03-10" },
  { id: 8, title: "7", date: "2025-03-15" },
  { id: 13, title: "8", date: "2025-03-12" },
  { id: 9, title: "9", date: "2025-03-10" },
  { id: 10, title: "10", date: "2025-03-15" },
  { id: 11, title: "11", date: "2025-03-12" },
  { id: 12, title: "12", date: "2025-03-10" },
];

export const sampleData = [
  {
    Group: "Information Systems",
    "First year": 170,
    "First yearColor": "hsl(167, 70%, 50%)",
    "Second year": 67,
    "Second yearColor": "hsl(153, 70%, 50%)",
    "Third year": 152,
    "Third yearColor": "hsl(106, 70%, 50%)",
    kebab: 135,
    kebabColor: "hsl(166, 70%, 50%)",
    fries: 21,
    friesColor: "hsl(191, 70%, 50%)",
    donut: 37,
    donutColor: "hsl(262, 70%, 50%)",
  },
  {
    Group: "Nursing",
    "First year": 168,
    "First yearColor": "hsl(4, 70%, 50%)",
    "Second year": 100,
    "Second yearColor": "hsl(175, 70%, 50%)",
    "Third year": 47,
    "Third yearColor": "hsl(271, 70%, 50%)",
    kebab: 91,
    kebabColor: "hsl(326, 70%, 50%)",
    fries: 35,
    friesColor: "hsl(134, 70%, 50%)",
    donut: 154,
    donutColor: "hsl(190, 70%, 50%)",
  },
  {
    Group: "Economy & Management",
    "First year": 55,
    "First yearColor": "hsl(109, 70%, 50%)",
    "Second year": 53,
    "Second yearColor": "hsl(218, 70%, 50%)",
    "Third year": 186,
    "Third yearColor": "hsl(43, 70%, 50%)",
    kebab: 52,
    kebabColor: "hsl(286, 70%, 50%)",
    fries: 127,
    friesColor: "hsl(357, 70%, 50%)",
    donut: 39,
    donutColor: "hsl(292, 70%, 50%)",
  },
  {
    Group: "Health Sciences",
    "First year": 164,
    "First yearColor": "hsl(34, 70%, 50%)",
    "Second year": 46,
    "Second yearColor": "hsl(171, 70%, 50%)",
    "Third year": 27,
    "Third yearColor": "hsl(33, 70%, 50%)",
    kebab: 60,
    kebabColor: "hsl(331, 70%, 50%)",
    fries: 182,
    friesColor: "hsl(188, 70%, 50%)",
    donut: 194,
    donutColor: "hsl(238, 70%, 50%)",
  },
  {
    Group: "Psychology",
    "First year": 62,
    "First yearColor": "hsl(253, 70%, 50%)",
    "Second year": 163,
    "Second yearColor": "hsl(306, 70%, 50%)",
    "Third year": 15,
    "Third yearColor": "hsl(116, 70%, 50%)",
    kebab: 108,
    kebabColor: "hsl(297, 70%, 50%)",
    fries: 91,
    friesColor: "hsl(130, 70%, 50%)",
    donut: 123,
    donutColor: "hsl(109, 70%, 50%)",
  },
  {
    Group: "Criminology",
    "First year": 96,
    "First yearColor": "hsl(142, 70%, 50%)",
    "Second year": 188,
    "Second yearColor": "hsl(243, 70%, 50%)",
    "Third year": 36,
    "Third yearColor": "hsl(311, 70%, 50%)",
    kebab: 171,
    kebabColor: "hsl(4, 70%, 50%)",
    fries: 21,
    friesColor: "hsl(103, 70%, 50%)",
    donut: 90,
    donutColor: "hsl(225, 70%, 50%)",
  },
  {
    Group: "Human Source",
    "First year": 167,
    "First yearColor": "hsl(8, 70%, 50%)",
    "Second year": 19,
    "Second yearColor": "hsl(187, 70%, 50%)",
    "Third year": 159,
    "Third yearColor": "hsl(269, 70%, 50%)",
    kebab: 189,
    kebabColor: "hsl(132, 70%, 50%)",
    fries: 133,
    friesColor: "hsl(291, 70%, 50%)",
    donut: 81,
    donutColor: "hsl(172, 70%, 50%)",
  },
];

export const educationdata = [
  {
    id: "Math",
    label: "Math",
    value: 25,
    color: "hsl(200, 70%, 50%)",
  },
  {
    id: "Science",
    label: "Science",
    value: 20,
    color: "hsl(100, 70%, 50%)",
  },
  {
    id: "Languages",
    label: "Languages",
    value: 15,
    color: "hsl(50, 70%, 50%)",
  },
  {
    id: "Technology",
    label: "Technology",
    value: 30,
    color: "hsl(300, 70%, 50%)",
  },
  {
    id: "Arts",
    label: "Arts",
    value: 10,
    color: "hsl(0, 70%, 50%)",
  },
];

export const lineChartData = [
  {
    id: "nursing",
    color: "hsl(122, 70%, 50%)",
    data: [
      { x: "Year 1", y: 143 },
      { x: "Year 2", y: 196 },
      { x: "Year 3", y: 53 },
      { x: "Year 4", y: 157 },
      { x: "Year 5", y: 142 },
    ],
  },
  {
    id: "information system",
    color: "hsl(99, 70%, 50%)",
    data: [
      { x: "Year 1", y: 228 },
      { x: "Year 2", y: 34 },
      { x: "Year 3", y: 289 },
      { x: "Year 4", y: 103 },
      { x: "Year 5", y: 73 },
    ],
  },
  {
    id: "psychology",
    color: "hsl(110, 70%, 50%)",
    data: [
      { x: "Year 1", y: 203 },
      { x: "Year 2", y: 112 },
      { x: "Year 3", y: 110 },
      { x: "Year 4", y: 161 },
      { x: "Year 5", y: 37 },
    ],
  },
  {
    id: "economy & management",
    color: "hsl(9, 70%, 50%)",
    data: [
      { x: "Year 1", y: 258 },
      { x: "Year 2", y: 156 },
      { x: "Year 3", y: 198 },
      { x: "Year 4", y: 299 },
      { x: "Year 5", y: 29 },
    ],
  },
  {
    id: "human resources",
    color: "hsl(20, 70%, 50%)",
    data: [
      { x: "Year 1", y: 288 },
      { x: "Year 2", y: 297 },
      { x: "Year 3", y: 239 },
      { x: "Year 4", y: 183 },
      { x: "Year 5", y: 180 },
    ],
  },
];

const dashboardContentData = {
  // Admin Dashboard - System oversight and management
  1100: [
    {
      type: "box",
      props: {
        title: "User Management",
        subtitle: "1,245 Active Users",
        boxLink: "Manage all users",
        image: logoImg,
        bgColor: "#e6f3ff",
        gridRow: "span 8",
      },
    },
    {
      type: "box",
      props: {
        title: "System Analytics",
        subtitle: "View system performance",
        boxLink: "View detailed analytics",
        image: statImg,
        bgColor: "#fff2e6",
        gridRow: "span 8",
      },
    },
    {
      type: "box",
      props: {
        title: "Institution Overview",
        subtitle: "12 Departments Active",
        boxLink: "Manage departments",
        image: coursesImg,
        bgColor: "#f0f8f0",
        gridRow: "span 8",
      },
    },
    {
      type: "chart",
      props: {
        title: "Department Enrollment Statistics",
        chartType: "bar",
        chartData: sampleData,
        gridColumn: "span 8",
        gridRow: "span 1",
      },
    },
    {
      type: "assignments",
      props: {
        data: upcomingAssignments,
        gridRow: "span 1",
      },
    },
    {
      type: "chart",
      props: {
        title: "System Usage Distribution",
        chartType: "pie",
        chartData: educationdata,
        gridRow: "span 1",
      },
    },
    {
      type: "chart",
      props: {
        title: "Annual Enrollment Trends",
        chartType: "line",
        chartData: lineChartData,
        gridColumn: "span 8",
        gridRow: "span 1",
      },
    },
  ],
  
  // Lecturer Dashboard - Teaching focused
  1200: [
    {
      type: "box",
      props: {
        title: "My Classes",
        subtitle: "4 Active Classes",
        boxLink: "View all classes",
        image: coursesImg,
        bgColor: "#f0f8f0",
        gridRow: "span 8",
      },
    },
    {
      type: "box",
      props: {
        title: "Pending Grades",
        subtitle: "23 Assignments to Grade",
        boxLink: "Grade assignments",
        image: gradeImg,
        bgColor: "#fffccc",
        gridRow: "span 8",
      },
    },
    {
      type: "box",
      props: {
        title: "Student Communications",
        subtitle: "5 New Messages",
        boxLink: "View messages",
        image: notificationImg,
        bgColor: "#ffcccc",
        gridRow: "span 8",
      },
    },
    {
      type: "chart",
      props: {
        title: "Class Performance Overview",
        chartType: "bar",
        chartData: sampleData,
        gridColumn: "span 8",
        gridRow: "span 1",
      },
    },
    {
      type: "assignments",
      props: {
        data: upcomingAssignments,
        gridRow: "span 1",
      },
    },
    {
      type: "chart",
      props: {
        title: "Student Grade Distribution",
        chartType: "pie",
        chartData: educationdata,
        gridRow: "span 1",
      },
    },
    {
      type: "chart",
      props: {
        title: "Class Progress Trends",
        chartType: "line",
        chartData: lineChartData,
        gridColumn: "span 8",
        gridRow: "span 1",
      },
    },
  ],
  
  // Student Dashboard - Learning focused
  1300: [
    {
      type: "box",
      props: {
        title: "My Enrolled Courses",
        subtitle: "5 Active Courses",
        boxLink: "View all courses",
        image: coursesImg,
        bgColor: "#cffccc",
        gridRow: "span 8",
      },
    },
    {
      type: "box",
      props: {
        title: "My Grades",
        subtitle: "Latest: A- in Math",
        boxLink: "View all grades",
        image: gradeImg,
        bgColor: "#fffccc",
        gridRow: "span 8",
      },
    },
    {
      type: "box",
      props: {
        title: "Notifications",
        subtitle: "3 New Announcements",
        boxLink: "View all notifications",
        image: notificationImg,
        bgColor: "#ffcccc",
        gridRow: "span 8",
      },
    },
    {
      type: "chart",
      props: {
        title: "My Academic Progress",
        chartType: "line",
        chartData: lineChartData,
        gridColumn: "span 8",
        gridRow: "span 1",
      },
    },
    {
      type: "assignments",
      props: {
        data: upcomingAssignments,
        gridRow: "span 1",
      },
    },
    {
      type: "chart",
      props: {
        title: "Course Distribution",
        chartType: "pie",
        chartData: educationdata,
        gridRow: "span 1",
      },
    },
    {
      type: "chart",
      props: {
        title: "Study Performance Analysis",
        chartType: "bar",
        chartData: sampleData,
        gridColumn: "span 8",
        gridRow: "span 1",
      },
    },
  ],
};

export default dashboardContentData;