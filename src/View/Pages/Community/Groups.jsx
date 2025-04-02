import { useState } from "react";
import { groupsList, groupPosts } from "../../../Static/communityData";
import "./groups.scss";
import { useNavigate } from "react-router-dom";


const Groups = () => {
  const navigate = useNavigate();
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [availableGroups, setAvailableGroups] = useState(groupsList);

  const toggleJoin = (group) => {
    const isJoined = joinedGroups.some((g) => g.id === group.id);
    if (isJoined) {
      setJoinedGroups(joinedGroups.filter((g) => g.id !== group.id));
      setAvailableGroups((prev) => [...prev, group]); // return group to list
    } else {
      setJoinedGroups([...joinedGroups, group]);
      setAvailableGroups((prev) => prev.filter((g) => g.id !== group.id)); // remove from list
    }
  };
  

  const allPosts = joinedGroups.flatMap((group) =>
    (groupPosts[group.id] || []).map((post) => ({ ...post, groupName: group.name, groupId: group.id, }))
  );

  return (
    <div className="groupsPage horizontalLayout">
      {/* Left: Feed from joined groups */}
      <div className="groupFeed">
        <h3>Latest Updates</h3>
        {allPosts.length === 0 ? (
          <p>You haven't joined any groups yet.</p>
        ) : (
          allPosts.map((post) => (
            <div key={post.id} className="postItem">
              <strong>{post.user}</strong> in <em>{post.groupName}</em>
              <span className="date"> • {post.date}</span>
              <p>{post.content.length > 100 ? post.content.substring(0, 100) + "..." : post.content}</p>
              <button className="seeMoreBtn" onClick={() => navigate(`/groups/${post.groupId}`)}>
                See Full Post
              </button>
            </div>
          ))
        )}
      </div>

      {/* Right: All groups to join/leave */}
      <div className="groupSidebar">
        <h3>All Groups</h3>
        {availableGroups.map((group) => {
          const isJoined = joinedGroups.some((g) => g.id === group.id);
          return (
            <div className="groupListCard" key={group.id}>
              <img src={group.img} alt={group.name} className="groupThumb" />
              <div className="groupInfo">
                <h4>{group.name}</h4>
                <p>{group.description}</p>
                <small>{group.members} members • {group.type}</small>
              </div>
              <button
                className={`joinBtn ${isJoined ? "joined" : ""}`}
                onClick={() => toggleJoin(group)}
              >
                {isJoined ? "Joined" : "Join"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Groups;
