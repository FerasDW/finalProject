import React from "react";

const DynamicFilter = ({ filters, values, onChange }) => {
  return (
    <div className="filter-group">
      {filters.map(({ label, name, options }) => (
        <select
          key={name}
          value={values[name]}
          onChange={(e) => onChange(name, e.target.value)}
          className="filter-select"
        >
          <option value="all">All {label}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ))}
    </div>
  );
};

export default DynamicFilter;
