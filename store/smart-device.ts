'use client'

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { apiClient } from '@/lib/api'
import { SmartDevice, CreateSmartDeviceRequest, UpdateSmartDeviceRequest, SmartDeviceStore } from '@/types'
import { useHiveStore } from './hive'

export const useSmartDeviceStore = create<SmartDeviceStore>()(
  devtools(
    (set, get) => ({
      devices: [],
      currentDevice: null,
      isLoading: false,

      fetchDevices: async (filters) => {
        set({ isLoading: true })
        try {
          const response = await apiClient.getSmartDevices(filters)
          set({ devices: response.results })
        } catch (error) {
          console.error('Failed to fetch smart devices:', error)
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      createDevice: async (data: CreateSmartDeviceRequest) => {
        set({ isLoading: true })
        try {
          // Get the current user to extract beekeeper profile ID
          const { useAuthStore } = await import('./auth')
          const authStore = useAuthStore.getState()
          
          if (!authStore.user?.beekeeper_profile) {
            throw new Error('Beekeeper profile is required to create smart devices')
          }
          
          // Add beekeeper field to the request data
          const requestData = {
            ...data,
            beekeeper: authStore.user.beekeeper_profile.id
          }
          
          const newDevice = await apiClient.createSmartDevice(requestData)
          set((state) => ({
            devices: [...state.devices, newDevice]
          }))
          
          // Refresh hive data if device was assigned to a hive
          // This ensures the has_smart_device field is updated
          if (data.hive) {
            const hiveStore = useHiveStore.getState()
            await hiveStore.fetchHives()
          }
        } catch (error) {
          console.error('Failed to create smart device:', error)
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      updateDevice: async (id: string, data: UpdateSmartDeviceRequest) => {
        set({ isLoading: true })
        try {
          const updatedDevice = await apiClient.updateSmartDevice(id, data)
          set((state) => ({
            devices: state.devices.map(device => 
              device.id === id ? updatedDevice : device
            ),
            currentDevice: state.currentDevice?.id === id ? updatedDevice : state.currentDevice
          }))
          
          // Refresh hive data if device assignment changed
          // This ensures the has_smart_device field is updated
          if ('hive' in data) {
            const hiveStore = useHiveStore.getState()
            await hiveStore.fetchHives()
          }
        } catch (error) {
          console.error('Failed to update smart device:', error)
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      deleteDevice: async (id: string) => {
        set({ isLoading: true })
        try {
          // Get the device before deletion to check if it was assigned to a hive
          const deviceToDelete = get().devices.find(device => device.id === id)
          
          await apiClient.deleteSmartDevice(id)
          set((state) => ({
            devices: state.devices.filter(device => device.id !== id),
            currentDevice: state.currentDevice?.id === id ? null : state.currentDevice
          }))
          
          // Refresh hive data if device was assigned to a hive
          // This ensures the has_smart_device field is updated
          if (deviceToDelete?.hive) {
            const hiveStore = useHiveStore.getState()
            await hiveStore.fetchHives()
          }
        } catch (error) {
          console.error('Failed to delete smart device:', error)
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      fetchDevice: async (id: string) => {
        set({ isLoading: true })
        try {
          const device = await apiClient.getSmartDevice(id)
          set({ currentDevice: device })
        } catch (error) {
          console.error('Failed to fetch smart device:', error)
          throw error
        } finally {
          set({ isLoading: false })
        }
      },
    }),
    {
      name: 'smart-device-store',
    }
  )
)
