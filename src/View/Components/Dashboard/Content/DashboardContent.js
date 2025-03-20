import React from "react";
import Box from "./Box";
import "../../../../CSS/Dashboard/Content.css";
import img from "../../../../Assets/Images/Logo/PNG/LogoMonogram.png";
import img3 from "../../../../Assets/Images/Logo/PNG/statistic.png";
import img4 from "../../../../Assets/Images/Logo/PNG/award.png";
import img5 from "../../../../Assets/Images/Logo/PNG/library.png";
import gradeImg from "../../../../Assets/Images/Logo/PNG/grade.png";
import notificationImg from "../../../../Assets/Images/Logo/PNG/notification.png";
import coursesImg from "../../../../Assets/Images/Logo/PNG/courses.png";
import BarChart from "../../Charts/barChart";
import ScrollList from "../ScrollList/ScrollList";
import PieChart from "../../Charts/pieCharts";
import LineChart from "../../Charts/lineChart";
import EventCalendar from "../../Calendar/EventCalendar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { sampleData, upcomingAssignments, lineChartData, educationdata } from "../../../../Static/dashboardData";

const DashboardContent = ({ userRole }) => {
  
  const contentConfig = {

    admin: (
      <>
        <div className="row">
          <Box
            title="Total Enrolled Courses"
            subtitle="5 Courses"
            boxLink="View entire course list"
            image={coursesImg}
            bgColor="#cffccc"
            gridRow="span 8"
          />
          <Box
            title="Grades & Evaluations"
            subtitle="3 Assignments Due"
            boxLink="View entire grades list"
            image={gradeImg}
            bgColor="#fffccc"
            gridRow="span 8"
          />
          <Box
            title="Recent Notifications"
            subtitle="You have new messages."
            boxLink="View all notifications"
            image={notificationImg}
            bgColor="#ffcccc"
            gridRow="span 8"
          />
        </div>

        <div className="row">
          <Box
            title="Student Performance Analysis"
            chart={<BarChart data={sampleData} />}
            // image={img3}
            gridColumn="span 8"
            gridRow="span 3"
          />
          <Box
            assignments={
              <ScrollList
                icon={<FontAwesomeIcon icon={faPlus} />}
                title="Upcoming Assignments"
                data={upcomingAssignments}
                direction="column"
                type="list"
              />
            }
            gridRow="span 3"
          />
        </div>

        {/* row 3 */}
        <div className="row">
          <Box
            title="Education Distribution"
            chart={<PieChart data={educationdata} />}
            gridRow="span 8"
          />
          <Box
            title="Academic Calendar"
            chart={<LineChart data={lineChartData}/>}
            gridColumn="span 8"
            gridRow="span 8"
          />
        </div>
      </>
    ),
    student: (
      <>
        <div className="row">
          <Box
            title="User Management"
            contentBox="Manage users and their permissions."
            boxLink="Go to user management"
            image={img}
            bgColor="#cffccc"
            gridRow="span 6"
          />
          <Box
            title="System Reports"
            contentBox="View detailed system reports."
            boxLink="View reports"
            image={img3}
            bgColor="#fffccc"
            gridRow="span 6"
          />
        </div>
      </>
    ),
    lecturer: (
      <>
        <div className="row">
          <Box
            title="Class Management"
            contentBox="Manage your classes and schedules."
            boxLink="Go to class management"
            image={img}
            bgColor="#cffccc"
            gridRow="span 6"
          />
          <Box
            title="Student Performance"
            chart={<BarChart data={sampleData} />}
            image={img3}
            gridColumn="span 8"
            gridRow="span 4"
          />
        </div>
      </>
    ),
  };

  return (
    <div className="content">
      {contentConfig[userRole] || <p>No content available for this role.</p>}
    </div>
  );
};

export default DashboardContent;

//   return (
//     <div className="content">
//       {/* row 1 */}
//       <div className="row">
//         <Box
//           title="Total Enrolled Courses"
//           contentBox="5 Courses"
//           boxLink="View entire course list"
//           image={coursesImg}
//           bgColor="#cffccc"
//           gridRow="span 6"
//         />
//         <Box
//           title="Grades & Evaluations"
//           contentBox="3 Assignments Due"
//           boxLink="View entire grades list"
//           image={gradeImg}
//           bgColor="#fffccc"
//           gridRow="span 6"
//         />
//         <Box
//           title="Recent Notifications"
//           contentBox="This is a test3"
//           boxLink={"View all notifications"}
//           image={notificationImg}
//           bgColor="#ffcccc"
//           gridRow="span 6"
//         />
//       </div>

//       {/* row 2 */}
//       <div className="row">
//         <Box
//           title="Student Performance Analysis"
//           chart={<BarChart data={sampleData} />}
//           image={img3}
//           gridColumn="span 8"
//           gridRow="span 4"
//         />
//         <Box
//           title="Upcoming Assignments"
//           assignments={<ScrollList assignments={upcomingAssignments} />}
//           gridRow="span 4"
//         />
//       </div>

//       {/* row 3 */}
//       <div className="row">
//         <Box
//           title="Test"
//           contentBox="This is a test1"
//           image={img}
//           gridRow="span 10"
//         />
//         <Box
//           title="Test"
//           contentBox="This is a test2"
//           image={img}
//           gridColumn="span 8"
//           gridRow="span 10"

//         />
//       </div>
//     </div>
//   );
// };

// export default Content;
