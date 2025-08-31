import { useState, useEffect } from "react";
import axios from "axios";

// Use the correct base URL for edusphere-service (port 8082)
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://13.61.114.153:8082";
const GENERATE_REPORT_URL = `${API_BASE_URL}/api/reports/generate`;
const RECENT_REPORTS_URL = `${API_BASE_URL}/api/reports/recent`;
const DOWNLOAD_REPORT_URL = `${API_BASE_URL}/api/reports/download/`;
const VIEW_REPORT_URL = `${API_BASE_URL}/api/reports/view/`;

// Helper function to get token from localStorage
const getToken = () => {
    return localStorage.getItem("jwtToken");
};

// Helper function to get authorization headers
const getAuthHeaders = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Create axios config with auth headers
const createAuthConfig = (additionalConfig = {}) => {
    return {
        ...additionalConfig,
        headers: {
            ...getAuthHeaders(),
            ...additionalConfig.headers
        }
    };
};

export const useReportPage = () => {
  const [queryText, setQueryText] = useState("");
  const [lastQuery, setLastQuery] = useState("");
  const [resultData, setResultData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recentReports, setRecentReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [viewedReportData, setViewedReportData] = useState(null);
  const [isViewing, setIsViewing] = useState(false);
  const [viewingError, setViewingError] = useState("");

  useEffect(() => {
    fetchRecentReports();
  }, []);

  const handleViewReport = async (reportId) => {
    setIsViewing(true);
    setViewingError("");
    try {
      const response = await axios.get(`${VIEW_REPORT_URL}${reportId}`, createAuthConfig());
      if (response.data && response.data.data) {
        setViewedReportData(response.data.data);
        setIsViewing(false);
      } else {
        setViewingError("No data found for this report.");
        setIsViewing(false);
      }
    } catch (err) {
      console.error("❌ Error viewing report:", err);
      setViewingError("An error occurred while fetching the report.");
      setIsViewing(false);
    }
  };

  const closeView = () => {
    setViewedReportData(null);
    setIsViewing(false);
    setViewingError("");
  };

  const fetchRecentReports = async () => {
    setLoadingReports(true);
    try {
      const response = await axios.get(RECENT_REPORTS_URL, createAuthConfig());
      setRecentReports(response.data || []);
      setLoadingReports(false);
    } catch (err) {
      console.error("Error fetching recent reports:", err);
      setRecentReports([]);
      setLoadingReports(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!queryText.trim()) {
      setError("Please enter a query to generate a report.");
      return;
    }
    if (queryText === lastQuery) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(GENERATE_REPORT_URL, {
        query: queryText,
      }, createAuthConfig());
      if (response.data && response.data.data) {
        setResultData(response.data.data);
        setLastQuery(queryText);
        if (response.data.data.length === 0) {
          setError(
            "No data found for your query. Please try a different search."
          );
        }
      } else {
        setError("No data received from server. Please try again.");
        setResultData([]);
      }
    } catch (err) {
      console.error("❌ Error generating report:", err);
      if (err.response) {
        const status = err.response.status;
        const message = err.response.data?.message || err.response.statusText;
        if (status === 400) {
          setError(`Invalid request: ${message}`);
        } else if (status === 500) {
          setError("Server error occurred. Please try again later.");
        } else {
          setError(`Error ${status}: ${message}`);
        }
      } else if (err.request) {
        setError("Unable to connect to server. Please check your connection.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      setResultData([]);
    } finally {
      setLoading(false);
      fetchRecentReports();
    }
  };

  const handleDownload = () => {
    if (resultData.length === 0) {
      alert("No data to download");
      return;
    }

    try {
      const headers = Object.keys(resultData[0]);
      const csvContent = [
        headers.join(","),
        ...resultData.map((row) =>
          headers
            .map((header) => {
              const value = row[header];
              if (value === null || value === undefined) {
                return "";
              }
              if (typeof value === "object") {
                return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
              }
              const stringValue = String(value);
              if (
                stringValue.includes(",") ||
                stringValue.includes('"') ||
                stringValue.includes("\n")
              ) {
                return `"${stringValue.replace(/"/g, '""')}"`;
              }
              return stringValue;
            })
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `report_${
        new Date().toISOString().split("T")[0]
      }_${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error("❌ Error downloading CSV:", err);
      alert("Error downloading file. Please try again.");
    }
  };

  const handleDownloadFromRecent = async (reportId) => {
    try {
      const response = await axios.get(`${DOWNLOAD_REPORT_URL}${reportId}`, createAuthConfig({
        responseType: "blob",
      }));
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `report_${reportId}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error("❌ Error downloading recent report:", err);
      alert("Error downloading file. Please try again.");
    }
  };

  const handleRegenerateReport = (reportDescription) => {
    setQueryText(reportDescription);
  };

  const handleDeleteReport = async (reportId) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/reports/${reportId}`, createAuthConfig());
        fetchRecentReports();
      } catch (err) {
        console.error("❌ Error deleting report:", err);
        alert("Error deleting report. Please try again.");
      }
    }
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
    handleRegenerateReport,
    handleDownloadFromRecent,
    handleDeleteReport,
    viewedReportData,
    isViewing,
    viewingError,
    handleViewReport,
    closeView,
  };
};