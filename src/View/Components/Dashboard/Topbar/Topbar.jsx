import { Bell, User, Settings } from "react-feather";
import { useContext } from "react";
import { AuthContext } from "../../../../Context/AuthContext";
import "../../../../CSS/Dashboard/Topbar.css";

const Topbar = () => {
  const { authData, loading } = useContext(AuthContext);

  // Show loading state
  if (loading) {
    return (
      <div className="topbar">
        <div className="loading-skeleton">
          <div className="skeleton-text"></div>
          <div className="skeleton-icons">
            <div className="skeleton-icon"></div>
            <div className="skeleton-icon"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="user-info">
          <div className="user-avatar">
            <User size={20} />
          </div>
          <div className="user-details">
            <span className="username">
              {authData ? authData.username : "Guest"}
            </span>
            <span className="user-status">
              {authData ? "Online" : "Not logged in"}
            </span>
          </div>
        </div>
      </div>

      <div className="topbar-center">
        {/* Search removed */}
      </div>

      <div className="topbar-right">
        <div className="topbar-icons">
          <button className="icon-button notification-button" title="Notifications">
            <Bell size={20} />
            <span className="notification-badge">3</span>
          </button>
          
          <button className="icon-button" title="Settings">
            <Settings size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;