import React, { useState } from "react";
import "../../../CSS/Tables/Table.css"; 

const DynamicTable = ({ data, rowsPerPage = 5 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  if (!data || data.length === 0) return <p className="no-data">No data available</p>;

  const columns = Object.keys(data[0]);
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="table-container" >
      <div className="table-header" style={{position:"relative", display:"flex",justifyContent:"end"}}>
      <button className="add-btn">Add New</button>
      <button className="delete-btn">delete</button>
      </div>
      <table className="academic-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col.toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col) => (
                <td key={col}>{row[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <button className="page-btn" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          ◀ Prev
        </button>
        <span className="page-indicator"> Page {currentPage} of {totalPages} </span>
        <button className="page-btn" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
          Next ▶
        </button>
      </div>
    </div>
  );
};

export default DynamicTable;
