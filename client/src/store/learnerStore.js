import { create } from 'zustand';
import api from '../services/api';

export const useLearnerStore = create((set, get) => ({
  progress: null,
  history: [],
  insights: null,
  notifications: [],
  unreadNotificationCount: 0,
  isLoadingProgress: false,

  fetchProgress: async () => {
    set({ isLoadingProgress: true });
    try {
      const res = await api.get('/progress');
      if (res.data.success) {
        set({ progress: res.data.data, isLoadingProgress: false });
      }
    } catch (err) {
      console.warn('[LearnerStore] Failed to fetch progress:', err.message);
      set({ isLoadingProgress: false });
    }
  },

  fetchHistory: async (limit = 14) => {
    try {
      const res = await api.get(`/progress/history?limit=${limit}`);
      if (res.data.success) {
        set({ history: res.data.data });
      }
    } catch (err) {
      console.warn('[LearnerStore] Failed to fetch progress history:', err.message);
    }
  },

  fetchInsights: async () => {
    try {
      const res = await api.get('/progress/insights');
      if (res.data.success) {
        set({ insights: res.data.data });
      }
    } catch (err) {
      console.warn('[LearnerStore] Failed to fetch insights:', err.message);
    }
  },

  fetchNotifications: async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data.success) {
        const notifications = res.data.data;
        const unreadCount = notifications.filter((n) => !n.isRead).length;
        set({ notifications, unreadNotificationCount: unreadCount });
      }
    } catch (err) {
      console.warn('[LearnerStore] Failed to fetch notifications:', err.message);
    }
  },

  markNotificationRead: async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      const updated = get().notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n));
      const unreadCount = updated.filter((n) => !n.isRead).length;
      set({ notifications: updated, unreadNotificationCount: unreadCount });
    } catch (err) {
      console.warn('[LearnerStore] Failed to mark notification read:', err.message);
    }
  }
}));
