import { useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
  LayoutDashboard,
  Mic2,
  Compass,
  Sparkles,
  TrendingUp,
  History,
  Settings,
  LogOut,
  Flame,
  Globe,
  Headphones,
  Award,
  HelpCircle,
  X
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import ThemeToggle from '../ThemeToggle/ThemeToggle';

export default function Sidebar({ isOpen, setIsOpen }) {
  const router = useRouter();
  const { user, profile, logout } = useAuthStore();
  const [showHelp, setShowHelp] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, tip: 'Daily overview & goals' },
    { name: 'Voice Studio', href: '/learn', icon: Mic2, badge: 'AI Live', tip: 'Start speaking practice' },
    { name: 'Scenarios', href: '/scenarios', icon: Compass, tip: 'Roleplay real-world stories' },
    { name: 'Practice Hub', href: '/practice', icon: Sparkles, tip: 'Pronunciation drills & games' },
    { name: 'Progress', href: '/progress', icon: TrendingUp, tip: 'Track your fluency growth' },
    { name: 'History', href: '/history', icon: History, tip: 'Review past conversations' },
    { name: 'Settings', href: '/settings', icon: Settings, tip: 'Adjust voice & profile' },
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const levelLabelMap = {
    'Beginner': '🌱 Starter (A1)',
    'Elementary': '🌿 Elementary (A2)',
    'Intermediate': '🚀 Conversational (B1)',
    'Upper Intermediate': '⭐ Confident (B2)',
    'Advanced': '🏆 Fluent (C1)'
  };

  const currentLevel = profile?.proficiencyLevel || user?.proficiencyLevel || 'Beginner';
  const displayLevel = levelLabelMap[currentLevel] || currentLevel;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-dark-900 border-r border-white/5 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="h-16 px-6 flex items-center gap-3 border-b border-white/5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-brand-accent flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Headphones className="w-5 h-5 text-white animate-pulse-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-white tracking-tight">LingoVoice</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-brand-500/20 text-brand-400 uppercase tracking-wider">AI</span>
              </div>
              <p className="text-[11px] text-gray-400">Personal Voice Coach</p>
            </div>
          </div>

          {/* User Target Language & Streak Bar */}
          <div className="p-4 mx-3 my-3 rounded-2xl bg-dark-850/80 border border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-brand-accent" />
                <span className="text-xs font-bold text-white">
                  {profile?.targetLanguage || user?.targetLanguage || 'Spanish'}
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-dark-750 text-brand-300 font-medium border border-white/5">
                {displayLevel}
              </span>
            </div>

            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-gray-400 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400/30" /> Daily Streak
              </span>
              <span className="font-extrabold text-amber-400">{user?.currentStreak || 1} Days 🔥</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = router.pathname === item.href || (item.href !== '/dashboard' && router.pathname.startsWith(item.href));

              return (
                <NextLink
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-600/20 to-brand-500/10 text-brand-300 border border-brand-500/30 shadow-sm'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-dark-800/60'
                  }`}
                  title={item.tip}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-brand-400' : 'text-gray-400 group-hover:text-gray-200'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                      {item.badge}
                    </span>
                  )}
                </NextLink>
              );
            })}
          </nav>
        </div>

        {/* User Footer Profile, Quick Help & Theme Switcher */}
        <div className="p-4 border-t border-white/5 bg-dark-950/40 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => setShowHelp(true)}
              className="flex-1 py-2 px-3 rounded-xl bg-dark-850 hover:bg-dark-800 border border-white/5 text-xs text-gray-300 hover:text-white flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>Quick Guide</span>
              </div>
              <span className="text-[10px] font-bold text-cyan-400">❓</span>
            </button>

            <ThemeToggle className="py-2 px-2.5" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-md">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-200 truncate">{user?.name || 'Learner'}</p>
                <p className="text-[11px] text-gray-400 truncate">{user?.email || 'learner@lingovoice.ai'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Student Quick Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-lg glass-panel rounded-3xl p-6 md:p-8 border border-brand-500/30 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-brand-500/20 text-brand-400">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">How LingoVoice AI Works 🌟</h3>
                  <p className="text-xs text-gray-400">Simple guide for students & beginners</p>
                </div>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-300">
              <div className="p-3.5 rounded-2xl bg-dark-850 border border-white/5 space-y-1">
                <span className="font-bold text-brand-300 block text-sm">1. Pick a Mode 🎙️</span>
                <p>Choose <strong>Free Conversation</strong>, a <strong>Real-World Scenario</strong> (like ordering at a cafe), or the <strong>Pronunciation Studio</strong>.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-dark-850 border border-white/5 space-y-1">
                <span className="font-bold text-cyan-300 block text-sm">2. Speak into your Mic 🗣️</span>
                <p>Tap the big mic button to speak. If you need help with words, click our prompt suggestions or click &ldquo;Show Meaning&rdquo; to read the English translation.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-dark-850 border border-white/5 space-y-1">
                <span className="font-bold text-emerald-300 block text-sm">3. Earn XP & Build Streaks 🔥</span>
                <p>Practice just 5-15 minutes a day to grow your streak and level up your speaking confidence!</p>
              </div>
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-500/25"
            >
              Awesome, Let&apos;s Learn! 🚀
            </button>
          </div>
        </div>
      )}
    </>
  );
}
