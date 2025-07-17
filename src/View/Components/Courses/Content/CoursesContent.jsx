import "../../../../CSS/Pages/Dashboard/Content.css";
import CourseCard from "../CourseCard/CourseCard";

const CoursesContent = ({ courses, onDeleteCourse, onEditCourse }) => {
  return (
    <div className="courses-grid">
      {courses.length > 0 ? (
        courses.map((course) => (
          <CourseCard
            key={course.id}
            cardInfo={{
              // Pass all course data based on your actual course structure
              id: course.id,
              code: course.code,
              title: course.title,
              students: course.students,
              rating: course.rating || null, // Optional, add if you have rating data
              lessons: course.lessons,
              img: course.img,
              year: course.year,
              semester: course.semester,
              group: course.group,
              academicYear: course.academicYear,
              lecturer: course.lecturer,
              description: course.description,
              selectable: course.selectable,
              createdAt: course.createdAt,
              updatedAt: course.updatedAt,
              credits: course.credits || 0, // Default to 0 if not provided
            }}
            onDelete={onDeleteCourse}
            onEdit={onEditCourse}
          />
        ))
      ) : (
        <p>No courses found</p>
      )}
    </div>
  );
};

export default CoursesContent;
