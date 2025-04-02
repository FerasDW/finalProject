import React, { useState } from "react";
import Box from "../../Components/Dashboard/Content/Box";
import Profile from "./Profile";
import "./Settings.css";
// import Security from "./Security";
// import Appearance from "./Appearance";
// import Notifications from "./Notifications";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const contentConfig = {
    profile: (
      <div className="row">
        <Box
          contentBox={<Profile />}
          gridRow="span 12"
          bgColor="#888888"
          gridColumn="span 12"
        />
      </div>
    ),
    security: (
      <div className="row">
        <Box
          // contentBox={<Security />}
          gridRow="span 12"
          bgColor="#fffccc"
          gridColumn="span 12"
        />
      </div>
    ),
    appearance: (
      <div className="row">
        <Box
          // contentBox={<Appearance />}
          gridRow="span 12"
          bgColor="#fffccc"
          gridColumn="span 12"
        />
      </div>
    ),
    notifications: (
      <div className="row">
        <Box
          // contentBox={<Notifications />}
          gridRow="span 12"
          bgColor="#fffccc"
          gridColumn="span 12"
        />
      </div>
    ),
  };

  return (
    <div className="settings">
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          My Profile
        </button>
        <button
          className={`tab-button ${activeTab === "security" ? "active" : ""}`}
          onClick={() => setActiveTab("security")}
        >
          Security
        </button>
        <button
          className={`tab-button ${activeTab === "appearance" ? "active" : ""}`}
          onClick={() => setActiveTab("appearance")}
        >
          Appearance
        </button>
        <button
          className={`tab-button ${
            activeTab === "notifications" ? "active" : ""
          }`}
          onClick={() => setActiveTab("notifications")}
        >
          Notifications
        </button>
      </div>
      {contentConfig[activeTab]}
    </div>
  );
};
export default Settings;
