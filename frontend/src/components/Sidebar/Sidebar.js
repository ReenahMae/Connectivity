import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Folder, Clock, Share2, Tag, Timer, Settings, BookOpen, PanelLeftClose, PanelLeft, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ collapsed, onToggle, activeRoute, user, onLogout }) => {
  const navigate = useNavigate();

  const navigationLinks = [
    { to: '/notes', label: 'My Notes', icon: FileText },
    { to: '/folders', label: 'My Folders', icon: Folder },
    { to: '/activity', label: 'Activity Log', icon: Clock },
    { to: '/shared', label: 'Shared with me', icon: Share2 },
    { to: '/tags', label: 'AI Tags', icon: Tag },
    { to: '/timer', label: 'Study Timer', icon: Timer },
    { to: '/settings', label: 'Settings', icon: Settings }
  ];

  const initials = user?.fname ? user.fname[0].toUpperCase() : "U";

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {!collapsed ? (
        <>
          {/* EXPANDED STATE */}
            <div className="sidebar-header">
            <div className="logo-container">
              <div className="sidebar-logo">
                <BookOpen size={24} strokeWidth={2.5} title="Connectivity Notes" />
              </div>
              <div className="sidebar-title">Connectivity</div>
            </div>
            <button
              className="sidebar-toggle"
              onClick={onToggle}
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
            >
              <PanelLeftClose size={20} strokeWidth={2} />
            </button>
          </div>          <div className="sidebar-divider"></div>

          <nav className="sidebar-nav">
            {navigationLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeRoute === link.to;
              return (
                <button
                  key={link.to}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => navigate(link.to)}
                  title={link.label}
                >
                  <Icon size={20} strokeWidth={2} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="sidebar-bottom">
            <div className="user-card">
              <div className="user-initials">{initials}</div>
              <div className="user-info">
                <div className="user-name">{user?.fname || "User"}</div>
                <div className="user-email">{user?.email || "user@email.com"}</div>
              </div>
            </div>
            <button className="logout-btn" onClick={onLogout} title="Sign out of your account">
              <LogOut size={18} strokeWidth={2} />
              <span>Logout</span>
            </button>
          </div>
        </>
      ) : (
        <>
          {/* COLLAPSED STATE */}
          <div className="sidebar-collapsed-header">
            <button
              className="sidebar-toggle-collapsed"
              onClick={onToggle}
              aria-label="Expand sidebar"
              title="Expand sidebar"
            >
              <PanelLeft size={18} strokeWidth={2} />
            </button>
          </div>

          <div className="sidebar-divider"></div>

          <nav className="sidebar-nav-collapsed">
            {navigationLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeRoute === link.to;
              return (
                <button
                  key={link.to}
                  className={`nav-item-collapsed ${isActive ? 'active' : ''}`}
                  onClick={() => navigate(link.to)}
                  title={link.label}
                >
                  <Icon size={20} strokeWidth={2} />
                </button>
              );
            })}
          </nav>

          <div className="sidebar-bottom-collapsed">
            <div className="user-initials-collapsed">{initials}</div>
          </div>
        </>
      )}
    </aside>
  );
};

export default Sidebar;