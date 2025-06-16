import React from "react";
import WeeklyCalendar from "../../../View/Components/BigCalendar/WeeklyCalendar.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import {upcomingAssignments} from "../../../Static/dashboardData.js";
import "./calendar.css";
import { SAMPLE_EVENTS } from "../../../Static/CalendarEvents.js";

export default function Calendar() {
    return (
        
                <WeeklyCalendar  events={SAMPLE_EVENTS}/>
           
    );
}

// import React, { useState } from 'react';
// import { Plus, Calendar, Brain, Target } from 'lucide-react';
// import ScrollList from '../../Components/ScrollList/ScrollList';
// import ScrollListItem from '../../Components/ScrollList/ScrollListItem';
// import "./calendar.css";
// import { SAMPLE_EVENTS } from "../../../Static/CalendarEvents.js";
// import WeeklyCalendar from "../../../View/Components/BigCalendar/WeeklyCalendar.jsx";

// const AcademicDashboard = () => {
//   const [assignments, setAssignments] = useState([
//     {
//       id: 1,
//       title: 'Calculus Integration Project',
//       description: 'Complete advanced integration techniques including substitution, integration by parts, and partial fractions.',
//       course: 'Mathematics',
//       type: 'assignment',
//       dueDate: '2025-06-25',
//       dueTime: '23:59',
//       progress: 75,
//       status: 'in-progress',
//       priority: 'high',
//       instructor: 'Dr. Sarah Chen',
//       difficulty: 'Advanced',
//       credits: 4,
//       semester: 'Fall 2024'
//     },
//     {
//       id: 2,
//       title: 'Chemistry Lab Report',
//       description: 'Analyze spectroscopic data and write comprehensive lab report on organic synthesis.',
//       course: 'Chemistry',
//       type: 'project',
//       dueDate: '2025-06-20',
//       dueTime: '17:00',
//       progress: 90,
//       status: 'pending',
//       priority: 'medium',
//       instructor: 'Prof. Johnson',
//       difficulty: 'Intermediate',
//       credits: 3,
//       semester: 'Fall 2024'
//     },
//     {
//       id: 3,
//       title: 'Physics Midterm Exam',
//       description: 'Comprehensive exam covering mechanics, thermodynamics, and wave physics.',
//       course: 'Physics',
//       type: 'exam',
//       dueDate: '2025-06-18',
//       dueTime: '10:00',
//       progress: 100,
//       status: 'completed',
//       priority: 'urgent',
//       instructor: 'Dr. Wilson',
//       difficulty: 'Advanced',
//       credits: 4,
//       semester: 'Fall 2024'
//     }
//   ]);

//   const getDaysUntilDue = (dueDate) => {
//     const today = new Date();
//     const due = new Date(dueDate);
//     const diffTime = due - today;
//     return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//   };

//   const academicFilters = [
//     {
//       key: 'active',
//       label: 'Active',
//       count: assignments.filter(a => a.status === 'pending' || a.status === 'in-progress').length,
//       filter: (item) => item.status === 'pending' || item.status === 'in-progress'
//     },
//     {
//       key: 'completed',
//       label: 'Completed',
//       count: assignments.filter(a => a.status === 'completed').length,
//       filter: (item) => item.status === 'completed'
//     },
//     {
//       key: 'overdue',
//       label: 'Overdue',
//       count: assignments.filter(a => getDaysUntilDue(a.dueDate) < 0 && a.status !== 'completed').length,
//       filter: (item) => getDaysUntilDue(item.dueDate) < 0 && item.status !== 'completed'
//     }
//   ];

//   const handleEdit = (assignment) => {
//     console.log('Edit assignment:', assignment);
//   };

//   const handleDelete = (id) => {
//     setAssignments(prev => prev.filter(a => a.id !== id));
//   };

//   const handleView = (assignment) => {
//     console.log('View assignment:', assignment);
//   };

//   const handleToggleComplete = (id) => {
//     setAssignments(prev => prev.map(a => 
//       a.id === id 
//         ? { 
//             ...a, 
//             status: a.status === 'completed' ? 'pending' : 'completed',
//             progress: a.status === 'completed' ? a.progress : 100
//           }
//         : a
//     ));
//   };

//   const handleAddNew = () => {
//     const newAssignment = {
//       id: Date.now(),
//       title: 'New Assignment',
//       description: 'Add assignment description...',
//       course: 'New Course',
//       type: 'assignment',
//       dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
//       dueTime: '23:59',
//       progress: 0,
//       status: 'pending',
//       priority: 'medium',
//       instructor: 'Instructor Name',
//       difficulty: 'Intermediate',
//       credits: 3,
//       semester: 'Fall 2024'
//     };
//     setAssignments(prev => [...prev, newAssignment]);
//   };

//   return (
//     <div style={{ height: '100vh', padding: '20px' ,display: 'flex', flexDirection: 'row', gap: '20px'}}>
//         <div> 
//             <WeeklyCalendar  events={SAMPLE_EVENTS}/>
//         </div>
//       <ScrollList
//         title="Academic Dashboard"
//         subtitle="Track your assignments and academic progress"
//         items={assignments}
//         renderItem={(assignment) => (
//           <ScrollListItem
//             item={assignment}
//             variant={assignment.type}
//             showProgress={true}
//             showBadges={true}
//             showDescription={true}
//             showFooter={true}
//             onEdit={handleEdit}
//             onDelete={handleDelete}
//             onView={handleView}
//             onToggleComplete={handleToggleComplete}
//             customFields={[
//               { key: 'difficulty', label: 'Difficulty', icon: Target }
//             ]}
//           />
//         )}
//         searchFields={['title', 'course', 'instructor', 'description']}
//         filters={academicFilters}
//         onAddNew={handleAddNew}
//         headerActions={[
//           {
//             label: 'Calendar View',
//             icon: <Calendar size={16} />,
//             onClick: () => console.log('Calendar view')
//           },
//           {
//             label: 'Study Planner',
//             icon: <Brain size={16} />,
//             onClick: () => console.log('Study planner')
//           }
//         ]}
//         emptyState={{
//           icon: '🎓',
//           title: 'No assignments yet',
//           message: 'Add your first assignment to start tracking your academic progress.',
//           action: {
//             label: 'Add Assignment',
//             icon: <Plus size={16} />,
//             onClick: handleAddNew
//           }
//         }}
//       />
//     </div>
//   );
// };

// export default AcademicDashboard;