import React, { useState } from "react";
import Stories from "../../Components/Community/stories/Stories";
import Posts from "../../Components/Community/posts/Posts";
import Share from "../../Components/Community/share/Share";
import "./home.scss";
import { mockPosts, currentUser } from "../../../Static/communityData";
import { useFriends } from "../../../Context/FriendContext";

const Home = () => {
  const [posts, setPosts] = useState(mockPosts);
  const { friendsList } = useFriends();

  const handleShare = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  // Filter posts to show only current user's posts and friends' posts
  const visiblePosts = posts.filter(post => {
    // Always show current user's posts
    if (post.userId === currentUser.id) {
      return true;
    }
    
    // Show posts from friends
    return friendsList.some(friend => friend.id === post.userId);
  });

  return (
    <div className="home">
      <Stories />
      <Share onShare={handleShare} />
      <Posts posts={visiblePosts} />
    </div>
  );
};

export default Home;