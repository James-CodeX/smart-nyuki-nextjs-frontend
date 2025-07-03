'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useSmartDeviceStore } from '@/store/smart-device'
import { useToast } from '@/components/ui/use-toast'
import { SmartDevice, Apiary, Hive } from '@/types'
import { 
  Smartphone, 
  Battery, 
  Calendar,
  MapPin,
  Home,
  Wifi,
  WifiOff,
  MoreVertical,
  Edit,
  Trash2,
  Power,
  PowerOff,
  Link as LinkIcon,
  Unlink
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { AssignDeviceModal } from './assign-device-modal'
import { EditDeviceModal } from './edit-device-modal'

interface SmartDeviceCardProps {
  device: SmartDevice
  apiaries: Apiary[]
  hives: Hive[]
  showAssignAction?: boolean
}

export function SmartDeviceCard({ 
  device, 
  apiaries, 
  hives, 
  showAssignAction = false 
}: SmartDeviceCardProps) {
  const { updateDevice, deleteDevice, isLoading } = useSmartDeviceStore()
  const { toast } = useToast()
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  const handleToggleActive = async () => {
    try {
      await updateDevice(device.id, { is_active: !device.is_active })
      toast({
        title: 'Success',
        description: `Device ${device.is_active ? 'deactivated' : 'activated'} successfully.`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update device status.',
        variant: 'destructive',
      })
    }
  }

  const handleUnassign = async () => {
    try {
      await updateDevice(device.id, { hive: null })
      toast({
        title: 'Success',
        description: 'Device unassigned from hive successfully.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to unassign device.',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this device? This action cannot be undone.')) {
      try {
        await deleteDevice(device.id)
        toast({
          title: 'Success',
          description: 'Device deleted successfully.',
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete device.',
          variant: 'destructive',
        })
      }
    }
  }

  const getBatteryColor = (level?: number) => {
    if (!level) return 'text-gray-400'
    if (level > 60) return 'text-green-600'
    if (level > 30) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getBatteryIcon = (level?: number) => {
    // You could use different battery icons based on level
    return Battery
  }

  const BatteryIcon = getBatteryIcon(device.battery_level)

  return (
    <>
      <Card className="relative">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5 text-blue-600" />
              <div>
                <CardTitle className="text-lg">{device.serial_number}</CardTitle>
                <p className="text-sm text-gray-600">{device.device_type}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* Status Badge */}
              <Badge variant={device.is_active ? "default" : "secondary"}>
                {device.is_active ? (
                  <>
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-1" />
                    Active
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-1" />
                    Inactive
                  </>
                )}
              </Badge>
              
              {/* Actions Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Device
                  </DropdownMenuItem>
                  
                  {device.hive || device.hive_name ? (
                    <DropdownMenuItem onClick={handleUnassign}>
                      <Unlink className="mr-2 h-4 w-4" />
                      Unassign from Hive
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => setShowAssignModal(true)}>
                      <LinkIcon className="mr-2 h-4 w-4" />
                      Assign to Hive
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuItem onClick={handleToggleActive}>
                    {device.is_active ? (
                      <>
                        <PowerOff className="mr-2 h-4 w-4" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <Power className="mr-2 h-4 w-4" />
                        Activate
                      </>
                    )}
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem 
                    onClick={handleDelete}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Device
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Assignment Status */}
          <div className="flex items-center space-x-2">
            {device.hive || device.hive_name ? (
              <>
                <Wifi className="h-4 w-4 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-700">
Assigned to {device.hive_name || 'Unknown Hive'}
                  </p>
                  <p className="text-xs text-gray-600 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
{device.apiary_name || 'Unknown Apiary'}
                  </p>
                </div>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-orange-600" />
                <p className="text-sm font-medium text-orange-700">
                  Unassigned
                </p>
              </>
            )}
          </div>

          {/* Device Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            {/* Battery Level */}
            {device.battery_level !== undefined && (
              <div className="flex items-center space-x-2">
                <BatteryIcon className={`h-4 w-4 ${getBatteryColor(device.battery_level)}`} />
                <span className="text-gray-600">
                  {device.battery_level}%
                </span>
              </div>
            )}

            {/* Last Sync */}
            {device.last_sync_at && (
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 text-xs">
                  {new Date(device.last_sync_at).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          {showAssignAction && !device.hive && !device.hive_name && (
            <div className="pt-2 border-t">
              <Button 
                onClick={() => setShowAssignModal(true)}
                size="sm"
                className="w-full"
                variant="outline"
              >
                <LinkIcon className="mr-2 h-4 w-4" />
                Assign to Hive
              </Button>
            </div>
          )}

          {/* Device Details */}
          <div className="pt-2 border-t">
            <div className="text-xs text-gray-500 space-y-1">
              <p>Added: {new Date(device.created_at).toLocaleDateString()}</p>
              {device.last_sync_at && (
                <p>Last sync: {new Date(device.last_sync_at).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <AssignDeviceModal
        device={device}
        apiaries={apiaries}
        hives={hives}
        open={showAssignModal}
        onOpenChange={setShowAssignModal}
      />

      <EditDeviceModal
        device={device}
        open={showEditModal}
        onOpenChange={setShowEditModal}
      />
    </>
  )
}
