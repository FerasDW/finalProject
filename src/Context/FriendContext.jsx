import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";

const FriendContext = createContext();

export const FriendProvider = ({ children }) => {
  const [friendsList, setFriendsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { authData } = useContext(AuthContext); // Get auth data
  const userId = authData?.id; // Get user ID from auth

  // Fetch real friends from API
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchFriends = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/community/friends/${userId}`);
        setFriendsList(response.data.friends || []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch friends:", err);
        setError("Could not load friends");
        setLoading(false);
      }
    };

    fetchFriends();
  }, [userId]);

  // Add friend via API
  const addFriend = async (friendId) => {
    try {
      await axios.post("http://localhost:8080/api/community/friends", {
        userId,
        friendId,
      });

      const response = await axios.get(`http://localhost:8080/api/community/friends/${userId}`);
      setFriendsList(response.data.friends || []);
    } catch (err) {
      console.error("Failed to send friend request:", err);
      setError("Could not send friend request");
    }
  };

  // Remove friend via API
  const removeFriend = async (friendshipId) => {
    try {
      await axios.delete(`http://localhost:8080/api/community/friends/${friendshipId}`);
      setFriendsList((prev) => prev.filter((f) => f.id !== friendshipId));
    } catch (err) {
      console.error("Failed to remove friend:", err);
      setError("Could not remove friend");
    }
  };

  // Check if user is a friend
  const isFriend = (checkUserId) => {
    return friendsList.some((friend) => friend.id === checkUserId);
  };

  return (
    <FriendContext.Provider
      value={{
        friendsList,
        loading,
        error,
        addFriend,
        removeFriend,
        isFriend,
      }}
    >
      {children}
    </FriendContext.Provider>
  );
};

export const useFriends = () => useContext(FriendContext);