import { create } from 'zustand';
import { apiClient } from '@/lib/api';
import {
  HiveStore,
  Hive,
  CreateHiveRequest,
  UpdateHiveRequest,
} from '@/types';

export const useHiveStore = create<HiveStore>((set, get) => ({
  hives: [],
  currentHive: null,
  isLoading: false,

  fetchHives: async (filters?: Record<string, any>) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.getHives(filters);
      set({ 
        hives: response.results,
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to fetch hives:', error);
      throw error;
    }
  },

  createHive: async (data: CreateHiveRequest) => {
    set({ isLoading: true });
    try {
      const newHive = await apiClient.createHive(data);
      set(state => ({
        hives: [...state.hives, newHive],
        isLoading: false
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateHive: async (id: string, data: UpdateHiveRequest) => {
    set({ isLoading: true });
    try {
      const updatedHive = await apiClient.updateHive(id, data);
      set(state => ({
        hives: state.hives.map(hive => 
          hive.id === id ? updatedHive : hive
        ),
        currentHive: state.currentHive?.id === id ? updatedHive : state.currentHive,
        isLoading: false
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteHive: async (id: string) => {
    set({ isLoading: true });
    try {
      await apiClient.deleteHive(id);
      set(state => ({
        hives: state.hives.filter(hive => hive.id !== id),
        currentHive: state.currentHive?.id === id ? null : state.currentHive,
        isLoading: false
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchHive: async (id: string) => {
    set({ isLoading: true });
    try {
      const hive = await apiClient.getHive(id);
      set({ 
        currentHive: hive,
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to fetch hive:', error);
      throw error;
    }
  },

  activateHive: async (id: string) => {
    set({ isLoading: true });
    try {
      await apiClient.activateHive(id);
      // Refetch the hive to get updated status
      const updatedHive = await apiClient.getHive(id);
      set(state => ({
        hives: state.hives.map(hive => 
          hive.id === id ? updatedHive : hive
        ),
        currentHive: state.currentHive?.id === id ? updatedHive : state.currentHive,
        isLoading: false
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deactivateHive: async (id: string) => {
    set({ isLoading: true });
    try {
      await apiClient.deactivateHive(id);
      // Refetch the hive to get updated status
      const updatedHive = await apiClient.getHive(id);
      set(state => ({
        hives: state.hives.map(hive => 
          hive.id === id ? updatedHive : hive
        ),
        currentHive: state.currentHive?.id === id ? updatedHive : state.currentHive,
        isLoading: false
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));
