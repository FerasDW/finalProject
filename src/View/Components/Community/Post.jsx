import "../../../CSS/Components/Community/post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { Link, useNavigate } from "react-router-dom";
import Comments from "./Comments";
import { useState, useEffect, useContext } from "react";
import { useSavedPosts } from "../../../Context/SavedPostsContext";
import axios from "axios";
import { AuthContext } from "../../../Context/AuthContext";

const Post = ({ post }) => {
  const navigate = useNavigate();
  const { authData } = useContext(AuthContext);
  const [commentOpen, setCommentOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [commentsCount, setCommentsCount] = useState(0); // Start with 0
  const [menuOpen, setMenuOpen] = useState(false);
  const { savePost, unsavePost, isPostSaved } = useSavedPosts();
  const saved = isPostSaved(post.id);

  // Fetch actual comment count from server
  useEffect(() => {
    const fetchCommentCount = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/community/posts/${post.id}/comments`,
          { withCredentials: true }
        );
        setCommentsCount(res.data?.length || 0);
      } catch (err) {
        console.error("Failed to fetch comment count:", err);
        // Fallback to post data if API fails
        setCommentsCount(post.comments?.length || 0);
      }
    };

    fetchCommentCount();
  }, [post.id, post.comments]);

  // Init liked status on mount or post changes
  useEffect(() => {
    if (authData && post.likes?.includes(authData.id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
    setLikeCount(post.likes?.length || 0);
  }, [authData, post.likes]);

  const toggleSave = () => {
    if (saved) {
      unsavePost(post.id);
    } else {
      savePost(post);
    }
    setMenuOpen(false);
  };

  const handleGroupClick = () => {
    if (post.groupId) {
      navigate(`/groups/${post.groupId}`);
    }
  };

  const handleLike = async () => {
    if (!authData) return;

    try {
      const res = await axios.put(
        `http://localhost:8080/api/community/posts/${post.id}/like`,
        null,
        {
          params: { userId: authData.id },
          withCredentials: true,
        }
      );

      const updatedLikes = res.data.likes || [];
      setLiked(updatedLikes.includes(authData.id));
      setLikeCount(updatedLikes.length);
    } catch (err) {
      console.error("Failed to like post:", err);
    }
  };

  const onCommentsUpdate = (newComments) => {
    setCommentsCount(newComments.length);
  };

  return (
    <div className="post">
      <div className="postContainer">
        <div className="user">
          <div className="userInfo">
            <img src={post.profilePic} alt="" />
            <div className="details">
              <Link
                to={`/community/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">
                  {post.name}
                  {post.role && <span className="role"> - {post.role}</span>}
                </span>
              </Link>
              {post.groupName && (
                <div className="groupInfo">
                  <span
                    className="groupName clickable"
                    onClick={handleGroupClick}
                  >
                    📍 {post.groupName}
                  </span>
                </div>
              )}
              <span className="date">1 min ago</span>
            </div>
          </div>

          <div className="more">
            <MoreHorizIcon
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ cursor: "pointer" }}
            />

            {menuOpen && (
              <div className="dropdownMenu">
                <div className="menuItem" onClick={toggleSave}>
                  {saved ? (
                    <>
                      <BookmarkIcon
                        style={{ fontSize: "18px", marginRight: "5px" }}
                      />
                      Unsave
                    </>
                  ) : (
                    <>
                      <BookmarkBorderIcon
                        style={{ fontSize: "18px", marginRight: "5px" }}
                      />
                      Save
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="content">
          <p>{post.desc}</p>
          <img src={post.img} alt="" />
          {post.file && (
            <div className="sharedFile">
              <a
                href={post.file.url}
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                📎 {post.file.name}
              </a>
            </div>
          )}
        </div>

        <div className="info">
          <div className="item" onClick={handleLike}>
            {liked ? (
              <FavoriteOutlinedIcon style={{ color: "red" }} />
            ) : (
              <FavoriteBorderOutlinedIcon />
            )}
            {likeCount} {likeCount === 1 ? "Like" : "Likes"}
          </div>

          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            {commentsCount} {commentsCount === 1 ? "Comment" : "Comments"}
          </div>

          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>

        {commentOpen && <Comments postId={post.id} onCommentsUpdate={onCommentsUpdate} />}
      </div>
    </div>
  );
};

export default Post;