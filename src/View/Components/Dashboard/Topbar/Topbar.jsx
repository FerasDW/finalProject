// src/Components/Dashboard/Topbar/Topbar.jsx
import { Bell, User, Settings } from "react-feather";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../../../../Context/AuthContext";
import "../../../../CSS/Components/Global/Topbar.css";
import QuickActions from "./QuickAction.jsx";

const Topbar = () => {
  const { authData, loading } = useContext(AuthContext);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [imageError, setImageError] = useState(false);
  const dropdownRef = useRef(null);

  const toggleQuickActions = () => {
    setShowQuickActions(!showQuickActions);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowQuickActions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Reset image error when authData changes
  useEffect(() => {
    setImageError(false);
  }, [authData?.profilePic]);

  const handleImageError = () => {
    setImageError(true);
  };

  // Get profile picture URL
  const getProfilePicUrl = () => {
    if (!authData?.profilePic || imageError) {
      return null;
    }

    // Handle different URL formats
    const profilePic = authData.profilePic;

    // If it's already a full URL (starts with http/https)
    if (profilePic.startsWith('http://') || profilePic.startsWith('https://')) {
      return profilePic;
    }

    // If it's a relative path, construct the full URL
    // Adjust this base URL according to your backend setup
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    
    // Handle paths that start with '/' or don't
    if (profilePic.startsWith('/')) {
      return `${baseUrl}${profilePic}`;
    } else {
      return `${baseUrl}/${profilePic}`;
    }
  };

  const profilePicUrl = getProfilePicUrl();

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
            {profilePicUrl ? (
              <img
                src={profilePicUrl}
                alt={`${authData.username || 'User'}'s profile`}
                className="profile-image"
                onError={handleImageError}
                onLoad={() => setImageError(false)}
              />
            ) : (
              <User size={20} />
            )}
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

      <div className="topbar-right" ref={dropdownRef}>
        <div className="topbar-icons">
          <button className="icon-button" title="Settings" onClick={toggleQuickActions}>
            <Settings size={20} />
          </button>
        </div>
        {showQuickActions && <QuickActions onClose={() => setShowQuickActions(false)} />}
      </div>
    </div>
  );
};

export default Topbar;