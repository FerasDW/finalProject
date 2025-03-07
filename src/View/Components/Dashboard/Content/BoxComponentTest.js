import React from "react";

const BoxComponent = ({
  title,
  contentBox,
  image,
  bgColor = "#fff",
  gridColumn,
  gridRow,
  display = "flex",
  alignItems = "center",
  justifyContent = "space-between",
  customStyle = {},
}) => {
  return (
    <div
      className="box-component"
      style={{
        display: display,
        alignItems: alignItems,
        justifyContent: justifyContent,
        gridColumn: gridColumn || "span 4",
        gridRow: gridRow || "auto",
        backgroundColor: bgColor,
        padding: "20px",
        borderRadius: "20px",
        textAlign: "left",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        position: "relative",
        overflow: "hidden",
        ...customStyle, // allow for custom styles to be passed in
      }}
    >

      {/* Title, content, and view entire list */}
      <div style={{ flex: 1 }}>
        <h2 style={{ margin: 0, fontSize: "18px" }}>{title}</h2>
        <p style={{ fontSize: "32px", fontWeight: "bold", margin: "5px 0" }}>
          {contentBox}
        </p>
        <a href="#" style={{ color: "black", textDecoration: "underline" }}>
          View entire list
        </a>
      </div>

      {/* Image */}
      {image && (
        <img
          src={image}
          alt="Illustration"
          style={{
            maxWidth: "120px",
            height: "auto",
            objectFit: "contain",
            position: "absolute",
            right: "10px",
            bottom: "10px",
          }}
        />
      )}
    </div>
  );
};

export default BoxComponent;
