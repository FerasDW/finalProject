import React, { useState } from "react";
import "./comments.scss";

const Comments = () => {
  const currentUser = {
    id: 1,
    name: "Muhammed Taha",
    profilePic:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
  };

  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([
    {
      id: 1,
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
      name: "John Doe",
      userId: 1,
      profilePicture:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
    },
    {
      id: 2,
      desc: "Another comment here!",
      name: "Jane Doe",
      userId: 2,
      profilePicture:
        "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg",
    },
  ]);

  const handleSend = () => {
    if (newComment.trim() === "") return;

    const newCommentObj = {
      id: Date.now(),
      desc: newComment,
      name: currentUser.name,
      userId: currentUser.id,
      profilePicture: currentUser.profilePic,
    };

    setComments([newCommentObj, ...comments]);
    setNewComment(""); // Clear input
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilePic} alt="" />
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
