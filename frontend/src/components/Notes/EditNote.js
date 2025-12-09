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
  const [alignment, setAlignment] = useState("left");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    if (!u) return navigate("/login");

    setUser(u);

    getNote(id, u.id)
      .then(noteData => {
        setTitle(noteData.title || "");
        setBody(noteData.body || "");
        setAlignment(noteData.alignment || "left");
      })
      .catch(err => {
        console.error("Failed to load note:", err);
      });
  }, [id, navigate]);

  const saveNote = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.id || user?.userId;
    if (!userId) {
      alert('Please login again (missing user id)');
      return;
    }

    try {
      await updateNote(id, { title, body, alignment }, userId);
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
      .then(() => navigate("/notes"))
      .catch(err => console.error("Delete failed:", err));
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/note/${id}`;
    if (navigator.share) {
      navigator.share({
        title: title,
        text: body,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <main className="editnote-container">
      <div className="editnote-inner">
        <div className="header-row">
          <div className="header-left">
            <button
              className="back-btn"
              onClick={() => navigate(`/note/${id}`)}
              aria-label="Back to note"
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
                <span className="crumb active">{title || "Untitled"}</span>
              </div>
            </div>
          </div>

          <div className="header-actions">
            <div className="alignment-controls">
              <button
                className={`align-btn ${alignment === 'left' ? 'active' : ''}`}
                onClick={() => setAlignment('left')}
                title="Align left"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="17" y1="10" x2="3" y2="10"></line>
                  <line x1="21" y1="6" x2="3" y2="6"></line>
                  <line x1="21" y1="14" x2="3" y2="14"></line>
                  <line x1="17" y1="18" x2="3" y2="18"></line>
                </svg>
                <span>Left</span>
              </button>
              <button
                className={`align-btn ${alignment === 'center' ? 'active' : ''}`}
                onClick={() => setAlignment('center')}
                title="Align center"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="19" y1="10" x2="5" y2="10"></line>
                  <line x1="21" y1="6" x2="3" y2="6"></line>
                  <line x1="21" y1="14" x2="3" y2="14"></line>
                  <line x1="19" y1="18" x2="5" y2="18"></line>
                </svg>
                <span>Center</span>
              </button>
              <button
                className={`align-btn ${alignment === 'right' ? 'active' : ''}`}
                onClick={() => setAlignment('right')}
                title="Align right"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="21" y1="10" x2="7" y2="10"></line>
                  <line x1="21" y1="6" x2="3" y2="6"></line>
                  <line x1="21" y1="14" x2="3" y2="14"></line>
                  <line x1="21" y1="18" x2="7" y2="18"></line>
                </svg>
                <span>Right</span>
              </button>
            </div>

            <div className="action-buttons">
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
              <button className="action-btn delete-btn" onClick={deleteNote}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
                Delete
              </button>
              <button className="save-btn" onClick={saveNote}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Save
              </button>
            </div>
          </div>
        </div>

        <input
          className="edit-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title..."
        />

        <textarea
          className="edit-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Start typing..."
          style={{ textAlign: alignment }}
        />
      </div>
    </main>
  );
};

export default EditNote;