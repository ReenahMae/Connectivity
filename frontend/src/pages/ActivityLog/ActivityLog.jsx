import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { activityApi } from "../../api/activityApi";

// ✅ Reuse standard Dashboard styles
import "../../components/Dashboard/Dashboard.css";
// ✅ Reuse Folder Modal styles
import "../Folders/FoldersModal.css"; 

const ActivityLog = () => {
  const navigate = useNavigate();
  
  // Data State
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [showModal, setShowModal] = useState(false); // For Create/Edit
  const [viewLog, setViewLog] = useState(null);      // For Viewing Details (New!)
  
  const [inputText, setInputText] = useState("");
  const [editingId, setEditingId] = useState(null); 

  // --- AUTH & FETCH ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        navigate("/login", { replace: true });
        return;
    }
    fetchLogs();
  }, [navigate]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await activityApi.getAllLogs();
      const sortedData = data.sort((a, b) => b.logId - a.logId); 
      setLogs(sortedData);
    } catch (err) {
      console.error("Error fetching logs:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- SAVE (Create/Update) ---
  const handleSave = async () => {
    if (!inputText.trim()) return;

    try {
      if (editingId) {
        await activityApi.updateLog(editingId, {
            logId: editingId, 
            activityType: inputText,
        });
      } else {
        await activityApi.createLog({
            activityType: inputText
        });
      }
      setShowModal(false);
      setInputText("");
      setEditingId(null);
      fetchLogs(); 
    } catch (err) {
      alert("Failed to save activity");
    }
  };

  // --- DELETE ---
  const handleDelete = async (logId, e) => {
    e.stopPropagation(); // Don't trigger the view modal
    if (!window.confirm("Delete this entry?")) return;

    try {
      await activityApi.deleteLog(logId);
      setLogs(logs.filter(log => log.logId !== logId));
      // If we deleted the log currently being viewed, close the modal
      if (viewLog && viewLog.logId === logId) {
        setViewLog(null);
      }
    } catch (err) {
      alert("Failed to delete log");
    }
  };

  // --- MODAL HELPERS ---
  const openCreateModal = () => {
      setEditingId(null);
      setInputText("");
      setShowModal(true);
  };

  const openEditModal = (log, e) => {
      e.stopPropagation(); // Don't trigger the view modal
      setEditingId(log.logId);
      setInputText(log.activityType);
      setShowModal(true);
  };

  // ✅ NEW: Open the View Modal
  const openViewModal = (log) => {
      setViewLog(log);
  };

  // --- UTILS ---
  const getIcon = (text = "") => {
    const lower = text.toLowerCase();
    if (lower.includes("create")) return "✨";
    if (lower.includes("delete")) return "🗑️";
    if (lower.includes("update") || lower.includes("edit")) return "📝";
    return "🔹";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Just now";
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-logo">📚</div>
          <div className="sidebar-title">Connectivity</div>
        </div>
         <nav className="sidebar-nav">
          <button className="nav-item" onClick={() => navigate("/dashboard")}>
            📄 <span>My Notes</span>
          </button>
          <button className="nav-item " onClick={() => navigate("/folders")}>
            📁 <span>My Folders</span>
          </button>
          <button className="nav-item active" onClick={() => navigate("/activity")}>🕘 <span>Activity Log</span></button>
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

      {/* MAIN CONTENT */}
      <main className="dashboard-inner content">
        <header className="dashboard-header">
          <div>
            <h1>Activity Log</h1>
            <span className="note-count">{logs.length} Entries</span>
          </div>
          <button className="new-note-btn" onClick={openCreateModal}>
            + Log Activity
          </button>
        </header>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {loading ? (
             <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>Loading history...</div>
          ) : logs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
              <p>No activity recorded yet.</p>
            </div>
          ) : (
            logs.map((log) => (
              <article 
                key={log.logId} 
                className="note-card"
                // ✅ ADDED: Click handler to open View Modal
                onClick={() => openViewModal(log)}
                style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    minHeight: 'auto', 
                    padding: '16px 24px',
                    cursor: 'pointer', // Shows it's clickable
                    transition: 'transform 0.1s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                        width: '42px', height: '42px', 
                        background: '#f3e9ff', color: '#6f2bdc', 
                        borderRadius: '50%', display: 'flex', 
                        alignItems: 'center', justifyContent: 'center', fontSize: '20px'
                    }}>
                        {getIcon(log.activityType)}
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' }}>
                            {log.activityType}
                        </h3>
                        <p className="modified" style={{ margin: 0 }}>
                            {formatDate(log.timestamp)}
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    {/* EDIT BUTTON */}
                    <button 
                        onClick={(e) => openEditModal(log, e)}
                        style={{
                            background: 'none', border: 'none', 
                            color: '#007bff', fontSize: '18px', 
                            cursor: 'pointer', padding: '4px'
                        }}
                        title="Edit Entry"
                    >
                        ✎
                    </button>
                    {/* DELETE BUTTON */}
                    <button 
                        onClick={(e) => handleDelete(log.logId, e)}
                        style={{
                            background: 'none', border: 'none', 
                            color: '#dc3545', fontSize: '24px', 
                            cursor: 'pointer', padding: '0 4px',
                            lineHeight: '1'
                        }}
                        title="Delete Entry"
                    >
                        ×
                    </button>
                </div>
              </article>
            ))
          )}
        </section>
      </main>

      {/* --- CREATE / EDIT MODAL --- */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? "Edit Activity" : "New Activity Log"}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <label style={{display:'block', marginBottom:'8px', fontWeight:'500'}}>Description</label>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Create Note - 01/01/2001 at 01:01 AM"
                autoFocus
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px', boxSizing: 'border-box' }}
                onKeyPress={(e) => e.key === "Enter" && handleSave()}
              />
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-create" onClick={handleSave}>
                {editingId ? "Save Changes" : "Log It"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ✅ NEW: VIEW DETAILS MODAL --- */}
      {viewLog && (
        <div className="modal-overlay" onClick={() => setViewLog(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Activity Details</h2>
              <button className="modal-close" onClick={() => setViewLog(null)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Activity Description
                </label>
                <div style={{ fontSize: '18px', color: '#2f3237', lineHeight: '1.4' }}>
                    {viewLog.activityType}
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Timestamp
                </label>
                <div style={{ fontSize: '16px', color: '#555' }}>
                    {formatDate(viewLog.timestamp)}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setViewLog(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ActivityLog;