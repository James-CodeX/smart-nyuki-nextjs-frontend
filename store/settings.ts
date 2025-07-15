import { create } from 'zustand';
import { apiClient } from '@/lib/api';
import {
  AlertThresholds,
  AvailableHive,
  DataSyncSettings,
  NotificationSettings,
  PrivacySettings,
  SettingsStore,
  UpdateAlertThresholdsRequest,
  UpdateDataSyncSettingsRequest,
  UpdateNotificationSettingsRequest,
  UpdatePrivacySettingsRequest,
  UpdateUserSettingsRequest,
  UserSettings,
  PaginatedResponse,
} from '@/types';

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  userSettings: null,
  alertThresholds: [],
  globalThresholds: null,
  notificationSettings: null,
  dataSyncSettings: null,
  privacySettings: null,
  availableHives: [],
  isLoading: false,

  // User Settings
  fetchUserSettings: async () => {
    set({ isLoading: true });
    try {
      const userSettings = await apiClient.getUserSettings();
      set({ userSettings, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch user settings:', error);
      set({ isLoading: false });
      throw error;
    }
  },
  updateUserSettings: async (data: UpdateUserSettingsRequest) => {
    set({ isLoading: true });
    try {
      const userSettings = await apiClient.updateUserSettings(data);
      set({ userSettings, isLoading: false });
    } catch (error) {
      console.error('Failed to update user settings:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  // Alert Thresholds
  fetchAlertThresholds: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.getAlertThresholds();
      set({ alertThresholds: response.results, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch alert thresholds:', error);
      set({ isLoading: false });
      throw error;
    }
  },
  createAlertThreshold: async (data: UpdateAlertThresholdsRequest) => {
    set({ isLoading: true });
    try {
      await apiClient.createAlertThreshold(data);
      await get().fetchAlertThresholds();
    } catch (error) {
      console.error('Failed to create alert threshold:', error);
      set({ isLoading: false });
      throw error;
    }
  },
  updateAlertThreshold: async (id: string, data: UpdateAlertThresholdsRequest) => {
    set({ isLoading: true });
    try {
      await apiClient.updateAlertThreshold(id, data);
      await get().fetchAlertThresholds();
    } catch (error) {
      console.error('Failed to update alert threshold:', error);
      set({ isLoading: false });
      throw error;
    }
  },
  deleteAlertThreshold: async (id: string) => {
    set({ isLoading: true });
    try {
      await apiClient.deleteAlertThreshold(id);
      await get().fetchAlertThresholds();
    } catch (error) {
      console.error('Failed to delete alert threshold:', error);
      set({ isLoading: false });
      throw error;
    }
  },
  fetchGlobalThresholds: async () => {
    set({ isLoading: true });
    try {
      const globalThresholds = await apiClient.getGlobalThresholds();
      set({ globalThresholds, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch global thresholds:', error);
      set({ isLoading: false });
      // Set to null if no global thresholds found
      set({ globalThresholds: null });
    }
  },
  setGlobalThresholds: async (data: UpdateAlertThresholdsRequest) => {
    set({ isLoading: true });
    try {
      await apiClient.setGlobalThresholds(data);
      await get().fetchGlobalThresholds();
      await get().fetchAlertThresholds();
    } catch (error) {
      console.error('Failed to set global thresholds:', error);
      set({ isLoading: false });
      throw error;
    }
  },
  fetchAvailableHives: async () => {
    set({ isLoading: true });
    try {
      const availableHives = await apiClient.getAvailableHivesForAlerts();
      set({ availableHives, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch available hives:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  // Notification Settings
  fetchNotificationSettings: async () => {
    set({ isLoading: true });
    try {
      const notificationSettings = await apiClient.getNotificationSettings();
      set({ notificationSettings, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch notification settings:', error);
      set({ isLoading: false });
      throw error;
    }
  },
  updateNotificationSettings: async (data: UpdateNotificationSettingsRequest) => {
    set({ isLoading: true });
    try {
      const notificationSettings = await apiClient.updateNotificationSettings(data);
      set({ notificationSettings, isLoading: false });
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  // Data Sync Settings
  fetchDataSyncSettings: async () => {
    set({ isLoading: true });
    try {
      const dataSyncSettings = await apiClient.getDataSyncSettings();
      set({ dataSyncSettings, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch data sync settings:', error);
      set({ isLoading: false });
      throw error;
    }
  },
  updateDataSyncSettings: async (data: UpdateDataSyncSettingsRequest) => {
    set({ isLoading: true });
    try {
      const dataSyncSettings = await apiClient.updateDataSyncSettings(data);
      set({ dataSyncSettings, isLoading: false });
    } catch (error) {
      console.error('Failed to update data sync settings:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  // Privacy Settings
  fetchPrivacySettings: async () => {
    set({ isLoading: true });
    try {
      const privacySettings = await apiClient.getPrivacySettings();
      set({ privacySettings, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch privacy settings:', error);
      set({ isLoading: false });
      throw error;
    }
  },
  updatePrivacySettings: async (data: UpdatePrivacySettingsRequest) => {
    set({ isLoading: true });
    try {
      const privacySettings = await apiClient.updatePrivacySettings(data);
      set({ privacySettings, isLoading: false });
    } catch (error) {
      console.error('Failed to update privacy settings:', error);
      set({ isLoading: false });
      throw error;
    }
  },
}));

