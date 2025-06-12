"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../../CSS/Components/Global/EventCalendar.css";

const EventCalendar = () => {
  const [value, onChange] = useState(new Date());

  return (
      <Calendar onChange={onChange} value={value} locale="en-US" />
  );
};

export default EventCalendar;