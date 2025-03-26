import React from "react";
import { enrolledStudentsData } from "../../../Static/coursePageData";

const EnrolledStudents = () => {
  return (
    <div className="course-details-container">
      <table className="course-details-table">
        <tbody>
          <tr>
            <td><strong>{enrolledStudentsData.label}:</strong></td>
            <td>{enrolledStudentsData.value}</td>
            <td>
              <button className="lecturer-button">{enrolledStudentsData.buttonText}</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EnrolledStudents;
