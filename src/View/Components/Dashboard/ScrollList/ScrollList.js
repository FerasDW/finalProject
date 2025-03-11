import "../../../../CSS/Dashboard/ScrollList.css";
import ScrollListItem from "./ScrollListItem";
const ScrollList = ({ assignments }) => {
  const sortedAssignments = [...assignments].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  return (
    <div className="scroll-list">
      {sortedAssignments.map((assignment) => (
        <ScrollListItem key={assignment.id} assignment={assignment} />
      ))}
    </div>
  );
};

export default ScrollList;