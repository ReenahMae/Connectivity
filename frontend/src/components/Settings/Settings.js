import React, { useContext, useState, useEffect } from 'react';
import './Settings.css';
import '../Dashboard/Dashboard.css';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button/Button';
import ProfileSettings from './ProfileSettings';
import { ThemeContext } from '../../context/ThemeContext';
import Sidebar from '../Sidebar/Sidebar';

const Settings = () => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("sidebarCollapsed") === "true";
  });

  // Sidebar reads user info from localStorage and listens for updates
  const [storedUser, setStoredUser] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'));

  useEffect(() => {
    const handler = () => setStoredUser(JSON.parse(localStorage.getItem('user') || '{}'));
    window.addEventListener('userUpdated', handler);
    return () => window.removeEventListener('userUpdated', handler);
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleToggleSidebar = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    localStorage.setItem("sidebarCollapsed", newCollapsed);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar
        collapsed={collapsed}
        onToggle={handleToggleSidebar}
        activeRoute="/settings"
        user={storedUser}
        onLogout={handleLogout}
      />

      <main className={`dashboard-inner content ${collapsed ? 'collapsed' : ''}`}>
        <div className="settings-page">
          <header className="settings-header">
            <div className="settings-title-wrap">
              <h2 className="settings-title">Settings</h2>
              <div className="settings-sub">Manage your account and view analytics</div>
            </div>
          </header>

          <div className="tabs-wrapper">
            <div className="tabs-pill">
              <button className={`tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Profile</button>
              <button className={`tab ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>Analytics</button>
            </div>
          </div>

          <div className="settings-main">
            {activeTab === 'profile' ? (
              <>
                <ProfileSettings />

                {/* PREFERENCES */}
                <section className="preferences-card">
                  <h3 className="sec-title">Preferences</h3>
                  <div className="sec-sub">Customize your experience</div>

                  <div className="pref-item">
                    <div>
                      <div className="pref-title">🔔 Email Notifications</div>
                      <div className="pref-desc">Receive updates about your notes</div>
                    </div>
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="pref-item">
                    <div>
                      <div className="pref-title">🌓 Dark Mode</div>
                      <div className="pref-desc">Switch to dark theme</div>
                    </div>
                    <label className="switch">
                      <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
                      <span className="slider"></span>
                    </label>
                  </div>
                </section>

                {/* DANGER ZONE */}
                <section className="danger-zone">
                  <h3 className="danger-zone-title">Danger Zone</h3>
                  <div className="danger-zone-sub">Irreversible actions</div>
                  <Button variant="danger">🗑 Delete Account</Button>
                </section>
              </>
            ) : (
              /* ANALYTICS SECTION */
              <section className="analytics-card">
                <div className="analytics-header">
                  <h3>Analytics Overview</h3>
                  <div className="analytics-sub">Key metrics about your account</div>
                </div>

                <div className="analytics-grid">
                  <div className="stat-card">
                    <div className="stat-value">1,234</div>
                    <div className="stat-label">Active Users</div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-value">56%</div>
                    <div className="stat-label">Engagement</div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-value">4.2</div>
                    <div className="stat-label">Avg Rating</div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-value">87</div>
                    <div className="stat-label">Notes Created</div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
