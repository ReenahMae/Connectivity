import React, { useContext, useState } from 'react';
import './Settings.css';
import '../Dashboard/Dashboard.css';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button/Button';
import { ThemeContext } from '../../context/ThemeContext';

const Settings = () => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-logo">📚</div>
          <div className="sidebar-title">Connectivity</div>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item" onClick={() => navigate('/dashboard')}>📄 <span>My Notes</span></button>
          <button className="nav-item">📁 <span>My Folders</span></button>
          <button className="nav-item">🕘 <span>Activity Log</span></button>
          <button className="nav-item">🔗 <span>Shared with me</span></button>
          <button className="nav-item">🏷️ <span>AI Tags</span></button>
          <button className="nav-item" onClick={() => navigate('/settings')}>⚙️ <span>Settings</span></button>
        </nav>

        <div className="sidebar-bottom">
          <div className="user-pill">
            <div className="user-initials">JS</div>
            <div className="user-info">
              <div className="user-name">John Student</div>
              <div className="user-email">john@university.edu</div>
            </div>
          </div>
          <button className="logout-btn" onClick={() => { localStorage.removeItem('session'); navigate('/login'); }}>Logout</button>
        </div>
      </aside>

      <main className="dashboard-inner content">
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
                {/* PROFILE SECTION */}
                <section className="profile-card">
                  <div className="profile-header">
                    <h3>Profile Information</h3>
                    <div className="profile-sub">Update your personal information</div>
                  </div>

                  <div className="profile-top">
                    <div className="avatar">JS</div>
                    <div className="photo-actions">
                      <Button variant="outline">
                        <span className="camera-icon">📷</span>
                        Change Photo
                      </Button>
                      <div className="photo-note">JPG, PNG or GIF. Max 2MB</div>
                    </div>
                  </div>

                  <div className="divider" />

                  <div className="form-grid">
                    <div className="field">
                      <label>First Name</label>
                      <input defaultValue="John" />
                    </div>
                    <div className="field">
                      <label>Last Name</label>
                      <input defaultValue="Student" />
                    </div>
                  </div>

                  <div className="field">
                    <label>Email Address</label>
                    <input defaultValue="john@university.edu" />
                  </div>

                  <div className="form-actions">
                    <Button variant="primary">Save Changes</Button>
                  </div>
                </section>

                {/* SECURITY SECTION */}
                <section className="security-card">
                  <h3 className="security-title">Security</h3>
                  <div className="security-sub">Manage your password and security settings</div>

                  <div className="security-field">
                    <label>Current Password</label>
                    <input placeholder="Enter current password" type="password" />
                  </div>

                  <div className="security-grid">
                    <div className="security-field">
                      <label>New Password</label>
                      <input placeholder="Enter new password" type="password" />
                    </div>

                    <div className="security-field">
                      <label>Confirm Password</label>
                      <input placeholder="Confirm new password" type="password" />
                    </div>
                  </div>

                  <Button variant="primary">Change Password</Button>
                </section>

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
