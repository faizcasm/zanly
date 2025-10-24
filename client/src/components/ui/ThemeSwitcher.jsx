import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, Check, ChevronDown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeSwitcher = ({ variant = 'default', size = 'md' }) => {
  const { theme, setTheme, themes, getActiveTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getThemeIcon = (themeValue) => {
    switch (themeValue) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'system':
        return <Monitor className="h-4 w-4" />;
      default:
        return <Sun className="h-4 w-4" />;
    }
  };

  const getCurrentThemeIcon = () => {
    return getThemeIcon(theme);
  };

  const handleThemeSelect = (selectedTheme) => {
    setTheme(selectedTheme);
    setIsOpen(false);
  };

  if (variant === 'button') {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            inline-flex items-center justify-center rounded-lg border border-gray-200 
            bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700
            transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500
            ${size === 'sm' ? 'p-1.5' : size === 'lg' ? 'p-3' : 'p-2'}
          `}
          aria-label="Toggle theme"
        >
          {getCurrentThemeIcon()}
          <ChevronDown className="ml-1 h-3 w-3" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 z-50">
            <div className="p-1">
              {themes.map((themeOption) => (
                <button
                  key={themeOption.value}
                  onClick={() => handleThemeSelect(themeOption.value)}
                  className={`
                    flex w-full items-center justify-between rounded-md px-3 py-2 text-sm
                    hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150
                    ${theme === themeOption.value ? 'bg-gray-100 dark:bg-gray-700' : ''}
                  `}
                >
                  <div className="flex items-center">
                    {getThemeIcon(themeOption.value)}
                    <span className="ml-2">{themeOption.label}</span>
                  </div>
                  {theme === themeOption.value && (
                    <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Toggle variant - cycles through themes
  if (variant === 'toggle') {
    return (
      <button
        onClick={() => {
          if (theme === 'light') setTheme('dark');
          else if (theme === 'dark') setTheme('system');
          else setTheme('light');
        }}
        className={`
          inline-flex items-center justify-center rounded-lg border border-gray-200 
          bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700
          transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500
          ${size === 'sm' ? 'p-1.5' : size === 'lg' ? 'p-3' : 'p-2'}
        `}
        aria-label={`Current theme: ${theme}. Click to change.`}
        title={`Current: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`}
      >
        {getCurrentThemeIcon()}
      </button>
    );
  }

  // Inline variant - shows as segmented control
  if (variant === 'inline') {
    return (
      <div className="inline-flex items-center rounded-lg border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800">
        {themes.map((themeOption) => (
          <button
            key={themeOption.value}
            onClick={() => handleThemeSelect(themeOption.value)}
            className={`
              inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200
              ${
                theme === themeOption.value
                  ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }
            `}
          >
            {getThemeIcon(themeOption.value)}
            <span className="ml-1.5 hidden sm:block">{themeOption.label}</span>
          </button>
        ))}
      </div>
    );
  }

  // Default dropdown variant
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium
          text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700
          transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500
        `}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {getCurrentThemeIcon()}
        <span className="ml-2 hidden sm:block">
          {themes.find(t => t.value === theme)?.label || 'Theme'}
        </span>
        <ChevronDown className="ml-1 h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 z-50">
          <div className="p-1">
            {themes.map((themeOption) => (
              <button
                key={themeOption.value}
                onClick={() => handleThemeSelect(themeOption.value)}
                className={`
                  flex w-full items-center rounded-md px-3 py-2 text-sm
                  hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150
                  ${theme === themeOption.value ? 'bg-gray-100 dark:bg-gray-700' : ''}
                `}
              >
                {getThemeIcon(themeOption.value)}
                <span className="ml-2">{themeOption.label}</span>
                {theme === themeOption.value && (
                  <Check className="ml-auto h-4 w-4 text-blue-600 dark:text-blue-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;