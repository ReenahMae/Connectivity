import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import AiTagsPage from "./AiTagsPage";
import "./AiTags.css";

const AiTagsWrapper = () => {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("sidebarCollapsed") === "true";
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // AUTH CHECK
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login", { replace: true });
  }, [navigate]);

  const handleToggleSidebar = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    localStorage.setItem("sidebarCollapsed", newCollapsed);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <div className="aitags-layout">
      <Sidebar
        collapsed={collapsed}
        onToggle={handleToggleSidebar}
        activeRoute="/ai-tags"
        user={user}
        onLogout={handleLogout}
      />

      <main className={`aitags-content ${collapsed ? "collapsed" : ""}`}>
        <div className="aitags-inner">
          <AiTagsPage />
        </div>
      </main>
    </div>
  );
};

export default AiTagsWrapper;
