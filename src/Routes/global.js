import { Routes, Route } from "react-router-dom";
import Login from "../View/Pages/Auth/login.js";
import Dashboard from "../View/Pages/Dashboard.js";
import Courses from "../View/Pages/Courses.js";
import CoursePage from "../View/Pages/CoursePage.js";
import MainLayout from "../View/Components/MainLayout.js";
import Profile from "../View/Pages/Profile.js";
import Settings from "../View/Pages/Settings.js";
import Calendar from "../View/Pages/Calendar.js";
import CommunityPage from "../View/Pages/CommunityPage.js";
import HomeworkSubmitting from "../View/Pages/HomeworkSubmitting.js";
function GlobalRoutes() {
  // const [userType, setUserType] = useState("student");

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/calendar" element={<Calendar />} />
        {/* <Route path="/message" element={<Message />} />
        <Route path="/statistics" element={<Statistics />} /> */}
        <Route path="/community" element={<CommunityPage userType={"admin"} />} />
        <Route path="homeworksubmitting" element={<HomeworkSubmitting />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/coursepage" element={<CoursePage />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
export default GlobalRoutes;

// function LayoutWithSidebar() {
//   return (
//     <div className=....}>
//       <Sidebar menuItems={leftMenuItems[1100]} position="left" />

//       <div style={{ flex: 1, padding: "20px" }}>
//         <Outlet />
//       </div>
//     </div>
//   );
// }
