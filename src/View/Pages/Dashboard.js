import Sidebar from "../Components/Dashboard/Sidebar/Sidebar";
import Content from "../Components/Dashboard/Content/content";
import Topbar from "../Components/Dashboard/Topbar/Topbar";
import { leftMenuItems, rightMenuItems } from "../../Static/SidebarList";
export default function Dashboard({ userRole }) {
  return (
<div className="body" style={{ height: "100vh" }}>
      <div className="dashboard" style={{ display: "flex", height: "100%" }}>
        
        <Sidebar menuItems={leftMenuItems} position="left" />
        <div
          className="main"
          style={{ 
            display: "flex", 
            flexDirection: "column", 
            width: "100%",
            height: "100%",
            overflow: "hidden"
          }}
        >
          <Topbar />
          <Content />
        </div>
        <Sidebar menuItems={rightMenuItems} position="right" />
      </div>
    </div>
  );
}
