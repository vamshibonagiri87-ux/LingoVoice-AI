import { create } from 'zustand';

export const useThemeStore = create((set, get) => ({
  theme: 'dark', // 'dark' | 'light'

  initTheme: () => {
    if (typeof window === 'undefined') return;
    const savedTheme = localStorage.getItem('lingovoice_theme');
    const initialTheme = savedTheme || 'dark';

    set({ theme: initialTheme });
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  },

  toggleTheme: () => {
    const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
    set({ theme: nextTheme });
    if (typeof window !== 'undefined') {
      localStorage.setItem('lingovoice_theme', nextTheme);
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
    }
  },

  setTheme: (newTheme) => {
    set({ theme: newTheme });
    if (typeof window !== 'undefined') {
      localStorage.setItem('lingovoice_theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
    }
  }
}));
