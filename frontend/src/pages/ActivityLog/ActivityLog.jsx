import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { activityApi } from "../../api/activityApi";
import Sidebar from "../../components/Sidebar/Sidebar";

// Reuse standard Dashboard styles
import "../../components/Dashboard/Dashboard.css";
// Reuse Folder Modal styles
import "../Folders/FoldersModal.css"; 
// NEW: Import activity-specific styles
import "./ActivityLog.css";

const ActivityLog = () => {
  const navigate = useNavigate();
  
  // Sidebar State
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("sidebarCollapsed") === "true";
  });
  
  // Data State
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [viewLog, setViewLog] = useState(null);
  
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
    e.stopPropagation();
    if (!window.confirm("Delete this entry?")) return;

    try {
      await activityApi.deleteLog(logId);
      setLogs(logs.filter(log => log.logId !== logId));
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
      e.stopPropagation();
      setEditingId(log.logId);
      setInputText(log.activityType);
      setShowModal(true);
  };

  const openViewModal = (log) => {
      setViewLog(log);
  };

  // --- ENHANCED CATEGORIZATION (EXACT UI MATCH WITH REAL ICONS) ---
  const categorizeActivity = (text = "") => {
    const lower = text.toLowerCase();
    
    // Edited note - purple icon
    if (lower.includes("edit") && lower.includes("note")) {
      return { 
        action: "Edited note", 
        iconType: "edit", 
        bgColor: "#f3e9ff", 
        iconColor: "#7c3aed" 
      };
    }
    
    // Created folder - purple folder icon
    if (lower.includes("create") && lower.includes("folder")) {
      return { 
        action: "Created folder", 
        iconType: "folder", 
        bgColor: "#f3e9ff", 
        iconColor: "#8b5cf6" 
      };
    }
    
    // Created note - plus icon
    if (lower.includes("create") && lower.includes("note")) {
      return { 
        action: "Created note", 
        iconType: "plus", 
        bgColor: "#f3e9ff", 
        iconColor: "#8b5cf6" 
      };
    }
    
    // Deleted note - red trash icon
    if (lower.includes("delete") && lower.includes("note")) {
      return { 
        action: "Deleted note", 
        iconType: "trash", 
        bgColor: "#f3e9ff", 
        iconColor: "#7c3aed" 
      };
    }
    
    // Default fallback
    return { 
      action: "Activity", 
      iconType: "circle", 
      bgColor: "#f3e9ff", 
      iconColor: "#8b5cf6" 
    };
  };

  // Render icon based on type
  const renderIcon = (iconType) => {
    switch(iconType) {
      case "edit":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        );
      case "folder":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
        );
      case "plus":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        );
      case "trash":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="8"></circle>
          </svg>
        );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Just now";
    
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Extract content after the action description
  const extractContent = (text = "") => {
    // Remove the action prefix and return the rest
    const patterns = [
      /edited\s+note\s*[-:]\s*(.+)/i,
      /created\s+folder\s*[-:]\s*(.+)/i,
      /created\s+note\s*[-:]\s*(.+)/i,
      /deleted\s+note\s*[-:]\s*(.+)/i,
      /[-:]\s*(.+)/,
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    return text;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const handleToggleSidebar = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    localStorage.setItem("sidebarCollapsed", newCollapsed);
  };

  const getUserData = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : { fname: "User", email: "user@email.com" };
  };

  return (
    <div className="dashboard-layout">
      <Sidebar
        collapsed={collapsed}
        onToggle={handleToggleSidebar}
        activeRoute="/activity"
        user={getUserData()}
        onLogout={handleLogout}
      />

      {/* MAIN CONTENT */}
      <main className={`dashboard-inner content ${collapsed ? 'collapsed' : ''}`}>
        <header className="dashboard-header" style={{ marginBottom: '8px' }}>
          <div>
            <h1 style={{ marginBottom: '4px' }}>Activity Log</h1>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: '0', fontWeight: '400' }}>
              Track all your recent activities and changes
            </p>
          </div>
          <button className="new-note-btn" onClick={openCreateModal}>
            + Log Activity
          </button>
        </header>

        <div className="activity-container">
          {loading ? (
            <div className="loading-text">Loading history...</div>
          ) : logs.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: '48px', opacity: 0.3 }}>📋</div>
              <p>No activity recorded yet.</p>
              <p style={{ fontSize: '14px', color: '#999' }}>
                Your recent actions will appear here
              </p>
            </div>
          ) : (
            <div className="log-list-container">
              {logs.map((log) => {
                const { action, iconType, bgColor, iconColor } = categorizeActivity(log.activityType);
                const content = extractContent(log.activityType);
                
                return (
                  <div 
                    key={log.logId} 
                    className="log-item"
                    onClick={() => openViewModal(log)}
                  >
                    <div 
                      className="log-icon-wrapper" 
                      style={{ background: bgColor, color: iconColor }}
                    >
                      {renderIcon(iconType)}
                    </div>
                    
                    <div className="log-content">
                      <div className="log-title">
                        {action}
                      </div>
                      <div className="log-subtitle">
                        {content}
                      </div>
                    </div>

                    <div className="log-actions">
                      <span className="log-date">
                        {formatDate(log.timestamp)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* CREATE / EDIT MODAL */}
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
                placeholder="e.g., Edited note - Meeting Notes"
                autoFocus
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px', boxSizing: 'border-box' }}
                onKeyPress={(e) => e.key === "Enter" && handleSave()}
              />
              <p style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>
                Examples: "Edited note - Photosynthesis Summary", "Created folder - Science Notes"
              </p>
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

      {/* VIEW DETAILS MODAL */}
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