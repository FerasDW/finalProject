import React from "react";

const RequestsList = ({ requests }) => {
  if (!requests || requests.length === 0) {
    return <div className="no-data">No requests found</div>;
  }

  return (
    <div className="requests-list">
      {requests.map((request) => (
        <div key={request.id} className="request-item">
          <div className="request-header">
            <h4>{request.type}</h4>
            <span className={`status ${request.status}`}>{request.status}</span>
          </div>
          <div className="request-details">
            <p><strong>Course:</strong> {request.course}</p>
            <p><strong>Reason:</strong> {request.reason}</p>
            <p><strong>Date Submitted:</strong> {request.dateSubmitted}</p>
            <p><strong>Priority:</strong> {request.priority}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RequestsList;