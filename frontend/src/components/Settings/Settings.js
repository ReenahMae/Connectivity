import React from 'react';
import './Settings.css';
import '../Dashboard/Dashboard.css';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-logo">📚</div>
          <div className="sidebar-title">Connectivity</div>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item">📄 <span>My Notes</span></button>
          <button className="nav-item">📁 <span>My Folders</span></button>
          <button className="nav-item">🕘 <span>Activity Log</span></button>
          <button className="nav-item">🔗 <span>Shared with me</span></button>
          <button className="nav-item">🏷️ <span>AI Tags</span></button>
          <button className="nav-item" onClick={() => navigate('/settings')} aria-label="Settings">🏷️ <span>Settings</span></button>

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
            <button className="back-btn" onClick={() => navigate(-1)} aria-label="Back">←</button>
            <div className="settings-title-wrap">
              <h2 className="settings-title">Settings</h2>
              <div className="settings-sub">Manage your account and view analytics</div>
            </div>
          </header>

          <div className="tabs-wrapper">
            <div className="tabs-pill">
              <button className="tab active">Profile</button>
              <button className="tab">Analytics</button>
            </div>
          </div>

          <div className="settings-main">
            <section className="profile-card">
              <div className="profile-header">
                <h3>Profile Information</h3>
                <div className="profile-sub">Update your personal information</div>
              </div>

              <div className="profile-top">
                <div className="avatar">JS</div>
                <div className="photo-actions">
                  <button className="change-photo">
                    <span className="camera-icon">📷</span>
                    Change Photo
                  </button>
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
                <button className="save-btn">Save Changes</button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
