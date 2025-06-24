// importing Main Layout and its pages
import { Routes, Route } from "react-router-dom";
import Login from "../View/Pages/Auth/login.jsx";
import MainLayout from "../View/Components/MainLayout.jsx";
import Dashboard from "../View/Pages/Global/Dashboard.jsx";
import Courses from "../View/Pages/Courses/Courses.jsx";
import CoursePage from "../View/Pages/Courses/CoursePage.jsx";
import Lecturers from "../View/Pages/Lecturer/LecturersInfoDashboard.jsx";
import Students from "../View/Pages/Student/StudentInfoDashboard.jsx";
import Calendar from "../View/Pages/Global/Calendar.jsx";
import Messages from "../View/Pages/Global/Messages.jsx";
import Statistics from "../View/Pages/Admin/AdminReportPage.jsx";
import Portfolio from "../View/Pages/UserProfile/Portfolio.jsx";
import StudentProfile from "../View/Pages/Student/StudentProfile.jsx";

// Importing Community Layout and its pages
import CommunityLayout from "../View/Components/CommunityLayout.jsx";
import Home from "../View/Pages/Community/Home.jsx";
import Profile from "../View/Pages/Community/Profile.jsx";
import Friends from "../View/Pages/Community/Friends.jsx";
import Groups from "../View/Pages/Community/Groups.jsx";
import GroupPage from "../View/Pages/Community/GroupPage.jsx";
import JobBoard from "../View/Pages/Community/JobBoard.jsx";
import MyCV from "../View/Pages/Community/MyCV.jsx";
import SavedPosts from "../View/Pages/Community/SavedPosts.jsx";
import NotFoundPage from "../View/Pages/Errors/404.jsx";
import ProfileA from "../View/Pages/UserProfile/Profile.jsx";

import { SavedPostsProvider } from "../Context/SavedPostsContext.jsx";
import { FollowProvider } from "../Context/FollowContext.jsx";
import { FriendProvider } from "../Context/FriendContext.jsx";

import Notifications from "../View/Pages/Notifications.jsx";
import ProtectedRoute from "./ProtectedRoute";


function GlobalRoutes() {
  return (
    <Routes>
      {/* Public route (Login) */}
      <Route path="/" element={<Login />} />
      <Route path="/pageNotFound" element={<NotFoundPage />} />

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
        <Route path="/Lecturers" element={<Lecturers />} />
        <Route path="/Students" element={<Students />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/portfolio" element={<Portfolio />} /> 
        {/* <Route path="/coursepage" element={<CoursePage />} /> */}
        <Route path="/course/:id" element={<CoursePage />} />
        <Route path="/profileA" element={<ProfileA />} />
        <Route path="/Messages" element={<Messages />} />
        <Route path="/StudentProfile" element={<StudentProfile />} />

        <Route path="/notifications" element={<Notifications />} />

      </Route>

      {/* Protected routes under CommunityLayout */}
      <Route
        element={
          // <ProtectedRoute>
          <SavedPostsProvider>
            <FollowProvider>
              <FriendProvider>
                <CommunityLayout />
              </FriendProvider>
            </FollowProvider>
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
        <Route path="/community/saved-posts" element={<SavedPosts />} />
      </Route>
    </Routes>
  );
}
export default GlobalRoutes;
