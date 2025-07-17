import { profileConfigs, availableCourses, lecturerResources, workingHoursData } from "../Static/genericProfilePageData.js";

export const fetchProfileData = async (entityType, id) => {
  try {
    const config = profileConfigs[entityType];
    if (!config || !config.dataSource?.length) {
      throw new Error(`No data available for ${entityType}`);
    }
    const sanitizedId = parseInt(id);
    if (isNaN(sanitizedId) || sanitizedId <= 0) {
      throw new Error(`Invalid ID: ${id}`);
    }
    const data = config.getProfileData(sanitizedId);
    if (!data || !data[entityType]) {
      throw new Error(`${entityType} with ID ${sanitizedId} not found`);
    }
    return data;
  } catch (error) {
    throw new Error(`Failed to fetch profile data for ${entityType}: ${error.message}`);
  }
};

export const fetchProfileStats = async (entityType, id) => {
  try {
    const config = profileConfigs[entityType];
    if (!config || !config.dataSource?.length) {
      throw new Error(`No data available for ${entityType}`);
    }
    const sanitizedId = parseInt(id);
    if (isNaN(sanitizedId) || sanitizedId <= 0) {
      throw new Error(`Invalid ID: ${id}`);
    }
    const data = config.getProfileData(sanitizedId);
    if (!data || !data[entityType]) {
      throw new Error(`${entityType} with ID ${sanitizedId} not found`);
    }
    return config.getStats(data);
  } catch (error) {
    throw new Error(`Failed to fetch stats for ${entityType}: ${error.message}`);
  }
};

export const fetchGrades = async (entityType, id) => {
  try {
    const config = profileConfigs[entityType];
    if (!config || !config.dataSource?.length) {
      throw new Error(`No data available for ${entityType}`);
    }
    const data = config.getProfileData(parseInt(id));
    return data.grades || [];
  } catch (error) {
    throw new Error(`Failed to fetch grades for ${entityType}: ${error.message}`);
  }
};

export const fetchCourses = async (entityType, id) => {
  try {
    const config = profileConfigs[entityType];
    if (!config || !config.dataSource?.length) {
      throw new Error(`No data available for ${entityType}`);
    }
    const data = config.getProfileData(parseInt(id));
    return data.courses || [];
  } catch (error) {
    throw new Error(`Failed to fetch courses for ${entityType}: ${error.message}`);
  }
};

export const fetchEnrollments = async (entityType, id) => {
  try {
    const config = profileConfigs[entityType];
    if (!config || !config.dataSource?.length) {
      throw new Error(`No data available for ${entityType}`);
    }
    const data = config.getProfileData(parseInt(id));
    return data.enrollments || [];
  } catch (error) {
    throw new Error(`Failed to fetch enrollments for ${entityType}: ${error.message}`);
  }
};

export const fetchSchedule = async (entityType, id) => {
  try {
    const config = profileConfigs[entityType];
    if (!config || !config.dataSource?.length) {
      throw new Error(`No data available for ${entityType}`);
    }
    const data = config.getProfileData(parseInt(id));
    if (entityType === "lecturer") {
      return workingHoursData;
    }
    return generateScheduleData(data).schedule;
  } catch (error) {
    throw new Error(`Failed to fetch schedule for ${entityType}: ${error.message}`);
  }
};

export const fetchResources = async (entityType, id) => {
  try {
    const config = profileConfigs[entityType];
    if (!config || !config.dataSource?.length) {
      throw new Error(`No data available for ${entityType}`);
    }
    const data = config.getProfileData(parseInt(id));
    if (entityType === "lecturer") {
      return lecturerResources;
    }
    return generateResourcesData().courseMaterials;
  } catch (error) {
    throw new Error(`Failed to fetch resources for ${entityType}: ${error.message}`);
  }
};

export const fetchRequests = async (entityType, id) => {
  try {
    const config = profileConfigs[entityType];
    if (!config || !config.dataSource?.length) {
      throw new Error(`No data available for ${entityType}`);
    }
    const data = config.getProfileData(parseInt(id));
    return data.requests || [];
  } catch (error) {
    throw new Error(`Failed to fetch requests for ${entityType}: ${error.message}`);
  }
};

export const updateGrade = async (entityType, id, gradeData) => {
  try {
    const config = profileConfigs[entityType];
    if (!config || !config.dataSource?.length) {
      throw new Error(`No data available for ${entityType}`);
    }
    // Simulate updating grade
    return { success: true, data: gradeData };
  } catch (error) {
    throw new Error(`Failed to update grade for ${entityType}: ${error.message}`);
  }
};

export const updateCourse = async (entityType, id, courseData) => {
  try {
    const config = profileConfigs[entityType];
    if (!config || !config.dataSource?.length) {
      throw new Error(`No data available for ${entityType}`);
    }
    // Simulate updating course
    return { success: true, data: courseData };
  } catch (error) {
    throw new Error(`Failed to update course for ${entityType}: ${error.message}`);
  }
};

export const updateEnrollment = async (entityType, id, enrollmentData) => {
  try {
    const config = profileConfigs[entityType];
    if (!config || !config.dataSource?.length) {
      throw new Error(`No data available for ${entityType}`);
    }
    // Simulate updating enrollment
    return { success: true, data: enrollmentData };
  } catch (error) {
    throw new Error(`Failed to update enrollment for ${entityType}: ${error.message}`);
  }
};

export const updateSchedule = async (entityType, id, scheduleData) => {
  try {
    const config = profileConfigs[entityType];
    if (!config || !config.dataSource?.length) {
      throw new Error(`No data available for ${entityType}`);
    }
    // Simulate updating schedule
    return { success: true, data: scheduleData };
  } catch (error) {
    throw new Error(`Failed to update schedule for ${entityType}: ${error.message}`);
  }
};

export const updateResource = async (entityType, id, resourceData) => {
  try {
    const config = profileConfigs[entityType];
    if (!config || !config.dataSource?.length) {
      throw new Error(`No data available for ${entityType}`);
    }
    // Simulate updating resource
    return { success: true, data: resourceData };
  } catch (error) {
    throw new Error(`Failed to update resource for ${entityType}: ${error.message}`);
  }
};

export const respondToRequest = async (entityType, id, requestId, response) => {
  try {
    const config = profileConfigs[entityType];
    if (!config || !config.dataSource?.length) {
      throw new Error(`No data available for ${entityType}`);
    }
    // Simulate responding to request
    return { success: true, data: { id: requestId, response, responseDate: new Date().toISOString().split("T")[0] } };
  } catch (error) {
    throw new Error(`Failed to respond to request for ${entityType}: ${error.message}`);
  }
};