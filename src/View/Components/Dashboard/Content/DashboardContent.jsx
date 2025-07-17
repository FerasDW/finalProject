import React, { useState } from "react";
import Box from "./Box";
import BarChart from "../../Charts/barChart";
import PieChart from "../../Charts/pieCharts";
import LineChart from "../../Charts/lineChart";
import ScrollList from "../../ScrollList/ScrollList";
import ScrollListItem from "../../ScrollList/ScrollListItem";
import dashboardContentData from "../../../../Utils/dashboardUtils";
import  { upcomingAssignments } from "../../../../Static/FIxed/calendarPageData";  
import assignmentFields from "../../../../Static/AssigmentsFields";

import Popup from "../../Cards/PopUp";
import DynamicForm from "../../Forms/dynamicForm";

const DashboardContent = ({ userRole }) => {
  /* ----------------------------- state ----------------------------- */
  const [assignments, setAssignments] = useState(upcomingAssignments); // ← ננהל כאן
  const [isPopupOpen,   setPopupOpen]   = useState(false);
  const [popupMode,     setPopupMode]   = useState("add"); // "add" | "edit"
  const [editingItem,   setEditingItem] = useState(null);  // ערכים לטופס

  const content = dashboardContentData[userRole];
  if (!content) return <p>No content available for this role.</p>;

  /* --------------------------- handlers --------------------------- */
  const openAddPopup  = () => { setPopupMode("add");  setEditingItem(null);  setPopupOpen(true); };
  const openEditPopup = (item) => { console.log(item); setPopupMode("edit"); setEditingItem(item); setPopupOpen(true); };
  const closePopup    = () => setPopupOpen(false);

  /** Add new OR update existing */
  const handleFormSubmit = (data) => {
    if (popupMode === "add") {
      setAssignments((prev) => [
        ...prev,
        { ...data, id: Date.now() }   // מזהה דמה
      ]);
    } else {
      setAssignments((prev) =>
        prev.map((a) => (a.id === editingItem.id ? { ...editingItem, ...data } : a))
      );
    }
    closePopup();
  };

  /* ---------------------------- render ---------------------------- */
  return (
    <>
      <div className="content">
        <div className="row">
          {content.map(({ type, props }, index) => {
            if (type === "box") return <Box key={index} {...props} />;

            if (type === "chart") {
              const ChartComp = {
                bar:  <BarChart  data={props.chartData} />,
                pie:  <PieChart  data={props.chartData} />,
                line: <LineChart data={props.chartData} />,
              }[props.chartType];

              return <Box key={index} title={props.title} chart={ChartComp} {...props} />;
            }
            if (type === "assignments") {
              return (
                <Box
                  
                  key={index}
                  assignments={
                    <ScrollList
                      layout="list"
                      title="Assignments"
                      items={assignments}        
                      showSearch={false}
                      showFilters={false}
                      showStats={false}
                      onAddNew={openAddPopup}    
                      renderItem={(assignment) => (
                        <ScrollListItem
                          item={assignment}
                          variant={assignment.type}
                          showProgress={false}
                          showBadges={false}
                          showDescription={false}
                          showFooter={false}
                          showActions
                          onEdit={() => openEditPopup(assignment)}  
                          onDelete={() =>
                            setAssignments((prev) => prev.filter((a) => a.id !== assignment.id))
                          }
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

      {/* --------------------------- Popup --------------------------- */}
      <Popup isOpen={isPopupOpen} onClose={closePopup}>
        <DynamicForm
          title={popupMode === "add" ? "Add Assignment" : "Edit Assignment"}
          fields={assignmentFields}
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
