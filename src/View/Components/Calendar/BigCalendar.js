"use client";

import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";
import "../../../CSS/BigCalendar.css";

const localizer = momentLocalizer(moment);

const calendarEvents = [
    {
      title: "Math",
      allDay: false,
      start: new Date(2025, 2, 12, 8, 0),
      end: new Date(2025, 2, 12, 8, 45),
    },
    {
      title: "English",
      allDay: false,
      start: new Date(2025, 2, 13, 9, 0),
      end: new Date(2025, 2, 13, 9, 45),
    },
    {
        title: "English",
        allDay: false,
        start: new Date(2025, 2, 13, 10, 0),
        end: new Date(2025, 2, 13, 10, 45),
      },
      {
        title: "English",
        allDay: false,
        start: new Date(2025, 2, 13, 11, 0),
        end: new Date(2025, 2, 13, 11, 45),
      },
    {
      title: "Biology",
      allDay: false,
      start: new Date(2025, 2, 11, 10, 0),
      end: new Date(2025, 2, 11, 10, 45),
    },
    {
      title: "Biology",
      allDay: false,
      start: new Date(2025, 2, 14, 10, 0),
      end: new Date(2025, 2, 14, 10, 45),
    },
    {
      title: "Biology",
      allDay: false,
      start: new Date(2025, 2, 11, 14, 45),
      end: new Date(2025, 2, 11, 15, 45),
    },
    {
      title: "Biology",
      allDay: false,
      start: new Date(2025, 2, 9, 10, 0),
      end: new Date(2025, 2, 9, 10, 45),
    },
    {
      title: "Biology",
      allDay: false,
      start: new Date(2025, 2, 10, 14, 0),
      end: new Date(2025, 2, 10, 14, 45),
    },
    {
      title: "Biology",
      allDay: false,
      start: new Date(2025, 2, 12, 11, 0),
      end: new Date(2025, 2, 12, 11, 45),
    },
    {
      title: "Biology",
      allDay: false,
      start: new Date(2025, 2, 11, 13, 0),
      end: new Date(2025, 2, 11, 14, 45),
    },
    {
      title: "Biology",
      allDay: false,
      start: new Date(2025, 2, 15, 14, 0),
      end: new Date(2025, 2, 15, 14, 45),
    }
];

const BigCalendar = () => {
  const [view, setView] = useState(Views.WEEK);
  const [date, setDate] = useState(new Date());

  const handleOnChangeView = (selectedView) => {
    setView(selectedView);
  };

  return (

 

    

      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        views={['month','week', 'day']}
        view={view}
        date={date}
        onNavigate={setDate}
        style={{ height: "98%" }}
        onView={handleOnChangeView}
        min={new Date(2025, 1, 0, 8, 0, 0)}
        max={new Date(2025, 1, 0, 17, 0, 0)}
      />
    
  );
};

export default BigCalendar;
