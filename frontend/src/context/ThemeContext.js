import React, { createContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  // Pages we DO NOT want dark mode applied to
  const excludedPaths = ['/', '/login', '/register'];

  // Load saved preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') setDarkMode(true);
  }, []);

  // Apply theme to <body> and save preference — skip excluded pages
  useEffect(() => {
    const isExcluded = excludedPaths.includes(location.pathname);
    const shouldBeDark = darkMode && !isExcluded;

    if (shouldBeDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode, location.pathname]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
