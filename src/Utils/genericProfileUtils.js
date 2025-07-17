export const getLetterGrade = (numericGrade) => {
  if (numericGrade >= 97) return 'A+';
  if (numericGrade >= 93) return 'A';
  if (numericGrade >= 90) return 'A-';
  if (numericGrade >= 87) return 'B+';
  if (numericGrade >= 83) return 'B';
  if (numericGrade >= 80) return 'B-';
  if (numericGrade >= 77) return 'C+';
  if (numericGrade >= 73) return 'C';
  if (numericGrade >= 70) return 'C-';
  if (numericGrade >= 67) return 'D+';
  if (numericGrade >= 60) return 'D';
  return 'F';
};

export const getStudentEnrolledCourses = (profileData) => {
  if (!profileData || !profileData.enrollments) return [];
  return profileData.enrollments.map(enrollment => ({
    value: enrollment.courseCode,
    label: `${enrollment.courseCode} - ${enrollment.courseName}`
  }));
};