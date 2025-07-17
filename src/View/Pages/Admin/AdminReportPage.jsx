import React from 'react';
import { useReportPage } from '../../../Hooks/useReportPage';
import styles from '../../../CSS/Pages/Admin/AdminReportPage.module.css';
import StudentTable from '../../Components/Tables/Table.jsx';
import { mockRecentReports } from '../../../Static/FIxed/reportPageData.js';
import { reportActionButtons } from '../../../Utils/reportUtils';

const AdminReportPage = () => {
  const {
    queryText,
    setQueryText,
    resultData,
    loading,
    error,
    recentReports,
    loadingReports,
    handleGenerateReport,
    handleDownload,
  } = useReportPage();

  return (
    <div className={styles.adminReportPage}>
      <div className={styles.adminReportContainer}>
        {/* Header Section */}
        <div className={styles.headerSection}>
          <div className={styles.headerIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
          </div>
          <h1 className={styles.reportHeaderTitle}>Report Generator</h1>
          <p className={styles.headerSubtitle}>
            Generate custom reports by entering your query below. Our system will process your request and provide downloadable results.
          </p>
        </div>

        {/* Main Content Card */}
        <div className={styles.contentCard}>
          {/* Query Section */}
          <div className={styles.querySection}>
            <label className={styles.queryLabel}>Report Query</label>
            <div className={styles.textareaWrapper}>
              <textarea
                className={styles.queryTextarea}
                rows="4"
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder="Describe the report you want to generate... (e.g., 'Show all employees hired in the last 6 months')"
              />
              <div className={styles.textareaIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
            </div>
            
            <button
              className={`${styles.generateButton} ${loading ? styles.loading : ''}`}
              onClick={handleGenerateReport}
              disabled={loading || !queryText.trim()}
            >
              {loading ? (
                <>
                  <div className={styles.spinner}></div>
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
            <div className={styles.errorSection}>
              <div className={styles.errorAlert}>
                <svg className={styles.errorIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p className={styles.errorText}>{error}</p>
              </div>
            </div>
          )}

          {/* Results Section */}
          {resultData.length > 0 && (
            <>
              {/* Success Message */}
              <div className={styles.successSection}>
                <div className={styles.successAlert}>
                  <div className={styles.successContent}>
                    <svg className={styles.successIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22,4 12,14.01 9,11.01"/>
                    </svg>
                    <div className={styles.successText}>
                      <p className="successTitle">Report Generated Successfully</p>
                      <p className="successSubtitle">{resultData.length} records found</p>
                    </div>
                  </div>
                  <button onClick={handleDownload} className={styles.downloadButton}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 201 5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    <span>Download CSV</span>
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className={styles.tableSection}>
                <div className="tableHeader">
                  <h3 className="tableTitle">Report Results</h3>
                  <div className="tableInfo">
                    <span className="recordCount">{resultData.length} records</span>
                  </div>
                </div>
                
                <div className="tableContainer">
                  <table className="resultTable">
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

        {/* Recent Reports Section */}
        <div className={styles.recentReportsCard}>
          <div className={styles.recentReportsSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Recent Reports</h2>
              <p className={styles.sectionSubtitle}>Your last 10 generated reports</p>
            </div>
            
            {loadingReports ? (
              <div className={styles.loadingSpinner}>
                <div className={styles.spinner}></div>
                <span>Loading recent reports...</span>
              </div>
            ) : (
              <div className={styles.tableWrapper}>
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