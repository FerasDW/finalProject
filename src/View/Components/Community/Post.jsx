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
import { useState } from "react";
import { useSavedPosts } from "../../../Context/SavedPostsContext";

const Post = ({ post }) => {
  const navigate = useNavigate();
  const [commentOpen, setCommentOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { savePost, unsavePost, isPostSaved } = useSavedPosts();
  const saved = isPostSaved(post.id);

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

          {/* ⋮ Menu Icon */}
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
          <div className="item" onClick={() => setLiked(!liked)}>
            {liked ? (
              <FavoriteOutlinedIcon style={{ color: "red" }} />
            ) : (
              <FavoriteBorderOutlinedIcon />
            )}
            {liked ? "13 Likes" : "12 Likes"}
          </div>

          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            12 Comments
          </div>

          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>

        {commentOpen && <Comments />}
      </div>
    </div>
  );
};

export default Post;