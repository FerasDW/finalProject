import React, { useState } from 'react';
import axios from 'axios';
import './AdminReportPage.scss';
import { GENERATE_REPORT } from '../../Api/Api.js';

const AdminReportPage = () => {
  const [queryText, setQueryText] = useState('');
  const [lastQuery, setLastQuery] = useState('');
  const [resultData, setResultData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
          <h1 className="header-title">Report Generator</h1>
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
      </div>
    </div>
  );
};

export default AdminReportPage;