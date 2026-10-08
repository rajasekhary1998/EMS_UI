import "./Sidebar.css";

import {
  FaTachometerAlt,
  FaBuilding,
  FaUsers,
  FaClipboardList,
  FaCalendarCheck,
  FaClock,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

import { MdGroups } from "react-icons/md";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar = ({
  collapsed,
}: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const isActive = (
    path: string
  ) => {
    return location.pathname === path;
  };

  return (
    <aside
      className={`sidebar ${
        collapsed ? "collapsed" : ""
      }`}
    >
      {/* Logo */}
      <div className="logo-section">
        <div className="logo">
          <MdGroups size={35} />
        </div>

        {!collapsed && (
          <div className="logo-text">
            <h2>EMS</h2>
            <p>
              Employee Management
            </p>
          </div>
        )}
      </div>

      {/* Menu */}
      <ul className="menu">
  <li
    className={isActive("/dashboard") ? "active" : ""}
    onClick={() => navigate("/dashboard")}
  >
    <FaTachometerAlt />
    {!collapsed && <span>Dashboard</span>}
  </li>

  <li
    className={isActive("/departments") ? "active" : ""}
    onClick={() => navigate("/departments")}
  >
    <FaBuilding />
    {!collapsed && <span>Departments</span>}
  </li>

  <li
    className={isActive("/employees") ? "active" : ""}
    onClick={() => navigate("/employees")}
  >
    <FaUsers />
    {!collapsed && <span>Employees</span>}
  </li>

  <li
    className={isActive("/designations") ? "active" : ""}
    onClick={() => navigate("/designations")}
  >
    <FaClipboardList />
    {!collapsed && <span>Designations</span>}
  </li>

<li
  className={isActive("/leave-management") ? "active" : ""}
  onClick={() => navigate("/leave-management")}
>
  <FaCalendarCheck />
  {!collapsed && <span>Leave Management</span>}
</li>

  <li
    className={isActive("/attendance") ? "active" : ""}
    onClick={() => navigate("/attendance")}
  >
    <FaClock />
    {!collapsed && <span>Attendance</span>}
  </li>

  <li
    className={isActive("/profile") ? "active" : ""}
    onClick={() => navigate("/profile")}
  >
    <FaUser />
    {!collapsed && <span>Profile</span>}
  </li>
</ul>

      {/* Logout */}
      <div
        className="logout"
        onClick={handleLogout}
      >
        <FaSignOutAlt />
        {!collapsed && (
          <span>Logout</span>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;