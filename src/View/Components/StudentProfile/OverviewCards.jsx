import React from 'react';
import { BookOpen, Award, Clock, TrendingUp } from 'lucide-react';
import BaseCard from './BaseCard';
import './OverviewCards.css';

const OverviewCards = () => {
  const statsCards = [
    {
      title: "Total Credits",
      value: "86",
      icon: <BookOpen />,
      gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
    },
    {
      title: "Completed Courses", 
      value: "24",
      icon: <Award />,
      gradient: "linear-gradient(135deg, #10b981 0%, #047857 100%)"
    },
    {
      title: "Pending Requests",
      value: "1", 
      icon: <Clock />,
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)"
    }
  ];

  return (
    <div className="overview-cards-container">
      <div className="overview-cards-grid">
        {statsCards.map((card, index) => (
          <BaseCard
            key={index}
            variant="gradient"
            className="overview-stat-card"
            gradient={card.gradient}
          >
            <div className="overview-card-content">
              <div className="overview-card-info">
                <p className="overview-card-label">{card.title}</p>
                <p className="overview-card-value">{card.value}</p>
              </div>
              <div className="overview-card-icon">
                {card.icon}
              </div>
            </div>
          </BaseCard>
        ))}
        
        {/* Academic Progress Card */}
        <BaseCard
          title="Academic Progress"
          className="progress-card"
          icon={<div className="progress-icon-bar"></div>}
        >
          <div className="progress-items">
            <div className="progress-item">
              <div className="progress-header">
                <span>Degree Progress</span>
                <span>71%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill-blue" style={{ width: "71%" }}></div>
              </div>
            </div>
            <div className="progress-item">
              <div className="progress-header">
                <span>GPA Trend</span>
                <span className="progress-trend">
                  <TrendingUp />
                  +0.12
                </span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill-green" style={{ width: "85%" }}></div>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  );
};

export default OverviewCards;