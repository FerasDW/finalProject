import React from 'react';
import BaseCard from './BaseCard';
import { getEventStyle, getCourseIcon, getEndTime } from '../../../Static/eventUtils';
import '../../../CSS/Components/BigCalendar/EventTooltip.css';

const EventTooltip = ({ event, position }) => {
  const eventStyle = getEventStyle(event.color);

  // Calculate tooltip position
  const tooltipStyle = {
    left: `${Math.max(10, Math.min(position.x, 1200))}px`,
    top: `${Math.max(position.y - 50, 20)}px`
  };

  return (
    <div className="event-tooltip" style={tooltipStyle}>
      <BaseCard className="tooltip-card">
        <div className="tooltip-content">
          {/* Color Accent Bar */}
          <div 
            className="tooltip-accent"
            style={{ backgroundColor: eventStyle.bg }}
          />
          
          {/* Tooltip Header */}
          <div className="tooltip-header">
            {/* Professor Avatar */}
            <div className="professor-avatar">
              <img 
                src={event.image} 
                alt={event.professor}
                className="avatar-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="avatar-fallback">
                <span>👨‍🏫</span>
              </div>
            </div>
            
            {/* Event Info */}
            <div className="event-info">
              <div className="badges">
                <span 
                  className="type-badge"
                  style={{ backgroundColor: eventStyle.bg }}
                >
                  {event.type}
                </span>
                <div 
                  className="course-icon"
                  style={{ backgroundColor: `${eventStyle.bg}20` }}
                >
                  <span>{getCourseIcon(event.title)}</span>
                </div>
              </div>
              <h3 className="event-title">{event.title}</h3>
              <div className="event-date">
                {new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
          
          {/* Tooltip Details */}
          <div className="tooltip-details">
            {/* Professor Detail */}
            <div className="detail-item">
              <div className="detail-icon professor-icon">
                <span>👨‍🏫</span>
              </div>
              <div className="detail-content">
                <div className="detail-label">Professor</div>
                <div className="detail-value">{event.professor}</div>
              </div>
            </div>
            
            {/* Location Detail */}
            <div className="detail-item">
              <div className="detail-icon location-icon">
                <span>📍</span>
              </div>
              <div className="detail-content">
                <div className="detail-label">Location</div>
                <div className="detail-value">{event.room}</div>
              </div>
            </div>
            
            {/* Time and Duration Grid */}
            <div className="detail-grid">
              <div className="detail-item">
                <div className="detail-icon time-icon">
                  <span>⏰</span>
                </div>
                <div className="detail-content">
                  <div className="detail-label">Time</div>
                  <div className="detail-value">{event.start}</div>
                  <div className="detail-sub">{getEndTime(event.start, event.duration)}</div>
                </div>
              </div>
              
              <div className="detail-item">
                <div className="detail-icon duration-icon">
                  <span>⏱️</span>
                </div>
                <div className="detail-content">
                  <div className="detail-label">Duration</div>
                  <div className="detail-value">{event.duration}</div>
                  <div className="detail-sub">minutes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
  );
};

export default EventTooltip;