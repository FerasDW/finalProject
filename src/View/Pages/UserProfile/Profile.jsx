import React, { useState } from "react";
import "./Profile.css";
import Box from "../../Components/Dashboard/Content/Box";

const Profile = () => {
  const [user, setUser] = useState({
    fullName: "John Smith",
    email: "john.smith@example.com",
    phone: "(123) 456-7890",
    address: "Bay Area, San Francisco, CA",
    profilePic: "https://via.placeholder.com/150",
    socialLinks: {
      website: "",
      github: "https://github.com/",
      twitter: "@johnsmith",
      instagram: "@1x_.m7",

    },
  });

  return (
    <div className="row">
      <Box
        contentBox={
          <div className="profile-header">
            <img
              src={user.profilePic}
              alt="Profile"
              className="profile-image"
            />
            <h2>{user.fullName}</h2>
            <p>{user.email}</p>
            <button className="follow-btn">Follow</button>
            <button className="message-btn">Message</button>
          </div>
        }
        gridRow="span 3"
        gridColumn="span 3"
      />
      <Box
        contentBox={
          <div className="profile-form">
            <label>Full Name</label>
            <input
              type="text"
              value={user.fullName}
              onChange={(e) => setUser({ ...user, fullName: e.target.value })}
            />
            <button className="edit-btn">Edit</button>
            <label>Email</label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
            <button className="edit-btn">Edit</button>

            <label>Phone</label>
            <input
              type="tel"
              value={user.phone}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
            />
            <button className="edit-btn">Edit</button>

            <label>Address</label>
            <input
              type="text"
              value={user.address}
              onChange={(e) => setUser({ ...user, address: e.target.value })}
            />
            <button className="edit-btn">Edit</button>
          </div>
        }
        gridRow="span 2"
        gridColumn="span 9"
      />
      <Box
        contentBox={        <div className="social-links">
          <h3>Social Links</h3>
          <ul>
            <li>
              <a
                href={user.socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                Website
              </a>
            </li>
            <li>
              <a
                href={user.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href={`https://twitter.com/${user.socialLinks.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
              </a>
            </li>
            <li>
              <a
                href={`https://instagram.com/${user.socialLinks.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>
          
        }
        gridRow="span 1"
        gridColumn="span 3"
      />

    </div>
  );
};

export default Profile;