import "../../../../CSS/Dashboard/ScrollList.css";
const ScrollListItem = ({ assignment }) => {
    return (
        <div className="scroll-list-item">
            <div className="assignment-name">{assignment.title}</div>
            <div className="assignment-date">{assignment.date}</div>
            <button className="assignment-button">View</button>
        </div>
    );
}
export default ScrollListItem