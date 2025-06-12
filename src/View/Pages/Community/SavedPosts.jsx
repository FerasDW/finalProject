import Post from "../../Components/Community/Post";
import { useSavedPosts } from "../../../Context/SavedPostsContext";
import "../../../CSS/Pages/Community/savedPosts.scss";

const SavedPosts = () => {
  const { savedPosts } = useSavedPosts();

  return (
    <div className="saved-posts-page">
      {savedPosts.length === 0 ? (
        <div className="empty-message">
          <p>No saved posts yet.</p>
        </div>
      ) : (
        <div className="saved-posts-list">
          {savedPosts.map((post) => (
            <Post post={post} key={post.id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPosts;
