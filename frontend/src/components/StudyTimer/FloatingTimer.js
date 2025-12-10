import React, { useContext } from "react";
import { TimerContext } from "../../context/TimerContext";
import { BookOpen, Play, Pause, RotateCcw, Maximize2, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import "./FloatingTimer.css";

const FloatingTimer = () => {
  const {
    selectedMode,
    timeLeft,
    isRunning,
    setIsRunning,
    setTimeLeft,
    intervalRef,
    setBreakType,
  } = useContext(TimerContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [visible, setVisible] = React.useState(true);

  // Hide on full timer page & settings
  if (location.pathname === "/timer" || location.pathname === "/settings") return null;
  if (!visible) return null;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
    setBreakType("focus");
    clearInterval(intervalRef.current);
  };

  const closeTimer = () => {
    setIsRunning(false);
    setVisible(false);
  };

  return (
    <div className="floating-timer-container">
      <div className="ft-header">
        <div className="ft-left">
          <BookOpen size={18} className="ft-icon" />
          <span className="ft-title">{selectedMode}</span>
        </div>

        <div className="ft-right">
          <Maximize2 
            size={18} 
            className="ft-header-btn" 
            onClick={() => navigate("/timer")} 
          />
          <X size={18} className="ft-header-btn" onClick={closeTimer} />
        </div>
      </div>

      <div className="ft-time">{formatTime(timeLeft)}</div>

      <div className="ft-progress">
        <div
          className="ft-progress-fill"
          style={{ width: `${(timeLeft / (25 * 60)) * 100}%` }}
        ></div>
      </div>

      <div className="ft-controls">
        <button className="ft-reset-btn" onClick={handleReset}>
          <RotateCcw size={20} />
        </button>

        <button
          className="ft-play-btn"
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? <Pause size={26} /> : <Play size={26} />}
        </button>
      </div>
    </div>
  );
};

export default FloatingTimer;
