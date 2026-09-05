import { useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

export default function ThemeToggle({ className = '', showLabel = false }) {
  const { theme, toggleTheme, initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative inline-flex items-center gap-2 p-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500 ${
        isDark
          ? 'bg-dark-800 hover:bg-dark-750 text-amber-300 border border-white/10 shadow-sm'
          : 'bg-white hover:bg-slate-100 text-brand-600 border border-slate-200 shadow-sm'
      } ${className}`}
      title={isDark ? 'Switch to Light Mode ☀️' : 'Switch to Dark Mode 🌙'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Moon className="w-4 h-4 text-amber-300 transition-transform transform rotate-0 scale-100 duration-300" />
        ) : (
          <Sun className="w-4 h-4 text-amber-500 transition-transform transform rotate-0 scale-100 duration-300" />
        )}
      </div>

      {showLabel && (
        <span className="text-xs font-bold transition-colors">
          {isDark ? 'Light Theme ☀️' : 'Dark Theme 🌙'}
        </span>
      )}
    </button>
  );
}
