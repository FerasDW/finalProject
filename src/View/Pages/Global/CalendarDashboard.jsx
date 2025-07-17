import React from "react";
import WeeklyCalendar from "../../Components/BigCalendar/WeeklyCalendar";
import MiniCalendar from "../../Components/BigCalendar/MiniCalendar";
import ScrollList from "../../Components/ScrollList/ScrollList";
import ScrollListItem from "../../Components/ScrollList/ScrollListItem";
import Popup from "../../Components/Cards/PopUp";
import DynamicForm from "../../Components/Forms/dynamicForm";
import useCalendarDashboard from "../../../Hooks/useCalendarDashboard.js";
import { assignmentFields } from "../../../Utils/calendarUtils.js";
import styles from "./CalendarDashboard.module.css";

const CalendarDashboard = () => {
  const {
    currentDate,
    setCurrentDate,
    assignments,
    isPopupOpen,
    popupMode,
    editingItem,
    openAddPopup,
    openEditPopup,
    closePopup,
    handleFormSubmit,
  } = useCalendarDashboard();

  return (
    <div className={styles.calendarPageContainer}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Academic Calendar</h1>
        <p className={styles.subtitle}>
          Manage your schedule, assignments, and upcoming events
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className={styles.gridLayout}>
        {/* Left Column - Weekly Calendar */}
        <div className={styles.leftColumn}>
          <WeeklyCalendar currentDate={currentDate} />
        </div>

        {/* Right Column - Mini Calendar & Assignments */}
        <div className={styles.rightColumn}>
          <MiniCalendar
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            onMonthChange={setCurrentDate}
          />
          <div className={styles.assignmentsContainer}>
            <ScrollList
              title="Assignments"
              items={assignments}
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
                    assignments.filter((a) => a.id !== assignment.id)
                  }
                />
              )}
              onAddNew={openAddPopup}
              showSearch={true}
              showFilters={true}
              showStats={true}
              layout="list"
            />
          </div>
        </div>
      </div>

      {/* Popup Modal */}
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
  );
};

export default CalendarDashboard;