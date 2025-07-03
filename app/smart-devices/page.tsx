'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useSmartDeviceStore } from '@/store/smart-device'
import { useApiaryStore } from '@/store/apiary'
import { useHiveStore } from '@/store/hive'
import { useAuthStore } from '@/store/auth'
import { SmartDeviceCard } from '@/components/smart-device/smart-device-card'
import { AddSmartDeviceModal } from '@/components/smart-device/add-smart-device-modal'
import { SmartDevice } from '@/types'
import { Plus, Wifi, WifiOff, Smartphone } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CreateBeekeeperProfileDialog } from '@/components/dialogs/create-beekeeper-profile-dialog'

export default function SmartDevicesPage() {
  const { user } = useAuthStore()
  const { devices, fetchDevices, isLoading } = useSmartDeviceStore()
  const { apiaries, fetchApiaries } = useApiaryStore()
  const { hives, fetchHives } = useHiveStore()
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    if (user?.beekeeper_profile) {
      const loadData = async () => {
        try {
          await Promise.all([
            fetchDevices(),
            fetchApiaries(),
            fetchHives()
          ])
        } catch (error) {
          console.error('Failed to load data:', error)
        }
      }
      loadData()
    }
  }, [user, fetchDevices, fetchApiaries, fetchHives])

  const assignedDevices = devices.filter(device => device.hive !== null || device.hive_name)
  const unassignedDevices = devices.filter(device => device.hive === null && !device.hive_name)
  const activeDevices = devices.filter(device => device.is_active)
  const inactiveDevices = devices.filter(device => !device.is_active)

  if (!user?.beekeeper_profile) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <Smartphone className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-foreground">No beekeeper profile</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            You need to create a beekeeper profile before managing smart devices.
          </p>
          <div className="mt-6">
            <CreateBeekeeperProfileDialog>
              <Button>
                Create Beekeeper Profile
              </Button>
            </CreateBeekeeperProfileDialog>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Smart Devices</h1>
            <p className="text-muted-foreground mt-2">
              Manage your Smart-nyuki devices and their hive assignments
            </p>
          </div>
          <AddSmartDeviceModal apiaries={apiaries}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Device
            </Button>
          </AddSmartDeviceModal>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Smartphone className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Devices</p>
                  <p className="text-2xl font-bold text-foreground">{devices.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Wifi className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Assigned</p>
                  <p className="text-2xl font-bold text-foreground">{assignedDevices.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <WifiOff className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Unassigned</p>
                  <p className="text-2xl font-bold text-foreground">{unassignedDevices.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="h-3 w-3 bg-green-600 rounded-full"></div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-foreground">{activeDevices.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Device Management Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Devices ({devices.length})</TabsTrigger>
            <TabsTrigger value="assigned">Assigned ({assignedDevices.length})</TabsTrigger>
            <TabsTrigger value="unassigned">Unassigned ({unassignedDevices.length})</TabsTrigger>
            <TabsTrigger value="inactive">Inactive ({inactiveDevices.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <DeviceSection
              title="All Smart Devices"
              devices={devices}
              apiaries={apiaries}
              hives={hives}
              isLoading={isLoading}
              emptyMessage="No smart devices found. Add your first device to get started."
            />
          </TabsContent>

          <TabsContent value="assigned" className="space-y-4">
            <DeviceSection
              title="Assigned Devices"
              devices={assignedDevices}
              apiaries={apiaries}
              hives={hives}
              isLoading={isLoading}
              emptyMessage="No devices are currently assigned to hives."
            />
          </TabsContent>

          <TabsContent value="unassigned" className="space-y-4">
            <DeviceSection
              title="Unassigned Devices"
              devices={unassignedDevices}
              apiaries={apiaries}
              hives={hives}
              isLoading={isLoading}
              emptyMessage="All devices are assigned to hives."
              showAssignAction={true}
            />
          </TabsContent>

          <TabsContent value="inactive" className="space-y-4">
            <DeviceSection
              title="Inactive Devices"
              devices={inactiveDevices}
              apiaries={apiaries}
              hives={hives}
              isLoading={isLoading}
              emptyMessage="No inactive devices found."
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

interface DeviceSectionProps {
  title: string
  devices: SmartDevice[]
  apiaries: any[]
  hives: any[]
  isLoading: boolean
  emptyMessage: string
  showAssignAction?: boolean
}

function DeviceSection({ 
  title, 
  devices, 
  apiaries, 
  hives, 
  isLoading, 
  emptyMessage, 
  showAssignAction = false 
}: DeviceSectionProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading devices...</p>
        </div>
      </div>
    )
  }

  if (devices.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <Smartphone className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-foreground">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{emptyMessage}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {devices.map((device) => (
        <SmartDeviceCard
          key={device.id}
          device={device}
          apiaries={apiaries}
          hives={hives}
          showAssignAction={showAssignAction}
        />
      ))}
    </div>
  )
}
