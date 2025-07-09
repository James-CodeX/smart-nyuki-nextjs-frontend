'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SensorReading } from '@/types'
import { 
  Thermometer, 
  Droplets, 
  Weight, 
  Volume2, 
  Battery, 
  Clock,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react'

interface SensorDataCardProps {
  reading: SensorReading
  showDeviceInfo?: boolean
}

export function SensorDataCard({ reading, showDeviceInfo = false }: SensorDataCardProps) {
  const formatTemperature = (temp: string) => {
    const value = parseFloat(temp)
    return `${value.toFixed(1)}°C`
  }

  const formatHumidity = (humidity: string) => {
    const value = parseFloat(humidity)
    return `${value.toFixed(1)}%`
  }

  const formatWeight = (weight: string) => {
    const value = parseFloat(weight)
    return `${value.toFixed(2)} kg`
  }

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString()
  }

  const getBatteryColor = (level?: number) => {
    if (!level) return 'text-gray-500'
    if (level > 60) return 'text-green-600'
    if (level > 30) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getBatteryIcon = (level?: number) => {
    if (!level) return <Battery className="h-4 w-4" />
    if (level > 60) return <Battery className="h-4 w-4 text-green-600" />
    if (level > 30) return <Battery className="h-4 w-4 text-yellow-600" />
    return <Battery className="h-4 w-4 text-red-600" />
  }

  const getStatusBadge = (statusCode?: number) => {
    if (!statusCode) return null
    
    const statusMap: Record<number, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      1: { label: 'Normal', variant: 'default' },
      2: { label: 'Warning', variant: 'secondary' },
      3: { label: 'Critical', variant: 'destructive' },
      0: { label: 'Offline', variant: 'outline' }
    }
    
    const status = statusMap[statusCode] || { label: 'Unknown', variant: 'outline' }
    return <Badge variant={status.variant}>{status.label}</Badge>
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Thermometer className="h-5 w-5 mr-2 text-blue-600" />
            Sensor Reading
          </CardTitle>
          {reading.status_code && getStatusBadge(reading.status_code)}
        </div>
        {showDeviceInfo && (
          <div className="text-sm text-muted-foreground">
            Device: {reading.device_serial}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Environmental Data */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <Thermometer className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Temperature</p>
              <p className="text-xl font-bold text-foreground">
                {formatTemperature(reading.temperature)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Droplets className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Humidity</p>
              <p className="text-xl font-bold text-foreground">
                {formatHumidity(reading.humidity)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Weight className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Weight</p>
              <p className="text-xl font-bold text-foreground">
                {formatWeight(reading.weight)}
              </p>
            </div>
          </div>
        </div>

        {/* Secondary Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          {reading.sound_level && (
            <div className="flex items-center space-x-3">
              <Volume2 className="h-6 w-6 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sound Level</p>
                <p className="text-lg font-semibold text-foreground">
                  {reading.sound_level} dB
                </p>
              </div>
            </div>
          )}
          
          {reading.battery_level && (
            <div className="flex items-center space-x-3">
              {getBatteryIcon(reading.battery_level)}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Battery</p>
                <p className={`text-lg font-semibold ${getBatteryColor(reading.battery_level)}`}>
                  {reading.battery_level}%
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div className="pt-4 border-t">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Recorded: {formatDateTime(reading.timestamp)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
