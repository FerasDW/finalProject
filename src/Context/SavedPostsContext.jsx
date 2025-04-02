import React, { createContext, useContext, useState } from "react";

const SavedPostsContext = createContext();

export const SavedPostsProvider = ({ children }) => {
  const [savedPosts, setSavedPosts] = useState([]);

  const savePost = (post) => {
    setSavedPosts((prev) =>
      prev.some((p) => p.id === post.id)
        ? prev // already saved
        : [...prev, post]
    );
  };

  const unsavePost = (postId) => {
    setSavedPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const isPostSaved = (postId) => {
    return savedPosts.some((p) => p.id === postId);
  };

  return (
    <SavedPostsContext.Provider
      value={{ savedPosts, savePost, unsavePost, isPostSaved }}
    >
      {children}
    </SavedPostsContext.Provider>
  );
};

export const useSavedPosts = () => useContext(SavedPostsContext);
