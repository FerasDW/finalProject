import { useState } from "react";
import { friendsList as initialFriends, suggestedFriends } from "../../../Static/communityData";
import { useNavigate } from "react-router-dom";
import "./friends.scss";

const Friends = () => {
  const [showAllFollowed, setShowAllFollowed] = useState(false);
  const [friendsList, setFriendsList] = useState(initialFriends);
  const [suggested, setSuggested] = useState(suggestedFriends.slice(0, 3));
  const [availableSuggestions, setAvailableSuggestions] = useState(suggestedFriends.slice(3));

  const navigate = useNavigate();
  const removeSuggestion = (id) => {
    setSuggested((prev) => {
      const filtered = prev.filter((u) => u.id !== id);
      const [next, ...rest] = availableSuggestions;
      if (next) {
        setAvailableSuggestions(rest);
        return [...filtered, next];
      } else {
        return filtered;
      }
    });
  };

  const handleFollow = (user) => {
    setFriendsList((prev) => [...prev, user]);
    removeSuggestion(user.id);
  };

  const followedToDisplay = showAllFollowed ? friendsList : friendsList.slice(0, 3);

  return (
    <div className="friendsPage">
      {/* Followed Section */}
      <div className="sectionHeader">
        <h3>Followed</h3>
        {friendsList.length > 3 && (
          <span className="viewAll" onClick={() => setShowAllFollowed(!showAllFollowed)}>
            {showAllFollowed ? "View Less" : "View All"}
          </span>
        )}
      </div>

      <div className="friendsGrid">
        {followedToDisplay.map((friend) => (
          <div className="friendCard" key={friend.id}>
            <div className="imageWrapper">
              <img src={friend.profilePic} alt={friend.name} className="profileImg" />
            </div>
            <h3>{friend.name}</h3>
            <p className="role">{friend.role}</p>
            <p className="title">{friend.title}</p>
            <p className="university">{friend.university}</p>
            <button
              className="followBtn"
              onClick={() => navigate(`/community/profile/${friend.id}`)}
              >
              View Profile
            </button>
            {/* <button className="followBtn disabled">Chat</button> */}
          </div>
        ))}
      </div>

      {/* Suggested Section */}
      <div className="sectionHeader" style={{ marginTop: "30px" }}>
        <h3>Suggested</h3>
      </div>

      <div className="friendsGrid">
        {suggested.map((user) => (
          <div className="friendCard" key={user.id}>
            <button className="closeBtn" onClick={() => removeSuggestion(user.id)}>×</button>
            <div className="imageWrapper">
              <img src={user.profilePic} alt={user.name} className="profileImg" />
            </div>
            <h3>{user.name}</h3>
            <p className="role">{user.role}</p>
            <p className="title">{user.title}</p>
            <p className="university">{user.university}</p>
            <button className="followBtn" onClick={() => handleFollow(user)}>Follow +</button>
          </div>
        ))}
      </div>
    </div>
  );
  
};

export default Friends;