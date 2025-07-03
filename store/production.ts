import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { 
  ProductionStore, 
  Harvest, 
  Alert,
  CreateHarvestRequest,
  UpdateHarvestRequest,
  CreateAlertRequest,
  ResolveAlertRequest,
  ProductionStats,
  AlertStats,
  PaginatedResponse
} from '@/types';
import { apiClient } from '@/lib/api';

export const useProductionStore = create<ProductionStore>()(
  immer((set, get) => ({
    harvests: [],
    alerts: [],
    currentHarvest: null,
    currentAlert: null,
    isLoading: false,

    // Harvest methods
    fetchHarvests: async (filters) => {
      set({ isLoading: true });
      try {
        const response = await apiClient.getHarvests(filters);
        set({ harvests: response.results, isLoading: false });
      } catch (error) {
        console.error("Failed to fetch harvests:", error);
        set({ isLoading: false });
      }
    },

    createHarvest: async (data) => {
      set({ isLoading: true });
      try {
        await apiClient.createHarvest(data);
        await get().fetchHarvests(); // Refresh the list
      } finally {
        set({ isLoading: false });
      }
    },

    updateHarvest: async (id, data) => {
      set({ isLoading: true });
      try {
        await apiClient.updateHarvest(id, data);
        await get().fetchHarvests(); // Refresh the list
      } finally {
        set({ isLoading: false });
      }
    },

    deleteHarvest: async (id) => {
      set({ isLoading: true });
      try {
        await apiClient.deleteHarvest(id);
        await get().fetchHarvests(); // Refresh the list
      } finally {
        set({ isLoading: false });
      }
    },

    fetchHarvest: async (id) => {
      set({ isLoading: true });
      try {
        const harvest = await apiClient.getHarvest(id);
        set({ currentHarvest: harvest, isLoading: false });
      } catch (error) {
        console.error(`Failed to fetch harvest ${id}:`, error);
        set({ isLoading: false });
      }
    },

    // Alert methods
    fetchAlerts: async (filters) => {
      set({ isLoading: true });
      try {
        const response = await apiClient.getAlerts(filters);
        set({ alerts: response.results, isLoading: false });
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
        set({ isLoading: false });
      }
    },

    createAlert: async (data) => {
      set({ isLoading: true });
      try {
        await apiClient.createAlert(data);
        await get().fetchAlerts(); // Refresh the list
      } finally {
        set({ isLoading: false });
      }
    },

    resolveAlert: async (id, data) => {
      set({ isLoading: true });
      try {
        await apiClient.resolveAlert(id, data);
        await get().fetchAlerts(); // Refresh the list
      } finally {
        set({ isLoading: false });
      }
    },

    fetchAlert: async (id) => {
      set({ isLoading: true });
      try {
        const alert = await apiClient.getAlert(id);
        set({ currentAlert: alert, isLoading: false });
      } catch (error) {
        console.error(`Failed to fetch alert ${id}:`, error);
        set({ isLoading: false });
      }
    },

    // Stats methods
    fetchProductionStats: async () => {
      set({ isLoading: true });
      try {
        return await apiClient.getProductionStats();
      } finally {
        set({ isLoading: false });
      }
    },

    fetchAlertStats: async () => {
      set({ isLoading: true });
      try {
        return await apiClient.getAlertStats();
      } finally {
        set({ isLoading: false });
      }
    },
  }))
);
