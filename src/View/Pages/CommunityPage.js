import React from 'react';
import { Route, Routes } from 'react-router-dom';

import StudentCommunity from '../Components/Community/StudentCommunity';
import InstructorCommunity from '../Components/Community/InstructorCommunity';
import AdminCommunity from '../Components/Community/AdminCommunity';

const CommunityPage = ({ userType }) => {
  return (
    <div className="community-page">
      <div className="main-content">
        <StudentCommunity />
        <Routes>
          {userType === 'student' && <Route element={<StudentCommunity />} />}
          {userType === 'instructor' && <Route path="/community" element={<InstructorCommunity />} />}
          {userType === 'admin' && <Route path="/community" element={<AdminCommunity />} />}
        </Routes>
      </div>
    </div>
  );
};

export default CommunityPage;
