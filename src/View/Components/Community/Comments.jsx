import React, { useState } from "react";
import "../../../CSS/Components/Community/comments.scss";
import { commentUser, initialComments } from "../../../Static/communityData";

const Comments = () => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(initialComments); // Load from data file

  const handleSend = () => {
    if (newComment.trim() === "") return;

    const newCommentObj = {
      id: Date.now(),
      desc: newComment,
      name: commentUser.name,
      userId: commentUser.id,
      profilePicture: commentUser.profilePic,
    };

    setComments([newCommentObj, ...comments]);
    setNewComment("");
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={commentUser.profilePic} alt="" />
        <input
          type="text"
          placeholder="write a comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handleSend}>Send</button>
      </div>
      {comments.map((comment) => (
        <div className="comment" key={comment.id}>
          <img src={comment.profilePicture} alt="" />
          <div className="info">
            <span>{comment.name}</span>
            <p>{comment.desc}</p>
          </div>
          <span className="date">just now</span>
        </div>
      ))}
    </div>
  );
};

export default Comments;
