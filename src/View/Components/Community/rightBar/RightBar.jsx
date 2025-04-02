import "./rightBar.scss";
import { suggestions, activities, onlineFriends } from "../../../../Static/communityData";

const RightBar = () => {
  return (
    <div className="rightBar">
      <div className="rightBarMenus">

        <div className="item">
          <span>Suggestions For You</span>
          {/* Replace with: const suggestions = await fetchSuggestionsFromBackend(); */}
          {suggestions.map((user) => (
            <div className="user" key={user.id}>
              <div className="userInfo">
                <img src={user.img} alt={user.name} />
                <span>{user.name}</span>
              </div>
              <div className="buttons">
                <button>follow</button>
                <button>dismiss</button>
              </div>
            </div>
          ))}
        </div>

        <div className="item">
          <span>Latest Activities</span>
          {/* Replace with: const activities = await fetchLatestActivities(); */}
          {activities.map((activity) => (
            <div className="user" key={activity.id}>
              <div className="userInfo">
                <img src={activity.img} alt={activity.name} />
                <p>
                  <span>{activity.name}</span> {activity.action}
                </p>
              </div>
              <span>{activity.time}</span>
            </div>
          ))}
        </div>

        <div className="item">
          <span>Online Friends</span>
          {/* Replace with: const onlineFriends = await fetchOnlineFriends(); */}
          {onlineFriends.map((user) => (
            <div className="user" key={user.id}>
              <div className="userInfo">
                <img src={user.profilePic} alt={user.name} />
                <div className="online" />
                <span>{user.name}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default RightBar;