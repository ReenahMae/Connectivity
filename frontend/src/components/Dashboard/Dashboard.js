import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("notes");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const addNewNote = () => {
    const newNote = {
      id: Date.now(),
      title: "",
      body: "",
      modified: "just now"
    };

    setNotes([newNote, ...notes]);
    navigate(`/note/${newNote.id}/edit`);
  };

  const handleLogout = () => {
    localStorage.removeItem("session");
    navigate("/login");
  };

  const [openMenuId, setOpenMenuId] = useState(null);

   const handleDeleteCard = (id) => {
    if (!window.confirm("Delete this note?")) return;

    const remaining = notes.filter((n) => String(n.id) !== String(id));
    setNotes(remaining);
    setOpenMenuId(null);
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
          <button
            className="nav-item"
            onClick={() => navigate("/settings")}
            aria-label="Settings"
          >
            🏷️ <span>Settings</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="user-pill">
            <div className="user-initials">JS</div>
            <div className="user-info">
              <div className="user-name">John Student</div>
              <div className="user-email">john@university.edu</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      {/* --- Content area --- */}
      <main className="dashboard-inner content">
        <header className="dashboard-header">
          <div>
            <h1>All Notes</h1>
            <span className="note-count">{notes.length} notes total</span>
          </div>

          <button className="new-note-btn" onClick={addNewNote}>
            + New Note
          </button>
        </header>

        <section className="notes-grid">
          {notes.map((note) => (
            <article
              key={note.id}
              className="note-card"
              role="button"
              onClick={() => navigate(`/note/${note.id}`)}
            >
              <div className="note-icon" aria-hidden="true">📄</div>
{/* ⭐ NEW: 3-dot menu button */}
              <div
                className="note-menu-btn"
                onClick={(e) => {
                  e.stopPropagation(); 
                  setOpenMenuId(openMenuId === note.id ? null : note.id);
                }}
              >
                ⋮
              </div>

              {/* ⭐ NEW: Dropdown menu */}
              {openMenuId === note.id && (
                <div
                  className="note-menu"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button onClick={() => navigate(`/note/${note.id}`)}>Open</button>
                  <button onClick={() => navigate(`/note/${note.id}/edit`)}>Edit</button>
                  <button onClick={() => handleDeleteCard(note.id)}>Delete</button>
                </div>
              )}

              <h3>{note.title || "Untitled Note"}</h3>

              <p className="note-body">
                {note.body ? note.body.slice(0, 120) : "Empty note…"}
              </p>

              <p className="modified">Last modified {note.modified}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
