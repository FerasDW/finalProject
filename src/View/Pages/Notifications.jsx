// File: View/Pages/Global/Notifications.jsx
import React from "react";

const Notifications = () => {
  return (
    <div className="notifications-page">
      <h1>Notifications</h1>
      <div className="notifications-content">
        <div className="notification-item">
          <h3>New Assignment Posted</h3>
          <p>Math homework has been assigned for March 15, 2025</p>
          <span className="timestamp">2 hours ago</span>
        </div>
        <div className="notification-item">
          <h3>Grade Updated</h3>
          <p>Your Science report grade has been updated</p>
          <span className="timestamp">1 day ago</span>
        </div>
        <div className="notification-item">
          <h3>Class Reminder</h3>
          <p>Psychology class starts in 30 minutes</p>
          <span className="timestamp">3 days ago</span>
        </div>
      </div>
    </div>
  );
};

export default Notifications;

// // File: View/Pages/Global/Notifications.jsx
// import React, { useState, useEffect, useContext } from "react";
// import { AuthContext } from "../../../Context/AuthContext";
// import Loader from "../Global/Loading";
// import "../../../CSS/Pages/Notifications.css"; // You'll need to create this CSS file

// const Notifications = () => {
//   const { authData } = useContext(AuthContext);
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filter, setFilter] = useState("all"); // all, unread, read
//   const [selectedType, setSelectedType] = useState("all"); // all, assignment, grade, announcement, system
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);

//   // Fetch notifications from backend
//   const fetchNotifications = async (pageNum = 1, append = false) => {
//     try {
//       if (pageNum === 1) setLoading(true);
//       setError(null);

//       const queryParams = new URLSearchParams({
//         page: pageNum,
//         limit: 20,
//         filter: filter,
//         type: selectedType
//       });

//       // Replace with your actual API endpoint
//       const response = await fetch(`/api/notifications/${authData.userId}?${queryParams}`, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${authData.token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch notifications');
//       }

//       const data = await response.json();
      
//       if (append) {
//         setNotifications(prev => [...prev, ...data.notifications]);
//       } else {
//         setNotifications(data.notifications || []);
//       }
      
//       setHasMore(data.hasMore || false);
//       setPage(pageNum);
//     } catch (err) {
//       setError(err.message);
//       console.error('Error fetching notifications:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Mark notification as read
//   const markAsRead = async (notificationId) => {
//     try {
//       const response = await fetch(`/api/notifications/${notificationId}/read`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${authData.token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Failed to mark notification as read');
//       }

//       // Update local state
//       setNotifications(prev => 
//         prev.map(notification => 
//           notification.id === notificationId 
//             ? { ...notification, isRead: true, readAt: new Date().toISOString() }
//             : notification
//         )
//       );
//     } catch (err) {
//       console.error('Error marking notification as read:', err);
//     }
//   };

//   // Mark all notifications as read
//   const markAllAsRead = async () => {
//     try {
//       const response = await fetch(`/api/notifications/${authData.userId}/read-all`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${authData.token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Failed to mark all notifications as read');
//       }

//       // Update local state
//       setNotifications(prev => 
//         prev.map(notification => ({
//           ...notification,
//           isRead: true,
//           readAt: new Date().toISOString()
//         }))
//       );
//     } catch (err) {
//       console.error('Error marking all notifications as read:', err);
//     }
//   };

//   // Delete notification
//   const deleteNotification = async (notificationId) => {
//     try {
//       const response = await fetch(`/api/notifications/${notificationId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${authData.token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Failed to delete notification');
//       }

//       // Remove from local state
//       setNotifications(prev => 
//         prev.filter(notification => notification.id !== notificationId)
//       );
//     } catch (err) {
//       console.error('Error deleting notification:', err);
//     }
//   };

//   // Load more notifications (pagination)
//   const loadMoreNotifications = () => {
//     if (hasMore && !loading) {
//       fetchNotifications(page + 1, true);
//     }
//   };

//   useEffect(() => {
//     if (authData?.userId && authData?.token) {
//       fetchNotifications(1, false);
//     }
//   }, [authData, filter, selectedType]);

//   // Filter notifications
//   const filteredNotifications = notifications.filter(notification => {
//     if (filter === "unread" && notification.isRead) return false;
//     if (filter === "read" && !notification.isRead) return false;
//     return true;
//   });

