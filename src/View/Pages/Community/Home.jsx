import React, { useState, useEffect, useContext } from "react";
import Stories from "../../Components/Community/Stories";
import Posts from "../../Components/Community/Posts";
import Share from "../../Components/Community/Share";
import "../../../CSS/Pages/Community/home.scss";
import { useFriends } from "../../../Context/FriendContext";
import { AuthContext } from "../../../Context/AuthContext";
import axios from "axios";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const { friendsList } = useFriends();
  const { authData } = useContext(AuthContext);

  // Fetch posts from backend
  useEffect(() => {
    if (!authData?.id) return;

    async function fetchPosts() {
      try {
        // Assuming authData.id is your logged-in user's ID
        // friendsList.map(friend => friend.id) to get array of friend IDs
        const friendIds = friendsList.map((friend) => friend.id);

        const params = new URLSearchParams();
        params.append("userId", authData.id);
        friendIds.forEach((id) => params.append("friendIds", id));

        const response = await axios.get(
          `http://localhost:8080/api/community/posts/feed?${params.toString()}`,
          {
            withCredentials: true, // send cookies automatically
          }
        );

        setPosts(response.data);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      }
    }

    fetchPosts();
  }, [authData, friendsList]);

  // Add new post to the top (called after Share component uploads a new post)
  const handleShare = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  return (
    <div className="home">
      <Stories />
      <Share onShare={handleShare} />
      <Posts posts={posts} />
    </div>
  );
};

export default Home;