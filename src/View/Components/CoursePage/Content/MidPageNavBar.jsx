import React from 'react';
import '../../../../CSS/Components/Global/MidPageNavbar.css';

const MidPageNavbar = ({ 
  activeSection, 
  setActiveSection, 
  selectedYear, 
  setSelectedYear, 
  sections, 
  showYear = true
}) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  return (
    <nav className="mid-navbar">
      {sections.map((section) => (
        <button
          key={section}
          className={`nav-link ${activeSection === section ? 'active' : ''}`}
          onClick={() => setActiveSection(section)}
        >
          {section.charAt(0).toUpperCase() + section.slice(1)}
        </button>
      ))}

      {showYear && (
        <select
          className="year-select"
          value={selectedYear}
          onChange={handleYearChange}
        >
          <option value="">Select Year</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      )}
    </nav>
  );
};

export default MidPageNavbar;