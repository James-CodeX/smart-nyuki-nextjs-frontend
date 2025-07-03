'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useHiveStore } from '@/store/hive'
import { useApiaryStore } from '@/store/apiary'
import { useAuthStore } from '@/store/auth'
import { Plus, Layers, Edit, Trash2, MapPin, Power, PowerOff } from 'lucide-react'
import Link from 'next/link'
import { CreateBeekeeperProfileDialog } from '@/components/dialogs/create-beekeeper-profile-dialog'

export default function HivesPage() {
  const { user } = useAuthStore()
  const { hives, isLoading, fetchHives, deleteHive, activateHive, deactivateHive } = useHiveStore()
  const { apiaries, fetchApiaries } = useApiaryStore()
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    if (user?.beekeeper_profile) {
      fetchHives().catch(console.error)
      fetchApiaries().catch(console.error)
    }
  }, [user, fetchHives, fetchApiaries])

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this hive? This action cannot be undone.')) {
      setActionLoading(id)
      try {
        await deleteHive(id)
      } catch (error) {
        console.error('Failed to delete hive:', error)
        alert('Failed to delete hive. Please try again.')
      } finally {
        setActionLoading(null)
      }
    }
  }

  const handleToggleActive = async (hive: any) => {
    setActionLoading(hive.id)
    try {
      if (hive.is_active) {
        await deactivateHive(hive.id)
      } else {
        await activateHive(hive.id)
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
      'Langstroth': 'text-blue-600 bg-blue-100',
      'Top Bar': 'text-green-600 bg-green-100',
      'Warre': 'text-purple-600 bg-purple-100',
      'Flow Hive': 'text-amber-600 bg-amber-100',
      'Other': 'text-gray-600 bg-gray-100'
    }
    return colors[type as keyof typeof colors] || colors['Other']
  }

  if (!user?.beekeeper_profile) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <Layers className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-foreground">No beekeeper profile</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            You need to create a beekeeper profile before managing hives.
          </p>
          <div className="mt-6">
            <CreateBeekeeperProfileDialog>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
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
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Hives</h1>
            <p className="text-muted-foreground mt-2">
              Manage all your hives across different apiaries.
            </p>
          </div>
          {apiaries.length > 0 ? (
            <Link href="/hives/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Hive
              </Button>
            </Link>
          ) : (
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-2">Create an apiary first</p>
              <Link href="/apiaries/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Apiary
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground">Loading hives...</div>
        </div>
      ) : hives.length === 0 ? (
        <div className="text-center py-12">
          <Layers className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-foreground">No hives</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {apiaries.length === 0 
              ? "Create your first apiary to start adding hives."
              : "Get started by adding your first hive."
            }
          </p>
          <div className="mt-6">
            {apiaries.length === 0 ? (
              <Link href="/apiaries/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create your first apiary
                </Button>
              </Link>
            ) : (
              <Link href="/hives/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add your first hive
                </Button>
              </Link>
            )}
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
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        Smart
                      </span>
                    )}
                  </CardTitle>
                  <div className="flex space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(hive)}
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
                      onClick={() => handleDelete(hive.id)}
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
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{hive.apiary.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Status:</span>
                    <span className={hive.is_active ? 'text-green-600' : 'text-red-600'}>
                      {hive.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Installed:</span>
                    <span>{new Date(hive.installation_date).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
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

      {/* Statistics */}
      {hives.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Layers className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Hives</p>
                  <p className="text-2xl font-bold text-foreground">{hives.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Power className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Active Hives</p>
                  <p className="text-2xl font-bold text-foreground">
                    {hives.filter(hive => hive.is_active).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 text-blue-600 flex items-center justify-center text-lg">📡</div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Smart Hives</p>
                  <p className="text-2xl font-bold text-foreground">
                    {hives.filter(hive => hive.has_smart_device).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-amber-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Locations</p>
                  <p className="text-2xl font-bold text-foreground">
                    {new Set(hives.map(hive => hive.apiary.id)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  )
}
