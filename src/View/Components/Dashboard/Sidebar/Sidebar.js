import React, { useState } from "react";
import SidebarItem from "./SidebarItem";
import ChatInterface from "../ChatInterface/ChatInterface";
import '../../../../CSS/Dashboard/Sidebar.css';
import Logo from "../../../../Assets/Images/Logo/PNG/LogoSquare@0.5x.png";
import { AlignJustify } from "react-feather";

const Sidebar = ({ menuItems, position = "left"}) => {
  const [selected, setSelected] = useState("Home");
  const [isCollapsed, setIsCollapsed] = useState(false);
  // const [selectedItem, setselectedItem] = useState(null);

  const handleItemClick = (title) => {
    const contact = menuItems.find(item => item.title === title);
    if (position === "right") {
      setSelected(selected?.title === title ? null : contact);
    }

    if (position === "left") {
      setSelected(title);
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar sidebar-${position} ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="sidebar-content">
        <div className="sidebar-toggle" onClick={toggleSidebar}>
          <AlignJustify />
        </div>
        <div className="sidebar-header">
          <img className="sidebar-profile-image" src={Logo} alt="Profile" />
          <span className="sidebar-profile-username">test</span>
        </div>
        <nav className="sidebar-menu">
          {menuItems.map((item, index) => (
            <SidebarItem
              key={index}
              {...item}
              selected={selected}
              onClick={() => handleItemClick(item.title)}
              isCollapsed={isCollapsed}
              isActive={selected?.title === item.title}
            />
          ))}
        </nav>
      </div>
      {selected && position === "right" &&selected !== "Home" &&( // should fixed !!
        <ChatInterface
          contact={selected}
          onClose={() => {
            // setselectedItem(null);
            setSelected(null);
          }}
        />
      )}
    </div>
  );
};
export default Sidebar;