import { Moon, Sun, Bell, Search, User } from "react-feather";

const Topbar = () => {
  return (
    <div className="topbar">
      {/* SEARCH BAR */}
      <Search />
      
      {/* ICONS */}
      <Moon />
      <Sun />
      <Bell />
      <User />
    </div>
  );
};

export default Topbar;