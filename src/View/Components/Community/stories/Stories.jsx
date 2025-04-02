// import { useContext } from "react";
// import { AuthContext } from "../../../../Context/AuthContext";
import React, { useState } from "react";
import { currentUser, stories } from "../../../../Static/communityData";
import "./stories.scss";

const Stories = () => {
  // const { currentUser } = useContext(AuthContext);
  const [openStoryIndex, setOpenStoryIndex] = useState(null);

  const handleOpenStory = (index) => {
    setOpenStoryIndex(index);
  };

  const handleClose = () => {
    setOpenStoryIndex(null);
  };

  const handlePrev = () => {
    if (openStoryIndex > 0) {
      setOpenStoryIndex(openStoryIndex - 1);
    }
  };

  const handleNext = () => {
    if (openStoryIndex < stories.length - 1) {
      setOpenStoryIndex(openStoryIndex + 1);
    }
  };

  return (
    <div className="stories">
      <div className="story">
        <img src={currentUser.profilePic} alt="" />
        <span>{currentUser.name}</span>
        <button>+</button>
      </div>
      {stories.map((story, index) => (
        <div
          className="story"
          key={story.id}
          onClick={() => handleOpenStory(index)}
        >
          <img src={story.img} alt="" />
          <span>{story.name}</span>
        </div>
      ))}
      {openStoryIndex !== null && (
        <div className="story-overlay">
          <div className="overlay-content">
            <button className="close-btn" onClick={handleClose}>×</button>

            {openStoryIndex > 0 && (
              <button className="nav left" onClick={handlePrev}>‹</button>
            )}

            <img
              src={stories[openStoryIndex].img}
              alt="Story"
              className="story-full-img"
            />
            <span className="story-name">{stories[openStoryIndex].name}</span>

            {openStoryIndex < stories.length - 1 && (
              <button className="nav right" onClick={handleNext}>›</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Stories;