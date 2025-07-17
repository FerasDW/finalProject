import { upcomingAssignments } from "./calendarPageData.js";

// Fetch all assignments
export const fetchAllAssignments = async () => {
  try {
    return upcomingAssignments;
  } catch (error) {
    throw new Error("Failed to fetch assignments");
  }
};

// Fetch assignment by ID
export const fetchAssignmentById = async (assignmentId) => {
  try {
    const assignment = upcomingAssignments.find(
      (assignment) => assignment.id === parseInt(assignmentId)
    );
    if (!assignment) {
      throw new Error(`Assignment with ID ${assignmentId} not found`);
    }
    return assignment;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Add a new assignment
export const addAssignment = async (assignmentData) => {
  try {
    const newAssignment = {
      ...assignmentData,
      id: Date.now(),
    };
    return newAssignment;
  } catch (error) {
    throw new Error("Failed to add assignment");
  }
};

// Update an existing assignment
export const updateAssignment = async (assignmentId, assignmentData) => {
  try {
    const assignment = upcomingAssignments.find(
      (assignment) => assignment.id === parseInt(assignmentId)
    );
    if (!assignment) {
      throw new Error(`Assignment with ID ${assignmentId} not found`);
    }
    return { ...assignment, ...assignmentData };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Delete an assignment
export const deleteAssignment = async (assignmentId) => {
  try {
    const assignment = upcomingAssignments.find(
      (assignment) => assignment.id === parseInt(assignmentId)
    );
    if (!assignment) {
      throw new Error(`Assignment with ID ${assignmentId} not found`);
    }
    return assignmentId;
  } catch (error) {
    throw new Error(error.message);
  }
};