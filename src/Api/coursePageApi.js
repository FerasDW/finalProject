import coursesList from "./coursePageData.js";

// Simulate an API call to fetch course data by ID
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
