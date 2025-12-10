import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  Edit3, 
  Trash2, 
  FolderPlus, 
  Edit, 
  Folder,
  Plus,
  Minus,
  User,
  Camera,
  UserX,
  Settings,
  Activity,
  Eye,
  X,
  AlertTriangle
} from "lucide-react";
import { activityApi } from "../../api/activityApi";
import Sidebar from "../../components/Sidebar/Sidebar";
import "../../components/Dashboard/Dashboard.css";
import "./ActivityLog.css";

const ActivityLog = () => {
  const navigate = useNavigate();
  
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("sidebarCollapsed") === "true";
  });
  
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [selectedLog, setSelectedLog] = useState(null);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);

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
      const sortedData = data.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );
      setLogs(sortedData);
    } catch (err) {
      console.error("Error fetching logs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLog = async (logId) => {
    if (!window.confirm("Delete this activity log?")) return;
    
    try {
      await activityApi.deleteLog(logId);
      setLogs(logs.filter(log => log.logId !== logId));
      setSelectedLog(null);
    } catch (err) {
      console.error("Error deleting log:", err);
      alert("Failed to delete activity log");
    }
  };

  const handleDeleteAll = async () => {
    try {
      // Delete all logs one by one
      const deletePromises = logs.map(log => activityApi.deleteLog(log.logId));
      await Promise.all(deletePromises);
      
      setLogs([]);
      setShowDeleteAllModal(false);
      alert("All activity logs deleted successfully!");
    } catch (err) {
      console.error("Error deleting all logs:", err);
      alert("Failed to delete all logs");
    }
  };

  const categorizeActivity = (text = "") => {
    const lower = text.toLowerCase();
    
    // 1. PRIORITIZE FOLDER CONTENTS (Add/Remove notes from folder)
    if (lower.includes("added") && lower.includes("folder")) {
      return { 
        type: "folder_add",
        action: "Added to Folder", 
        icon: Plus,
        color: "#06b6d4",
        bgColor: "#cffafe"
      };
    }
    if (lower.includes("removed") && lower.includes("folder")) {
      return { 
        type: "folder_remove",
        action: "Removed from Folder", 
        icon: Minus,
        color: "#f97316",
        bgColor: "#ffedd5"
      };
    }

    // 2. FOLDER STRUCTURE ACTIONS
    if (lower.includes("created") && lower.includes("folder")) {
      return { 
        type: "folder_created",
        action: "Created Folder", 
        icon: FolderPlus,
        color: "#8b5cf6",
        bgColor: "#ede9fe"
      };
    }
    if (lower.includes("renamed") && lower.includes("folder")) {
      return { 
        type: "folder_renamed",
        action: "Renamed Folder", 
        icon: Edit,
        color: "#f59e0b",
        bgColor: "#fef3c7"
      };
    }
    if (lower.includes("deleted") && lower.includes("folder")) {
      return { 
        type: "folder_deleted",
        action: "Deleted Folder", 
        icon: Trash2,
        color: "#ef4444",
        bgColor: "#fee2e2"
      };
    }

    // 3. NOTE ACTIONS (Check these AFTER folder actions)
    if ((lower.includes("added") || lower.includes("created")) && lower.includes("note")) {
      return { 
        type: "note_created",
        action: "Created Note", 
        icon: FileText,
        color: "#10b981",
        bgColor: "#d1fae5"
      };
    }
    if ((lower.includes("edited") || lower.includes("updated")) && lower.includes("note")) {
      return { 
        type: "note_edited",
        action: "Edited Note", 
        icon: Edit3,
        color: "#3b82f6",
        bgColor: "#dbeafe"
      };
    }
    if (lower.includes("deleted") && lower.includes("note")) {
      return { 
        type: "note_deleted",
        action: "Deleted Note", 
        icon: Trash2,
        color: "#ef4444",
        bgColor: "#fee2e2"
      };
    }

    // 4. PROFILE & SETTINGS
    if (lower.includes("updated") && lower.includes("profile")) {
      return { 
        type: "profile_updated",
        action: "Updated Profile", 
        icon: User,
        color: "#6366f1",
        bgColor: "#e0e7ff"
      };
    }
    if (lower.includes("changed") && lower.includes("avatar")) {
      return { 
        type: "avatar_changed",
        action: "Changed Avatar", 
        icon: Camera,
        color: "#ec4899",
        bgColor: "#fce7f3"
      };
    }
    if (lower.includes("removed") && lower.includes("avatar")) {
      return { 
        type: "avatar_removed",
        action: "Removed Avatar", 
        icon: UserX,
        color: "#94a3b8",
        bgColor: "#f1f5f9"
      };
    }
    if (lower.includes("preference") || lower.includes("setting")) {
      return { 
        type: "settings",
        action: "Changed Settings", 
        icon: Settings,
        color: "#64748b",
        bgColor: "#f1f5f9"
      };
    }
    
    return { 
      type: "other",
      action: "Activity", 
      icon: Activity,
      color: "#9ca3af",
      bgColor: "#f3f4f6"
    };
  };

  const extractDetails = (text = "") => {
    const withoutUser = text.replace(/^[^:]+:\s*/, '');
    return withoutUser || text;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Just now";
    
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const formatFullDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Unknown date";
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getActivityStats = () => {
    const stats = {
      total: logs.length,
      notes: logs.filter(l => l.activityType.toLowerCase().includes('note')).length,
      folders: logs.filter(l => l.activityType.toLowerCase().includes('folder')).length,
      profile: logs.filter(l => 
        l.activityType.toLowerCase().includes('profile') || 
        l.activityType.toLowerCase().includes('avatar')
      ).length
    };
    return stats;
  };

  const filteredLogs = logs.filter(log => {
    if (filterType === 'all') return true;
    const { type } = categorizeActivity(log.activityType);
    if (filterType === 'notes') return type.includes('note');
    if (filterType === 'folders') return type.includes('folder');
    if (filterType === 'profile') return type.includes('profile') || type.includes('avatar');
    return true;
  });

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

  const stats = getActivityStats();

  return (
    <div className="dashboard-layout">
      <Sidebar
        collapsed={collapsed}
        onToggle={handleToggleSidebar}
        activeRoute="/activity"
        user={getUserData()}
        onLogout={handleLogout}
      />

      <main className={`content ${collapsed ? 'collapsed' : ''}`}>
        <div className="dashboard-inner">
          {/* Header */}
          <header className="activity-header">
            <div>
              <h1>Activity Log</h1>
              <p className="activity-subtitle">Track all your actions across notes, folders, and profile</p>
            </div>
            {logs.length > 0 && (
              <button 
                className="delete-all-btn"
                onClick={() => setShowDeleteAllModal(true)}
              >
                <Trash2 size={18} />
                Clear All
              </button>
            )}
          </header>

          {/* Stats Cards */}
          <div className="activity-stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#ede9fe' }}>
                <Activity size={24} color="#7c3aed" strokeWidth={2.5} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.total}</div>
                <div className="stat-label">Total Activities</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#dbeafe' }}>
                <FileText size={24} color="#3b82f6" strokeWidth={2.5} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.notes}</div>
                <div className="stat-label">Note Actions</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#f3e8ff' }}>
                <Folder size={24} color="#8b5cf6" strokeWidth={2.5} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.folders}</div>
                <div className="stat-label">Folder Actions</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fce7f3' }}>
                <User size={24} color="#ec4899" strokeWidth={2.5} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.profile}</div>
                <div className="stat-label">Profile Updates</div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="activity-filters">
            <button 
              className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              All Activity
            </button>
            <button 
              className={`filter-btn ${filterType === 'notes' ? 'active' : ''}`}
              onClick={() => setFilterType('notes')}
            >
              <FileText size={16} />
              Notes
            </button>
            <button 
              className={`filter-btn ${filterType === 'folders' ? 'active' : ''}`}
              onClick={() => setFilterType('folders')}
            >
              <Folder size={16} />
              Folders
            </button>
            <button 
              className={`filter-btn ${filterType === 'profile' ? 'active' : ''}`}
              onClick={() => setFilterType('profile')}
            >
              <User size={16} />
              Profile
            </button>
          </div>

          {/* Activity List */}
          <div className="activity-container">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading activity history...</p>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="empty-state">
                <Activity size={64} color="#d1d5db" strokeWidth={1.5} />
                <p className="empty-title">
                  {filterType === 'all' ? 'No activity yet' : `No ${filterType} activity`}
                </p>
                <p className="empty-subtitle">
                  Your actions will appear here as you use the app
                </p>
              </div>
            ) : (
              <div className="log-list-container">
                {filteredLogs.map((log) => {
                  const { action, icon: IconComponent, color, bgColor } = categorizeActivity(log.activityType);
                  const details = extractDetails(log.activityType);
                  
                  return (
                    <div key={log.logId} className="log-item">
                      <div 
                        className="log-icon-wrapper" 
                        style={{ background: bgColor }}
                      >
                        <IconComponent size={22} color={color} strokeWidth={2.5} />
                      </div>
                      
                      <div className="log-content">
                        <div className="log-title">{action}</div>
                        <div className="log-subtitle">{details}</div>
                      </div>

                      <div className="log-actions">
                        <span className="log-date">{formatDate(log.timestamp)}</span>
                        <button 
                          className="log-action-btn view-btn"
                          onClick={() => setSelectedLog(log)}
                          title="View details"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="log-action-btn delete-btn"
                          onClick={() => handleDeleteLog(log.logId)}
                          title="Delete log"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* View Log Modal */}
      {selectedLog && (
        <div className="modal-overlay" onClick={() => setSelectedLog(null)}>
          <div className="modal-content activity-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Activity Details</h2>
              <button className="modal-close" onClick={() => setSelectedLog(null)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="activity-detail-card">
                <div 
                  className="activity-detail-icon" 
                  style={{ background: categorizeActivity(selectedLog.activityType).bgColor }}
                >
                  {React.createElement(categorizeActivity(selectedLog.activityType).icon, {
                    size: 32,
                    color: categorizeActivity(selectedLog.activityType).color,
                    strokeWidth: 2.5
                  })}
                </div>
                
                <div className="activity-detail-content">
                  <div className="activity-detail-label">Action Type</div>
                  <div className="activity-detail-value">
                    {categorizeActivity(selectedLog.activityType).action}
                  </div>
                </div>

                <div className="activity-detail-content">
                  <div className="activity-detail-label">Description</div>
                  <div className="activity-detail-value">
                    {selectedLog.activityType}
                  </div>
                </div>

                <div className="activity-detail-content">
                  <div className="activity-detail-label">Timestamp</div>
                  <div className="activity-detail-value">
                    {formatFullDate(selectedLog.timestamp)}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-cancel" 
                onClick={() => setSelectedLog(null)}
              >
                Close
              </button>
              <button 
                className="btn-delete" 
                onClick={() => {
                  handleDeleteLog(selectedLog.logId);
                  setSelectedLog(null);
                }}
              >
                <Trash2 size={18} />
                Delete Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete All Modal */}
      {showDeleteAllModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteAllModal(false)}>
          <div className="modal-content delete-all-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="warning-icon">
                <AlertTriangle size={28} color="#ef4444" strokeWidth={2.5} />
              </div>
              <h2>Clear All Activity Logs?</h2>
            </div>
            <div className="modal-body">
              <p className="warning-text">
                This will permanently delete all <strong>{logs.length} activity logs</strong>. 
                This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-cancel" 
                onClick={() => setShowDeleteAllModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-delete-all" 
                onClick={handleDeleteAll}
              >
                <Trash2 size={18} />
                Delete All Logs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;