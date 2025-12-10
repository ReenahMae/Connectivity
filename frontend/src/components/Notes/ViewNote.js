import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import "../Dashboard/Dashboard.css";
import "./Notes.css";
import { getNote, deleteNoteApi } from "../../api/NotesApi";
import { activityTracker } from "../../pages/ActivityLog/activityTracker";

const formatModifiedPH = (dateString) => {
  if (!dateString) return "Unknown";
  try {
    return new Date(dateString).toLocaleString("en-PH", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Manila",
    });
  } catch (e) {
    return dateString;
  }
};

const ViewNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return navigate("/login");

    setLoading(true);
    getNote(id, user.id)
      .then((note) => {
        setNote(note);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        navigate("/notes");
      });
  }, [id, navigate]);

  if (loading) {
    return (
      <main className="viewnote-container">
        <h2>Loading...</h2>
      </main>
    );
  }

  if (!note) {
    return (
      <main className="viewnote-container">
        <h2>Note not found.</h2>
      </main>
    );
  }

  const handleDelete = async () => {
    if (!window.confirm("Delete this note?")) return;
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user?.id || user?.userId;
    if (!userId) {
      alert("Please login again (missing user id)");
      return;
    }

     const noteTitle = note.title || "Untitled Note";

    try {
      await deleteNoteApi(id, userId);
      await activityTracker.logNoteDeleted(noteTitle);
      navigate("/notes");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete note.");
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/note/${id}`;
    if (navigator.share) {
      navigator.share({
        title: note.title,
        text: note.body,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <main className="viewnote-container">
      <div className="viewnote-inner">
        <div className="header-row">
          <div className="header-left">
            <button
              className="back-btn"
              onClick={() => navigate("/notes")}
              aria-label="Back to notes"
            >
              ←
            </button>
            <div className="breadcrumb-stack">
              <div className="breadcrumb-wrapper">
                <span 
                  className="crumb" 
                  onClick={() => navigate("/notes")}
                  role="button"
                  tabIndex={0}
                >
                  Dashboard
                </span>
                <span className="crumb-sep">/</span>
                <span className="crumb">Science Notes</span>
                <span className="crumb-sep">/</span>
                <span className="crumb active">{note.title || "Untitled"}</span>
              </div>
            </div>
          </div>

          <div className="header-actions">
            <button 
              className="action-btn share-btn" 
              onClick={handleShare}
              title="Share note"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
              Share
            </button>
            <Link to={`/note/${id}/edit`} className="action-btn edit-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Edit
            </Link>
            <button className="action-btn delete-btn" onClick={handleDelete}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
              Delete
            </button>
          </div>
        </div>

        <h1 className="note-title">{note.title || "Untitled Note"}</h1>

        <div className="note-content-box">
          <div 
            className="note-text" 
            dangerouslySetInnerHTML={{ __html: note.body || "Empty note..." }} 
          />
        </div>
      </div>
    </main>
  );
};

export default ViewNote;