// File: View/Pages/Grades.jsx
import React from "react";

const Grades = () => {
  return (
    <div className="grades-page">
      <h1>Grades & Evaluations</h1>
      <div className="grades-content">
        <p>Here you can view all your grades and evaluations.</p>
        {/* Add your grades content here */}
        <div className="assignments-due">
          <h2>Assignments Due</h2>
          <ul>
            <li>Math Homework - Due: March 15, 2025</li>
            <li>Science Report - Due: March 12, 2025</li>
            <li>History Essay - Due: March 10, 2025</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Grades;