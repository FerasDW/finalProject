// DynamicTable.jsx - Generic Table Component (Fixed)
import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Users,
  Search,
  GraduationCap,
  Building,
  BookOpen,
  Calendar,
  Settings,
  Database,
  UserCheck,
  FileText,
  Mail,
  Phone
} from "lucide-react";
import "../../../CSS/Components/Tables/Table.css";

const DynamicTable = ({
  data: initialData = [],
  actionButtons = [],
  showAddButton = true,
  onAddClick,
  title = "Data Management",
  entityType = "records",
  searchPlaceholder = "Search records...",
  addButtonText = "Add Record",
  icon = "default",
  columnConfig = {},
  hiddenColumns = [],
  searchableColumns = [],
  rowsPerPage = 10,
  tableHeight = "auto",
  compact = false,
  onRowSelect,
  onSort,
  onSearch,
  onDelete
}) => {
  const [data, setData] = useState(initialData);
  const [filteredData, setFilteredData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");

  const formatHeaderName = (name) => {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/_/g, ' ')
      .trim();
  };

  const getIcon = () => {
    const iconMap = {
      students: Users,
      lecturers: GraduationCap,
      courses: BookOpen,
      departments: Building,
      schedules: Calendar,
      settings: Settings,
      users: UserCheck,
      documents: FileText,
      contacts: Mail,
      phones: Phone,
      default: Database
    };
    if (typeof icon === "string") {
      return iconMap[icon] || iconMap[entityType] || iconMap.default;
    }
    return icon || iconMap[entityType] || iconMap.default;
  };

  const IconComponent = getIcon();

  const getConfiguredHeaders = () => {
    if (data.length === 0) return [];
    const allHeaders = Object.keys(data[0]);
    const visibleHeaders = allHeaders.filter(header => !hiddenColumns.includes(header));
    return visibleHeaders.map(header => ({
      key: header,
      displayName: columnConfig[header]?.displayName || formatHeaderName(header),
      sortable: columnConfig[header]?.sortable !== false,
      searchable: columnConfig[header]?.searchable !== false,
      type: columnConfig[header]?.type || "text"
    }));
  };

  const headers = getConfiguredHeaders();

  const getSearchableColumns = () => {
    if (searchableColumns.length > 0) return searchableColumns;
    return headers.filter(h => h.searchable).map(h => h.key);
  };

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    let temp = [...data];
    if (searchTerm) {
      const searchCols = getSearchableColumns();
      temp = temp.filter((row) =>
        searchCols.some(col => row[col]?.toString().toLowerCase().includes(searchTerm.toLowerCase()))
      );
      onSearch?.(searchTerm, temp);
    }
    if (sortConfig.key) {
      temp.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        const header = headers.find(h => h.key === sortConfig.key);
        if (header?.type === "number") {
          const numA = parseFloat(valA) || 0;
          const numB = parseFloat(valB) || 0;
          return sortConfig.direction === "asc" ? numA - numB : numB - numA;
        } else if (header?.type === "date") {
          const dateA = new Date(valA);
          const dateB = new Date(valB);
          return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
        } else {
          const strA = valA?.toString() || "";
          const strB = valB?.toString() || "";
          return sortConfig.direction === "asc"
            ? strA.localeCompare(strB)
            : strB.localeCompare(strA);
        }
      });
      onSort?.(sortConfig.key, sortConfig.direction, temp);
    }
    setFilteredData(temp);
    setCurrentPage(1);
  }, [data, sortConfig, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const getRowKey = (row) => row.id || row._id || headers.map(h => row[h.key]).join("|");

  const toggleRow = (key) => {
    setSelectedRows(prev => {
      const next = prev.includes(key) ? prev.filter(i => i !== key) : [...prev, key];
      onRowSelect?.(next, data.filter(row => next.includes(getRowKey(row))));
      return next;
    });
  };

  const selectAllRows = () => {
    const newSelected = selectedRows.length === currentData.length ? [] : currentData.map(getRowKey);
    setSelectedRows(newSelected);
    onRowSelect?.(newSelected, data.filter(row => newSelected.includes(getRowKey(row))));
  };

  const deleteSelected = () => {
    const toDelete = data.filter(row => selectedRows.includes(getRowKey(row)));
    if (onDelete) onDelete(toDelete, selectedRows);
    else setData(prev => prev.filter(row => !selectedRows.includes(getRowKey(row))));
    setSelectedRows([]);
  };

  const handleSort = (key) => {
    const header = headers.find(h => h.key === key);
    if (!header?.sortable) return;
    const direction = (sortConfig.key === key && sortConfig.direction === "asc") ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? <ChevronUp className="sort-icon" /> : <ChevronDown className="sort-icon" />;
  };

  const renderCellContent = (row, header) => {
    const value = row[header.key];
    const config = columnConfig[header.key] || {};
    switch (config.type) {
      case "image": return <img src={value} alt="avatar" className="avatar" />;
      case "email": return <a href={`mailto:${value}`} className="cell-link">{value}</a>;
      case "phone": return <a href={`tel:${value}`} className="cell-link">{value}</a>;
      case "url": return <a href={value} target="_blank" rel="noopener noreferrer" className="cell-link">{value}</a>;
      case "date": return <span className="cell-content">{new Date(value).toLocaleDateString()}</span>;
      case "currency": return <span className="cell-content">${parseFloat(value || 0).toFixed(2)}</span>;
      case "boolean": return <span className={`status-badge ${value ? 'status-active' : 'status-inactive'}`}>{value ? 'Yes' : 'No'}</span>;
      case "status": return <span className={`status-badge status-${value?.toLowerCase()}`}>{value}</span>;
      case "number": return <span className="cell-content">{parseFloat(value || 0).toFixed(1)}</span>;
      case "custom": return config.render ? config.render(value, row) : <span className="cell-content">{value}</span>;
      default:
        if (header.key.toLowerCase().includes("photo") || header.key.toLowerCase().includes("image")) {
          return <img src={value} alt="avatar" className="avatar" />;
        }
        return <span className="cell-content">{value}</span>;
    }
  };

  return (
    <div className="t-container" style={{ height: tableHeight }}>
      <div className="header-section">
        <div className="table-title">
          <IconComponent className="title-icon" />
          <h3>{title}</h3>
          <span className="record-count">{filteredData.length} {entityType}</span>
        </div>
        <div className="table-controls">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="actions">
            {selectedRows.length > 0 && (
              <button className="delete-button" onClick={deleteSelected}>
                <Trash2 className="button-icon" />
                Delete ({selectedRows.length})
              </button>
            )}
            {showAddButton && (
              <button className="add-button" onClick={onAddClick}>
                <Plus className="button-icon" />
                {addButtonText}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={`table-container ${compact ? 'compact' : ''}`}>
        <table>
          <thead>
            <tr>
              <th className="checkbox-header">
                <input
                  type="checkbox"
                  checked={currentData.length > 0 && selectedRows.length === currentData.length}
                  onChange={selectAllRows}
                  className="header-checkbox"
                />
              </th>
              {headers.map((header, i) => (
                <th
                  key={i}
                  onClick={() => handleSort(header.key)}
                  className={`sortable-header ${header.sortable ? 'clickable' : ''}`}
                >
                  <div className="header-content">
                    <span>{header.displayName}</span>
                    {header.sortable && getSortIcon(header.key)}
                  </div>
                </th>
              ))}
              {actionButtons.length > 0 && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row) => {
              const rowKey = getRowKey(row);
              return (
                <tr key={rowKey} className={selectedRows.includes(rowKey) ? "selected-row" : ""}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(rowKey)}
                      onChange={() => toggleRow(rowKey)}
                      className="row-checkbox"
                    />
                  </td>
                  {headers.map((header, j) => (
                    <td key={j}>{renderCellContent(row, header)}</td>
                  ))}
                  {actionButtons.length > 0 && (
                    <td className="action-buttons">
                      {actionButtons.map((ActionComponent, index) => (
                        <React.Fragment key={index}>{ActionComponent(row)}</React.Fragment>
                      ))}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
        {currentData.length === 0 && filteredData.length === 0 && (
          <div className="empty-state">
            <IconComponent className="empty-icon" />
            <p>No {entityType} found</p>
            <span>Try adjusting your search or add new {entityType}</span>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="footer">
          <div className="pagination-info">
            Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, filteredData.length)} of {filteredData.length} {entityType}
          </div>
          <div className="pagination">
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="pagination-btn">
              <ChevronLeft className="pagination-icon" />
            </button>
            <span className="page-info">{currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="pagination-btn">
              <ChevronRight className="pagination-icon" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicTable;