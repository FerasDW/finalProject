import React, { useState } from "react";
import Stories from "../../Components/Community/stories/Stories";
import Posts from "../../Components/Community/posts/Posts";
import Share from "../../Components/Community/share/Share";
import "./home.scss";

const Home = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      name: "John Doe",
      userId: 1,
      profilePic:
        "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg",
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
      img: "https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg",
    },
    {
      id: 2,
      name: "Jane Doe",
      userId: 2,
      profilePic:
        "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg",
      desc: "Another awesome post!",
    },
  ]);

  const handleShare = (newPost) => {
    setPosts([newPost, ...posts]);
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
