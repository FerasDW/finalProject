import Sidebar from "../Components/Dashboard/Sidebar/Sidebar.js";
import Content from "../Components/Dashboard/Content/Content.js";
import Topbar from "../Components/Dashboard/Topbar/Topbar.js";
import "../../CSS/Dashboard/Dashboard.css"
import { leftMenuItems, rightMenuItems } from "../../Static/SidebarList.js";
export default function Dashboard({ userRole }) {
  return (
<div className="body">
      <div className="dashboard" >
        <Sidebar menuItems={leftMenuItems} position="left" />
        <div className="main">
          <Topbar />
          <Content />
        </div>
        <Sidebar menuItems={rightMenuItems} position="right" />
      </div>
    </div>
  );
}
