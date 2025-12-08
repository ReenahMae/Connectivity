import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, MoreVertical, FileText } from 'lucide-react';
import "./Dashboard.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import { getNotes, createNote, deleteNoteApi } from "../../api/NotesApi";

// Helper function to format date nicely
const formatModifiedDate = (dateString) => {
  if (!dateString) return "Unknown";
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return dateString;
  }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [notes, setNotes] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);

  // AUTH PROTECTION
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
    }

    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      if (!localStorage.getItem("token")) {
        navigate("/login", { replace: true });
      }
    };
  }, [navigate]);

  // LOAD NOTES
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    getNotes(user.id)
      .then(setNotes)
      .catch(err => console.error("Error loading notes:", err));
  }, []);

  // ADD NEW NOTE
  const addNewNote = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.id || user?.userId;
    if (!userId) {
      alert('Please login again (missing user id)');
      return;
    }

    try {
      const saved = await createNote({ userId, title: "", body: "" });
      navigate(`/note/${saved.id}/edit`);
    } catch (err) {
      console.error("Error creating note:", err);
      alert("Failed to create note.");
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("session");
    navigate("/login", { replace: true });
  };

  // DELETE NOTE
  const handleDeleteCard = (id) => {
    if (!window.confirm("Delete this note?")) return;

    const user = JSON.parse(localStorage.getItem("user"));

    deleteNoteApi(id, user.id)
      .then(() => {
        setNotes(notes.filter(n => n.id !== id));
        setOpenMenuId(null);
      })
      .catch(err => console.error("Delete failed:", err));
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="dashboard-layout">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        activeRoute="/dashboard"
        user={user}
        onLogout={handleLogout}
      />

      <main className={`content ${collapsed ? 'collapsed' : ''}`}>
        <div className="dashboard-inner">
          <header className="dashboard-header">
            <div>
              <h1>All Notes</h1>
              <span className="note-count">{notes.length} notes total</span>
            </div>

            <button className="new-note-btn" onClick={addNewNote}>
              <Plus size={20} />
              <span>New Note</span>
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
                <div className="note-icon-wrapper">
                  <FileText className="note-icon" size={30} />
                </div>

                <button
                  className="note-menu-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === note.id ? null : note.id);
                  }}
                >
                  <MoreVertical size={20} />
                </button>

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
                  {note.body ? note.body.slice(0, 80) : "Empty note…"}
                </p>
                <p className="modified">Last modified {formatModifiedDate(note.modified)}</p>
              </article>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;