import React from "react";
import ExpandableList from "./ExpandableList";
import { announcements } from "../../../Static/coursePageData";

const Announcements = () => {
  return (
    <div className="announcements">
      <ExpandableList
        title="Latest Announcements"
        data={announcements}
        renderItem={(item) => (
          <div className="announcement-content">
            {item.content}
          </div>
        )}
      />
    </div>
  );
};

export default Announcements;
