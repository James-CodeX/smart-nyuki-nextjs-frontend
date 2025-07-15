'use client'

import React, { useEffect, useState } from 'react'
import { useProductionStore } from '@/store/production'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertForm } from './AlertForm'
import { ResolveAlertDialog } from './ResolveAlertDialog'
import { Plus, Bell, AlertTriangle, CheckCircle, Clock, AlertCircle, RefreshCw, Play, Activity } from 'lucide-react'
import { Alert, AlertStats } from '@/types'
import { useToast } from '@/components/ui/use-toast'
import moment from 'moment'

export function AlertsPage() {
  const { 
    alerts, 
    fetchAlerts, 
    resolveAlert, 
    isLoading,
    checkAllAlerts,
    fetchAlertStats,
    fetchActiveAlerts,
    scheduleAlertCheck
  } = useProductionStore()
  const [showAlertForm, setShowAlertForm] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [showResolveDialog, setShowResolveDialog] = useState(false)
  const [alertStats, setAlertStats] = useState<AlertStats | null>(null)
  const [isCheckingAlerts, setIsCheckingAlerts] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const { toast } = useToast()

  useEffect(() => {
    const loadData = async () => {
      await fetchAlerts()
    }
    loadData()
  }, []) // Remove dependencies to prevent infinite re-renders

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Low': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Critical': return <AlertTriangle className="h-4 w-4" />
      case 'High': return <AlertCircle className="h-4 w-4" />
      case 'Medium': return <Bell className="h-4 w-4" />
      case 'Low': return <Clock className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const unresolvedAlerts = alerts.filter(alert => !alert.is_resolved)
  const resolvedAlerts = alerts.filter(alert => alert.is_resolved)
  const criticalAlerts = alerts.filter(alert => alert.severity_display === 'Critical' && !alert.is_resolved)

  const handleResolveAlert = async (alertId: string, notes?: string) => {
    try {
      await resolveAlert(alertId, { resolution_notes: notes })
      setShowResolveDialog(false)
      setSelectedAlert(null)
      fetchAlerts()
      toast({
        title: 'Success',
        description: 'Alert resolved successfully',
      })
    } catch (error) {
      console.error('Failed to resolve alert:', error)
      toast({
        title: 'Error',
        description: 'Failed to resolve alert',
        variant: 'destructive',
      })
    }
  }

  const handleCheckAllAlerts = async () => {
    setIsCheckingAlerts(true)
    try {
      const result = await checkAllAlerts()
      toast({
        title: 'Alert Check Complete',
        description: `${result.alerts_created} new alerts created from ${result.hives_checked} hives`,
      })
    } catch (error) {
      console.error('Failed to check alerts:', error)
      toast({
        title: 'Error',
        description: 'Failed to check alerts',
        variant: 'destructive',
      })
    } finally {
      setIsCheckingAlerts(false)
    }
  }

  const handleScheduleCheck = async () => {
    try {
      const result = await scheduleAlertCheck()
      toast({
        title: 'Alert Check Scheduled',
        description: `Alert check scheduled with task ID: ${result.task_id}`,
      })
    } catch (error) {
      console.error('Failed to schedule alert check:', error)
      toast({
        title: 'Error',
        description: 'Failed to schedule alert check',
        variant: 'destructive',
      })
    }
  }

  const loadStats = async () => {
    try {
      const stats = await fetchAlertStats()
      setAlertStats(stats)
    } catch (error) {
      console.error('Failed to load alert stats:', error)
    }
  }

  useEffect(() => {
    loadStats()
  }, [alerts.length])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="text-muted-foreground">Loading alerts...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Alerts</p>
                <p className="text-2xl font-bold text-foreground">{alerts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unresolved</p>
                <p className="text-2xl font-bold text-foreground">{unresolvedAlerts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-foreground">{criticalAlerts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold text-foreground">{resolvedAlerts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header with Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={handleCheckAllAlerts}
            disabled={isCheckingAlerts}
          >
            {isCheckingAlerts ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            Check All Alerts
          </Button>
          <Button
            variant="outline"
            onClick={handleScheduleCheck}
          >
            <Activity className="h-4 w-4 mr-2" />
            Schedule Check
          </Button>
          <Button
            variant="outline"
            onClick={loadStats}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Stats
          </Button>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => fetchAlerts()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={showAlertForm} onOpenChange={setShowAlertForm}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Alert
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Alert</DialogTitle>
              </DialogHeader>
              <AlertForm
                onSuccess={() => {
                  setShowAlertForm(false)
                  fetchAlerts()
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Unresolved Alerts */}
      {unresolvedAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
              Unresolved Alerts ({unresolvedAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {unresolvedAlerts.map((alert) => (
                <div key={alert.id} className="border rounded-lg p-4 border-destructive/20 bg-destructive/10">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-foreground">{alert.hive_name}</h3>
                        <Badge variant="outline">{alert.apiary_name}</Badge>
                        <Badge className={`${getSeverityColor(alert.severity_display)} flex items-center`}>
                          {getSeverityIcon(alert.severity_display)}
                          <span className="ml-1">{alert.severity_display}</span>
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Type:</span> {alert.alert_type_display}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">Message:</span> {alert.message}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {moment(alert.created_at).format('MMM DD, YYYY [at] h:mm A')}
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedAlert(alert)
                        setShowResolveDialog(true)
                      }}
                      className="ml-4"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Resolve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>All Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No alerts yet</p>
              <Button
                variant="outline"
                onClick={() => setShowAlertForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Alert
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`border rounded-lg p-4 ${
                    alert.is_resolved ? 'bg-muted/50' : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-foreground">{alert.hive_name}</h3>
                        <Badge variant="outline">{alert.apiary_name}</Badge>
                        <Badge className={`${getSeverityColor(alert.severity_display)} flex items-center`}>
                          {getSeverityIcon(alert.severity_display)}
                          <span className="ml-1">{alert.severity_display}</span>
                        </Badge>
                        {alert.is_resolved && (
                          <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Resolved
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Type:</span> {alert.alert_type_display}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">Message:</span> {alert.message}
                        </div>
                        {alert.resolution_notes && (
                          <div className="text-sm text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 p-2 rounded border border-green-200 dark:border-green-800">
                            <span className="font-medium">Resolution:</span> {alert.resolution_notes}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 inline mr-1" />
                          Created: {moment(alert.created_at).format('MMM DD, YYYY [at] h:mm A')}
                          {alert.resolved_at && (
                            <span className="ml-4">
                              • Resolved: {moment(alert.resolved_at).format('MMM DD, YYYY [at] h:mm A')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {!alert.is_resolved && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedAlert(alert)
                          setShowResolveDialog(true)
                        }}
                        className="ml-4"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resolve Alert Dialog */}
      <ResolveAlertDialog
        alert={selectedAlert}
        open={showResolveDialog}
        onClose={() => {
          setShowResolveDialog(false)
          setSelectedAlert(null)
        }}
        onResolve={handleResolveAlert}
      />
    </div>
  )
}
