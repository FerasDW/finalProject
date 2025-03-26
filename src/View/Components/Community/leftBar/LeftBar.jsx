import "./leftBar.scss";
import Friends from "../../../../Assets/1.png";
import Groups from "../../../../Assets/2.png";
import Market from "../../../../Assets/3.png";
import Watch from "../../../../Assets/4.png";
import Memories from "../../../../Assets/5.png";
import Events from "../../../../Assets/6.png";
import Gaming from "../../../../Assets/7.png";
import Gallery from "../../../../Assets/8.png";
import Videos from "../../../../Assets/9.png";
import Messages from "../../../../Assets/10.png";
import Tutorials from "../../../../Assets/11.png";
import Courses from "../../../../Assets/12.png";
import Fund from "../../../../Assets/13.png";
// import { AuthContext } from "../../../../Context/AuthContext";
// import { useContext } from "react";

const LeftBar = () => {

  // const { currentUser } = useContext(AuthContext);

  const currentUser = {
    id: 1,
    name: "John Doe",
    profilePic:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  };

  return (
    <div className="leftBar">
      <div className="leftBarMenus">
        <div className="menu">
          <div className="user">
            <img
              src={currentUser.profilePic}
              alt=""
            />
            <span>{currentUser.name}</span>
          </div>
          <div className="item">
            <img src={Friends} alt="" />
            <span>Friends</span>
          </div>
          <div className="item">
            <img src={Groups} alt="" />
            <span>Groups</span>
          </div>
          <div className="item">
            <img src={Market} alt="" />
            <span>Marketplace</span>
          </div>
          <div className="item">
            <img src={Watch} alt="" />
            <span>Watch</span>
          </div>
          <div className="item">
            <img src={Memories} alt="" />
            <span>Memories</span>
          </div>
        </div>
        <hr />
        {/* <div className="menu">
          <span>Your shortcuts</span>
          <div className="item">
            <img src={Events} alt="" />
            <span>Events</span>
          </div>
          <div className="item">
            <img src={Gaming} alt="" />
            <span>Gaming</span>
          </div>
          <div className="item">
            <img src={Gallery} alt="" />
            <span>Gallery</span>
          </div>
          <div className="item">
            <img src={Videos} alt="" />
            <span>Videos</span>
          </div>
          <div className="item">
            <img src={Messages} alt="" />
            <span>Messages</span>
                    </div>

          </div> */}
        <hr />
      </div>
    </div>
  );
};

export default LeftBar;
