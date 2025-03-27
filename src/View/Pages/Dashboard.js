import DashboardContent from "../Components/Dashboard/Content/DashboardContent.js";
import "../../CSS/Dashboard/Dashboard.css";

import { useContext } from "react";

import Loader from "./Loading.js";
export default function Dashboard({ userRole }) {
  const { authData, loading } = useContext(AuthContext);
  if (loading) return <Loader />;
  return (
    <div className="dashboard">
      
      <DashboardContent userRole={"admin"} />

    </div>
  );
}