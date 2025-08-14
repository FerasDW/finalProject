// import Sidebar from "../Components/Dashboard/Sidebar/Sidebar.jsx";
// import Topbar from "../Components/Dashboard/Topbar/Topbar.jsx";
// import { leftMenuItems } from "../../Static/SidebarList.js";
// import { AuthContext } from "../../Context/AuthContext.jsx";
// import { useContext, useEffect, useState } from "react";
// import { Outlet } from "react-router-dom";
// import Loader from "../Pages/Global/Loading.jsx";
// import ChatUI from "../Components/Forms/ChatBot.jsx";
// import axios from "axios";
// import "../../CSS/MainLayout.css";
// import { useChat } from "../../Context/ChatContext.jsx";

// export default function MainLayout() {
//   const { authData, loading } = useContext(AuthContext);
//   const [adminUsers, setAdminUsers] = useState([]);
//   const [studentUsers, setStudentUsers] = useState([]);
//   const [lecturerUsers, setLecturerUsers] = useState([]);
//   const { unreadMessages } = useChat();

//   useEffect(() => {
//     if (!authData) return;

//     const fetchUsers = async () => {
//       try {
//         const [students, lecturers, admins] = await Promise.all([
//           axios.get("http://localhost:8080/api/users/students", {
//             withCredentials: true,
//           }),
//           axios.get("http://localhost:8080/api/users/lecturers", {
//             withCredentials: true,
//           }),
//           axios.get("http://localhost:8080/api/users/admins", {
//             withCredentials: true,
//           }),
//         ]);

//         setStudentUsers(students.data);
//         setLecturerUsers(lecturers.data);
//         setAdminUsers(admins.data);
//       } catch (err) {
//         console.error("Failed to fetch users", err);
//       }
//     };

//     fetchUsers();
//   }, [authData]);

//   if (loading || !authData) return <Loader />;

//   // Function to get right sidebars based on role
//   const getRightContacts = () => {
//     const role = authData.role;

//     switch (role) {
//       case "1100": // Admin
//         return [lecturerUsers, studentUsers];
//       case "1200": // Lecturer
//         return [adminUsers, studentUsers];
//       case "1300": // Student
//         return [adminUsers, lecturerUsers];
//       default:
//         return [[], []];
//     }
//   };

//   const [sidebar1Contacts, sidebar2Contacts] = getRightContacts();

//   return (
//     <div className="body">
//       <div className="main-layout">
//         <div className="left-sidebar">
//           <Sidebar menuItems={leftMenuItems[authData.role]} position="left" />
//         </div>

//         <div className="main">
//           <Topbar />
//           <Outlet />
//           <ChatUI />
//         </div>

//         <div className="right-sidebar">
//           <Sidebar
//             menuItems={sidebar1Contacts.map((user) => ({
//               id: user.id,
//               title: (
//                 <div className="chat-contact-title">
//                   {user.username}
//                   {unreadMessages[user.id] > 0 && (
//                     <span className="chat-unread-badge">
//                       {unreadMessages[user.id]}
//                     </span>
//                   )}
//                 </div>
//               ),

//               icon: (
//                 <img
//                   src={user.profilePicture}
//                   alt={user.username}
//                   className="chat-profile-pic"
//                   />
//               ),
//             }))}
//             position="right"
//             currentUserId={authData.id}
//           />
//           <Sidebar
//             menuItems={sidebar2Contacts.map((user) => ({
//               id: user.id,
//               title: (
//                 <div className="chat-contact-title">
//                   <span className="username">{user.username}</span>
//                   {unreadMessages[user.id] > 0 && (
//                     <span className="chat-unread-badge">
//                       {unreadMessages[user.id]}
//                     </span>
//                   )}
//                 </div>
//               ),

//               icon: (
//                 <img
//                   src={user.profilePicture}
//                   alt={user.username}
//                   className="chat-profile-pic"
//                   />
//               ),
//             }))}
//             position="right"
//             currentUserId={authData.id}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
import Sidebar from "../Components/Dashboard/Sidebar/Sidebar.jsx";
import Topbar from "../Components/Dashboard/Topbar/Topbar.jsx";
import { leftMenuItems, rightMenuItems } from "../../Static/SidebarList.js";
import { AuthContext } from "../../Context/AuthContext.jsx";
import { useContext } from "react";
import { Outlet } from "react-router-dom";
import "../../CSS/Components/Global/MainLayout.css";
import Loader from "../Pages/Global/Loading.jsx";
import ChatUI from "../Components/Forms/ChatBot.jsx";


export default function MainLayout() {
  const { authData, loading } = useContext(AuthContext);
  if (loading) return <Loader />


  return (
    <div className="body" > 
      <div className="main-layout">
        <div className="left-sidebar">
          <Sidebar menuItems={leftMenuItems[authData.role]} position="left" />
        </div>

        <div className="main" >
          <Topbar />
          <Outlet />
          <ChatUI/>
        </div>

        <div className="right-sidebar">
          <Sidebar menuItems={rightMenuItems} position="right" />
          <Sidebar menuItems={rightMenuItems} position="right" />
        </div>
      </div>
    </div>
  );
}