import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '@/lib/api';
import {
  AuthStore,
  User,
  AuthTokens,
  LoginRequest,
  RegisterRequest,
  UpdateUserProfileRequest,
} from '@/types';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginRequest) => {
        set({ isLoading: true });
        try {
          const response = await apiClient.login(credentials);
          const { user, tokens } = response;

          // Store tokens in localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', tokens.access);
            localStorage.setItem('refresh_token', tokens.refresh);
          }

          set({
            user,
            tokens,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data: RegisterRequest) => {
        set({ isLoading: true });
        try {
          const response = await apiClient.register(data);
          const { user, tokens } = response;

          // Store tokens in localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', tokens.access);
            localStorage.setItem('refresh_token', tokens.refresh);
          }

          set({
            user,
            tokens,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        const { tokens } = get();
        if (tokens?.refresh) {
          try {
            await apiClient.logout({ refresh: tokens.refresh });
          } catch (error) {
            console.error('Logout API call failed:', error);
          }
        }

        // Clear tokens from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }

        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      refreshToken: async () => {
        const { tokens } = get();
        if (!tokens?.refresh) {
          throw new Error('No refresh token available');
        }

        try {
          const response = await apiClient.refreshToken({ refresh: tokens.refresh });
          const newTokens = {
            ...tokens,
            access: response.access,
          };

          // Update access token in localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', response.access);
          }

          set({ tokens: newTokens });
        } catch (error) {
          // If refresh fails, clear auth state
          get().clearAuth();
          throw error;
        }
      },

      updateProfile: async (data: UpdateUserProfileRequest) => {
        set({ isLoading: true });
        try {
          const updatedUser = await apiClient.updateUserProfile(data);
          set({
            user: updatedUser,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      clearAuth: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      refreshUserProfile: async () => {
        try {
          const updatedUser = await apiClient.getUserProfile();
          set({ user: updatedUser });
        } catch (error) {
          console.error('Failed to refresh user profile:', error);
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
