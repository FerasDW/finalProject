// src/Static/SidebarList.js
import {
  Home,
  BookOpen,
  GraduationCap,
  UserCog,
  Calendar,
  Mail,
  Users,
  BarChart2,
  Settings,
  LogOut,
  Layers,
  Zap,
  Sparkles,
  Video,
  Edit3,
  ClipboardCheck,
} from "lucide-react";
import maleFace1 from "../Assets/Images/Logo/PNG/maleFace1.png";
import maleFace2 from "../Assets/Images/Logo/PNG/maleFace2.png";
import femaleFace1 from "../Assets/Images/Logo/PNG/femaleFace1.png";
import femaleFace2 from "../Assets/Images/Logo/PNG/femaleFace2.png";

// menu item of the 3 users in dashboard
export const leftMenuItems = {
  // Admin left sidebar menu
  1100: [
    { title: "Home", icon: <Home /> },
    { title: "Courses", icon: <BookOpen /> },
    { title: "Lecturers", icon: <UserCog /> }, // 👨‍🏫 Updated to UserCog for lecturers
    { title: "Students", icon: <GraduationCap /> }, // 🎓 Updated to GraduationCap for students
    { title: "Calendar", icon: <Calendar /> },
    { title: "Messages", icon: <Mail /> },
    { title: "Community", icon: <Users /> },
    { title: "Statistics", icon: <BarChart2 /> },
  ],

  // Lecturer Student left sidebar menu
  1200: [
    { title: "Home", icon: <Home /> },
    { title: "Courses", icon: <BookOpen /> },
    { title: "Calendar", icon: <Calendar /> },
    { title: "Messages", icon: <Mail /> },
    { title: "Community", icon: <Users /> },
    { title: "Video Meeting", icon: <Video /> },
    { title: "Text Editor", icon: <Edit3 /> },
    { title: "Assignments And Tests", icon: <ClipboardCheck /> },
  ],

  // Student left sidebar menu
  1300: [
    { title: "Home", icon: <Home /> },
    { title: "Courses", icon: <BookOpen /> },
    { title: "Calendar", icon: <Calendar /> },
    { title: "Messages", icon: <Mail /> },
    { title: "Community", icon: <Users /> },
    { title: "Video Meeting", icon: <Video /> },
    { title: "Assignments And Tests Grades", icon: <ClipboardCheck /> },
  ],
};
