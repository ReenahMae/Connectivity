import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const notes = [
    { id: 1, title: 'Photosynthesis Summary', body: 'The process by which plants convert light energy into chemical energy...', modified: '2 hours ago' },
    { id: 2, title: 'World War II Timeline', body: 'Key events and dates from 1939-1945...', modified: '1 day ago' },
    { id: 3, title: 'Shakespeare Vocabulary', body: 'Common terms and their meanings from Hamlet...', modified: '3 days ago' },
    { id: 4, title: 'Cell Biology Notes', body: 'Understanding cellular structures and functions...', modified: '5 hours ago' },
    { id: 5, title: 'American Revolution', body: 'Causes and effects of the American Revolution...', modified: '2 days ago' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('session');
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-logo">📚</div>
          <div className="sidebar-title">Connectivity</div>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item active">📄 <span>My Notes</span></button>
          <button className="nav-item">📁 <span>My Folders</span></button>
          <button className="nav-item">🕘 <span>Activity Log</span></button>
          <button className="nav-item">🔗 <span>Shared with me</span></button>
          <button className="nav-item">🏷️ <span>AI Tags</span></button>
        </nav>

        <div className="sidebar-bottom">
          <div className="user-pill">
            <div className="user-initials">JS</div>
            <div className="user-info">
              <div className="user-name">John Student</div>
              <div className="user-email">john@university.edu</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      <main className="dashboard-inner content">
        <header className="dashboard-header">
          <div>
            <h1>All Notes</h1>
            <span className="note-count">{notes.length} notes total</span>
          </div>
          <button className="new-note-btn">+ New Note</button>
        </header>

        <section className="notes-grid">
          {notes.map(n => (
            <article key={n.id} className="note-card">
              <div className="note-icon" aria-hidden="true">📄</div>
              <h3>{n.title}</h3>
              <p className="note-body">{n.body}</p>
              <p className="modified">Last modified {n.modified}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
 