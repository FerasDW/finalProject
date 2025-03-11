import "../../../../CSS/Dashboard/Box.css";
import React from "react";

const Box = ({
  title,
  contentBox,
  image,
  chart,
  boxLink,
  assignments,
  bgColor = "#fff",
  gridColumn = "span 4",
  gridRow,
  // display = "flex",
  // alignItems = "center",
  // justifyContent = "column",
}) => {
  return (
    <div
      className="box-component"
      style={{
        // display: display,
        // alignItems: alignItems,
        // justifyContent: justifyContent,
        gridColumn: gridColumn,
        gridRow: gridRow,
        backgroundColor: bgColor,
        // padding: "20px",
      }}
    >
      <div className="box-info">
        <div className="box-title">{title}</div>

        <div className="box-content">
          {contentBox && <div className="box-subtitle">{contentBox}</div>}
          {assignments && <div className="box-assignments">{assignments}</div>}
          {chart && <div className="box-chart">{chart}</div>}
        </div>

        {boxLink && (
          <a href="#" className="box-link">
            {boxLink}
          </a>
        )}

        {image && <img src={image} alt="Illustration" className="box-image" />}
      </div>

      {/* Title, content, span, and image */}
      {/* <div className="box-content">
        <div className="box-info">
          <div className="box-title">{title}</div>
          <div className="box-subtitle">{contentBox || chart}</div>
          <a href="#" className="box-link">
            {boxLink}
          </a>
        </div>
        <div className="box-image">
          <img src={image} alt="Illustration" className="box-image" />
        </div>
      </div> */}
    </div>
  );
};

export default Box;
