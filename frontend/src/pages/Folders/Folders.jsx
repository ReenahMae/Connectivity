import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { folderApi } from "../../api/folderApi";
import { activityApi } from "../../api/activityApi";
import "../../components/Dashboard/Dashboard.css";
import "./FoldersModal.css"; 

const Folders = () => {
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  
  // State for the "Three Dots" menu
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      setLoading(true);
      const data = await folderApi.getAllFolders();
      setFolders(data);
    } catch (err) {
      console.error("Error loading folders:", err);
    } finally {
      setLoading(false);
    }
  };

 const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      // 1. Create Folder
      const newFolder = {
        folderName: newFolderName,
        dateCreated: new Date().toISOString().split("T")[0],
      };
      await folderApi.createFolder(newFolder);

      // 2. Refresh UI
      setShowModal(false);
      setNewFolderName("");
      fetchFolders();

      // 3. AUTOMATIC LOG (Safe Block)
      try {
        await activityApi.createLog({
            activityType: `Created folder: ${newFolderName}`
            // No timestamp sent here; let Java handle it to avoid date errors
        });
      } catch (logErr) {
        console.warn("Tracking failed", logErr);
      }

    } catch (err) {
      alert("Failed to create folder");
    }
  };

  const handleDeleteFolder = async (id) => {
    if (!window.confirm("Delete this folder?")) return;
    try {
      await folderApi.deleteFolder(id);
      setFolders(folders.filter((f) => f.folderId !== id));
      setOpenMenuId(null); 
    } catch (err) {
      alert("Failed to delete folder");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("session");
    navigate("/login", { replace: true });
  };

  const getUserData = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : { fname: "User", email: "user@email.com" };
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-logo">📚</div>
          <div className="sidebar-title">Connectivity</div>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item" onClick={() => navigate("/dashboard")}>
            📄 <span>My Notes</span>
          </button>
          <button className="nav-item active">
            📁 <span>My Folders</span>
          </button>
          <button className="nav-item" onClick={() => navigate("/activity")}>🕘 <span>Activity Log</span></button>
          <button className="nav-item">🔗 <span>Shared with me</span></button>
          <button className="nav-item">🏷️ <span>AI Tags</span></button>
          <button className="nav-item" onClick={() => navigate("/settings")}>
            ⚙️ <span>Settings</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="user-pill">
            <div className="user-initials">{getUserData().fname[0]}</div>
            <div className="user-info">
              <div className="user-name">{getUserData().fname}</div>
              <div className="user-email">{getUserData().email}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="dashboard-inner content">
        <header className="dashboard-header">
          <div>
            <h1>My Folders</h1>
            <span className="note-count">{folders.length} folders total</span>
          </div>

          <button className="new-note-btn" onClick={() => setShowModal(true)}>
            + New Folder
          </button>
        </header>

        <section className="notes-grid">
          {loading ? (
            <p style={{ color: "#666" }}>Loading folders...</p>
          ) : folders.length === 0 ? (
            <p style={{ color: "#666" }}>No folders yet.</p>
          ) : (
            folders.map((folder) => (
              <article
                key={folder.folderId}
                className="note-card"
                role="button"
                onClick={() => navigate(`/folder/${folder.folderId}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="note-icon">📁</div>
                
                {/* Three Dots Menu Button */}
                <div
                  className="note-menu-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === folder.folderId ? null : folder.folderId);
                  }}
                >
                  ⋮
                </div>

                {/* Dropdown Menu */}
                {openMenuId === folder.folderId && (
                  <div className="note-menu" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => navigate(`/folder/${folder.folderId}`)}>Open</button>
                    <button onClick={() => handleDeleteFolder(folder.folderId)}>Delete</button>
                  </div>
                )}

                <h3>{folder.folderName}</h3>
                <p className="modified">Created: {folder.dateCreated}</p>
              </article>
            ))
          )}
        </section>
      </main>

      {/* --- CREATE FOLDER MODAL --- */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Folder</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder Name..."
                autoFocus
              />
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-create" onClick={handleCreateFolder}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Folders;