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
  ResponsiveContainer
} from 'recharts'
import { 
  Weight, 
  RefreshCw, 
  AlertCircle,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react'

interface WeightChartProps {
  hiveId: string
  hiveName: string
  hours?: number
}

interface ChartDataPoint {
  time: string
  weight: number
  timestamp: string
  formattedTime: string
}

export function WeightChart({ hiveId, hiveName, hours = 24 }: WeightChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState(hours)

  const fetchWeightData = async (period: number) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await apiClient.getHiveSensorReadings(hiveId, {
        limit: Math.min(period * 6, 100),
        ordering: '-timestamp'
      })
      
      if (response.readings && response.readings.length > 0) {
        const data = response.readings
          .reverse()
          .map(reading => ({
            time: new Date(reading.timestamp).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            }),
            weight: parseFloat(reading.weight),
            timestamp: reading.timestamp,
            formattedTime: new Date(reading.timestamp).toLocaleString()
          }))
        
        setChartData(data)
      } else {
        setChartData([])
      }
    } catch (err) {
      console.error('Failed to fetch weight data:', err)
      setError('Failed to load weight data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWeightData(selectedPeriod)
  }, [hiveId, selectedPeriod])

  const getWeightStatus = (weight: number) => {
    if (weight < 10) return { status: 'Very Light', color: 'text-red-600', bg: 'bg-red-100' }
    if (weight < 20) return { status: 'Light', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    if (weight < 40) return { status: 'Normal', color: 'text-green-600', bg: 'bg-green-100' }
    if (weight < 60) return { status: 'Heavy', color: 'text-blue-600', bg: 'bg-blue-100' }
    return { status: 'Very Heavy', color: 'text-purple-600', bg: 'bg-purple-100' }
  }

  const getWeightTrend = () => {
    if (chartData.length < 2) return null
    
    const recent = chartData.slice(-3)
    const avg = recent.reduce((sum, point) => sum + point.weight, 0) / recent.length
    const previous = chartData.slice(-6, -3)
    
    if (previous.length === 0) return null
    
    const prevAvg = previous.reduce((sum, point) => sum + point.weight, 0) / previous.length
    const diff = avg - prevAvg
    
    if (Math.abs(diff) < 0.5) return { trend: 'stable', icon: Minus, color: 'text-gray-500' }
    if (diff > 0) return { trend: 'increasing', icon: TrendingUp, color: 'text-green-500' }
    return { trend: 'decreasing', icon: TrendingDown, color: 'text-red-500' }
  }

  const getCurrentWeight = () => {
    if (chartData.length === 0) return null
    return chartData[chartData.length - 1].weight
  }

  const getWeightChange = () => {
    if (chartData.length < 2) return null
    
    const current = chartData[chartData.length - 1].weight
    const previous = chartData[0].weight
    const change = current - previous
    
    return {
      absolute: Math.abs(change),
      percentage: ((change / previous) * 100),
      direction: change > 0 ? 'increase' : change < 0 ? 'decrease' : 'stable'
    }
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
      const status = getWeightStatus(payload[0].value)
      
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{data.formattedTime}</p>
          <div className="flex items-center mt-1">
            <Weight className="h-4 w-4 text-green-500 mr-1" />
            <span className="font-semibold">{payload[0].value.toFixed(2)} kg</span>
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
            <Weight className="h-5 w-5 mr-2 text-green-500" />
            Weight Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600 mr-2" />
            <span className="text-muted-foreground">Loading weight data...</span>
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
            <Weight className="h-5 w-5 mr-2 text-green-500" />
            Weight Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-red-600">
            <AlertCircle className="h-6 w-6 mr-2" />
            <span>{error}</span>
          </div>
          <div className="text-center mt-4">
            <Button variant="outline" onClick={() => fetchWeightData(selectedPeriod)}>
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
            <Weight className="h-5 w-5 mr-2 text-green-500" />
            Weight Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Weight className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No weight data available</p>
            <p className="text-sm text-muted-foreground mt-2">
              Weight measurements will appear here once your smart device starts sending data.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentWeight = getCurrentWeight()
  const currentStatus = currentWeight ? getWeightStatus(currentWeight) : null
  const trend = getWeightTrend()
  const weightChange = getWeightChange()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Weight className="h-5 w-5 mr-2 text-green-500" />
            Weight Trends
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => fetchWeightData(selectedPeriod)}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Current Weight and Status */}
        <div className="flex items-center space-x-6 mt-4">
          {currentWeight && currentStatus && (
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">{currentWeight.toFixed(2)} kg</span>
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
          
          {weightChange && weightChange.direction !== 'stable' && (
            <div className="flex items-center space-x-1">
              <span className="text-sm text-muted-foreground">
                {weightChange.direction === 'increase' ? '+' : '-'}{weightChange.absolute.toFixed(2)} kg
              </span>
              <span className="text-xs text-muted-foreground">
                ({weightChange.percentage > 0 ? '+' : ''}{weightChange.percentage.toFixed(1)}%)
              </span>
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
        
        {/* Weight Chart */}
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
                label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ fill: '#22c55e', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, fill: '#22c55e' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Weight Info */}
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Weight Analysis</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Min:</span> {Math.min(...chartData.map(d => d.weight)).toFixed(2)} kg
            </div>
            <div>
              <span className="font-medium">Max:</span> {Math.max(...chartData.map(d => d.weight)).toFixed(2)} kg
            </div>
            <div>
              <span className="font-medium">Average:</span> {(chartData.reduce((sum, d) => sum + d.weight, 0) / chartData.length).toFixed(2)} kg
            </div>
            <div className="text-muted-foreground">
              {chartData.length} readings over {selectedPeriod} hours
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
