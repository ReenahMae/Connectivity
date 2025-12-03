import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { folderApi } from "../../api/folderApi";
import "../../components/Dashboard/Dashboard.css";

const FolderView = () => {
  const navigate = useNavigate();
  const { folderId } = useParams();
  
  const [folder, setFolder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");

  useEffect(() => {
    if (!folderId || folderId === "undefined") {
        navigate("/folders");
        return;
    }

    const fetchFolder = async () => {
      try {
        const data = await folderApi.getFolder(folderId);
        if (data) {
          setFolder(data);
          setEditedName(data.folderName);
        }
      } catch (err) {
        alert("Folder not found");
        navigate("/folders");
      } finally {
        setLoading(false);
      }
    };
    fetchFolder();
  }, [folderId, navigate]);

  const handleUpdateName = async () => {
    try {
      const updatedFolder = { ...folder, folderName: editedName };
      setFolder(updatedFolder);
      setIsEditing(false);
      await folderApi.updateFolder(folderId, updatedFolder);
    } catch (err) {
      alert("Failed to update name");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this folder?")) return;
    try {
      await folderApi.deleteFolder(folderId);
      navigate("/folders");
    } catch (err) {
      alert("Failed to delete folder");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const getUserData = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : { fname: "User", email: "user@email.com" };
  };

  if (loading) return <div className="dashboard-layout" style={{padding:"50px"}}>Loading...</div>;
  if (!folder) return null;

  return (
    <div className="dashboard-layout">
      {/* --- SIDEBAR --- */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-logo">📚</div>
          <div className="sidebar-title">Connectivity</div>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item" onClick={() => navigate("/dashboard")}>
            📄 <span>My Notes</span>
          </button>
          <button className="nav-item active" onClick={() => navigate("/folders")}>
             <span>← Back to Folders</span>
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

      {/* --- CONTENT --- */}
      <main className="dashboard-inner content">
        <header className="dashboard-header">
          {isEditing ? (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input 
                value={editedName} 
                onChange={(e) => setEditedName(e.target.value)}
                style={{ 
                  fontSize: '26px', 
                  fontWeight: '600', 
                  padding: '5px 10px',
                  borderRadius: '8px',
                  border: '2px solid #6f2bdc',
                  color: '#2f3237'
                }}
                autoFocus
              />
              <button onClick={handleUpdateName} className="new-note-btn" style={{padding: '8px 16px', fontSize: '14px'}}>Save</button>
              <button onClick={() => setIsEditing(false)} className="logout-btn" style={{padding: '8px 16px'}}>Cancel</button>
            </div>
          ) : (
            <div>
              <div style={{display:'flex', alignItems:'center', gap: '15px'}}>
                <h1>📁 {folder.folderName}</h1>
                <button 
                  onClick={() => setIsEditing(true)}
                  style={{
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    fontSize: '18px', 
                    color: '#6f2bdc'
                  }}
                  title="Rename Folder"
                >
                  ✎
                </button>
              </div>
              <span className="note-count">Created: {folder.dateCreated}</span>
            </div>
          )}

          <button 
            className="logout-btn" 
            onClick={handleDelete}
            style={{ color: '#dc3545', borderColor: '#dc3545', fontWeight: 'bold' }}
          >
            Delete Folder
          </button>
        </header>

        {/* Empty state area since we removed notes */}
        <div style={{
            textAlign: 'center', 
            marginTop: '100px', 
            color: '#aaa'
        }}>
            <div style={{fontSize: '48px', marginBottom: '20px'}}>📂</div>
            <p>Folder Properties View</p>
        </div>

      </main>
    </div>
  );
};

export default FolderView;