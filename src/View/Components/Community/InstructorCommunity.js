import React from 'react';

const InstructorCommunity = () => {
  return (
    <div className="instructor-community">
      <h2>Course Management</h2>
      <div className="courses-management">
        <button className="primary-btn">Add New Course</button>
      </div>

      <h2>Discussions with Students</h2>
      <div className="discussions">
        <button className="primary-btn">Start New Discussion</button>
      </div>

      <h2>Announcements</h2>
      <div className="announcements">
        <button className="primary-btn">Add New Announcement</button>
      </div>
    </div>
  );
};

export default InstructorCommunity;
