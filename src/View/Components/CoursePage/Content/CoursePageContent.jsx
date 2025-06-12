// CoursePageContent.jsx - Updated to use dynamic data

import React, { useState } from 'react';
import MidPageNavbar from './MidPageNavBar';
import Box from '../../Dashboard/Content/Box';
import CourseDetails from '../CourseDetails';
import PieChart from '../../Charts/pieCharts';
import BarChart from '../../Charts/barChart';
import StudentTable from '../../Tables/Table';
import Card from "./CourseMaterialCards";
import  studentsData  from '../../../../Static/students.js'; // Assuming studentsData is imported from a static file
import { 
  getContentConfig, 
  getCourseChartData, 
  getCourseMaterials, 
  getCourseAnnouncements 
} from "../../../../Static/coursePageData";

const CoursePageContent = ({ courseData, userRole = "1100" }) => {
  const [activeSection, setActiveSection] = useState('charts');
  const [selectedYear, setSelectedYear] = useState('');

  // Get course-specific data
  const courseId = courseData?.id;
  const content = courseId ? getContentConfig(courseId, userRole) : null;
  const attendanceData = courseId ? getCourseChartData(courseId, 'attendance') : [];
  const barChartData = courseId ? getCourseChartData(courseId, 'bar') : [];
  const courseMaterials = courseId ? getCourseMaterials(courseId) : [];

  // Fallback data if course not found or no specific data
  const fallbackAttendanceData = [
    { id: 'Attended', label: 'Attended', value: 75 },
    { id: 'Missed', label: 'Missed', value: 25 }
  ];

  const fallbackBarData = [
    {
      Group: "General",
      "Attended": 70,
      "AttendedColor": "hsl(167, 70%, 50%)",
      "Missed": 30,
      "MissedColor": "hsl(0, 70%, 50%)"
    }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'charts':
        return (
          <>
            <div className='row'>
              <Box
                title="Course attendance percentage"
                chart={
                  <PieChart 
                    data={attendanceData.length > 0 ? attendanceData : fallbackAttendanceData} 
                  />
                }
                gridRow="span 4"
                gridColumn="span 3"
              />
              <Box
                title="Weekly Attendance Trends"
                chart={
                  <BarChart 
                    data={barChartData.length > 0 ? barChartData : fallbackBarData} 
                  />
                }
                gridRow="span 4"
                gridColumn="span 9"
              />
            </div>
          </>
        );
      case 'students':
        return <StudentTable data={studentsData} showAddButton={true}/>;
      case 'files':
        return <Card materials={courseMaterials} />;
      default:
        return null;
    }
  };

  // Handle case where course data is not found
  if (!courseData) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Course Data Not Available</h2>
        <p>Unable to load course information.</p>
      </div>
    );
  }

  return (
    <>
      {/* Render the dynamic content based on course and user role */}
      {content}
      
      <div
        className="navbar"
        style={{
          display: 'flex',
          width: '95%',
          justifyContent: 'center',
          marginTop: '30px',
        }}
      >
        <MidPageNavbar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          sections={['charts', 'students', 'files']}
        />
      </div>

      <div className="dynamic-section" style={{ padding: '20px' }}>
        {renderSection()}
      </div>
    </>
  );
};

export default CoursePageContent;