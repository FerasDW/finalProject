import { Moon, Sun, Bell, Search, User } from "react-feather";
import { useContext } from "react";
import { AuthContext } from "../../../../Context/AuthContext";
import "../../../../CSS/Dashboard/Topbar.css";
import SwitchMode from "../../Buttons/SwitchModeButton.js";
import SearchInput from "../../Buttons/SearchInput.js";
const Topbar = () => {
  const { authData, loading } = useContext(AuthContext); // ✅ Get loading state

  // ✅ If still loading, show nothing (or a loading spinner)
  if (loading) return <p className="header">Loading...</p>;
  console.log(authData);
  return (
    <div className="topbar">
      <div
        className="Username"
        style={{ display: "flex", flexDirection: "row" }}
      >
        <p>{authData ? authData.username : "Guest"}</p>
      </div>

      <div className="topbarIcons">
        {/* SEARCH BAR */}
        {/* <div>
          <SwitchMode />
        </div> */}
        {/* <SearchInput /> */}

        <SwitchMode />
        <Bell />
        <User />
      </div>
    </div>
  );
};

export default Topbar;
