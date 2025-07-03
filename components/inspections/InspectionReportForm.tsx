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
import { CreateInspectionReportRequest, Hive } from '@/types'
import { useInspectionStore } from '@/store/inspection'
import { useHiveStore } from '@/store/hive'
import { useToast } from '@/components/ui/use-toast'

interface InspectionReportFormProps {
  scheduleId?: string
  hiveId?: string
  onSuccess?: () => void
}

export function InspectionReportForm({ scheduleId, hiveId, onSuccess }: InspectionReportFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { createReport } = useInspectionStore()
  const { hives, fetchHives } = useHiveStore()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<CreateInspectionReportRequest>({
    defaultValues: {
      schedule: scheduleId,
      hive: hiveId,
      inspection_date: new Date().toISOString().split('T')[0],
      honey_level: 'Medium',
      colony_health: 'Good',
      brood_pattern: 'Solid',
      queen_present: true,
    }
  })

  useEffect(() => {
    fetchHives()
  }, [fetchHives])

  useEffect(() => {
    if (scheduleId) {
      setValue('schedule', scheduleId)
    }
    if (hiveId) {
      setValue('hive', hiveId)
    }
  }, [scheduleId, hiveId, setValue])

  const onSubmit = async (data: CreateInspectionReportRequest) => {
    setIsLoading(true)
    try {
      await createReport(data)
      toast({
        title: 'Success',
        description: 'Inspection report created successfully',
      })
      reset()
      onSuccess?.()
    } catch (error: any) {
      console.error('Error creating inspection report:', error)
      const errorMessage = error.message ? JSON.parse(error.message) : {}
      toast({
        title: 'Error',
        description: errorMessage.detail || 'Failed to create inspection report',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inspection Report</CardTitle>
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

          {/* Inspection Date */}
          <div className="space-y-2">
            <Label htmlFor="inspection_date">Inspection Date *</Label>
            <Input
              type="date"
              {...register('inspection_date', { required: 'Inspection date is required' })}
            />
            {errors.inspection_date && (
              <p className="text-sm text-red-600">{errors.inspection_date.message}</p>
            )}
          </div>

          {/* Queen Present */}
          <div className="space-y-2">
            <Label>Queen Present</Label>
            <Select
              value={watch('queen_present')?.toString()}
              onValueChange={(value) => setValue('queen_present', value === 'true')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select queen presence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Honey Level */}
          <div className="space-y-2">
            <Label>Honey Level *</Label>
            <Select
              value={watch('honey_level')}
              onValueChange={(value: 'Low' | 'Medium' | 'High') => setValue('honey_level', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select honey level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
            {errors.honey_level && (
              <p className="text-sm text-red-600">Please select honey level</p>
            )}
          </div>

          {/* Colony Health */}
          <div className="space-y-2">
            <Label>Colony Health *</Label>
            <Select
              value={watch('colony_health')}
              onValueChange={(value: 'Poor' | 'Fair' | 'Good' | 'Excellent') => setValue('colony_health', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select colony health" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Poor">Poor</SelectItem>
                <SelectItem value="Fair">Fair</SelectItem>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Excellent">Excellent</SelectItem>
              </SelectContent>
            </Select>
            {errors.colony_health && (
              <p className="text-sm text-red-600">Please select colony health</p>
            )}
          </div>

          {/* Brood Pattern */}
          <div className="space-y-2">
            <Label>Brood Pattern *</Label>
            <Select
              value={watch('brood_pattern')}
              onValueChange={(value: 'Solid' | 'Spotty' | 'None') => setValue('brood_pattern', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select brood pattern" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Solid">Solid</SelectItem>
                <SelectItem value="Spotty">Spotty</SelectItem>
                <SelectItem value="None">None</SelectItem>
              </SelectContent>
            </Select>
            {errors.brood_pattern && (
              <p className="text-sm text-red-600">Please select brood pattern</p>
            )}
          </div>

          {/* Varroa Mite Count */}
          <div className="space-y-2">
            <Label htmlFor="varroa_mite_count">Varroa Mite Count</Label>
            <Input
              type="number"
              min="0"
              {...register('varroa_mite_count', {
                valueAsNumber: true,
                min: { value: 0, message: 'Count must be 0 or greater' }
              })}
            />
            {errors.varroa_mite_count && (
              <p className="text-sm text-red-600">{errors.varroa_mite_count.message}</p>
            )}
          </div>

          {/* Pest Observations */}
          <div className="space-y-2">
            <Label htmlFor="pest_observations">Pest Observations</Label>
            <Textarea
              {...register('pest_observations')}
              placeholder="Describe any pest or disease observations..."
            />
          </div>

          {/* Actions Taken */}
          <div className="space-y-2">
            <Label htmlFor="actions_taken">Actions Taken</Label>
            <Textarea
              {...register('actions_taken')}
              placeholder="Describe any actions performed during inspection..."
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              {...register('notes')}
              placeholder="Additional inspection notes..."
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Creating Report...' : 'Create Inspection Report'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
