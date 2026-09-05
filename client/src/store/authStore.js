import { create } from 'zustand';
import api from '../services/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  profile: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  initializeAuth: async () => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('lingovoice_token');
    const savedUser = localStorage.getItem('lingovoice_user');

    if (token) {
      set({ token, isAuthenticated: true });
      if (savedUser) {
        try {
          set({ user: JSON.parse(savedUser) });
        } catch (e) {}
      }

      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          const { user, profile } = res.data.data;
          set({ user, profile, isAuthenticated: true, isLoading: false });
          localStorage.setItem('lingovoice_user', JSON.stringify(user));
        }
      } catch (err) {
        console.warn('[Auth] Session validation failed:', err.message);
        localStorage.removeItem('lingovoice_token');
        localStorage.removeItem('lingovoice_user');
        set({ user: null, token: null, profile: null, isAuthenticated: false, isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user, profile, token } = res.data.data;

      localStorage.setItem('lingovoice_token', token);
      localStorage.setItem('lingovoice_user', JSON.stringify(user));

      set({
        user,
        profile,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed. Please check your credentials.';
      set({ isLoading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/register', userData);
      const { user, profile, token } = res.data.data;

      localStorage.setItem('lingovoice_token', token);
      localStorage.setItem('lingovoice_user', JSON.stringify(user));

      set({
        user,
        profile,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed. Please try again.';
      set({ isLoading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {}

    localStorage.removeItem('lingovoice_token');
    localStorage.removeItem('lingovoice_user');

    set({
      user: null,
      token: null,
      profile: null,
      isAuthenticated: false,
      error: null
    });
  },

  updateUserProfile: async (data) => {
    try {
      const res = await api.put('/auth/update', data);
      if (res.data.success) {
        set({ user: res.data.data });
        localStorage.setItem('lingovoice_user', JSON.stringify(res.data.data));
        return { success: true };
      }
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Failed to update profile' };
    }
  },

  setProfile: (profile) => set({ profile })
}));
