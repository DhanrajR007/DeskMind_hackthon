import React from 'react';
import { useTheme } from '../context/ThemeContext';
import '../styles/theme.css';

/**
 * THEME SWITCHER COMPONENT
 * 
 * This is an example component showing how to use the useTheme hook.
 * You can add this to your header or navigation bar.
 * 
 * Usage:
 * import ThemeSwitcher from './components/ThemeSwitcher';
 * <ThemeSwitcher />
 */

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        padding: '8px 16px',
        borderRadius: '8px',
        border: `2px solid var(--border-color)`,
        background: `var(--bg-secondary)`,
        color: `var(--text-primary)`,
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'all 250ms ease-in-out',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--primary-color)';
        e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-color)';
        e.currentTarget.style.background = 'var(--bg-secondary)';
      }}
    >
      {theme === 'light' ? (
        <>
          <span>🌙</span>
          Dark Mode
        </>
      ) : (
        <>
          <span>☀️</span>
          Light Mode
        </>
      )}
    </button>
  );
};

export default ThemeSwitcher;

/**
 * USAGE EXAMPLES:
 * 
 * 1. Basic Toggle
 * ----------------
 * import { useTheme } from './context/ThemeContext';
 * 
 * function MyComponent() {
 *   const { theme, toggleTheme } = useTheme();
 *   
 *   return (
 *     <div>
 *       <p>Current theme: {theme}</p>
 *       <button onClick={toggleTheme}>Switch Theme</button>
 *     </div>
 *   );
 * }
 * 
 * 
 * 2. Set Specific Theme
 * ----------------------
 * import { useTheme } from './context/ThemeContext';
 * 
 * function ThemeSelector() {
 *   const { setThemeMode } = useTheme();
 *   
 *   return (
 *     <div>
 *       <button onClick={() => setThemeMode('light')}>Light</button>
 *       <button onClick={() => setThemeMode('dark')}>Dark</button>
 *     </div>
 *   );
 * }
 * 
 * 
 * 3. Conditional Rendering Based on Theme
 * ------------------------------------------
 * import { useTheme } from './context/ThemeContext';
 * 
 * function MyComponent() {
 *   const { theme } = useTheme();
 *   
 *   return (
 *     <div>
 *       {theme === 'dark' && <DarkModeOnly />}
 *       {theme === 'light' && <LightModeOnly />}
 *     </div>
 *   );
 * }
 * 
 * 
 * 4. Using isThemeSwitching for Animations
 * -------------------------------------------
 * import { useTheme } from './context/ThemeContext';
 * 
 * function MyComponent() {
 *   const { isThemeSwitching } = useTheme();
 *   
 *   return (
 *     <div style={{
 *       opacity: isThemeSwitching ? 0.5 : 1,
 *       transition: 'opacity 300ms'
 *     }}>
 *       Content
 *     </div>
 *   );
 * }
 */
