import React from "react";

const DynamicFilter = ({ showtitle, filters, values, onChange }) => {
  return (
    <div
      className="filter-group"
      style={showtitle ? { display: "flex", flexDirection: "column", gap: "0.5rem" } : {}}
    >
      {filters.map(({ title, label, name, options }) => (
        <div key={name}>
          {showtitle && <h3>{title}</h3>}
          <select
            value={values[name]}
            onChange={(e) => onChange(name, e.target.value)}
            className="filter-select"
          >
            <option value="all">All {label}</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default DynamicFilter;