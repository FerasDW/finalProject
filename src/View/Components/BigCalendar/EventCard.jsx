import React from 'react';
import { getEventPosition, getEventStyle, formatTime, getEndTime } from '../../../Static/eventUtils';
import '../../../CSS/Components/BigCalendar/EventCard.css';

const EventCard = ({ event, dayIndex, onHover, onLeave }) => {
  // Calculate event positioning and styling
  const position = getEventPosition(event.start, event.duration);
  const eventStyle = getEventStyle(event.color);
  const startTime = formatTime(event.start);
  const endTime = getEndTime(event.start, event.duration);

  // Handle mouse enter for tooltip positioning
  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const isRightSide = dayIndex >= 4; // Thursday, Friday, Saturday
    
    const position = {
      x: isRightSide ? rect.left - 420 : rect.right + 10,
      y: rect.top
    };
    
    onHover(event, position);
  };

  return (
    <div
      className="event-card"
      style={{
        top: `${position.top}px`,
        height: `${Math.max(position.height, 32)}px`,
        background: `linear-gradient(135deg, ${eventStyle.bg}dd, ${eventStyle.bg}ee)`,
        color: eventStyle.text,
        borderLeftColor: eventStyle.bg,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onLeave}
    >
      {/* Gradient Overlay */}
      <div className="event-overlay"></div>
      
      {/* Event Content */}
      <div className="event-content">
        {/* Event Header */}
        <div className="event-header">
          <span className="event-type-badge">
            {event.type}
          </span>
        </div>
        
        {/* Event Details */}
        <div className="event-title">{event.title}</div>
        <div className="event-professor">👨‍🏫 {event.professor}</div>
        <div className="event-room">📍 {event.room}</div>
        
        {/* Event Time */}
        <div className="event-time">
          <div className="time-display">
            {startTime} - {endTime}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;