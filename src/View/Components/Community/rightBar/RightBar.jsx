import "./rightBar.scss";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  friendRequests,
  activities,
  users,
  currentUser,
} from "../../../../Static/communityData";
import { useFriends } from "../../../../Context/FriendContext";

const RightBar = () => {
  const [requests, setRequests] = useState(friendRequests);
  const navigate = useNavigate();
  const { addFriend, friendsList } = useFriends();

  // Filter online friends to only show actual friends
  const onlineFriends = useMemo(() => {
    const friendIds = friendsList.map(friend => friend.id);
    return users.filter(user => 
      friendIds.includes(user.id) && user.id !== currentUser.id
    ).slice(0, 5); // Limit to 5 online friends
  }, [friendsList]);

  // Filter activities to only show friends' activities (exclude current user)
  const friendActivities = useMemo(() => {
    const friendIds = friendsList.map(friend => friend.id);
    return activities.filter(activity => 
      friendIds.includes(activity.id) && activity.id !== currentUser.id
    );
  }, [friendsList]);

  const handleAccept = (user) => {
    // Add to friends list
    const friendData = {
      id: user.id,
      name: user.name,
      profilePic: user.img,
      role: "Student", // You might want to get this from somewhere else
      title: "New Friend",
      university: "Yezreel Valley College",
    };
    addFriend(friendData);

    // Remove from friend requests
    setRequests((prev) => prev.filter((req) => req.id !== user.id));
  };

  const handleReject = (userId) => {
    // Just remove from friend requests
    setRequests((prev) => prev.filter((req) => req.id !== userId));
  };

  const handleNameClick = (userId) => {
    // Navigate to user's profile
    navigate(`/community/profile/${userId}`);
  };

  return (
    <div className="rightBar">
      <div className="rightBarMenus">
        <div className="item">
          <span>Friend Requests</span>
          {requests.map((user) => (
            <div className="user" key={user.id}>
              <div className="userInfo">
                <img src={user.img} alt={user.name} />
                <span
                  onClick={() => handleNameClick(user.id)}
                  style={{ cursor: "pointer", color: "#5271ff" }}
                >
                  {user.name}
                </span>
              </div>
              <div className="buttons">
                <button onClick={() => handleAccept(user)}>Accept</button>
                <button onClick={() => handleReject(user.id)}>Reject</button>
              </div>
            </div>
          ))}
          {requests.length === 0 && (
            <p style={{ color: "#999", fontSize: "14px", fontStyle: "italic" }}>
              No pending friend requests
            </p>
          )}
        </div>

        <div className="item">
          <span>Latest Activities</span>
          {friendActivities.length > 0 ? (
            friendActivities.map((activity) => (
              <div className="user" key={activity.id}>
                <div className="userInfo">
                  <img src={activity.img} alt={activity.name} />
                  <p>
                    <span 
                      onClick={() => handleNameClick(activity.id)}
                      style={{ cursor: "pointer", color: "#5271ff" }}
                    >
                      {activity.name}
                    </span> {activity.action}
                  </p>
                </div>
                <span>{activity.time}</span>
              </div>
            ))
          ) : (
            <p style={{ color: "#999", fontSize: "14px", fontStyle: "italic" }}>
              No recent activities from friends
            </p>
          )}
        </div>

        <div className="item">
          <span>Online Friends</span>
          {onlineFriends.length > 0 ? (
            onlineFriends.map((user) => (
              <div className="user" key={user.id}>
                <div className="userInfo">
                  <img src={user.profilePic} alt={user.name} />
                  <div className="online" />
                  <span 
                    onClick={() => handleNameClick(user.id)}
                    style={{ cursor: "pointer" }}
                  >
                    {user.name}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: "#999", fontSize: "14px", fontStyle: "italic" }}>
              No friends online
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightBar;