'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/store/auth'
import { useHiveStore } from '@/store/hive'
import { apiClient } from '@/lib/api'
import { SensorReading } from '@/types'
import { 
  Thermometer, 
  Droplets, 
  Weight, 
  Volume2, 
  Battery, 
  Clock,
  RefreshCw,
  AlertCircle,
  Filter,
  Download
} from 'lucide-react'
import { CreateBeekeeperProfileDialog } from '@/components/dialogs/create-beekeeper-profile-dialog'

export default function SensorDataPage() {
  const { user } = useAuthStore()
  const { hives, fetchHives } = useHiveStore()
  const [sensorReadings, setSensorReadings] = useState<SensorReading[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user?.beekeeper_profile) {
      fetchHives().catch(console.error)
      fetchSensorReadings()
    }
  }, [user, fetchHives])

  const fetchSensorReadings = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await apiClient.getSensorReadings({
        limit: 50,
        ordering: '-timestamp'
      })
      setSensorReadings(response.results)
    } catch (err) {
      console.error('Failed to fetch sensor readings:', err)
      setError('Failed to load sensor data')
    } finally {
      setIsLoading(false)
    }
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

  const smartHives = hives.filter(hive => hive.has_smart_device)

  if (!user?.beekeeper_profile) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <Thermometer className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-foreground">No beekeeper profile</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            You need to create a beekeeper profile before viewing sensor data.
          </p>
          <div className="mt-6">
            <CreateBeekeeperProfileDialog>
              <Button>
                Create Beekeeper Profile
              </Button>
            </CreateBeekeeperProfileDialog>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Sensor Data</h1>
            <p className="text-muted-foreground mt-2">
              Monitor environmental conditions from your smart-nyuki devices
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={fetchSensorReadings}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Thermometer className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Smart Hives</p>
                  <p className="text-2xl font-bold text-foreground">{smartHives.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="h-3 w-3 bg-green-600 rounded-full"></div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Active Devices</p>
                  <p className="text-2xl font-bold text-foreground">{smartHives.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Readings</p>
                  <p className="text-2xl font-bold text-foreground">{sensorReadings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <RefreshCw className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Last 24h</p>
                  <p className="text-2xl font-bold text-foreground">
                    {sensorReadings.filter(reading => {
                      const readingTime = new Date(reading.timestamp)
                      const now = new Date()
                      const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
                      return readingTime >= dayAgo
                    }).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sensor Readings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Thermometer className="h-5 w-5 mr-2 text-blue-600" />
              Recent Sensor Readings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-blue-600 mr-2" />
                <span className="text-muted-foreground">Loading sensor data...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 mb-4">{error}</p>
                <Button variant="outline" onClick={fetchSensorReadings}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            ) : sensorReadings.length === 0 ? (
              <div className="text-center py-8">
                <Thermometer className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No sensor data available</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Make sure your smart devices are connected and sending data.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sensorReadings.map((reading) => (
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
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
