import React, { useState, useEffect } from 'react';
import { ThemeContext } from './ThemeContext.js';

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first, then system preference, then default to light
    const savedTheme = localStorage.getItem('zanly-theme');
    if (savedTheme) {
      return savedTheme;
    }
    
    // Check system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    return 'light';
  });

  const [systemTheme, setSystemTheme] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e) => {
        setSystemTheme(e.matches ? 'dark' : 'light');
        // If user has theme set to 'system', update the active theme
        if (theme === 'system') {
          updateDocumentTheme(e.matches ? 'dark' : 'light');
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Update document class and localStorage when theme changes
  useEffect(() => {
    const activeTheme = theme === 'system' ? systemTheme : theme;
    updateDocumentTheme(activeTheme);
    localStorage.setItem('zanly-theme', theme);
  }, [theme, systemTheme]);

  const updateDocumentTheme = (activeTheme) => {
    const root = window.document.documentElement;
    // Tailwind dark mode relies on 'dark' class only
    if (activeTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', activeTheme === 'dark' ? '#0b1220' : '#ffffff');
    }
  };

  const setThemeMode = (newTheme) => {
    setTheme(newTheme);
  };

  const toggleTheme = () => {
    setTheme(prevTheme => {
      if (prevTheme === 'light') return 'dark';
      if (prevTheme === 'dark') return 'system';
      return 'light';
    });
  };

  const getActiveTheme = () => {
    return theme === 'system' ? systemTheme : theme;
  };

  const isDark = () => {
    return getActiveTheme() === 'dark';
  };

  const isLight = () => {
    return getActiveTheme() === 'light';
  };

  const value = {
    theme,
    systemTheme,
    setTheme: setThemeMode,
    toggleTheme,
    getActiveTheme,
    isDark,
    isLight,
    themes: [
      { value: 'light', label: 'Light', icon: '☀️' },
      { value: 'dark', label: 'Dark', icon: '🌙' },
      { value: 'system', label: 'System', icon: '💻' },
    ],
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};