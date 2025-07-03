'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select'
import { useSmartDeviceStore } from '@/store/smart-device'
import { useToast } from '@/components/ui/use-toast'
import { SmartDevice, Apiary, Hive } from '@/types'

interface AssignDeviceModalProps {
  device: SmartDevice
  apiaries: Apiary[]
  hives: Hive[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AssignDeviceModal({ device, apiaries, hives, open, onOpenChange }: AssignDeviceModalProps) {
  const { updateDevice } = useSmartDeviceStore()
  const { toast } = useToast()
  const [selectedHive, setSelectedHive] = useState<string | undefined>()

  const handleAssign = async () => {
    if (!selectedHive) return
    try {
      await updateDevice(device.id, { hive: selectedHive })
      toast({
        title: 'Success',
        description: 'Device assigned to hive successfully.',
      })
      onOpenChange(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to assign device to hive.',
        variant: 'destructive',
      })
    }
  }

  const availableHives = (hives || []).filter(hive => !hive.has_smart_device)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Smart Device to Hive</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select onValueChange={setSelectedHive} value={selectedHive}>
            <SelectTrigger>
              <SelectValue placeholder="Select a hive to assign" />
            </SelectTrigger>
            <SelectContent>
              {availableHives.length === 0 ? (
                <SelectItem value="" disabled>
                  No available hives found
                </SelectItem>
              ) : (
                availableHives.map(hive => (
                  <SelectItem key={hive.id} value={hive.id}>
                    {hive.name} (Apiary: {hive.apiary?.name || 'Unknown Apiary'})
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {availableHives.length === 0 && (
            <p className="text-sm text-gray-500">
              No hives available for assignment. All hives may already have smart devices assigned.
            </p>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleAssign} disabled={!selectedHive}>
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
