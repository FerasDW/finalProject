import React, { useState } from "react";
import "./share.scss";
import ImageIcon from "../../../../Assets/img.png";
import MapIcon from "../../../../Assets/map.png";
import FriendIcon from "../../../../Assets/friend.png";

const Share = ({ onShare }) => {
  const currentUser = {
    id: 1,
    name: "Muhammed Taha",
    profilePic:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
  };

  const [desc, setDesc] = useState("");
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);

  const handleImageChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setImage(URL.createObjectURL(selected));
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
    }
  };

  const handleShare = () => {
    if (!desc.trim()) return;

    const newPost = {
      id: Date.now(),
      userId: currentUser.id,
      name: currentUser.name,
      profilePic: currentUser.profilePic,
      desc,
      img: image,
      file: file
        ? {
            name: file.name,
            url: URL.createObjectURL(file), // simulate upload
          }
        : null,
    };

    onShare(newPost);
    setDesc("");
    setImage(null);
    setFile(null);
  };

  return (
    <div className="share">
      <div className="shareContainer">
        <div className="top">
          <img src={currentUser.profilePic} alt="" />
          <input
            type="text"
            placeholder={`What's on your mind, ${currentUser.name}?`}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>

        {image && (
          <div className="previewImage">
            <img src={image} alt="Preview" />
          </div>
        )}

        {file && (
          <div className="previewFile">
            <p>📎 {file.name}</p>
          </div>
        )}

        <hr />

        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <label htmlFor="imageUpload">
              <div className="item">
                <img src={ImageIcon} alt="" />
                <span>Add Image</span>
              </div>
            </label>

            <input
              type="file"
              id="fileUpload"
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <label htmlFor="fileUpload">
              <div className="item">
                <img src={MapIcon} alt="" />
                <span>Add File</span>
              </div>
            </label>
          </div>

          <div className="right">
            <button onClick={handleShare}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;