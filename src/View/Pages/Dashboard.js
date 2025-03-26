import DashboardContent from "../Components/Dashboard/Content/DashboardContent.js";
import "../../CSS/Dashboard/Dashboard.css";

import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext.js";

export default function Dashboard() {

  const { authData, loading } = useContext(AuthContext);
  if (loading) return <p>Loading...</p>;
  // if (!authData) return <p>You must be logged in to view this page.</p>;

  return (
    <div className="dashboard">
      {/* <DashboardContent userRole={authData.role} /> */}
      <DashboardContent userRole={"1100"} />
    </div>
  );
}