import "./profile.scss";
import { useParams } from "react-router-dom";
import {
  users,
  mockPosts
} from "../../../Static/communityData";

import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../Components/Community/posts/Posts";

const Profile = () => {
  const { userId } = useParams();
  const user = users.find((u) => u.id === parseInt(userId));
  const userPosts = mockPosts.filter((post) => post.userId === parseInt(userId));

  if (!user) return <div>User not found.</div>;

  return (
    <div className="profile">
      <div className="images">
        <img
          src="https://images.pexels.com/photos/13440765/pexels-photo-13440765.jpeg"
          alt=""
          className="cover"
        />
        <img
          src={user.profilePic}
          alt=""
          className="profilePic"
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <a href="http://facebook.com"><FacebookTwoToneIcon fontSize="large" /></a>
            <a href="http://instagram.com"><InstagramIcon fontSize="large" /></a>
            <a href="http://twitter.com"><TwitterIcon fontSize="large" /></a>
            <a href="http://linkedin.com"><LinkedInIcon fontSize="large" /></a>
            <a href="http://pinterest.com"><PinterestIcon fontSize="large" /></a>
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
            <button>Follow</button>
          </div>
          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div>
        </div>
        <Posts posts={userPosts} />
      </div>
    </div>
  );
};

export default Profile;
