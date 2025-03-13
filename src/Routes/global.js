import { Routes, Route } from "react-router-dom";
import Login from "../View/Pages/Auth/login.js";
import Dashboard from "../View/Pages/Dashboard.js";
import Courses from "../View/Pages/Courses.js";
import CoueseInfo from "../View/Pages/CourseInfo.js";
import MainLayout from "../View/Components/MainLayout.js";
function GlobalRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<MainLayout  />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/corseinfo" element={<CoueseInfo />} />

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
