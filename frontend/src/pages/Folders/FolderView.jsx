import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, X, FileText } from "lucide-react";
import { folderApi } from "../../api/folderApi";
import { getNotes } from "../../api/NotesApi";
import Sidebar from "../../components/Sidebar/Sidebar";
import "../../components/Dashboard/Dashboard.css";
import "./FolderView.css";
import { activityApi } from "../../api/activityApi";

const FolderView = () => {
  const navigate = useNavigate();
  const { folderId } = useParams();
  
  const [collapsed, setCollapsed] = useState(() => {
    return JSON.parse(localStorage.getItem("sidebarCollapsed") || "false");
  });
  const [folder, setFolder] = useState(null);
  const [folderNotes, setFolderNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [showNoteSelector, setShowNoteSelector] = useState(false);
  const [availableNotes, setAvailableNotes] = useState([]);
  const [selectedNotes, setSelectedNotes] = useState([]);

  useEffect(() => {
    if (!folderId || folderId === "undefined") {
      navigate("/folders");
      return;
    }
    fetchFolderAndNotes();
  }, [folderId, navigate]);

  const fetchFolderAndNotes = async () => {
    try {
      setLoading(true);
      const data = await folderApi.getFolder(folderId);
      if (data) {
        setFolder(data);
        setEditedName(data.folderName);
      }
      const notes = await folderApi.getNotesInFolder(folderId);
      setFolderNotes(notes);
    } catch (err) {
      console.error("Error loading folder:", err);
      alert("Folder not found");
      navigate("/folders");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateName = async () => {
    if (!editedName.trim()) {
      alert("Folder name cannot be empty");
      return;
    }
    const oldName = folder.folderName;

    try {
      const updatedFolder = { ...folder, folderName: editedName };
      await folderApi.updateFolder(folderId, updatedFolder);
      
      try {
        await activityApi.createLog({ 
          activityType: `Renamed folder: "${oldName}" to "${editedName}"` 
        });
      } catch (e) { console.warn(e); }

      setFolder(updatedFolder);
      setIsEditing(false);
    } catch (err) {
      alert("Failed to update name");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this folder?")) return;
    const folderName = folder.folderName;
    
    try {
      await folderApi.deleteFolder(folderId);
      try {
        await activityApi.createLog({ 
          activityType: `Deleted folder: ${folderName}` 
        });
      } catch (e) { console.warn(e); }

      navigate("/folders");
    } catch (err) {
      alert("Failed to delete folder");
    }
  };

  const handleOpenNoteSelector = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) {
      alert("Please login again");
      return;
    }

    try {
      const notes = await getNotes(user.id);
      const notesNotInFolder = notes.filter(
        note => !note.folderId || note.folderId.toString() !== folderId.toString()
      );
      setAvailableNotes(notesNotInFolder);
      setShowNoteSelector(true);
    } catch (err) {
      console.error("Error loading notes:", err);
      alert("Failed to load notes");
    }
  };

  const toggleNoteSelection = (noteId) => {
    setSelectedNotes(prev => 
      prev.includes(noteId) 
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId]
    );
  };

  const handleAddNotesToFolder = async () => {
    if (selectedNotes.length === 0) {
      alert("Please select at least one note");
      return;
    }

    try {
      await folderApi.addNotesToFolder(folderId, selectedNotes);
      
      // --- FIX: CHANGED LOG FORMAT ---
      // We use "Added to folder:" as the prefix, so the details appear after it.
      try {
        await activityApi.createLog({ 
          activityType: `Added to folder: ${selectedNotes.length} note(s) added to ${folder.folderName}` 
        });
      } catch (e) { console.warn(e); }
      
      setShowNoteSelector(false);
      setSelectedNotes([]);
      alert(`Successfully added ${selectedNotes.length} note(s) to folder`);
      await fetchFolderAndNotes();
    } catch (err) {
      console.error("Error adding notes:", err);
      alert("Failed to add notes to folder");
    }
  };

  const handleRemoveNote = async (noteId) => {
    if (!window.confirm("Remove this note from the folder?")) return;

    const noteToRemove = folderNotes.find(n => n.id === noteId);
    const noteTitle = noteToRemove?.title || "Untitled Note";
    
    try {
      await folderApi.removeNoteFromFolder(folderId, noteId);
      
      try {
        await activityApi.createLog({ 
          activityType: `Removed note: "${noteTitle}" from folder "${folder.folderName}"` 
        });
      } catch (e) { console.warn(e); }

      await fetchFolderAndNotes();
    } catch (err) {
      console.error("Error removing note:", err);
      alert("Failed to remove note");
    }
  };

  // ... (Keep the rest of your component exactly the same: logout, toggleSidebar, return statement, etc.)
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("session");
    navigate("/login", { replace: true });
  };

  const handleToggleSidebar = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    localStorage.setItem("sidebarCollapsed", JSON.stringify(newCollapsed));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleUpdateName();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditedName(folder.folderName);
    }
  };

  const handleBlur = () => {
    if (isEditing) {
      handleUpdateName();
    }
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (loading) {
    return (
      <div className="dashboard-layout">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading folder...</p>
        </div>
      </div>
    );
  }

  if (!folder) return null;

  return (
    <div className="dashboard-layout">
      <Sidebar
        collapsed={collapsed}
        onToggle={handleToggleSidebar}
        activeRoute="/folders"
        user={user}
        onLogout={handleLogout}
      />

      <main className={`content ${collapsed ? 'collapsed' : ''}`}>
        <div className="folder-view-container">
          <div className="folder-view-header">
            <button className="back-button" onClick={() => navigate("/folders")}>← Back to Folders</button>

            <div className="folder-title-section">
              {isEditing ? (
                <input 
                  value={editedName} 
                  onChange={(e) => setEditedName(e.target.value)}
                  onKeyDown={handleKeyPress}
                  onBlur={handleBlur}
                  className="folder-name-input"
                  autoFocus
                  placeholder="Enter folder name"
                />
              ) : (
                <h1 className="folder-title" onClick={() => setIsEditing(true)}>
                  {folder.folderName}
                </h1>
              )}
            </div>

            <div className="header-actions">
                <button className="btn-add-note" onClick={handleOpenNoteSelector} title="Add Notes to Folder">
                    <Plus size={20} /> Add Notes
                </button>
                <button className="btn-delete-folder" onClick={handleDelete} title="Delete Folder">
                    <i className="fas fa-trash"></i>
                </button>
            </div>
          </div>

          <div className="notes-grid">
            {folderNotes.length === 0 ? (
              <div className="empty-notes-state">
                <div className="empty-icon">📝</div>
                <h3>No notes in this folder</h3>
                <p>Click "Add Notes" above to add notes to this folder</p>
              </div>
            ) : (
              folderNotes.map((note) => (
                <div key={note.id} className="note-card" onClick={() => navigate(`/note/${note.id}`)}>
                  <button 
                    className="note-remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveNote(note.id);
                    }}
                    title="Remove from folder"
                  >
                    ×
                  </button>
                  <div className="note-icon-wrapper">
                     <FileText size={28} className="note-icon" />
                  </div>
                  <h3>{note.title || "Untitled Note"}</h3>
                  <div 
                    className="note-body-preview"
                    dangerouslySetInnerHTML={{ __html: note.body || "Empty note" }}
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      color: '#666',
                      fontSize: '14px'
                    }}
                  />
                  <div className="note-date">
                    {new Date(note.modified).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Note Selector Modal */}
      {showNoteSelector && (
        <div className="modal-overlay" onClick={() => setShowNoteSelector(false)}>
          <div className="modal-content note-selector-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Select Notes to Add</h2>
              <button className="modal-close" onClick={() => setShowNoteSelector(false)}><X size={24} /></button>
            </div>
            
            <div className="modal-body">
              <p className="note-selector-hint">Selected: {selectedNotes.length} note(s)</p>
              <div className="notes-selection-grid">
                {availableNotes.length === 0 ? (
                  <p className="no-notes-message">No available notes to add.</p>
                ) : (
                  availableNotes.map((note) => (
                    <div
                      key={note.id}
                      className={`selectable-note-card ${selectedNotes.includes(note.id) ? 'selected' : ''}`}
                      onClick={() => toggleNoteSelection(note.id)}
                    >
                      <div className="note-checkbox">{selectedNotes.includes(note.id) && '✓'}</div>
                      <div className="note-info">
                        <h4>{note.title || "Untitled Note"}</h4>
                        <div 
                          className="note-body-preview-small"
                          dangerouslySetInnerHTML={{ __html: note.body || "Empty note" }}
                          style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: '12px', color: '#888' }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => { setShowNoteSelector(false); setSelectedNotes([]); }}>Cancel</button>
              <button className="btn-create" onClick={handleAddNotesToFolder} disabled={selectedNotes.length === 0}>
                Add {selectedNotes.length > 0 ? `${selectedNotes.length} ` : ''}Note(s)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FolderView;