import "../../../../CSS/Dashboard/ScrollList.css";
import ScrollListItem from "./ScrollListItem";
import CourseCard from "../../Courses/CourseCard/CourseCard";
import CalendarItem from "./CalendarItem";
import { BiBorderLeft } from "react-icons/bi";

// sort the data based on the sortBy value
const ScrollList = ({ data, direction, type, sortBy, title, icon }) => {
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
      <div className="header">
        {title && <div className="title">{<span>{title}</span>}</div>}
        {icon && <div className="icon">{icon}</div>}
      </div>

      {sortedData.map((item) =>
        type === "card" ? (
          <CourseCard key={item.id} cardInfo={item} />
        ) : type==="calendar"?(
          <CalendarItem key={item.id} item={item} style={{
            borderLeft: item.type === "test" ? "10px solid rgb(170, 168, 253)" : "10px solid rgb(255, 247, 160)",
          }} />
        ):<ScrollListItem key={item.id} item={item}  />
      )}
    </div>
  );
};

export default ScrollList;
