import { Routes, Route } from "react-router-dom";
import Login from "../View/Pages/Auth/logIn.js";
import Dashboard from "../View/Pages/Dashboard.js";
import Courses from "../View/Pages/Courses.js";
import CoursePage from "../View/Pages/CoursePage.js";
import MainLayout from "../View/Components/MainLayout.js";
import Settings from "../View/Pages/Settings.js";
import Calendar from "../View/Pages/Calendar.js";
import HomeworkSubmitting from "../View/Pages/HomeworkSubmitting.js";
import CommunityLayout from "../View/Components/CommunityLayout.js";
import Home from "../View/Pages/Community/Home.jsx";
import Profile from "../View/Pages/Community/Profile.jsx";

// import Statistics from "../View/Pages/Statistics.jsx";
import Statistics from "../View/Pages/AdminReportPage.jsx";

import ProtectedRoute from "./ProtectedRoute";
import NotFoundPage from "../View/Pages/Errors/404.jsx";
import Messages from "../View/Pages/messages.jsx";

function GlobalRoutes() {
  return (
    <Routes>
      {/* Public route (Login) */}
      <Route path="/" element={<Login />} />

      {/* Protected routes under MainLayout */}
      <Route element={
        // <ProtectedRoute>
          <MainLayout />
        // </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/homeworksubmitting" element={<HomeworkSubmitting />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/coursepage" element={<CoursePage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/pageNotFound" element={<NotFoundPage />} />
        <Route path="/Messages" element={<Messages />} />
        
      </Route>

      {/* Protected routes under CommunityLayout */}
      <Route element={
        // <ProtectedRoute>
          <CommunityLayout />
        // </ProtectedRoute>
      }>
        <Route path="/community/home" element={<Home />} />
        <Route path="/community/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default GlobalRoutes;
