import { useState } from "react";
import { upcomingAssignments } from "../Static/FIxed/calendarPageData.js";

const useCalendarDashboard = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [assignments, setAssignments] = useState(upcomingAssignments);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [popupMode, setPopupMode] = useState("add");
  const [editingItem, setEditingItem] = useState(null);

  const openAddPopup = () => {
    setPopupMode("add");
    setEditingItem(null);
    setPopupOpen(true);
  };

  const openEditPopup = (item) => {
    console.log(item);
    setPopupMode("edit");
    setEditingItem(item);
    setPopupOpen(true);
  };

  const closePopup = () => setPopupOpen(false);

  const handleFormSubmit = (data) => {
    if (popupMode === "add") {
      setAssignments((prev) => [
        ...prev,
        { ...data, id: Date.now() }
      ]);
    } else {
      setAssignments((prev) =>
        prev.map((a) => (a.id === editingItem.id ? { ...editingItem, ...data } : a))
      );
    }
    closePopup();
  };

  return {
    currentDate,
    setCurrentDate,
    assignments,
    setAssignments,
    isPopupOpen,
    popupMode,
    editingItem,
    openAddPopup,
    openEditPopup,
    closePopup,
    handleFormSubmit,
  };
};

export default useCalendarDashboard;