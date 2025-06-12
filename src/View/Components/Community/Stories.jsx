import React, { useState, useEffect } from "react";
import { currentUser, stories } from "../../../Static/communityData";
import { useFriends } from "../../../Context/FriendContext";
import "../../../CSS/Components/Community/stories.scss";

const Stories = () => {
  const [openUserIndex, setOpenUserIndex] = useState(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
  const [showAddStory, setShowAddStory] = useState(false);
  const [userStories, setUserStories] = useState(stories);
  const { friendsList } = useFriends();
  const [storyText, setStoryText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Get current user's stories
  const currentUserStories = userStories.filter(
    (story) => story.userId === currentUser.id
  );

  // Filter stories to show friends' stories plus current user's stories
  const allStories = userStories.filter((story) => {
    if (story.userId === currentUser.id) return true; // Always include current user's stories
    if (!friendsList || friendsList.length === 0) return false;
    return friendsList.some((friend) => friend.id === story.userId);
  });

  // Group stories by user
  const groupedStories = allStories.reduce((acc, story) => {
    const existingUser = acc.find((user) => user.userId === story.userId);
    if (existingUser) {
      existingUser.stories.push(story);
    } else {
      acc.push({
        userId: story.userId,
        name: story.name,
        profilePic: story.profilePic,
        stories: [story],
      });
    }
    return acc;
  }, []);

  // Separate current user stories and friends' stories for display
  const currentUserGroup = groupedStories.find(user => user.userId === currentUser.id);
  const friendsStories = groupedStories.filter(user => user.userId !== currentUser.id);

  // Create final display array: current user first (if has stories), then friends
  const displayStories = [];
  if (currentUserGroup) {
    displayStories.push(currentUserGroup);
  }
  displayStories.push(...friendsStories);

  const handleOpenStory = (userIndex) => {
    setOpenUserIndex(userIndex);
    setCurrentStoryIndex(0);
    setStoryProgress(0);
  };

  const handleOpenCurrentUserStory = () => {
    if (currentUserStories.length > 0) {
      // Current user has stories, open them (always at index 0 in displayStories if they exist)
      setOpenUserIndex(0);
      setCurrentStoryIndex(0);
      setStoryProgress(0);
    } else {
      // Current user has no stories, show add story modal
      handleAddStory();
    }
  };

  const handleClose = () => {
    setOpenUserIndex(null);
    setCurrentStoryIndex(0);
    setStoryProgress(0);
  };

  const handlePrevUser = () => {
    if (openUserIndex > 0) {
      setOpenUserIndex(openUserIndex - 1);
      setCurrentStoryIndex(0);
      setStoryProgress(0);
    }
  };

  const handleNextUser = () => {
    if (openUserIndex < displayStories.length - 1) {
      setOpenUserIndex(openUserIndex + 1);
      setCurrentStoryIndex(0);
      setStoryProgress(0);
    } else {
      handleClose();
    }
  };

  const handleNextStory = () => {
    const currentUser = displayStories[openUserIndex];
    if (currentStoryIndex < currentUser.stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setStoryProgress(0);
    } else {
      handleNextUser();
    }
  };

  const handlePrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      setStoryProgress(0);
    } else if (openUserIndex > 0) {
      setOpenUserIndex(openUserIndex - 1);
      const prevUser = displayStories[openUserIndex - 1];
      setCurrentStoryIndex(prevUser.stories.length - 1);
      setStoryProgress(0);
    }
  };

  const handleStoryBarClick = (storyIndex) => {
    setCurrentStoryIndex(storyIndex);
    setStoryProgress(0);
  };

  const handleAddStory = () => {
    setShowAddStory(true);
    setSelectedFile(null);
    setStoryText("");
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleStoryUpload = async () => {
    if (!selectedFile && !storyText.trim()) return;

    setIsUploading(true);

    try {
      const fileURL = selectedFile ? URL.createObjectURL(selectedFile) : null;
      const fileType = selectedFile?.type.startsWith("video/") ? "video" : "image";

      const newStory = {
        id: Date.now(),
        userId: currentUser.id,
        name: currentUser.name,
        profilePic: currentUser.profilePic,
        img: fileURL,
        text: storyText.trim() || null,
        type: selectedFile ? fileType : "text",
        time: "now",
        timestamp: new Date().toISOString(),
      };

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setUserStories((prev) => [newStory, ...prev]);
      setShowAddStory(false);
      setStoryText("");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading story:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelAddStory = () => {
    setShowAddStory(false);
    setStoryText("");
    setSelectedFile(null);
  };

  // Check if share button should be enabled
  const canShare = (selectedFile || storyText.trim()) && !isUploading;

  // Auto-advance story logic
  useEffect(() => {
    if (openUserIndex === null || !displayStories[openUserIndex]) return;

    const currentUser = displayStories[openUserIndex];
    const currentStory = currentUser.stories[currentStoryIndex];
    let duration = 8000; // Default 8 seconds for images

    // Check if it's a video
    const isVideo =
      currentStory.type === "video" ||
      (currentStory.img &&
        (currentStory.img.includes(".mp4") ||
          currentStory.img.includes(".webm") ||
          currentStory.img.includes(".ogg")));

    if (isVideo) {
      const videoElement = document.querySelector(".story-full-video");
      if (videoElement && videoElement.duration && videoElement.duration > 0) {
        duration = videoElement.duration * 1000;
      } else {
        duration = 15000;
      }
    }

    const timer = setTimeout(() => {
      handleNextStory();
    }, duration);

    // Progress bar animation
    const progressTimer = setInterval(() => {
      setStoryProgress((prev) => {
        const increment = 100 / (duration / 100);
        return Math.min(prev + increment, 100);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [openUserIndex, currentStoryIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (openUserIndex === null) return;

      if (e.key === "ArrowLeft") {
        handlePrevStory();
      } else if (e.key === "ArrowRight") {
        handleNextStory();
      } else if (e.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [openUserIndex, currentStoryIndex]);

  const renderStoryMedia = (story) => {
    const isVideo =
      story.type === "video" ||
      (story.img &&
        (story.img.includes(".mp4") ||
          story.img.includes(".webm") ||
          story.img.includes(".ogg")));

    // If it's a text-only story (no image/video)
    if (story.type === "text" || (!story.img && story.text)) {
      return (
        <div className="story-text-content">
          <p>{story.text}</p>
        </div>
      );
    }

    // If it has both media and text
    const mediaElement = isVideo ? (
      <video
        className="story-full-video"
        src={story.img}
        autoPlay
        muted
        onLoadedMetadata={(e) => {
          console.log("Video duration:", e.target.duration * 1000);
        }}
        onError={(e) => {
          console.error("Video failed to load:", e);
        }}
      />
    ) : (
      <img
        src={story.img}
        alt="Story"
        className="story-full-img"
        onError={(e) => {
          console.error("Image failed to load:", e);
          e.target.src =
            "https://via.placeholder.com/400x600/cccccc/666666?text=Story";
        }}
      />
    );

    // Return media with optional text overlay
    return (
      <div className="story-media-container">
        {mediaElement}
        {story.text && (
          <div className="story-text-overlay">
            <p>{story.text}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="stories">
      <div className="story">
        <img
          src={currentUser.profilePic}
          alt=""
          onClick={handleOpenCurrentUserStory}
        />
        <span onClick={handleOpenCurrentUserStory}>{currentUser.name}</span>
        <button onClick={handleAddStory}>+</button>
      </div>

      {friendsStories.map((user, index) => {
        // Calculate the correct index in displayStories
        const displayIndex = currentUserGroup ? index + 1 : index;
        
        return (
          <div
            className="story"
            key={user.userId}
            onClick={() => handleOpenStory(displayIndex)}
          >
            <img src={user.profilePic || user.stories[0].img} alt="" />
            <span>{user.name}</span>
            {user.stories.length > 1 && (
              <div className="story-count">{user.stories.length}</div>
            )}
          </div>
        );
      })}

      {friendsStories.length === 0 && (
        <div className="no-stories">
          <p>No stories from friends to show</p>
        </div>
      )}

      {openUserIndex !== null && displayStories[openUserIndex] && (
        <div className="story-overlay">
          <div className="story-header">
            <div className="progress-bars">
              {displayStories[openUserIndex].stories.map((_, index) => (
                <div
                  key={index}
                  className="progress-bar"
                  onClick={() => handleStoryBarClick(index)}
                >
                  <div
                    className="progress-fill"
                    style={{
                      width:
                        index < currentStoryIndex
                          ? "100%"
                          : index === currentStoryIndex
                          ? `${storyProgress}%`
                          : "0%",
                    }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="story-info">
              <img
                src={displayStories[openUserIndex].profilePic}
                alt="Profile"
                className="story-profile-pic"
                onError={(e) => {
                  e.target.src = displayStories[openUserIndex].stories[0].img;
                }}
              />
              <span className="story-username">
                {displayStories[openUserIndex].name}
              </span>
              <span className="story-time">
                {displayStories[openUserIndex].stories[currentStoryIndex]
                  .time || "2h ago"}
              </span>
            </div>
            <button className="close-btn" onClick={handleClose}>
              ×
            </button>
          </div>

          <div className="overlay-content">
            {(openUserIndex > 0 || currentStoryIndex > 0) && (
              <button className="nav left" onClick={handlePrevStory}>
                ‹
              </button>
            )}

            {renderStoryMedia(
              displayStories[openUserIndex].stories[currentStoryIndex]
            )}

            {(openUserIndex < displayStories.length - 1 ||
              currentStoryIndex <
                displayStories[openUserIndex].stories.length - 1) && (
              <button className="nav right" onClick={handleNextStory}>
                ›
              </button>
            )}
          </div>
        </div>
      )}

      {showAddStory && (
        <div className="add-story-overlay">
          <div className="add-story-modal">
            <div className="add-story-header">
              <h3>Add to Your Story</h3>
              <button className="close-btn" onClick={handleCancelAddStory}>
                ×
              </button>
            </div>
            <div className="add-story-content">
              <div className="upload-area">
                <input
                  type="file"
                  id="story-upload"
                  accept="image/*,video/*"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                  style={{ display: "none" }}
                />
                <label htmlFor="story-upload" className={`upload-button ${selectedFile ? 'has-file' : ''}`}>
                  {selectedFile ? (
                    <div className="file-preview">
                      <div className="file-info">
                        <div className="upload-icon">✓</div>
                        <p>{selectedFile.name}</p>
                        <span>File selected</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="upload-icon">📷</div>
                      <p>Choose Photo or Video</p>
                      <span>Select a file from your device</span>
                    </>
                  )}
                </label>

                {/* Text Input */}
                <div className="text-input">
                  <textarea
                    placeholder="Write something to go with your story..."
                    value={storyText}
                    onChange={(e) => setStoryText(e.target.value)}
                    maxLength="280"
                    rows="4"
                    className="story-textarea"
                  ></textarea>
                  <p className="char-count">{storyText.length}/280</p>
                </div>
              </div>
              
              <div className="modal-actions">
                <button 
                  className="cancel-button" 
                  onClick={handleCancelAddStory}
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button 
                  className={`share-button ${!canShare ? 'disabled' : ''} ${isUploading ? 'loading' : ''}`}
                  onClick={handleStoryUpload} 
                  disabled={!canShare}
                >
                  {isUploading ? (
                    <span className="loading-content">
                      <span className="spinner"></span>
                      Sharing...
                    </span>
                  ) : (
                    'Share Story'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stories;