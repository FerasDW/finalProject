import DashboardContent from "../../Components/Dashboard/Content/DashboardContent.jsx";
import "../../../CSS/Dashboard/Dashboard.css";
import { AuthContext } from "../../../Context/AuthContext.jsx";
import { useContext } from "react";

import Loader from "./Loading.jsx";
export default function Dashboard({ userRole }) {
  const { authData, loading } = useContext(AuthContext);
  if (loading) return <Loader />;
  return (
    <div className="dashboard">
      <DashboardContent userRole={"1100"} />  {/* ✅ Pass the userRole prop */}  
    </div>
  );
}