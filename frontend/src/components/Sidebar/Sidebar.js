import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';  // Import Link for navigation and logout redirect
import '../Sidebar.css';

const Sidebar = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const initials = user?.fullName ? user.fullName.split(" ").map(p => p[0]).join("") : "U";
  const email = user?.email || "";
  const name = user?.fullName || "User";

  const handleLogout = () => {
    localStorage.removeItem("session");
    // Optionally keep user data or remove: localStorage.removeItem("user");
    navigate("/login");
  };

  const location = useLocation();
  const links = [
    { to: '/dashboard', label: 'My Notes', icon: '📝' },
    { to: '/folders', label: 'My Folders', icon: '📁' },
    { to: '/activity-log', label: 'Activity Log', icon: '📊' },
    { to: '/shared', label: 'Shared with me', icon: '🤝' },
    { to: '/tags', label: 'AI Tags', icon: '🏷️' },
    { to: '/settings', label: 'Settings', icon: '🏷️' }

  ];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`} role="navigation">
      <div className="top-row">
        <div className="logo">{collapsed ? 'C' : 'Connectivity'}</div>
        <button
          type="button"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="sidebar-toggle"
          onClick={onToggle}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>
      <ul className="sidebar-nav">
        {links.map(l => (
          <li key={l.to} className={location.pathname === l.to ? 'active' : ''}>
            <Link to={l.to}>
              <span className="nav-icon" aria-hidden="true">{l.icon}</span>
              {!collapsed && <span className="link-text">{l.label}</span>}
            </Link>
          </li>
        ))}
      </ul>
      <div className="user-profile">
        <div className="user-header">
          <span className="user-initials" aria-label="User initials">{initials}</span>
          {!collapsed && (
            <div className="user-info">
              <span className="user-name">{name}</span>
              <span className="user-email">{email}</span>
            </div>
          )}
        </div>
        {!collapsed && <button className="logout-btn" onClick={handleLogout}>Logout</button>}
      </div>
    </aside>
  );
};

export default Sidebar;
 