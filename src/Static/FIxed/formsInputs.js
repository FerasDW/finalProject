import { getAllGroups, semesterOptions, getYearOptionsForGroup } from "./coursePageData.js";
import { lecturersList } from "./coursesData.js";


export const courseFields = [
  {
    name: "courseTitle",
    label: "Course Title",
    type: "text",
    placeholder: "Enter course title",
    required: true,
  },
  {
    name: "courseCode",
    label: "Course Code",
    type: "text",
    placeholder: "e.g., CS101",
    required: true,
  },
  {
    name: "group",
    label: "Program Group",
    type: "select",
    options: getAllGroups(), // Returns array of strings
    required: true,
  },
  {
    name: "academicYear",
    label: "Academic Year",
    type: "select",
    options: [], // Will be populated dynamically based on group selection
    required: true,
    dependsOn: "group",
    getDynamicOptions: (formData) => getYearOptionsForGroup(formData.group || "Certificate IT"),
  },
  {
    name: "semester",
    label: "Semester", 
    type: "select",
    options: semesterOptions, // Returns array of strings
    required: true,
  },
  {
    name: "year",
    label: "Year",
    type: "text",
    value: new Date().getFullYear().toString(),
    required: true,
    disabled: true,
  },
  {
    name: "students",
    label: "Maximum Students",
    type: "number",
    placeholder: "e.g., 30",
    required: false,
  },
  {
    name: "lessons",
    label: "Number of Lessons",
    type: "number",
    placeholder: "e.g., 12",
    required: false,
  },
  {
    name: "credits",
    label: "Credits",
    type: "number",
    placeholder: "e.g., 3",
    required: false,
  },
  {
    name: "lecturer",
    label: "Lecturer",
    type: "select",
    options: lecturersList, // Use the comprehensive lecturers list
    required: true,
    placeholder: "Select a lecturer",
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Enter course description",
    required: false,
    rows: 3,
  },
  {
    name: "img",
    label: "Image URL",
    type: "text",
    placeholder: "Enter image URL",
    required: false,
  },
  {
    name: "selectable",
    label: "Elective Course",
    type: "checkbox",
    required: false,
    value: "no",
  },
];

export const announcementFormFields = [
  {
    name: "title",
    label: "Announcement Title",
    type: "text",
    placeholder: "Enter announcement title",
    required: true,
  },
  {
    name: "content",
    label: "Announcement Content",
    type: "textarea",
    placeholder: "Enter announcement details",
    required: true,
    rows: 4,
  },
];

export const templateFormFields = [
  {
    name: "title",
    label: "Template Title",
    type: "text",
    placeholder: "Enter template title",
    required: true,
  },
  {
    name: "content",
    label: "Template Content",
    type: "textarea",
    placeholder: "Enter template content",
    required: true,
    rows: 4,
  },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: ["general", "exam", "event", "reminder"],
    required: true,
  },
];

export const cvFormFields = [
  {
    name: "name",
    label: "Full Name",
    type: "text",
    placeholder: "Enter your full name",
    required: true,
  },
  {
    name: "title",
    label: "Professional Title",
    type: "text",
    placeholder: "e.g., Software Engineer, Marketing Manager",
    required: true,
  },
  {
    name: "summary",
    label: "Professional Summary",
    type: "textarea",
    placeholder: "Write a brief professional summary about yourself",
    required: false,
  },
  {
    name: "education",
    label: "Education",
    type: "textarea",
    placeholder: "List your educational background",
    required: false,
  },
  {
    name: "experience",
    label: "Work Experience",
    type: "textarea",
    placeholder: "Describe your work experience",
    required: false,
  },
  {
    name: "skills",
    label: "Skills",
    type: "textarea",
    placeholder: "List your skills (comma separated)",
    required: false,
  },
  {
    name: "links",
    label: "Links",
    type: "text",
    placeholder: "LinkedIn, Portfolio, etc.",
    required: false,
  },
];

export const categoryFields = [
  {
    name: "name",
    label: "Category Name",
    placeholder: "e.g., Presentations, Assignments...",
    required: true,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Brief description of this category...",
    rows: 3,
  },
  {
    name: "color",
    label: "Color",
    type: "radio",
    options: [
      "#3b82f6",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
      "#06b6d4",
    ],
    required: true,
  },
];

export const uploadFileFields = (categories) => [
  {
    name: "categoryId",
    label: "Select Category",
    type: "select",
    placeholder: "Choose a category...",
    options: categories.map((cat) => cat.id),
    required: true,
  },
  {
    name: "file",
    label: "Choose File",
    type: "file",
    accept: ".pdf,.docx,.pptx,.txt",
    required: true,
  },
];

export const studentFormFields = [
  {
    name: "photo",
    label: "Profile Photo URL",
    type: "url",
    placeholder: "https://example.com/photo.jpg",
    required: false,
  },
  {
    name: "name",
    label: "Full Name",
    type: "text",
    placeholder: "Enter student full name",
    required: true,
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "student@example.com",
    required: true,
  },
  {
    name: "division",
    label: "Division",
    type: "select",
    required: true,
    options: [
      
      "computer-science",
      "engineering",
      "mathematics",
      "physics",
      "chemistry",
    ],
  },
  {
    name: "academicYear",
    label: "Academic Year",
    type: "select",
    required: true,
    options: [
      "2023-24",
      "2024-25",
      "2025-26",
    ],
  },
  {
    name: "learningGroup",
    label: "Learning Group",
    type: "select",
    required: true,
    options: [
      "group-a",
      "group-b",
      "group-c",
    ],
  },
  {
    name: "graduationYear",
    label: "Graduation Year",
    type: "select",
    required: true,
    options: [
      "2024",
      "2025",
      "2026",
      "2027",
    ],
  },
  {
    name: "yearGroup",
    label: "Year Group",
    type: "select",
    required: true,
    options: [
      "First Year",
      "Second Year",
      "Third Year",
      "Fourth Year",
    ],
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    options: [
      "Active",
      "Inactive",
      "Graduated",
      "Suspended",
    ],
  },
];

export const studentValidationRules = {
  // photo: {
  //   pattern: /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i,
  //   message: "Please enter a valid image URL (jpg, jpeg, png, or gif)",
  // },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address",
  },
  name: {
    pattern: /^[A-Za-z\s]{2,50}$/,
    message: "Please enter a valid name (2-50 characters, letters and spaces only)",
  },
  division: {
    pattern: /^(computer-science|engineering|mathematics|physics|chemistry)$/,
    message: "Please select a valid division",
  },
  academicYear: {
    pattern: /^(2023-24|2024-25|2025-26)$/,
    message: "Please select a valid academic year",
  },
  learningGroup: {
    pattern: /^(group-a|group-b|group-c)$/,
    message: "Please select a valid learning group",
  },
  graduationYear: {
    pattern: /^(2024|2025|2026|2027)$/,
    message: "Please select a valid graduation year",
  },
  yearGroup: {
    pattern: /^(First Year|Second Year|Third Year|Fourth Year)$/,
    message: "Please select a valid year group",
  },
  status: {
    pattern: /^(Active|Inactive|Graduated|Suspended)$/,
    message: "Please select a valid status",
  },
};