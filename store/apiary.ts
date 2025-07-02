import { create } from 'zustand';
import { apiClient } from '@/lib/api';
import {
  ApiaryStore,
  Apiary,
  CreateApiaryRequest,
  UpdateApiaryRequest,
  ApiaryStats,
} from '@/types';

export const useApiaryStore = create<ApiaryStore>((set, get) => ({
  apiaries: [],
  currentApiary: null,
  isLoading: false,

  fetchApiaries: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.getApiaries();
      set({ 
        apiaries: response.results,
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to fetch apiaries:', error);
      throw error;
    }
  },

  createApiary: async (data: CreateApiaryRequest) => {
    set({ isLoading: true });
    try {
      const newApiary = await apiClient.createApiary(data);
      set(state => ({
        apiaries: [...state.apiaries, newApiary],
        isLoading: false
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateApiary: async (id: string, data: UpdateApiaryRequest) => {
    set({ isLoading: true });
    try {
      const updatedApiary = await apiClient.updateApiary(id, data);
      set(state => ({
        apiaries: state.apiaries.map(apiary => 
          apiary.id === id ? updatedApiary : apiary
        ),
        currentApiary: state.currentApiary?.id === id ? updatedApiary : state.currentApiary,
        isLoading: false
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteApiary: async (id: string) => {
    set({ isLoading: true });
    try {
      await apiClient.deleteApiary(id);
      set(state => ({
        apiaries: state.apiaries.filter(apiary => apiary.id !== id),
        currentApiary: state.currentApiary?.id === id ? null : state.currentApiary,
        isLoading: false
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchApiary: async (id: string) => {
    set({ isLoading: true });
    try {
      const apiary = await apiClient.getApiary(id);
      set({ 
        currentApiary: apiary,
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to fetch apiary:', error);
      throw error;
    }
  },

  getApiaryStats: async (id: string): Promise<ApiaryStats> => {
    try {
      return await apiClient.getApiaryStats(id);
    } catch (error) {
      console.error('Failed to fetch apiary stats:', error);
      throw error;
    }
  },
}));
