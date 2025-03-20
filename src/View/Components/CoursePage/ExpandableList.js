import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; 
import "./ExpandableList.css"; 

const ExpandableList = ({ title, data, renderItem }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div className="expandable-list">
      <h3>{title}</h3>
      <ul>
        {data.map((item, index) => (
          <li key={index} className="expandable-item">
            <div
              className="item-title"
              onClick={() => setSelectedItem(selectedItem === index ? null : index)}
            >
              <strong>{item.title}</strong>
              <span className="toggle-arrow">
                {selectedItem === index ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </div>
            {selectedItem === index && (
              <div className="item-content">
                {renderItem(item)} 
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpandableList;
