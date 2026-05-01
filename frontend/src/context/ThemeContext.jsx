import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [isThemeSwitching, setIsThemeSwitching] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'dark' : 'light';
      setTheme(initialTheme);
      applyTheme(initialTheme);
    }
  }, []);

  // Apply theme to document
  const applyTheme = (themeName) => {
    const body = document.body;
    body.className = '';
    if (themeName === 'dark') {
      body.classList.add('dark-theme');
    } else {
      body.classList.add('light-theme');
    }
  };

  // Toggle theme
  const toggleTheme = () => {
    setIsThemeSwitching(true);
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    // Simulate transition effect
    setTimeout(() => {
      setIsThemeSwitching(false);
    }, 300);
  };

  // Set specific theme
  const setThemeMode = (themeName) => {
    setIsThemeSwitching(true);
    setTheme(themeName);
    applyTheme(themeName);
    localStorage.setItem('theme', themeName);

    setTimeout(() => {
      setIsThemeSwitching(false);
    }, 300);
  };

  const value = {
    theme,
    toggleTheme,
    setThemeMode,
    isThemeSwitching,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
