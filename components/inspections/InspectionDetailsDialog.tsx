'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  MapPin, 
  User, 
  Heart, 
  Bug, 
  Crown, 
  ClipboardList,
  Layers,
  CheckCircle
} from 'lucide-react'
import { InspectionReport } from '@/types'
import moment from 'moment'

interface InspectionDetailsDialogProps {
  report: InspectionReport | null
  open: boolean
  onClose: () => void
}

export function InspectionDetailsDialog({ report, open, onClose }: InspectionDetailsDialogProps) {
  if (!report) return null

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'Excellent': return 'bg-green-600'
      case 'Good': return 'bg-green-500'
      case 'Fair': return 'bg-yellow-500'
      case 'Poor': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getHoneyColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-amber-600'
      case 'Medium': return 'bg-amber-500'
      case 'Low': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  const getBroodColor = (pattern: string) => {
    switch (pattern) {
      case 'Solid': return 'bg-green-600'
      case 'Spotty': return 'bg-yellow-500'
      case 'None': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Inspection Report Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Inspection Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">Hive & Location</p>
                      <p className="text-gray-600">{report.hive.name}</p>
                      <p className="text-sm text-gray-500">{report.hive.apiary.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">Inspection Date</p>
                      <p className="text-gray-600">
                        {moment(report.inspection_date).format('MMMM Do, YYYY')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">Inspector</p>
                      <p className="text-gray-600">{report.inspector.full_name}</p>
                      <p className="text-sm text-gray-500">{report.inspector.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <ClipboardList className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">Report Created</p>
                      <p className="text-gray-600">
                        {moment(report.created_at).format('MMMM Do, YYYY [at] h:mm A')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Indicators */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                Health Indicators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <Badge className={`${getHealthColor(report.colony_health)} text-white mb-2`}>
                    {report.colony_health_display}
                  </Badge>
                  <p className="text-sm text-gray-600">Colony Health</p>
                </div>
                <div className="text-center">
                  <Badge className={`${getHoneyColor(report.honey_level)} text-white mb-2`}>
                    {report.honey_level_display}
                  </Badge>
                  <p className="text-sm text-gray-600">Honey Level</p>
                </div>
                <div className="text-center">
                  <Badge className={`${getBroodColor(report.brood_pattern)} text-white mb-2`}>
                    {report.brood_pattern_display}
                  </Badge>
                  <p className="text-sm text-gray-600">Brood Pattern</p>
                </div>
                <div className="text-center">
                  <Badge variant={report.queen_present ? "default" : "destructive"} className="mb-2">
                    <Crown className="h-3 w-3 mr-1" />
                    {report.queen_present === true ? 'Present' : report.queen_present === false ? 'Not Present' : 'Unknown'}
                  </Badge>
                  <p className="text-sm text-gray-600">Queen Status</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Observations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pest Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bug className="h-5 w-5 mr-2" />
                  Pest & Mite Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {report.varroa_mite_count !== undefined && report.varroa_mite_count !== null && (
                    <div>
                      <p className="font-medium text-sm">Varroa Mite Count</p>
                      <div className="flex items-center mt-1">
                        <Badge variant={report.varroa_mite_count === 0 ? "default" : report.varroa_mite_count > 5 ? "destructive" : "secondary"}>
                          {report.varroa_mite_count} mites
                        </Badge>
                      </div>
                    </div>
                  )}
                  
                  {report.pest_observations && (
                    <div>
                      <p className="font-medium text-sm">Pest Observations</p>
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{report.pest_observations}</p>
                      </div>
                    </div>
                  )}
                  
                  {!report.pest_observations && (report.varroa_mite_count === undefined || report.varroa_mite_count === null) && (
                    <p className="text-sm text-gray-500 italic">No pest information recorded</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions Taken */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Layers className="h-5 w-5 mr-2" />
                  Actions & Maintenance
                </CardTitle>
              </CardHeader>
              <CardContent>
                {report.actions_taken ? (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700">{report.actions_taken}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No actions recorded</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Additional Notes */}
          {report.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                  <p className="text-gray-700">{report.notes}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Schedule Information */}
          {report.schedule && (
            <Card>
              <CardHeader>
                <CardTitle>Schedule Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      This inspection was completed for a scheduled inspection on{' '}
                      <span className="font-medium">
                        {moment(report.schedule.scheduled_date).format('MMMM Do, YYYY')}
                      </span>
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Schedule Completed
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
