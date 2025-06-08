import "../../../../CSS/Dashboard/Content.css";
import CourseCard from "../CourseCard/CourseCard";

const CoursesContent = ({ courses, onDeleteCourse, onEditCourse }) => {
  return (
    <div className="courses-grid">
      {courses.length > 0 ? (
        courses.map((course) => (
          <CourseCard
            key={course.id}
            cardInfo={{
              id: course.id,
              code: course.code,
              title: course.title,
              students: course.students,
              rating: course.rating,
              lessons: course.lessons,
              img: course.img,
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