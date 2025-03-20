import React from 'react';

const AdminCommunity = () => {
  return (
    <div className="admin-community">
      <h2>User Management</h2>
      <div className="user-management">
        <button className="primary-btn">Add New User</button>
      </div>

      <h2>Content Management</h2>
      <div className="content-management">
        <button className="primary-btn">Add New Content</button>
      </div>

      <h2>Activity Reports</h2>
      <div className="activity-reports">
      </div>
    </div>
  );
};

export default AdminCommunity;
