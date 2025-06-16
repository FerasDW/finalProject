import React, { useState } from 'react';
import BaseCard from './BaseCard';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import EventTooltip from './EventTooltip';
import { SAMPLE_EVENTS } from '../../../Static/CalendarEvents';
import { getWeekDates, formatDateToString } from '../../../Static/dateUtils';
import '../../../CSS/Components/BigCalendar/WeeklyCalendar.css';

const WeeklyCalendar = () => {
  // State management
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 15));
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [events] = useState(SAMPLE_EVENTS);

  // Week navigation handler
  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  // Event hover handlers
  const handleEventHover = (event, position) => {
    setHoveredEvent(event);
    setHoverPosition(position);
  };

  const handleEventLeave = () => {
    setHoveredEvent(null);
  };

  // Calculate week dates and filter events
  const weekDates = getWeekDates(currentDate);
  const weekEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return weekDates.some(date => 
      formatDateToString(date) === event.date
    );
  });

  return (
    <div className="weekly-calendar">
      <div className="calendar-container">
        {/* Calendar Header with Navigation */}
        <CalendarHeader 
          weekDates={weekDates}
          onNavigate={navigateWeek}
        />
        
        {/* Main Calendar Grid wrapped in BaseCard */}
        <BaseCard className="calendar-card">
          <CalendarGrid
            weekDates={weekDates}
            events={weekEvents}
            currentDate={currentDate}
            onEventHover={handleEventHover}
            onEventLeave={handleEventLeave}
          />
        </BaseCard>

        {/* Event Tooltip */}
        {hoveredEvent && (
          <EventTooltip
            event={hoveredEvent}
            position={hoverPosition}
          />
        )}
      </div>
    </div>
  );
};

export default WeeklyCalendar;