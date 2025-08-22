import React, { useState, useEffect } from "react";
import Box from "./Box";
import BarChart from "../../Charts/barChart";
import PieChart from "../../Charts/pieCharts";
import LineChart from "../../Charts/lineChart";
import ScrollList from "../../ScrollList/ScrollList";
import ScrollListItem from "../../ScrollList/ScrollListItem";
import dashboardContentData from "../../../../Utils/dashboardUtils";
import assignmentFields from "../../../../Static/AssigmentsFields";
import Popup from "../../Cards/PopUp";
import DynamicForm from "../../Forms/dynamicForm";

import {
  getDashboardData,
  getAssignmentFormOptions,
  addAssignment,
  updateAssignment,
  deleteAssignment,
} from "../../../../Api/dashboardPageApi";

const DashboardContent = ({ userRole }) => {
  const [dashboardApiData, setDashboardApiData] = useState({
    stats: {},
    charts: { departmentEnrollment: [], systemUsage: [], annualEnrollment: [] },
    assignments: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [popupMode, setPopupMode] = useState("add");
  const [editingItem, setEditingItem] = useState(null);
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [dynamicFields, setDynamicFields] = useState(assignmentFields);

  const content = dashboardContentData[userRole];

  // Define color schemes for different charts - Beautiful & Calm Colors
  const chartColorSchemes = {
    // Department Enrollment - Calm Ocean Vibes
    departmentEnrollment: [
      '#4ECDC4', // Turquoise
      '#45B7D1', // Sky Blue
      '#96CEB4', // Mint Green
      '#87CEEB', // Sky Blue Light
      '#20B2AA', // Light Sea Green
      '#5DADE2', // Light Blue
      '#58D68D', // Light Green
      '#85C1E9', // Light Steel Blue
      '#7FB3D3', // Powder Blue
      '#76D7C4'  // Aqua Marine
    ],
    
    // System Usage - Professional Bright
    systemUsage: [
      '#00CED1', // Dark Turquoise
      '#32CD32', // Lime Green
      '#4169E1', // Royal Blue
      '#00FA9A', // Medium Spring Green
      '#1E90FF', // Dodger Blue
      '#3CB371', // Medium Sea Green
      '#6495ED', // Cornflower Blue
      '#40E0D0'  // Turquoise
    ],
    
    // Department GPA - Elegant Blues & Greens
    departmentGPA: [
      '#00BFFF', // Deep Sky Blue
      '#00CED1', // Dark Turquoise
      '#32CD32', // Lime Green
      '#4169E1', // Royal Blue
      '#00FA9A', // Medium Spring Green
      '#1E90FF', // Dodger Blue
      '#20B2AA', // Light Sea Green
      '#5DADE2'  // Light Blue
    ]
  };

  // Function to calculate better range for charts
  const calculateChartRange = (data, valueKey = 'value') => {
    if (!data || data.length === 0) return { min: 0, max: 100 };
    
    const values = data.map(item => item[valueKey] || 0);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    
    // Add 20% padding to the range
    const padding = (maxValue - minValue) * 0.2;
    const rangeMax = Math.ceil(maxValue + padding);
    const rangeMin = Math.max(0, Math.floor(minValue - padding));
    
    return { min: rangeMin, max: rangeMax };
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [formOptions, dashboardData] = await Promise.all([
          getAssignmentFormOptions(),
          getDashboardData(userRole)
        ]);
        
        setCourses(formOptions.courses || []);
        setLecturers(formOptions.instructors || []);

        if (dashboardData && dashboardData.stats && dashboardData.charts && dashboardData.assignments) {
          setDashboardApiData(dashboardData);
        }
      } catch (error) {
        console.error("Failed to fetch initial dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [userRole]);

  useEffect(() => {
    const updatedFields = assignmentFields.map(field => {
      if (field.name === 'course') {
        return { ...field, options: courses.map(c => ({ value: c.id, label: c.name })) };
      }
      if (field.name === 'instructor') {
        return { ...field, options: lecturers.map(l => ({ value: l.id, label: l.name })) };
      }
      return field;
    });
    setDynamicFields(updatedFields);
  }, [courses, lecturers]);

  const openAddPopup = () => { setPopupMode("add"); setEditingItem(null); setPopupOpen(true); };
  const openEditPopup = (item) => { setPopupMode("edit"); setEditingItem(item); setPopupOpen(true); };
  const closePopup = () => setPopupOpen(false);

  const handleFormSubmit = async (data) => {
    try {
      if (popupMode === "add") await addAssignment(data);
      else await updateAssignment(editingItem.id, data);
      const freshData = await getDashboardData(userRole);
      setDashboardApiData(freshData);
      closePopup();
    } catch (error) {
      console.error("Failed to submit assignment:", error);
    }
  };

  const handleDelete = async (assignmentId) => {
    try {
      await deleteAssignment(assignmentId);
      const freshData = await getDashboardData(userRole);
      setDashboardApiData(freshData);
    } catch (error) {
      console.error("Failed to delete assignment:", error);
    }
  };

  if (isLoading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Dashboard...</div>;
  }
  
  if (!content) {
    return <p>No dashboard layout available for this role.</p>;
  }

  return (
    <>
      <div className="content">
        <div className="row">
          {content.map(({ type, props }, index) => {
            // This block handles the top 3 summary cards
            if (type === "box") {
              let subtitle = props.subtitle; // Start with the static subtitle
              if (props.title === "User Management") {
                subtitle = `${dashboardApiData.stats.activeUsers || 0} Active Users`;
              } else if (props.title === "Institution Overview") {
                subtitle = `${dashboardApiData.stats.activeDepartments || 0} Departments Active`;
              } else if (props.title === "System Analytics") {
                subtitle = dashboardApiData.stats.systemHealth || 'Status Unknown';
              }
              // Pass all original props, but explicitly overwrite the subtitle
              return <Box key={index} {...props} subtitle={subtitle} />;
            }

            if (type === "chart") {
              const chartDataMap = {
                bar: dashboardApiData.charts.departmentEnrollment,
                pie: dashboardApiData.charts.systemUsage,
                line: dashboardApiData.charts.annualEnrollment, // This now contains department GPA data
              };
              const chartData = chartDataMap[props.chartType] || [];

              // APPROACH 1: Add color property to each data item
              const enhanceDataWithColors = (data, colorScheme) => {
                return data.map((item, index) => ({
                  ...item,
                  color: colorScheme[index % colorScheme.length]
                }));
              };

              // Get colors for this specific chart
              let chartColors;
              let chartRange;
              let enhancedData = chartData;
              let chartAxisLabel = 'Value'; // Default axis label
              
              if (props.chartType === 'bar') {
                chartColors = chartColorSchemes.departmentEnrollment;
                chartRange = calculateChartRange(chartData);
                enhancedData = enhanceDataWithColors(chartData, chartColors);
                chartAxisLabel = 'Enrollments'; // Bar chart shows enrollment data
              } else if (props.chartType === 'pie') {
                chartColors = chartColorSchemes.systemUsage;
                chartRange = null; // Pie charts don't need range
                enhancedData = enhanceDataWithColors(chartData, chartColors);
                chartAxisLabel = 'Usage'; // Pie chart shows usage data
              } else if (props.chartType === 'line') {
                chartColors = chartColorSchemes.departmentGPA;
                chartRange = calculateChartRange(chartData);
                enhancedData = enhanceDataWithColors(chartData, chartColors);
                chartAxisLabel = 'GPA'; // Line chart (rendered as bar) shows GPA data
              }

              let chartComponent;
              if (chartData.length > 0) {
                // For line chart showing department GPA, we might want to use a bar chart instead for better visualization
                if (props.chartType === 'line') {
                  // Use bar chart for department GPA visualization
                  chartComponent = (
                    <BarChart 
                      data={enhancedData} 
                      colors={chartColors}
                      valueRange={chartRange}
                      colorMode="data" // Tell chart to use colors from data
                      axisLabel={chartAxisLabel} // Pass the correct axis label
                    />
                  );
                } else {
                  const ChartComponents = { 
                    bar: (
                      <BarChart 
                        data={enhancedData} 
                        colors={chartColors}
                        valueRange={chartRange}
                        colorMode="data" // Tell chart to use colors from data
                        axisLabel={chartAxisLabel} // Pass the correct axis label
                      />
                    ), 
                    pie: (
                      <PieChart 
                        data={enhancedData} 
                        colors={chartColors}
                        colorMode="data"
                      />
                    ), 
                    line: (
                      <LineChart 
                        data={enhancedData} 
                        colors={chartColors}
                        valueRange={chartRange}
                        colorMode="data"
                        axisLabel={chartAxisLabel} // Pass the correct axis label
                      />
                    ) 
                  };
                  chartComponent = ChartComponents[props.chartType];
                }
              } else {
                chartComponent = <div style={{ textAlign: 'center', padding: '20px' }}>No data available.</div>;
              }
              
              // Update chart title if it's the line chart (now showing GPA data)
              let chartTitle = props.title;
              if (props.chartType === 'line') {
                chartTitle = "Department Average GPA";
              }
              
              return <Box key={index} {...props} title={chartTitle} chart={chartComponent} />;
            }

            if (type === "assignments") {
              return (
                <Box
                  key={index}
                  assignments={
                    <ScrollList
                      showSearch={false}
                      showFilters={false}
                      showStats={false}
                      layout="list"
                      title="Assignments"
                      items={dashboardApiData.assignments}
                      onAddNew={openAddPopup}
                      renderItem={(assignment) => (
                        <ScrollListItem
                          item={assignment}
                          variant={assignment.type}
                          showActions
                          onEdit={() => openEditPopup(assignment)}
                          onDelete={() => handleDelete(assignment.id)}
                        />
                      )}
                    />
                  }
                />
              );
            }
            return null;
          })}
        </div>
      </div>

      <Popup isOpen={isPopupOpen} onClose={closePopup}>
        <DynamicForm
          title={popupMode === "add" ? "Add Assignment" : "Edit Assignment"}
          fields={dynamicFields}
          initialData={editingItem || {}}
          submitText={popupMode === "add" ? "Add" : "Save"}
          cancelText="Cancel"
          onSubmit={handleFormSubmit}
          onCancel={closePopup}
        />
      </Popup>
    </>
  );
};

export default DashboardContent;