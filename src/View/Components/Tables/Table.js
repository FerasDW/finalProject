import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import "../../../CSS/Tables/Table.css";

const StudentTable = ({ data: initialData = [], actionButtons = [] }) => {
  const [data, setData] = useState(initialData);
  const [filteredData, setFilteredData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const rowsPerPage = 10;

  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  useEffect(() => {
    let temp = [...data];
    if (selectedGrade) {
      temp = temp.filter((s) => s["Year group"] === selectedGrade);
    }
    if (sortConfig.key) {
      temp.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    setFilteredData(temp);
  }, [data, selectedGrade, sortConfig]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const getRowKey = (row) => {
    return headers.map((key) => row[key]).join("|");
  };

  const toggleRow = (key) => {
    setSelectedRows((prev) =>
      prev.includes(key) ? prev.filter((i) => i !== key) : [...prev, key]
    );
  };

  const deleteSelected = () => {
    setData((prev) =>
      prev.filter((row) => !selectedRows.includes(getRowKey(row)))
    );
    setSelectedRows([]);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  return (
    <div className="container">
      <div className="header-row">
        <div className="school-select">
          <label>Select school</label>
          <select>
            <option>Big Ben</option>
          </select>
        </div>
        <div className="actions">
          {selectedRows.length > 0 && (
            <button className="delete-button" onClick={deleteSelected}>Delete selected</button>
          )}
          <button className="icon-button"><Filter /></button>
          <button className="add-button">+ Add</button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th></th>
              {headers.map((key, i) => (
                <th key={i} onClick={() => handleSort(key)} className="clickable">
                  {key}
                </th>
              ))}
              {actionButtons.length > 0 && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row) => {
              const rowKey = getRowKey(row);
              return (
                <tr key={rowKey}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(rowKey)}
                      onChange={() => toggleRow(rowKey)}
                    />
                  </td>
                  {headers.map((key, j) => (
                    <td key={j}>
                      {key.toLowerCase() === "photo" ? (
                        <img src={row[key]} alt="avatar" className="avatar" />
                      ) : (
                        row[key]
                      )}
                    </td>
                  ))}
                  {actionButtons.length > 0 && (
                    <td className="action-buttons">
                      {actionButtons.map((ActionComponent, index) => (
                        <React.Fragment key={index}>
                          {ActionComponent(row)}
                        </React.Fragment>
                      ))}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="footer">
        <div className="pagination">
          <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}><ChevronLeft /></button>
          <span>{currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}><ChevronRight /></button>
        </div>
      </div>
    </div>
  );
};

export default StudentTable;
