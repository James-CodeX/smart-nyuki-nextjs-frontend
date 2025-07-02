'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useHiveStore } from '@/store/hive'
import { useAuthStore } from '@/store/auth'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  MapPin,
  Power,
  PowerOff,
  Calendar,
  Layers
} from 'lucide-react'
import Link from 'next/link'
import { Hive } from '@/types'

export default function HiveDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuthStore()
  const { 
    fetchHive, 
    currentHive, 
    deleteHive, 
    activateHive, 
    deactivateHive,
    isLoading 
  } = useHiveStore()
  
  const [hive, setHive] = useState<Hive | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    if (params.id && user?.beekeeper_profile) {
      fetchHive(params.id as string).catch(console.error)
    }
  }, [params.id, user, fetchHive])

  useEffect(() => {
    if (currentHive && currentHive.id === params.id) {
      setHive(currentHive)
    }
  }, [currentHive, params.id])

  const handleDeleteHive = async () => {
    if (!hive) return
    
    if (confirm('Are you sure you want to delete this hive? This action cannot be undone.')) {
      setActionLoading('delete')
      try {
        await deleteHive(hive.id)
        router.push('/hives')
      } catch (error) {
        console.error('Failed to delete hive:', error)
        alert('Failed to delete hive. Please try again.')
      } finally {
        setActionLoading(null)
      }
    }
  }

  const handleToggleActive = async () => {
    if (!hive) return
    
    setActionLoading('toggle')
    try {
      if (hive.is_active) {
        await deactivateHive(hive.id)
      } else {
        await activateHive(hive.id)
      }
      // Refresh hive data
      fetchHive(hive.id).catch(console.error)
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

  if (isLoading || !hive) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="text-gray-500">
            {isLoading ? 'Loading hive...' : 'Hive not found'}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Link href="/hives">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Hives
          </Button>
        </Link>
      </div>

      {/* Hive Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900 mr-4">{hive.name}</h1>
              {hive.has_smart_device && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Smart Device
                </span>
              )}
            </div>
            <div className="flex items-center mt-2">
              <span className={`inline-flex px-3 py-1 text-sm rounded-full ${getHiveTypeColor(hive.hive_type)}`}>
                {hive.hive_type}
              </span>
              <span className={`ml-3 inline-flex px-3 py-1 text-sm rounded-full ${
                hive.is_active 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {hive.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleToggleActive}
              disabled={actionLoading === 'toggle'}
              className={hive.is_active ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
            >
              {hive.is_active ? (
                <>
                  <PowerOff className="mr-2 h-4 w-4" />
                  Deactivate
                </>
              ) : (
                <>
                  <Power className="mr-2 h-4 w-4" />
                  Activate
                </>
              )}
            </Button>
            <Link href={`/hives/${hive.id}/edit`}>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={handleDeleteHive}
              disabled={actionLoading === 'delete'}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Hive Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <Layers className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="font-medium">Hive Type</p>
                  <p className="text-gray-600">{hive.hive_type}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="font-medium">Installation Date</p>
                  <p className="text-gray-600">
                    {new Date(hive.installation_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-5 w-5 text-gray-400 mr-3 flex items-center justify-center text-sm">
                  📡
                </div>
                <div>
                  <p className="font-medium">Smart Device</p>
                  <p className="text-gray-600">
                    {hive.has_smart_device ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-5 w-5 text-gray-400 mr-3 flex items-center justify-center text-sm">
                  ⚡
                </div>
                <div>
                  <p className="font-medium">Status</p>
                  <p className={hive.is_active ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                    {hive.is_active ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-5 w-5 text-gray-400 mr-3 flex items-center justify-center text-sm">
                  📅
                </div>
                <div>
                  <p className="font-medium">Created</p>
                  <p className="text-gray-600">
                    {new Date(hive.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Apiary Information */}
        <Card>
          <CardHeader>
            <CardTitle>Apiary Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="font-medium">Apiary Name</p>
                  <p className="text-gray-600">{hive.apiary.name}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-5 w-5 text-gray-400 mr-3 flex items-center justify-center text-sm">
                  📍
                </div>
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-gray-600">
                    {hive.apiary.address || `${hive.apiary.latitude}, ${hive.apiary.longitude}`}
                  </p>
                </div>
              </div>
              {hive.apiary.description && (
                <div className="flex items-start">
                  <div className="h-5 w-5 text-gray-400 mr-3 flex items-center justify-center text-sm mt-0.5">
                    📝
                  </div>
                  <div>
                    <p className="font-medium">Description</p>
                    <p className="text-gray-600">{hive.apiary.description}</p>
                  </div>
                </div>
              )}
              <div className="pt-4 border-t">
                <Link href={`/apiaries/${hive.apiary.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    View Apiary Details
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Timeline - Placeholder for future features */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Track inspections, treatments, and other hive activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Layers className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p>Activity tracking will be available in future updates</p>
            <p className="text-sm">Stay tuned for inspection logs, treatment records, and more!</p>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
