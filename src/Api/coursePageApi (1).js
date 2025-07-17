import coursesList from "./coursePageData.js";

// Fetch all courses
export const fetchAllCourses = async () => {
  try {
    return coursesList;
  } catch (error) {
    throw new Error("Failed to fetch courses");
  }
};

// Fetch course by ID
export const fetchCourseById = async (courseId) => {
  try {
    const course = coursesList.find(course => course.id === parseInt(courseId));
    if (!course) {
      throw new Error(`Course with ID ${courseId} not found`);
    }
    return course;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Add a new course
export const addCourse = async (courseData) => {
  try {
    const newCourse = {
      ...courseData,
      id: Date.now(),
      students: 0,
      rating: 0,
      lessons: 0,
      img: "",
    };
    return newCourse;
  } catch (error) {
    throw new Error("Failed to add course");
  }
};

// Update an existing course
export const updateCourse = async (courseId, courseData) => {
  try {
    const course = coursesList.find(course => course.id === parseInt(courseId));
    if (!course) {
      throw new Error(`Course with ID ${courseId} not found`);
    }
    return { ...course, ...courseData };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Delete a course
export const deleteCourse = async (courseId) => {
  try {
    const course = coursesList.find(course => course.id === parseInt(courseId));
    if (!course) {
      throw new Error(`Course with ID ${courseId} not found`);
    }
    return courseId;
  } catch (error) {
    throw new Error(error.message);
  }
};