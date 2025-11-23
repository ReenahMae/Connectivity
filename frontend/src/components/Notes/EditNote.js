import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../Dashboard/Dashboard.css";
import "./Notes.css";

const EditNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const loadNotes = () => JSON.parse(localStorage.getItem("notes") || "[]");

  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    const n = loadNotes();
    setNotes(n);

    const entry = n.find((e) => String(e.id) === String(id));
    if (!entry) return navigate("/dashboard");

    setTitle(entry.title || "");
    setBody(entry.body || "");
  }, [id, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("session");
    navigate("/login");
  };

  const saveNote = () => {
    const updated = notes.map((n) =>
      String(n.id) === String(id)
        ? {
            ...n,
            title: title || "Untitled Note",
            body,
            modified: new Date().toLocaleString(),
          }
        : n
    );

    localStorage.setItem("notes", JSON.stringify(updated));
    navigate(`/note/${id}`);
  };

  const deleteNote = () => {
    if (!window.confirm("Delete this note?")) return;

    const remaining = notes.filter((n) => String(n.id) !== String(id));
    localStorage.setItem("notes", JSON.stringify(remaining));
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

      <main className="editnote-container">
        <div className="editnote-inner">

          <div className="header-row">
            <div className="breadcrumb-wrapper">
              <span className="back-arrow" onClick={() => navigate(`/note/${id}`)}>←</span>
              <span className="crumb">Dashboard</span>
              <span className="crumb-sep">/</span>
              <span className="crumb active">Edit Note</span>
            </div>

            <div className="header-actions">
              <button className="delete-btn" onClick={deleteNote}>Delete</button>
              <button className="save-btn" onClick={saveNote}>Save</button>
            </div>
          </div>

          <input
            className="edit-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="edit-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />

        </div>
      </main>
    </div>
  );
};

export default EditNote;
