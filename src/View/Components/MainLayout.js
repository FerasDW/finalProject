import Sidebar from "../Components/Dashboard/Sidebar/Sidebar.js";
import Topbar from "../Components/Dashboard/Topbar/Topbar.js";
import { leftMenuItems, rightMenuItems } from "../../Static/SidebarList.js";
import { AuthContext } from "../../Context/AuthContext.js";
import { useContext } from "react";
import { Outlet } from "react-router-dom";
import "../../CSS/MainLayout.css";
import Loader from "../Pages/Loading.js";

export default function MainLayout() {
  const { authData, loading } = useContext(AuthContext);
  if (loading) return <Loader />

  return (
    <div className="body">
      <div className="main-layout">
        <div className="left-sidebar">
          <Sidebar menuItems={leftMenuItems[1100]} position="left" />
        </div>

        <div className="main">
          <Topbar />
          <Outlet />
        </div>

        <div className="right-sidebar">
          <Sidebar menuItems={rightMenuItems} position="right" />
          <Sidebar menuItems={rightMenuItems} position="right" />
        </div>
      </div>
    </div>
  );
}
