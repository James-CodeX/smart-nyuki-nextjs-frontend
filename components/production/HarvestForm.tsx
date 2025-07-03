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
import { CreateHarvestRequest } from '@/types'
import { useProductionStore } from '@/store/production'
import { useHiveStore } from '@/store/hive'
import { useToast } from '@/components/ui/use-toast'

interface HarvestFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function HarvestForm({ onSuccess, onCancel }: HarvestFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { createHarvest } = useProductionStore()
  const { hives, fetchHives } = useHiveStore()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<CreateHarvestRequest>({
    defaultValues: {
      harvest_date: new Date().toISOString().split('T')[0],
      honey_kg: 0,
    }
  })

  useEffect(() => {
    fetchHives()
  }, [fetchHives])

  const onSubmit = async (data: CreateHarvestRequest) => {
    setIsLoading(true)
    try {
      await createHarvest(data)
      toast({
        title: 'Success',
        description: 'Harvest record created successfully',
      })
      reset()
      onSuccess?.()
    } catch (error: any) {
      console.error('Error creating harvest:', error)
      const errorMessage = error.message ? JSON.parse(error.message) : {}
      toast({
        title: 'Error',
        description: errorMessage.detail || 'Failed to create harvest record',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Harvest</CardTitle>
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

          {/* Harvest Date */}
          <div className="space-y-2">
            <Label htmlFor="harvest_date">Harvest Date *</Label>
            <Input
              type="date"
              {...register('harvest_date', { required: 'Harvest date is required' })}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.harvest_date && (
              <p className="text-sm text-red-600">{errors.harvest_date.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Honey Amount */}
            <div className="space-y-2">
              <Label htmlFor="honey_kg">Honey (kg) *</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                {...register('honey_kg', {
                  required: 'Honey amount is required',
                  valueAsNumber: true,
                  min: { value: 0, message: 'Amount must be positive' }
                })}
              />
              {errors.honey_kg && (
                <p className="text-sm text-red-600">{errors.honey_kg.message}</p>
              )}
            </div>

            {/* Wax Amount */}
            <div className="space-y-2">
              <Label htmlFor="wax_kg">Wax (kg)</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                {...register('wax_kg', {
                  valueAsNumber: true,
                  min: { value: 0, message: 'Amount must be positive' }
                })}
              />
              {errors.wax_kg && (
                <p className="text-sm text-red-600">{errors.wax_kg.message}</p>
              )}
            </div>

            {/* Pollen Amount */}
            <div className="space-y-2">
              <Label htmlFor="pollen_kg">Pollen (kg)</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                {...register('pollen_kg', {
                  valueAsNumber: true,
                  min: { value: 0, message: 'Amount must be positive' }
                })}
              />
              {errors.pollen_kg && (
                <p className="text-sm text-red-600">{errors.pollen_kg.message}</p>
              )}
            </div>
          </div>

          {/* Processing Method */}
          <div className="space-y-2">
            <Label htmlFor="processing_method">Processing Method</Label>
            <Input
              {...register('processing_method')}
              placeholder="e.g., Cold extraction, Heat extraction, Raw"
            />
          </div>

          {/* Quality Notes */}
          <div className="space-y-2">
            <Label htmlFor="quality_notes">Quality Notes</Label>
            <Textarea
              {...register('quality_notes')}
              placeholder="Notes about harvest quality, conditions, observations..."
              rows={3}
            />
          </div>

          <div className="flex gap-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Recording Harvest...' : 'Record Harvest'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
