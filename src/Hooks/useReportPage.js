import { useState, useEffect } from 'react';
import axios from 'axios';
import { GENERATE_REPORT } from '../Api/reportPageApi';
import { mockRecentReports } from '../Static/FIxed/reportPageData.js'

export const useReportPage = () => {
  const [queryText, setQueryText] = useState('');
  const [lastQuery, setLastQuery] = useState('');
  const [resultData, setResultData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recentReports, setRecentReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);

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

  return {
    queryText,
    setQueryText,
    resultData,
    loading,
    error,
    recentReports,
    loadingReports,
    handleGenerateReport,
    handleDownload,
  };
};