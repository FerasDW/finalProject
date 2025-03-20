import DashboardContent from "../Components/Dashboard/Content/DashboardContent.js";
import "../../CSS/Dashboard/Dashboard.css";
import { AuthContext } from "../../Context/AuthContext.js";
import { useContext } from "react";

export default function Dashboard({ userRole }) {
  const { authData, loading } = useContext(AuthContext);
  if (loading) return <p className="header">Loading...</p>;
  return (
    <div className="dashboard">
      <DashboardContent userRole={"admin"} />
    </div>
  );
}
//     <div className="body">
//       <div className="dashboard">
//         authData.role
//         <div className="left-sidebar">
//           <Sidebar menuItems={leftMenuItems[ 1100 ]} position="left" />
//         </div>

//         <div className="main">
//           <Topbar />
//           <DashboardContent userRole={"admin"} /> content[ authData.role ]
//         </div>

//         <div className="right-sidebar">
//           <Sidebar menuItems={rightMenuItems} position="right" />
//           <Sidebar menuItems={rightMenuItems} position="right" />
//         </div>

//         <div className="right-sidebarr">
//           <div className="right-sidebar-top">
//             <Sidebar menuItems={rightMenuItems} position="right" />
//           </div>
//           <div className="right-sidebar-bottom">
//             <Sidebar menuItems={rightMenuItems} position="right" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
