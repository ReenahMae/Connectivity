import { createContext, useState, useRef, useEffect } from "react";

export const TimerContext = createContext();

export function TimerProvider({ children }) {
  const [selectedMode, setSelectedMode] = useState("pomodoro");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [breakType, setBreakType] = useState("focus");

  const intervalRef = useRef(null);
  const lastUpdatedMinuteRef = useRef(null);

  // para it runs globally)
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;

          if (newTime <= 0) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            return 0;
          }

          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  return (
    <TimerContext.Provider
      value={{
        selectedMode,
        setSelectedMode,
        timeLeft,
        setTimeLeft,
        isRunning,
        setIsRunning,
        breakType,
        setBreakType,
        intervalRef,
        lastUpdatedMinuteRef
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}
