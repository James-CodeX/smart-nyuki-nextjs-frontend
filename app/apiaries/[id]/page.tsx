'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useApiaryStore } from '@/store/apiary'
import { useHiveStore } from '@/store/hive'
import { useAuthStore } from '@/store/auth'
import { 
  MapPin, 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Plus, 
  Layers, 
  Power,
  PowerOff
} from 'lucide-react'
import Link from 'next/link'
import { Apiary, ApiaryStats } from '@/types'
import { ApiarySmartMetrics } from '@/components/apiary-metrics/apiary-smart-metrics'

export default function ApiaryDetailPage() {
  const params = useParams()
  const { user } = useAuthStore()
  const { 
    fetchApiary, 
    currentApiary, 
    deleteApiary, 
    getApiaryStats, 
    isLoading: apiaryLoading 
  } = useApiaryStore()
  const { 
    hives, 
    fetchHives, 
    deleteHive, 
    activateHive, 
    deactivateHive,
    isLoading: hiveLoading 
  } = useHiveStore()
  
  const [apiary, setApiary] = useState<Apiary | null>(null)
  const [stats, setStats] = useState<ApiaryStats | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    if (params.id && user?.beekeeper_profile) {
      // Fetch apiary details
      fetchApiary(params.id as string).catch(console.error)
      
      // Fetch hives for this apiary
      fetchHives({ apiary: params.id }).catch(console.error)
      
      // Fetch apiary statistics
      getApiaryStats(params.id as string)
        .then(setStats)
        .catch(console.error)
    }
  }, [params.id, user, fetchApiary, fetchHives, getApiaryStats])

  useEffect(() => {
    if (currentApiary && currentApiary.id === params.id) {
      setApiary(currentApiary)
    }
  }, [currentApiary, params.id])

  const handleDeleteApiary = async () => {
    if (!apiary) return
    
    if (confirm('Are you sure you want to delete this apiary? This will also delete all associated hives. This action cannot be undone.')) {
      setActionLoading('delete-apiary')
      try {
        await deleteApiary(apiary.id)
        // Redirect will happen automatically via router in the form
      } catch (error) {
        console.error('Failed to delete apiary:', error)
        alert('Failed to delete apiary. Please try again.')
      } finally {
        setActionLoading(null)
      }
    }
  }

  const handleDeleteHive = async (hiveId: string) => {
    if (confirm('Are you sure you want to delete this hive? This action cannot be undone.')) {
      setActionLoading(hiveId)
      try {
        await deleteHive(hiveId)
        // Refresh hives list
        if (params.id) {
          fetchHives({ apiary: params.id }).catch(console.error)
        }
      } catch (error) {
        console.error('Failed to delete hive:', error)
        alert('Failed to delete hive. Please try again.')
      } finally {
        setActionLoading(null)
      }
    }
  }

  const handleToggleHiveActive = async (hive: any) => {
    setActionLoading(hive.id)
    try {
      if (hive.is_active) {
        await deactivateHive(hive.id)
      } else {
        await activateHive(hive.id)
      }
      // Refresh hives list
      if (params.id) {
        fetchHives({ apiary: params.id }).catch(console.error)
      }
    } catch (error) {
      console.error('Failed to toggle hive status:', error)
      alert('Failed to update hive status. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  const getHiveTypeColor = (type: string) => {
    const colors = {
      'Langstroth': 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
      'Top Bar': 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
      'Warre': 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30',
      'Flow Hive': 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30',
      'Other': 'text-muted-foreground bg-muted'
    }
    return colors[type as keyof typeof colors] || colors['Other']
  }

  if (apiaryLoading || (!apiary && currentApiary === null)) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            Loading apiary...
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!apiary) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            Apiary not found
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      {/* Top Navigation Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <Link href="/apiaries">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Apiaries
            </Button>
          </Link>
          <Link href={`/hives/create?apiary=${apiary.id}`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Hive
            </Button>
          </Link>
        </div>
      </div>

      {/* Apiary Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{apiary.name}</h1>
            <p className="text-muted-foreground mt-2">
              {apiary.description || 'No description provided'}
            </p>
          </div>
          <div className="flex space-x-2">
            <Link href={`/apiaries/${apiary.id}/edit`}>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={handleDeleteApiary}
              disabled={actionLoading === 'delete-apiary'}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Smart Metrics Section */}
      <div className="mb-8">
        <ApiarySmartMetrics 
          apiaryId={apiary.id} 
          apiaryName={apiary.name} 
        />
      </div>

      {/* Hives Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Hives</h2>
            <p className="text-muted-foreground mt-1">
              Manage hives in this apiary
            </p>
          </div>
        </div>

        {hiveLoading ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">Loading hives...</div>
          </div>
        ) : hives.length === 0 ? (
          <div className="text-center py-12">
            <Layers className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium text-foreground">No hives</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Get started by adding your first hive to this apiary.
            </p>
            <div className="mt-6">
              <Link href={`/hives/create?apiary=${apiary.id}`}>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add your first hive
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hives.map((hive) => (
              <Card key={hive.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center">
                      {hive.name}
                      {hive.has_smart_device && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full">
                          Smart
                        </span>
                      )}
                    </CardTitle>
                    <div className="flex space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleHiveActive(hive)}
                        disabled={actionLoading === hive.id}
                        className={hive.is_active ? 'text-green-600' : 'text-red-600'}
                      >
                        {hive.is_active ? <Power className="h-4 w-4" /> : <PowerOff className="h-4 w-4" />}
                      </Button>
                      <Link href={`/hives/${hive.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteHive(hive.id)}
                        disabled={actionLoading === hive.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getHiveTypeColor(hive.hive_type)}`}>
                      {hive.hive_type}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <span className="font-medium mr-2 text-foreground">Status:</span>
                      <span className={hive.is_active ? 'text-green-600' : 'text-red-600'}>
                        {hive.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2 text-foreground">Installed:</span>
                      <span>{new Date(hive.installation_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-border">
                    <Link href={`/hives/${hive.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Apiary Info Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Apiary Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-muted-foreground mr-3" />
                <div>
                  <p className="font-medium text-foreground">Location</p>
                  <p className="text-muted-foreground">
                    {apiary.address || `${apiary.latitude}, ${apiary.longitude}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-5 w-5 text-muted-foreground mr-3 flex items-center justify-center text-sm">
                  🧑‍🚀
                </div>
                <div>
                  <p className="font-medium text-foreground">Beekeeper</p>
                  <p className="text-muted-foreground">
                    {apiary?.beekeeper?.user?.full_name || 'Unknown'} ({apiary?.beekeeper?.experience_level || 'Unknown'})
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-5 w-5 text-muted-foreground mr-3 flex items-center justify-center text-sm">
                  📅
                </div>
                <div>
                  <p className="font-medium text-foreground">Created</p>
                  <p className="text-muted-foreground">
                    {new Date(apiary.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Card */}
        {stats && (
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Hives</span>
                  <span className="font-semibold text-foreground">{stats.total_hives}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Hives</span>
                  <span className="font-semibold text-green-600">{stats.active_hives}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Inactive Hives</span>
                  <span className="font-semibold text-red-600">{stats.inactive_hives}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Smart Hives</span>
                  <span className="font-semibold text-blue-600">{stats.smart_hives}</span>
                </div>
                
                {Object.keys(stats.hive_types).length > 0 && (
                  <div className="pt-4 border-t">
                    <p className="font-medium text-foreground mb-2">Hive Types</p>
                    {Object.entries(stats.hive_types).map(([type, count]) => (
                      <div key={type} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{type}</span>
                        <span className="font-medium text-foreground">{count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
