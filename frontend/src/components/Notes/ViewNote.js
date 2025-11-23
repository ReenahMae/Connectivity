import React from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import "../Dashboard/Dashboard.css";
import "./Notes.css";

const ViewNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const notes = JSON.parse(localStorage.getItem("notes") || "[]");
  const note = notes.find((n) => String(n.id) === String(id));

  const handleLogout = () => {
    localStorage.removeItem("session");
    navigate("/login");
  };

  if (!note) {
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
            <button className="nav-item" onClick={() => navigate('/settings')}>🏷️ <span>Settings</span></button>
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

        <main className="viewnote-container">
          <h2>Note not found.</h2>
        </main>
      </div>
    );
  }

  const handleDelete = () => {
    if (!window.confirm("Delete this note?")) return;
    const updated = notes.filter((n) => String(n.id) !== String(id));
    localStorage.setItem("notes", JSON.stringify(updated));
    navigate("/dashboard");
  };

  return (
    <div className="dashboard-layout">
      {/* STATIC SIDEBAR */}
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
          <button className="nav-item" onClick={() => navigate('/settings')}>🏷️ <span>Settings</span></button>
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

      <main className="viewnote-container">
        <div className="viewnote-inner">

          <div className="header-row">
            <div className="breadcrumb-wrapper">
              <span className="back-arrow" onClick={() => navigate("/dashboard")}>←</span>
              <span className="crumb">Dashboard</span>
              <span className="crumb-sep">/</span>
              <span className="crumb active">{note.title || "Untitled Note"}</span>
            </div>

            <div className="header-actions">
              <Link to={`/note/${id}/edit`} className="edit-btn">Edit</Link>
              <button className="delete-btn" onClick={handleDelete}>Delete</button>
            </div>
          </div>

          <h1 className="note-title">{note.title || "Untitled Note"}</h1>
          <p className="modified-text">Last modified {note.modified}</p>

          <div className="note-content-box">
            <div className="note-text">{note.body || "Empty note..."}</div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ViewNote;
