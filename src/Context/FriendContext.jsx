// FriendContext.jsx
import { createContext, useContext, useState } from "react";
const FriendContext = createContext();

export const FriendProvider = ({ children }) => {
  const [friendsList, setFriendsList] = useState([]);

  const addFriend = (user) => {
    setFriendsList((prev) => {
      if (prev.find((f) => f.id === user.id)) return prev;
      return [...prev, user];
    });
  };

  const isFriend = (userId) => {
    return friendsList.some((f) => f.id === userId);
  };

  const removeFriend = (userId) => {
    setFriendsList((prev) => prev.filter((f) => f.id !== userId));
  };

  return (
    <FriendContext.Provider
      value={{ friendsList, addFriend, removeFriend, isFriend }}
    >
      {children}
    </FriendContext.Provider>
  );
};

export const useFriends = () => useContext(FriendContext);