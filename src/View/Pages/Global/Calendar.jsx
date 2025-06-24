import React, { useState } from "react";
import WeeklyCalendar from "../../Components/BigCalendar/WeeklyCalendar";
import MiniCalendar from "../../Components/BigCalendar/MiniCalendar";
import ScrollList from "../../Components/ScrollList/ScrollList";
import ScrollListItem from "../../Components/ScrollList/ScrollListItem";
import { upcomingAssignments } from "../../../Static/dashboardContentData";
import Popup from "../../Components/Cards/PopUp";
import DynamicForm from "../../Components/Forms/dynamicForm";
import assignmentFields from "../../../Static/AssigmentsFields";
const CalendarDashboard = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [assignments, setAssignments] = useState(upcomingAssignments); 
  const [isPopupOpen,   setPopupOpen]   = useState(false);
    const [popupMode,     setPopupMode]   = useState("add"); // "add" | "edit"
    const [editingItem,   setEditingItem] = useState(null);  

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

  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        backgroundColor: "#f8fafc",
        minHeight: "250vh",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            marginBottom: "32px",
          }}
        >
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "800",
              color: "#1f2937",
              margin: "0 0 8px 0",
              letterSpacing: "-0.025em",
            }}
          >
            Academic Calendar
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "#64748b",
              margin: 0,
            }}
          >
            Manage your schedule, assignments, and upcoming events
          </p>
        </div>

        {/* Main Grid Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 350px",
            gap: "32px",
            alignItems: "start",
          }}
        >
          {/* Left Column - Weekly Calendar */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            <WeeklyCalendar currentDate={currentDate} />
          </div>

          {/* Right Column - Mini Calendar & Assignments */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            <MiniCalendar
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              onMonthChange={setCurrentDate}
            />
            <div style={{ height: "750px" }}>
              <ScrollList
                title="Assignments "
                items={upcomingAssignments}
                renderItem={(assignment) => (
                  <ScrollListItem
                    showActions={true}
                    item={assignment}
                    variant={assignment.type}
                    showProgress={true}
                    showBadges={true}
                    showDescription={true}
                    showFooter={true}
                          onEdit={() => openEditPopup(assignment)}  
                          onDelete={() =>
                            setAssignments((prev) => prev.filter((a) => a.id !== assignment.id))
                          }
                  />
                )}
                onAddNew={openAddPopup}   
                showSearch={true}
                showFilters={true}
                showStats={true}
                layout="list" // 'grid' or 'list'
              />

              <Popup isOpen={isPopupOpen} onClose={closePopup}>
                <DynamicForm
                  title={
                    popupMode === "add" ? "Add Assignment" : "Edit Assignment"
                  }
                  fields={assignmentFields}
                  initialData={editingItem || {}}
                  submitText={popupMode === "add" ? "Add" : "Save"}
                  cancelText="Cancel"
                  onSubmit={handleFormSubmit}
                  onCancel={closePopup}
                />
              </Popup>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarDashboard;
