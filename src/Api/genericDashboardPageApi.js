import { genericDashboardConfigs } from "../Static/genericDashboardPageData.js";

// Fetch students data
export const fetchStudents = async () => {
  try {
    return genericDashboardConfigs.students.data;
  } catch (error) {
    throw new Error("Failed to fetch students data");
  }
};

// Fetch student by ID
export const fetchStudentById = async (studentId) => {
  try {
    const student = genericDashboardConfigs.students.data.find((s) => s.id === parseInt(studentId));
    if (!student) {
      throw new Error(`Student with ID ${studentId} not found`);
    }
    return student;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Fetch lecturers data
export const fetchLecturers = async () => {
  try {
    return genericDashboardConfigs.lecturers.data;
  } catch (error) {
    throw new Error("Failed to fetch lecturers data");
  }
};

// Fetch lecturer by ID
export const fetchLecturerById = async (lecturerId) => {
  try {
    const lecturer = genericDashboardConfigs.lecturers.data.find((l) => l.id === parseInt(lecturerId));
    if (!lecturer) {
      throw new Error(`Lecturer with ID ${lecturerId} not found`);
    }
    return lecturer;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Fetch dashboard stats
export const fetchDashboardStats = async (entityType) => {
  try {
    const config = genericDashboardConfigs[entityType];
    if (!config) {
      throw new Error(`Invalid entity type: ${entityType}`);
    }
    const stats = Object.entries(config.stats).reduce((acc, [key, calculator]) => {
      try {
        acc[key] = calculator(config.data);
      } catch (error) {
        acc[key] = 0;
      }
      return acc;
    }, {});
    return stats;
  } catch (error) {
    throw new Error(`Failed to fetch stats for ${entityType}`);
  }
};