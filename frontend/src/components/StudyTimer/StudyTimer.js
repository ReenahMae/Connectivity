import React, { useState, useEffect, useRef, useContext } from "react";
import { Clock, Play, Pause, RotateCcw, Timer, Target, Zap, Flame, BookOpen } from "lucide-react";
import "./StudyTimer.css";
import Sidebar from "../Sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import AboutSection from "./AboutSection";
import { TimerContext } from "../../context/TimerContext";

const StudyTimer = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("sidebarCollapsed") === "true";
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");

const {
  selectedMode,
  setSelectedMode,
  timeLeft,
  setTimeLeft,
  isRunning,
  setIsRunning,
  breakType,
  setBreakType,
  sessionsToday,
  setSessionsToday,
  focusTime,
  setFocusTime,
  longBreaks,
  setLongBreaks,
  intervalRef,
  lastUpdatedMinuteRef
} = useContext(TimerContext);


  const modes = {
  pomodoro: { 
    time: 25 * 60, 
    label: "Pomodoro",
    icon: (
      <div className="icon-bubble orange-bg">
        <Timer size={22} />
      </div>
    )
  },

  deepWork: { 
    time: 90 * 60, 
    label: "Deep Work",
    icon: (
      <div className="icon-bubble violet-bg">
        <Zap size={22} />
      </div>
    )
  },

  shortBurst: { 
    time: 15 * 60, 
    label: "Short Burst",
    icon: (
      <div className="icon-bubble green-bg">
        <Target size={22} />
      </div>
    )
  },

  extendedFocus: { 
    time: 50 * 60, 
    label: "Extended Focus",
    icon: (
      <div className="icon-bubble blue-bg">
        <BookOpen size={22} />
      </div>
    )
  }
};


  const saveSessionToBackend = async (minutes) => {
    const payload = {
      userId: user.id,
      mode: selectedMode,
      focusMinutes: minutes,
    };

    try {
      await fetch("http://localhost:8080/api/timer/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Failed to save session:", err);
    }
  };

  const handleTimerComplete = () => {
    setIsRunning(false);

    if (breakType === "focus") {
      const minutes = Math.floor(modes[selectedMode].time / 60);
      setSessionsToday((prev) => prev + 1);
      setFocusTime((prev) => prev + minutes);
      setLongBreaks((prev) => (sessionsToday + 1) % 4);
      saveSessionToBackend(minutes);

      //audio - to be implemented later
    //   const audio = new Audio(
    //     "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqF..."
    //   );
    //   audio.play().catch(() => {});
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
    setTimeLeft(modes[mode].time);
    setIsRunning(false);
    setBreakType("focus");
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(modes[selectedMode].time);
    lastUpdatedMinuteRef.current = null;
  };

  const handleBreakTypeChange = (type) => {
    setBreakType(type);

    if (type === "shortBreak") setTimeLeft(5 * 60);
    else if (type === "longBreak") setTimeLeft(15 * 60);
    else setTimeLeft(modes[selectedMode].time);

    setIsRunning(false);
    lastUpdatedMinuteRef.current = null;
  };

  const dailyGoal = Math.round((focusTime / 120) * 100);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => {
          const newCollapsed = !collapsed;
          setCollapsed(newCollapsed);
          localStorage.setItem("sidebarCollapsed", newCollapsed);
        }}
        activeRoute="/timer"
        user={user}
        onLogout={() => {
          localStorage.clear();
          navigate("/login");
        }}
      />

      <main className={`content ${collapsed ? "collapsed" : ""}`}>
        <div className="study-timer-wrapper">

          <div className="study-header">
            <div className="study-header-icon">
              <Clock className="icon-white" />
            </div>
            <div>
              <h1 className="study-title">Study Timer</h1>
              <p className="study-subtitle">Stay focused with proven study techniques</p>
            </div>
          </div>

          <div className="mode-grid">
            {Object.entries(modes).map(([key, mode]) => (
              <button
                key={key}
                onClick={() => handleModeChange(key)}
                className={`mode-btn ${selectedMode === key ? "active-mode" : ""}`}
              >
                <div className="mode-icon">{mode.icon}</div>
                <div className="mode-label">{mode.label}</div>
                <div className="mode-time">{Math.floor(mode.time / 60)}m focus</div>
              </button>
            ))}
          </div>

          <div className="timer-card">
            <div className="break-selector">
              <button
                onClick={() => handleBreakTypeChange("focus")}
                className={`break-btn ${breakType === "focus" ? "active-break" : ""}`}
              >
                <Timer className="break-icon" /> Focus
              </button>

              <button
                onClick={() => handleBreakTypeChange("shortBreak")}
                className={`break-btn ${breakType === "shortBreak" ? "active-break" : ""}`}
              >
                <Clock className="break-icon" /> Short Break
              </button>

              <button
                onClick={() => handleBreakTypeChange("longBreak")}
                className={`break-btn ${breakType === "longBreak" ? "active-break" : ""}`}
              >
                <Clock className="break-icon" /> Long Break
              </button>
            </div>

            <div className="timer-display">
              <div className="timer-text">{formatTime(timeLeft)}</div>
              <p className="timer-sub">Stay focused!</p>
            </div>

            <div className="timer-controls">
              <button className="reset-btn" onClick={handleReset}>
                <RotateCcw className="reset-icon" />
              </button>

              <button className="play-btn" onClick={() => setIsRunning(!isRunning)}>
                {isRunning ? <Pause className="play-icon" /> : <Play className="play-icon" />}
              </button>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stats-card">
              <Target className="stats-icon purple" />
              <div className="stats-value">{sessionsToday}</div>
              <div className="stats-label">Sessions Today</div>
            </div>

            <div className="stats-card">
              <Clock className="stats-icon teal" />
              <div className="stats-value">{focusTime}m</div>
              <div className="stats-label">Focus Time</div>
            </div>

            <div className="stats-card">
              <Timer className="stats-icon orange" />
              <div className="stats-value">
              {4 - (sessionsToday % 4)}
              </div>
            <div className="stats-label">Until Long Break</div>

            </div>

            <div className="stats-card">
              <Zap className="stats-icon purple" />
              <div className="stats-value">{dailyGoal}%</div>
              <div className="stats-label">Daily Goal</div>
            </div>
          </div>

          {/* ABOUT SECTION */}
          <AboutSection selectedMode={selectedMode} />

        </div>
      </main>
    </div>
  );
};

export default StudyTimer;
