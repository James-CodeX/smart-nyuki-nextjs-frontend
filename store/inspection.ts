import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { 
  InspectionStore, 
  InspectionSchedule, 
  InspectionReport,
  CreateInspectionScheduleRequest,
  UpdateInspectionScheduleRequest,
  CreateInspectionReportRequest,
  UpdateInspectionReportRequest,
  InspectionScheduleStats,
  InspectionReportStats,
  HealthTrend,
  PaginatedResponse
} from '@/types';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/store/auth';

export const useInspectionStore = create<InspectionStore>()(
  immer((set, get) => ({
    schedules: [],
    reports: [],
    currentSchedule: null,
    currentReport: null,
    isLoading: false,

    // Schedule methods
    fetchSchedules: async (filters) => {
      set({ isLoading: true });
      try {
        const response = await apiClient.getInspectionSchedules(filters);
        set({ schedules: response.results, isLoading: false });
      } catch (error) {
        console.error("Failed to fetch schedules:", error);
        set({ isLoading: false });
      }
    },

    createSchedule: async (data) => {
      set({ isLoading: true });
      try {
        await apiClient.createInspectionSchedule(data);
        await get().fetchSchedules(); // Refresh the list
      } finally {
        set({ isLoading: false });
      }
    },

    updateSchedule: async (id, data) => {
      set({ isLoading: true });
      try {
        await apiClient.updateInspectionSchedule(id, data);
        await get().fetchSchedules(); // Refresh the list
      } finally {
        set({ isLoading: false });
      }
    },

    deleteSchedule: async (id) => {
      set({ isLoading: true });
      try {
        await apiClient.deleteInspectionSchedule(id);
        await get().fetchSchedules(); // Refresh the list
      } finally {
        set({ isLoading: false });
      }
    },

    fetchSchedule: async (id) => {
      set({ isLoading: true });
      try {
        const schedule = await apiClient.getInspectionSchedule(id);
        set({ currentSchedule: schedule, isLoading: false });
      } catch (error) {
        console.error(`Failed to fetch schedule ${id}:`, error);
        set({ isLoading: false });
      }
    },

    completeSchedule: async (id, isCompleted, notes) => {
      set({ isLoading: true });
      try {
        await apiClient.completeInspectionSchedule(id, isCompleted, notes);
        await get().fetchSchedules(); // Refresh the list
      } finally {
        set({ isLoading: false });
      }
    },

    fetchUpcomingSchedules: async () => {
      set({ isLoading: true });
      try {
        const response = await apiClient.getUpcomingInspectionSchedules();
        return response.results;
      } finally {
        set({ isLoading: false });
      }
    },

    fetchOverdueSchedules: async () => {
      set({ isLoading: true });
      try {
        const response = await apiClient.getOverdueInspectionSchedules();
        return response.results;
      } finally {
        set({ isLoading: false });
      }
    },

    fetchScheduleStats: async () => {
      set({ isLoading: true });
      try {
        return await apiClient.getInspectionScheduleStats();
      } finally {
        set({ isLoading: false });
      }
    },

    // Report methods
    fetchReports: async (filters) => {
      set({ isLoading: true });
      try {
        const response = await apiClient.getInspectionReports(filters);
        set({ reports: response.results, isLoading: false });
      } catch (error) {
        console.error("Failed to fetch reports:", error);
        set({ isLoading: false });
      }
    },

    createReport: async (data) => {
      set({ isLoading: true });
      try {
        await apiClient.createInspectionReport(data);
        await get().fetchReports(); // Refresh the list
      } finally {
        set({ isLoading: false });
      }
    },

    updateReport: async (id, data) => {
      set({ isLoading: true });
      try {
        await apiClient.updateInspectionReport(id, data);
        await get().fetchReports(); // Refresh the list
      } finally {
        set({ isLoading: false });
      }
    },

    deleteReport: async (id) => {
      set({ isLoading: true });
      try {
        await apiClient.deleteInspectionReport(id);
        await get().fetchReports(); // Refresh the list
      } finally {
        set({ isLoading: false });
      }
    },

    fetchReport: async (id) => {
      set({ isLoading: true });
      try {
        const report = await apiClient.getInspectionReport(id);
        set({ currentReport: report, isLoading: false });
      } catch (error) {
        console.error(`Failed to fetch report ${id}:`, error);
        set({ isLoading: false });
      }
    },

    fetchRecentReports: async () => {
      set({ isLoading: true });
      try {
        const response = await apiClient.getRecentInspectionReports();
        return response.results;
      } finally {
        set({ isLoading: false });
      }
    },

    fetchReportsByHive: async (hiveId) => {
      set({ isLoading: true });
      try {
        const response = await apiClient.getInspectionReportsByHive(hiveId);
        return response.results;
      } finally {
        set({ isLoading: false });
      }
    },

    fetchReportStats: async () => {
      set({ isLoading: true });
      try {
        return await apiClient.getInspectionReportStats();
      } finally {
        set({ isLoading: false });
      }
    },

    fetchHealthTrends: async () => {
      set({ isLoading: true });
      try {
        return await apiClient.getHealthTrends();
      } finally {
        set({ isLoading: false });
      }
    },
  }))
);
