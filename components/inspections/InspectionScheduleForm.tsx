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
import { CreateInspectionScheduleRequest } from '@/types'
import { useInspectionStore } from '@/store/inspection'
import { useHiveStore } from '@/store/hive'
import { useToast } from '@/components/ui/use-toast'

interface InspectionScheduleFormProps {
  hiveId?: string
  selectedDate?: string
  onSuccess?: () => void
}

export function InspectionScheduleForm({ hiveId, selectedDate, onSuccess }: InspectionScheduleFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { createSchedule } = useInspectionStore()
  const { hives, fetchHives } = useHiveStore()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<CreateInspectionScheduleRequest>({
    defaultValues: {
      hive: hiveId,
      scheduled_date: selectedDate || new Date().toISOString().split('T')[0],
    }
  })

  useEffect(() => {
    fetchHives()
  }, [fetchHives])

  useEffect(() => {
    if (hiveId) {
      setValue('hive', hiveId)
    }
    if (selectedDate) {
      setValue('scheduled_date', selectedDate)
    }
  }, [hiveId, selectedDate, setValue])

  const onSubmit = async (data: CreateInspectionScheduleRequest) => {
    setIsLoading(true)
    try {
      await createSchedule(data)
      toast({
        title: 'Success',
        description: 'Inspection scheduled successfully',
      })
      reset()
      onSuccess?.()
    } catch (error: any) {
      console.error('Error scheduling inspection:', error)
      const errorMessage = error.message ? JSON.parse(error.message) : {}
      toast({
        title: 'Error',
        description: errorMessage.detail || 'Failed to schedule inspection',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule Inspection</CardTitle>
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
                    {hive.name} - {hive.apiary.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.hive && (
              <p className="text-sm text-red-600">Please select a hive</p>
            )}
          </div>

          {/* Scheduled Date */}
          <div className="space-y-2">
            <Label htmlFor="scheduled_date">Scheduled Date *</Label>
            <Input
              type="date"
              {...register('scheduled_date', { required: 'Scheduled date is required' })}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.scheduled_date && (
              <p className="text-sm text-red-600">{errors.scheduled_date.message}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              {...register('notes')}
              placeholder="Add any notes or instructions for this inspection..."
            />
          </div>

          {/* Weather Conditions */}
          <div className="space-y-2">
            <Label htmlFor="weather_conditions">Expected Weather Conditions</Label>
            <Input
              {...register('weather_conditions')}
              placeholder="e.g., Sunny, 22°C"
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Scheduling...' : 'Schedule Inspection'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
