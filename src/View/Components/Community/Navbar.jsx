import "../../../CSS/Components/Community/navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link, useNavigate } from "react-router-dom";
// import { useContext } from "react";
// import { DarkModeContext } from "../../context/darkModeContext";
// import { AuthContext } from "../../../../Context/AuthContext";

import { currentUser } from "../../../Static/communityData";

const Navbar = () => {
  // const { toggle, darkMode } = useContext(DarkModeContext);
  // const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();


  return (
    <div className="navbar">
      <div className="left">
        <Link to="/community/home" style={{ textDecoration: "none", color: "#5271ff"}}>
          <span>EduSphereSocial</span>
        </Link>
        <HomeOutlinedIcon onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }} />
        {/* <GridViewOutlinedIcon /> */}
        <div className="search">
          <SearchOutlinedIcon />
          <input type="text" placeholder="Search..." />
        </div>
      </div>
      <div className="right">
        <PersonOutlinedIcon />
        <EmailOutlinedIcon />
        <NotificationsOutlinedIcon />
        {/* <div className="user">
          <img src={currentUser.profilePic} alt={currentUser.name} />
          <span>{currentUser.name}</span>
        </div> */}
      </div>
    </div>
  );
};

export default Navbar;
