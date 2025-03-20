import "../../../../CSS/Dashboard/Content.css";
import CourseCard from "../CourseCard/CourseCard";

const CourseContent = ({ courses }) => {
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
              Students: course.students,
              Rating: course.rating,
              Lessons: course.lessons,
            }}
          />
        ))
      ) : (
        <p>No courses found</p>
      )}
    </div>
  );
};

export default CourseContent;