// utils/coursesUtils.js
import { getYearOptionsForGroup, semesterOptions, getAllGroups, coursesList, lecturersList } from "../Static/FIxed/coursesData.js";

export const courseFields = [
  { name: "courseTitle", label: "Course Title", type: "text", placeholder: "Enter course title", required: true },
  { name: "courseCode", label: "Course Code", type: "text", placeholder: "e.g., CS101", required: true },
  { name: "group", label: "Program Group", type: "select", options: getAllGroups(), required: true },
  { name: "academicYear", label: "Academic Year", type: "select", options: [], required: true, dependsOn: "group", getDynamicOptions: (formData) => getYearOptionsForGroup(formData.group || "Certificate IT") },
  { name: "semester", label: "Semester", type: "select", options: semesterOptions, required: true },
  { name: "year", label: "Year", type: "text", value: new Date().getFullYear().toString(), required: true, disabled: true },
  { name: "students", label: "Maximum Students", type: "number", placeholder: "e.g., 30", required: false },
  { name: "lessons", label: "Number of Lessons", type: "number", placeholder: "e.g., 12", required: false },
  { name: "credits", label: "Credits", type: "number", placeholder: "e.g., 3", required: false },
  { name: "lecturer", label: "Lecturer", type: "select", options: lecturersList, required: true, placeholder: "Select a lecturer" },
  { name: "description", label: "Description", type: "textarea", placeholder: "Enter course description", required: false, rows: 3 },
  { name: "img", label: "Image URL", type: "text", placeholder: "Enter image URL", required: false },
  { name: "selectable", label: "Elective Course", type: "checkbox", required: false, value: "no" },
];

export const courseValidationRules = {
  courseTitle: { pattern: /^[A-Za-z0-9\s&-]{2,100}$/, message: "Course title must be 2-100 characters and contain only letters, numbers, spaces, &, and -" },
  courseCode: { pattern: /^[A-Z]{2,4}[0-9]{2,3}$/, message: "Course code must be in format like CS101, MATH201, etc." },
  students: { pattern: /^[1-9][0-9]*$/, message: "Number of students must be a positive number" },
  lessons: { pattern: /^[1-9][0-9]*$/, message: "Number of lessons must be a positive number" },
  credits: { pattern: /^[0-9]+$/, message: "Credits must be a non-negative number" },
  description: { maxLength: 500, message: "Description must not exceed 500 characters" },
};

export const transformCourseForForm = (course) => {
  console.log("Transforming course for form:", course);
  const transformed = {
    id: course.id, // Preserve the ID
    courseTitle: course.title || course.courseTitle || '',
    courseCode: course.code || course.courseCode || '',
    group: course.group || '',
    academicYear: course.academicYear || '',
    semester: course.semester || '',
    year: course.year || new Date().getFullYear().toString(),
    students: course.students ? course.students.toString() : '',
    lessons: course.lessons ? course.lessons.toString() : '',
    credits: course.credits ? course.credits.toString() : '',
    lecturer: course.lecturer || course.instructor || '',
    description: course.description || '',
    img: course.img || '',
    selectable: course.selectable === "yes" || course.selectable === true,
  };
  console.log("Transformed data:", transformed);
  return transformed;
};

