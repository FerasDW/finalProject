import React, { useState } from "react";
import Stories from "../../Components/Community/stories/Stories";
import Posts from "../../Components/Community/posts/Posts";
import Share from "../../Components/Community/share/Share";
import "./home.scss";
import { mockPosts } from "../../../Static/communityData";

const Home = () => {
  const [posts, setPosts] = useState(mockPosts);

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
