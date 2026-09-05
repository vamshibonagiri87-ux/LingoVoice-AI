import { useState, useEffect, useRef } from 'react';
import { Bell, CheckCheck, Sparkles, Flame, Award, AlertCircle } from 'lucide-react';
import { useLearnerStore } from '../../store/learnerStore';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { notifications, unreadNotificationCount, fetchNotifications, markNotificationRead } = useLearnerStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'streak':
        return <Flame className="w-4 h-4 text-amber-400" />;
      case 'challenge':
        return <Sparkles className="w-4 h-4 text-brand-400" />;
      case 'milestone':
        return <Award className="w-4 h-4 text-emerald-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-dark-800 transition-all"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadNotificationCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-brand-coral rounded-full ring-2 ring-dark-900 animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 md:w-96 rounded-2xl glass-dropdown z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-semibold text-sm text-white flex items-center gap-2">
              Notifications
              {unreadNotificationCount > 0 && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-brand-500/20 text-brand-300 font-medium">
                  {unreadNotificationCount} new
                </span>
              )}
            </h3>
            <button
              onClick={() => notifications.forEach((n) => !n.isRead && markNotificationRead(n._id))}
              className="text-xs text-gray-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Mark all read
            </button>
          </div>

          <div className="divide-y divide-white/5 max-h-80 overflow-y-auto mt-2">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-gray-500 text-xs">
                No notifications right now. Keep practicing! 🌟
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item._id}
                  onClick={() => !item.isRead && markNotificationRead(item._id)}
                  className={`py-3 px-2 rounded-xl transition-all cursor-pointer flex gap-3 ${
                    item.isRead ? 'opacity-60 hover:opacity-100 hover:bg-white/5' : 'bg-brand-500/10 hover:bg-brand-500/15'
                  }`}
                >
                  <div className="mt-0.5 p-2 rounded-lg bg-dark-800 shrink-0">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-200">{item.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{item.message}</p>
                    <span className="text-[10px] text-gray-500 mt-1 block">
                      {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {!item.isRead && (
                    <div className="w-2 h-2 rounded-full bg-brand-500 shrink-0 self-center" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
