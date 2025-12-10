import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../Dashboard/Dashboard.css";
import "./Notes.css";
import { getNote, updateNote, createNote, deleteNoteApi } from "../../api/NotesApi";
import { activityApi } from "../../api/activityApi"; 

const EditNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);

  const isNew = id === "new" || !id;

  const [title, setTitle] = useState("");
  const [body, setBody] = useState(""); 
  const [alignment, setAlignment] = useState("left");
  
  // LOAD DATA
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return navigate("/login");

    if (!isNew) {
      getNote(id, user.id)
        .then(noteData => {
          setTitle(noteData.title || "");
          setBody(noteData.body || "");
          setAlignment(noteData.alignment || "left");
          
          if (editorRef.current) {
            editorRef.current.innerHTML = noteData.body || "";
          }
        })
        .catch(err => console.error("Failed to load note:", err));
    }
  }, [id, isNew, navigate]);

  // SAVE NOTE
  const saveNote = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.id || user?.userId;
    
    if (!userId) return alert('Please login again');

    const content = editorRef.current ? editorRef.current.innerHTML : body;
    const noteData = { userId, title: title || "Untitled", body: content, alignment };

    try {
      if (isNew) {
        const saved = await createNote(noteData);
        try { await activityApi.createLog({ activityType: `Created note: ${saved.title}` }); } catch (e) {}
        navigate(`/note/${saved.id}`, { replace: true });
      } else {
        await updateNote(id, noteData, userId);
        try { await activityApi.createLog({ activityType: `Edited note: ${title}` }); } catch (e) {}
        navigate(`/note/${id}`);
      }
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save note.');
    }
  };

  const deleteNote = async () => {
    if (isNew) return navigate("/notes");
    if (!window.confirm("Delete this note?")) return;
    const user = JSON.parse(localStorage.getItem("user"));
    try {
        await deleteNoteApi(id, user.id);
        try { await activityApi.createLog({ activityType: `Deleted note: ${title}` }); } catch (e) {}
        navigate("/notes");
    } catch(err) { console.error(err); }
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied!");
  };

  const formatText = (command) => {
    document.execCommand(command, false, null);
    if (editorRef.current) setBody(editorRef.current.innerHTML);
  };

  return (
    <main className="editnote-container">
      <div className="editnote-inner">
        <div className="header-row">
          <div className="header-left">
            <button className="back-btn" onClick={() => navigate("/notes")}>←</button>
            <div className="breadcrumb-stack">
              <div className="breadcrumb-wrapper">
                 <span className="crumb" onClick={() => navigate("/notes")}>Dashboard</span>
                 <span className="crumb-sep">/</span>
                 <span className="crumb">Notes</span>
                 <span className="crumb-sep">/</span>
                 <span className="crumb active">{isNew ? "New Note" : title}</span>
              </div>
            </div>
          </div>

          <div className="header-actions">
            {/* FORMATTING CONTROLS */}
            <div className="alignment-controls" style={{ marginRight: '10px' }}>
              <button className="align-btn" onMouseDown={(e) => {e.preventDefault(); formatText('bold')}}><b>B</b></button>
              <button className="align-btn" onMouseDown={(e) => {e.preventDefault(); formatText('italic')}}><i>I</i></button>
              <button className="align-btn" onMouseDown={(e) => {e.preventDefault(); formatText('underline')}}><u>U</u></button>
            </div>

            <div className="alignment-controls">
               <button className={`align-btn ${alignment === 'left' ? 'active' : ''}`} onClick={() => setAlignment('left')}>
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>
               </button>
               <button className={`align-btn ${alignment === 'center' ? 'active' : ''}`} onClick={() => setAlignment('center')}>
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="10" x2="5" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="19" y1="18" x2="5" y2="18"/></svg>
               </button>
               <button className={`align-btn ${alignment === 'right' ? 'active' : ''}`} onClick={() => setAlignment('right')}>
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/></svg>
               </button>
            </div>

            <div className="action-buttons">
              <button className="action-btn share-btn" onClick={handleShare}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                Share
              </button>
              
              {!isNew && (
                <button className="action-btn delete-btn" onClick={deleteNote}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  Delete
                </button>
              )}
              
              <button className="save-btn" onClick={saveNote}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                {isNew ? "Create" : "Save"}
              </button>
            </div>
          </div>
        </div>

        <input className="edit-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note title..." />

        <div
          ref={editorRef}
          className="edit-body"
          contentEditable
          suppressContentEditableWarning={true}
          style={{ textAlign: alignment, minHeight: '500px', outline: 'none', whiteSpace: 'pre-wrap' }}
          onInput={(e) => setBody(e.currentTarget.innerHTML)}
        />
      </div>
    </main>
  );
};

export default EditNote;