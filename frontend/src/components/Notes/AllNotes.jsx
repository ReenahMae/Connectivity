import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, MoreVertical, FileText } from "lucide-react";
import Sidebar from "../../components/Sidebar/Sidebar";
import { getNotes, createNote, deleteNoteApi } from "../../api/NotesApi";
import "./AllNotes.css";

// Format date helper
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
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

const AllNotes = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [notes, setNotes] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);

  // AUTH CHECK
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login", { replace: true });
  }, [navigate]);

  // LOAD NOTES
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    getNotes(user.id)
      .then(setNotes)
      .catch((err) => console.error("Error loading notes:", err));
  }, []);

  // CREATE NOTE
  const addNewNote = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user?.id;

    if (!userId) return alert("Missing user ID, please login again.");

    try {
      const saved = await createNote({ userId, title: "", body: "" });
      navigate(`/note/${saved.id}/edit`);
    } catch (err) {
      console.error("Error creating note:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const deleteNote = async (id) => {
    if (!window.confirm("Delete this note?")) return;

    const user = JSON.parse(localStorage.getItem("user"));

    try {
      await deleteNoteApi(id, user.id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }

    setOpenMenuId(null);
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="allnotes-layout">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        activeRoute="/notes"
        user={user}
        onLogout={handleLogout}
      />

      <main className={`allnotes-content ${collapsed ? "collapsed" : ""}`}>
        <div className="allnotes-inner">
          <header className="allnotes-header">
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
                  <FileText size={30} className="note-icon" />
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
                  <div className="note-menu" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => navigate(`/note/${note.id}`)}>Open</button>
                    <button onClick={() => navigate(`/note/${note.id}/edit`)}>Edit</button>
                    <button onClick={() => deleteNote(note.id)}>Delete</button>
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

export default AllNotes;
