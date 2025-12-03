import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../Dashboard/Dashboard.css";
import "./Notes.css";
import { getNote, updateNote, deleteNoteApi } from "../../api/NotesApi";


const EditNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [user, setUser] = useState(null);

useEffect(() => {
  const u = JSON.parse(localStorage.getItem("user"));
  if (!u) return navigate("/login");

  setUser(u);

  getNote(id, u.id)
    .then(noteData => {
      setTitle(noteData.title || "");
      setBody(noteData.body || "");
    })
    .catch(err => {
      console.error("Failed to load note:", err);
      // ❗ Do NOT redirect here
    });
}, [id, navigate]);



  const handleLogout = () => {
    localStorage.removeItem("session");
    navigate("/login");
  };

const saveNote = async () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user?.id || user?.userId;
  if (!userId) { alert('Please login again (missing user id)'); return; }

  try {
    await updateNote(id, { title, body }, userId);
    navigate(`/note/${id}`);
  } catch (err) {
    console.error('Save failed:', err);
    alert('Failed to save note.');
  }
};





const deleteNote = () => {
  if (!window.confirm("Delete this note?")) return;

  const user = JSON.parse(localStorage.getItem("user"));

  deleteNoteApi(id, user.id)
    .then(() => navigate("/dashboard"))
    .catch(err => console.error("Delete failed:", err));
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
          <button className="nav-item" onClick={() => navigate("/folders")}>📁 <span>My Folders</span></button>
          <button className="nav-item" onClick={() => navigate("/activity")}>🕘 <span>Activity Log</span></button>
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