//   // Get notification icon based on type
//   const getNotificationIcon = (type) => {
//     const icons = {
//       assignment: "📝",
//       grade: "📊",
//       announcement: "📢",
//       system: "⚙️",
//       reminder: "⏰",
//       message: "💬"
//     };
//     return icons[type] || "📱";
//   };

//   // Format relative time
//   const formatRelativeTime = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffInSeconds = Math.floor((now - date) / 1000);

//     if (diffInSeconds < 60) return "Just now";
//     if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
//     if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
//     if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
//     return date.toLocaleDateString();
//   };

//   // Retry function for failed requests
//   const handleRetry = () => {
//     fetchNotifications(1, false);
//   };

//   if (loading && notifications.length === 0) return <Loader />;

//   const unreadCount = notifications.filter(n => !n.isRead).length;

//   return (
//     <div className="notifications-page">
//       <div className="notifications-header">
//         <h1>Notifications</h1>
//         <div className="notifications-actions">
//           <span className="unread-count">
//             {unreadCount} unread
//           </span>
//           {unreadCount > 0 && (
//             <button onClick={markAllAsRead} className="mark-all-read-btn">
//               Mark all as read
//             </button>
//           )}
//         </div>
//       </div>

//       {error && (
//         <div className="error-message">
//           <p>Error: {error}</p>
//           <button onClick={handleRetry} className="retry-btn">Retry</button>
//         </div>
//       )}

//       <div className="notifications-filters">
//         <div className="filter-group">
//           <select 
//             value={filter} 
//             onChange={(e) => setFilter(e.target.value)}
//             className="status-filter"
//           >
//             <option value="all">All Notifications</option>
//             <option value="unread">Unread Only</option>
//             <option value="read">Read Only</option>
//           </select>

//           <select 
//             value={selectedType} 
//             onChange={(e) => setSelectedType(e.target.value)}
//             className="type-filter"
//           >
//             <option value="all">All Types</option>
//             <option value="assignment">Assignments</option>
//             <option value="grade">Grades</option>
//             <option value="announcement">Announcements</option>
//             <option value="system">System</option>
//             <option value="reminder">Reminders</option>
//           </select>
//         </div>
//       </div>

//       <div className="notifications-content">
//         {filteredNotifications.length === 0 ? (
//           <div className="no-notifications">
//             <p>No notifications found.</p>
//           </div>
//         ) : (
//           <>
//             <div className="notifications-list">
//               {filteredNotifications.map((notification) => (
//                 <div 
//                   key={notification.id} 
//                   className={`notification-item ${!notification.isRead ? 'unread' : 'read'}`}
//                   onClick={() => !notification.isRead && markAsRead(notification.id)}
//                 >
//                   <div className="notification-icon">
//                     {getNotificationIcon(notification.type)}
//                   </div>
                  
//                   <div className="notification-content">
//                     <div className="notification-header">
//                       <h3 className="notification-title">{notification.title}</h3>
//                       <span className="notification-time">
//                         {formatRelativeTime(notification.createdAt)}
//                       </span>
//                     </div>
                    
//                     <p className="notification-message">{notification.message}</p>
                    
//                     {notification.actionUrl && (
//                       <a 
//                         href={notification.actionUrl} 
//                         className="notification-action"
//                         onClick={(e) => e.stopPropagation()}
//                       >
//                         {notification.actionText || "View Details"}
//                       </a>
//                     )}
                    
//                     <div className="notification-meta">
//                       <span className={`notification-type ${notification.type}`}>
//                         {notification.type}
//                       </span>
//                       {notification.priority && (
//                         <span className={`notification-priority ${notification.priority}`}>
//                           {notification.priority}
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   <div className="notification-actions">
//                     {!notification.isRead && (
//                       <button 
//                         className="mark-read-btn"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           markAsRead(notification.id);
//                         }}
//                         title="Mark as read"
//                       >
//                         ✓
//                       </button>
//                     )}
//                     <button 
//                       className="delete-btn"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         deleteNotification(notification.id);
//                       }}
//                       title="Delete notification"
//                     >
//                       ✕
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {hasMore && (
//               <div className="load-more-section">
//                 <button 
//                   onClick={loadMoreNotifications} 
//                   className="load-more-btn"
//                   disabled={loading}
//                 >
//                   {loading ? "Loading..." : "Load More"}
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Notifications;