import { createContext, useState, useRef, useEffect } from "react";

export const TimerContext = createContext();

export function TimerProvider({ children }) {
  const [selectedMode, setSelectedMode] = useState("pomodoro");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [breakType, setBreakType] = useState("focus");

  const [sessionsToday, setSessionsToday] = useState(0);
  const [focusTime, setFocusTime] = useState(0);
  const [longBreaks, setLongBreaks] = useState(0);

  const intervalRef = useRef(null);
  const lastUpdatedMinuteRef = useRef(null);

  const [showFloatingTimer, setShowFloatingTimer] = useState(false);


  // When timer reaches 0
  const handleTimerComplete = () => {
    setIsRunning(false);

    if (breakType === "focus") {
      setSessionsToday(prev => prev + 1);
      setLongBreaks(prev => (sessionsToday + 1) % 4);
    }
  };

  // so timer runs globally
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;

          // Minute tracking
          if (breakType === "focus") {
            const currentMinute = Math.floor(newTime / 60);
            if (lastUpdatedMinuteRef.current === null) {
              lastUpdatedMinuteRef.current = currentMinute;
            }
            if (currentMinute !== lastUpdatedMinuteRef.current) {
              setFocusTime(prev => prev + 1);
              lastUpdatedMinuteRef.current = currentMinute;
            }
          }

          // When timer ends
          if (newTime <= 0) {
            handleTimerComplete();
            return 0;
          }

          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
      lastUpdatedMinuteRef.current = null;
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft, breakType]);

  return (
    <TimerContext.Provider
      value={{
        selectedMode, setSelectedMode,
        timeLeft, setTimeLeft,
        isRunning, setIsRunning,
        breakType, setBreakType,

        sessionsToday, setSessionsToday,
        focusTime, setFocusTime,
        longBreaks, setLongBreaks,

        intervalRef, lastUpdatedMinuteRef,
        showFloatingTimer, setShowFloatingTimer,

      }}
    >
      {children}
    </TimerContext.Provider>
  );
}
