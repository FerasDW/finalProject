import React from 'react';
import './404.css';
import unAuthorizedpng from "../../../Assets/Errors/403page.png";

const unAuthorized = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-card">
        <img
          src={unAuthorizedpng}
          alt="404"
          className="not-found-image"
          style={{ width: '50%', height: '50%' }}
        />
        <h1 className="not-found-code">403</h1>
        <h2 className="not-found-title">Access Denied</h2>
        <p className="not-found-message">You Dont Have The Permission For This Page</p>
        <button className="dashboard-button" onClick={() => window.location.href = '/'}>
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default unAuthorized;
