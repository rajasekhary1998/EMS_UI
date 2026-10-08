import "./Header.css";

import { FaBars, FaUserCircle } from "react-icons/fa";

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

const Header = ({
  collapsed,
  setCollapsed,
}: HeaderProps) => {
  return (
    <header className="header">
      <div className="header-left">
        <FaBars
          className="menu-toggle"
          onClick={() =>
            setCollapsed(!collapsed)
          }
        />

        <h2 className="app-title">
          Employee Management System
        </h2>
      </div>

      <div className="profile-section">
        <FaUserCircle
          className="profile-icon"
        />
        <span>Admin</span>
      </div>
    </header>
  );
};

export default Header;