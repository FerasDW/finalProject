import "../../../../CSS/Pages/Dashboard/Content.css";
import CourseCard from "../CourseCard/CourseCard";

const CoursesContent = ({ 
  courses, 
  onDeleteCourse, 
  onEditCourse, 
  userRole 
}) => {
  // --- 1. Get the current calendar year ---
  const currentYear = new Date().getFullYear();
  
  // Simple check: only admin (role 1100) can edit/delete
  const isAdmin = userRole === "1100";
  
  return (
    <div className="courses-grid">
      {courses && courses.length > 0 ? (
        courses.map((course) => {
          
          // --- 2. Find the specific enrollment object for the current year ---
          const currentYearEnrollment = course.enrollments?.find(
            (enrollment) => enrollment.academicYear === currentYear
          );
          
          // --- 3. Get the count from that object, or default to 0 ---
          const studentCount = currentYearEnrollment?.studentIds?.length || 0;
          
          return (
            <CourseCard
              key={course.id}
              cardInfo={{
                id: course.id,
                title: course.name,
                // --- 4. Use the correctly calculated student count for current year ---
                students: studentCount,
                img: course.imageUrl,
                credits: course.credits || 0,
                lessons: course.lessons || 12, // Assuming 'lessons' is a static value for now
                description: course.description,
                code: course.code,
                department: course.department,
                ...course
              }}
              onDelete={onDeleteCourse}
              onEdit={onEditCourse}
              userRole={userRole}
              isAdmin={isAdmin}
            />
          );
        })
      ) : (
        <p>No courses found.</p> // Added a message for the empty state
      )}
    </div>
  );
};

export default CoursesContent;