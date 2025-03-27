import React from "react";
import { courseDetailsData } from "../../../Static/coursePageData";

const CourseDetails = () => {
  return (
    <div className="course-details-container">
      <table className="course-details-table">
        <tbody>
          {courseDetailsData.map((item, index) => (
            index % 2 === 0 ? (
              <tr key={index}>
                <td><strong>{item.label}:</strong></td>
                <td>{item.isButton ? <button className="lecturer-button">{item.value}</button> : item.value}</td>
                {courseDetailsData[index + 1] && (
                  <>
                    <td className="split-border"><strong>{courseDetailsData[index + 1].label}:</strong></td>
                    <td>{courseDetailsData[index + 1].isButton ? <button className="lecturer-button">{courseDetailsData[index + 1].value}</button> : courseDetailsData[index + 1].value}</td>
                  </>
                )}
              </tr>
            ) : null
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseDetails;