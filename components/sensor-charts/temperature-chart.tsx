'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SensorReading } from '@/types'
import { apiClient } from '@/lib/api'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts'
import { 
  Thermometer, 
  RefreshCw, 
  AlertCircle,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react'

interface TemperatureChartProps {
  hiveId: string
  hiveName: string
  hours?: number
}

interface ChartDataPoint {
  time: string
  temperature: number
  timestamp: string
  formattedTime: string
}

export function TemperatureChart({ hiveId, hiveName, hours = 24 }: TemperatureChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState(hours)

  const fetchTemperatureData = async (period: number) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await apiClient.getHiveSensorReadings(hiveId, {
        limit: Math.min(period * 6, 100), // Assume 6 readings per hour max
        ordering: '-timestamp'
      })
      
      if (response.readings && response.readings.length > 0) {
        const data = response.readings
          .reverse() // Show chronological order
          .map(reading => ({
            time: new Date(reading.timestamp).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            }),
            temperature: parseFloat(reading.temperature),
            timestamp: reading.timestamp,
            formattedTime: new Date(reading.timestamp).toLocaleString()
          }))
        
        setChartData(data)
      } else {
        setChartData([])
      }
    } catch (err) {
      console.error('Failed to fetch temperature data:', err)
      setError('Failed to load temperature data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTemperatureData(selectedPeriod)
  }, [hiveId, selectedPeriod])

  const getTemperatureStatus = (temp: number) => {
    if (temp < 15) return { status: 'Cold', color: 'text-blue-600', bg: 'bg-blue-100' }
    if (temp < 25) return { status: 'Cool', color: 'text-blue-500', bg: 'bg-blue-50' }
    if (temp < 35) return { status: 'Optimal', color: 'text-green-600', bg: 'bg-green-100' }
    if (temp < 40) return { status: 'Warm', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    return { status: 'Hot', color: 'text-red-600', bg: 'bg-red-100' }
  }

  const getTemperatureTrend = () => {
    if (chartData.length < 2) return null
    
    const recent = chartData.slice(-3)
    const avg = recent.reduce((sum, point) => sum + point.temperature, 0) / recent.length
    const previous = chartData.slice(-6, -3)
    
    if (previous.length === 0) return null
    
    const prevAvg = previous.reduce((sum, point) => sum + point.temperature, 0) / previous.length
    const diff = avg - prevAvg
    
    if (Math.abs(diff) < 0.5) return { trend: 'stable', icon: Minus, color: 'text-gray-500' }
    if (diff > 0) return { trend: 'rising', icon: TrendingUp, color: 'text-red-500' }
    return { trend: 'falling', icon: TrendingDown, color: 'text-blue-500' }
  }

  const getCurrentTemperature = () => {
    if (chartData.length === 0) return null
    return chartData[chartData.length - 1].temperature
  }

  const periodOptions = [
    { value: 6, label: '6 hours' },
    { value: 12, label: '12 hours' },
    { value: 24, label: '24 hours' },
    { value: 48, label: '48 hours' },
    { value: 168, label: '7 days' }
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const status = getTemperatureStatus(payload[0].value)
      
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{data.formattedTime}</p>
          <div className="flex items-center mt-1">
            <Thermometer className="h-4 w-4 text-red-500 mr-1" />
            <span className="font-semibold">{payload[0].value.toFixed(1)}°C</span>
            <Badge variant="outline" className={`ml-2 ${status.color} ${status.bg}`}>
              {status.status}
            </Badge>
          </div>
        </div>
      )
    }
    return null
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Thermometer className="h-5 w-5 mr-2 text-red-500" />
            Temperature Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600 mr-2" />
            <span className="text-muted-foreground">Loading temperature data...</span>
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
            <Thermometer className="h-5 w-5 mr-2 text-red-500" />
            Temperature Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-red-600">
            <AlertCircle className="h-6 w-6 mr-2" />
            <span>{error}</span>
          </div>
          <div className="text-center mt-4">
            <Button variant="outline" onClick={() => fetchTemperatureData(selectedPeriod)}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Thermometer className="h-5 w-5 mr-2 text-red-500" />
            Temperature Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Thermometer className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No temperature data available</p>
            <p className="text-sm text-muted-foreground mt-2">
              Temperature readings will appear here once your smart device starts sending data.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentTemp = getCurrentTemperature()
  const currentStatus = currentTemp ? getTemperatureStatus(currentTemp) : null
  const trend = getTemperatureTrend()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Thermometer className="h-5 w-5 mr-2 text-red-500" />
            Temperature Trends
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => fetchTemperatureData(selectedPeriod)}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Current Temperature and Status */}
        <div className="flex items-center space-x-4 mt-4">
          {currentTemp && currentStatus && (
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">{currentTemp.toFixed(1)}°C</span>
              <Badge variant="outline" className={`${currentStatus.color} ${currentStatus.bg}`}>
                {currentStatus.status}
              </Badge>
            </div>
          )}
          
          {trend && (
            <div className="flex items-center space-x-1">
              <trend.icon className={`h-4 w-4 ${trend.color}`} />
              <span className={`text-sm ${trend.color} capitalize`}>{trend.trend}</span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Period Selection */}
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Period:</span>
          {periodOptions.map(option => (
            <Button
              key={option.value}
              variant={selectedPeriod === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
        
        {/* Temperature Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#e5e5e5' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#e5e5e5' }}
                label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Reference lines for optimal temperature range */}
              <ReferenceLine y={25} stroke="#10b981" strokeDasharray="2 2" opacity={0.5} />
              <ReferenceLine y={35} stroke="#10b981" strokeDasharray="2 2" opacity={0.5} />
              
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, fill: '#ef4444' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Temperature Range Info */}
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Optimal Temperature Range</p>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>25°C - 35°C (Optimal)</span>
            </div>
            <div className="text-muted-foreground">
              Current: {chartData.length} readings over {selectedPeriod} hours
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
