import React from 'react';

const ProgressBar = ({ progress }) => {
  const progressFillStyle = {
    height: '100%',
    backgroundColor: '#8d8cf6',
    transition: 'width 0.5s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    width: `${progress}%` // dynamic width based on prop
  };

  const progressBarContainer = {
    height: '24px',
    backgroundColor: '#e0e0e0',
    borderRadius: '12px',
    overflow: 'hidden',
    width: '100%',
    maxWidth: '400px',
  };

  return (
    <div style={progressBarContainer}>
      <div style={progressFillStyle}>
        {progress}%
      </div>
    </div>
  );
};

export default ProgressBar;
