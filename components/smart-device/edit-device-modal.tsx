'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSmartDeviceStore } from '@/store/smart-device'
import { useToast } from '@/components/ui/use-toast'
import { SmartDevice, UpdateSmartDeviceRequest } from '@/types'

interface EditDeviceModalProps {
  device: SmartDevice
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditDeviceModal({ device, open, onOpenChange }: EditDeviceModalProps) {
  const { updateDevice, isLoading } = useSmartDeviceStore()
  const { toast } = useToast()
  
  const [formData, setFormData] = useState<UpdateSmartDeviceRequest>({
    serial_number: '',
    device_type: '',
    battery_level: 100,
    is_active: true,
  })
  
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  useEffect(() => {
    if (device && open) {
      setFormData({
        serial_number: device.serial_number,
        device_type: device.device_type,
        battery_level: device.battery_level || 100,
        is_active: device.is_active,
      })
      setErrors({})
    }
  }, [device, open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: [],
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string[]> = {}

    if (!formData.serial_number?.trim()) {
      newErrors.serial_number = ['Serial number is required']
    }

    if (!formData.device_type?.trim()) {
      newErrors.device_type = ['Device type is required']
    }

    if (formData.battery_level !== undefined && (formData.battery_level < 0 || formData.battery_level > 100)) {
      newErrors.battery_level = ['Battery level must be between 0 and 100']
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      // Only send fields that have actually changed
      const updateData: UpdateSmartDeviceRequest = {}
      
      if (formData.serial_number !== device.serial_number) {
        updateData.serial_number = formData.serial_number
      }
      
      if (formData.device_type !== device.device_type) {
        updateData.device_type = formData.device_type
      }
      
      if (formData.battery_level !== device.battery_level) {
        updateData.battery_level = formData.battery_level
      }
      
      if (formData.is_active !== device.is_active) {
        updateData.is_active = formData.is_active
      }

      // Only update if there are actual changes
      if (Object.keys(updateData).length > 0) {
        await updateDevice(device.id, updateData)
        toast({
          title: 'Success',
          description: 'Device updated successfully.',
        })
      }
      
      onOpenChange(false)
    } catch (error: any) {
      console.error('Failed to update device:', error)
      
      // Handle API validation errors
      try {
        const errorData = JSON.parse(error.message)
        if (typeof errorData === 'object' && !errorData.detail) {
          setErrors(errorData)
        } else {
          toast({
            title: 'Error',
            description: errorData.detail || 'Failed to update device. Please try again.',
            variant: 'destructive',
          })
        }
      } catch {
        toast({
          title: 'Error',
          description: 'Failed to update device. Please try again.',
          variant: 'destructive',
        })
      }
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setErrors({})
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Smart Device</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="serial_number">
              Serial Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="serial_number"
              name="serial_number"
              type="text"
              value={formData.serial_number || ''}
              onChange={handleChange}
              className={errors.serial_number ? 'border-red-500' : ''}
            />
            {errors.serial_number && (
              <p className="text-sm text-red-500 mt-1">
                {errors.serial_number[0]}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="device_type">
              Device Type <span className="text-red-500">*</span>
            </Label>
            <Input
              id="device_type"
              name="device_type"
              type="text"
              value={formData.device_type || ''}
              onChange={handleChange}
              className={errors.device_type ? 'border-red-500' : ''}
            />
            {errors.device_type && (
              <p className="text-sm text-red-500 mt-1">
                {errors.device_type[0]}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="battery_level">Battery Level (%)</Label>
            <Input
              id="battery_level"
              name="battery_level"
              type="number"
              min="0"
              max="100"
              value={formData.battery_level || ''}
              onChange={handleChange}
              className={errors.battery_level ? 'border-red-500' : ''}
            />
            {errors.battery_level && (
              <p className="text-sm text-red-500 mt-1">
                {errors.battery_level[0]}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="is_active"
              name="is_active"
              type="checkbox"
              checked={formData.is_active || false}
              onChange={handleChange}
              className="rounded border-gray-300"
            />
            <Label htmlFor="is_active">Device is active</Label>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Device'}
            </Button>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
