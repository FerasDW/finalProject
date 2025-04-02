import { useParams } from "react-router-dom";
import { groupPosts, groupsList } from "../../../Static/communityData";
import Posts from "../../Components/Community/posts/Posts";
import "./groupPage.scss";

const GroupPage = () => {
  const { groupId } = useParams();
  const group = groupsList.find((g) => g.id === parseInt(groupId));
  const posts = groupPosts[groupId] || [];

  if (!group) {
    return <div className="groupPage">Group not found.</div>;
  }

  return (
    <div className="groupPage">
      <div className="groupHeader">
        <img src={group.img} alt={group.name} className="groupBanner" />
        <div className="groupInfo">
          <h2>{group.name}</h2>
          <p>{group.description}</p>
          <small>{group.members} members • {group.type}</small>
        </div>
      </div>

      <div className="groupPosts">
        <Posts posts={posts.map((p) => ({ ...p, groupName: group.name }))} />
      </div>
    </div>
  );
};

export default GroupPage;