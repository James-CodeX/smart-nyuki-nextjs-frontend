import { create } from 'zustand';
import { apiClient } from '@/lib/api';
import {
  BeekeeperProfile,
  CreateBeekeeperProfileRequest,
} from '@/types';

interface BeekeeperProfileStore {
  profiles: BeekeeperProfile[];
  currentProfile: BeekeeperProfile | null;
  isLoading: boolean;
  
  // Actions
  fetchProfiles: () => Promise<void>;
  createProfile: (data: CreateBeekeeperProfileRequest) => Promise<BeekeeperProfile>;
  updateProfile: (id: string, data: Partial<CreateBeekeeperProfileRequest>) => Promise<BeekeeperProfile>;
  deleteProfile: (id: string) => Promise<void>;
  setCurrentProfile: (profile: BeekeeperProfile | null) => void;
  clearProfiles: () => void;
}

export const useBeekeeperProfileStore = create<BeekeeperProfileStore>((set, get) => ({
  profiles: [],
  currentProfile: null,
  isLoading: false,

  fetchProfiles: async () => {
    set({ isLoading: true });
    try {
      const profiles = await apiClient.getBeekeeperProfiles();
      set({ 
        profiles, 
        currentProfile: profiles.length > 0 ? profiles[0] : null,
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createProfile: async (data: CreateBeekeeperProfileRequest) => {
    set({ isLoading: true });
    try {
      const newProfile = await apiClient.createBeekeeperProfile(data);
      const { profiles } = get();
      set({ 
        profiles: [...profiles, newProfile],
        currentProfile: newProfile,
        isLoading: false
      });
      return newProfile;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateProfile: async (id: string, data: Partial<CreateBeekeeperProfileRequest>) => {
    set({ isLoading: true });
    try {
      const updatedProfile = await apiClient.updateBeekeeperProfile(id, data);
      const { profiles } = get();
      // Ensure profiles is an array before calling map
      const currentProfiles = Array.isArray(profiles) ? profiles : [];
      const updatedProfiles = currentProfiles.map(profile => 
        profile.id === id ? updatedProfile : profile
      );
      set({ 
        profiles: updatedProfiles,
        currentProfile: updatedProfile,
        isLoading: false
      });
      return updatedProfile;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteProfile: async (id: string) => {
    set({ isLoading: true });
    try {
      await apiClient.deleteBeekeeperProfile(id);
      const { profiles } = get();
      // Ensure profiles is an array before calling filter
      const currentProfiles = Array.isArray(profiles) ? profiles : [];
      const filteredProfiles = currentProfiles.filter(profile => profile.id !== id);
      set({ 
        profiles: filteredProfiles,
        currentProfile: filteredProfiles.length > 0 ? filteredProfiles[0] : null,
        isLoading: false
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  setCurrentProfile: (profile: BeekeeperProfile | null) => {
    set({ currentProfile: profile });
  },

  clearProfiles: () => {
    set({ profiles: [], currentProfile: null, isLoading: false });
  },
}));
