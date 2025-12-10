import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Folder, FolderPlus } from "lucide-react";
import { folderApi } from "../../api/folderApi";
import { activityApi } from "../../api/activityApi";
import "../../components/Dashboard/Dashboard.css";
import "./Folders.css";
import Sidebar from "../../components/Sidebar/Sidebar";

const Folders = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("sidebarCollapsed") === "true";
  });
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolder, setEditingFolder] = useState(null);
  const [editedName, setEditedName] = useState("");
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
      const newFolder = {
        folderName: newFolderName,
        dateCreated: new Date().toISOString().split("T")[0],
      };
      await folderApi.createFolder(newFolder);

      setShowModal(false);
      setNewFolderName("");
      fetchFolders();

      try {
        await activityApi.createLog({
          activityType: `Created folder: ${newFolderName}`
        });
      } catch (logErr) {
        console.warn("Tracking failed", logErr);
      }
    } catch (err) {
      alert("Failed to create folder");
    }
  };

  const handleEditFolder = (folder) => {
    setEditingFolder(folder);
    setEditedName(folder.folderName);
    setShowEditModal(true);
    setOpenMenuId(null);
  };

  const handleUpdateFolder = async () => {
    if (!editedName.trim()) {
      alert("Folder name cannot be empty");
      return;
    }

    try {
      const updatedFolder = {
        ...editingFolder,
        folderName: editedName
      };
      await folderApi.updateFolder(editingFolder.folderId, updatedFolder);
      
      setShowEditModal(false);
      setEditingFolder(null);
      setEditedName("");
      fetchFolders();

      try {
        await activityApi.createLog({
          activityType: `Renamed folder to: ${editedName}`
        });
      } catch (logErr) {
        console.warn("Tracking failed", logErr);
      }
    } catch (err) {
      alert("Failed to update folder");
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

  const handleToggleSidebar = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    localStorage.setItem("sidebarCollapsed", newCollapsed);
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleKeyPress = (e, action) => {
    if (e.key === "Enter") {
      if (action === "create") {
        handleCreateFolder();
      } else if (action === "edit") {
        handleUpdateFolder();
      }
    }
  };

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
        <div className="dashboard-inner">
          <header className="folders-header">
            <div>
              <h1>My Folders</h1>
              <p className="folders-subtitle">Organize your notes into folders</p>
            </div>

            <button className="new-note-btn" onClick={() => setShowModal(true)}>
              <FolderPlus size={20} />
              New Folder
            </button>
          </header>

          <section className="folders-grid">
            {loading ? (
              <p className="no-folders">Loading folders...</p>
            ) : folders.length === 0 ? (
              <p className="no-folders">No folders yet. Create your first folder!</p>
            ) : (
              folders.map((folder) => (
                <article
                  key={folder.folderId}
                  className="folder-card-modern"
                  onClick={() => navigate(`/folder/${folder.folderId}`)}
                >
                  {/* Three Dots Menu */}
                  <div
                    className="folder-menu-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === folder.folderId ? null : folder.folderId);
                    }}
                  >
                    ⋮
                  </div>

                  {openMenuId === folder.folderId && (
                    <div className="folder-menu" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => handleEditFolder(folder)}>
                        Edit
                      </button>
                      <button onClick={() => handleDeleteFolder(folder.folderId)}>
                        Delete
                      </button>
                    </div>
                  )}

                  {/* Folder Icon */}
                  <div className="folder-icon-modern">
                    <Folder size={30} color="#8b5cf6" strokeWidth={2} />
                  </div>

                  {/* Folder Name */}
                  <h3 className="folder-name-modern">{folder.folderName}</h3>

                  {/* Footer Info */}
                  <div className="folder-footer-modern">
                    <span className="folder-note-count-modern">
                      {folder.noteCount || 0} notes
                    </span>
                    <span className="folder-date-modern">Created {folder.dateCreated}</span>
                  </div>
                </article>
              ))
            )}
          </section>
        </div>
      </main>

      {/* CREATE FOLDER MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Folder</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <label>Folder Name</label>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, "create")}
                placeholder="Enter folder name"
                autoFocus
              />
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn-create" onClick={handleCreateFolder}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT FOLDER MODAL */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Folder Name</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <label>Folder Name</label>
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, "edit")}
                placeholder="Enter folder name"
                autoFocus
              />
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="btn-create" onClick={handleUpdateFolder}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Folders;