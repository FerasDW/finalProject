import React from "react";
import ExpandableList from "./ExpandableList";
import { assignments } from "../../../Static/coursePageData";

const AssignmentManagement = () => {
  return (
    <div className="assignment-management">
      <ExpandableList
        title="Assignments & Exams"
        data={assignments}
        renderItem={(item) => (
          <div>{item.content}</div>
        )}
      />
    </div>
  );
};

export default AssignmentManagement;
