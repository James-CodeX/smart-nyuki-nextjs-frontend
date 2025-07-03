'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreateAlertRequest } from '@/types'
import { useProductionStore } from '@/store/production'
import { useHiveStore } from '@/store/hive'
import { useToast } from '@/components/ui/use-toast'

interface AlertFormProps {
  onSuccess?: () => void
}

const alertTypes = [
  { value: 'Temperature', label: 'Temperature Alert' },
  { value: 'Humidity', label: 'Humidity Alert' },
  { value: 'Activity', label: 'Activity Alert' },
  { value: 'Battery', label: 'Battery Alert' },
  { value: 'Health', label: 'Health Alert' },
  { value: 'Security', label: 'Security Alert' },
  { value: 'Maintenance', label: 'Maintenance Required' },
  { value: 'Other', label: 'Other' },
]

const severityLevels = [
  { value: 'Low', label: 'Low', color: 'text-blue-600' },
  { value: 'Medium', label: 'Medium', color: 'text-yellow-600' },
  { value: 'High', label: 'High', color: 'text-orange-600' },
  { value: 'Critical', label: 'Critical', color: 'text-red-600' },
]

export function AlertForm({ onSuccess }: AlertFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { createAlert } = useProductionStore()
  const { hives, fetchHives } = useHiveStore()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<CreateAlertRequest>({
    defaultValues: {
      severity: 'Medium',
    }
  })

  useEffect(() => {
    fetchHives()
  }, [fetchHives])

  const onSubmit = async (data: CreateAlertRequest) => {
    setIsLoading(true)
    try {
      // Parse trigger_values if it's a string
      let processedData = { ...data }
      if (typeof data.trigger_values === 'string' && data.trigger_values.trim()) {
        try {
          processedData.trigger_values = JSON.parse(data.trigger_values)
        } catch (parseError) {
          toast({
            title: 'Error',
            description: 'Invalid JSON format for trigger values',
            variant: 'destructive',
          })
          setIsLoading(false)
          return
        }
      } else if (typeof data.trigger_values === 'string' && !data.trigger_values.trim()) {
        // Remove empty trigger_values
        delete processedData.trigger_values
      }
      
      await createAlert(processedData)
      toast({
        title: 'Success',
        description: 'Alert created successfully',
      })
      reset()
      onSuccess?.()
    } catch (error: any) {
      console.error('Error creating alert:', error)
      const errorMessage = error.message ? JSON.parse(error.message) : {}
      toast({
        title: 'Error',
        description: errorMessage.detail || 'Failed to create alert',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Alert</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Hive Selection */}
          <div className="space-y-2">
            <Label htmlFor="hive">Hive *</Label>
            <Select
              value={watch('hive')}
              onValueChange={(value) => setValue('hive', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a hive" />
              </SelectTrigger>
              <SelectContent>
                {hives.map((hive) => (
                  <SelectItem key={hive.id} value={hive.id}>
                    {hive.name} - {hive.apiary_name || 'Unknown Apiary'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.hive && (
              <p className="text-sm text-red-600">Please select a hive</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Alert Type */}
            <div className="space-y-2">
              <Label htmlFor="alert_type">Alert Type *</Label>
              <Select
                value={watch('alert_type')}
                onValueChange={(value) => setValue('alert_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select alert type" />
                </SelectTrigger>
                <SelectContent>
                  {alertTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.alert_type && (
                <p className="text-sm text-red-600">Please select an alert type</p>
              )}
            </div>

            {/* Severity */}
            <div className="space-y-2">
              <Label htmlFor="severity">Severity *</Label>
              <Select
                value={watch('severity')}
                onValueChange={(value: 'Low' | 'Medium' | 'High' | 'Critical') => setValue('severity', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  {severityLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      <span className={level.color}>{level.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.severity && (
                <p className="text-sm text-red-600">Please select severity level</p>
              )}
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Alert Message *</Label>
            <Textarea
              {...register('message', { required: 'Alert message is required' })}
              placeholder="Describe the alert condition or issue..."
              rows={3}
            />
            {errors.message && (
              <p className="text-sm text-red-600">{errors.message.message}</p>
            )}
          </div>

          {/* Trigger Values (Optional JSON) */}
          <div className="space-y-2">
            <Label htmlFor="trigger_values">Trigger Values (Optional)</Label>
            <Textarea
              {...register('trigger_values')}
              placeholder='Optional JSON data, e.g., {"temperature": 35, "humidity": 80}'
              rows={2}
            />
            <p className="text-xs text-gray-500">
              Enter JSON format data that triggered this alert (optional)
            </p>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Creating Alert...' : 'Create Alert'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
