import { create } from 'zustand';
import axios from 'axios';

const useAuthStore = create((set) => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,

    // Register user
    register: async (userData) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post('/api/auth/register', userData);
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            set({ user, token, isAuthenticated: true, loading: false });

            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Registration failed';
            set({ error: errorMessage, loading: false });
            return { success: false, error: errorMessage };
        }
    },

    // Login user
    login: async (credentials) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post('/api/auth/login', credentials);
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            set({ user, token, isAuthenticated: true, loading: false });

            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Login failed';
            set({ error: errorMessage, loading: false });
            return { success: false, error: errorMessage };
        }
    },

    // Update profile
    updateProfile: async (updates) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.put('/api/user/update', updates, {
                headers: { Authorization: `Bearer ${token}` }
            });

            set({ user: response.data.user });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.error };
        }
    },

    // Logout
    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
    },

    // Set user
    setUser: (user) => set({ user }),

    // Clear error
    clearError: () => set({ error: null })
}));

export default useAuthStore;
