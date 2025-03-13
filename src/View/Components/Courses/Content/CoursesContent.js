import Box from "../../Dashboard/Content/Box";
import ScrollList from "../../Dashboard/ScrollList/ScrollList";
import "../../../../CSS/Dashboard/Content.css";

const CourseContent = ({ userRole }) => {
  const coursesList = [
    {
      title: "Psychology",
      students: 12000,
      rating: 4.5,
      lessons: 50,
    },
    {
      title: "Marketing Basics",
      students: 15000,
      rating: 4.8,
      lessons: 60,
    },
    {
      title: "Graphic Design",
      students: 9000,
      rating: 4.3,
      lessons: 45,
    },
    {
      title: "Data Science",
      students: 18000,
      rating: 4.7,
      lessons: 55,
    },
    {
      title: "Business Management",
      students: 11000,
      rating: 4.6,
      lessons: 50,
    },
    {
      title: "Photography Basics",
      students: 13000,
      rating: 4.4,
      lessons: 40,
    },
    {
      title: "Creative Writing",
      students: 14000,
      rating: 4.2,
      lessons: 65,
    },
    {
      title: "Creative Writing",
      students: 14000,
      rating: 4.2,
      lessons: 65,
    },
    {
      title: "Creative Writing",
      students: 14000,
      rating: 4.2,
      lessons: 65,
    },
  ];

  return (
    <div className="row">
      <Box
        title="information System"
        gridRow="span 22"
        card={<ScrollList data={coursesList} direction="row" type="card" />}
        gridColumn="span 12"
      />
      <Box
        title="information System"
        gridRow="span 22"
        card={<ScrollList data={coursesList} direction="row" type="card" />}
        gridColumn="span 12"
      />
      <Box
        title="information System"
        gridRow="span 22"
        card={<ScrollList data={coursesList} direction="row" type="card" />}
        gridColumn="span 12"
      />
    </div>
    // <CourseCard cardInfo={coursesList} direction="row" />
  );
};

export default CourseContent;
