'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SensorReading, HiveSensorData } from '@/types'
import { apiClient } from '@/lib/api'
import { 
  Thermometer, 
  Droplets, 
  Weight, 
  Volume2, 
  Battery, 
  Clock,
  RefreshCw,
  TrendingUp,
  AlertCircle
} from 'lucide-react'

interface SensorDataHistoryProps {
  hiveId: string
  hiveName: string
  limit?: number
}

export function SensorDataHistory({ hiveId, hiveName, limit = 5 }: SensorDataHistoryProps) {
  const [sensorData, setSensorData] = useState<HiveSensorData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentLimit, setCurrentLimit] = useState(limit)
  const [hasMoreData, setHasMoreData] = useState(true)

  const fetchSensorData = async (loadMore = false) => {
    try {
      if (loadMore) {
        setIsLoadingMore(true)
      } else {
        setIsLoading(true)
        setCurrentLimit(limit)
      }
      setError(null)
      
      const limitToUse = loadMore ? currentLimit + 5 : currentLimit
      const data = await apiClient.getHiveSensorReadings(hiveId, {
        limit: limitToUse,
        ordering: '-timestamp'
      })
      
      setSensorData(data)
      setCurrentLimit(limitToUse)
      
      // Check if there's more data available
      setHasMoreData(data.total_readings > limitToUse)
      
    } catch (err) {
      console.error('Failed to fetch sensor data:', err)
      setError('Failed to load sensor data')
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  useEffect(() => {
    fetchSensorData()
  }, [hiveId, limit])

  const handleLoadMore = () => {
    fetchSensorData(true)
  }

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

  const getStatusBadge = (statusCode?: number) => {
    if (!statusCode) return null
    
    const statusMap: Record<number, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      1: { label: 'Normal', variant: 'default' },
      2: { label: 'Warning', variant: 'secondary' },
      3: { label: 'Critical', variant: 'destructive' },
      0: { label: 'Offline', variant: 'outline' }
    }
    
    const status = statusMap[statusCode] || { label: 'Unknown', variant: 'outline' }
    return <Badge variant={status.variant} className="text-xs">{status.label}</Badge>
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
            Sensor Data History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600 mr-2" />
            <span className="text-muted-foreground">Loading sensor data...</span>
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
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
            Sensor Data History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-red-600">
            <AlertCircle className="h-6 w-6 mr-2" />
            <span>{error}</span>
          </div>
          <div className="text-center mt-4">
            <Button variant="outline" onClick={() => fetchSensorData(false)}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!sensorData || sensorData.readings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
            Sensor Data History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Thermometer className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No sensor data available</p>
            <p className="text-sm text-muted-foreground mt-2">
              Make sure a smart device is assigned to this hive and is actively sending data.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
            Sensor Data History
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => fetchSensorData(false)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          {sensorData.device_count} device(s) • {sensorData.total_readings} total readings
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sensorData.readings.map((reading) => (
            <div key={reading.id} className="border rounded-lg p-4 bg-card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {reading.device_serial}
                  </Badge>
                  {getStatusBadge(reading.status_code)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDateTime(reading.timestamp)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Thermometer className="h-4 w-4 text-red-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Temperature</p>
                    <p className="font-semibold">
                      {formatTemperature(reading.temperature)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Humidity</p>
                    <p className="font-semibold">
                      {formatHumidity(reading.humidity)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Weight className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Weight</p>
                    <p className="font-semibold">
                      {formatWeight(reading.weight)}
                    </p>
                  </div>
                </div>
                
                {reading.battery_level && (
                  <div className="flex items-center space-x-2">
                    <Battery className={`h-4 w-4 ${getBatteryColor(reading.battery_level)}`} />
                    <div>
                      <p className="text-xs text-muted-foreground">Battery</p>
                      <p className={`font-semibold ${getBatteryColor(reading.battery_level)}`}>
                        {reading.battery_level}%
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {reading.sound_level && (
                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-center space-x-2">
                    <Volume2 className="h-4 w-4 text-purple-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Sound Level</p>
                      <p className="font-semibold">{reading.sound_level} dB</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Show More Button and Status */}
        <div className="mt-6 space-y-3">
          {sensorData.total_readings > currentLimit && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Showing {sensorData.readings.length} of {sensorData.total_readings} readings
              </p>
            </div>
          )}
          
          {hasMoreData && (
            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="w-full sm:w-auto"
              >
                {isLoadingMore ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Loading more...
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Show More (Load 5 more)
                  </>
                )}
              </Button>
            </div>
          )}
          
          {!hasMoreData && sensorData.total_readings > limit && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                All {sensorData.total_readings} readings loaded
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
