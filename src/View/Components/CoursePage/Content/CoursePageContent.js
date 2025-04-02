
import React, { useState } from 'react';
import MidPageNavbar from './MidPageNavBar';
import Box from '../../Dashboard/Content/Box';
import CourseDetails from '../CourseDetails';
import PieChart from '../../Charts/pieCharts';
import BarChart from '../../Charts/barChart';
import StudentTable from '../../Tables/Table';
import {contentConfig} from "../../../../Static/coursePageData";
import {sampleData} from "../../../../Static/dashboardData";
import Card from "./CourseMaterialCards";

const dummyCourseData = [
  { id: 'Attended', label: 'Attended', value: 75 },
  { id: 'Missed', label: 'Missed', value: 25 },
];
const content = contentConfig[1100];

const CoursePageContent = () => {
  const [activeSection, setActiveSection] = useState('charts');
  const [selectedYear, setSelectedYear] = useState('');

  const renderSection = () => {
    switch (activeSection) {
      case 'charts':
        return (
          <>
          <div className='row'>
          <Box
            title="Course attendance percentage"
            chart={<PieChart data={dummyCourseData} />}
            gridRow="span 4"
            gridColumn="span 3"
          />
          <Box
            title="Course attendance percentage"
            chart={<BarChart data={sampleData} />}
            gridRow="span 4"
            gridColumn="span 9"
          />
          
          </div>
          </>
        );
      case 'students':
        return <StudentTable />;
      case 'files':
        return <Card />;
      default:
        return null;
    }
  };


  return (
    <>
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
