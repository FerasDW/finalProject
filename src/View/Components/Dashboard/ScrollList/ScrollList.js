import "../../../../CSS/Dashboard/ScrollList.css";
import ScrollListItem from "./ScrollListItem";
import CourseCard from "../../Courses/CourseCard/CourseCard";

// sort the data based on the sortBy value
const ScrollList = ({ data, direction, type, sortBy }) => {
  const sortedData = [...data].sort((a, b) => {
    if (type === "card") {
      if (sortBy === "alphabetical" && a.title && b.title) {
        return a.title.localeCompare(b.title);
      }
    } else if (type === "assignment" && sortBy === "date") {
      if (a.date && b.date) {
        return new Date(a.date) - new Date(b.date);
      }
    }
    return 0;
  });

  return (
    <div className="scroll-list" style={{ flexDirection: direction }}>
      {sortedData.map((item) => (
        type === "card" ? (
          <CourseCard key={item.id} cardInfo={item} />
        ) : (
          <ScrollListItem key={item.id} item={item} />
        )
      ))}
    </div>
  );
};

export default ScrollList;
