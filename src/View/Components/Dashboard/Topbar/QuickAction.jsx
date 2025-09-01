// src/Components/Dashboard/Topbar/QuickActions.jsx

import React, { useContext } from "react";
import { LogOut, User, Edit } from "react-feather";
import { AuthContext } from "../../../../Context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import "./QuickAction.css";

const QuickAction = ({ onClose }) => {
  const { authData, logoutUser } = useContext(AuthContext); // Fixed: changed from logout to logoutUser
  const navigate = useNavigate();

  const handleLogout = async () => { // Made async since logoutUser is async
    try {
      onClose(); // Close dropdown first
      navigate("/"); // Navigate immediately to avoid null authData issues
      await logoutUser(); // Then logout
    } catch (error) {
      console.error("Logout error:", error);
      // Navigation already happened above
    }
  };

  const handleEditProfile = () => {
    // Navigate to a user profile editing page
    navigate("/settings/profile"); 
    onClose();
  };

  return (
    <div className="quick-actions-dropdown">
      <div className="dropdown-header">
        <User size={24} />
        <span className="dropdown-username">{authData ? authData.username : "Guest"}</span>
      </div>
      <div className="dropdown-item" onClick={handleEditProfile}>
        <Edit size={16} />
        <span>Change Details</span>
      </div>
      <div className="dropdown-item" onClick={handleLogout}>
        <LogOut size={16} />
        <span>Logout</span>
      </div>
    </div>
  );
};

export default QuickAction;