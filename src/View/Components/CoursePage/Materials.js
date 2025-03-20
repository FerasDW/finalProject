import React from "react";
import ExpandableList from "./ExpandableList";
import { courseMaterials } from "../../../Static/coursePageData";

const Materials = () => {
  return (
    <div className="course-materials">
      <ExpandableList
        title="Course Materials"
        data={courseMaterials}
        renderItem={(item) => (
          <ul>
            {item.files.map((file, fileIndex) => (
              <li key={fileIndex} className="file-item">
                <a href={file.link} download>{file.title}</a>
              </li>
            ))}
          </ul>
        )}
      />
    </div>
  );
};

export default Materials;
