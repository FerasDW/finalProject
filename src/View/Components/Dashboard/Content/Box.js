import "../../../../CSS/Dashboard/Box.css"
import React from "react";

const Box = ({
  title,
  contentBox,
  image,
  bgColor = "#fff",
  gridColumn = "span 4",
  gridRow = "span 10",
  display = "flex",
  alignItems = "center",
  justifyContent = "column",
}) => {
  return (
    <div
      className="box-component"
      style={{
        display: display,
        alignItems: alignItems,
        justifyContent: justifyContent,
        gridColumn: gridColumn,
        gridRow: gridRow,
        backgroundColor: bgColor,
      }}
    >
      {/* Title, content, span, and image */}
      <div className="box-content">
        <div className="box-title">{title}</div>
        <div>{contentBox}</div>
        <a href="#" className="box-link">View entire list</a>
      </div>
      <img src={image} alt="Illustration" className="box-image"/>
    </div>
  );
};

export default Box;