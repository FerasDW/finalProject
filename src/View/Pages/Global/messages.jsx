import MidPageNavbar from "../../Components/CoursePage/Content/MidPageNavBar";
import Table from "../../Components/Tables/Table";
import React, { useState } from 'react';
import { upcomingAssignments } from "../../../Static/dashboardData.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';

const Messages = () =>
{
  const [activeSection, setActiveSection] = useState('requests');
  const [selectedYear, setSelectedYear] = useState('');

  const renderSection = () => {
    const handleDelete = (row) => {
        if (window.confirm("Delete?")) {
          console.log("Delete", row);
        }
      };
      const handleEdit = (row) => {
        console.log("Edit", row);
      };
    switch (activeSection) {
      case 'requests':
        return <Table data={upcomingAssignments} 
        actionButtons={[
            (row) => <button onClick={() => handleEdit(row)}> <FontAwesomeIcon icon={faPenToSquare} />  </button>,
            (row) => <button onClick={() => handleDelete(row)}><img src="../../Assets/Icons/Edit.jpg" alt="Delete" style={{ width: 50, height: 50 }} /></button>,
          ]}/>;
      case 'announcement':
        return <Table data={upcomingAssignments} showAddButton={true} />;
      case 'templates':
        return <Table />;
      default:
        return null;
    }
  };


  return  ( 
  <>
  <div style={{width:"100%",display: 'flex', alignItems:"center",justifyContent:"center"}}>
  <MidPageNavbar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          sections={['requests', 'announcement', 'templates']}
        />
        </div>
        <div className="dynamic-section" style={{ padding: '20px' }}>
        {renderSection()}
      </div>
</>
  );
}
export default Messages;