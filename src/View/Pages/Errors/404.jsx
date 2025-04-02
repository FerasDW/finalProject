import React from 'react';
import './404.css';
import notFound from "../../../Assets/Errors/404page.png";

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-card">
        <img
          src={notFound}
          alt="404"
          className="not-found-image"
          style={{ width: '50%', height: '50%' }}
        />
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Something went wrong</h2>
        <p className="not-found-message">Sorry we were unable to find that page</p>
        <button className="dashboard-button" onClick={() => window.location.href = '/'}>
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
