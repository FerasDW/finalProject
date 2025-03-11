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
import { rightMenuItems, leftMenuItems } from "../../../../Static/SidebarList";
import Sidebar from "../Sidebar/Sidebar";
import ScrollList from "../ScrollList/ScrollList";

const Content = ({ userRole }) => {
  const upcomingAssignments = [
    { id: 1, title: "Math Homework", date: "2025-03-15" },
    { id: 2, title: "Science Report", date: "2025-03-12" },
    { id: 3, title: "History Essay", date: "2025-03-10" },
    { id: 4, title: "Math Homework", date: "2025-03-15" },
    { id: 5, title: "Science Report", date: "2025-03-12" },
    { id: 6, title: "History Essay", date: "2025-03-10" },
    { id: 1, title: "Math Homework", date: "2025-03-15" },
    { id: 2, title: "Science Report", date: "2025-03-12" },
    { id: 3, title: "History Essay", date: "2025-03-10" },
    { id: 4, title: "Math Homework", date: "2025-03-15" },
    { id: 5, title: "Science Report", date: "2025-03-12" },
    { id: 6, title: "History Essay", date: "2025-03-10" },
  ];

  const sampleData = [
    {
      country: "AD",
      "hot dog": 137,
      "hot dogColor": "hsl(17, 70%, 50%)",
      burger: 96,
      burgerColor: "hsl(279, 70%, 50%)",
      sandwich: 72,
      sandwichColor: "hsl(220, 70%, 50%)",
      kebab: 140,
      kebabColor: "hsl(24, 70%, 50%)",
      fries: 88,
      friesColor: "hsl(316, 70%, 50%)",
      donut: 49,
      donutColor: "hsl(127, 70%, 50%)",
    },
  ];
  const contentConfig = {
    admin: (
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
    student: (
      <>
        <div className="row">
          <Box
            title="Total Enrolled Courses"
            contentBox="5 Courses"
            boxLink="View entire course list"
            image={coursesImg}
            bgColor="#cffccc"
            gridRow="span 6"
          />
          <Box
            title="Grades & Evaluations"
            contentBox="3 Assignments Due"
            boxLink="View entire grades list"
            image={gradeImg}
            bgColor="#fffccc"
            gridRow="span 6"
          />
          <Box
            title="Recent Notifications"
            contentBox="You have new messages."
            boxLink="View all notifications"
            image={notificationImg}
            bgColor="#ffcccc"
            gridRow="span 6"
          />
        </div>

        <div className="row">
          <Box
            title="Student Performance Analysis"
            chart={<BarChart data={sampleData} />}
            image={img3}
            gridColumn="span 8"
            gridRow="span 4"
          />
          <Box
            title="Upcoming Assignments"
            assignments={<ScrollList assignments={upcomingAssignments} />}
            gridRow="span 4"
          />
        </div>

               {/* row 3 */}
       <div className="row">
         <Box
           title="Test"
           contentBox="This is a test1"
           image={img}
           gridRow="span 10"
         />
         <Box
           title="Test"
           contentBox="This is a test2"
           image={img}
           gridColumn="span 8"
           gridRow="span 10"
          

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

export default Content

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
