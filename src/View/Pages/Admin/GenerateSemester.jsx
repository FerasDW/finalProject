import React, { useState } from 'react';

const OptaPlannerTestPage = () => {
  const [isCreatingData, setIsCreatingData] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [dataResult, setDataResult] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [error, setError] = useState(null);

  // API Base URL - adjust this to match your backend
  const API_BASE_URL = 'http://localhost:8080/api';

  // Get authentication headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('jwtToken') || localStorage.getItem('authToken');
    
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  };

  const createTestData = async () => {
    setIsCreatingData(true);
    setError(null);
    setDataResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/scheduling/test/setup-mock-data`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setDataResult(result);
        console.log('Test data created successfully:', result);
      } else {
        setError(result.error || 'Failed to create test data');
      }
    } catch (err) {
      setError('Error creating test data: ' + err.message);
      console.error('Error creating test data:', err);
    } finally {
      setIsCreatingData(false);
    }
  };

  const testPlanner = async () => {
    setIsTesting(true);
    setError(null);
    setTestResult(null);

    const testConfig = {
      departmentId: "1",
      academicYear: "2025",
      semester: "Fall",
      division: "A",
      startDate: "2025-09-01",
      endDate: "2025-12-15"
    };

    try {
      const response = await fetch(`${API_BASE_URL}/scheduling/generate-semester`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(testConfig)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setTestResult(result);
        console.log('Schedule generated successfully:', result);
      } else {
        setError(result.message || 'Failed to generate schedule');
      }
    } catch (err) {
      setError('Error testing planner: ' + err.message);
      console.error('Error testing planner:', err);
    } finally {
      setIsTesting(false);
    }
  };

  const checkDataAvailability = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/scheduling/test/data-check?departmentId=1&academicYear=2025&semester=Fall`,
        {
          headers: getAuthHeaders()
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Current data in database:', result);
      alert(`Data Check:\nCourses: ${result.courses}\nLecturers: ${result.lecturers}\nStudents: ${result.students}\nSchedules: ${result.lecturerSchedules}`);
    } catch (err) {
      console.error('Error checking data:', err);
      alert('Error checking data: ' + err.message);
    }
  };

  const clearData = async () => {
    if (window.confirm('Are you sure you want to clear all test data?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/scheduling/test/clear-mock-data`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.success) {
          alert('Test data cleared successfully');
          setDataResult(null);
          setTestResult(null);
        } else {
          alert('Failed to clear data: ' + result.error);
        }
      } catch (err) {
        alert('Error clearing data: ' + err.message);
      }
    }
  };

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '28px' }}>
          OptaPlanner Scheduling Test
        </h1>
        <p style={{ margin: '0', fontSize: '16px', opacity: '0.9' }}>
          Test the automatic semester schedule generation system
        </p>
      </div>

      {/* Test Configuration Info */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #ddd'
      }}>
        <h2 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>
          Test Configuration
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          fontSize: '14px'
        }}>
          <div>
            <strong>Department ID:</strong> 1 (Computer Science)
          </div>
          <div>
            <strong>Academic Year:</strong> 2025
          </div>
          <div>
            <strong>Semester:</strong> Fall
          </div>
          <div>
            <strong>Duration:</strong> Sep 1 - Dec 15, 2025
          </div>
        </div>
      </div>

      {/* Expected Test Data Info */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #ddd'
      }}>
        <h2 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>
          What Will Be Created
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '15px'
        }}>
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#e3f2fd', 
            borderRadius: '6px',
            border: '1px solid #90caf9'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>
              📚 Courses (4)
            </h3>
            <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '14px' }}>
              <li>CS101 - Introduction to Programming (3 credits)</li>
              <li>CS102 - Data Structures (4 credits)</li>
              <li>MATH201 - Calculus I (3 credits)</li>
              <li>ENG101 - English Composition (2 credits)</li>
            </ul>
          </div>

          <div style={{ 
            padding: '15px', 
            backgroundColor: '#e8f5e8', 
            borderRadius: '6px',
            border: '1px solid #81c784'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#388e3c' }}>
              👨‍🏫 Lecturers (3)
            </h3>
            <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '14px' }}>
              <li>Dr. Alice Johnson (CS101, ENG101)</li>
              <li>Dr. Bob Smith (CS102)</li>
              <li>Dr. Carol Davis (MATH201)</li>
            </ul>
          </div>

          <div style={{ 
            padding: '15px', 
            backgroundColor: '#fff3e0', 
            borderRadius: '6px',
            border: '1px solid #ffb74d'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#f57c00' }}>
              👥 Students (45)
            </h3>
            <p style={{ margin: '0', fontSize: '14px' }}>
              All students enrolled in all courses.<br/>
              Will be split into 3 groups of 15 per course.
            </p>
          </div>

          <div style={{ 
            padding: '15px', 
            backgroundColor: '#f3e5f5', 
            borderRadius: '6px',
            border: '1px solid #ba68c8'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#7b1fa2' }}>
              📅 Expected Output
            </h3>
            <p style={{ margin: '0', fontSize: '14px' }}>
              12 scheduled lectures (4 courses × 3 groups).<br/>
              No conflicts, proper time allocation.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #ddd'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#2c3e50' }}>
          Test Actions
        </h2>
        
        <div style={{
          display: 'flex',
          gap: '15px',
          flexWrap: 'wrap',
          marginBottom: '20px'
        }}>
          <button
            onClick={createTestData}
            disabled={isCreatingData}
            style={{
              padding: '15px 25px',
              backgroundColor: isCreatingData ? '#95a5a6' : '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: isCreatingData ? 'not-allowed' : 'pointer',
              minWidth: '200px',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => {
              if (!isCreatingData) e.target.style.backgroundColor = '#2980b9';
            }}
            onMouseOut={(e) => {
              if (!isCreatingData) e.target.style.backgroundColor = '#3498db';
            }}
          >
            {isCreatingData ? '⏳ Creating Data...' : '🏗️ Create Test Data'}
          </button>

          <button
            onClick={testPlanner}
            disabled={isTesting}
            style={{
              padding: '15px 25px',
              backgroundColor: isTesting ? '#95a5a6' : '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: isTesting ? 'not-allowed' : 'pointer',
              minWidth: '200px',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => {
              if (!isTesting) e.target.style.backgroundColor = '#219a52';
            }}
            onMouseOut={(e) => {
              if (!isTesting) e.target.style.backgroundColor = '#27ae60';
            }}
          >
            {isTesting ? '⚙️ Testing Planner...' : '🚀 Test Planner'}
          </button>

          <button
            onClick={checkDataAvailability}
            style={{
              padding: '15px 25px',
              backgroundColor: '#f39c12',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              minWidth: '150px',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#e67e22'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#f39c12'}
          >
            📊 Check Data
          </button>

          <button
            onClick={clearData}
            style={{
              padding: '15px 25px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              minWidth: '150px',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#c0392b'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#e74c3c'}
          >
            🗑️ Clear Data
          </button>
        </div>

        <div style={{
          padding: '15px',
          backgroundColor: '#ecf0f1',
          borderRadius: '6px',
          fontSize: '14px',
          color: '#2c3e50'
        }}>
          <strong>Instructions:</strong>
          <ol style={{ margin: '10px 0 0 0', paddingLeft: '20px' }}>
            <li>Click "Create Test Data" to populate the database with sample courses, lecturers, students, and schedules</li>
            <li>Click "Test Planner" to run the OptaPlanner scheduling algorithm</li>
            <li>Use "Check Data" to verify what's currently in the database</li>
            <li>Use "Clear Data" to remove all test data when finished</li>
          </ol>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '15px',
          borderRadius: '6px',
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      {/* Data Creation Result */}
      {dataResult && (
        <div style={{
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #c3e6cb'
        }}>
          <h3 style={{ margin: '0 0 15px 0' }}>✅ Test Data Created Successfully</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '10px',
            fontSize: '14px'
          }}>
            <div><strong>Lecturers:</strong> {dataResult.lecturers}</div>
            <div><strong>Students:</strong> {dataResult.students}</div>
            <div><strong>Courses:</strong> {dataResult.courses}</div>
            <div><strong>Schedules:</strong> {dataResult.schedules}</div>
          </div>
          <p style={{ margin: '15px 0 0 0', fontSize: '14px' }}>
            {dataResult.message}
          </p>
        </div>
      )}

      {/* Test Result */}
      {testResult && (
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #ddd',
          marginBottom: '20px'
        }}>
          <h3 style={{ 
            margin: '0 0 15px 0', 
            color: testResult.success ? '#27ae60' : '#e74c3c' 
          }}>
            {testResult.success ? '✅ Schedule Generated Successfully!' : '❌ Schedule Generation Failed'}
          </h3>
          
          {testResult.success && (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px',
                marginBottom: '20px',
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '6px'
              }}>
                <div>
                  <strong>Total Events:</strong> {testResult.totalEvents}
                </div>
                <div>
                  <strong>Expected:</strong> 12 events (4 courses × 3 groups)
                </div>
                <div>
                  <strong>Status:</strong> {testResult.totalEvents === 12 ? '✅ Perfect!' : '⚠️ Check results'}
                </div>
              </div>

              {/* Events Display */}
              {testResult.events && testResult.events.length > 0 && (
                <div style={{
                  maxHeight: '400px',
                  overflowY: 'auto',
                  border: '1px solid #ddd',
                  borderRadius: '6px'
                }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '12px'
                  }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f1f3f4' }}>
                        <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Course</th>
                        <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Group</th>
                        <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Day</th>
                        <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Time</th>
                        <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Lecturer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testResult.events.map((event, index) => (
                        <tr key={event.id || index} style={{
                          backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa'
                        }}>
                          <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                            {event.title ? event.title.split(' - ')[0] : event.courseName || 'N/A'}
                          </td>
                          <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                            {event.title ? event.title.split(' - ')[1] : 'N/A'}
                          </td>
                          <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                            {event.dayOfWeek || 'N/A'}
                          </td>
                          <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                            {event.startTime && event.endTime 
                              ? `${event.startTime} - ${event.endTime}` 
                              : 'N/A'}
                          </td>
                          <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                            {event.instructorId || 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          <div style={{
            marginTop: '15px',
            padding: '10px',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            <strong>Message:</strong> {testResult.message}
          </div>
        </div>
      )}

      {/* Progress Indicators */}
      {(isCreatingData || isTesting) && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
          zIndex: 1000
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 15px'
          }}></div>
          <p style={{ margin: 0, fontSize: '16px' }}>
            {isCreatingData ? 'Creating test data...' : 'Running OptaPlanner...'}
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '12px', opacity: 0.8 }}>
            {isTesting ? 'This may take up to 2 minutes' : 'Please wait...'}
          </p>
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default OptaPlannerTestPage;