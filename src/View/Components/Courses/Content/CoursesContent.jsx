import "../../../../CSS/Pages/Dashboard/Content.css";
import CourseCard from "../CourseCard/CourseCard";

const CoursesContent = ({ courses, onDeleteCourse, onEditCourse }) => {
  return (
    <div className="courses-grid">
      {courses && courses.length > 0 ? (
        courses.map((course) => (
          <CourseCard
            key={course.id}
            cardInfo={{
              id: course.id,
              title: course.name,
              students: course.enrollments?.reduce((total, enrollment) => total + (enrollment.studentIds?.length || 0), 0) || 0,
              img: course.imageUrl,
              credits: course.credits || 0,
              lessons: course.lessons || 12,
              description: course.description,
              code: course.code,
              department: course.department,
              ...course
            }}
            onDelete={onDeleteCourse}
            onEdit={onEditCourse}
          />
        ))
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default CoursesContent;