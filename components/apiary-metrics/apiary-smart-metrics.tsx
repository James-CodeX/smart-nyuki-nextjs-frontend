'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ApiarySmartMetrics } from '@/types'
import { apiClient } from '@/lib/api'
import { 
  Thermometer, 
  Droplets, 
  Weight, 
  Volume2, 
  Battery,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Home,
  Zap,
  Activity,
  Clock,
  CalendarDays,
  BarChart3
} from 'lucide-react'

interface ApiarySmartMetricsProps {
  apiaryId: string
  apiaryName: string
}

export function ApiarySmartMetrics({ apiaryId, apiaryName }: ApiarySmartMetricsProps) {
  const [metrics, setMetrics] = useState<ApiarySmartMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMetrics = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await apiClient.getApiarySmartMetrics(apiaryId)
      setMetrics(data)
    } catch (err) {
      console.error('Failed to fetch apiary smart metrics:', err)
      setError('Failed to load smart metrics')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
  }, [apiaryId])

  const getSmartStatusColor = (status: string) => {
    switch (status) {
      case 'fully_smart':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'partially_smart':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'not_smart':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'no_hives':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatTemperature = (temp: number) => `${temp.toFixed(1)}°C`
  const formatHumidity = (humidity: number) => `${humidity.toFixed(1)}%`
  const formatWeight = (weight: number) => `${weight.toFixed(2)} kg`
  const formatSoundLevel = (sound: number) => `${sound.toFixed(1)} dB`

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString()
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mr-2" />
          <span className="text-lg text-muted-foreground">Loading smart metrics...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12">
            <div className="flex items-center justify-center text-red-600 mb-4">
              <AlertCircle className="h-8 w-8 mr-2" />
              <span>{error}</span>
            </div>
            <div className="text-center">
              <Button variant="outline" onClick={fetchMetrics}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!metrics) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header with Smart Status */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Smart Metrics</h2>
          <p className="text-muted-foreground">Real-time data from your smart devices</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className={getSmartStatusColor(metrics.smart_status)}>
            {metrics.smart_status_display}
          </Badge>
          <Button variant="outline" size="sm" onClick={fetchMetrics}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Smart Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Home className="h-5 w-5 mr-2 text-blue-600" />
            Hive Status Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{metrics.hive_counts.total_hives}</div>
              <div className="text-sm text-muted-foreground">Total Hives</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{metrics.hive_counts.smart_hives}</div>
              <div className="text-sm text-muted-foreground">Smart Hives</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{metrics.hive_counts.non_smart_hives}</div>
              <div className="text-sm text-muted-foreground">Non-Smart Hives</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{metrics.hive_counts.smart_percentage.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Smart Coverage</div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Smart Hive Coverage</span>
              <span>{metrics.hive_counts.smart_percentage.toFixed(1)}%</span>
            </div>
            <Progress value={metrics.hive_counts.smart_percentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Current Metrics */}
      {metrics.current_metrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-green-600" />
              Current Environmental Conditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center space-x-3">
                <Thermometer className="h-8 w-8 text-red-500" />
                <div>
                  <div className="text-sm text-muted-foreground">Temperature</div>
                  <div className="text-xl font-bold">{formatTemperature(metrics.current_metrics.average_temperature)}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatTemperature(metrics.current_metrics.temperature_range.min)} - {formatTemperature(metrics.current_metrics.temperature_range.max)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Droplets className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="text-sm text-muted-foreground">Humidity</div>
                  <div className="text-xl font-bold">{formatHumidity(metrics.current_metrics.average_humidity)}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatHumidity(metrics.current_metrics.humidity_range.min)} - {formatHumidity(metrics.current_metrics.humidity_range.max)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Weight className="h-8 w-8 text-green-500" />
                <div>
                  <div className="text-sm text-muted-foreground">Total Weight</div>
                  <div className="text-xl font-bold">{formatWeight(metrics.current_metrics.total_weight)}</div>
                  <div className="text-xs text-muted-foreground">
                    Avg: {formatWeight(metrics.current_metrics.average_weight)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Volume2 className="h-8 w-8 text-purple-500" />
                <div>
                  <div className="text-sm text-muted-foreground">Sound Level</div>
                  <div className="text-xl font-bold">{formatSoundLevel(metrics.current_metrics.average_sound_level)}</div>
                  <div className="text-xs text-muted-foreground">Average</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Historical Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 24 Hour Metrics */}
        {metrics.last_24h_metrics && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-orange-600" />
                Last 24 Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Temperature</div>
                    <div className="text-lg font-semibold">{formatTemperature(metrics.last_24h_metrics.average_temperature)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Humidity</div>
                    <div className="text-lg font-semibold">{formatHumidity(metrics.last_24h_metrics.average_humidity)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Total Weight</div>
                    <div className="text-lg font-semibold">{formatWeight(metrics.last_24h_metrics.total_weight)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Sound Level</div>
                    <div className="text-lg font-semibold">{formatSoundLevel(metrics.last_24h_metrics.average_sound_level)}</div>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div className="text-xs text-muted-foreground">
                    {metrics.last_24h_metrics.readings_count} readings
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Weekly Metrics */}
        {metrics.last_week_metrics && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarDays className="h-5 w-5 mr-2 text-purple-600" />
                Last 7 Days
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Temperature</div>
                    <div className="text-lg font-semibold">{formatTemperature(metrics.last_week_metrics.average_temperature)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Humidity</div>
                    <div className="text-lg font-semibold">{formatHumidity(metrics.last_week_metrics.average_humidity)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Total Weight</div>
                    <div className="text-lg font-semibold">{formatWeight(metrics.last_week_metrics.total_weight)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Sound Level</div>
                    <div className="text-lg font-semibold">{formatSoundLevel(metrics.last_week_metrics.average_sound_level)}</div>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div className="text-xs text-muted-foreground">
                    {metrics.last_week_metrics.readings_count} readings
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Hive Latest Readings */}
      {metrics.hive_latest_readings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              Latest Hive Readings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.hive_latest_readings.map((hiveReading) => (
                <div key={hiveReading.hive_id} className="border rounded-lg p-4 bg-muted/50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{hiveReading.hive_name}</h4>
                    <span className="text-sm text-muted-foreground">
                      {formatDateTime(hiveReading.latest_reading.timestamp)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Temperature</div>
                      <div className="font-semibold">{formatTemperature(parseFloat(hiveReading.latest_reading.temperature))}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Humidity</div>
                      <div className="font-semibold">{formatHumidity(parseFloat(hiveReading.latest_reading.humidity))}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Weight</div>
                      <div className="font-semibold">{formatWeight(parseFloat(hiveReading.latest_reading.weight))}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Battery</div>
                      <div className="font-semibold">{hiveReading.latest_reading.battery_level}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Footer */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Total Readings: {metrics.total_readings.toLocaleString()}</span>
            <span>Last Updated: {formatDateTime(metrics.last_updated)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
