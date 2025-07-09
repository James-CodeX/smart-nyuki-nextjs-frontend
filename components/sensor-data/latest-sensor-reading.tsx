'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SensorReading, HiveLatestSensorData } from '@/types'
import { apiClient } from '@/lib/api'
import { 
  Thermometer, 
  Droplets, 
  Weight, 
  Volume2, 
  Battery, 
  Clock,
  RefreshCw,
  Zap,
  AlertCircle
} from 'lucide-react'

interface LatestSensorReadingProps {
  hiveId: string
  hiveName: string
  showRefresh?: boolean
}

export function LatestSensorReading({ hiveId, hiveName, showRefresh = true }: LatestSensorReadingProps) {
  const [latestData, setLatestData] = useState<HiveLatestSensorData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLatestData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await apiClient.getHiveLatestSensorReading(hiveId)
      setLatestData(data)
    } catch (err) {
      console.error('Failed to fetch latest sensor data:', err)
      setError('Failed to load latest sensor data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLatestData()
  }, [hiveId])

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

  const getTimeAgo = (dateTime: string) => {
    const now = new Date()
    const time = new Date(dateTime)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-blue-600" />
            Latest Sensor Reading
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600 mr-2" />
            <span className="text-muted-foreground">Loading latest data...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-blue-600" />
            Latest Sensor Reading
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-red-600">
            <AlertCircle className="h-6 w-6 mr-2" />
            <span>{error}</span>
          </div>
          <div className="text-center mt-4">
            <Button variant="outline" onClick={fetchLatestData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!latestData || !latestData.has_smart_device) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-blue-600" />
            Latest Sensor Reading
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Thermometer className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No smart device assigned</p>
            <p className="text-sm text-muted-foreground mt-2">
              Assign a smart device to this hive to start receiving sensor data.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!latestData.latest_reading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-blue-600" />
            Latest Sensor Reading
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Thermometer className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No sensor data available</p>
            <p className="text-sm text-muted-foreground mt-2">
              Waiting for the smart device to send its first reading...
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const reading = latestData.latest_reading

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-blue-600" />
            Latest Sensor Reading
          </CardTitle>
          <div className="flex items-center space-x-2">
            {getStatusBadge(reading.status_code)}
            {showRefresh && (
              <Button variant="outline" size="sm" onClick={fetchLatestData}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Device: {reading.device_serial} • {getTimeAgo(reading.timestamp)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Environmental Data */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <Thermometer className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Temperature</p>
              <p className="text-2xl font-bold text-foreground">
                {formatTemperature(reading.temperature)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Droplets className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Humidity</p>
              <p className="text-2xl font-bold text-foreground">
                {formatHumidity(reading.humidity)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Weight className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Weight</p>
              <p className="text-2xl font-bold text-foreground">
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
            <span>Last updated: {formatDateTime(reading.timestamp)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
