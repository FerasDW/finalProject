import { Moon, Sun, Bell, Search, User } from "react-feather";
import { useContext } from "react";
import { AuthContext } from "../../../../Context/AuthContext";
import "../../../../CSS/Dashboard/Topbar.css";
const Topbar = () => {
  const { authData, loading } = useContext(AuthContext); // ✅ Get loading state

  // ✅ If still loading, show nothing (or a loading spinner)
  if (loading) return <p className="header">Loading...</p>;
  console.log(authData);
  return (
    <div className="topbar">
      <div className="Username">
        <p>{authData? authData.username : "Guest"}</p>
      </div>

      <div className="topbarIcons">
      {/* SEARCH BAR */}
      <Search />
      
      {/* ICONS */}
      <Moon />
      <Sun />
      <Bell />
      <User />
      </div>
    </div>
  );
};

export default Topbar;