// src/View/Pages/Community/Profile.jsx
import "./profile.scss";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { users, mockPosts } from "../../../Static/communityData";

import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckIcon from "@mui/icons-material/Check";

import Posts from "../../Components/Community/posts/Posts";

import { useFollow } from "../../../Context/FollowContext";
import { useFriends } from "../../../Context/FriendContext";

const Profile = () => {
  const { userId } = useParams();
  const user = users.find((u) => u.id === parseInt(userId));
  const userPosts = mockPosts.filter((p) => p.userId === parseInt(userId));

  const { follow, unfollow, isFollowing } = useFollow();
  const { addFriend, removeFriend, isFriend } = useFriends();

  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) return <div>User not found.</div>;

  const currentUser = { id: 1 }; // Replace with real auth later
  const isOwnProfile = user.id === currentUser.id;
  const alreadyFriend = isFriend(user.id);
  const following = isFollowing(user.id) || alreadyFriend;

  const handleFollowClick = () => {
    if (!following) {
      follow(user);
      addFriend(user);
    }
  };

  const handleUnfollow = () => {
    unfollow(user.id);
    removeFriend(user.id);
    setMenuOpen(false);
  };

  const handleReport = () => {
    // TODO: wire up your report flow
    alert(`User ${user.name} reported.`);
    setMenuOpen(false);
  };

  return (
    <div className="profile">
      <div className="images">
        <img
          src="https://images.pexels.com/photos/13440765/pexels-photo-13440765.jpeg"
          alt=""
          className="cover"
        />
        <img src={user.profilePic} alt="" className="profilePic" />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <a href="#">
              <FacebookTwoToneIcon fontSize="large" />
            </a>
            <a href="#">
              <InstagramIcon fontSize="large" />
            </a>
            <a href="#">
              <TwitterIcon fontSize="large" />
            </a>
            <a href="#">
              <LinkedInIcon fontSize="large" />
            </a>
            <a href="#">
              <PinterestIcon fontSize="large" />
            </a>
          </div>
          <div className="center">
            <span>{user.name}</span>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>YVC</span>
              </div>
              <div className="item">
                <LanguageIcon />
                <span>yvc.ac.il</span>
              </div>
            </div>

            {!isOwnProfile && (
              <button
                className={`followBtn ${following ? "following" : ""}`}
                onClick={following ? handleUnfollow : handleFollowClick}
              >
                {following ? (
                  <>
                    <CheckIcon fontSize="small" /> Following
                  </>
                ) : (
                  "Follow"
                )}
              </button>
            )}
          </div>

          <div className="right">
            <EmailOutlinedIcon />
            <div className="moreMenuWrapper">
              <div
                className="menuToggle"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <MoreVertIcon />
              </div>
              {menuOpen && (
                <div className="optionsMenu">
                  {following && (
                    <div className="optionItem" onClick={handleUnfollow}>
                      Unfollow
                    </div>
                  )}
                  <div className="optionItem" onClick={handleReport}>
                    Report
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <Posts posts={userPosts} />
      </div>
    </div>
  );
};

export default Profile;