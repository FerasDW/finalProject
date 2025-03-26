import React, { useState } from 'react';
import axios from 'axios';
import './AdminReportPage.css';
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
    a.download = 'report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-report-container">
      <h2>Generate Report</h2>
      <textarea
        className="query-textarea"
        rows="5"
        value={queryText}
        onChange={(e) => setQueryText(e.target.value)}
        placeholder="Type your report query here..."
      ></textarea>
      <button className="generate-button" onClick={handleGenerateReport}>
        {loading ? 'Generating...' : 'Generate Report'}
      </button>

      {error && <p className="error-text">{error}</p>}

      {resultData.length > 0 && (
        <>
          <div className="result-table-container">
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
          <button className="download-button" onClick={handleDownload}>
            Download Report
          </button>
        </>
      )}
    </div>
  );
};

export default AdminReportPage;
