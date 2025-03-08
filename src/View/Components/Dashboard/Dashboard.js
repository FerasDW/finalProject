import Sidebar from "./Sidebar/Sidebar.js";
import Content from "./Content/Content.js";
import Topbar from "./Topbar/Topbar.js";
import "../../../CSS/Dashboard/Dashboard.css"
import { leftMenuItems, rightMenuItems } from "../../../Static/SidebarList.js";
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
