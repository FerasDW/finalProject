import { useState, useEffect } from "react";
import { suggestedFriends } from "../../../Static/communityData";
import { useNavigate } from "react-router-dom";
import "./friends.scss";
import { useFriends } from "../../../Context/FriendContext";

const Friends = () => {
  const [showAllFollowed, setShowAllFollowed] = useState(false);
  const { friendsList, addFriend } = useFriends();
  const [suggested, setSuggested] = useState([]);
  const [availableSuggestions, setAvailableSuggestions] = useState([]);
  const navigate = useNavigate();

  // Initialize suggestions and filter out already followed friends
  useEffect(() => {
    const friendIds = friendsList.map(friend => friend.id);
    const filteredSuggestions = suggestedFriends.filter(user => !friendIds.includes(user.id));
    
    setSuggested(filteredSuggestions.slice(0, 3));
    setAvailableSuggestions(filteredSuggestions.slice(3));
  }, [friendsList]);

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
    addFriend(user);
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

      {friendsList.length === 0 ? (
        <div className="emptyState">
          <p>You haven't followed anyone yet. Check out the suggestions below!</p>
        </div>
      ) : (
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
            </div>
          ))}
        </div>
      )}

      {/* Suggested Section */}
      <div className="sectionHeader" style={{ marginTop: "30px" }}>
        <h3>Suggested</h3>
      </div>

      {suggested.length === 0 ? (
        <div className="emptyState">
          <p>No more suggestions available at the moment.</p>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default Friends;