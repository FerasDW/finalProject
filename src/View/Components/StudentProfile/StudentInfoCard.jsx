import React from 'react';
import { Mail, Phone, MapPin, Calendar, Users } from 'lucide-react';
import './StudentInfoCard.css';

const StudentInfoCard = ({ student }) => {
  return (
    <div className="student-info-card">
      {/* Header with avatar, name, ID, and status */}
      <div className="student-card-header">
        <div className="student-header-content">
          <img
            src={student.avatar}
            alt={student.name}
            className="student-avatar"
          />
          <div className="student-basic-info">
            <h2 className="student-name">{student.name}</h2>
            <p className="student-id">ID: {student.id}</p>
            <span className="status-badge">{student.status}</span>
          </div>
        </div>
      </div>

      {/* Body with contact details on left and quick stats on right */}
      <div className="student-card-body">
        {/* Left side - Contact Details */}
        <div className="student-details-section">
          <h3>Contact Information</h3>
          <div className="detail-item">
            <Mail />
            <span>{student.email}</span>
          </div>
          <div className="detail-item">
            <Phone />
            <span>{student.phone}</span>
          </div>
          <div className="detail-item">
            <MapPin />
            <span className="address">{student.address}</span>
          </div>
          <div className="detail-item">
            <Calendar />
            <span>
              Born: {new Date(student.dateOfBirth).toLocaleDateString()}
            </span>
          </div>
          <div className="detail-item">
            <Users />
            <span>Academic Advisor: Dr. Sarah Wilson</span>
          </div>
        </div>

        {/* Right side - Quick Stats */}
        <div className="quick-stats-section">
          <h3>Quick Stats</h3>
          <div className="stats-grid">
            <div className="stat-item stat-gpa">
              <div className="stat-value">{student.gpa}</div>
              <div className="stat-label">GPA</div>
            </div>
            <div className="stat-item stat-year">
              <div className="stat-value">{student.year}</div>
              <div className="stat-label">Year</div>
            </div>
            <div className="stat-item stat-major">
              <div className="stat-major-value">{student.major}</div>
              <div className="stat-label">Major</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentInfoCard;