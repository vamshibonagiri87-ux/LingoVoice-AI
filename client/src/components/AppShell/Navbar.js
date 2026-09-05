import { Menu, Sparkles, Mic, Globe } from 'lucide-react';
import NextLink from 'next/link';
import NotificationDropdown from './NotificationDropdown';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import { useAuthStore } from '../../store/authStore';

export default function Navbar({ onMenuToggle }) {
  const { user, profile } = useAuthStore();

  return (
    <header className="sticky top-0 z-30 h-16 bg-dark-900/80 backdrop-blur-md border-b border-white/5 px-4 md:px-8 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-dark-800 lg:hidden transition-colors"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-gray-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>AI Coach: Active 🎙️</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Light / Dark Mode Toggle Button */}
        <ThemeToggle />

        <NextLink
          href="/learn"
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white text-xs font-bold shadow-md shadow-brand-500/25 transition-all transform hover:-translate-y-0.5"
        >
          <Mic className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Quick Practice</span>
          <span className="sm:hidden">Speak</span>
        </NextLink>

        <NotificationDropdown />

        <div className="h-6 w-[1px] bg-white/10 mx-1 hidden sm:block" />

        <div className="hidden sm:flex items-center gap-2 pl-1">
          <div className="w-8 h-8 rounded-lg bg-dark-800 border border-white/10 flex items-center justify-center font-bold text-xs text-brand-300">
            {profile?.targetLanguage ? profile.targetLanguage.slice(0, 2).toUpperCase() : 'ES'}
          </div>
        </div>
      </div>
    </header>
  );
}
