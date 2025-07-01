import React, { useState, useContext } from "react";
import "../../../CSS/Components/Community/share.scss";
import ImageIcon from "../../../Assets/img.png";
import MapIcon from "../../../Assets/map.png";
import { AuthContext } from "../../../Context/AuthContext";
import axios from "axios";

const Share = ({ onShare }) => {
  const { authData } = useContext(AuthContext);

  const [desc, setDesc] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);

  const handleImageChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setImageFile(selected);
      setImagePreview(URL.createObjectURL(selected));
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
    }
  };

  const handleShare = async () => {
    if (!desc.trim()) return;

    if (!authData) {
      alert("You must be logged in to share a post.");
      return;
    }

    try {
      // Prepare data to send to backend
      // Note: backend expects URLs for images/files — 
      // here you’d normally upload files first to get URLs.
      // For simplicity, we'll send the file name only and null URLs,
      // you should implement proper file upload separately.

      const postPayload = {
        desc,
        img: imagePreview, // temporary preview URL (won't be accessible by backend)
        file: file
          ? {
              name: file.name,
              url: null, // replace with actual uploaded file URL when you implement upload
            }
          : null,
        userId: authData.id,
        name: authData.name,
        role: authData.role,
        profilePic: authData.profilePic,
        groupId: null,
        groupName: null,
      };

      const response = await axios.post(
        "http://localhost:8080/api/community/posts",
        postPayload,
        { withCredentials: true }
      );

      // Use the post returned from backend (with real id, timestamps, etc)
      onShare(response.data);

      // Reset form fields
      setDesc("");
      setImageFile(null);
      setImagePreview(null);
      setFile(null);
    } catch (error) {
      console.error("Failed to create post:", error);
      alert("Failed to share post. Please try again.");
    }
  };

  return (
    <div className="share">
      <div className="shareContainer">
        <div className="top">
          <img src={authData?.profilePic || ""} alt="" />
          <input
            type="text"
            placeholder={`What's on your mind, ${authData?.name || "User"}?`}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>

        {imagePreview && (
          <div className="previewImage">
            <img src={imagePreview} alt="Preview" />
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