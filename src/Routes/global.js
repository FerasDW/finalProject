import { Routes, Route } from "react-router-dom";
import Login from "../View/Pages/Auth/login.js";
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
import Friends from "../View/Pages/Community/Friends.jsx";
import Groups from "../View/Pages/Community/Groups.jsx";
import JobBoard from "../View/Pages/Community/JobBoard.jsx";
import MyCV from "../View/Pages/Community/MyCV.jsx";
import Applications from "../View/Pages/Community/Applications.jsx";
import SavedPosts from "../View/Pages/Community/SavedPosts.jsx";
import Challenges from "../View/Pages/Community/Challenges.jsx";
import MyBadges from "../View/Pages/Community/MyBadges.jsx";
import GroupPage from "../View/Pages/Community/GroupPage.jsx";

// import Statistics from "../View/Pages/Statistics.jsx";
import Statistics from "../View/Pages/AdminReportPage.jsx";

import ProtectedRoute from "./ProtectedRoute";
import { SavedPostsProvider } from "../Context/SavedPostsContext.js";

function GlobalRoutes() {
  return (
    <Routes>
      {/* Public route (Login) */}
      <Route path="/" element={<Login />} />

      {/* Protected routes under MainLayout */}
      <Route
        element={
          // <ProtectedRoute>
          <MainLayout />
          // </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/homeworksubmitting" element={<HomeworkSubmitting />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/coursepage" element={<CoursePage />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Protected routes under CommunityLayout */}
      <Route
        element={
          // <ProtectedRoute>
          <SavedPostsProvider>
            <CommunityLayout />
          </SavedPostsProvider>
          // </ProtectedRoute>
        }
      >
        <Route path="/community/home" element={<Home />} />
        <Route path="/community/profile/:userId" element={<Profile />} />
        <Route path="/community/friends" element={<Friends />} />
        <Route path="/community/groups" element={<Groups />} />
        <Route path="/groups/:groupId" element={<GroupPage />} />
        <Route path="/community/job-board" element={<JobBoard />} />
        <Route path="/community/my-cv" element={<MyCV />} />
        <Route path="/community/applications" element={<Applications />} />
        <Route path="/community/saved-posts" element={<SavedPosts />} />
        <Route path="/community/skill-challenges" element={<Challenges />} />
        <Route path="/community/my-badges" element={<MyBadges />} />
      </Route>
    </Routes>
  );
}

export default GlobalRoutes;
