import React, { useState, useEffect, useContext } from "react";
import "../../../CSS/Components/Community/comments.scss";
import axios from "axios";
import { AuthContext } from "../../../Context/AuthContext";

const Comments = ({ postId, onCommentsUpdate }) => {
  const { authData } = useContext(AuthContext);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!postId) return;

    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/community/posts/${postId}/comments`,
          { withCredentials: true }
        );
        setComments(res.data || []);
      } catch (err) {
        console.error("Failed to fetch comments", err);
      }
    };

    fetchComments();
  }, [postId]);

  // Notify parent when comments change
  useEffect(() => {
    if (onCommentsUpdate) {
      onCommentsUpdate(comments);
    }
  }, [comments, onCommentsUpdate]);

  const handleSend = async () => {
    if (newComment.trim() === "") return;
    if (!authData) {
      alert("Please login to comment");
      return;
    }

    const commentPayload = {
      userId: authData.id,
      username: authData.username || authData.name || "User",
      text: newComment,
    };

    try {
      const res = await axios.post(
        `http://localhost:8080/api/community/posts/${postId}/comments`,
        commentPayload,
        { withCredentials: true }
      );
      
      // Check what the server is returning
      console.log("Server response after adding comment:", res.data);
      
      // Option 1: If server returns updated comments array
      if (res.data.comments) {
        setComments(res.data.comments);
      } 
      // Option 2: If server returns the new comment, add it to existing comments
      else if (res.data.comment) {
        setComments(prevComments => [...prevComments, res.data.comment]);
      }
      // Option 3: If server doesn't return comments, refetch them
      else {
        const updatedRes = await axios.get(
          `http://localhost:8080/api/community/posts/${postId}/comments`,
          { withCredentials: true }
        );
        setComments(updatedRes.data || []);
      }
      
      setNewComment("");
    } catch (err) {
      console.error("Failed to send comment", err);
    }
  };

  return (
    <div className="comments">
      <div className="write">
        <img
          src={authData?.profilePic || "https://via.placeholder.com/40"}
          alt="User"
        />
        <input
          type="text"
          placeholder="Write a comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
      {comments.length === 0 && <p>No comments yet.</p>}
      {comments.map((comment, idx) => (
        <div className="comment" key={comment.id || idx}>
          <img
            src={comment.profilePicture || "https://via.placeholder.com/40"}
            alt={comment.username || "User"}
          />
          <div className="info">
            <span>{comment.username || "User"}</span>
            <p>{comment.text}</p>
          </div>
          <span className="date">just now</span>
        </div>
      ))}
    </div>
  );
};

export default Comments;