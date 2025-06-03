// src/Context/FollowContext.jsx
import { createContext, useContext, useState } from "react";

const FollowContext = createContext();

export const FollowProvider = ({ children }) => {
  const [followedUsers, setFollowedUsers] = useState([]);

  const follow = (user) => {
    if (!followedUsers.find((u) => u.id === user.id)) {
      setFollowedUsers((prev) => [...prev, user]);
    }
  };

  const unfollow = (userId) => {
    setFollowedUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const isFollowing = (userId) => followedUsers.some((u) => u.id === userId);

  return (
    <FollowContext.Provider value={{ followedUsers, follow, unfollow, isFollowing }}>
      {children}
    </FollowContext.Provider>
  );
};

export const useFollow = () => useContext(FollowContext);