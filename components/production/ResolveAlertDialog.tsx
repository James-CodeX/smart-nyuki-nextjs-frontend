'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CheckCircle, AlertTriangle, Clock } from 'lucide-react'
import { Alert } from '@/types'
import moment from 'moment'

interface ResolveAlertDialogProps {
  alert: Alert | null
  open: boolean
  onClose: () => void
  onResolve: (alertId: string, notes?: string) => Promise<void>
}

interface ResolveFormData {
  resolution_notes?: string
}

export function ResolveAlertDialog({ alert, open, onClose, onResolve }: ResolveAlertDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ResolveFormData>()

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Low': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const onSubmit = async (data: ResolveFormData) => {
    if (!alert) return

    setIsLoading(true)
    try {
      await onResolve(alert.id, data.resolution_notes)
      reset()
      onClose()
    } catch (error) {
      console.error('Failed to resolve alert:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  if (!alert) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
            Resolve Alert
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Alert Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <h3 className="font-medium text-gray-900">{alert.hive?.name || 'Unknown Hive'}</h3>
              <Badge variant="outline">{alert.hive?.apiary?.name || 'Unknown Apiary'}</Badge>
              <Badge className={`${getSeverityColor(alert.severity)} flex items-center`}>
                <AlertTriangle className="h-3 w-3 mr-1" />
                {alert.severity}
              </Badge>
            </div>
            
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Type:</span> {alert.alert_type_display}
              </div>
              <div>
                <span className="font-medium">Message:</span> {alert.message}
              </div>
              <div className="text-gray-500">
                <Clock className="h-3 w-3 inline mr-1" />
                Created: {moment(alert.created_at).format('MMM DD, YYYY [at] h:mm A')}
              </div>
              {alert.trigger_values && (
                <div className="bg-gray-100 p-2 rounded text-xs">
                  <span className="font-medium">Trigger Values:</span>
                  <pre className="mt-1">{JSON.stringify(alert.trigger_values, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>

          {/* Resolution Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resolution_notes">Resolution Notes</Label>
              <Textarea
                {...register('resolution_notes')}
                placeholder="Describe how this alert was resolved or what actions were taken..."
                rows={4}
              />
              <p className="text-xs text-gray-500">
                Optional: Add notes about how you resolved this alert for future reference
              </p>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Resolving...' : 'Mark as Resolved'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
