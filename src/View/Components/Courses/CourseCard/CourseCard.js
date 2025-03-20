import React from "react";
import "./CourseCard.css";
import DeleteButton from "../../Buttons/DeleteButton";
import EditButton from "../../Buttons/EditButton";
import { useNavigate } from "react-router-dom";
import { height, width } from "@fortawesome/free-solid-svg-icons/fa0";

const CourseCard = ({ cardInfo }) => {
  const navigate = useNavigate();
  const handleEdit = () => {
    // navigate(`/courses/${cardInfo.id}`);
    navigate("/coursepage", { state: { courseData: cardInfo } });
  };
  return (
    <div className="card">
      <div className="top-section">
        <div className="border"></div>
        <div className="icons">
          <div className="social-media">
            <EditButton onClick={handleEdit} />
            <DeleteButton style={{ height: "10px", width: "5px" }} />
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
