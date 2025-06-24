import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../CSS/Pages/Admin/AdminReportPage.scss';
import { GENERATE_REPORT } from '../../../Api/Api.js';
import StudentTable from "../../Components/Tables/Table.jsx";

const AdminReportPage = () => {
  const [queryText, setQueryText] = useState('');
  const [lastQuery, setLastQuery] = useState('');
  const [resultData, setResultData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recentReports, setRecentReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);

  // Mock data for recent reports (replace with API call later)
  const mockRecentReports = [
    {
      id: 1,
      description: "Show all employees hired in the last 6 months",
      createdDate: "2024-06-07",
      createdTime: "14:30",
      recordCount: 45,
    },
    {
      id: 2,
      description: "Generate salary report for Q2 2024",
      createdDate: "2024-06-06",
      createdTime: "09:15",
      recordCount: 120,
    },
    {
      id: 3,
      description: "List all departments with budget allocation",
      createdDate: "2024-06-05",
      createdTime: "16:45",
      recordCount: 8,
    },
    {
      id: 4,
      description: "Show student enrollment by grade level",
      createdDate: "2024-06-04",
      createdTime: "11:20",
      recordCount: 350,
    },
    {
      id: 5,
      description: "Generate attendance report for May 2024",
      createdDate: "2024-06-03",
      createdTime: "13:10",
      recordCount: 892,
    }
  ];

  // Load recent reports on component mount
  useEffect(() => {
    fetchRecentReports();
  }, []);

  // Function to fetch recent reports from backend
  const fetchRecentReports = async () => {
    setLoadingReports(true);
    try {
      // TODO: Replace with actual API call
      // const response = await axios.get(`${API_BASE_URL}/reports/recent`);
      // setRecentReports(response.data.data || []);
      
      // For now, use mock data
      setTimeout(() => {
        setRecentReports(mockRecentReports);
        setLoadingReports(false);
      }, 500);
    } catch (err) {
      console.error("Error fetching recent reports:", err);
      // Fallback to mock data on error
      setRecentReports(mockRecentReports);
      setLoadingReports(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!queryText.trim() || queryText === lastQuery) {
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.post(GENERATE_REPORT, { query: queryText });
      console.log("RESPONSE FROM BACKEND:", response.data);
      setResultData(response.data.data || []);
      setLastQuery(queryText);
      
      // TODO: After successful report generation, refresh recent reports
      // fetchRecentReports();
      
      // TODO: Save the new report to recent reports
      // const newReport = {
      //   description: queryText,
      //   createdDate: new Date().toISOString().split('T')[0],
      //   createdTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      //   recordCount: response.data.data?.length || 0,
      //   status: "Completed",
      //   createdBy: "Admin User" // Get from auth context
      // };
      // await axios.post(`${API_BASE_URL}/reports/save`, newReport);
      
    } catch (err) {
      console.error("ERROR:", err);
      setError('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (resultData.length === 0) return;
    
    const csvContent = [
      Object.keys(resultData[0]).join(','),
      ...resultData.map(row =>
        Object.values(row).map(val =>
          typeof val === 'object' && val !== null
            ? `"${JSON.stringify(val)}"`
            : `"${val}"`
        ).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Action buttons for recent reports table
  const reportActionButtons = [
    (row) => (
      <button 
        key="view" 
        className="action-btn view-btn"
        onClick={() => {
          // TODO: Implement view report functionality
          console.log("View report:", row);
        }}
      >
        View
      </button>
    ),
    (row) => (
      <button 
        key="download" 
        className="action-btn download-btn"
        onClick={() => {
          // TODO: Implement download report functionality
          console.log("Download report:", row);
        }}
      >
        Download
      </button>
    ),
    (row) => (
      <button 
        key="regenerate" 
        className="action-btn regenerate-btn"
        onClick={() => {
          // TODO: Implement regenerate report functionality
          setQueryText(row.description);
        }}
      >
        Regenerate
      </button>
    )
  ];

  return (
    <div className="admin-report-page">
      <div className="admin-report-container">
        {/* Header Section */}
        <div className="header-section">
          <div className="header-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
          </div>
          <h1 className="report-header-title">Report Generator</h1>
          <p className="header-subtitle">
            Generate custom reports by entering your query below. Our system will process your request and provide downloadable results.
          </p>
        </div>

        {/* Main Content Card */}
        <div className="content-card">
          {/* Query Section */}
          <div className="query-section">
            <label className="query-label">Report Query</label>
            <div className="textarea-wrapper">
              <textarea
                className="query-textarea"
                rows="4"
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder="Describe the report you want to generate... (e.g., 'Show all employees hired in the last 6 months')"
              />
              <div className="textarea-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
            </div>
            
            <button
              className={`generate-button ${loading ? 'loading' : ''}`}
              onClick={handleGenerateReport}
              disabled={loading || !queryText.trim() || queryText === lastQuery}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  <span>Generating Report...</span>
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                  </svg>
                  <span>Generate Report</span>
                </>
                )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-section">
              <div className="error-alert">
                <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p className="error-text">{error}</p>
              </div>
            </div>
          )}

          {/* Results Section */}
          {resultData.length > 0 && (
            <>
              {/* Success Message */}
              <div className="success-section">
                <div className="success-alert">
                  <div className="success-content">
                    <svg className="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22,4 12,14.01 9,11.01"/>
                    </svg>
                    <div className="success-text">
                      <p className="success-title">Report Generated Successfully</p>
                      <p className="success-subtitle">{resultData.length} records found</p>
                    </div>
                  </div>
                  <button onClick={handleDownload} className="download-button">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    <span>Download CSV</span>
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="table-section">
                <div className="table-header">
                  <h3 className="table-title">Report Results</h3>
                  <div className="table-info">
                    <span className="record-count">{resultData.length} records</span>
                  </div>
                </div>
                
                <div className="table-container">
                  <table className="result-table">
                    <thead>
                      <tr>
                        {Object.keys(resultData[0]).map((key) => (
                          <th key={key}>{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {resultData.map((row, index) => (
                        <tr key={index}>
                          {Object.values(row).map((value, i) => (
                            <td key={i}>
                              {typeof value === 'object' && value !== null
                                ? JSON.stringify(value)
                                : value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Recent Reports Section - Now outside the content card */}
        <div className="recent-reports-card">
          <div className="recent-reports-section">
            <div className="section-header">
              <h2 className="section-title">Recent Reports</h2>
              <p className="section-subtitle">Your last 10 generated reports</p>
            </div>
            
            {loadingReports ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <span>Loading recent reports...</span>
              </div>
            ) : (
              <div className="table-wrapper">
                <StudentTable 
                  data={recentReports} 
                  actionButtons={reportActionButtons}
                  showAddButton={false}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReportPage;
