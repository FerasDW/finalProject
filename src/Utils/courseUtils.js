// utils/coursesUtils.js
import { semesterOptions } from "../Static/FIxed/coursesData.js";
import { getAllDepartments } from "../Api/coursePageApi.js";
import { getAllLecturers } from "../Api/dashboardPageApi.js";

// Function to generate academic year options from totalAcademicYears
export const generateAcademicYearOptions = (totalAcademicYears) => {
  console.log("🔧 generateAcademicYearOptions called with:", totalAcademicYears);
  
  if (!totalAcademicYears || totalAcademicYears <= 0) {
    console.log("❌ No valid totalAcademicYears, returning empty array");
    return [];
  }
  
  const options = Array.from(
    { length: totalAcademicYears }, 
    (_, index) => String(index + 1)
  );
  
  console.log("✅ Generated academic year options:", options);
  return options;
};

// Function to get academic year options based on department name
export const getAcademicYearOptionsForDepartment = (departmentName, departments) => {
  console.log("🔧 getAcademicYearOptionsForDepartment called with:", { departmentName, departmentsCount: departments?.length });
  
  if (!departmentName || !departments || departments.length === 0) {
    console.log("❌ Missing departmentName or departments array");
    return [];
  }
  
  const selectedDepartment = departments.find(dept => dept.name === departmentName);
  console.log("🔍 Found department:", selectedDepartment);
  
  if (!selectedDepartment) {
    console.log("❌ Department not found in departments array");
    return [];
  }
  
  const options = generateAcademicYearOptions(selectedDepartment.totalAcademicYears);
  console.log("✅ Returning academic year options:", options);
  return options;
};

// Function to get all available academic years from all departments
export const getAllAcademicYearOptions = (departments) => {
  console.log("🔧 getAllAcademicYearOptions called with departments:", departments?.length);
  
  if (!departments || departments.length === 0) {
    console.log("❌ No departments available");
    return [];
  }
  
  const allYears = new Set();
  
  departments.forEach(dept => {
    console.log(`Processing department: ${dept.name} with ${dept.totalAcademicYears} academic years`);
    const yearOptions = generateAcademicYearOptions(dept.totalAcademicYears);
    yearOptions.forEach(year => allYears.add(year));
  });
  
  const result = Array.from(allYears).sort((a, b) => parseInt(a) - parseInt(b));
  console.log("✅ All academic year options:", result);
  return result;
};

// Function to get department options for select fields
export const getDepartmentOptions = (departments) => {
  console.log("🔧 getDepartmentOptions called with departments:", departments?.length);
  const options = departments.map(dept => dept.name);
  console.log("✅ Department options:", options);
  return options;
};

// Function to get lecturer options for select fields
export const getLecturerOptions = async () => {
  console.log("🔧 getLecturerOptions called");
  
  try {
    const allUsers = await getAllLecturers();
    console.log("📡 Fetched all users from API:", allUsers.length);
    
    // Filter for lecturers only (role 1200)
    const lecturers = allUsers.filter(user => user.role === "1200");
    console.log("👨‍🏫 Filtered lecturers (role 1200):", lecturers.length, lecturers);
    
    const lecturerOptions = lecturers.map(lecturer => {
      const option = {
        value: lecturer.id,
        label: lecturer.name || 'Unknown Lecturer',
        name: lecturer.name || 'Unknown Lecturer'
      };
      console.log("📝 Created lecturer option:", option);
      return option;
    });
    
    console.log("✅ Final lecturer options:", lecturerOptions);
    return lecturerOptions;
  } catch (error) {
    console.error("❌ Failed to fetch lecturers:", error);
    return [];
  }
};