export const transformFormToCourse = (formData, existingCourse = null) => {
  console.log("Transforming form to course:", { formData, existingCourse });
  
  const courseData = {
    id: existingCourse ? existingCourse.id : Date.now(),
    code: formData.courseCode,
    title: formData.courseTitle,
    group: formData.group,
    academicYear: formData.academicYear,
    semester: formData.semester,
    year: formData.year || new Date().getFullYear().toString(),
    students: parseInt(formData.students) || 0,
    lessons: parseInt(formData.lessons) || 0,
    credits: parseInt(formData.credits) || 0,
    lecturer: formData.lecturer,
    description: formData.description || '',
    img: formData.img || '',
    selectable: formData.selectable ? "yes" : "no",
    createdAt: existingCourse ? existingCourse.createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  console.log("Resulting course data:", courseData);
  return courseData;
};

export const handleFieldDependencies = (fieldName, value, allValues) => {
  const updatedValues = { ...allValues };
  
  // Update the specific field
  updatedValues[fieldName] = value;
  
  // Handle specific field dependencies
  if (fieldName === 'group') {
    // When group changes, clear academic year since it depends on group
    updatedValues.academicYear = '';
  }
  
  return updatedValues;
};

export const getUpdatedCourseFields = () => {
  const currentYear = new Date().getFullYear();
  return courseFields.map(field => 
    field.name === 'year' 
      ? { ...field, value: currentYear.toString(), placeholder: currentYear.toString() } 
      : field
  );
};

export const filterCourses = (courses, filters, searchInput) => {
  let filtered = [...courses];
  
  if (filters.group && filters.group !== "all") {
    filtered = filtered.filter(c => c.group === filters.group);
  }
  if (filters.academicYear && filters.academicYear !== "all") {
    filtered = filtered.filter(c => c.academicYear === filters.academicYear);
  }
  if (filters.semester && filters.semester !== "all") {
    filtered = filtered.filter(c => c.semester === filters.semester);
  }
  if (filters.year && filters.year !== "all") {
    filtered = filtered.filter(c => c.year === filters.year);
  }
  if (filters.selectable && filters.selectable !== "all") {
    filtered = filtered.filter(c => (c.selectable === "yes") === (filters.selectable === "yes"));
  }
  
  if (searchInput && searchInput.trim()) {
    const searchLower = searchInput.toLowerCase().trim();
    filtered = filtered.filter(c => 
      (c.title && c.title.toLowerCase().includes(searchLower)) || 
      (c.code && c.code.toLowerCase().includes(searchLower))
    );
  }
  
  return filtered;
};

export const getFilterOptions = (courses) => ({
  groups: [...new Set(courses.map(c => c.group))].filter(Boolean),
  academicYears: [...new Set(courses.map(c => c.academicYear))].filter(Boolean),
  semesters: [...semesterOptions],
  years: [...new Set(courses.map(c => c.year))].filter(Boolean),
  selectable: ["yes", "no"],
});

export const calculateCourseStats = (courses) => ({
  totalCourses: courses.length,
  totalStudents: courses.reduce((sum, c) => sum + (c.students || 0), 0),
  avgLessons: courses.length ? courses.reduce((sum, c) => sum + (c.lessons || 0), 0) / courses.length : 0,
});

export const validateCourseData = (formData) => {
  const errors = {};
  
  // Check required fields
  if (!formData.courseTitle || !formData.courseTitle.trim()) {
    errors.courseTitle = "Course title is required";
  }
  if (!formData.courseCode || !formData.courseCode.trim()) {
    errors.courseCode = "Course code is required";
  }
  if (!formData.group) {
    errors.group = "Program group is required";
  }
  if (!formData.academicYear) {
    errors.academicYear = "Academic year is required";
  }
  if (!formData.semester) {
    errors.semester = "Semester is required";
  }
  if (!formData.lecturer) {
    errors.lecturer = "Lecturer is required";
  }
  
  // Validate patterns
  for (const [field, rules] of Object.entries(courseValidationRules)) {
    const value = formData[field];
    if (value && rules.pattern && !rules.pattern.test(value)) {
      errors[field] = rules.message;
    }
    if (value && rules.maxLength && value.length > rules.maxLength) {
      errors[field] = rules.message;
    }
  }
  
  return errors;
};

export const isCourseCodeExists = (code, courses, excludeId = null) => {
  return courses.some(c => c.code === code && (excludeId === null || c.id !== excludeId));
};

export const getCourseById = (id, courses) => {
  return courses.find(c => c.id === id) || null;
};

export const COURSES_PER_PAGE = 12;
export const DEFAULT_FILTERS = { 
  group: "all", 
  academicYear: "all", 
  semester: "all", 
  year: "all", 
  selectable: "all" 
};