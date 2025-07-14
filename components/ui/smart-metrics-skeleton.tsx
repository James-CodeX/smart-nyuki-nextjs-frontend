'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Home, 
  Activity, 
  Clock, 
  CalendarDays, 
  BarChart3,
  RefreshCw
} from 'lucide-react'

export function SmartMetricsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header with Smart Status */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Smart Metrics</h2>
          <p className="text-muted-foreground">Real-time data from your smart devices</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            <Skeleton className="h-4 w-16" />
          </Badge>
          <Button variant="outline" size="sm" disabled>
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
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-8 w-12 mx-auto mb-2" />
                <Skeleton className="h-4 w-20 mx-auto" />
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Smart Hive Coverage</span>
              <Skeleton className="h-4 w-8" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Current Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2 text-green-600" />
            Current Environmental Conditions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-20 mb-1" />
                  <Skeleton className="h-6 w-16 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Historical Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 24 Hour Metrics */}
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
                {[...Array(4)].map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t">
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Metrics */}
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
                {[...Array(4)].map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t">
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hive Latest Readings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
            Latest Hive Readings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4 bg-muted/50">
                <div className="flex items-center justify-between mb-3">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="text-center">
                      <Skeleton className="h-4 w-16 mx-auto mb-1" />
                      <Skeleton className="h-5 w-12 mx-auto" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Footer */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-40" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
