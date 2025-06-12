import "../../../../CSS/Components/Courses/CourseCard.css";
import DeleteButton from "../../Buttons/DeleteButton";
import EditButton from "../../Buttons/EditButton";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ cardInfo, onDelete, onEdit }) => {
  const navigate = useNavigate();

  const handleCourseClick = () => {
    navigate(`/course/${cardInfo.id}`);
  };

  const handleEdit = () => {
  onEdit(cardInfo);
};

  const handleDelete = () => {
    // TODO: Replace this with API call in the future to delete from backend
    // fetch(`/api/courses/${cardInfo.id}`, { method: 'DELETE' }).then(...)
    onDelete(cardInfo.id);
  };

  return (
    <div className="card">
      <div className="top-section" style={{ backgroundImage: `url(${cardInfo.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="border"></div>
        {cardInfo.image && (
          <img
            src={cardInfo.image}
            alt={cardInfo.title}
            className="course-image"
          />
        )}
        <div className="icons">
          <div className="social-media">
            <EditButton onClick={handleEdit} />
            <DeleteButton onClick={handleDelete} />
          </div>
        </div>
      </div>

      <div className="bottom-section">
        <span 
          className="title course-title-clickable" 
          onClick={handleCourseClick}
          style={{ cursor: 'pointer' }}
        >
          {cardInfo.title}
        </span>
        <div className="row row1">
          <div className="item">
            <span className="big-text">{cardInfo.students}</span>
            <span className="regular-text">Students</span>
          </div>
          <div className="item">
            <span className="big-text">{cardInfo.rating}</span>
            <span className="regular-text">Rating</span>
          </div>
          <div className="item">
            <span className="big-text">{cardInfo.lessons}</span>
            <span className="regular-text">Lessons</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;