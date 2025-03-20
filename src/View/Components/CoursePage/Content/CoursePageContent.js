import React from "react";
import Box from "../../Dashboard/Content/Box";
import PieChart from "../../Charts/pieCharts";
import "../../../../CSS/CoursePage/CoursePage.css";
import Schedule from "../../Calendar/EventCalendar";
import StudentList from "../../../../Static/studentsList";
import Materials from "../Materials";
import Announcements from "../Announcements";
import AssignmentManagement from "../AssignmentManagement";
const CoursePageContent = ({ userRole }) => {
  const courseDetails = (
    <div className="course-details-container">
      <table className="course-details-table">
        <tbody>
          <tr>
            <td><strong>Course Code:</strong></td>
            <td>62187</td>
            <td><strong>Course Type:</strong></td>
            <td>Lecture</td>
          </tr>
          <tr>
            <td><strong>Course Title:</strong></td>
            <td>Mobile Application Development</td>
            <td><strong>Instructor:</strong></td>
            <td>
              <button className="lecturer-button">Dr. Badarna Murad</button>
            </td>
          </tr>
          <tr>
          <td><strong>Minimum Passing Grade:</strong></td>
          <td>56</td>
            <td><strong>Enrolled Students: 99</strong></td>
            <td>
              <button className="lecturer-button">view all</button>
            </td>            

          </tr>
          <tr>
            <td><strong>Class Timing:</strong></td>
            <td>Thursday 14:00 - 16:30</td>
            <td><strong>Location:</strong></td>
            <td>Room 7010, Emek Yezreel Campus</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
  const enrolledStudents = (
    <div className="course-details-container">
      <table className="course-details-table">
        <tbody>
          <tr>
            <td><strong>Enrollen Students:</strong></td>
            <td>100</td>
            <td>
              <button className="lecturer-button">view all</button>
            </td>
          </tr>

        </tbody>
      </table>
    </div>
  );
  

  const data = [
    { value: 70, color: "#4CAF50" },
    { value: 30, color: "#FFC107" },
  ];
  const contentConfig = {
    admin: (
      <>
        <div className="row">
          <Box title="Course Information" contentBox={courseDetails} gridRow="span 12" gridColumn="span 9" />
          <Box title="Progress studies percentage" chart={<PieChart data={data} />} bgColor="#cffccc" gridRow="span 12" gridColumn="span 3" />
        </div>
        <div className="row">
          <Box title="Course attendance percentage" chart={<PieChart data={data} />} bgColor="#cffccc" gridRow="span 12" gridColumn="span 3" />
          <Box title="Course Schedule" contentBox={<Schedule />} bgColor="#fffccc" gridColumn="span 9" gridRow="span 12" />
        </div>
        <div className="row">
        </div>
        <div className="row">
          <Box contentBox={<Materials />} bgColor="#ffcccc" gridColumn="span 3" gridRow="span 6" />
          <Box contentBox={<Announcements />} bgColor="#ffcccc" gridColumn="span 6" gridRow="span 6" />
          <Box contentBox={<AssignmentManagement />} bgColor="#ffcccc" gridColumn="span 3" gridRow="span 6" />

        </div>
        {/* <div className="row">
          <Box contentBox={<StudentList />} gridRow="span 30" bgColor="#e0e0e0"/>
        </div> */}
        
      </>
    ),
    student: (
      <>
        <div className="row">
          <Box title="Course Information" contentBox={courseDetails} gridRow="span 12" bgColor="#fffccc" gridColumn="span 12" />
        </div>
        <div className="row">
          <Box contentBox={<Announcements />} bgColor="#e0e0e0" gridColumn="span 6" gridRow="span 6" />
          <Box contentBox={<Materials />} bgColor="#f5f5f5" gridColumn="span 6" gridRow="span 6" />
        </div>
      </>
    ),
  };
  return (
    <div className="content">
      {contentConfig["admin"] || <p>No content available for this role.</p>}
    </div>
  );
};
//   return (
//     <div className="content">
//       <div className="row">
//         <Box
//           title="Course Information"
//           contentBox="This section contains detailed information about the course."
//           gridcolumn="span 20"
//           gridRow="span 10"
//         />
//         <Box
//           title="User Management"
//           contentBox="Manage users and their permissions."
//           boxLink="Go to user management"
//           bgColor="#cffccc"
//           gridcolumn="span 4"
//           gridRow="span 10"
//         />
//       </div>
//       <div className="row">
//         <Box
//           title="Course Information"
//           contentBox="This section contains detailed information about the course."
//           gridcolumn="span 8"
//           gridRow="span 10"
//         />
//         <Box
//           title="User Management"
//           contentBox="Manage users and their permissions."
//           boxLink="Go to user management"
//           bgColor="#cffccc"
//           gridcolumn="span 12"
//           gridRow="span 10"

//         />
//       </div>
//       <div className="row">
//         <Box
//           title="User Management"
//           contentBox="Manage users and their permissions."
//           boxLink="Go to user management"
//           bgColor="#cffccc"
//           gridcolumn="span 4"
//           gridRow="span 10"

//         />
//         <Box
//           title="User Management"
//           contentBox="Manage users and their permissions."
//           boxLink="Go to user management"
//           bgColor="#cffccc"
//           gridcolumn="span 4"
//           gridRow="span 10"

//         />
//         <Box
//           title="User Management"
//           contentBox="Manage users and their permissions."
//           boxLink="Go to user management"
//           bgColor="#cffccc"
//           gridcolumn="span 2"
//           gridRow="span 10"

//         />
//       </div>
//     </div>
//   );
// };
export default CoursePageContent;
