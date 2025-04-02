import React from "react";
import "./CourseCard.css";
import DeleteButton from "../../Buttons/DeleteButton";
import EditButton from "../../Buttons/EditButton";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ cardInfo, onDelete }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    // navigate(`/courses/${cardInfo.id}`);
    navigate("/coursepage", { state: { courseData: cardInfo } });
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
        <span className="title">{cardInfo.title}</span>
        <div className="row row1">
          <div className="item">
            <span className="big-text">{cardInfo.Students}</span>
            <span className="regular-text">Students</span>
          </div>
          <div className="item">
            <span className="big-text">{cardInfo.Rating}</span>
            <span className="regular-text">Rating</span>
          </div>
          <div className="item">
            <span className="big-text">{cardInfo.Lessons}</span>
            <span className="regular-text">Lessons</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