// Updated course fields with department and lecturer options
export const getCourseFields = async (departments) => {
  console.log("🔧 getCourseFields called with departments:", departments?.length);
  
  const departmentOptions = getDepartmentOptions(departments);
  const lecturerOptions = await getLecturerOptions();
  
  console.log("📋 Department options for form:", departmentOptions);
  console.log("👨‍🏫 Lecturer options for form:", lecturerOptions);
  
  const fields = [
    { name: "courseTitle", label: "Course Title", type: "text", placeholder: "Enter course title", required: true },
    { name: "courseCode", label: "Course Code", type: "text", placeholder: "e.g., CS101", required: true },
    { name: "department", label: "Department", type: "select", options: departmentOptions, required: true },
    { 
      name: "academicYear", 
      label: "Academic Year", 
      type: "select", 
      options: [], 
      required: true, 
      dependsOn: "department", 
      getDynamicOptions: (formData) => {
        console.log("🔄 Dynamic options called for academicYear with formData:", formData);
        const result = getAcademicYearOptionsForDepartment(formData.department, departments);
        console.log("🔄 Dynamic options result:", result);
        return result;
      }
    },
    { name: "semester", label: "Semester", type: "select", options: semesterOptions, required: true },
    { name: "year", label: "Year", type: "text", value: new Date().getFullYear().toString(), required: true, disabled: true },
    { name: "students", label: "Maximum Students", type: "number", placeholder: "e.g., 30", required: false },
    { name: "lessons", label: "Number of Lessons", type: "number", placeholder: "e.g., 12", required: false },
    { name: "credits", label: "Credits", type: "number", placeholder: "e.g., 3", required: false },
    { name: "lecturer", label: "Lecturer", type: "select", options: lecturerOptions, required: true, placeholder: "Select a lecturer" },
    { name: "description", label: "Description", type: "textarea", placeholder: "Enter course description", required: false, rows: 3 },
    { name: "img", label: "Image URL", type: "text", placeholder: "Enter image URL", required: false },
    { name: "selectable", label: "Elective Course", type: "checkbox", required: false, value: "no" },
  ];
  
  console.log("✅ Generated course fields:", fields);
  return fields;
};

export const courseValidationRules = {
  courseTitle: { pattern: /^[A-Za-z0-9\s&-]{2,100}$/, message: "Course title must be 2-100 characters and contain only letters, numbers, spaces, &, and -" },
  courseCode: { pattern: /^[A-Z]{2,4}[0-9]{2,3}$/, message: "Course code must be in format like CS101, MATH201, etc." },
  students: { pattern: /^[1-9][0-9]*$/, message: "Number of students must be a positive number" },
  lessons: { pattern: /^[1-9][0-9]*$/, message: "Number of lessons must be a positive number" },
  credits: { pattern: /^[0-9]+$/, message: "Credits must be a non-negative number" },
  description: { maxLength: 500, message: "Description must not exceed 500 characters" },
};

export const transformCourseForForm = (course, lecturers = []) => {
  console.log("🔧 transformCourseForForm called with:", { course, lecturersCount: lecturers.length });
  
  // Find the lecturer by ID to get the name for display
  const lecturer = lecturers.find(l => l.id === course.lecturerId);
  console.log("👨‍🏫 Found lecturer for course:", lecturer);
  
  const transformed = {
    id: course.id,
    courseTitle: course.name || course.title || course.courseTitle || '',
    courseCode: course.code || course.courseCode || '',
    department: course.department || course.group || '',
    academicYear: course.academicYear || '',
    semester: course.semester || '',
    year: course.year ? course.year.toString() : new Date().getFullYear().toString(),
    students: course.students ? course.students.toString() : '',
    lessons: course.lessons ? course.lessons.toString() : '',
    credits: course.credits ? course.credits.toString() : '',
    lecturer: course.lecturerId || '',
    description: course.description || '',
    img: course.imageUrl || course.img || '',
    selectable: course.selectable === true || course.selectable === "yes",
  };
  
  console.log("✅ Transformed course data:", transformed);
  return transformed;
};

