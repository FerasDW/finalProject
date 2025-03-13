import Sidebar from "../Components/Dashboard/Sidebar/Sidebar.js";
import DashboardContent from "../Components/Dashboard/Content/DashboardContent.js";
import Topbar from "../Components/Dashboard/Topbar/Topbar.js";
import "../../CSS/Dashboard/Dashboard.css";
import { leftMenuItems, rightMenuItems } from "../../Static/SidebarList.js";
import { AuthContext } from "../../Context/AuthContext.js";
import { useContext } from "react";

export default function Dashboard({ userRole }) {
  const { authData, loading } = useContext(AuthContext);
  if (loading) return <p className="header">Loading...</p>;
  return (
    // <div className="body">
      <div className="dashboard">
        {/* authData.role
        <div className="left-sidebar">
          <Sidebar menuItems={leftMenuItems[ 1100 ]} position="left" />
        </div> */}

        {/* <div className="main"> */}
          {/* <Topbar /> */}
          <DashboardContent userRole={"student"} /> {/*content[ authData.role ]*/}
        {/* </div> */}

        {/* <div className="right-sidebar">
          <Sidebar menuItems={rightMenuItems} position="right" />
          <Sidebar menuItems={rightMenuItems} position="right" />
        </div> */}

        {/* <div className="right-sidebarr">
          <div className="right-sidebar-top">
            <Sidebar menuItems={rightMenuItems} position="right" />
          </div>
          <div className="right-sidebar-bottom">
            <Sidebar menuItems={rightMenuItems} position="right" />
          </div>
        </div> */}
      </div>
    // </div>
  );
}
