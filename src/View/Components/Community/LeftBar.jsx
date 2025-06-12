import "../../../CSS/Components/Community/leftBar.scss";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  currentUser,
  leftBarMenuItems,
} from "../../../Static/communityData";
const LeftBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNameClick = (userId) => {
    // Navigate to user's profile
    navigate(`/community/profile/${userId}`);
  };
  return (
    <div className="leftBar">
      <div className="leftBarMenus">
        <div className="menu">
          <div
            onClick={() => handleNameClick(currentUser.id)}
            style={{ cursor: "pointer" }}
            className="user"
          >
            <img src={currentUser.profilePic} alt={currentUser.name} />
            <span>{currentUser.name}</span>
          </div>

          {leftBarMenuItems.map((item) => {
            const path = item.label.toLowerCase().replace(/\s+/g, "-");
            const fullPath = `/community/${path}`;
            const isActive = location.pathname === fullPath;

            return (
              <Link
                to={fullPath}
                key={item.id}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className={`item ${isActive ? "active" : ""}`}>
                  <img src={item.icon} alt={item.label} />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>

        <hr />
        <hr />
      </div>
    </div>
  );
};

export default LeftBar;