export const transformFormToCourse = (formData, existingCourse = null) => {
  console.log("🔧 transformFormToCourse called with:", { formData, existingCourse });
  
  const courseData = {
    id: existingCourse ? existingCourse.id : null,
    code: formData.courseCode,
    name: formData.courseTitle,
    department: formData.department,
    academicYear: formData.academicYear,
    semester: formData.semester,
    year: parseInt(formData.year) || new Date().getFullYear(),
    students: parseInt(formData.students) || 0,
    lessons: parseInt(formData.lessons) || 0,
    credits: parseInt(formData.credits) || 0,
    lecturerId: formData.lecturer,
    description: formData.description || '',
    imageUrl: formData.img || '',
    selectable: formData.selectable === true || formData.selectable === "yes",
  };
  
  console.log("✅ Transformed course data for backend:", courseData);
  return courseData;
};

// Transform course data for display (compatible with existing CoursePageContent)
export const transformCourseForDisplay = (courseData, lecturers = []) => {
  console.log("🔧 transformCourseForDisplay called with:", { courseData, lecturersCount: lecturers.length });
  
  if (!courseData) return null;

  const lecturer = lecturers.find(l => l.id === courseData.lecturerId);
  console.log("👨‍🏫 Found lecturer for display:", lecturer);
  
  const transformed = {
    ...courseData,
    lecturerName: lecturer ? lecturer.name : 'Unknown Lecturer',
    lecturer: lecturer || null,
    title: courseData.name || courseData.title,
    instructorName: lecturer ? lecturer.name : 'Unknown Lecturer',
    // Ensure compatibility with existing CoursePageContent expectations
    enrollments: courseData.enrollments || []
  };

  console.log("✅ Transformed course for display:", transformed);
  return transformed;
};

export const handleFieldDependencies = (fieldName, value, allValues) => {
  console.log("🔧 handleFieldDependencies called with:", { fieldName, value, allValues });
  
  const updatedValues = { ...allValues };
  updatedValues[fieldName] = value;
  
  if (fieldName === 'department') {
    console.log("🔄 Department changed, clearing academic year");
    updatedValues.academicYear = '';
  }
  
  console.log("✅ Updated values:", updatedValues);
  return updatedValues;
};

export const getUpdatedCourseFields = async (departments) => {
  console.log("🔧 getUpdatedCourseFields called with departments:", departments?.length);
  
  const currentYear = new Date().getFullYear();
  const courseFields = await getCourseFields(departments);
  
  const updatedFields = courseFields.map(field => 
    field.name === 'year' 
      ? { ...field, value: currentYear.toString(), placeholder: currentYear.toString() } 
      : field
  );
  
  console.log("✅ Updated course fields:", updatedFields.length);
  return updatedFields;
};

export const filterCourses = (courses, filters, searchInput) => {
  console.log("🔧 filterCourses called with:", { coursesCount: courses.length, filters, searchInput });
  
  let filtered = [...courses];
  
  if (filters.department && filters.department !== "all") {
    filtered = filtered.filter(c => c.department === filters.department);
    console.log(`Filtered by department ${filters.department}: ${filtered.length} courses`);
  }
  if (filters.academicYear && filters.academicYear !== "all") {
    filtered = filtered.filter(c => c.academicYear === filters.academicYear);
    console.log(`Filtered by academic year ${filters.academicYear}: ${filtered.length} courses`);
  }
  if (filters.semester && filters.semester !== "all") {
    filtered = filtered.filter(c => c.semester === filters.semester);
    console.log(`Filtered by semester ${filters.semester}: ${filtered.length} courses`);
  }
  if (filters.year && filters.year !== "all") {
    filtered = filtered.filter(c => c.year === filters.year);
    console.log(`Filtered by year ${filters.year}: ${filtered.length} courses`);
  }
  if (filters.selectable && filters.selectable !== "all") {
    filtered = filtered.filter(c => (c.selectable === "yes") === (filters.selectable === "yes"));
    console.log(`Filtered by selectable ${filters.selectable}: ${filtered.length} courses`);
  }
  
  if (searchInput && searchInput.trim()) {
    const searchLower = searchInput.toLowerCase().trim();
    filtered = filtered.filter(c => 
      (c.name && c.name.toLowerCase().includes(searchLower)) || 
      (c.title && c.title.toLowerCase().includes(searchLower)) || 
      (c.code && c.code.toLowerCase().includes(searchLower))
    );
    console.log(`Filtered by search "${searchInput}": ${filtered.length} courses`);
  }
  
  console.log("✅ Final filtered courses:", filtered.length);
  return filtered;
};

