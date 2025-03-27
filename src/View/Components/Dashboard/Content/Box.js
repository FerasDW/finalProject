import "../../../../CSS/Dashboard/Box.css";
import React from "react";

const Box = ({
  title,
  subtitle,
  contentBox,
  image,
  chart,
  boxLink,
  assignments,
  card,
  bgImage,
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
        {subtitle && <div className="box-subtitle">{subtitle}</div>}
        <div className="box-content">
          {contentBox}
          {assignments && <div className="box-assignments">{assignments}</div>}
          {card && <div className="box-card">{card}</div>}
          {chart && <div className="box-chart">{chart}</div>}
          {bgImage && <div className="box-bg-image">{bgImage}</div>}
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