export const getFilterOptions = (courses, departments) => {
  console.log("🔧 getFilterOptions called with:", { coursesCount: courses.length, departmentsCount: departments?.length });
  
  const departmentOptions = getDepartmentOptions(departments);
  const allAcademicYears = getAllAcademicYearOptions(departments);
  
  const options = {
    departments: departmentOptions,
    academicYears: allAcademicYears,
    semesters: semesterOptions,
    years: [...new Set(courses.map(c => c.year))].filter(Boolean),
    selectable: ["yes", "no"],
  };
  
  console.log("✅ Filter options:", options);
  return options;
};

export const calculateCourseStats = (courses) => ({
  totalCourses: courses.length,
  totalStudents: courses.reduce((sum, c) => sum + (c.students || 0), 0),
  avgLessons: courses.length ? courses.reduce((sum, c) => sum + (c.lessons || 0), 0) / courses.length : 0,
});

export const validateCourseData = (formData) => {
  console.log("🔧 validateCourseData called with:", formData);
  
  const errors = {};
  
  if (!formData.courseTitle || !formData.courseTitle.trim()) {
    errors.courseTitle = "Course title is required";
  }
  if (!formData.courseCode || !formData.courseCode.trim()) {
    errors.courseCode = "Course code is required";
  }
  if (!formData.department) {
    errors.department = "Department is required";
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
  
  for (const [field, rules] of Object.entries(courseValidationRules)) {
    const value = formData[field];
    if (value && rules.pattern && !rules.pattern.test(value)) {
      errors[field] = rules.message;
    }
    if (value && rules.maxLength && value.length > rules.maxLength) {
      errors[field] = rules.message;
    }
  }
  
  console.log("✅ Validation errors:", errors);
  return errors;
};

export const isCourseCodeExists = (code, courses, excludeId = null) => {
  return courses.some(c => c.code === code && (excludeId === null || c.id !== excludeId));
};

export const getCourseById = (id, courses) => {
  return courses.find(c => c.id === id) || null;
};

// Helper functions for course page enrollment
export const getEnrollmentFormFields = (courseData, departments) => {
  console.log("🔧 getEnrollmentFormFields called with:", { courseData, departmentsCount: departments?.length });
  
  if (!courseData || !departments) return [];

  const academicYearOptions = getAcademicYearOptionsForDepartment(
    courseData.department, 
    departments
  );

  const fields = [
    {
      name: "studentName",
      label: "Student Name",
      type: "text",
      required: true,
      placeholder: "Enter student full name"
    },
    {
      name: "studentEmail",
      label: "Student Email",
      type: "email",
      required: true,
      placeholder: "Enter student email"
    },
    {
      name: "academicYear",
      label: "Academic Year",
      type: "select",
      required: true,
      options: academicYearOptions,
      placeholder: "Select academic year"
    },
    {
      name: "semester",
      label: "Semester",
      type: "select",
      required: true,
      options: semesterOptions,
      placeholder: "Select semester"
    }
  ];

  console.log("✅ Enrollment form fields:", fields);
  return fields;
};

export const COURSES_PER_PAGE = 12;
export const DEFAULT_FILTERS = { 
  department: "all", 
  academicYear: "all", 
  semester: "all", 
  year: "all", 
  selectable: "all" 
};